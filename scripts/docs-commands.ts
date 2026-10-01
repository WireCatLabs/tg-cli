/**
 * Every option a user page names on a `tg` command exists on that command, or is planned for it in
 * cli-messaging's parity manifest — so a page cannot keep an option a change removed.
 *
 *   pnpm build && pnpm docs:commands
 */
import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Manifest, surfaceOf, unknownOptions } from "./release/doc-options.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const tree = JSON.parse(
  execFileSync(process.execPath, [join(root, "dist/bin/tg.js"), "commands", "--json"], { encoding: "utf8" }),
)
const manifestPath = createRequire(import.meta.url).resolve("@leemour/cli-messaging/parity.json")
const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf8")).commands

// commands.md is generated from the tree, so it cannot disagree with it.
const pages = [
  "README.md",
  ...readdirSync(join(root, "docs"))
    .filter((name) => name.endsWith(".md") && name !== "commands.md")
    .map((name) => join("docs", name)),
]

const surface = surfaceOf(tree)
const problems = pages.flatMap((page) =>
  unknownOptions(readFileSync(join(root, page), "utf8"), surface, manifest).map(
    (found) => `${page}: ${found} — no such option, and the parity manifest plans none`,
  ),
)
for (const problem of problems) console.error(problem)
if (problems.length > 0) process.exit(1)
console.log(`docs: every option on ${pages.length} pages exists or is planned`)
