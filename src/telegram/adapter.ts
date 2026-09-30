import { chmodSync, existsSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { format } from "node:util"
import { CliError } from "@leemour/cli-core"
import {
  type AccountSession,
  type Attachment,
  type Chat,
  type ChatCard,
  type ChatEvents,
  type GroupMember,
  type Member,
  type Message,
  type MessageEvent,
  type Page,
  type PersonCard,
  pickChat,
} from "@leemour/cli-messaging"
import type { After, Download, SendOptions, Transcript } from "@leemour/cli-messaging/cli"
import {
  type DeleteMessageUpdate,
  FileLocation,
  type InputPeerLike,
  Long,
  type RawUpdateInfo,
  TelegramClient,
  type Message as TgMessage,
  tl,
  type User,
} from "@mtcute/node"
import type { ApiCredentials } from "./credentials.js"
import { toCliError } from "./errors.js"
import {
  type Account,
  attachmentsOf,
  type EventOf,
  eventOf,
  peerToChat,
  toAccount,
  toAccountSession,
  toChat,
  toDeletions,
  toFormatted,
  toGroupMember,
  toInputMedia,
  toMember,
  toMessage,
  toMessageHit,
  toReactionChange,
} from "./map.js"
import { openSessionStorage } from "./storage.js"

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
}

export interface LoginPrompts {
  method: "qr" | "phone"
  showQr: (url: string, expires: Date) => void
  phone: () => Promise<string>
  code: () => Promise<string>
  password: () => Promise<string>
  note: (message: string) => void
}

export interface Sent {
  message: Message
  /** Telegram's `random_id` for this send, as a string. Repeat it with `--send-id` after an unknown outcome. */
  sendId: string
}

const SAVED = new Set(["me", "self", "saved"])
/** Telegram's own cap on a group's member list. */
const MEMBERS_MAX = 10_000
/** Pages of 100 that `chats events` reads at most; the rest is `more`. */
const EVENT_PAGES = 10

/**
 * One Telegram account over one connection, speaking only the domain model above this line. Every
 * command closes it in a `finally`: an open socket keeps Node alive, and a piped command that prints
 * and never returns is a defect.
 */
export class TelegramAdapter {
  readonly #client: TelegramClient
  readonly #sessionPath: string

  /** Async because the runtime's SQLite module is imported on demand (cli-messaging `openCache`). */
  static async open(options: AdapterOptions): Promise<TelegramAdapter> {
    mkdirSync(dirname(options.sessionPath), { recursive: true, mode: 0o700 })
    // The session file and its -wal and -shm companions are all created by SQLite; a umask is the one
    // setting that reaches all three.
    process.umask(0o077)
    const adapter = new TelegramAdapter(options, await openSessionStorage(options.sessionPath))
    // Loads the logged-in user from the session before anything else. mtcute does it on the first
    // request, but sendText reads that user before making one — measured 2026-09-27: "User info is
    // not cached yet" on the first send to Saved Messages.
    await adapter.#client.prepare()
    return adapter
  }

