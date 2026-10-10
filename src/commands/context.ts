import { existsSync, statSync } from "node:fs"
import { dirname } from "node:path"
import { CliError, type KeyringStore } from "@wirecat/cli-core"
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
} from "@wirecat/cli-messaging/cli"
import type { Command } from "commander"
import { resolveSettings, TG } from "../app.js"
import type { FetchLike } from "../bot/transport.js"
import { isolated, sessionFile } from "../paths.js"
import { proxyLabel } from "../proxy.js"
import { ADMIN_RIGHTS, GROUP_SETTINGS, TelegramAdapter } from "../telegram/adapter.js"
import type { BotHistoryOptions, BotHistoryReader } from "../telegram/bot-history.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"
import { resolveProxy } from "../telegram/proxy.js"
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
  proxy: () => ReturnType<typeof resolveProxy>
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
  const proxy = () =>
    resolveProxy(base.settings, { env: base.env, ...(environment.keyring ? { keyring: environment.keyring } : {}) })
  const login = `\`tg ${asFirstWord(profile)}session start\``
  const setup = `\`tg ${asFirstWord(profile)}setup\``

  const open = async (given?: ApiCredentials, connecting: ConnectOptions = {}): Promise<Adapter> => {
    const resolved = given ?? credentials.read()
    if (!resolved) {
      const loggedIn = existsSync(sessionPath)
      // A service can start before the login keyring unlocks; its unit restarts on this code, not on 4.
      const unreachable = loggedIn && command.name() === "serve" ? "provider_unavailable" : "authentication_error"
      // Logging in again would register another device, and the same environment would lose it again.
      throw new CliError(
        unreachable,
        loggedIn
          ? `no Telegram app credentials found for profile "${profile}", although it has logged in on this machine — ` +
              "the keyring is probably out of reach (cron, ssh, an MCP client that trims the environment: set " +
              `XDG_RUNTIME_DIR); \`tg ${asFirstWord(profile)}doctor\` shows it. Log in again only if they were removed`
          : `no Telegram app credentials for profile "${profile}" — run ${setup} in a local terminal first; agents: read \`tg skill show\``,
      )
    }
    const options = { credentials: resolved, sessionPath, ...connecting }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({
          ...options,
          ...proxyOption(proxy()),
          diagnostic: (line) => base.streams.diagnostic(line),
          note: (line) => base.renderer.warn(line),
          verbose: base.settings.trace,
          login,
        })
  }

  const connect = async (options: ConnectOptions = {}): Promise<Adapter> => {
    if (!environment.adapter && !existsSync(sessionPath)) {
      throw new CliError(
        "authentication_error",
        `no session for profile "${profile}" — run ${setup} in a local terminal`,
      )
    }
    return open(undefined, options)
  }

  return { environment, sessionPath, credentials, open, connect, proxy }
}

/** Shipped beside `dist/`; this file compiles to `dist/commands/context.js`. */
export const SKILL = new URL("../../skills/tg-cli/SKILL.md", import.meta.url)

/** Channels and supergroups number their own messages, so an id alone there names another message. */
const OWN_NUMBERING = ["channel", "supergroup", "gigagroup", "monoforum"]

export const TELEGRAM: Messenger = {
  app: TG,
  provider: "telegram",
  counterFields: ["views", "reactions", "comments"],
  name: "Telegram",
  resolveSettings,
  connect: (command, base, options) => telegramOf(command, base).connect(options),
  chatArgument: "a chat: its title or part of it, its id, @username, or `me` for Saved Messages",
  groupSettings: GROUP_SETTINGS,
  mediaOptions: ["spoiler", "captionAbove", "fileName"],
  pollQuiz: true,
  pollVoters: true,
  topicShow: true,
  forwardTopic: true,
  // mtcute's InputMedia.poll documents 5–600 seconds.
  pollCloseSeconds: [5, 600],
  inviteLinkUpdate: true,
  html: true,
  folderRules: true,
  addsWithHistory: false,
  officialStats: true,
  serverSearch: true,
  knowsAccountAge: false,
  adminRights: ADMIN_RIGHTS,
  // Saved Messages is the chat with yourself, so its id is the account's.
  savedChatId: (account) => account.account,
  diagnose: async (command, base) => {
    const { sessionPath, credentials, proxy } = telegramOf(command, base)
    return {
      session: { path: sessionPath, exists: existsSync(sessionPath), files: sessionModes(sessionPath) },
      proxy: proxyState(proxy),
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
  const { sessionPath, credentials, open, proxy } = telegramOf(command, context)
  return {
    ...context,
    sessionPath,
    credentials,
    open,
    proxy,
    withTelegram: context.withMessenger,
  }
}

const octal = (mode: number) => `0${mode.toString(8)}`

/**
 * The session is a login as good as a password: it, SQLite's -wal and -shm beside it, and its folder
 * are the owner's alone. Only `stat`, so `doctor` never opens it; the fix is printed, never applied.
 */
export const sessionModes = (sessionPath: string, platform: NodeJS.Platform = process.platform) => {
  if (platform === "win32") return { checked: false, reason: "Windows has no Unix file modes" }
  const wanted: [string, number][] = [
    ...[sessionPath, `${sessionPath}-wal`, `${sessionPath}-shm`].map((path): [string, number] => [path, 0o600]),
    [dirname(sessionPath), 0o700],
  ]
  const problems = wanted.flatMap(([path, want]) => {
    if (!existsSync(path)) return []
    const mode = statSync(path).mode & 0o777
    if ((mode & 0o077) === 0) return []
    return [
      {
        path,
        mode: octal(mode),
        want: octal(want),
        fix: `chmod ${want.toString(8)} '${path.replaceAll("'", `'\\''`)}'`,
      },
    ]
  })
  return { checked: true, ok: problems.length === 0, problems }
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

export const proxyOption = (through: ReturnType<typeof resolveProxy>) => (through ? { proxy: through.proxy } : {})

/** The proxy in use without its password or secret, and whether the Bot API can follow it. */
const proxyState = (resolve: () => ReturnType<typeof resolveProxy>) => {
  try {
    const through = resolve()
    if (!through) return null
    return {
      url: proxyLabel(through.proxy),
      from: through.from,
      botApi:
        through.proxy.kind === "mtproxy" ? "direct: an MTProxy carries only Telegram's own protocol" : "through it",
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
