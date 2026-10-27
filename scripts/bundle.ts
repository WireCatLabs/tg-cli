/**
 * The published `tg` starts from a bundle: importing about 1,100 module files was most of a start, and a third of
 * its CPU went to resolving their imports. `pnpm build` runs this after `tsc`; the bundle is built from `dist/`, so
 * it holds exactly what the tests' build holds.
 *
 * - `dist/bundle/` holds the bundle. Its chunks keep every lazy `import()` lazy: the program, the Bot API group,
 *   the store drivers.
 * - `dist/bin/tg.js`, the path npm links and MCP configs name, becomes a loader that turns the compile cache on
 *   before any of the bundle compiles.
 * - A module moved into a chunk would look for files and packages from the chunk. In tg's, cli-core's and
 *   cli-base's modules, `import.meta.url` becomes the module's own place (under `dist/`, or inside the installed
 *   package, which stays a dependency for its skills, fonts, recipes and child scripts), and a package they load at
 *   run time is resolved from there too: pnpm installs cli-core's dependencies beside cli-core, not beside tg.
 * - Native modules, Bun's SQLite and the packages loaded only by name stay outside the bundle.
 *
 *   pnpm build
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { isBuiltin } from "node:module"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { build, type Plugin } from "esbuild"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const out = join(dist, "bundle")
const bin = join(dist, "bin", "tg.js")
const LOADER = "// tg: bundle loader\n"

const EXTERNAL = [
  "bun:sqlite",
  "*.node",
  "@mtcute/*",
  "undici",
  "better-sqlite3",
  "@napi-rs/*",
  "@resvg/*",
  "@huggingface/*",
  "sherpa-onnx*",
  "onnxruntime-*",
  "@wirecat/cli-core-onnx",
  "@wirecat/cli-core-sqlite",
  // Its decoder starts a worker from its own file.
  "ogg-opus-decoder",
]
const isExternal = (specifier: string) =>
  EXTERNAL.some((pattern) => new RegExp(`^${pattern.replaceAll(".", "\\.").replaceAll("*", ".*")}$`).test(specifier))

// Read, and found harmless: commander and @colors name them in comments and messages; liquidjs resolves partials
// with explicit `paths`, so the requiring file does not matter.
const HARMLESS = ["/commander/lib/command.js", "/@colors/colors/lib/colors.js", "/liquidjs/dist/liquid.node.js"]

const ANCHORED = ["@wirecat/cli-core", "@wirecat/cli-base"]

const posix = (path: string) => path.split(sep).join("/")

/** The expression for a module's URL before it was bundled, or undefined for a third-party module. */
const placeOf = (file: string): string | undefined => {
  if (file.startsWith(dist + sep)) return `new URL(${JSON.stringify(posix(relative(out, file)))}, import.meta.url).href`
  for (const name of ANCHORED) {
    const marker = `${sep}node_modules${sep}${name.replace("/", sep)}${sep}`
    const at = file.lastIndexOf(marker)
    if (at < 0) continue
    const packageRoot = file.slice(0, at + marker.length)
    const manifest = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"))
    const main = join(packageRoot, manifest.exports["."].default)
    const path = posix(relative(dirname(main), file))
    return `new URL(${JSON.stringify(path)}, import.meta.resolve(${JSON.stringify(name)})).href`
  }
  return undefined
}

// Node has no "resolve from this parent" call; a resolve hook for the one call gives Node's own answer. Bun has no
// hooks but has `Bun.resolveSync(specifier, parent)`; when it finds nothing, the plain lookup keeps Bun's own error.
const FROM = "tg-bundle:from"
const FROM_SOURCE = `import * as module from "node:module"
import { dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
export const resolveFrom = (parent, specifier) => {
  if (globalThis.Bun) {
    if (specifier.includes(":")) return import.meta.resolve(specifier)
    try {
      return pathToFileURL(globalThis.Bun.resolveSync(specifier, dirname(fileURLToPath(parent)))).href
    } catch {
      return import.meta.resolve(specifier)
    }
  }
  if (!module.registerHooks) return import.meta.resolve(specifier)
  const hooks = module.registerHooks({
    resolve: (asked, context, next) => next(asked, asked === specifier ? { ...context, parentURL: parent } : context),
  })
  try {
    return import.meta.resolve(specifier)
  } finally {
    hooks.deregister()
  }
}
export const importFrom = async (parent, specifier) => import(resolveFrom(parent, specifier))
`

const problems: string[] = []