  private constructor(
    { credentials, sessionPath, diagnostic, verbose = false, listen = false, catchUp = false }: AdapterOptions,
    storage: Awaited<ReturnType<typeof openSessionStorage>>,
  ) {
    this.#sessionPath = sessionPath
    this.#client = new TelegramClient({
      apiId: credentials.id,
      apiHash: credentials.hash,
      storage,
      disableUpdates: !listen,
      ...(listen ? { updates: { catchUp } } : {}),
      logLevel: verbose ? 3 : 1,
    })
    // mtcute's default handler writes with console.log, which is stdout — where only data may go.
    const write = diagnostic ?? ((line: string) => process.stderr.write(`${line}\n`))
    this.#client.log.mgr.handler = (_color, _level, tag, fmt, args) => write(`[${tag}] ${format(fmt, ...args)}`)
  }

  async login(prompts: LoginPrompts): Promise<Account> {
    return this.#call(async () => {
      const user: User = await this.#client.start({
        ...(prompts.method === "qr" ? { qrCodeHandler: prompts.showQr } : { phone: prompts.phone }),
        code: prompts.code,
        password: prompts.password,
        codeSentCallback: (sent) => prompts.note(`Telegram sent a login code (${sent.type})`),
        invalidCodeCallback: (what) => prompts.note(`that ${what} was not accepted — try again`),
      })
      return toAccount(user)
    })
  }

  /** The logged-in user's id from the session, without a request; `null` before a login. */
  self(): string | null {
    const cached = this.#client.storage.self.getCached(true)
    return cached ? String(cached.userId) : null
  }

  me(): Promise<Account> {
    return this.#call(async () => toAccount(await this.#client.getMe()))
  }

  /** Telegram lists dialogs by position, so a page is the dialogs up to its end, cut; `limit` unset is every one. */
  chats({ limit, offset }: { limit?: number; offset: number }): Promise<Page<Chat>> {
    return this.#call(async () => {
      const wanted = limit === undefined ? Number.POSITIVE_INFINITY : offset + limit + 1
      const items: Chat[] = []
      for await (const dialog of this.#client.iterDialogs({ limit: wanted, archived: "keep" })) {
        items.push(toChat(dialog))
      }
      const end = limit === undefined ? items.length : offset + limit
      return { items: items.slice(offset, end), hasMore: items.length > end }
    })
  }

  history(reference: string, { limit, before }: { limit: number; before?: string }): Promise<Page<Message>> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const offset = before === undefined ? undefined : { id: messageNumber(before), date: 0 }
      const page = await this.#client.getHistory(peer, { limit, ...(offset ? { offset } : {}) })
      return { items: page.map(toMessage).reverse(), hasMore: page.next !== undefined && page.length === limit }
    })
  }

  /**
   * Forward from a message or a moment: `reverse` reads upwards from the offset, inclusive, so an id
   * starts one past it. The filter keeps a date offset honest — Telegram places it, it does not cut at it.
   */
  historyAfter(reference: string, { limit, after }: { limit: number; after: After }): Promise<Page<Message>> {
    const offset =
      "id" in after
        ? { id: messageNumber(after.id, "--after takes a message id or a time") + 1, date: 0 }
        : { id: 0, date: Math.floor(after.time / 1000) }
    const newer = (message: Message) =>
      "id" in after ? Number(message.id) > Number(after.id) : Date.parse(message.timestamp) > after.time
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const page = await this.#client.getHistory(peer, { limit, reverse: true, offset })
      return { items: page.map(toMessage).filter(newer), hasMore: page.length === limit }
    })
  }

  /** The chat as its dialog describes it, and for a group, who is in it — at most 200, Telegram's cap. */
  chat(reference: string): Promise<ChatCard> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const [dialog] = await this.#client.getPeerDialogs(peer)
      const chat = dialog ? toChat(dialog) : peerToChat(await this.#client.getPeer(peer))
      return { ...chat, members: chat.kind === "group" ? await this.#membersOf(peer) : null }
    })
  }

  /** A person, their bio, and the groups this account shares with them — newest conversation first. */
  contact(reference: string): Promise<PersonCard> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const user = await this.#client.getPeer(peer)
      if (user.type !== "user") throw new CliError("validation_error", `"${reference}" is a chat, not a person`)
      const [full, [dialog], common] = await Promise.all([
        this.#client.getFullUser(peer),
        this.#client.getPeerDialogs(peer),
        this.#client.getCommonChats(peer),
      ])
      const dialogs = common.length > 0 ? await this.#client.getPeerDialogs(common.map((chat) => chat.id)) : []
      const chats = dialogs
        .filter((one) => one !== null)
        .map(toChat)
        .map(({ id, title, kind, lastMessageAt }) => ({ id, title, kind, lastMessageAt }))
        .sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""))
      return {
        ...toMember(user),
        description: full.bio || null,
        lastMessagedAt: dialog ? (toChat(dialog).lastMessageAt ?? null) : null,
        chats,
      }
    })
  }

  /**
   * One request: history from just above the message, shifted `after` messages newer. Telegram's
   * offset id is exclusive, hence the `+ 1`; ids are not contiguous, so the window is cut by position.
   */
  around(reference: string, messageId: string, { before, after }: { before: number; after: number }) {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const page = await this.#client.getHistory(peer, {
        offset: { id: id + 1, date: 0 },
        addOffset: -after,
        limit: before + 1 + after,
      })
      const items = page.map(toMessage).reverse()
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

  /**
   * One logical send carries one `random_id`, made before the request and repeated by a retry:
   * Telegram delivers one message for both (measured 2026-09-27, across two connections).
   */
  send(
    chatId: string,
    text: string,
    { sendId, replyTo, silent, noPreview, markup, at, attachments = [] }: SendOptions,
  ): Promise<Sent> {
    const id = parseSendId(sendId)
    const answering = replyTo === undefined ? undefined : messageNumber(replyTo, "a message id is a number")
    if (attachments.length > 1) throw new CliError("validation_error", "tg sends one file or photo per message")
    const body = markup ? toFormatted(text, markup) : text
    const common = {
      randomId: id,
      ...(answering === undefined ? {} : { replyTo: answering }),
      ...(silent ? { silent } : {}),
      ...(at === undefined ? {} : { schedule: new Date(at) }),
    }
    return this.#call(async () => {
      try {
        const [attachment] = attachments
        const message = attachment
          ? await this.#client.sendMedia(Number(chatId), toInputMedia(attachment, body), common)
          : await this.#client.sendText(Number(chatId), body, {
              ...common,
              ...(noPreview ? { disableWebPreview: true } : {}),
            })
        return { message: toMessage(message), sendId }
      } catch (error) {
        throw unknownIfUnanswered(
          error,
          `the message may have been sent. Repeat with --send-id ${sendId}, never without it`,
          { sendId },
        )
      }
    })
  }

  /**
   * New messages, edits, deletions and reaction changes as they arrive, until `signal` aborts. Only
   * on an adapter opened with `listen`. `onReady` once the updates loop runs, not before.
   */
  async watch(onEvent: (event: MessageEvent) => void, signal: AbortSignal, onReady?: () => void): Promise<void> {
    const client = this.#client
    const message = (found: TgMessage) => onEvent({ event: "message", message: toMessageHit(found) })
    const edit = (found: TgMessage) => onEvent({ event: "edit", message: toMessageHit(found) })
    const deletion = (update: DeleteMessageUpdate) => {
      for (const change of toDeletions(update)) onEvent(change)
    }
    const raw = (info: RawUpdateInfo) => {
      const change = toReactionChange(info)
      if (change) onEvent(change)
    }
    client.onNewMessage.add(message)
    client.onEditMessage.add(edit)
    client.onDeleteMessage.add(deletion)
    client.onRawUpdate.add(raw)
    try {
      await this.#call(async () => {
        await client.connect()
        await client.startUpdatesLoop()
      })
      onReady?.()
      if (!signal.aborted) await new Promise((resolve) => signal.addEventListener("abort", resolve, { once: true }))
    } finally {
      client.onNewMessage.remove(message)
      client.onEditMessage.remove(edit)
      client.onDeleteMessage.remove(deletion)
      client.onRawUpdate.remove(raw)
    }
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
      async function* bytes() {
        try {
          yield* client.downloadAsIterable(media as FileLocation)
        } catch (error) {
          throw toCliError(error)
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

  /** Forgets the session on Telegram's side too, so the device disappears from the account's list. */
  logout(): Promise<void> {
    return this.#call(async () => {
      await this.#client.logOut()
    })
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
  edit(chatId: string, messageId: string, text: string): Promise<Message> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      try {
        return toMessage(await this.#client.editMessage({ chatId: Number(chatId), message: id, text }))
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
   * mtcute draws the forward's `random_id` itself, so a retry could not be deduplicated: an unknown
   * outcome says to look in the target chat first.
   */
  forward(fromChatId: string, messageId: string, toChatId: string, { silent }: { silent?: boolean }): Promise<Message> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      try {
        const [copy] = await this.#client.forwardMessagesById({
          fromChatId: Number(fromChatId),
          messages: [id],
          toChatId: Number(toChatId),
          ...(silent ? { silent } : {}),
        })
        if (!copy) throw new CliError("provider_error", "Telegram answered the forward without the new message")
        return toMessage(copy)
      } catch (error) {
        throw unknownIfUnanswered(
          error,
          "the message may have been forwarded — look in the target chat before repeating",
        )
      }
    })
  }

  /** In a one-to-one chat the pin is on the owner's side only; `notify` reaches groups alone, as Telegram has it. */
  pin(chatId: string, messageId: string, { notify }: { notify: boolean }): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      await this.#client.pinMessage({ chatId: Number(chatId), message: id, notify })
    })
  }

  unpin(chatId: string, messageId: string): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      await this.#client.unpinMessage({ chatId: Number(chatId), message: id })
    })
  }

  /**
   * Telegram sets the owner's reactions as a whole, so one emoji replaces what was there. An emoji the
   * chat does not allow, or a second one without Premium, comes back as Telegram's refusal.
   */
  react(chatId: string, messageId: string, emoji: string | null): Promise<void> {
    const id = messageNumber(messageId, "a message id is a number")
    return this.#call(async () => {
      await this.#client.sendReaction({ chatId: Number(chatId), message: id, emoji })
    })
  }

  /** Up to `until`, or everything; mentions stay, as Telegram's own clients leave them until they are seen. */
  markRead(chatId: string, until?: string): Promise<void> {
    const maxId = until === undefined ? undefined : messageNumber(until, "--until takes a message id")
    return this.#call(async () => {
      await this.#client.readHistory(Number(chatId), maxId === undefined ? {} : { maxId })
    })
  }

  /** A name is matched against the dialogs and answered as the chat it found; anything else goes to Telegram as it is. */
  async #peerOf(reference: string): Promise<InputPeerLike | Chat> {
    const trimmed = reference.trim()
    if (SAVED.has(trimmed.toLowerCase())) return "me"
    if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
    if (trimmed.startsWith("@")) return trimmed.slice(1)

    const chats: Chat[] = []
    for await (const dialog of this.#client.iterDialogs({ archived: "keep" })) chats.push(toChat(dialog))
    return pickChat(trimmed, chats)
  }

  async #inputOf(reference: string): Promise<InputPeerLike> {
    const peer = await this.#peerOf(reference)
    return typeof peer === "object" && "kind" in peer ? Number(peer.id) : peer
  }

  /** Telegram answers only where the person's privacy lets the owner find them by number. */
  lookup(phone: string): Promise<Member> {
    return this.#call(async () => toMember(await this.#client.getPeer(await this.#client.resolvePhoneNumber(phone))))
  }

  /** The owner's Telegram contacts — the address book, not the chats. */
  addressBook(): Promise<Member[]> {
    return this.#call(async () => (await this.#client.getContacts()).map(toMember))
  }

  /** Every device and app logged in; the IP address Telegram also sends is left out. */
  sessions(): Promise<AccountSession[]> {
    return this.#call(async () => {
      const { authorizations } = await this.#client.call({ _: "account.getAuthorizations" })
      return authorizations.map(toAccountSession)
    })
  }

  /**
   * A page of a group's members, 200 a request. Telegram gives at most `MEMBERS_MAX` of a big group,
   * and a group that hides its list answers only its admins or refuses.
   */
  members(
    reference: string,
    { limit, offset }: { limit?: number; offset: number },
  ): Promise<Page<GroupMember> & { chatId: string }> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const wanted = Math.min(limit ?? MEMBERS_MAX, MEMBERS_MAX - offset)
      const found: GroupMember[] = []
      let total = 0
      while (found.length < wanted) {
        const size = Math.min(200, wanted - found.length)
        const page = await this.#client.getChatMembers(peer, { offset: offset + found.length, limit: size })
        total = page.total
        found.push(...page.map(toGroupMember))
        if (page.length < size) break
      }
      return {
        chatId: String((await this.#client.getPeer(peer)).id),
        items: found,
        hasMore: offset + found.length < Math.min(total, MEMBERS_MAX),
      }
    })
  }

  /**
   * Service messages back to `since`, newest page first, at most `EVENT_PAGES` of them — a busy
   * group's week can be thousands. The people a message names only by id are looked up in one call.
   */
  chatEvents(reference: string, { since }: { since: number }): Promise<ChatEvents> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      const found: { message: TgMessage; change: EventOf }[] = []
      let offset: { id: number; date: number } | undefined
      let more = false
      for (let read = 1; ; read++) {
        const page = await this.#client.getHistory(peer, { limit: 100, ...(offset ? { offset } : {}) })
        for (const message of page) {
          const change = message.date.getTime() > since ? eventOf(message) : null
          if (change) found.push({ message, change })
        }
        const oldest = page.at(-1)
        if (!page.next || !oldest || oldest.date.getTime() <= since) break
        if (read >= EVENT_PAGES) {
          more = true
          break
        }
        offset = page.next
      }

      const names = new Map(found.map(({ message }) => [message.sender.id, message.sender.displayName || null]))
      const unknown = [...new Set(found.flatMap(({ change }) => [change.by, ...change.people]))].filter(
        (id) => !names.has(id),
      )
      if (unknown.length > 0) {
        for (const user of await this.#client.getUsers(unknown)) if (user) names.set(user.id, user.displayName || null)
      }
      const person = (id: number) => ({ id: String(id), name: names.get(id) ?? null })

      return {
        chatId: String((await this.#client.getPeer(peer)).id),
        since: new Date(since).toISOString(),
        more,
        events: found.reverse().map(({ message, change }) => ({
          messageId: String(message.id),
          timestamp: message.date.toISOString(),
          event: change.event,
          by: person(change.by),
          people: change.people.map(person),
          ...(change.title === undefined ? {} : { title: change.title }),
        })),
      }
    })
  }

  /**
   * A group's admins and its creator, for `review --unanswered`; `null` when the group hides them.
   * A basic group ignores the `admins` filter and answers everyone, hence the status check.
   */
  admins(reference: string): Promise<string[] | null> {
    return this.#call(async () => {
      const peer = await this.#inputOf(reference)
      try {
        const members = await this.#client.getChatMembers(peer, { type: "admins", limit: 200 })
        return members
          .filter((member) => member.status === "creator" || member.status === "admin")
          .map((member) => String(member.user.id))
      } catch (error) {
        const known = toCliError(error)
        if (known instanceof CliError && known.code === "permission_error") return null
        throw known
      }
    })
  }

  /** `null` when the group hides its member list from us: that is an answer about the group, not a failure. */
  async #membersOf(peer: InputPeerLike): Promise<Member[] | null> {
    try {
      const members = await this.#client.getChatMembers(peer, { limit: 200 })
      return members.map((member) => toMember(member.user))
    } catch (error) {
      const known = toCliError(error)
      if (known instanceof CliError && known.code === "permission_error") return null
      throw known
    }
  }

  async #call<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work()
    } catch (error) {
      throw toCliError(error)
    }
  }
}

export const TRANSCRIBE_POLL_MS = 2000
const TRANSCRIBE_WAIT_MS = 60_000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const messageNumber = (id: string, rule = "--before takes a message id"): number => {
  if (!/^\d+$/.test(id)) throw new CliError("validation_error", `${rule}, got "${id}"`)
  return Number(id)
}

const parseSendId = (typed: string): Long => {
  if (!/^-?\d{1,20}$/.test(typed))
    throw new CliError("validation_error", "--send-id is the number a failed send printed")
  return Long.fromString(typed)
}

/** No answer is not a refusal: the write may have reached Telegram. */
const unknownIfUnanswered = (error: unknown, what: string, details: Record<string, unknown> = {}): unknown => {
  const known = toCliError(error)
  if (known instanceof CliError && ["timeout", "network_error"].includes(known.code)) {
    return new CliError("outcome_unknown", `no answer from Telegram — ${what}`, { ...details, cause: known.code })
  }
  return known
}
