import {
  accountCommand,
  chatsCommand,
  commandsCommand,
  contactsCommand,
  createProgram as create,
  messagesCommand,
  type ProgramDefinition,
  recipientsCommand,
  run as runCli,
  runsCommand,
  sendsCommand,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { TG } from "./app.js"
import { type Environment, TELEGRAM } from "./commands/context.js"
import { sessionCommand } from "./commands/session.js"

const definition: ProgramDefinition = {
  app: TG,
  commands: () => [
    sessionCommand(),
    accountCommand(TELEGRAM),
    chatsCommand(TELEGRAM),
    contactsCommand(TELEGRAM),
    messagesCommand(TELEGRAM),
    recipientsCommand(TELEGRAM),
    sendsCommand(TELEGRAM),
    runsCommand(TG),
    commandsCommand(TG),
  ],
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = (argv: string[], environment: Environment = {}): Promise<number> =>
  runCli(argv, definition, environment as Record<string, unknown>)
