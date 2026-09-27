import { chmodSync, existsSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { format } from "node:util"
import { CliError } from "@leemour/cli-core"
import { type Chat, type Message, type Page, pickChat } from "@leemour/cli-messaging"
import { type InputPeerLike, Long, TelegramClient, type User } from "@mtcute/node"
import type { ApiCredentials } from "./credentials.js"
import { toCliError } from "./errors.js"
import { type Account, peerToChat, toAccount, toChat, toMessage } from "./map.js"
import { openSessionStorage } from "./storage.js"

export interface AdapterOptions {
  credentials: ApiCredentials
  sessionPath: string
  /** Where the library's own log lines go, when asked for. Never stdout. */
  diagnostic?: (line: string) => void
  verbose?: boolean
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
    { credentials, sessionPath, diagnostic, verbose = false }: AdapterOptions,
    storage: Awaited<ReturnType<typeof openSessionStorage>>,
  ) {
    this.#sessionPath = sessionPath
    this.#client = new TelegramClient({
      apiId: credentials.id,
      apiHash: credentials.hash,
      storage,
      disableUpdates: true,
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
  send(chatId: string, text: string, { sendId }: { sendId: string }): Promise<Sent> {
    const id = parseSendId(sendId)
    return this.#call(async () => {
      try {
        const message = await this.#client.sendText(Number(chatId), text, { randomId: id })
        return { message: toMessage(message), sendId }
      } catch (error) {
        const known = toCliError(error)
        if (known instanceof CliError && ["timeout", "network_error"].includes(known.code)) {
          throw new CliError(
            "outcome_unknown",
            `no answer from Telegram — the message may have been sent. Repeat with --send-id ${sendId}, never without it`,
            { sendId, cause: known.code },
          )
        }
        throw known
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

  async #call<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work()
    } catch (error) {
      throw toCliError(error)
    }
  }
}

const messageNumber = (id: string): number => {
  if (!/^\d+$/.test(id)) throw new CliError("validation_error", `--before takes a message id, got "${id}"`)
  return Number(id)
}

const parseSendId = (typed: string): Long => {
  if (!/^-?\d{1,20}$/.test(typed))
    throw new CliError("validation_error", "--send-id is the number a failed send printed")
  return Long.fromString(typed)
}
