import { createProgram as create, type ProgramDefinition, run as runCli } from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { TG } from "./app.js"
import { accountCommand } from "./commands/account.js"
import { chatsCommand } from "./commands/chats.js"
import type { Environment } from "./commands/context.js"
import { messagesCommand } from "./commands/messages.js"
import { recipientsCommand } from "./commands/recipients.js"
import { sendsCommand } from "./commands/sends.js"
import { sessionCommand } from "./commands/session.js"

const definition: ProgramDefinition = {
  app: TG,
  commands: () => [
    sessionCommand(),
    accountCommand(),
    chatsCommand(),
    messagesCommand(),
    recipientsCommand(),
    sendsCommand(),
  ],
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = (argv: string[], environment: Environment = {}): Promise<number> =>
  runCli(argv, definition, environment as Record<string, unknown>)
