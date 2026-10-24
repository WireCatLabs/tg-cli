import { FileLocation, Long, PeersIndex, Message as TgMessage, tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { TextSpan } from "@wirecat/cli-core"
import {
  type Attachment,
  type Chat,
  type CounterField,
  type Markup,
  type Message,
  type MessageHit,
  observedCounters,
  type Page,
} from "@wirecat/cli-core"
import type { After, Download, SendOptions, ServerQuery, Transcript } from "@wirecat/cli-core/cli"
import { checkAlbum, sendAlbum } from "./albums.js"
import { toCliError } from "./errors.js"
import {
  type Feature,
  forwardedCopy,
  messageNumber,
  parseSendId,
  remoteHit,
  remoteMessage,
  repeatWith,
  retryDetails,
  type Sent,
  topicNumber,
  unknownIfUnanswered,
} from "./feature.js"
import { attachmentsOf, checkSpoiler, peerToChat, toFormatted, toInputMedia, toMessage } from "./map.js"
import { sendAsPeer } from "./send-as.js"
import { uploadAttachment } from "./upload.js"

/** The Bot API's deleteMessages cap; assumed for MTProto's getMessages and deleteMessages, not checked against Telegram. */
const BY_ID_BATCH = 100

export const TRANSCRIBE_POLL_MS = 2000
const TRANSCRIBE_WAIT_MS = 60_000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const history = (
  feature: Feature,
  reference: string,
  { limit, before }: { limit: number; before?: string },
): Promise<Page<Message>> => {
  return feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const offset = before === undefined ? undefined : { id: messageNumber(before), date: 0 }
    const page = await feature.client.getHistory(peer, { limit, ...(offset ? { offset } : {}) })
    // mtcute drops deleted entries and the inexact-count flag. Its iterator follows next, never total.
    return { items: page.map(remoteMessage).reverse(), hasMore: page.next !== undefined }
  })
}

/**
 * Forward from a message or a moment: `reverse` reads upwards from the offset, inclusive, so an id
 * starts one past it. The filter keeps a date offset honest — Telegram places it, it does not cut at it.
 */
export const historyAfter = (
  feature: Feature,
  reference: string,
  { limit, after }: { limit: number; after: After },
): Promise<Page<Message>> => {
  const offset =
    "id" in after
      ? { id: messageNumber(after.id, "`id>` takes a message id") + 1, date: 0 }
      : { id: 0, date: Math.floor(after.time / 1000) }
  const newer = (message: Message) =>
    "id" in after ? Number(message.id) > Number(after.id) : Date.parse(message.timestamp) > after.time
  return feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const page = await feature.client.getHistory(peer, { limit, reverse: true, offset })
    // As history(): a short page is no end, deleted entries are dropped from it; only an empty one is.
    return { items: page.map(remoteMessage).filter(newer), hasMore: page.next !== undefined }
  })
}

/** One person's newest messages in a chat: Telegram's search by sender, newest first, answered oldest first. */
export const historyFrom = (
  feature: Feature,
  reference: string,
  person: string,
  { limit }: { limit: number },
): Promise<Page<Message>> => {
  return feature.call(async () => {
    const [chatId, fromUser] = await Promise.all([feature.inputOf(reference), feature.inputOf(person)])
    const page = await feature.client.searchMessages({ chatId, fromUser, limit })
    return { items: page.map(remoteMessage).reverse(), hasMore: page.total > page.length }
  })
}

/** Back from a moment, newest first as Telegram reads, answered oldest first. The filter cuts at the moment itself. */
export const historyBefore = (
  feature: Feature,
  reference: string,
  { limit, time }: { limit: number; time: number },
): Promise<Page<Message>> => {
  return feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const page = await feature.client.getHistory(peer, { limit, offset: { id: 0, date: Math.floor(time / 1000) } })
    const older = page.map(remoteMessage).filter((message) => Date.parse(message.timestamp) < time)
    return { items: older.reverse(), hasMore: page.next !== undefined }
  })
}

/**
 * Telegram's own text search, newest first: in one chat with `chat`, in every chat otherwise. Its
 * matching is undocumented, so the answer is candidates for the store's strict query.
 */
