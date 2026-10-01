import { mkdtempSync } from "node:fs"
import { join } from "node:path"
import type { Contact, Member } from "@leemour/cli-messaging"
import { contractCases, type IdMaker, type Seed } from "@leemour/cli-messaging/testing"
import { MtPeerNotFoundError } from "@mtcute/node"
import { describe, it, vi } from "vitest"
import { TelegramAdapter } from "./adapter.js"

const stand = vi.hoisted(() => ({ seed: undefined as unknown }))

vi.mock("@mtcute/node", async (importOriginal) => {
  const real = await importOriginal<typeof import("@mtcute/node")>()
  return {
    ...real,
    TelegramClient: function TelegramClient() {
      return new SeededClient(stand.seed as Seed)
    },
  }
})
vi.mock("./storage.js", () => ({ openSessionStorage: async () => ({}) }))

/**
 * Ids as Telegram has them: a person's is positive, a supergroup's starts `-100`, and a one-to-one
 * chat's id is the other person's — the seed's chat 2 is its dialog with person 2.
 */
const telegramIds: IdMaker = (kind, n) => {
  if (kind === "person") return String(100 + n)
  if (kind === "message") return String(n)
  return n === 2 ? "102" : `-100${200 + n}`
}

interface UserPeer {
  type: "user"
  id: number
  displayName: string
  username: string | null
  isSelf: boolean
  isBot: false
}
interface GroupPeer {
  type: "chat"
  id: number
  displayName: string
  username: null
  chatType: "supergroup"
  isForum: false
  membersCount: number | null
}
type Peer = UserPeer | GroupPeer

interface Held {
  id: number
  chatId: number
  senderId: number
  date: Date
  text: string
  outgoing: boolean
}

class Signal {
  add() {}
  remove() {}
}

/**
 * The part of mtcute's `TelegramClient` the adapter reads, over a seeded account that keeps what is
 * sent. `getHistory` is mtcute's own paging (`get-history.js`) over Telegram's `messages.getHistory`
 * offsets (https://core.telegram.org/api/offsets), so a paging bug in the adapter shows here.
 */
class SeededClient {
  readonly log = { mgr: { handler: undefined as unknown } }
  readonly onNewMessage = new Signal()
  readonly onEditMessage = new Signal()
  readonly onDeleteMessage = new Signal()
  readonly onRawUpdate = new Signal()
  readonly storage
  readonly #seed: Seed
  readonly #peers = new Map<number, Peer>()
  readonly #held: Held[]
  readonly #sent = new Map<string, Held>()

