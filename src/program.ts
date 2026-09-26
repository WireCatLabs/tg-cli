import { CliError, exitCodeFor, GENERIC_FAILURE, isCliError, processStreams, singleLine } from "@leemour/cli-core"
import { Command, CommanderError } from "commander"
import { accountCommand } from "./commands/account.js"
import { chatsCommand } from "./commands/chats.js"
import type { Environment } from "./commands/context.js"
import { messagesCommand } from "./commands/messages.js"
import { sessionCommand } from "./commands/session.js"
import { VERSION } from "./version.js"

export const createProgram = (environment: Environment = {}): Command => {
  const program = new Command("tg")
    .description("A personal Telegram account from the command line, for agents and scripts")
    .version(VERSION)
    .option("--json", "one JSON value on stdout (the default when stdout is not a terminal)")
    .option("--jsonl", "one JSON value per line")
    .option("-q, --quiet", "no notes on stderr; a failure is still said")
    .option("-v, --verbose", "the Telegram library's own log lines, on stderr")
    .exitOverride()
    .configureOutput({
      writeOut: (text) => (environment.streams ?? processStreams).data(text.trimEnd()),
      writeErr: (text) => (environment.streams ?? processStreams).diagnostic(text.trimEnd()),
    })

  Object.assign(program, { environment })
  for (const command of [sessionCommand(), accountCommand(), chatsCommand(), messagesCommand()]) {
    program.addCommand(command.exitOverride())
    for (const sub of command.commands) sub.exitOverride()
  }
  return program
}

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = async (argv: string[], environment: Environment = {}): Promise<number> => {
  const streams = environment.streams ?? processStreams
  const machine = argv.includes("--json") || argv.includes("--jsonl") || !(environment.tty ?? process.stdout.isTTY)
  try {
    await createProgram(environment).parseAsync(argv, { from: "user" })
    return 0
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.exitCode === 0) return 0
      return exitCodeFor("validation_error")
    }
    const failure = isCliError(error) ? error : new CliError("provider_error", unexpected(error))
    streams.diagnostic(
      machine
        ? JSON.stringify({ error: { code: failure.code, message: failure.message, details: failure.details } })
        : `✗ ${failure.message}`,
    )
    return isCliError(error) ? exitCodeFor(failure.code) : GENERIC_FAILURE
  }
}

const unexpected = (error: unknown): string =>
  error instanceof Error ? `unexpected failure: ${singleLine(error.message)}` : "unexpected failure"