export const searchMessages = (
  feature: Feature,
  query: ServerQuery,
  { limit, signal }: { limit: number; signal?: AbortSignal },
): Promise<Page<MessageHit> & { chats: Chat[] }> => {
  return feature.call(async () => {
    const seconds = (ms?: number) => (ms === undefined ? 0 : Math.floor(ms / 1000))
    const common = {
      q: query.text,
      filter: { _: "inputMessagesFilterEmpty" as const },
      minDate: seconds(query.minDate),
      maxDate: seconds(query.maxDate),
      limit,
    }
    // The raw call, because only it takes these: a flood wait is answered at once instead of slept
    // through, and the search's time bound cancels the request rather than leaving it to hold the connection.
    const options = { floodSleepThreshold: 0, ...(signal ? { abortSignal: signal } : {}) }
    const found =
      query.chat === undefined
        ? await feature.client.call(
            {
              _: "messages.searchGlobal",
              ...common,
              offsetRate: 0,
              offsetPeer: { _: "inputPeerEmpty" },
              offsetId: 0,
            },
            options,
          )
        : await feature.client.call(
            {
              _: "messages.search",
              ...common,
              peer: await feature.client.resolvePeer(await feature.inputOf(query.chat)),
              ...(query.from === undefined
                ? {}
                : { fromId: await feature.client.resolvePeer(await feature.inputOf(query.from)) }),
              offsetId: 0,
              addOffset: 0,
              maxId: 0,
              minId: 0,
              hash: Long.ZERO,
            },
            options,
          )
    if (found._ === "messages.messagesNotModified") return { items: [], hasMore: false, chats: [] }
    const peers = PeersIndex.from(found)
    const page = found.messages.filter((one) => one._ !== "messageEmpty").map((one) => new TgMessage(one, peers))
    const chats = new Map(page.map((message) => [String(message.chat.id), peerToChat(message.chat)]))
    return {
      items: page.map((message) => remoteHit(message, "remote_fetch")),
      hasMore: page.length === limit,
      chats: [...chats.values()],
    }
  })
}

export const around = (
  feature: Feature,
  reference: string,
  messageId: string,
  { before, after }: { before: number; after: number },
) => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const page = await feature.client.getHistory(peer, {
      offset: { id: id + 1, date: 0 },
      addOffset: -after,
      limit: before + 1 + after,
    })
    const items = page.map(remoteMessage).reverse()
    const index = items.findIndex((message) => message.id === String(id))
    if (index < 0) throw new CliError("not_found", `no message ${id} in that chat`)
    return items
      .slice(Math.max(0, index - before), index + after + 1)
      .map((message) => (message.id === String(id) ? { ...message, anchor: true as const } : message))
  })
}

/**
 * One request: history from just above the message, shifted `after` messages newer. Telegram's
 * offset id is exclusive, hence the `+ 1`; ids are not contiguous, so the window is cut by position.
 */
export const fetchCounters = (
  feature: Feature,
  reference: string,
  messageId: string,
  fields: readonly CounterField[],
  signal?: AbortSignal,
) => {
  const id = messageNumber(messageId)
  return feature.call(async () => {
    signal?.throwIfAborted()
    const [found] = await feature.client.getMessages(await feature.inputOf(reference), [id])
    signal?.throwIfAborted()
    return found ? (observedCounters(toMessage(found), new Date().toISOString(), fields).counterObservations ?? {}) : {}
  })
}

export const permalink = (feature: Feature, chatId: string, messageId: string) => {
  const id = messageNumber(messageId, "a message id is a positive Telegram integer")
  if (id <= 0 || id > 2147483647) throw new CliError("validation_error", "a message id is a positive Telegram integer")
  return feature.call(async () => {
    const input = await feature.inputOf(chatId)
    const [found] = await feature.client.getMessages(input, [id])
    if (!found || found.id !== id) throw new CliError("not_found", "that message no longer exists in this chat")
    const peer = await feature.client.getPeer(input)
    if (peer.type !== "chat" || peer.raw._ !== "channel")
      return { url: null, access: "unavailable" as const, reason: "unsupported_chat" as const }
    const { link } = await feature.client.call({
      _: "channels.exportMessageLink",
      channel: await feature.client.resolveChannel(input),
      id,
      thread: true,
    })
    const url = new URL(link)
    const known = ["t.me", "telegram.me", "telegram.dog"].includes(url.hostname)
    const access = !known
      ? ("unknown" as const)
      : url.pathname.startsWith("/c/")
        ? ("restricted" as const)
        : ("public" as const)
    return { url: link, access, reason: null }
  })
}

