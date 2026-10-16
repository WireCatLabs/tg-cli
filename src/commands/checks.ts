import type { Check } from "../telegram/adapter.js"

/** Where a person checks after a write Telegram never answered, in tg's own words. */
const CHECK_COMMANDS: Record<Check, string> = {
  "account.sessions.list": "tg account sessions list",
  "chats.folders.list": "tg chats folders list",
  "chats.link.list": "tg chats link list",
  "chats.link.show": "tg chats link show",
  "chats.list": "tg chats list",
  "chats.members.list": "tg chats members list",
  "chats.requests.list": "tg chats requests list",
  "chats.show": "tg chats show",
  "polls.show": "tg polls show",
  "topics.list": "tg topics list",
}

export const checkWords = (check: Check): string => `\`${CHECK_COMMANDS[check]}\``
