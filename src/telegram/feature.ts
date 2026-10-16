import { type InputPeerLike, Long, PeersIndex, type TelegramClient, Message as TgMessage, type tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import { type Message, type MessageHit, observedCounters } from "@wirecat/cli-core"
import { toCliError } from "./errors.js"
import { toMessage, toMessageHit } from "./map.js"

/** The commands an unknown outcome sends a person to; the command layer names them in its own words. */
export const CHECKS = [
  "account.sessions.list",
  "chats.folders.list",
  "chats.link.list",
  "chats.link.show",
  "chats.list",
  "chats.members.list",
  "chats.requests.list",
  "chats.show",
  "polls.show",
  "topics.list",
] as const
export type Check = (typeof CHECKS)[number]

/** What may have happened, where to look, and what to weigh before a repeat. */
export interface Unanswered {
  what: string
  check: Check
  after?: string
}

/** Without the command layer's words, a check is named by its command path alone. */
export const bareCheck = (check: Check): string => `\`${check.replaceAll(".", " ")}\``

export const unansweredText = ({ what, check, after }: Unanswered, words: (check: Check) => string): string =>
  `${what}; check ${words(check)}${after === undefined ? "" : ` ${after}`}`

/** What the features beside the adapter share: one client, one way to name a chat, one way to fail. */
export interface Feature {
  client: TelegramClient
  login: string | undefined
  inputOf: (reference: string) => Promise<InputPeerLike>
  call: <T>(work: () => Promise<T>) => Promise<T>
  /** A write with no id to repeat it by: no answer means it may have happened, and `what` says what to do. */
  write: <T>(what: string | Unanswered, work: () => Promise<T>) => Promise<T>
  unanswered: (error: unknown, what: string | Unanswered, details?: Record<string, unknown>) => unknown
}

/** No answer is not a refusal: the write may have reached Telegram. Anything else is left for `call` to map. */
export const unknownIfUnanswered = (error: unknown, what: string, details: Record<string, unknown> = {}): unknown => {
  const known = toCliError(error)
  if (known instanceof CliError && ["timeout", "network_error"].includes(known.code)) {
    return new CliError("outcome_unknown", `no answer from Telegram — ${what}`, { ...details, cause: known.code })
  }
  return error
}

/** `https://t.me/name`, `t.me/name` or `@name`, as the name alone. */
export const publicName = (link: string): string =>
  link
    .replace(/^(https?:\/\/)?(t\.me|telegram\.me)\//, "")
    .replace(/^@/, "")
    .replace(/[/?].*$/, "")

export const messageNumber = (id: string, rule = "`id<` takes a message id"): number => {
  if (!/^\d+$/.test(id)) throw new CliError("validation_error", `${rule}, got "${id}"`)
  return Number(id)
}

export const topicNumber = (id: string): number => {
  if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) {
    throw new CliError("validation_error", "--topic needs a positive Telegram topic id")
  }
  return Number(id)
}

export const parseSendId = (typed: string): Long => {
  if (!/^-?\d{1,20}$/.test(typed))
    throw new CliError("validation_error", "--operation-id is the number a failed send printed")
  return Long.fromString(typed)
}

export const forwardedCopy = (updates: tl.TypeUpdates): TgMessage | undefined => {
  if (updates._ !== "updates" && updates._ !== "updatesCombined") return undefined
  const update = updates.updates.find((one) => one._ === "updateNewMessage" || one._ === "updateNewChannelMessage")
  return update && "message" in update ? new TgMessage(update.message, PeersIndex.from(updates)) : undefined
}

export const remoteMessage = (message: TgMessage): Message =>
  observedCounters(toMessage(message), new Date().toISOString(), ["views", "reactions", "comments"])

export const remoteHit = (message: TgMessage, source: "remote_fetch" | "remote_update"): MessageHit => ({
  ...toMessageHit(message),
  ...observedCounters(toMessage(message), new Date().toISOString(), ["views", "reactions", "comments"], source),
})