export const scheduled = (feature: Feature, reference: string): Promise<Message[]> => {
  return feature.call(async () => {
    const queued = await feature.client.getAllScheduledMessages(await feature.inputOf(reference))
    return queued.map(toMessage).sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  })
}

export const saveDraft = (
  feature: Feature,
  chatId: string,
  text: string,
  { replyTo, threadId, formatting, noPreview }: Pick<SendOptions, "replyTo" | "threadId" | "formatting" | "noPreview">,
): Promise<void> => {
  if (text.trim() === "")
    throw new CliError("validation_error", "a draft needs nonempty text; clearing is not supported")
  const thread = threadId === undefined || threadId === "1" ? undefined : topicNumber(threadId)
  const answering = replyTo === undefined ? thread : messageNumber(replyTo, "a message id is a number")
  const body = toFormatted(text, formatting ?? [])
  return feature.write("the draft may have been saved — repeating it is safe", () =>
    feature.client.saveDraft(Number(chatId), {
      message: body.text,
      entities: body.entities,
      ...(noPreview ? { noWebpage: true } : {}),
      ...(answering === undefined
        ? {}
        : { replyTo: { _: "inputReplyToMessage", replyToMsgId: answering, ...(thread ? { topMsgId: thread } : {}) } }),
    }),
  )
}

/**
 * One logical send carries one `random_id`, made before the request and repeated by a retry:
 * Telegram delivers one message for both (measured 2026-09-27, across two connections).
 */
export const send = (
  feature: Feature,
  chatId: string,
  text: string,
  {
    sendId,
    replyTo,
    threadId,
    silent,
    noPreview,
    markup,
    formatting,
    at,
    attachments = [],
    sendAs,
    spoiler,
    captionAbove,
  }: SendOptions,
): Promise<Sent> => {
  const id = parseSendId(sendId)
  const thread = threadId === undefined ? undefined : topicNumber(threadId)
  const answering = replyTo === undefined ? undefined : messageNumber(replyTo, "a message id is a number")
  const author = sendAs === undefined ? undefined : sendAsPeer(chatId, sendAs, feature.self(), feature.checks)
  if (attachments.length > 1) checkAlbum(attachments, spoiler)
  const spans = formatting ?? markup
  const body = spans ? toFormatted(text, spans) : text
  const common = {
    randomId: id,
    ...(thread === undefined || thread === 1 ? {} : { threadId: thread }),
    ...(answering === undefined ? {} : { replyTo: answering }),
    ...(silent ? { silent } : {}),
    ...(at === undefined ? {} : { schedule: new Date(at) }),
    ...(author === undefined ? {} : { sendAs: author }),
  }
  if (attachments.length > 1)
    return sendAlbum(feature, chatId, text, {
      sendId,
      replyTo,
      threadId,
      silent,
      formatting: spans,
      at,
      attachments,
      sendAs,
      spoiler,
      captionAbove,
    })
  return feature.send(async () => {
    const [attachment] = attachments
    if (spoiler && attachment) checkSpoiler(attachment)
    const media = attachment
      ? toInputMedia(attachment, body, await uploadAttachment(feature.client, attachment), { spoiler })
      : undefined
    try {
      const message = media
        ? await feature.client.sendMedia(Number(chatId), media, {
            ...common,
            ...(captionAbove ? { invert: true } : {}),
          })
        : await feature.client.sendText(Number(chatId), body, {
            ...common,
            ...(noPreview ? { disableWebPreview: true } : {}),
          })
      return { message: toMessage(message), sendId }
    } catch (error) {
      throw unknownIfUnanswered(
        error,
        `the message may have been sent. Repeat with ${repeatWith(sendId, sendAs)}, never without it`,
        retryDetails(sendId, sendAs),
      )
    }
  })
}

