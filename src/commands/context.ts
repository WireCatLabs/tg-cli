import { existsSync } from "node:fs"
import { CliError, type KeyringStore } from "@leemour/cli-core"
import {
  asFirstWord,
  type BaseContext,
  type BaseEnvironment,
  environmentOf,
  type Messenger,
  type MessengerAdapter,
  type MessengerContext,
  messengerContext,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { resolveSettings, TG } from "../app.js"
import { sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"

export interface Environment extends BaseEnvironment {
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean }
  keyring?: KeyringStore
  /** Tests hand in a scripted Telegram. */
  adapter?: (options: { credentials: ApiCredentials; sessionPath: string }) => Adapter | Promise<Adapter>
}

export type Adapter = MessengerAdapter & Pick<TelegramAdapter, "login">

export interface CommandContext extends MessengerContext {
  stdin: NodeJS.ReadableStream & { isTTY?: boolean }
  sessionPath: string
  credentials: ReturnType<typeof apiCredentials>
  open: (credentials?: ApiCredentials) => Promise<Adapter>
  withTelegram: MessengerContext["withMessenger"]
}

/** What only Telegram has: app credentials, a session file, and how to log in. */
const telegramOf = (command: Command, base: BaseContext) => {
  const environment = environmentOf<Environment>(command)
  const { profile } = base.settings
  const sessionPath = sessionFile(profile, base.env)
  const credentials = apiCredentials({
    profile,
    env: base.env,
    warn: base.renderer.warn,
    ...(environment.keyring ? { keyring: environment.keyring } : {}),
  })
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
      : await TelegramAdapter.open({
          ...options,
          diagnostic: (line) => base.streams.diagnostic(line),
          verbose: base.settings.trace,
        })
  }

  const connect = async (): Promise<Adapter> => {
    if (!environment.adapter && !existsSync(sessionPath)) {
      throw new CliError("authentication_error", `no session for profile "${profile}" — run ${login}`)
    }
    return open()
  }

  return { environment, sessionPath, credentials, open, connect }
}

export const TELEGRAM: Messenger = {
  app: TG,
  provider: "telegram",
  resolveSettings,
  connect: (command, base) => telegramOf(command, base).connect(),
  chatArgument: "a chat: its title or part of it, its id, @username, or `me` for Saved Messages",
  // Saved Messages is the chat with yourself, so its id is the account's.
  savedChatId: (account) => account.account,
}

export const forCommand = (command: Command): CommandContext => {
  const context = messengerContext(command, TELEGRAM)
  const { environment, sessionPath, credentials, open } = telegramOf(command, context)
  return {
    ...context,
    stdin: environment.stdin ?? process.stdin,
    sessionPath,
    credentials,
    open,
    withTelegram: context.withMessenger,
  }
}
