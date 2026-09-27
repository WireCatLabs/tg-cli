import { existsSync } from "node:fs"
import { CliError, type KeyringStore } from "@leemour/cli-core"
import {
  asFirstWord,
  type BaseContext,
  type BaseEnvironment,
  type ConnectOptions,
  environmentOf,
  type Messenger,
  type MessengerAdapter,
  type MessengerContext,
  messengerContext,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { resolveSettings, TG } from "../app.js"
import { isolated, sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"

export interface Environment extends BaseEnvironment {
  keyring?: KeyringStore
  /** Tests hand in a scripted Telegram. */
  adapter?: (
    options: { credentials: ApiCredentials; sessionPath: string } & ConnectOptions,
  ) => Adapter | Promise<Adapter>
}

export type Adapter = MessengerAdapter & Pick<TelegramAdapter, "login">

export interface CommandContext extends MessengerContext {
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

  const open = async (given?: ApiCredentials, connecting: ConnectOptions = {}): Promise<Adapter> => {
    const resolved = given ?? credentials.read()
    if (!resolved) {
      throw new CliError(
        "authentication_error",
        `no Telegram app credentials for profile "${profile}" — run ${login} first`,
      )
    }
    const options = { credentials: resolved, sessionPath, ...connecting }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({
          ...options,
          diagnostic: (line) => base.streams.diagnostic(line),
          verbose: base.settings.trace,
        })
  }

  const connect = async (options: ConnectOptions = {}): Promise<Adapter> => {
    if (!environment.adapter && !existsSync(sessionPath)) {
      throw new CliError("authentication_error", `no session for profile "${profile}" — run ${login}`)
    }
    return open(undefined, options)
  }

  return { environment, sessionPath, credentials, open, connect }
}

export const TELEGRAM: Messenger = {
  app: TG,
  provider: "telegram",
  resolveSettings,
  connect: (command, base, options) => telegramOf(command, base).connect(options),
  chatArgument: "a chat: its title or part of it, its id, @username, or `me` for Saved Messages",
  // Saved Messages is the chat with yourself, so its id is the account's.
  savedChatId: (account) => account.account,
  diagnose: async (command, base) => {
    const { sessionPath, credentials } = telegramOf(command, base)
    return {
      session: { path: sessionPath, exists: existsSync(sessionPath) },
      appCredentials: appCredentialsState(() => credentials.read(), base.env),
      // The one failure with no other symptom: a login made without these variables is invisible with them.
      keyringMovedByEnvironment: isolated(base.env),
    }
  },
  // In Telegram a one-to-one chat's id is the other person's id.
  partnerOf: (chat) => (chat.kind === "dialog" ? chat.id : undefined),
}

export const forCommand = (command: Command): CommandContext => {
  const context = messengerContext(command, TELEGRAM)
  const { sessionPath, credentials, open } = telegramOf(command, context)
  return {
    ...context,
    sessionPath,
    credentials,
    open,
    withTelegram: context.withMessenger,
  }
}

/** Whether app credentials exist and where from — never the values. */
const appCredentialsState = (read: () => ApiCredentials | undefined, env: NodeJS.ProcessEnv): string => {
  try {
    if (!read()) return "missing"
    return env.TG_API_ID ? "from TG_API_ID and TG_API_HASH" : "stored"
  } catch {
    return "unreadable"
  }
}
