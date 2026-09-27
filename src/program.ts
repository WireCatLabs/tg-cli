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
  messagesCommand,
  type ProgramDefinition,
  recipientsCommand,
  run as runCli,
  runsCommand,
  sendsCommand,
  serveCommand,
  syncCommand,
  watchCommand,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { CONFIG, TG } from "./app.js"
import { type Environment, TELEGRAM } from "./commands/context.js"
import { sessionCommand } from "./commands/session.js"
import { updateSelfCommand } from "./commands/update.js"

const definition: ProgramDefinition = {
  app: TG,
  commands: () => [
    sessionCommand(),
    accountCommand(TELEGRAM),
    chatsCommand(TELEGRAM),
    contactsCommand(TELEGRAM),
    messagesCommand(TELEGRAM),
    watchCommand(TELEGRAM),
    serveCommand(TELEGRAM),
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
  ],
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = (argv: string[], environment: Environment = {}): Promise<number> =>
  runCli(argv, definition, environment as Record<string, unknown>)
