import { type BotMessenger, BotTokenStore, environmentOf, type RunBotCommand } from "@leemour/cli-messaging/cli"
import { resolveSettings, TG } from "../app.js"
import { telegramBotAdapter } from "../bot/adapter.js"
import { BOT_ADMIN_RIGHTS } from "../bot/map.js"
import { TelegramBotTransport } from "../bot/transport.js"
import { type Environment, SKILL } from "./context.js"

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
  connect: async (command, token, { stop, events } = {}) => {
    const { botFetch } = environmentOf<Environment>(command)
    return telegramBotAdapter(
      new TelegramBotTransport({
        token,
        ...(botFetch ? { fetch: botFetch } : {}),
        ...(stop ? { signal: stop } : {}),
        ...(events ? { events } : {}),
      }),
    )
  },
  tokenStore: (command, profile) => {
    const { keyring, env } = environmentOf<Environment>(command)
    return new BotTokenStore({ app: TG, profile, ...(env ? { env } : {}), ...(keyring ? { keyring } : {}) })
  },
  mcp: { program: () => botMcpRun(), skill: SKILL },
}