/**
 * An edit has no `random_id`, but setting the same text twice is harmless: Telegram answers the
 * repeat with MESSAGE_NOT_MODIFIED, taken here as done — so a retry after an unknown outcome is safe.
 */
export const edit = (
  feature: Feature,
  chatId: string,
  messageId: string,
  text: string,
  { markup, formatting }: { markup?: Markup[]; formatting?: TextSpan[] } = {},
): Promise<Message> => {
  const id = messageNumber(messageId, "a message id is a number")
  const spans = formatting ?? markup
  const body = spans ? toFormatted(text, spans) : text
  return feature.call(async () => {
    try {
      return toMessage(await feature.client.editMessage({ chatId: Number(chatId), message: id, text: body }))
    } catch (error) {
      if (tl.RpcError.is(error, "MESSAGE_NOT_MODIFIED")) {
        const [current] = await feature.client.getMessages(Number(chatId), [id])
        if (current) return toMessage(current)
      }
      throw unknownIfUnanswered(error, "the edit may have been made — repeating it is safe")
    }
  })
}

/**
 * The raw call, because mtcute's `forwardMessagesById` draws the `random_id` itself: a retry has to
 * repeat the first one for Telegram to keep one copy, as a send does.
 */
export const forward = (
  feature: Feature,
  fromChatId: string,
  messageId: string,
  toChatId: string,
  { sendId, silent, sendAs, threadId }: { sendId: string; silent?: boolean; sendAs?: string; threadId?: string },
): Promise<Message> => {
  const id = messageNumber(messageId, "a message id is a number")
  const randomId = parseSendId(sendId)
  const thread = threadId === undefined ? undefined : topicNumber(threadId)
  const author = sendAs === undefined ? undefined : sendAsPeer(toChatId, sendAs, feature.self(), feature.checks)
  return feature.send(async () => {
    try {
      const updates = await feature.client.call({
        _: "messages.forwardMessages",
        fromPeer: await feature.client.resolvePeer(Number(fromChatId)),
        toPeer: await feature.client.resolvePeer(Number(toChatId)),
        id: [id],
        randomId: [randomId],
        ...(silent ? { silent } : {}),
        ...(thread === undefined || thread === 1 ? {} : { topMsgId: thread }),
        ...(author === undefined ? {} : { sendAs: await feature.client.resolvePeer(author) }),
      })
      feature.client.handleClientUpdate(updates, true)
      const copy = forwardedCopy(updates, randomId, toChatId)
      if (!copy) throw new CliError("provider_error", "Telegram answered the forward without the new message")
      return toMessage(copy)
    } catch (error) {
      throw unknownIfUnanswered(
        error,
        `the message may have been forwarded. Repeat with ${repeatWith(sendId, sendAs)}, never without it`,
        retryDetails(sendId, sendAs),
      )
    }
  })
}

/** In a one-to-one chat the pin is on the owner's side only; `notify` reaches groups alone, as Telegram has it. */
export const pin = (
  feature: Feature,
  chatId: string,
  messageId: string,
  { notify }: { notify: boolean },
): Promise<void> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.write("the pin may have been made — repeating it is safe", async () => {
    await feature.client.pinMessage({ chatId: Number(chatId), message: id, notify })
  })
}

export const unpin = (feature: Feature, chatId: string, messageId: string): Promise<void> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.write("the message may have been unpinned — repeating it is safe", async () => {
    await feature.client.unpinMessage({ chatId: Number(chatId), message: id })
  })
}

/**
 * Telegram sets the owner's reactions as a whole, so one emoji replaces what was there. An emoji the
 * chat does not allow, or a second one without Premium, comes back as Telegram's refusal.
 */
export const react = (feature: Feature, chatId: string, messageId: string, emoji: string | null): Promise<void> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.write("the reaction may have been set — repeating it is safe", async () => {
    await feature.client.sendReaction({ chatId: Number(chatId), message: id, emoji })
  })
}

/** Up to `until`, or everything; mentions stay, as Telegram's own clients leave them until they are seen. */
export const markRead = (feature: Feature, chatId: string, until?: string): Promise<void> => {
  const maxId = until === undefined ? undefined : messageNumber(until, "--until takes a message id")
  return feature.write("the chat may have been marked read — repeating it is safe", async () => {
    await feature.client.readHistory(Number(chatId), maxId === undefined ? {} : { maxId })
  })
}