const BY_NAME = /(?<![\w$.])import\(\s*(?!["'`.])/g
const LITERAL = /(?<![\w$.])import\(\s*(["'])([^"'.][^"']*)\1\s*\)/g

const ownPlaces: Plugin = {
  name: "own-places",
  setup(context) {
    context.onResolve({ filter: new RegExp(`^${FROM}$`) }, () => ({ path: FROM, namespace: FROM }))
    context.onLoad({ filter: /.*/, namespace: FROM }, () => ({ contents: FROM_SOURCE, loader: "js" }))
    context.onLoad({ filter: /\.[cm]?js$/ }, (args) => {
      const source = readFileSync(args.path, "utf8")
      const place = placeOf(args.path)
      if (!place) {
        const harmless = HARMLESS.some((path) => posix(args.path).endsWith(path))
        if (!harmless && /import\.meta|__dirname|__filename|require\.resolve/.test(source)) problems.push(args.path)
        return undefined
      }
      const loadsOutside = [...source.matchAll(LITERAL)].some(([, , specifier]) => specifier && isExternal(specifier))
      if (!source.includes("import.meta") && source.search(BY_NAME) < 0 && !loadsOutside) return undefined
      const other = source.match(/import\.meta\.(?!url\b|resolve\b)\w+/)
      if (other) problems.push(`${args.path}: ${other[0]}`)
      // `place` holds `import.meta.url` or `import.meta.resolve`, so it goes in last.
      const contents = source
        .replaceAll(/import\.meta\.resolve\(/g, "resolveFrom(PLACE, ")
        .replaceAll(BY_NAME, "importFrom(PLACE, ")
        .replaceAll(LITERAL, (call, quote, specifier) =>
          isExternal(specifier) ? `importFrom(PLACE, ${quote}${specifier}${quote})` : call,
        )
        .replaceAll(/import\.meta\.url\b/g, "PLACE")
        .replaceAll(/\bPLACE\b/g, place)
      return { contents: `import { importFrom, resolveFrom } from "${FROM}";\n${contents}`, loader: "js" }
    })
  },
}

const isCommonJs = (file: string): boolean => {
  if (file.endsWith(".cjs")) return true
  if (!file.endsWith(".js")) return false
  for (let directory = dirname(file); directory !== dirname(directory); directory = dirname(directory)) {
    const manifest = join(directory, "package.json")
    if (existsSync(manifest)) return JSON.parse(readFileSync(manifest, "utf8")).type !== "module"
  }
  return true
}

/**
 * `await import("yaml")` gets CommonJS's named exports from Node, but only `default` from a bundled chunk. A dynamic
 * import of CommonJS goes through a module that exports the names Node itself finds in it.
 */
const commonJsNames: Plugin = {
  name: "common-js-names",
  setup(context) {
    context.onResolve({ filter: /.*/ }, async (args) => {
      if (args.kind !== "dynamic-import" || args.pluginData === "inner") return undefined
      const resolved = await context.resolve(args.path, {
        kind: "dynamic-import",
        importer: args.importer,
        resolveDir: args.resolveDir,
        pluginData: "inner",
      })
      if (resolved.errors.length > 0 || resolved.external || !isCommonJs(resolved.path)) return undefined
      return { path: resolved.path, namespace: "common-js-names" }
    })
    context.onLoad({ filter: /.*/, namespace: "common-js-names" }, async (args) => {
      const names = Object.keys(await import(pathToFileURL(args.path).href)).filter((name) => name !== "default")
      const values = names.map((name, index) => `const n${index} = cjs[${JSON.stringify(name)}]`)
      const exported = names.map((name, index) => `n${index} as ${JSON.stringify(name)}`)
      return {
        contents: `const cjs = require(${JSON.stringify(args.path)})\n${values.join("\n")}\nexport default cjs\nexport { ${exported.join(", ")} }\n`,
        resolveDir: dirname(args.path),
        loader: "js",
      }
    })
  },
}

if (readFileSync(bin, "utf8").includes(LOADER)) {
  console.error("dist/bin/tg.js is already the loader — run `pnpm build`, which compiles it again first")
  process.exit(1)
}
rmSync(out, { recursive: true, force: true })
const { metafile } = await build({
  entryPoints: { tg: bin },
  outdir: out,
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "node",
  target: "node22",
  chunkNames: "[name]-[hash]",
  // Two modules with one name would otherwise become `name2`, and `name` reaches errors and `commands --json`.
  keepNames: true,
  external: EXTERNAL,
  // Bundled CommonJS calls `require` for Node's own modules.
  banner: {
    js: 'import { createRequire as __tgRequire } from "node:module";\nconst require = __tgRequire(import.meta.url);',
  },
  plugins: [commonJsNames, ownPlaces],
  metafile: true,
  logLevel: "warning",
})
// Only tg's own modules may import a package that stays outside: it resolves from the bundle, which is tg's place.
for (const [input, { imports }] of Object.entries(metafile.inputs)) {
  if (input.startsWith("dist/")) continue
  for (const { path, external } of imports) {
    if (external && !isBuiltin(path) && !["bun:sqlite", "<runtime>"].includes(path))
      problems.push(`${input} imports ${path}, which would resolve from the bundle`)
  }
}
if (problems.length > 0) {
  console.error(`the bundle would look for these in the wrong place:\n${problems.join("\n")}`)
  process.exit(1)
}
writeFileSync(
  bin,
  `#!/usr/bin/env node\n${LOADER}import { enableCompileCache } from "node:module"\n\n// Before the bundle compiles: the bundle's own call comes after its chunks.\nenableCompileCache()\nawait import("../bundle/tg.js")\n`,
)
