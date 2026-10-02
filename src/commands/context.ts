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
  type ServerSystem,
} from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { resolveSettings, TG } from "../app.js"
import type { FetchLike } from "../bot/transport.js"
import { isolated, sessionFile } from "../paths.js"
import { ADMIN_RIGHTS, GROUP_SETTINGS, TelegramAdapter } from "../telegram/adapter.js"
import type { BotHistoryOptions, BotHistoryReader } from "../telegram/bot-history.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"
import type { UpdateEnvironment } from "../update.js"

export interface Environment extends BaseEnvironment {
  keyring?: KeyringStore
  update?: UpdateEnvironment
  /** Tests hand in a scripted Telegram. */
  adapter?: (
    options: { credentials: ApiCredentials; sessionPath: string } & ConnectOptions,
  ) => Adapter | Promise<Adapter>
  /** Tests hand in a machine for `service`, so no test runs systemctl or launchctl. */
  system?: ServerSystem
  /** Tests hand in a stand-in for Telegram's Bot API. */
  botFetch?: FetchLike
  botHistory?: (options: BotHistoryOptions) => Promise<BotHistoryReader>
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
      // Logging in again would register another device, and the same environment would lose it again.
      throw new CliError(
        "authentication_error",
        existsSync(sessionPath)
          ? `no Telegram app credentials found for profile "${profile}", although it has logged in on this machine — ` +
              "the keyring is probably out of reach (cron, ssh, an MCP client that trims the environment: set " +
              `XDG_RUNTIME_DIR); \`tg ${asFirstWord(profile)}doctor\` shows it. Log in again only if they were removed`
          : `no Telegram app credentials for profile "${profile}" — run ${login} first`,
      )
    }
    const options = { credentials: resolved, sessionPath, ...connecting }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({
          ...options,
          diagnostic: (line) => base.streams.diagnostic(line),
          verbose: base.settings.trace,
          login,
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

/** Shipped beside `dist/`; this file compiles to `dist/commands/context.js`. */
export const SKILL = new URL("../../skills/tg-cli/SKILL.md", import.meta.url)

/** Channels and supergroups number their own messages, so an id alone there names another message. */
const OWN_NUMBERING = ["channel", "supergroup", "gigagroup", "monoforum"]

export const TELEGRAM: Messenger = {
  app: TG,
  provider: "telegram",
  name: "Telegram",
  resolveSettings,
  connect: (command, base, options) => telegramOf(command, base).connect(options),
  chatArgument: "a chat: its title or part of it, its id, @username, or `me` for Saved Messages",
  groupSettings: GROUP_SETTINGS,
  addsWithHistory: false,
  knowsAccountAge: false,
  adminRights: ADMIN_RIGHTS,
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
  // Telegram names a deletion without its chat only where ids count per account. A chat stored by
  // its id alone has no kind yet, but `-100…` marks a channel's or a supergroup's.
  deletedWithoutChat: (chat) =>
    chat.kind !== "channel" &&
    !(chat.kind === "unknown" && chat.id.startsWith("-100")) &&
    !OWN_NUMBERING.includes(String(chat.providerMetadata?.chatType ?? "")),
  skill: SKILL,
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
