import { appendFileSync } from "node:fs"
import { exitCodeFor, processStreams } from "@leemour/cli-core"
import {
  accountCommand,
  botCommand,
  chatsCommand,
  commandsCommand,
  completeCommand,
  configCommand,
  contactsCommand,
  conversationsCommand,
  createProgram as create,
  doctorCommand,
  inboxCommand,
  mcpCommand,
  messagesCommand,
  modelsCommand,
  type ProgramDefinition,
  pollsCommand,
  reactionsCommand,
  recipientsCommand,
  reviewCommand,
  run as runCli,
  runsCommand,
  sendsCommand,
  serveCommand,
  serverCommand,
  skillCommand,
  storeCommand,
  topicsCommand,
  watchCommand,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { CONFIG, TG } from "./app.js"
import { TELEGRAM_BOT } from "./commands/bot.js"
import { telegramBotApiCommand } from "./commands/bot-api.js"
import { type Environment, SKILL, TELEGRAM } from "./commands/context.js"
import { sessionCommand } from "./commands/session.js"
import { setupCommand } from "./commands/setup.js"
import { upgradeCommand } from "./commands/update.js"
import { updateNotice } from "./update.js"

/** A revoked or missing login fails the same on every retry; serve reports a locked keyring with another code. */
export const NO_RESTART_ON = [exitCodeFor("authentication_error")]

const definition: ProgramDefinition = {
  app: TG,
  configuration: CONFIG,
  configure: (program) => {
    program.addHelpText(
      "after",
      "\nGetting started after installation:\n" +
        "  tg setup                    Guided first run; allow about 5 minutes\n" +
        "  tg setup --agent codex      Log in and install your agent's skill\n" +
        "  tg setup --help             Login choices, examples and Windows instructions\n" +
        "\nFor agents:\n" +
        "  tg skill show               Read the bundled instructions before using Telegram\n" +
        "  tg commands --json          Discover commands, arguments and flags\n" +
        "\nSetup checks five chats. Choose a chat before downloading its history.\n",
    )
    program.commands
      .find((command) => command.name() === "skill")
      ?.addHelpText(
        "after",
        "\nBefore the first login, an agent can read `tg skill show`; no session is needed.\n" +
          "Run `tg setup --agent codex` for guided login and skill installation.\n" +
          "To install instructions separately: `tg skill install --for all`.\n",
      )
  },
  commands: () =>
    loggingArgv([
      sessionCommand(),
      setupCommand(),
      accountCommand(TELEGRAM),
      chatsCommand(TELEGRAM),
      contactsCommand(TELEGRAM),
      messagesCommand(TELEGRAM),
      reactionsCommand(TELEGRAM),
      pollsCommand(TELEGRAM),
      modelsCommand(TELEGRAM),
      inboxCommand(TELEGRAM),
      reviewCommand(TELEGRAM),
      topicsCommand(TELEGRAM),
      watchCommand(TELEGRAM),
      serveCommand(TELEGRAM),
      serverCommand(TELEGRAM, { unit: { noRestartOn: NO_RESTART_ON } }),
      storeCommand(TELEGRAM),
      conversationsCommand(TELEGRAM),
      recipientsCommand(TELEGRAM),
      sendsCommand(TELEGRAM),
      runsCommand(TG),
      configCommand(TG, CONFIG),
      doctorCommand(TELEGRAM),
      commandsCommand(TG),
      completeCommand(TELEGRAM, CONFIG),
      upgradeCommand(),
      mcpCommand(TELEGRAM),
      botCommand(TELEGRAM_BOT).addCommand(telegramBotApiCommand()),
      skillCommand(TG, SKILL),
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
