import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  coverageGenerator,
  definitionsGenerator,
  generate,
  manifestGenerator,
  type Override,
  typesGenerator,
  valibotGenerator,
  writeArtifacts,
} from "@leemour/cli-core/codegen"
import { adaptBotApi, type BotApiSource } from "./source-adapter.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")
const read = (path: string) => JSON.parse(readFileSync(join(root, path), "utf8"))
const provenance = read("spec/bot/source.json")
const model = adaptBotApi(read("spec/bot/api.json") as BotApiSource, {
  sourceUrl: provenance.sourceUrl,
  sourceRevision: provenance.revision,
})
const artifacts = generate(
  model,
  [
    typesGenerator({ path: "src/bot/generated/types.ts" }),
    valibotGenerator({ path: "src/bot/generated/schemas.ts", typesImport: "./types.js" }),
    manifestGenerator({ path: "src/bot/generated/manifest.ts" }),
    definitionsGenerator({ path: "src/bot/generated/definitions.ts" }),
    coverageGenerator({
      path: "docs/dev/bot-api-coverage.md",
      title: "Telegram Bot API coverage",
      command: (operation) => `tg bot api ${operation.command}`,
    }),
  ],
  {
    overrides: read("spec/bot/effects.json") as Record<string, Override>,
    banner: ["Source: spec/bot/api.json", "Run: pnpm bot:generate"],
  },
)
const check = process.argv.includes("--check")
const stale = writeArtifacts(artifacts, {
  root,
  check,
  format: (path, content) =>
    path.endsWith(".ts")
      ? execFileSync(
          process.execPath,
          [join(root, "node_modules/@biomejs/biome/bin/biome"), "format", "--write", `--stdin-file-path=${path}`],
          { input: content, encoding: "utf8", cwd: root },
        )
      : content,
})
if (check && stale.length) {
  process.stderr.write(`out of date — run pnpm bot:generate:\n${stale.join("\n")}\n`)
  process.exit(1)
}
process.stderr.write(`${model.operations.length} operations, ${stale.length} files ${check ? "checked" : "written"}\n`)
