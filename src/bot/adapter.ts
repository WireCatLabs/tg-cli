import type { BotAdapter } from "@leemour/cli-messaging/cli"
import type { TelegramBotTransport } from "./transport.js"

/** Telegram's [User](https://core.telegram.org/bots/api#user), the fields read here. */
interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

/** A Telegram bot behind the shared bot port. Ids are at most 52 bits, so a number is exact; the port takes strings. */
export const telegramBotAdapter = (transport: TelegramBotTransport): BotAdapter => ({
  me: async () => {
    const bot = (await transport.call("getMe")) as User
    return {
      id: String(bot.id),
      name: [bot.first_name, bot.last_name].filter(Boolean).join(" ") || null,
      username: bot.username ?? null,
    }
  },
  close: async () => {},
})
