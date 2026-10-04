import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { setTimeout as sleep } from "node:timers/promises"
import { CliError, isCliError } from "@leemour/cli-core"
import type { BotAdapter, EventSink } from "@leemour/cli-messaging/cli"
import { getMarkedPeerId, Long, MtPeerNotFoundError, TelegramClient } from "@mtcute/node"
import { links } from "@mtcute/node/utils.js"
import type { ProxyServer } from "../proxy.js"
import type { ApiCredentials } from "./credentials.js"
import { toCliError } from "./errors.js"
import { toHistoryChannel, toHistoryMessages } from "./map.js"
import { proxiedTransport } from "./proxy.js"
import { openSessionStorage } from "./storage.js"

export type BotHistoryReader = Required<Pick<BotAdapter, "historyBefore" | "close">>

export interface BotHistoryOptions {
  credentials: ApiCredentials
  sessionPath: string
  token: string
  from?: string
  newest: (chat: string) => Promise<string | undefined>
  pauseMs: number
  stop?: AbortSignal
  events?: EventSink
  track?: (reader: Pick<BotHistoryReader, "close">) => void
  proxy?: ProxyServer
}

const numberOf = (id: string, maximum = 2_147_483_647): number => {
  const number = Number(id)
  if (!/^\d+$/.test(id) || !Number.isInteger(number) || number < 1 || number > maximum)
    throw new CliError("validation_error", "a Telegram message number must be between 1 and 2147483647")
  return number
}

const channelNumber = (chat: string): number => {
  const id = Number(chat)
  if (!/^-\d+$/.test(chat) || !Number.isSafeInteger(id) || id >= -1_000_000_000_000)
    throw new CliError(
      "validation_error",
      "bot store fetch supports channels and supergroups only; private chats and basic groups share " +
        "one message numbering across all of the bot's chats",
    )
  return id
}

const historyError = (error: unknown) => {
  const mapped = toCliError(error, "`tg bot auth set`")
  if (isCliError(mapped)) return mapped
  return new CliError(
    error instanceof Error && error.name === "AbortError" ? "cancelled" : "provider_error",
    "Telegram history read did not finish",
  )
}

export const openBotHistory = async (options: BotHistoryOptions): Promise<BotHistoryReader> => {
  mkdirSync(dirname(options.sessionPath), { recursive: true, mode: 0o700 })
  const proxied = options.proxy ? proxiedTransport(options.proxy) : undefined
  const client = new TelegramClient({
    ...(proxied ? { transport: proxied.transport } : {}),
    apiId: options.credentials.id,
    apiHash: options.credentials.hash,
    storage: await openSessionStorage(options.sessionPath),
    disableUpdates: true,
    logLevel: 0,
  })
  client.log.mgr.handler = () => {}
  let closing: Promise<void> | undefined
  const close = () => (closing ??= client.destroy())
  options.track?.({ close })
  try {
    const starting = client.start({ botToken: options.token, ...(options.stop ? { abortSignal: options.stop } : {}) })
    const self = await (proxied ? Promise.race([starting, proxied.failed]) : starting)
    if (!self.isBot || String(self.id) !== options.token.split(":", 1)[0])
      throw new CliError("authentication_error", "the history session belongs to a different bot")
  } catch (error) {
    await close()
    throw historyError(error)
  }

  const channelOf = async (chatId: number) => {
    try {
      return await client.resolveChannel(chatId)
    } catch (error) {
      if (!(error instanceof MtPeerNotFoundError)) throw error
      const id = -chatId - 1_000_000_000_000
      // A bot can resolve its joined channels with a zero hash, without reading updates.
      const result = await client.call(
        { _: "channels.getChannels", id: [{ _: "inputChannel", channelId: id, accessHash: Long.ZERO }] },
        { floodSleepThreshold: 0 },
      )
      const channel = toHistoryChannel(result.chats, id)
      if (!channel) throw new CliError("permission_error", "this bot cannot access that channel or supergroup")
      return channel
    }
  }

  let pending: { chat: string; before: string | undefined; next: number } | undefined
  return {
    close,
    historyBefore: async (chat, window) => {
      try {
        const chatId = channelNumber(chat)
        const channel = await channelOf(chatId)
        let before = window.before === undefined ? undefined : numberOf(window.before, 2_147_483_648)
        if (pending?.chat === chat && pending.before === window.before) before = pending.next
        if (before === undefined) {
          let newest: string | undefined
          if (options.from !== undefined) {
            let link: ReturnType<typeof links.message.parse>
            try {
              link = links.message.parse(options.from)
            } catch {
              link = null
            }
            if (!link || link.commentId !== undefined)
              throw new CliError(
                "validation_error",
                "--from takes a channel or supergroup message link, without comments",
              )
            const linkedId =
              "username" in link
                ? getMarkedPeerId(await client.resolvePeer(link.username))
                : -1_000_000_000_000 - link.channelId
            if (linkedId !== chatId)
              throw new CliError("validation_error", "--from names a message in a different chat")
            newest = String(link.id)
          } else newest = await options.newest(chat)
          if (newest === undefined)
            throw new CliError(
              "validation_error",
              "no newest message number is known for this chat — give --from <message link>, or keep a bot update first",
            )
          before = numberOf(newest) + 1
        }
        let cursor: number = before
        while (cursor > 1) {
          options.stop?.throwIfAborted()
          const low = Math.max(1, cursor - Math.min(100, window.limit))
          const ids = Array.from({ length: cursor - low }, (_, index) => ({
            _: "inputMessageID" as const,
            id: cursor - index - 1,
          }))
          options.events?.({ event: "request", operation: "bot.history", counts: { ids: ids.length } })
          const result = await client.call({ _: "channels.getMessages", channel, id: ids }, { floodSleepThreshold: 0 })
          if (result._ === "messages.messagesNotModified")
            throw new CliError("provider_error", "Telegram returned no message page for this id range")
          const items = toHistoryMessages(result).sort((a, b) => Number(b.id) - Number(a.id))
          options.events?.({
            event: "response",
            operation: "bot.history",
            outcome: "ok",
            counts: { messages: items.length },
          })
          if (items.length > 0) {
            pending = undefined
            return { items, hasMore: low > 1 }
          }
          cursor = low
          pending = { chat, before: window.before, next: cursor }
          if (cursor > 1) await sleep(options.pauseMs, undefined, options.stop ? { signal: options.stop } : {})
        }
        pending = undefined
        return { items: [], hasMore: false }
      } catch (error) {
        throw historyError(error)
      }
    },
  }
}
