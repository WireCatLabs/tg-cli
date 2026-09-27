import {
  accountCommand,
  chatsCommand,
  createProgram as create,
  messagesCommand,
  type ProgramDefinition,
  run as runCli,
  runsCommand,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { TG } from "./app.js"
import { type Environment, TELEGRAM } from "./commands/context.js"
import { sendCommand } from "./commands/messages.js"
import { recipientsCommand } from "./commands/recipients.js"
import { sendsCommand } from "./commands/sends.js"
import { sessionCommand } from "./commands/session.js"

const definition: ProgramDefinition = {
  app: TG,
  commands: () => [
    sessionCommand(),
    accountCommand(TELEGRAM),
    chatsCommand(TELEGRAM),
    messagesCommand(TELEGRAM).addCommand(sendCommand()),
    recipientsCommand(),
    sendsCommand(),
    runsCommand(TG),
  ],
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = (argv: string[], environment: Environment = {}): Promise<number> =>
  runCli(argv, definition, environment as Record<string, unknown>)