/**
 * mtcute deletes for everyone unless told otherwise, so `revoke` is always passed. In a supergroup or
 * a channel Telegram has no "for me": a deletion there is for everyone, and without `forEveryone` it is refused.
 *
 * **Outside a channel the ids are checked against the chat first.** Telegram numbers private-chat and
 * basic-group messages per account and `messages.deleteMessages` takes no chat, so an id from another
 * chat — or the other side's number for the same message — deletes whatever this account has under it
 * (SEC-30). `getMessages` answers null for an id that is not in the chat it was given.
 */
export const deleteMessages = async (
  feature: Feature,
  chatId: string,
  messageIds: string[],
  { forEveryone }: { forEveryone: boolean },
): Promise<void> => {
  const ids = messageIds.map((id) => messageNumber(id, "a message id is a number"))
  const peer = await feature.call(async () => {
    const peer = await feature.client.resolvePeer(Number(chatId))
    if (peer._ === "inputPeerChannel") {
      if (!forEveryone) {
        throw new CliError(
          "validation_error",
          "in a supergroup or a channel Telegram deletes for everyone — add --for-everyone if that is what you want",
        )
      }
      return peer
    }
    const found: unknown[] = []
    for (let at = 0; at < ids.length; at += BY_ID_BATCH)
      for (const one of await feature.client.getMessages(peer, ids.slice(at, at + BY_ID_BATCH))) found.push(one)
    const missing = ids.filter((_, index) => found[index] == null)
    if (missing.length > 0) {
      throw new CliError(
        "validation_error",
        `no message ${missing.join(", ")} in chat ${chatId} — not in this chat, or already deleted; nothing was deleted`,
      )
    }
    return peer
  })
  return feature.write("the messages may have been deleted — repeating it is safe", async () => {
    for (let at = 0; at < ids.length; at += BY_ID_BATCH)
      await feature.client.deleteMessagesById(peer, ids.slice(at, at + BY_ID_BATCH), { revoke: forEveryone })
  })
}

/** The message is fetched again, never taken from the store: Telegram's file references expire. */
export const download = (feature: Feature, reference: string, messageId: string): Promise<Download> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(async () => {
    const [found] = await feature.client.getMessages(await feature.inputOf(reference), id)
    if (!found) throw new CliError("not_found", `no message ${id} in that chat`)
    const media = found.media
    if (!media) return { files: [], skipped: [] }
    if (!(media instanceof FileLocation)) return { files: [], skipped: [media.type] }
    const [{ kind, name, mime, size }] = attachmentsOf(media) as [Attachment]
    const client = feature.client
    const { login, checks } = feature
    async function* bytes() {
      try {
        yield* client.downloadAsIterable(media as FileLocation)
      } catch (error) {
        throw toCliError(error, checks, login)
      }
    }
    return { files: [{ kind, name, mime, size, bytes }], skipped: [] }
  })
}

/**
 * Telegram's own speech recognition; mtcute has no high-level method for `messages.transcribeAudio`.
 * A first answer is usually still pending. The finished text arrives as an update, which a one-shot
 * connection does not receive, but asking again returns it — measured 2026-09-29 on a 19 s voice note.
 */
export const transcribe = (feature: Feature, reference: string, messageId: string): Promise<Transcript> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(async () => {
    const peer = await feature.client.resolvePeer(await feature.inputOf(reference))
    const deadline = Date.now() + TRANSCRIBE_WAIT_MS
    for (;;) {
      const answer = await feature.client
        .call({ _: "messages.transcribeAudio", peer, msgId: id })
        .catch((error: unknown) => {
          if (!tl.RpcError.is(error, "PREMIUM_ACCOUNT_REQUIRED")) throw error
          throw new CliError(
            "permission_error",
            "Telegram transcribes only for Premium accounts, or a few messages a week on the free trial, used up now",
            { provider_error: error.text, status: error.code },
          )
        })
      if (answer.pending !== true || Date.now() >= deadline) {
        return { text: answer.text, pending: answer.pending === true }
      }
      await sleep(TRANSCRIBE_POLL_MS)
    }
  })
}
