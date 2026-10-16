import { chmodSync, existsSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { format } from "node:util"
import {
  FileLocation,
  type InputPeerLike,
  Long,
  PeersIndex,
  TelegramClient,
  Message as TgMessage,
  type Poll as TgPoll,
  tl,
} from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { TextSpan } from "@wirecat/cli-core"
import {
  type AccountSession,
  type AdminRight,
  type Attachment,
  type Chat,
  type ChatCard,
  type ChatEvents,
  type CounterField,
  type Discussion,
  type Folder,
  type FolderChange,
  type FolderRules,
  type GroupCard,
  type GroupChange,
  type GroupMember,
  type InviteLinkChange,
  type LinkTarget,
  type Markup,
  type Member,
  type Message,
  type MessageEvent,
  type MessageHit,
  type OfficialChatStats,
  observedCounters,
  type Page,
  type PersonCard,
  type PhoneBookEntry,
  type Poll,
  type ProfileFacts,
  pickChat,
  type SenderIdentity,
  type Topic,
  type TopicChange,
} from "@wirecat/cli-core"
import type {
  After,
  Download,
  ForumState,
  MessengerAdapter,
  NewPoll,
  SendOptions,
  ServerQuery,
  Transcript,
} from "@wirecat/cli-core/cli"
import { uploadBlob } from "@wirecat/cli-core/sends"
import type { ProxyServer } from "../proxy.js"
import { commentsOf, discussionOf } from "./comments.js"
import * as contacts from "./contacts.js"
import type { ApiCredentials } from "./credentials.js"
import { backgroundError, toCliError } from "./errors.js"
import {
  bareCheck,
  type Check,
  type Feature,
  forwardedCopy,
  messageNumber,
  parseSendId,
  remoteHit,
  remoteMessage,
  topicNumber,
  type Unanswered,
  unansweredText,
  unknownIfUnanswered,
} from "./feature.js"
import * as folders from "./folders.js"
import { formatHtml } from "./format-html.js"
import { formatMarkdown } from "./format-markdown.js"
import * as groups from "./groups.js"
import * as login from "./login.js"
import {
  type Account,
  answerId,
  attachmentsOf,
  checkSpoiler,
  peerToChat,
  toAccount,
  toChat,
  toFormatted,
  toInputMedia,
  toInputPoll,
  toMember,
  toMessage,
  toPoll,
} from "./map.js"
import { pollVotersOf } from "./poll-voters.js"
import { refuseClose, refuseVote } from "./polls.js"
import { proxiedTransport } from "./proxy.js"
import { savedSenderOf, sendAsIdentities, sendAsPeer } from "./send-as.js"
import { middlewaresOf, sending } from "./sending.js"
import { type GraphOf, toOfficialChannelStats, toOfficialGraph, toOfficialGroupStats } from "./stats.js"
import { openSessionStorage } from "./storage.js"
import * as topics from "./topics.js"
import { uploadAttachment } from "./upload.js"
import * as watching from "./watch.js"

export type { Check } from "./feature.js"
export { ADMIN_RIGHTS, GROUP_SETTINGS } from "./groups.js"
export type { LoginPrompts } from "./login.js"
export { HEARTBEAT_TICKS, LOOP_CHECK_MS, STATE_WAIT_MS } from "./watch.js"

export interface AdapterOptions {
  credentials: ApiCredentials
  sessionPath: string
  /** Where the library's own log lines go, when asked for. Never stdout. */
  diagnostic?: (line: string) => void
  verbose?: boolean
  /** Receive updates — only `watch` and `serve` ask. */
  listen?: boolean
  /** Fetch what arrived while nothing listened — `serve` only; a watch starts from now. */
  catchUp?: boolean
  /** How to log in on this profile, for the error a dropped session gives. */
  login?: string
  /** How a command is named where an unknown outcome sends a person to check. */
  checks?: (check: Check) => string
  proxy?: ProxyServer
  /** Where a wait mtcute sits out is said — a warning, so `--quiet` drops it. The diagnostic stream if not given. */
  note?: (message: string) => void
}

export interface Sent {
  message: Message
  /** Telegram's `random_id` for this send, as a string. Repeat it with `--operation-id` after an unknown outcome. */
  sendId: string
}

const SAVED = new Set(["me", "self", "saved"])
interface DialogWalk {
  dialogs: ReturnType<TelegramClient["iterDialogs"]>
  seen: Set<string>
  /** Read past the last page, to tell whether there is more; the next page starts with them. */
  held: Chat[]
  at: number
  until: number
}

/** Pages of one listing come about a second apart; a page asked for later than this reads fresh dialogs. */
const DIALOG_WALK_KEPT_MS = 60_000

/** The Bot API's deleteMessages cap; assumed for MTProto's getMessages and deleteMessages, not checked against Telegram. */
const BY_ID_BATCH = 100

/**
 * One Telegram account over one connection, speaking only the domain model above this line. Every
 * command closes it in a `finally`: an open socket keeps Node alive, and a piped command that prints
 * and never returns is a defect.
 */
export class TelegramAdapter {
  async formatMarkdown(text: string) {
    return formatMarkdown(text)
  }

  async formatHtml(text: string) {
    return formatHtml(text)
  }

  readonly #client: TelegramClient
  readonly #sessionPath: string
  readonly #login: string | undefined
  readonly #feature: Feature
  readonly #proxyFailed: Promise<never> | undefined
  /** Where the last page of `chats` stopped; any other offset, a failure or a minute's gap starts a new walk. */
  #walk: DialogWalk | undefined

  /** Async because the runtime's SQLite module is imported on demand (cli-core `openCache`). */
  static async open(options: AdapterOptions): Promise<TelegramAdapter> {
    mkdirSync(dirname(options.sessionPath), { recursive: true, mode: 0o700 })
    const adapter = new TelegramAdapter(options, await openSessionStorage(options.sessionPath))
    // Loads the logged-in user from the session before anything else. mtcute does it on the first
    // request, but sendText reads that user before making one — measured 2026-09-27: "User info is
    // not cached yet" on the first send to Saved Messages.
    try {
      await adapter.#client.prepare()
    } catch (error) {
      await adapter.close().catch(() => {})
      throw error
    }
    return adapter
  }

  private constructor(
    {
      credentials,
      sessionPath,
      diagnostic,
      verbose = false,
      listen = false,
      catchUp = false,
      login,
      proxy,
      note,
      checks = bareCheck,
    }: AdapterOptions,
    storage: Awaited<ReturnType<typeof openSessionStorage>>,
  ) {
    this.#sessionPath = sessionPath
    this.#login = login
    const proxied = proxy ? proxiedTransport(proxy) : undefined
    // watch and serve outlive a proxy that is down for a moment; mtcute's own retries suit them.
    this.#proxyFailed = listen ? undefined : proxied?.failed
    // mtcute's default handler writes with console.log, which is stdout — where only data may go.
    const write = diagnostic ?? ((line: string) => process.stderr.write(`${line}\n`))
    const say = note ?? write
    this.#client = new TelegramClient({
      ...(proxied ? { transport: proxied.transport } : {}),
      apiId: credentials.id,
      apiHash: credentials.hash,
      storage,
      // The storage manager has an exit hook of its own; the close is the command's (storage.ts `setup`).
      storageOptions: { cleanup: false },
      disableUpdates: !listen,
      ...(listen ? { updates: { catchUp } } : {}),
      logLevel: verbose ? 3 : 1,
      network: { middlewares: middlewaresOf(listen ? FLOOD_SLEEP.listening : FLOOD_SLEEP.oneShot, say) },
    })
    this.#client.log.mgr.handler = (_color, _level, tag, fmt, args) => write(`[${tag}] ${format(fmt, ...args)}`)
    this.#client.onError.add(backgroundError(write, verbose))
    const unanswered = (error: unknown, what: string | Unanswered, details?: Record<string, unknown>) =>
      unknownIfUnanswered(error, typeof what === "string" ? what : unansweredText(what, checks), details)
    this.#feature = {
      client: this.#client,
      login,
      inputOf: (reference) => this.#inputOf(reference),
      call: (work) => this.#call(work),
      write: (what, work) =>
        this.#call(async () => {
          try {
            return await work()
          } catch (error) {
            throw unanswered(error, what)
          }
        }),
      unanswered,
    }
  }

  login(prompts: login.LoginPrompts): Promise<Account> {
    return login.login(this.#feature, prompts)
  }

  /** The logged-in user's id from the session, without a request; `null` before a login. */
  self(): string | null {
    const cached = this.#client.storage.self.getCached(true)
    return cached ? String(cached.userId) : null
  }

  /** Only here the phone: `account show` masks it, and a login's answer is printed as it is. */
  me(): Promise<Account> {
    return this.#call(async () => {
      const user = await this.#client.getMe()
      return { ...toAccount(user), phone: user.phoneNumber }
    })
  }

  /**
   * For `doctor --online`: Telegram's clock, from `help.getConfig`'s `date` in whole seconds, and
   * whether the account is frozen, from `help.getAppConfig`'s `freeze_*` fields
   * (core.telegram.org/api/config, /api/auth#frozen-accounts). A frozen account still reads, so a
   * working `me()` cannot tell. Both read only.
   */
  health(): Promise<{
    serverTime: number
    serverTimeResolutionMs: number
    standingChecked: boolean
    standing?: FrozenStanding
  }> {
    return this.#call(async () => {
      const config = await this.#client.call({ _: "help.getConfig" })
      const serverTime = config.date * 1000
      let appConfig: Record<string, unknown>
      try {
        appConfig = await this.#client.appConfig.get()
      } catch {
        // The clock is still worth reporting; the standing is then unknown, never "active".
        return { serverTime, serverTimeResolutionMs: 1000, standingChecked: false }
      }
      const standing = frozenOf(appConfig)
      return { serverTime, serverTimeResolutionMs: 1000, standingChecked: true, ...(standing ? { standing } : {}) }
    })
  }

  /**
   * Telegram lists dialogs by position; `limit` unset is every one. The next page goes on with the walk the
   * last one left off, so paging through N chats asks Telegram for each dialog once, not once per page.
   */
  chats({ limit, offset }: { limit?: number; offset: number }): Promise<Page<Chat>> {
    return this.#call(async () => {
      if (limit === undefined) {
        const items = await this.#dialogs(Number.POSITIVE_INFINITY)
        return { items: items.slice(offset), hasMore: false }
      }
      const resumed = this.#walk
      this.#walk = undefined
      const walk: DialogWalk =
        resumed && offset > 0 && resumed.at === offset && Date.now() < resumed.until
          ? resumed
          : {
              dialogs: this.#client.iterDialogs({ archived: "keep" }),
              seen: new Set<string>(),
              held: [],
              at: 0,
              until: 0,
            }
      const pulled = await this.#pull(walk, offset - walk.at + limit + 1)
      const items = pulled.slice(offset - walk.at, offset - walk.at + limit)
      walk.held = pulled.slice(offset - walk.at + limit)
      walk.at = offset + items.length
      walk.until = Date.now() + DIALOG_WALK_KEPT_MS
      this.#walk = walk
      return { items, hasMore: walk.held.length > 0 }
    })
  }

  discussionOf(channelId: string, postId: string): Promise<Discussion> {
    const post = messageNumber(postId, "a post id is a number")
    return this.#call(() => discussionOf(this.#client, Number(channelId), post))
  }

  comments(channelId: string, postId: string, { limit, before }: { limit: number; before?: string }) {
    const post = messageNumber(postId, "a post id is a number")
    const offset = before === undefined ? undefined : messageNumber(before, "`id<` takes a comment id")
    return this.#call(async (): Promise<Page<Message>> => {
      const page = await commentsOf(this.#client, Number(channelId), post, {
        limit,
        ...(offset === undefined ? {} : { before: offset }),
      })
      return { items: page.items.map(toMessage), hasMore: page.hasMore }
    })
  }

  topicHistory(
    reference: string,
    threadId: string,
    window: { limit: number; before?: string },
  ): Promise<Page<Message>> {
    return topics.topicHistory(this.#feature, reference, threadId, window)
  }

  history(reference: string, { limit, before }: { limit: number; before?: string }): Promise<Page<Message>> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const offset = before === undefined ? undefined : { id: messageNumber(before), date: 0 }
      const page = await this.#client.getHistory(peer, { limit, ...(offset ? { offset } : {}) })
      // mtcute drops deleted entries and the inexact-count flag. Its iterator follows next, never total.
      return { items: page.map(remoteMessage).reverse(), hasMore: page.next !== undefined }
    })
  }

  /**
   * Forward from a message or a moment: `reverse` reads upwards from the offset, inclusive, so an id
   * starts one past it. The filter keeps a date offset honest — Telegram places it, it does not cut at it.
   */
  historyAfter(reference: string, { limit, after }: { limit: number; after: After }): Promise<Page<Message>> {
    const offset =
      "id" in after
        ? { id: messageNumber(after.id, "`id>` takes a message id") + 1, date: 0 }
        : { id: 0, date: Math.floor(after.time / 1000) }
    const newer = (message: Message) =>
      "id" in after ? Number(message.id) > Number(after.id) : Date.parse(message.timestamp) > after.time
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const page = await this.#client.getHistory(peer, { limit, reverse: true, offset })
      // As history(): a short page is no end, deleted entries are dropped from it; only an empty one is.
      return { items: page.map(remoteMessage).filter(newer), hasMore: page.next !== undefined }
    })
  }

  /** One person's newest messages in a chat: Telegram's search by sender, newest first, answered oldest first. */
  historyFrom(reference: string, person: string, { limit }: { limit: number }): Promise<Page<Message>> {
    return this.#call(async () => {
      const [chatId, fromUser] = await Promise.all([this.#inputOf(reference), this.#inputOf(person)])
      const page = await this.#client.searchMessages({ chatId, fromUser, limit })
      return { items: page.map(remoteMessage).reverse(), hasMore: page.total > page.length }
    })
  }

  /**
   * Telegram's own text search, newest first: in one chat with `chat`, in every chat otherwise. Its
   * matching is undocumented, so the answer is candidates for the store's strict query.
   */
  searchMessages(
    query: ServerQuery,
    { limit, signal }: { limit: number; signal?: AbortSignal },
  ): Promise<Page<MessageHit> & { chats: Chat[] }> {
    return this.#call(async () => {
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
          ? await this.#client.call(
              {
                _: "messages.searchGlobal",
                ...common,
                offsetRate: 0,
                offsetPeer: { _: "inputPeerEmpty" },
                offsetId: 0,
              },
              options,
            )
          : await this.#client.call(
              {
                _: "messages.search",
                ...common,
                peer: await this.#client.resolvePeer(await this.#inputOf(query.chat)),
                ...(query.from === undefined
                  ? {}
                  : { fromId: await this.#client.resolvePeer(await this.#inputOf(query.from)) }),
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

  /** Back from a moment, newest first as Telegram reads, answered oldest first. The filter cuts at the moment itself. */
  historyBefore(reference: string, { limit, time }: { limit: number; time: number }): Promise<Page<Message>> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const page = await this.#client.getHistory(peer, { limit, offset: { id: 0, date: Math.floor(time / 1000) } })
      const older = page.map(remoteMessage).filter((message) => Date.parse(message.timestamp) < time)
      return { items: older.reverse(), hasMore: page.next !== undefined }
    })
  }

  /** The chat as its dialog describes it, and for a group, who is in it — at most 200, Telegram's cap. */
  chat(reference: string): Promise<ChatCard> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const [dialog] = await this.#client.getPeerDialogs(peer)
      const found = dialog ? dialog.peer : await this.#client.getPeer(peer)
      const chat = dialog ? toChat(dialog) : peerToChat(found)
      if (chat.kind !== "group") return { ...chat, members: null }
      const members = await groups.membersOf(this.#feature, peer)
      return {
        ...chat,
        participantsCount: await groups.groupCount(this.#feature, found, members?.total ?? null),
        members: members?.map((member) => toMember(member.user)) ?? null,
      }
    })
  }

  photos(person: string): Promise<{ count: number; oldestAt: string | null }> {
    return contacts.photos(this.#feature, person)
  }

  contact(reference: string): Promise<PersonCard> {
    return contacts.contact(this.#feature, reference)
  }

  profile(reference: string): Promise<ProfileFacts> {
    return contacts.profile(this.#feature, reference)
  }

  /**
   * One request: history from just above the message, shifted `after` messages newer. Telegram's
   * offset id is exclusive, hence the `+ 1`; ids are not contiguous, so the window is cut by position.
   */
  fetchCounters(reference: string, messageId: string, fields: readonly CounterField[], signal?: AbortSignal) {
    const id = messageNumber(messageId)
    return this.#call(async () => {
      signal?.throwIfAborted()
      const [found] = await this.#client.getMessages(await this.#inputOf(reference), [id])
      signal?.throwIfAborted()
      return found
        ? (observedCounters(toMessage(found), new Date().toISOString(), fields).counterObservations ?? {})
        : {}
    })
  }

  around(reference: string, messageId: string, { before, after }: { before: number; after: number }) {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const page = await this.#client.getHistory(peer, {
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

  /** The chat a reference names — by title, id, `@username` or `me` — so a write can be checked before it goes. */
  resolve(reference: string): Promise<Chat> {
    return this.#call(async () => {
      const peer = await this.#peerOf(reference)
      return typeof peer === "object" && "kind" in peer ? peer : peerToChat(await this.#client.getPeer(peer))
    })
  }

  sendAsIdentities(chatId: string): Promise<SenderIdentity[]> {
    return this.#call(() => sendAsIdentities(this.#client, chatId))
  }

  savedSender(chatId: string): Promise<string | null> {
    return this.#call(() => savedSenderOf(this.#client, chatId, this.self()))
  }

  permalink(chatId: string, messageId: string) {
    const id = messageNumber(messageId, "a message id is a positive Telegram integer")
    if (id <= 0 || id > 2147483647)
      throw new CliError("validation_error", "a message id is a positive Telegram integer")
    return this.#call(async () => {
      const input = await this.#inputOf(chatId)
      const [found] = await this.#client.getMessages(input, [id])
      if (!found || found.id !== id) throw new CliError("not_found", "that message no longer exists in this chat")
      const peer = await this.#client.getPeer(input)
      if (peer.type !== "chat" || peer.raw._ !== "channel")
        return { url: null, access: "unavailable" as const, reason: "unsupported_chat" as const }
      const { link } = await this.#client.call({
        _: "channels.exportMessageLink",
        channel: await this.#client.resolveChannel(input),
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

  /**
   * One logical send carries one `random_id`, made before the request and repeated by a retry:
   * Telegram delivers one message for both (measured 2026-09-27, across two connections).
   */
  send(
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
  ): Promise<Sent> {
    const id = parseSendId(sendId)
    const thread = threadId === undefined ? undefined : topicNumber(threadId)
    const answering = replyTo === undefined ? undefined : messageNumber(replyTo, "a message id is a number")
    const author = sendAs === undefined ? undefined : sendAsPeer(chatId, sendAs, this.self())
    if (attachments.length > 1) throw new CliError("validation_error", "tg sends one file or photo per message")
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
    return this.#send(async () => {
      const [attachment] = attachments
      if (spoiler && attachment) checkSpoiler(attachment)
      const media = attachment
        ? toInputMedia(attachment, body, await uploadAttachment(this.#client, attachment), { spoiler })
        : undefined
      try {
        const message = media
          ? await this.#client.sendMedia(Number(chatId), media, {
              ...common,
              ...(captionAbove ? { invert: true } : {}),
            })
          : await this.#client.sendText(Number(chatId), body, {
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

  watch(onEvent: (event: MessageEvent) => void, signal: AbortSignal, onReady?: () => void): Promise<void> {
    return watching.watch(this.#feature, onEvent, signal, onReady)
  }

  scheduled(reference: string): Promise<Message[]> {
    return this.#call(async () => {
      const queued = await this.#client.getAllScheduledMessages(await this.#inputOf(reference))
      return queued.map(toMessage).sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    })
  }

  /** The message is fetched again, never taken from the store: Telegram's file references expire. */
  download(reference: string, messageId: string): Promise<Download> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      const [found] = await this.#client.getMessages(await this.#inputOf(reference), id)
      if (!found) throw new CliError("not_found", `no message ${id} in that chat`)
      const media = found.media
      if (!media) return { files: [], skipped: [] }
      if (!(media instanceof FileLocation)) return { files: [], skipped: [media.type] }
      const [{ kind, name, mime, size }] = attachmentsOf(media) as [Attachment]
      const client = this.#client
      const login = this.#login
      async function* bytes() {
        try {
          yield* client.downloadAsIterable(media as FileLocation)
        } catch (error) {
          throw toCliError(error, login)
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
  transcribe(reference: string, messageId: string): Promise<Transcript> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      const peer = await this.#client.resolvePeer(await this.#inputOf(reference))
      const deadline = Date.now() + TRANSCRIBE_WAIT_MS
      for (;;) {
        const answer = await this.#client.call({ _: "messages.transcribeAudio", peer, msgId: id })
        if (answer.pending !== true || Date.now() >= deadline) {
          return { text: answer.text, pending: answer.pending === true }
        }
        await sleep(TRANSCRIBE_POLL_MS)
      }
    })
  }

  logout(): Promise<void> {
    return login.logout(this.#feature)
  }

  async close(): Promise<void> {
    await this.#client.destroy()
    for (const suffix of ["", "-wal", "-shm"]) {
      const path = `${this.#sessionPath}${suffix}`
      if (existsSync(path)) chmodSync(path, 0o600)
    }
  }

  /**
   * An edit has no `random_id`, but setting the same text twice is harmless: Telegram answers the
   * repeat with MESSAGE_NOT_MODIFIED, taken here as done — so a retry after an unknown outcome is safe.
   */
  edit(
    chatId: string,
    messageId: string,
    text: string,
    { markup, formatting }: { markup?: Markup[]; formatting?: TextSpan[] } = {},
  ): Promise<Message> {
    const id = messageNumber(messageId, "a message id is a number")
    const spans = formatting ?? markup
    const body = spans ? toFormatted(text, spans) : text
    return this.#call(async () => {
      try {
        return toMessage(await this.#client.editMessage({ chatId: Number(chatId), message: id, text: body }))
      } catch (error) {
        if (tl.RpcError.is(error, "MESSAGE_NOT_MODIFIED")) {
          const [current] = await this.#client.getMessages(Number(chatId), [id])
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
  forward(
    fromChatId: string,
    messageId: string,
    toChatId: string,
    { sendId, silent, sendAs, threadId }: { sendId: string; silent?: boolean; sendAs?: string; threadId?: string },
  ): Promise<Message> {
    const id = messageNumber(messageId, "a message id is a number")
    const randomId = parseSendId(sendId)
    const thread = threadId === undefined ? undefined : topicNumber(threadId)
    const author = sendAs === undefined ? undefined : sendAsPeer(toChatId, sendAs, this.self())
    return this.#send(async () => {
      try {
        const updates = await this.#client.call({
          _: "messages.forwardMessages",
          fromPeer: await this.#client.resolvePeer(Number(fromChatId)),
          toPeer: await this.#client.resolvePeer(Number(toChatId)),
          id: [id],
          randomId: [randomId],
          ...(silent ? { silent } : {}),
          ...(thread === undefined || thread === 1 ? {} : { topMsgId: thread }),
          ...(author === undefined ? {} : { sendAs: await this.#client.resolvePeer(author) }),
        })
        this.#client.handleClientUpdate(updates, true)
        const copy = forwardedCopy(updates)
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
  pin(chatId: string, messageId: string, { notify }: { notify: boolean }): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#write("the pin may have been made — repeating it is safe", async () => {
      await this.#client.pinMessage({ chatId: Number(chatId), message: id, notify })
    })
  }

  unpin(chatId: string, messageId: string): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#write("the message may have been unpinned — repeating it is safe", async () => {
      await this.#client.unpinMessage({ chatId: Number(chatId), message: id })
    })
  }

  /**
   * Telegram sets the owner's reactions as a whole, so one emoji replaces what was there. An emoji the
   * chat does not allow, or a second one without Premium, comes back as Telegram's refusal.
   */
  react(chatId: string, messageId: string, emoji: string | null): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#write("the reaction may have been set — repeating it is safe", async () => {
      await this.#client.sendReaction({ chatId: Number(chatId), message: id, emoji })
    })
  }

  /** Up to `until`, or everything; mentions stay, as Telegram's own clients leave them until they are seen. */
  markRead(chatId: string, until?: string): Promise<void> {
    const maxId = until === undefined ? undefined : messageNumber(until, "--until takes a message id")
    return this.#write("the chat may have been marked read — repeating it is safe", async () => {
      await this.#client.readHistory(Number(chatId), maxId === undefined ? {} : { maxId })
    })
  }

  markTopicRead(chatId: string, topicId: string, until?: string): Promise<void> {
    return topics.markTopicRead(this.#feature, chatId, topicId, until)
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
  async delete(chatId: string, messageIds: string[], { forEveryone }: { forEveryone: boolean }): Promise<void> {
    const ids = messageIds.map((id) => messageNumber(id, "a message id is a number"))
    const peer = await this.#call(async () => {
      const peer = await this.#client.resolvePeer(Number(chatId))
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
        for (const one of await this.#client.getMessages(peer, ids.slice(at, at + BY_ID_BATCH))) found.push(one)
      const missing = ids.filter((_, index) => found[index] == null)
      if (missing.length > 0) {
        throw new CliError(
          "validation_error",
          `no message ${missing.join(", ")} in chat ${chatId} — not in this chat, or already deleted; nothing was deleted`,
        )
      }
      return peer
    })
    return this.#write("the messages may have been deleted — repeating it is safe", async () => {
      for (let at = 0; at < ids.length; at += BY_ID_BATCH)
        await this.#client.deleteMessagesById(peer, ids.slice(at, at + BY_ID_BATCH), { revoke: forEveryone })
    })
  }

  poll(chatId: string, messageId: string): Promise<Poll> {
    return this.#call(async () => toPoll(chatId, messageId, await this.#pollOf(chatId, messageId)))
  }

  pollVoters(chatId: string, messageId: string, window: { limit: number; answerId?: string }) {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(() => pollVotersOf(this.#client, Number(chatId), id, window))
  }

  /** Votes by the answers' own bytes, never by index: mtcute would fetch the poll and pick by position. */
  vote(chatId: string, messageId: string, answerIds: string[]): Promise<Poll> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      const current = await this.#pollOf(chatId, messageId)
      const known = new Map(current.answers.map((answer) => [answerId(answer.data), answer.data]))
      const unknown = answerIds.filter((answer) => !known.has(answer))
      if (unknown.length > 0) {
        throw new CliError(
          "validation_error",
          `${unknown.join(", ")} ${unknown.length === 1 ? "is" : "are"} not an answer of this poll — its answers are ${[...known.keys()].join(", ")}`,
        )
      }
      refuseVote(current, answerIds)
      const options = answerIds.length === 0 ? null : answerIds.map((answer) => known.get(answer) as Uint8Array)
      try {
        return toPoll(chatId, messageId, await this.#client.sendVote({ chatId: Number(chatId), message: id, options }))
      } catch (error) {
        throw unknownIfUnanswered(error, "the vote may have been cast — repeating it is safe")
      }
    })
  }

  closePoll(chatId: string, messageId: string): Promise<Poll> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      refuseClose(await this.#pollOf(chatId, messageId))
      try {
        return toPoll(chatId, messageId, await this.#client.closePoll({ chatId: Number(chatId), message: id }))
      } catch (error) {
        throw this.#feature.unanswered(error, {
          what: "the poll may have been closed",
          check: "polls.show",
          after: "before repeating",
        })
      }
    })
  }

  /**
   * One `random_id` per logical create, as a send has: a retry repeats it and Telegram keeps one poll
   * (measured 2026-10-08: the second call answered the first poll's message id — unlike topic creation).
   */
  createPoll(
    chatId: string,
    poll: NewPoll,
    { sendId, silent, threadId, sendAs }: { sendId: string; silent?: boolean; threadId?: string; sendAs?: string },
  ): Promise<Sent> {
    const randomId = parseSendId(sendId)
    const thread = threadId === undefined ? undefined : topicNumber(threadId)
    const author = sendAs === undefined ? undefined : sendAsPeer(chatId, sendAs, this.self())
    return this.#send(async () => {
      try {
        const message = await this.#client.sendMedia(Number(chatId), toInputPoll(poll), {
          randomId,
          ...(thread === undefined || thread === 1 ? {} : { threadId: thread }),
          ...(silent ? { silent } : {}),
          ...(author === undefined ? {} : { sendAs: author }),
        })
        return { message: toMessage(message), sendId }
      } catch (error) {
        throw unknownIfUnanswered(
          error,
          `the poll may have been sent. Repeat with ${repeatWith(sendId, sendAs)}, never without it`,
          retryDetails(sendId, sendAs),
        )
      }
    })
  }

  async #pollOf(chatId: string, messageId: string): Promise<TgPoll> {
    const id = messageNumber(messageId, "a message id is a number")
    const [found] = await this.#client.getMessages(Number(chatId), [id])
    if (!found) throw new CliError("not_found", `no message ${id} in that chat`)
    if (found.media?.type !== "poll") throw new CliError("not_found", `message ${id} carries no poll`)
    return found.media
  }

  /** A name is matched against the dialogs and answered as the chat it found; anything else goes to Telegram as it is. */
  async #peerOf(reference: string): Promise<InputPeerLike | Chat> {
    const trimmed = reference.trim()
    if (SAVED.has(trimmed.toLowerCase())) return "me"
    if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
    if (trimmed.startsWith("@")) return trimmed.slice(1)

    return pickChat(trimmed, await this.#dialogs(Number.POSITIVE_INFINITY))
  }

  /**
   * Each chat once, up to `wanted`. With archived chats kept, Telegram's dialog pages bring the
   * pinned chats again further down: 8 of 1361 were listed twice on 2026-10-01, and a pinned chat's
   * title then matched itself as two chats.
   */
  async #pull(walk: DialogWalk, wanted: number): Promise<Chat[]> {
    const chats = walk.held
    while (chats.length < wanted) {
      const next = await walk.dialogs.next()
      if (next.done) break
      const chat = toChat(next.value)
      if (walk.seen.has(chat.id)) continue
      walk.seen.add(chat.id)
      chats.push(chat)
    }
    return chats
  }

  async #dialogs(wanted: number): Promise<Chat[]> {
    const seen = new Set<string>()
    const chats: Chat[] = []
    for await (const dialog of this.#client.iterDialogs({ archived: "keep" })) {
      const chat = toChat(dialog)
      if (seen.has(chat.id)) continue
      seen.add(chat.id)
      chats.push(chat)
      if (chats.length >= wanted) break
    }
    return chats
  }

  async #inputOf(reference: string): Promise<InputPeerLike> {
    const peer = await this.#peerOf(reference)
    return typeof peer === "object" && "kind" in peer ? Number(peer.id) : peer
  }

  inspect(link: string): Promise<LinkTarget> {
    return groups.inspect(this.#feature, link)
  }

  forumState(chatId: string): Promise<ForumState> {
    return topics.forumState(this.#feature, chatId)
  }

  upgradeForum(chatId: string): Promise<ForumState> {
    return topics.upgradeForum(this.#feature, chatId)
  }

  enableForum(chatId: string): Promise<ForumState> {
    return topics.enableForum(this.#feature, chatId)
  }

  createTopic(chatId: string, title: string, options: { sendId: string }): Promise<Topic> {
    return topics.createTopic(this.#feature, chatId, title, options)
  }

  editTopic(chatId: string, topicId: string, change: TopicChange): Promise<Topic> {
    return topics.editTopic(this.#feature, chatId, topicId, change)
  }

  orderPinnedTopics(chatId: string, topicIds: string[]): Promise<void> {
    return topics.orderPinnedTopics(this.#feature, chatId, topicIds)
  }

  deleteTopic(chatId: string, topicId: string): Promise<void> {
    return topics.deleteTopic(this.#feature, chatId, topicId)
  }

  validateThread(chatId: string, threadId: string, options: { replyTo?: string }): Promise<void> {
    return topics.validateThread(this.#feature, chatId, threadId, options)
  }

  topic(reference: string, topicId: string): Promise<Topic> {
    return topics.topic(this.#feature, reference, topicId)
  }

  topics(reference: string, window: { search?: string; limit?: number; offset: number }): Promise<Page<Topic>> {
    return topics.topics(this.#feature, reference, window)
  }

  lookup(phone: string): Promise<Member> {
    return contacts.lookup(this.#feature, phone)
  }

  addressBook(): Promise<Member[]> {
    return contacts.addressBook(this.#feature)
  }

  sessions(): Promise<AccountSession[]> {
    return login.sessions(this.#feature)
  }

  members(
    reference: string,
    window: { limit?: number; offset: number },
  ): Promise<Page<GroupMember> & { chatId: string; participantsCount: number | null }> {
    return groups.members(this.#feature, reference, window)
  }

  chatEvents(reference: string, window: { since: number }): Promise<ChatEvents> {
    return groups.chatEvents(this.#feature, reference, window)
  }

  admins(reference: string): Promise<string[] | null> {
    return groups.admins(this.#feature, reference)
  }

  people(references: string[]): Promise<string[]> {
    return groups.people(this.#feature, references)
  }

  createGroup(title: string, people: string[], options: { channel: boolean }): Promise<GroupCard> {
    return groups.createGroup(this.#feature, title, people, options)
  }

  join(link: string): Promise<GroupCard | { requested: true }> {
    return groups.join(this.#feature, link)
  }

  leave(reference: string): Promise<{ chatId: string }> {
    return groups.leave(this.#feature, reference)
  }

  group(reference: string): Promise<GroupCard> {
    return groups.group(this.#feature, reference)
  }

  /**
   * Telegram computes these only on the chat's statistics server (`stats_dc`); mtcute opens that
   * connection and carries the login over itself, and `close` ends it with the others.
   */
  officialChatStats(reference: string): Promise<OfficialChatStats> {
    return this.#call(async () => {
      let full = await this.#client.getFullChat(await this.#inputOf(reference))
      if (full.migratedToId != null) full = await this.#client.getFullChat(full.migratedToId)
      const broadcast = full.chatType === "channel"
      if (!broadcast && full.chatType !== "supergroup" && full.chatType !== "gigagroup") {
        throw new CliError(
          "validation_error",
          full.chatType === "group"
            ? "Telegram keeps statistics only for supergroups and channels, not for a basic group"
            : "Telegram keeps statistics only for supergroups and channels",
        )
      }
      if (!full.canViewStats) {
        throw new CliError(
          "permission_error",
          "Telegram shows statistics only to admins of large enough groups and channels, and not for this one",
        )
      }
      const statsDc = full.full._ === "channelFull" ? full.full.statsDc : undefined
      const options = statsDc === undefined ? undefined : { dcId: statsDc }
      const channel = await this.#client.resolveChannel(full.id)
      const chat = { id: String(full.id), title: full.displayName }
      const graphOf: GraphOf = async (graph) => {
        if (graph._ === "statsGraph") return toOfficialGraph(graph.json.data)
        if (graph._ === "statsGraphError") return { error: graph.error }
        try {
          const loaded = await this.#client.call({ _: "stats.loadAsyncGraph", token: graph.token }, options)
          if (loaded._ === "statsGraph") return toOfficialGraph(loaded.json.data)
          return { error: loaded._ === "statsGraphError" ? loaded.error : "Telegram did not finish this graph" }
        } catch (error) {
          if (tl.RpcError.is(error)) return { error: error.text }
          throw error
        }
      }
      try {
        return broadcast
          ? await toOfficialChannelStats(
              chat,
              await this.#client.call({ _: "stats.getBroadcastStats", channel }, options),
              graphOf,
            )
          : await toOfficialGroupStats(
              chat,
              await this.#client.call({ _: "stats.getMegagroupStats", channel }, options),
              graphOf,
            )
      } catch (error) {
        // Reached the main server a moment ago, so the login stands; only the statistics server refused it.
        if (tl.RpcError.is(error, "AUTH_KEY_UNREGISTERED"))
          throw new CliError(
            "provider_error",
            "Telegram's statistics server did not accept this login (AUTH_KEY_UNREGISTERED); the login itself works — try again later",
            { provider_error: error.text, status: error.code },
          )
        throw error
      }
    })
  }

  updateGroup(chatId: string, change: GroupChange): Promise<GroupCard> {
    return groups.updateGroup(this.#feature, chatId, change)
  }

  resetInviteLink(chatId: string): Promise<GroupCard> {
    return groups.resetInviteLink(this.#feature, chatId)
  }

  createInviteLink(chatId: string, options: { approval: boolean; expiresAt?: string; maxUses?: number }) {
    return groups.createInviteLink(this.#feature, chatId, options)
  }

  joinRequests(chatId: string, options: { limit: number; link?: string; search?: string }) {
    return groups.joinRequests(this.#feature, chatId, options)
  }

  answerAllJoinRequests(chatId: string, accept: boolean, link?: string) {
    return groups.answerAllJoinRequests(this.#feature, chatId, accept, link)
  }

  inviteLinks(chatId: string, options: { limit: number; revoked: boolean }) {
    return groups.inviteLinks(this.#feature, chatId, options)
  }

  revokeInviteLink(chatId: string, link: string) {
    return groups.revokeInviteLink(this.#feature, chatId, link)
  }

  updateInviteLink(chatId: string, link: string, change: InviteLinkChange) {
    return groups.updateInviteLink(this.#feature, chatId, link, change)
  }

  answerJoinRequest(chatId: string, personId: string, accept: boolean) {
    return groups.answerJoinRequest(this.#feature, chatId, personId, accept)
  }

  addMembers(chatId: string, people: string[], options: { history?: boolean }): Promise<{ notAdded: string[] }> {
    return groups.addMembers(this.#feature, chatId, people, options)
  }

  removeMembers(chatId: string, people: string[]): Promise<void> {
    return groups.removeMembers(this.#feature, chatId, people)
  }

  addAdmin(chatId: string, person: string, rights: AdminRight[]): Promise<void> {
    return groups.addAdmin(this.#feature, chatId, person, rights)
  }

  removeAdmin(chatId: string, person: string): Promise<void> {
    return groups.removeAdmin(this.#feature, chatId, person)
  }

  folders(): Promise<Folder[]> {
    return folders.folders(this.#feature)
  }

  createFolder(title: string, chatIds: string[], rules?: FolderRules): Promise<Folder> {
    return folders.createFolder(this.#feature, title, chatIds, rules)
  }

  updateFolder(folderId: string, change: FolderChange): Promise<Folder> {
    return folders.updateFolder(this.#feature, folderId, change)
  }

  deleteFolder(folderId: string): Promise<void> {
    return folders.deleteFolder(this.#feature, folderId)
  }

  orderFolders(folderIds: string[]): Promise<void> {
    return folders.orderFolders(this.#feature, folderIds)
  }

  joinFolder(link: string): Promise<Folder> {
    return folders.joinFolder(this.#feature, link)
  }

  addContact(personId: string): Promise<Member> {
    return contacts.addContact(this.#feature, personId)
  }

  removeContact(personId: string): Promise<void> {
    return contacts.removeContact(this.#feature, personId)
  }

  block(personId: string): Promise<void> {
    return contacts.block(this.#feature, personId)
  }

  unblock(personId: string): Promise<void> {
    return contacts.unblock(this.#feature, personId)
  }

  renameContact(personId: string, firstName: string, lastName?: string): Promise<Member> {
    return contacts.renameContact(this.#feature, personId, firstName, lastName)
  }

  importContacts(entries: PhoneBookEntry[]): Promise<Member[]> {
    return contacts.importContacts(this.#feature, entries)
  }

  /** Telegram calls the description the bio. A photo goes up as a new profile photo. */
  updateProfile({
    firstName,
    lastName,
    description,
    photo,
  }: Parameters<NonNullable<MessengerAdapter["updateProfile"]>>[0]): Promise<Account> {
    return this.#call(async () => {
      if (firstName !== undefined || lastName !== undefined || description !== undefined) {
        await this.#client.updateProfile({
          ...(firstName === undefined ? {} : { firstName }),
          ...(lastName === undefined ? {} : { lastName }),
          ...(description === undefined ? {} : { bio: description }),
        })
      }
      if (photo) await this.#client.setMyProfilePhoto({ type: "photo", media: await uploadBlob(photo.source) })
      const user = await this.#client.getMe()
      return { ...toAccount(user), phone: user.phoneNumber }
    })
  }

  endOtherSessions(): Promise<AccountSession[]> {
    return login.endOtherSessions(this.#feature)
  }

  #write<T>(what: string, work: () => Promise<T>): Promise<T> {
    return this.#feature.write(what, work)
  }

  #send<T>(work: () => Promise<T>): Promise<T> {
    return this.#call(() => sending(work))
  }

  async #call<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await (this.#proxyFailed ? Promise.race([work(), this.#proxyFailed]) : work())
    } catch (error) {
      throw toCliError(error, this.#login)
    }
  }
}

export interface FrozenStanding {
  state: "frozen"
  since?: string
  until?: string
  appealUrl?: string
  hint: string
}

const unixTime = (value: unknown): string | undefined =>
  typeof value === "number" && value > 0 ? new Date(value * 1000).toISOString() : undefined

/** Telegram sets `freeze_since_date` non-zero only on a frozen account; the dates are unix seconds. */
export const frozenOf = (config: Record<string, unknown>): FrozenStanding | undefined => {
  const since = unixTime(config.freeze_since_date)
  if (!since) return undefined
  const until = unixTime(config.freeze_until_date)
  const appealUrl =
    typeof config.freeze_appeal_url === "string" && config.freeze_appeal_url ? config.freeze_appeal_url : undefined
  return {
    state: "frozen",
    since,
    ...(until ? { until } : {}),
    ...(appealUrl ? { appealUrl } : {}),
    hint:
      "Telegram froze this account: it can read but not write" +
      (until ? `, and deletes it on ${until.slice(0, 10)}` : "") +
      (appealUrl ? ` unless an appeal is accepted — appeal at ${appealUrl}` : " unless an appeal is accepted"),
  }
}

/**
 * How long mtcute sits out a FLOOD_WAIT before the wait becomes `rate_limited` with `retryAfterMs`, and
 * how many times. One-shot: 10 s, mtcute's own default, which covers the routine short waits; past it a
 * person or a script is better told the wait than held, and twice at most keeps a command under ~20 s
 * of announced waiting. Listening (`watch`, `serve`): nobody is waiting on a request, and giving up
 * costs a restart and a new connection — 120 s, tlgr's threshold. `messages sync` keeps the one-shot
 * value: cli-core's `patiently` sits out up to 5 min above it, and says so.
 */
export const FLOOD_SLEEP = {
  oneShot: { maxWait: 10_000, maxRetries: 2 },
  listening: { maxWait: 120_000, maxRetries: 3 },
}

export const TRANSCRIBE_POLL_MS = 2000
const TRANSCRIBE_WAIT_MS = 60_000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const repeatWith = (sendId: string, sendAs: string | undefined): string =>
  sendAs === undefined ? `--operation-id ${sendId}` : `--operation-id ${sendId} --send-as ${sendAs}`

const retryDetails = (sendId: string, sendAs: string | undefined) => ({
  operation_id: sendId,
  ...(sendAs === undefined ? {} : { sendAs }),
})
