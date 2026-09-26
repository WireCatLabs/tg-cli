import { existsSync } from "node:fs"
import { CliError, type KeyringStore } from "@leemour/cli-core"
import {
  asFirstWord,
  type BaseContext,
  type BaseEnvironment,
  baseContext,
  environmentOf,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { resolveSettings } from "../app.js"
import { sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"

export interface Environment extends BaseEnvironment {
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean }
  keyring?: KeyringStore
  /** Tests hand in a scripted Telegram. */
  adapter?: (options: { credentials: ApiCredentials; sessionPath: string }) => Adapter | Promise<Adapter>
}

export type Adapter = Pick<TelegramAdapter, "login" | "me" | "chats" | "history" | "send" | "logout" | "close">

export interface CommandContext extends BaseContext {
  profile: string
  stdin: NodeJS.ReadableStream & { isTTY?: boolean }
  sessionPath: string
  credentials: ReturnType<typeof apiCredentials>
  open: (credentials?: ApiCredentials) => Promise<Adapter>
  /** Opens Telegram inside `--timeout`, tracked so the deadline can close it, and closes it on every path. */
  withTelegram: <T>(work: (telegram: Adapter) => Promise<T>) => Promise<T>
}

export const forCommand = (command: Command): CommandContext => {
  const environment = environmentOf<Environment>(command)
  const base = baseContext(command, resolveSettings)
  const { profile } = base.settings
  const sessionPath = sessionFile(profile, base.env)
  const credentials = apiCredentials({
    profile,
    env: base.env,
    warn: base.renderer.warn,
    ...(environment.keyring ? { keyring: environment.keyring } : {}),
  })
  const diagnostic = (line: string) => base.streams.diagnostic(line)
  const login = `\`tg ${asFirstWord(profile)}session start\``

  const open = async (given?: ApiCredentials): Promise<Adapter> => {
    const resolved = given ?? credentials.read()
    if (!resolved) {
      throw new CliError(
        "authentication_error",
        `no Telegram app credentials for profile "${profile}" — run ${login} first`,
      )
    }
    const options = { credentials: resolved, sessionPath }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({ ...options, diagnostic, verbose: base.settings.trace })
  }

  return {
    ...base,
    profile,
    stdin: environment.stdin ?? process.stdin,
    sessionPath,
    credentials,
    open,
    withTelegram: (work) =>
      base.run(async () => {
        if (base.settings.offline) {
          throw new CliError("validation_error", "--offline has nothing to answer from yet: tg keeps no local copy")
        }
        if (!environment.adapter && !existsSync(sessionPath)) {
          throw new CliError("authentication_error", `no session for profile "${profile}" — run ${login}`)
        }
        const telegram = await open()
        base.track(telegram)
        try {
          return await work(telegram)
        } finally {
          await telegram.close()
        }
      }),
  }
}
