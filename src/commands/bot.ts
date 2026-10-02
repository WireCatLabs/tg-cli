import { existsSync } from "node:fs"
import { CliError } from "@leemour/cli-core"
import {
  type BotMessenger,
  BotTokenStore,
  botCopy,
  environmentOf,
  type RunBotCommand,
} from "@leemour/cli-messaging/cli"
import { resolveSettings, TG } from "../app.js"
import { telegramBotAdapter } from "../bot/adapter.js"
import { BOT_ADMIN_RIGHTS } from "../bot/map.js"
import { TelegramBotTransport } from "../bot/transport.js"
import { botSessionFile, sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { openBotHistory } from "../telegram/bot-history.js"
import { apiCredentials } from "../telegram/credentials.js"
import { type Adapter, type Environment, SKILL } from "./context.js"

/** tg's `run` as the shared bot MCP server calls it; a test adds its keyring and Bot API stand-in as `extra`. */
export const botMcpRun = async (extra: Environment = {}): Promise<RunBotCommand> => {
  // Loaded when the server starts: the program imports this file.
  const { run } = await import("../program.js")
  return (argv, environment) => run(argv, { ...extra, ...environment })
}

/** What the shared `bot` commands need from tg: a Telegram Bot API client, and the keyring a test hands in. */
export const TELEGRAM_BOT: BotMessenger = {
  app: TG,
  provider: "telegram-bot",
  name: "Telegram",
  adminRights: BOT_ADMIN_RIGHTS,
  resolveSettings,
  fetching: {
    page: 100,
    pause: "1s",
    maxPages: 10,
    orderBy: "id",
    from: "start at this message link, inclusive; otherwise use the newest message already known",
  },
  connect: async (command, token, { stop, events, history, track } = {}) => {
    const environment = environmentOf<Environment>(command)
    const { botFetch } = environment
    const adapter = telegramBotAdapter(
      new TelegramBotTransport({
        token,
        ...(botFetch ? { fetch: botFetch } : {}),
        ...(stop ? { signal: stop } : {}),
        ...(events ? { events } : {}),
      }),
    )
    if (!history) return adapter
    const env = environment.env ?? process.env
    const { profile } = resolveSettings(command.optsWithGlobals(), { env, kind: "bot" })
    const readCredentials = (profile: string) =>
      apiCredentials({ profile, env, ...(environment.keyring ? { keyring: environment.keyring } : {}) }).read()
    const credentials = readCredentials(profile) ?? readCredentials("default")
    if (!credentials)
      throw new CliError(
        "authentication_error",
        "bot store fetch needs Telegram app credentials — run `tg session start` first, or set TG_API_ID and TG_API_HASH",
      )
    const botId = token.split(":", 1)[0] ?? ""
    if (!/^\d+$/.test(botId)) throw new CliError("authentication_error", "the bot token has no valid bot id")
    const reader = await (environment.botHistory ?? openBotHistory)({
      credentials,
      sessionPath: botSessionFile(profile, botId, env),
      token,
      ...history,
      ...(stop ? { stop } : {}),
      ...(events ? { events } : {}),
      ...(track ? { track } : {}),
      newest: async (chat) => {
        const copy = botCopy("telegram-bot")
        const known = await copy.read((store) => store.messages(copy.accountOf(botId), chat, { limit: 1 }))
        if (known.items[0]) return known.items[0].id
        const personalPath = sessionFile("default", env)
        if (!existsSync(personalPath) && !environment.adapter) return undefined
        let personal: Adapter | TelegramAdapter | undefined
        try {
          personal = environment.adapter
            ? await environment.adapter({ credentials, sessionPath: personalPath })
            : await TelegramAdapter.open({ credentials, sessionPath: personalPath })
          track?.(personal)
          return (await personal.history?.(chat, { limit: 1 }))?.items[0]?.id
        } catch {
          return undefined
        } finally {
          await personal?.close()
        }
      },
    })
    return { ...adapter, historyBefore: reader.historyBefore, close: reader.close }
  },
  tokenStore: (command, profile) => {
    const { keyring, env } = environmentOf<Environment>(command)
    return new BotTokenStore({ app: TG, profile, ...(env ? { env } : {}), ...(keyring ? { keyring } : {}) })
  },
  mcp: { program: () => botMcpRun(), skill: SKILL },
}
