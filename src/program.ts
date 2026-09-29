import { appendFileSync } from "node:fs"
import { processStreams } from "@leemour/cli-core"
import {
  accountCommand,
  backfillCommand,
  chatsCommand,
  commandsCommand,
  completeCommand,
  configCommand,
  contactsCommand,
  createProgram as create,
  doctorCommand,
  exportCommand,
  inboxCommand,
  mcpCommand,
  messagesCommand,
  type ProgramDefinition,
  recipientsCommand,
  reviewCommand,
  run as runCli,
  runsCommand,
  sendsCommand,
  serveCommand,
  serviceCommand,
  skillCommand,
  syncCommand,
  watchCommand,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { CONFIG, TG } from "./app.js"
import { type Environment, TELEGRAM } from "./commands/context.js"
import { sessionCommand } from "./commands/session.js"
import { updateSelfCommand } from "./commands/update.js"
import { updateNotice } from "./update.js"

const definition: ProgramDefinition = {
  app: TG,
  configuration: CONFIG,
  commands: () =>
    loggingArgv([
      sessionCommand(),
      accountCommand(TELEGRAM),
      chatsCommand(TELEGRAM),
      contactsCommand(TELEGRAM),
      messagesCommand(TELEGRAM),
      inboxCommand(TELEGRAM),
      reviewCommand(TELEGRAM),
      watchCommand(TELEGRAM),
      serveCommand(TELEGRAM),
      serviceCommand(TELEGRAM),
      syncCommand(TELEGRAM),
      exportCommand(TELEGRAM),
      backfillCommand(TELEGRAM),
      recipientsCommand(TELEGRAM),
      sendsCommand(TELEGRAM),
      runsCommand(TG),
      configCommand(TG, CONFIG),
      doctorCommand(TELEGRAM),
      commandsCommand(TG),
      completeCommand(TELEGRAM, CONFIG),
      updateSelfCommand(),
      mcpCommand(TELEGRAM),
      skillCommand(TG, new URL("../skills/tg-cli/SKILL.md", import.meta.url)),
    ]),
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = async (argv: string[], environment: Environment = {}): Promise<number> => {
  const notice = updateNotice(argv, {
    ...(environment.tty === undefined ? {} : { tty: environment.tty }),
    ...(environment.update ? { environment: environment.update } : {}),
    ...(environment.env ? { env: environment.env } : {}),
  })
  const code = await runCli(argv, definition, environment as Record<string, unknown>)
  const line = await notice
  const argvLog = process.env.TG_TEST_ARGV_LOG
  // --version ends before any action, so the preAction hook never sees it.
  if (argvLog && code === 0 && argv.some((word) => word === "--version" || word === "-V"))
    appendFileSync(argvLog, `${JSON.stringify({ command: "", options: ["--version"] })}\n`)
  if (line && code === 0) (environment.streams ?? processStreams).diagnostic(line)
  return code
}

/**
 * Under vitest only: which command a test drove and the option names it gave, never a value
 * (`pnpm test:matrix`). The hook sits on each top-level command because the root program is built
 * inside cli-messaging; commander runs an ancestor's preAction hook for every subcommand.
 */
function loggingArgv(commands: Command[]): Command[] {
  const file = process.env.TG_TEST_ARGV_LOG
  if (file) for (const command of commands) command.hook("preAction", (_self, action) => logParsed(file, action))
  return commands
}

const logParsed = (file: string, action: Command): void => {
  const words: string[] = []
  const options: string[] = []
  for (let at: Command | null = action; at; at = at.parent) {
    if (at.parent) words.unshift(at.name())
    for (const option of at.options) {
      const key = option.attributeName()
      if (at.getOptionValueSource(key) !== "cli" || !option.long) continue
      if (option.negate === (at.getOptionValue(key) === false)) options.push(option.long)
    }
  }
  appendFileSync(file, `${JSON.stringify({ command: words.join(" "), options })}\n`)
}
