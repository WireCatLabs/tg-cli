import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { type CommandInfo, describeProgram } from "@wirecat/cli-base/commands"
import { withVersion } from "@wirecat/cli-base/skill"
import { validateSkill } from "@wirecat/cli-core/skill-validation"
import { CONFIG } from "../dist/app.js"
import { createProgram } from "../dist/program.js"
import { VERSION } from "../dist/version.js"

const keys = CONFIG.allSettings
const file = new URL("../skills/tg-cli/SKILL.md", import.meta.url)
const source = readFileSync(file, "utf8")
const program = createProgram()
assert.deepEqual(validateSkill(source, { folder: "tg-cli", file: file.pathname, program }), [])
assert.deepEqual(validateSkill(withVersion(source, VERSION), { folder: "tg-cli", version: VERSION, program }), [])
const reference = readFileSync(new URL("../docs/configuration-reference.md", import.meta.url), "utf8")
for (const key of keys) assert.ok(reference.includes(key), `configuration reference misses ${key}`)

// The same test as cli-core's toolsFromCommands, so the page is checked against what the server really skips.
const neverOffered = (commands: readonly CommandInfo[]): string[] =>
  commands.flatMap((command) => {
    const runs = command.commands.length === 0 || command.effects !== undefined
    const skipped = command.mcp === false || command.lifetime !== undefined
    return [...(runs && skipped ? [command.path.join(" ")] : []), ...neverOffered(command.commands)]
  })
const mcpPage = readFileSync(new URL("../docs/mcp.md", import.meta.url), "utf8")
const leftOut = mcpPage.split("### Commands the server leaves out")[1]?.split("\nCommands such as")[0] ?? ""
const listed = new Set(
  [...leftOut.matchAll(/^- [^\n]*(?:\n {2}[^\n]*)*/gm)]
    .flatMap(([bullet]) => [...bullet.matchAll(/`([^`]+)`/g)].map(([, span = ""]) => span))
    .flatMap((span) => {
      const words = span.split(" ")
      const last = words.pop() ?? ""
      return last.split("|").map((word) => [...words, word].join(" "))
    }),
)
const never = new Set(neverOffered(describeProgram(program)))
for (const path of never)
  assert.ok(listed.has(path), `docs/mcp.md "Commands the server leaves out" misses \`${path}\`, which MCP never offers`)
for (const path of listed)
  assert.ok(
    never.has(path),
    `docs/mcp.md "Commands the server leaves out" names \`${path}\`, which MCP offers or tg lacks`,
  )
process.stdout.write("skill/discovery/version, configuration-key reference and MCP left-out commands: ok\n")
