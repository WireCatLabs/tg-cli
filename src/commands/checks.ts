import type { Check, Words } from "../telegram/adapter.js"

/** The commands tg's messages send a person to, in tg's own words. */
const CHECK_COMMANDS: Record<Check, string> = {
  "account.sessions.list": "tg account sessions list",
  "bot.auth.set": "tg bot auth set",
  "chats.folders.list": "tg chats folders list",
  "chats.link.create": "tg chats link create",
  "chats.link.list": "tg chats link list",
  "chats.link.show": "tg chats link show",
  "chats.list": "tg chats list",
  "chats.members.list": "tg chats members list",
  "chats.requests.list": "tg chats requests list",
  "chats.send-as": "tg chats send-as",
  "chats.show": "tg chats show",
  "config.set": "tg config set",
  doctor: "tg doctor",
  "polls.show": "tg polls show",
  "session.start": "tg session start",
  "topics.list": "tg topics list",
}

export const checkWords: Words = (check, args) => `\`${CHECK_COMMANDS[check]}${args === undefined ? "" : ` ${args}`}\``
