/**
 * Writes `docs/commands.md` from the command tree itself, ported from max-cli's `scripts/commands.ts`.
 *
 *   pnpm generate
 *
 * Nobody writes that page by hand: a reference that can be forgotten lies with the confidence of a
 * real one. CI regenerates it and fails when the committed page differs.
 *
 * It imports from `dist/` because Node's type stripping will not resolve a `.js` specifier to a
 * `.ts` file, so `pnpm generate` builds first.
 */
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { EXIT_CODES } from "@leemour/cli-core"
import {
  type ArgumentInfo,
  type CommandInfo,
  describeOptions,
  describeProgram,
  type OptionInfo,
} from "@leemour/cli-core/commands"
import { createProgram } from "../dist/program.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const BANNER = "<!-- Generated from the command tree by scripts/commands.ts. Do not edit; run `pnpm generate`. -->"

/** `~` is escaped: `--md`'s description reads `~~struck~~`, which would strike the rest of the row. */
const cell = (text: string | undefined): string =>
  (text ?? "").replace(/\|/g, "\\|").replace(/~/g, "\\~").replace(/\n+/g, " ").trim()

/** What a value may be and what it is when left out — commander keeps both out of the description. */
const extras = ({ choices, default: fallback }: { choices?: readonly string[]; default?: unknown }): string =>
  [
    choices ? ` One of: ${choices.map((choice) => `\`${choice}\``).join(", ")}.` : "",
    fallback === undefined || fallback === false ? "" : ` Default: \`${String(fallback)}\`.`,
  ].join("")

const sentence = (text: string | undefined): string => (cell(text) === "" ? "" : `${cell(text)}.`)

const optionRows = (options: readonly OptionInfo[]): string =>
  options.map((option) => `| \`${cell(option.flags)}\` | ${sentence(option.description)}${extras(option)} |`).join("\n")

const argumentRows = (args: readonly ArgumentInfo[]): string =>
  args
    .map(
      (argument) =>
        `| \`${cell(argument.name)}\` | ${argument.required ? "required" : "optional"} | ${sentence(argument.description)}${extras(argument)} |`,
    )
    .join("\n")

const body = (command: CommandInfo): string[] => {
  const parts = [cell(command.description), ""]
  if (command.mutates) parts.push("**Changes something in Telegram.**", "")
  parts.push("```sh", command.usage, "```")

  if (command.arguments.length > 0) {
    parts.push("", "| Argument | | What it is |", "|---|---|---|", argumentRows(command.arguments))
  }
  if (command.options.length > 0) {
    parts.push("", "| Option | What it does |", "|---|---|", optionRows(command.options))
  }
  return parts
}

/** A group shows its own usage only when it takes options of its own, as `doctor --online` does. */
const section = (command: CommandInfo, depth: number): string => {
  const heading = `${"#".repeat(Math.min(depth, 4))} \`tg ${command.path.join(" ")}\``
  if (command.commands.length === 0) return [heading, "", ...body(command)].join("\n")
  const own = command.options.length > 0 ? body(command) : [cell(command.description)]
  return [heading, "", ...own, "", command.commands.map((child) => section(child, depth + 1)).join("\n\n")]
    .join("\n")
    .trimEnd()
}

const exitCodes = (): string =>
  [
    "| Code | When |",
    "|---|---|",
    "| `0` | it worked |",
    ...Object.entries(EXIT_CODES).map(([name, code]) => `| \`${code}\` | \`${name}\` |`),
    "| `1` | anything else |",
  ].join("\n")

const page = (program: ReturnType<typeof createProgram>): string => `${BANNER}

# Commands

Every command, option and exit code. This page is **generated from the program itself**, so it
cannot describe a version that does not exist. For the same list as JSON, run \`tg commands --json\`.

How a command line is built:

\`\`\`sh
tg [profile] [options] <resource> <verb> [arguments]
\`\`\`

**The first word is the profile** when it is not a command: \`tg work chats list\` lists the chats of
profile \`work\`, and \`tg chats list\` those of the default profile. \`TG_PROFILE\` does the same for a
whole shell session; without either, the profile is \`default\`.

## Options for every command

| Option | What it does |
|---|---|
${optionRows(describeOptions(program))}

${describeProgram(program)
  .map((command) => section(command, 2))
  .join("\n\n")}

## Exit codes

Branch on the code, not on the text: the text can change, the code does not.

${exitCodes()}

\`0\` and only \`0\` means the operation was done. \`14\` (\`outcome_unknown\`) means a message **may**
have gone: repeat it only with the same \`--send-id\`, which Telegram uses to drop a second copy.
`

writeFileSync(join(root, "docs/commands.md"), page(createProgram()))
console.log("generated docs/commands.md from the command tree")