  constructor(seed: Seed) {
    this.#seed = seed
    const owner = seed.account?.id
    this.storage = { self: { getCached: () => (owner ? { userId: Number(owner) } : null) } }
    const people: Pick<Contact, "id" | "name" | "username">[] = [
      ...(seed.account ? [seed.account] : []),
      ...seed.people,
      ...Object.values(seed.members).flat(),
    ]
    for (const person of people) this.#peers.set(Number(person.id), this.#user(person))
    for (const chat of seed.chats) {
      if (chat.kind !== "group") continue
      this.#peers.set(Number(chat.id), {
        type: "chat",
        id: Number(chat.id),
        displayName: chat.title ?? "",
        username: null,
        chatType: "supergroup",
        isForum: false,
        membersCount: chat.participantsCount,
      })
    }
    this.#held = seed.messages.map((message) => ({
      id: Number(message.id),
      chatId: Number(message.chatId),
      senderId: Number(message.senderId),
      date: new Date(message.timestamp),
      text: message.text,
      outgoing: message.outgoing === true,
    }))
  }

  prepare = async () => {}
  connect = async () => {}
  startUpdatesLoop = async () => {}
  destroy = async () => {}

  getMe = async () => this.#peer(Number(this.#seed.account?.id))
  getPeer = async (reference: unknown) => this.#peer(reference)
  getFullUser = async () => ({ bio: "" })

  async *iterDialogs() {
    for (const chat of this.#seed.chats) yield this.#dialog(this.#peer(Number(chat.id)))
  }

  getPeerDialogs = async (references: unknown) =>
    (Array.isArray(references) ? references : [references]).map((one) => this.#dialog(this.#peer(one)))

  getCommonChats = async (reference: unknown) => {
    const person = String(this.#peer(reference).id)
    return Object.entries(this.#seed.members)
      .filter(([chatId, members]) => Number(chatId) < 0 && members.some((member) => member.id === person))
      .map(([chatId]) => this.#peer(Number(chatId)))
  }

  getChatMembers = async (reference: unknown) =>
    (this.#seed.members[String(this.#peer(reference).id)] ?? []).map((member: Member) => ({
      user: this.#peer(Number(member.id)),
    }))

  getHistory = async (
    reference: unknown,
    params: {
      reverse?: boolean
      limit?: number
      offset?: { id: number; date: number }
      addOffset?: number
    } = {},
  ) => {
    const { reverse = false, limit = 100, addOffset = 0 } = params
    const offset = params.offset ?? (reverse ? { id: 1, date: 0 } : { id: 0, date: 0 })
    const found = this.#serverHistory(this.#peer(reference).id, {
      offsetId: offset.id,
      offsetDate: offset.date,
      addOffset: addOffset + (reverse ? -limit : 0),
      limit,
    }).map((held) => this.#message(held))
    if (reverse) found.reverse()
    const last = found.at(-1)
    const next = last ? { id: last.id + (reverse ? 1 : 0), date: Math.floor(last.date.getTime() / 1000) } : undefined
    return Object.assign(found, { next })
  }

  /** Telegram drops a repeated `random_id` and answers the message it already sent. */
  sendText = async (reference: unknown, text: string, { randomId }: { randomId: { toString(): string } }) => {
    const again = this.#sent.get(randomId.toString())
    if (again) return this.#message(again)
    const newest = this.#held.reduce((one, held) => (held.date > one ? held.date : one), new Date(0))
    const held: Held = {
      id: Math.max(...this.#held.map((one) => one.id)) + 1,
      chatId: this.#peer(reference).id,
      senderId: Number(this.#seed.account?.id),
      date: new Date(newest.getTime() + 60_000),
      text,
      outgoing: true,
    }
    this.#held.push(held)
    this.#sent.set(randomId.toString(), held)
    return this.#message(held)
  }

  /** Newest first; the page starts at the first message older than the offset, moved by `addOffset`. */
  #serverHistory(
    chatId: number,
    {
      offsetId,
      offsetDate,
      addOffset,
      limit,
    }: { offsetId: number; offsetDate: number; addOffset: number; limit: number },
  ): Held[] {
    const all = this.#held.filter((held) => held.chatId === chatId).sort((a, b) => b.id - a.id)
    const older = (held: Held) =>
      offsetId ? held.id < offsetId : offsetDate ? held.date.getTime() / 1000 < offsetDate : true
    const pivot = all.findIndex(older)
    const start = (pivot < 0 ? all.length : pivot) + addOffset
    return all.slice(Math.max(0, start), Math.max(0, start + limit))
  }

  #peer(reference: unknown): Peer {
    const id = reference === "me" ? Number(this.#seed.account?.id) : Number(reference)
    const peer = this.#peers.get(id)
    if (!peer) throw new MtPeerNotFoundError(`Peer ${String(reference)} is not found in local cache`)
    return peer
  }

  #user({ id, name, username }: Pick<Contact, "id" | "name" | "username">): UserPeer {
    return {
      type: "user",
      id: Number(id),
      displayName: name ?? "",
      username,
      isSelf: id === this.#seed.account?.id,
      isBot: false,
    }
  }

  #dialog(peer: Peer) {
    const newest = this.#held
      .filter((held) => held.chatId === peer.id)
      .reduce<Held | undefined>((one, held) => (!one || held.id > one.id ? held : one), undefined)
    const chat = this.#seed.chats.find((one) => one.id === String(peer.id))
    return {
      peer,
      isPinned: false,
      isArchived: false,
      isMuted: null,
      unreadCount: chat?.unreadCount ?? 0,
      unreadMentionsCount: 0,
      lastMessage: newest ? { date: newest.date } : null,
    }
  }

  #message(held: Held) {
    return {
      id: held.id,
      chat: this.#peer(held.chatId),
      sender: this.#peer(held.senderId),
      date: held.date,
      editDate: null,
      text: held.text,
      entities: [],
      isOutgoing: held.outgoing,
      isScheduled: false,
      media: null,
      replyToMessage: null,
      forward: null,
      isTopicMessage: false,
      reactions: null,
      views: null,
      forwards: null,
      groupedIdUnique: null,
      action: null,
      link: undefined,
    }
  }
}

const connect = (seed: Seed) => {
  stand.seed = seed
  return TelegramAdapter.open({
    credentials: { id: 1, hash: "h" },
    sessionPath: join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "contract-")), "default.session"),
  })
}

describe("TelegramAdapter keeps the port's promises", () => {
  for (const one of contractCases({ connect, ids: telegramIds }))
    it(one.name, async (context) => {
      const result = await one.run()
      if (result) context.skip(result.skipped)
    })
})
