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
  mcpCommand,
  messagesCommand,
  type ProgramDefinition,
  recipientsCommand,
  run as runCli,
  runsCommand,
  sendsCommand,
  serveCommand,
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
    mcpCommand(TELEGRAM),
    skillCommand(TG, new URL("../skills/tg-cli/SKILL.md", import.meta.url)),
  ],
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
  if (line && code === 0) (environment.streams ?? processStreams).diagnostic(line)
  return code
}
