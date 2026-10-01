import { type BotMessenger, BotTokenStore, environmentOf } from "@leemour/cli-messaging/cli"
import { resolveSettings, TG } from "../app.js"
import { telegramBotAdapter } from "../bot/adapter.js"
import { TelegramBotTransport } from "../bot/transport.js"
import type { Environment } from "./context.js"

/** What the shared `bot` commands need from tg: a Telegram Bot API client, and the keyring a test hands in. */
export const TELEGRAM_BOT: BotMessenger = {
  app: TG,
  provider: "telegram-bot",
  name: "Telegram",
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
}
