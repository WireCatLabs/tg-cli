import { mkdtempSync } from "node:fs"
import { join } from "node:path"
import type { MessageEvent } from "@leemour/cli-messaging"
import { FileLocation, Long, MtPeerNotFoundError, MtTimeoutError, tl } from "@mtcute/node"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TelegramAdapter, TRANSCRIBE_POLL_MS } from "./adapter.js"

type Handler = (value: unknown) => void

const stand = vi.hoisted(() => ({ client: undefined as unknown as FakeClient, options: undefined as unknown }))

class Signal {
  readonly handlers = new Set<Handler>()
  add(handler: Handler) {
    this.handlers.add(handler)
  }
  remove(handler: Handler) {
    this.handlers.delete(handler)
  }
  emit(value: unknown) {
    for (const handler of this.handlers) handler(value)
  }
}

const page = <T>(items: T[], next?: unknown, total = Number.POSITIVE_INFINITY) =>
  Object.assign([...items], { next, total })

class FakeClient {
  readonly calls: { method: string; args: unknown[] }[] = []
  readonly log = { mgr: { handler: undefined as unknown } }
  readonly storage = { self: { getCached: (_: boolean) => ({ userId: 1 }) as { userId: number } | null } }
  readonly onNewMessage = new Signal()
  readonly onEditMessage = new Signal()
  readonly onDeleteMessage = new Signal()
  readonly onRawUpdate = new Signal()
  dialogs: unknown[] = []
  history: unknown[] = []
  historyNext: unknown = undefined
  historyTotal = Number.POSITIVE_INFINITY
  peer: unknown = undefined
  members: unknown = []
  membersTotal: number | undefined
  found: unknown = null
  transcripts: { text: string; pending?: boolean }[] = []
  resolvePeer = async (peer: unknown): Promise<unknown> => ({ _: "inputPeerChannel", peer })
  exportedLink: string | Error = "https://t.me/test_channel/1"
  resolveChannel = vi.fn(async (_peer: unknown) => ({ _: "inputChannel", channelId: 500, accessHash: 42 }))
  authorizations: unknown[] = []
  phoneOwner: unknown = null
  contacts: unknown[] = []
  forwardAnswer: unknown = forwarded(60)
  migrationAnswer: unknown = undefined
  topicAnswer: unknown = forwarded(12)
  handleClientUpdate = vi.fn()
  call = async (request: { _: string }, options?: unknown) => {
    this.#record("call", options === undefined ? [request] : [request, options])
    if (request._ === "channels.exportMessageLink") {
      if (this.exportedLink instanceof Error) throw this.exportedLink
      return { link: this.exportedLink, html: "ignored synthetic embed" }
    }
    if (request._ === "messages.migrateChat") {
      if (this.migrationAnswer instanceof Error) throw this.migrationAnswer
      return this.migrationAnswer
    }
    if (request._ === "messages.createForumTopic") {
      if (this.topicAnswer instanceof Error) throw this.topicAnswer
      return this.topicAnswer
    }
    if (request._ === "account.getAuthorizations") return { authorizations: this.authorizations }
    if (request._ === "messages.forwardMessages") {
      if (this.forwardAnswer instanceof Error) throw this.forwardAnswer
      return this.forwardAnswer
    }
    return this.transcripts.shift() ?? { text: "", pending: true }
  }
  resolvePhoneNumber = async (phone: string) => {
    this.#record("resolvePhoneNumber", [phone])
    if (!this.phoneOwner) throw new tl.RpcError(400, "PHONE_NOT_OCCUPIED")
    this.peer = this.phoneOwner
    return { _: "inputPeerUser" }
  }
  getContacts = async () => this.contacts
  preview: unknown = null
  fullChat: unknown = null
  fullChats = new Map<number, unknown>()
  updateForumSettings = vi.fn(async (id: number) => {
    const current = this.fullChats.get(id) ?? this.fullChat
    if (current && typeof current === "object") this.fullChats.set(id, { ...current, isForum: true })
  })
  topics: unknown[] = []
  getForumTopicsById = vi.fn(async (..._args: unknown[]): Promise<unknown[]> => this.topics)
  getChatPreview = async (link: string) => {
    this.#record("getChatPreview", [link])
    if (!this.preview) throw new MtPeerNotFoundError("You have already joined this chat!")
    return this.preview
  }
  getFullChat = async (reference: unknown) => {
    this.#record("getFullChat", [reference])
    return this.fullChats.get(Number(reference)) ?? this.fullChat
  }
  async *iterForumTopics(...args: unknown[]) {
    this.#record("iterForumTopics", args)
    yield* this.topics
  }
  chunks: unknown[] = [new Uint8Array([1, 2]), new Uint8Array([3])]
  getMessages = async (...args: unknown[]) => {
    this.#record("getMessages", args)
    return [this.found]
  }
  async *downloadAsIterable(file: unknown) {
    this.#record("downloadAsIterable", [file])
    for (const chunk of this.chunks) {
      if (chunk instanceof Error) throw chunk
      yield chunk
    }
  }
  readHistory = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  deleteMessagesById = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  sendVote = vi.fn(async (..._args: unknown[]): Promise<unknown> => fakePoll({ chosen: 1 }))
  closePoll = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({ ...fakePoll({}), isClosed: true }))
  sendText = vi.fn(async (..._args: unknown[]): Promise<unknown> => message(99))
  sendMedia = vi.fn(async (..._args: unknown[]): Promise<unknown> => message(98))
  scheduledQueue: unknown[] = []
  getAllScheduledMessages = vi.fn(async (..._args: unknown[]) => this.scheduledQueue)
  createSupergroup = vi.fn(async (params: { title: string }): Promise<unknown> => group(-100700, params.title))
  createChannel = vi.fn(async (params: { title: string }): Promise<unknown> => group(-100701, params.title))
  addChatMembers = vi.fn(async (..._args: unknown[]): Promise<{ userId: number }[]> => [])
  joinChat = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({ status: "ok", chat: group(-100702, "Joined") }))
  leaveChat = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  setChatTitle = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  setChatDescription = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  setChatDefaultPermissions = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({}))
  exportInviteLink = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({ link: "https://t.me/+new" }))
  kickChatMember = vi.fn(async (..._args: unknown[]): Promise<unknown> => null)
  editAdminRights = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  filters: unknown[] = []
  getFolders = vi.fn(async () => ({ _: "messages.dialogFilters", filters: this.filters }))
  createFolder = vi.fn(
    async (folder: Record<string, unknown>): Promise<unknown> => ({
      _: "dialogFilter",
      id: 3,
      pinnedPeers: [],
      excludePeers: [],
      ...folder,
    }),
  )
  editFolder = vi.fn(async (params: { folder: Record<string, unknown>; modification: Record<string, unknown> }) => ({
    ...params.folder,
    ...params.modification,
  }))
  deleteFolder = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  addContact = vi.fn(
    async (params: { userId: unknown; firstName: string; lastName?: string }): Promise<unknown> =>
      user(Number(params.userId), [params.firstName, params.lastName].filter(Boolean).join(" ")),
  )
  deleteContacts = vi.fn(async (..._args: unknown[]): Promise<unknown[]> => [])
  blockUser = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  unblockUser = vi.fn(async (..._args: unknown[]): Promise<void> => {})
  importContacts = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({ imported: [{ userId: 91 }] }))
  updateProfile = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({}))
  setMyProfilePhoto = vi.fn(async (..._args: unknown[]): Promise<unknown> => ({}))
  sendReaction = vi.fn(async (..._args: unknown[]): Promise<unknown> => null)
  editMessage = vi.fn(async (..._args: unknown[]): Promise<unknown> => message(5))
  forwardMessagesById = vi.fn(async (..._args: unknown[]): Promise<unknown[]> => [message(60)])
  pinMessage = vi.fn(async (..._args: unknown[]): Promise<unknown> => null)
  unpinMessage = vi.fn(async (..._args: unknown[]): Promise<void> => {})

  #record(method: string, args: unknown[]) {
    this.calls.push({ method, args })
  }
  prepare = async () => this.#record("prepare", [])
  start = async (options: unknown) => {
    this.#record("start", [options])
    return user(1, "Owner", { isSelf: true })
  }
  getMe = async () => user(1, "Owner", { isSelf: true })
  async *iterDialogs(options: unknown) {
    this.#record("iterDialogs", [options])
    yield* this.dialogs
  }
  getHistory = async (...args: unknown[]) => {
    this.#record("getHistory", args)
    return page(this.history, this.historyNext, this.historyTotal)
  }
  getPeerDialogs = async (peer: unknown) => {
    this.#record("getPeerDialogs", [peer])
    const of = (id: unknown) =>
      (this.dialogs as { peer: { id: unknown } }[]).find((one) => one.peer.id === id) ?? this.dialogs[0] ?? null
    return Array.isArray(peer) ? peer.map(of) : [of(peer)]
  }
  getPeer = async (peer: unknown) => {
    this.#record("getPeer", [peer])
    return this.peer
  }
  getFullUser = async () => ({ bio: "a bio" })
  getCommonChats = async () => [{ id: -100500 }]
  getUsers = async (ids: number[]) => ids.map((id) => (id === 404 ? null : user(id, `User ${id}`)))
  getChatMembers = async (...args: unknown[]) => {
    this.#record("getChatMembers", args)
    if (this.members instanceof Error) throw this.members
    return Object.assign([...(this.members as unknown[])], {
      total: this.membersTotal ?? (this.members as unknown[]).length,
    })
  }
  connect = async () => this.#record("connect", [])
  startUpdatesLoop = async () => this.#record("startUpdatesLoop", [])
  logOut = async () => this.#record("logOut", [])
  destroy = async () => this.#record("destroy", [])
}

vi.mock("@mtcute/node", async (importOriginal) => {
  const real = await importOriginal<typeof import("@mtcute/node")>()
  return {
    ...real,
    TelegramClient: function TelegramClient(options: unknown) {
      stand.options = options
      stand.client = new FakeClient()
      return stand.client
    },
  }
})
vi.mock("./storage.js", () => ({ openSessionStorage: async () => ({}) }))

const user = (id: number, displayName: string, extra: Record<string, unknown> = {}) => ({
  type: "user",
  id,
  displayName,
  username: null,
  isSelf: false,
  isBot: false,
  ...extra,
})

const group = (id: number, displayName: string) => ({
  type: "chat",
  id,
  displayName,
  username: null,
  chatType: "supergroup",
  isForum: false,
  membersCount: 12,
})

const dialog = (peer: unknown, lastMessageAt = "2026-09-27T10:00:00.000Z") => ({
  peer,
  isArchived: false,
  isPinned: false,
  unreadCount: 2,
  lastMessage: { date: new Date(lastMessageAt) },
})

function fakePoll({ chosen }: { chosen?: number }) {
  const answer = (data: string, text: string, voters: number, index: number) => ({
    data: new TextEncoder().encode(data),
    text,
    voters,
    chosen: index === chosen,
  })
  return {
    type: "poll",
    question: "Friday?",
    answers: [answer("0", "yes", 4, 0), answer("1", "no", 1, 1)],
    isClosed: false,
    isMultiple: false,
    isPublic: true,
    voters: 5,
  }
}

/** What Telegram answers a forward with: the copy, in a supergroup, among the users and chats it names. */
function forwarded(id: number) {
  return {
    _: "updates",
    updates: [
      {
        _: "updateNewChannelMessage",
        message: {
          _: "message",
          id,
          peerId: { _: "peerChannel", channelId: 500 },
          fromId: { _: "peerUser", userId: 1 },
          date: 1790000000,
          message: "synthetic copy",
          out: true,
        },
        pts: 1,
        ptsCount: 1,
      },
    ],
    users: [{ _: "user", id: 1, firstName: "Owner", self: true }],
    chats: [
      {
        _: "channel",
        id: 500,
        title: "Valencia expats",
        megagroup: true,
        accessHash: Long.ZERO,
        photo: { _: "chatPhotoEmpty" },
        date: 0,
      },
    ],
    date: 1790000000,
    seq: 0,
  }
}

function message(id: number) {
  return {
    id,
    chat: group(-100500, "Valencia expats"),
    sender: user(777, "Ana"),
    date: new Date("2026-09-27T10:00:00.000Z"),
    editDate: null,
    text: `message ${id}`,
    entities: [],
    isOutgoing: false,
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

let umask: number
beforeEach(() => {
  umask = process.umask()
})
afterEach(() => {
  process.umask(umask)
})

const open = async (options: { listen?: boolean; diagnostic?: (line: string) => void } = {}) => {
  const adapter = await TelegramAdapter.open({
    credentials: { id: 1, hash: "h" },
    sessionPath: join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "adapter-")), "default.session"),
    ...options,
  })
  return { adapter, client: stand.client }
}

describe("opening", () => {
  it("**loads the logged-in user before any request**, and keeps updates off for a one-shot command", async () => {
    const { adapter, client } = await open()

    expect(client.calls[0]?.method).toBe("prepare")
    expect(stand.options).toMatchObject({ apiId: 1, apiHash: "h", disableUpdates: true })
    expect(adapter.self()).toBe("1")
  })

  it("sends mtcute's own log lines to the diagnostic stream, never stdout", async () => {
    const lines: string[] = []
    const { client } = await open({ diagnostic: (line) => lines.push(line) })
    const handler = client.log.mgr.handler as (...args: unknown[]) => void
    handler(0, 2, "net", "connected to %s", ["dc2"])

    expect(lines).toEqual(["[net] connected to dc2"])
  })

  it("asks for updates only when listening", async () => {
    await open({ listen: true })
    expect(stand.options).toMatchObject({ disableUpdates: false, updates: { catchUp: false } })
  })

  it("answers self() with null before a login", async () => {
    const { adapter, client } = await open()
    client.storage.self.getCached = () => null
    expect(adapter.self()).toBeNull()
  })
})

describe("reading", () => {
  it("pages chats by position and says whether more are left", async () => {
    const { adapter, client } = await open()
    client.dialogs = [1, 2, 3, 4].map((id) => dialog(group(-id, `chat ${id}`)))

    const chats = await adapter.chats({ limit: 2, offset: 1 })

    expect(chats.items.map((chat) => chat.title)).toEqual(["chat 2", "chat 3"])
    expect(chats.hasMore).toBe(true)
    expect(client.calls.find((call) => call.method === "iterDialogs")?.args[0]).toEqual({ archived: "keep" })
    expect((await adapter.chats({ offset: 0 })).items).toHaveLength(4)
  })

  it("lists a pinned chat once when Telegram's pages bring it again, and finds it by title", async () => {
    const { adapter, client } = await open()
    const pinned = dialog(group(-1, "Valencia expats"))
    client.dialogs = [pinned, dialog(group(-2, "chat 2")), pinned, dialog(group(-3, "chat 3"))]

    expect((await adapter.chats({ offset: 0 })).items.map((chat) => chat.id)).toEqual(["-1", "-2", "-3"])
    const page = await adapter.chats({ limit: 2, offset: 0 })
    expect(page.items.map((chat) => chat.id)).toEqual(["-1", "-2"])
    expect(page.hasMore).toBe(true)
    expect((await adapter.chat("Valencia")).id).toBe("-1")
  })

  it("reads history oldest first, from before a message id, by chat id or @username", async () => {
    const { adapter, client } = await open()
    client.history = [message(3), message(2)]
    client.historyNext = {}

    const history = await adapter.history("-100500", { limit: 2, before: "10" })
    await adapter.history("@someone", { limit: 2 })

    expect(history.items.map((one) => one.id)).toEqual(["2", "3"])
    expect(history.hasMore).toBe(true)
    const asked = client.calls.filter((call) => call.method === "getHistory").map((call) => call.args)
    expect(asked).toEqual([
      [-100500, { limit: 2, offset: { id: 10, date: 0 } }],
      ["someone", { limit: 2 }],
    ])
  })

  it("**reads past short pages and untrusted counts**, until the library returns no cursor", async () => {
    const { adapter, client } = await open()
    client.history = [message(3)]
    client.historyNext = { id: 3, date: 0 }
    client.historyTotal = 250
    const short = await adapter.history("-100500", { limit: 100, before: "10" })
    client.historyTotal = 0
    const inexact = await adapter.history("-100500", { limit: 100, before: "10" })

    client.history = [message(2), message(1)]
    client.historyNext = { id: 1, date: 0 }
    client.historyTotal = 2
    const small = await adapter.history("@someone", { limit: 100 })

    client.history = []
    client.historyNext = undefined
    client.historyTotal = 0
    const start = await adapter.history("-100500", { limit: 100, before: "3" })

    expect([short.items.map((one) => one.id), short.hasMore]).toEqual([["3"], true])
    expect(inexact.hasMore).toBe(true)
    expect([small.items.map((one) => one.id), small.hasMore]).toEqual([["1", "2"], true])
    expect([start.items, start.hasMore]).toEqual([[], false])
  })

  it("reads forward from one past a message id, or from a moment, keeping only what is newer", async () => {
    const { adapter, client } = await open()
    client.history = [message(11), message(12)]

    const byId = await adapter.historyAfter("-100500", { limit: 2, after: { id: "10" } })
    client.history = [message(11), { ...message(12), date: new Date("2026-09-27T11:00:00.000Z") }]
    const byTime = await adapter.historyAfter("-100500", {
      limit: 5,
      after: { time: Date.parse("2026-09-27T10:30:00.000Z") },
    })

    expect([byId.items.map((one) => one.id), byId.hasMore]).toEqual([["11", "12"], true])
    expect([byTime.items.map((one) => one.id), byTime.hasMore]).toEqual([["12"], false])
    const asked = client.calls.filter((call) => call.method === "getHistory").map((call) => call.args[1])
    expect(asked).toEqual([
      { limit: 2, reverse: true, offset: { id: 11, date: 0 } },
      { limit: 5, reverse: true, offset: { id: 0, date: Date.parse("2026-09-27T10:30:00.000Z") / 1000 } },
    ])
  })

  it("reads back from a moment, oldest first, keeping only what is older", async () => {
    const { adapter, client } = await open()
    const at = (id: number, time: string) => ({ ...message(id), date: new Date(time) })
    client.history = [
      at(12, "2026-09-27T11:00:00.000Z"),
      at(11, "2026-09-27T09:00:00.000Z"),
      at(10, "2026-09-27T08:00:00.000Z"),
    ]

    const page = await adapter.historyBefore("-100500", { limit: 3, time: Date.parse("2026-09-27T10:00:00.000Z") })

    expect([page.items.map((one) => one.id), page.hasMore]).toEqual([["10", "11"], true])
    const asked = client.calls.filter((call) => call.method === "getHistory").map((call) => call.args[1])
    expect(asked).toEqual([{ limit: 3, offset: { id: 0, date: Date.parse("2026-09-27T10:00:00.000Z") / 1000 } }])
  })

  it("reads chat events from service messages, oldest first, naming people it only has ids for", async () => {
    const { adapter, client } = await open()
    const at = (minute: number) => new Date(Date.UTC(2026, 8, 27, 10, minute))
    client.peer = group(-100500, "Valencia expats")
    client.history = [
      { ...message(5), date: at(5), action: { type: "user_joined_link", inviter: 30 } },
      { ...message(4), date: at(4), action: { type: "photo_changed" } },
      { ...message(3), date: at(3), action: { type: "users_added", users: [31, 404] } },
      { ...message(2), date: at(3) },
      { ...message(1), date: at(0), action: { type: "user_left" } },
    ]

    const found = await adapter.chatEvents("-100500", { since: at(1).getTime() })

    expect(found.events.map((one) => [one.messageId, one.event, one.by.name, one.people])).toEqual([
      [
        "3",
        "add",
        "Ana",
        [
          { id: "31", name: "User 31" },
          { id: "404", name: null },
        ],
      ],
      ["5", "join", "User 30", [{ id: "777", name: "Ana" }]],
    ])
    expect([found.chatId, found.more]).toEqual(["-100500", false])
  })

  it("stops chat events after ten pages and says there was more", async () => {
    const { adapter, client } = await open()
    client.peer = group(-100500, "Valencia expats")
    client.history = [message(1)]
    client.historyNext = {}

    const found = await adapter.chatEvents("-100500", { since: 0 })

    expect(found.more).toBe(true)
    expect(client.calls.filter((call) => call.method === "getHistory")).toHaveLength(10)
  })

  it("refuses a --before that is not a message id before asking Telegram", async () => {
    const { adapter, client } = await open()
    await expect(adapter.history("me", { limit: 2, before: "abc" })).rejects.toMatchObject({
      code: "validation_error",
    })
    expect(client.calls.some((call) => call.method === "getHistory")).toBe(false)
  })

  it("finds a chat by part of its title among the dialogs", async () => {
    const { adapter, client } = await open()
    client.dialogs = [dialog(group(-100500, "Valencia expats")), dialog(group(-100600, "Books"))]

    const chat = await adapter.resolve("valencia")

    expect(chat).toMatchObject({ id: "-100500", title: "Valencia expats", kind: "group" })
  })

  it("answers `me` as Saved Messages through Telegram's own peer", async () => {
    const { adapter, client } = await open()
    client.peer = user(1, "Owner", { isSelf: true })

    expect(await adapter.resolve("me")).toMatchObject({ id: "1", title: "Saved Messages", kind: "saved" })
    expect(client.calls.find((call) => call.method === "getPeer")?.args[0]).toBe("me")
  })

  it("shows a group with its members, and a hidden member list as null", async () => {
    const { adapter, client } = await open()
    client.dialogs = [dialog(group(-100500, "Valencia expats"))]
    client.members = [{ user: user(777, "Ana") }]

    expect((await adapter.chat("-100500")).members).toEqual([{ id: "777", name: "Ana", username: null }])

    client.members = new tl.RpcError(403, "CHAT_ADMIN_REQUIRED")
    expect((await adapter.chat("-100500")).members).toBeNull()
  })

  it("names a group's admins and creator, and a hidden list as null", async () => {
    const { adapter, client } = await open()
    client.dialogs = [dialog(group(-100500, "Valencia expats"))]
    client.members = [
      { user: user(1, "Owner"), status: "creator" },
      { user: user(2, "Mod"), status: "admin" },
      { user: user(3, "Ana"), status: "member" },
    ]

    expect(await adapter.admins("-100500")).toEqual(["1", "2"])

    client.members = new tl.RpcError(403, "CHAT_ADMIN_REQUIRED")
    expect(await adapter.admins("-100500")).toBeNull()
  })

  it("lists a group's members a page at a time, with role and last seen", async () => {
    const { adapter, client } = await open()
    client.peer = group(-100500, "Valencia expats")
    client.members = [
      { user: user(1, "Owner", { lastOnline: new Date("2026-09-27T10:00:00.000Z") }), status: "creator" },
      { user: user(2, "Ana"), status: "member" },
    ]
    client.membersTotal = 5

    const page = await adapter.members("-100500", { limit: 2, offset: 2 })

    expect(page).toMatchObject({
      chatId: "-100500",
      hasMore: true,
      items: [
        { id: "1", role: "owner", lastSeenAt: "2026-09-27T10:00:00.000Z" },
        { id: "2", role: "member", lastSeenAt: null },
      ],
    })
    const asked = client.calls.filter((call) => call.method === "getChatMembers").map((call) => call.args[1])
    expect(asked).toEqual([{ offset: 2, limit: 2 }])
  })

  it("previews an invite without joining, and reads a joined invite or a public link as the chat", async () => {
    const { adapter, client } = await open()
    const chat = {
      chatType: "supergroup",
      title: "Pisos",
      id: -100500,
      username: "pisos_vlc",
      membersCount: 40,
      bio: "",
      isMember: true,
    }
    client.preview = { type: "supergroup", title: "Pisos", memberCount: 40, withApproval: true }

    expect(await adapter.inspect("https://t.me/+abc")).toMatchObject({ id: null, member: false, approvalNeeded: true })

    client.preview = null
    client.fullChat = chat
    expect(await adapter.inspect("https://t.me/+abc")).toMatchObject({ id: "-100500", member: true, description: null })
    expect(await adapter.inspect("https://t.me/pisos_vlc?start=1")).toMatchObject({ username: "pisos_vlc" })
    const read = client.calls.filter((call) => call.method === "getFullChat").map((call) => call.args[0])
    expect(read).toEqual(["https://t.me/+abc", "pisos_vlc"])
  })

  it("lists a forum's topics a page at a time, passing a search on as Telegram's query", async () => {
    const { adapter, client } = await open()
    const topic = (id: number) => ({
      id,
      title: `Topic ${id}`,
      isClosed: false,
      isPinned: id === 1,
      unreadCount: 0,
      lastMessage: { date: new Date("2026-09-27T10:00:00.000Z") },
      date: new Date("2026-09-01T10:00:00.000Z"),
    })
    client.topics = [topic(1), topic(2), topic(3)]

    const page = await adapter.topics("-100500", { search: "pis", limit: 1, offset: 1 })

    expect(page).toMatchObject({ hasMore: true, items: [{ id: "2", title: "Topic 2", pinned: false }] })
    expect(client.calls.find((call) => call.method === "iterForumTopics")?.args[1]).toEqual({ limit: 3, query: "pis" })
  })

  it("finds a person by phone, and says nobody is there without repeating the number", async () => {
    const { adapter, client } = await open()
    client.phoneOwner = user(21, "Adam", { username: "adam_k" })

    expect(await adapter.lookup("34600123456")).toEqual({ id: "21", name: "Adam", username: "adam_k" })

    client.phoneOwner = null
    const missing = adapter.lookup("34600123456")
    await expect(missing).rejects.toMatchObject({ code: "not_found" })
    await expect(missing).rejects.not.toThrow(/600123456/)
  })

  it("lists the address book, and the sessions without their IP address", async () => {
    const { adapter, client } = await open()
    client.contacts = [user(21, "Adam")]
    client.authorizations = [
      {
        current: true,
        appName: "tg",
        appVersion: "0.9.0",
        deviceModel: "Linux",
        platform: "",
        systemVersion: "6.8",
        region: "Valencia",
        country: "Spain",
        ip: "192.0.2.1",
        dateActive: 1_790_000_000,
        dateCreated: 0,
      },
    ]

    expect(await adapter.addressBook()).toEqual([{ id: "21", name: "Adam", username: null }])
    const [session] = await adapter.sessions()
    expect(session).toEqual({
      current: true,
      client: "tg 0.9.0",
      device: "Linux, 6.8",
      location: "Valencia, Spain",
      lastActiveAt: new Date(1_790_000_000_000).toISOString(),
      createdAt: null,
    })
  })

  it("shows a person with their bio, the one-to-one chat and the chats in common", async () => {
    const { adapter, client } = await open()
    client.peer = user(777, "Ana")
    client.dialogs = [dialog(group(-100500, "Valencia expats")), dialog(user(777, "Ana"), "2026-09-28T10:00:00.000Z")]

    const card = await adapter.contact("777")

    expect(card).toMatchObject({ id: "777", name: "Ana", description: "a bio" })
    expect(card.chats).toEqual([
      { id: "777", title: "Ana", kind: "dialog", lastMessageAt: "2026-09-28T10:00:00.000Z" },
      { id: "-100500", title: "Valencia expats", kind: "group", lastMessageAt: "2026-09-27T10:00:00.000Z" },
    ])
  })

  it("refuses a contact that is a chat", async () => {
    const { adapter, client } = await open()
    client.peer = group(-100500, "Valencia expats")
    await expect(adapter.contact("-100500")).rejects.toMatchObject({ code: "validation_error" })
  })

  it("cuts the window around a message and marks the anchor", async () => {
    const { adapter, client } = await open()
    client.history = [message(12), message(11), message(10), message(9), message(8)]

    const window = await adapter.around("-100500", "10", { before: 1, after: 1 })

    expect(window.map((one) => one.id)).toEqual(["9", "10", "11"])
    expect(window.find((one) => one.id === "10")).toMatchObject({ anchor: true })
    expect(client.calls.find((call) => call.method === "getHistory")?.args[1]).toEqual({
      offset: { id: 11, date: 0 },
      addOffset: -1,
      limit: 3,
    })
  })

  it("says not found when the message is not in the window", async () => {
    const { adapter, client } = await open()
    client.history = [message(5)]
    await expect(adapter.around("-100500", "10", { before: 1, after: 1 })).rejects.toMatchObject({
      code: "not_found",
    })
  })

  it("answers who this is with the phone, which only me() carries", async () => {
    const { adapter, client } = await open()
    client.getMe = async () => user(1, "Owner", { isSelf: true, phoneNumber: "0000001234" })

    expect(await adapter.me()).toEqual({ id: "1", name: "Owner", username: null, phone: "0000001234" })
  })

  it("turns Telegram's refusal into a typed error", async () => {
    const { adapter, client } = await open()
    client.getMe = async () => {
      throw new tl.RpcError(401, "AUTH_KEY_UNREGISTERED")
    }
    await expect(adapter.me()).rejects.toMatchObject({ code: "authentication_error" })
  })
})

describe("downloading", () => {
  const document = () =>
    Object.assign(new FileLocation(new Uint8Array()), {
      type: "document",
      fileName: "notes.pdf",
      mimeType: "application/pdf",
      fileSize: 3,
    })
  const read = async (file?: { bytes(): AsyncIterable<Uint8Array> }) => {
    const chunks: number[] = []
    for await (const chunk of file?.bytes() ?? []) chunks.push(...chunk)
    return chunks
  }

  it("**fetches the message afresh** and hands over its file with the bytes to read", async () => {
    const { adapter, client } = await open()
    client.found = { ...message(10), media: document() }

    const { files, skipped } = await adapter.download("-100500", "10")

    expect(client.calls.find((call) => call.method === "getMessages")?.args).toEqual([-100500, 10])
    expect(files).toMatchObject([{ kind: "document", name: "notes.pdf", mime: "application/pdf", size: 3 }])
    expect(await read(files[0])).toEqual([1, 2, 3])
    expect(skipped).toEqual([])
  })

  it("names media that is not a file, and says not found for a missing message", async () => {
    const { adapter, client } = await open()
    client.found = { ...message(10), media: { type: "poll" } }
    expect(await adapter.download("-100500", "10")).toEqual({ files: [], skipped: ["poll"] })

    client.found = null
    await expect(adapter.download("-100500", "10")).rejects.toMatchObject({ code: "not_found" })
  })

  it("turns a failure mid-download into a typed error", async () => {
    const { adapter, client } = await open()
    client.found = { ...message(10), media: document() }
    client.chunks = [new tl.RpcError(400, "FILE_REFERENCE_EXPIRED")]

    const { files } = await adapter.download("-100500", "10")

    await expect(read(files[0])).rejects.toMatchObject({ code: "provider_error" })
  })
})

describe("transcribing", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("**asks again until Telegram has finished**, and answers the text", async () => {
    vi.useFakeTimers()
    const { adapter, client } = await open()
    client.transcripts = [{ text: "", pending: true }, { text: "", pending: true }, { text: "hello" }]

    const answer = adapter.transcribe("me", "126508")
    await vi.advanceTimersByTimeAsync(TRANSCRIBE_POLL_MS * 2)

    expect(await answer).toEqual({ text: "hello", pending: false })
    expect(client.calls.filter((call) => call.method === "call")).toHaveLength(3)
    expect(client.calls.find((call) => call.method === "call")?.args[0]).toMatchObject({
      _: "messages.transcribeAudio",
      msgId: 126508,
    })
  })

  it("stops after a minute and says it is still pending", async () => {
    vi.useFakeTimers()
    const { adapter } = await open()

    const answer = adapter.transcribe("me", "5")
    await vi.advanceTimersByTimeAsync(61_000)

    expect(await answer).toEqual({ text: "", pending: true })
  })
})

const forumFull = (id: number, extra: Record<string, unknown> = {}) => ({
  ...group(id, "synthetic group"),
  chatType: "supergroup",
  isCreator: true,
  isForum: false,
  linkedChat: null,
  migratedToId: null,
  raw: { _: "channel", forumTabs: false },
  adminRights: null,
  permissions: null,
  defaultPermissions: null,
  ...extra,
})

describe("forum setup", () => {
  it("reads basic, migrated and forum state, and refuses channels", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-500, { chatType: "group" })
    expect(await adapter.forumState("-500")).toMatchObject({ needsUpgrade: true, owner: true, forum: false })
    client.fullChat = forumFull(-500, { chatType: "group", migratedToId: -1000000000700 })
    client.fullChats.set(-1000000000700, forumFull(-1000000000700, { isForum: true }))
    expect(await adapter.forumState("-500")).toMatchObject({
      chat: { id: "-1000000000700" },
      needsUpgrade: false,
      forum: true,
    })
    client.fullChat = forumFull(-501, { chatType: "channel" })
    await expect(adapter.forumState("-501")).rejects.toThrow("not a channel")
  })
  it("migrates once and uses the returned supergroup peer", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-500, { chatType: "group" })
    client.resolvePeer = async () => ({ _: "inputPeerChat", chatId: 500 })
    client.fullChats.set(-1000000000700, forumFull(-1000000000700))
    client.migrationAnswer = {
      _: "updates",
      users: [],
      updates: [],
      chats: [{ _: "channel", id: 700, megagroup: true }],
      date: 0,
      seq: 0,
    }
    expect(await adapter.upgradeForum("-500")).toMatchObject({ chat: { id: "-1000000000700" }, needsUpgrade: false })
    expect(client.calls).toContainEqual({
      method: "call",
      args: [
        { _: "messages.migrateChat", chatId: 500 },
        { maxRetryCount: 0, floodSleepThreshold: 0 },
      ],
    })
    expect(client.handleClientUpdate).toHaveBeenCalled()
    await adapter.upgradeForum("-1000000000700")
    expect(client.calls.filter(({ method }) => method === "call")).toHaveLength(1)
  })
  it("preserves the migrated peer when confirmation fails", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-500, { chatType: "group" })
    client.resolvePeer = async () => ({ _: "inputPeerChat", chatId: 500 })
    client.migrationAnswer = {
      _: "updates",
      users: [],
      updates: [],
      chats: [{ _: "channel", id: 700, megagroup: true }],
      date: 0,
      seq: 0,
    }
    const read = client.getFullChat
    client.getFullChat = async (reference) => {
      if (reference === -1000000000700) throw new Error("synthetic confirmation failure")
      return read(reference)
    }
    await expect(adapter.upgradeForum("-500")).rejects.toMatchObject({
      code: "outcome_unknown",
      details: { previousChatId: "-500", chatId: "-1000000000700", upgraded: true, stage: "upgrade" },
    })
    expect(client.updateForumSettings).not.toHaveBeenCalled()
  })
  it("preserves forum UI, reads back and does not toggle again", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-100700, { raw: { _: "channel", forumTabs: true } })
    expect(await adapter.enableForum("-100700")).toMatchObject({ forum: true })
    expect(client.updateForumSettings).toHaveBeenCalledWith(-100700, { isForum: true, threadsMode: "tabs" })
    await adapter.enableForum("-100700")
    expect(client.updateForumSettings).toHaveBeenCalledTimes(1)
  })
  it.each([{ isCreator: false }, { chatType: "group" }, { linkedChat: {} }])(
    "refuses invalid enable state %j without toggle",
    async (extra) => {
      const { adapter, client } = await open()
      client.fullChat = forumFull(-100700, extra)
      await expect(adapter.enableForum("-100700")).rejects.toThrow()
      expect(client.updateForumSettings).not.toHaveBeenCalled()
    },
  )
  it("creates a topic with the chosen random id and returns its server fields", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-100500, { isForum: true })
    client.topics = [
      {
        id: 12,
        title: "synthetic topic",
        isClosed: false,
        isPinned: false,
        unreadCount: 0,
        lastMessage: null,
        date: new Date("2026-10-03T00:00:00Z"),
      },
    ]
    const topic = await adapter.createTopic("-100500", "synthetic topic", { sendId: "42" })
    expect(topic).toMatchObject({ id: "12", title: "synthetic topic" })
    const request = client.calls.find(
      ({ method, args }) => method === "call" && (args[0] as { _: string })._ === "messages.createForumTopic",
    )?.args[0] as { randomId: unknown }
    expect(String(request.randomId)).toBe("42")
    expect(
      client.calls.find(
        ({ method, args }) => method === "call" && (args[0] as { _: string })._ === "messages.createForumTopic",
      )?.args[1],
    ).toEqual({ maxRetryCount: 0, floodSleepThreshold: 0 })
    expect(client.getForumTopicsById).toHaveBeenCalledWith(-100500, 12)
  })
  it("reports unknown creation/migration without inventing a retry identity", async () => {
    const { adapter, client } = await open()
    client.fullChat = forumFull(-100500, { isForum: true })
    client.topicAnswer = new MtTimeoutError(1000)
    await expect(adapter.createTopic("-100500", "synthetic", { sendId: "42" })).rejects.toMatchObject({
      code: "outcome_unknown",
      details: { sendId: "42", retryable: false },
    })
    client.topicAnswer = { _: "updates", updates: [], chats: [], users: [] }
    await expect(adapter.createTopic("-100500", "synthetic", { sendId: "43" })).rejects.toMatchObject({
      code: "outcome_unknown",
      details: { retryable: false },
    })
    client.fullChat = forumFull(-500, { chatType: "group" })
    client.resolvePeer = async () => ({ _: "inputPeerChat", chatId: 500 })
    client.migrationAnswer = new MtTimeoutError(1000)
    await expect(adapter.upgradeForum("-500")).rejects.toMatchObject({ code: "outcome_unknown" })
  })
})

describe("provider Markdown mapping", () => {
  it("preserves rich spans across text, edit and scheduled captions", async () => {
    const { adapter, client } = await open()
    const formatted = await adapter.formatMarkdown("🧪 **b** __u__ [l](https://example.test)")
    await adapter.send("-100500", formatted.text, { sendId: "42", threadId: "12", formatting: formatted.spans })
    expect(client.sendText.mock.calls[0]?.[1]).toMatchObject({
      text: "🧪 b u l",
      entities: [
        { _: "messageEntityBold", offset: 3, length: 1 },
        { _: "messageEntityUnderline", offset: 5, length: 1 },
        { _: "messageEntityTextUrl", offset: 7, length: 1, url: "https://example.test" },
      ],
    })
    await adapter.edit("-100500", "14", formatted.text, { formatting: formatted.spans })
    expect(client.editMessage.mock.calls[0]?.[0]).toMatchObject({ text: { text: formatted.text } })
    await adapter.send("-100500", formatted.text, {
      sendId: "43",
      threadId: "12",
      at: "2027-01-01T12:00:00.000Z",
      formatting: formatted.spans,
      attachments: [{ kind: "photo", name: "synthetic.png", bytes: new Uint8Array([1]) }],
    })
    expect(client.sendMedia.mock.calls[0]?.[1]).toMatchObject({
      caption: { text: formatted.text, entities: expect.any(Array) },
    })
    expect(client.sendMedia.mock.calls[0]?.[2]).toMatchObject({
      threadId: 12,
      schedule: new Date("2027-01-01T12:00:00.000Z"),
    })
  })
})

describe("forum addressing", () => {
  it.each(["0", "-1", "1.2", "2147483648", "x", " 12"])("rejects invalid topic %s without a request", async (id) => {
    const { adapter, client } = await open()
    await expect(adapter.validateThread("-100500", id, {})).rejects.toThrow("positive Telegram topic id")
    expect(client.getForumTopicsById).not.toHaveBeenCalled()
  })

  it("checks the forum, topic state and reply membership without sending", async () => {
    const { adapter, client } = await open()
    client.peer = group(-100500, "synthetic")
    await expect(adapter.validateThread("-100500", "12", {})).rejects.toThrow("requires a Telegram forum group")
    client.peer = { ...group(-100500, "synthetic"), isForum: true }
    await expect(adapter.validateThread("-100500", "12", {})).rejects.toThrow("does not exist")
    client.topics = [{ id: 12, isClosed: true }]
    await expect(adapter.validateThread("-100500", "12", {})).rejects.toThrow("is closed")
    client.topics = [{ id: 12, isClosed: false }]
    await expect(adapter.validateThread("-100500", "12", { replyTo: "14" })).rejects.toThrow("no longer exists")
    client.found = { ...message(14), isTopicMessage: true, replyToMessage: { threadId: 13 } }
    await expect(adapter.validateThread("-100500", "12", { replyTo: "14" })).rejects.toThrow("different topic")
    client.found = { ...message(14), isTopicMessage: true, replyToMessage: { threadId: 12 } }
    await adapter.validateThread("-100500", "12", { replyTo: "14" })
    client.found = message(12)
    await adapter.validateThread("-100500", "12", { replyTo: "12" })
    client.found = message(14)
    await adapter.validateThread("-100500", "1", { replyTo: "14" })
    expect(client.sendText).not.toHaveBeenCalled()
    expect(client.sendMedia).not.toHaveBeenCalled()
  })

  it("preserves non-General topics across text, scheduled media and polls", async () => {
    const { adapter, client } = await open()
    await adapter.send("-100500", "hello", { sendId: "42", threadId: "12", replyTo: "14" })
    await adapter.send("-100500", "caption", {
      sendId: "43",
      threadId: "12",
      at: "2027-01-01T12:00:00.000Z",
      attachments: [{ kind: "photo", name: "synthetic.png", bytes: new Uint8Array([1]) }],
    })
    await adapter.createPoll(
      "-100500",
      { question: "Friday?", answers: ["yes", "no"], anonymous: true, multiple: false, revote: false },
      { sendId: "44", threadId: "12", silent: true },
    )
    expect(client.sendText.mock.calls[0]?.[2]).toMatchObject({ threadId: 12, replyTo: 14 })
    expect(client.sendMedia.mock.calls[0]?.[2]).toMatchObject({
      threadId: 12,
      schedule: new Date("2027-01-01T12:00:00.000Z"),
    })
    expect(client.sendMedia.mock.calls[1]?.[2]).toMatchObject({ threadId: 12, silent: true })
    expect(String((client.sendMedia.mock.calls[1]?.[2] as { randomId: unknown } | undefined)?.randomId)).toBe("44")
    await adapter.send("-100500", "general", { sendId: "45", threadId: "1", replyTo: "14" })
    expect(client.sendText.mock.calls[1]?.[2]).toMatchObject({ replyTo: 14 })
    expect(client.sendText.mock.calls[1]?.[2]).not.toHaveProperty("threadId")
  })

  it("maps a topic closed after preflight to a known refusal", async () => {
    const { adapter, client } = await open()
    client.sendText.mockRejectedValueOnce(new tl.RpcError(400, "TOPIC_CLOSED"))
    await expect(adapter.send("-100500", "hi", { sendId: "42", threadId: "12" })).rejects.toMatchObject({
      code: "permission_error",
    })
    expect(client.sendText).toHaveBeenCalledTimes(1)
  })
})

describe("sending", () => {
  it("**sends with the given random_id** and answers with the message", async () => {
    const { adapter, client } = await open()

    const sent = await adapter.send("-100500", "hola", { sendId: "123456789012345", replyTo: "7" })

    expect(sent).toMatchObject({ sendId: "123456789012345", message: { id: "99" } })
    const [chat, text, options] = client.sendText.mock.calls[0] ?? []
    expect([chat, text]).toEqual([-100500, "hola"])
    expect(String((options as { randomId: unknown }).randomId)).toBe("123456789012345")
    expect(options).toMatchObject({ replyTo: 7 })
  })

  it("sends silently, without a preview, with each span as a Telegram entity", async () => {
    const { adapter, client } = await open()

    await adapter.send("-100500", "hola amigo", {
      sendId: "42",
      silent: true,
      noPreview: true,
      markup: [
        { type: "bold", from: 0, length: 4 },
        { type: "code", from: 5, length: 5 },
      ],
    })

    const [, text, options] = client.sendText.mock.calls[0] ?? []
    expect(text).toEqual({
      text: "hola amigo",
      entities: [
        { _: "messageEntityBold", offset: 0, length: 4 },
        { _: "messageEntityCode", offset: 5, length: 5 },
      ],
    })
    expect(options).toMatchObject({ silent: true, disableWebPreview: true })
  })

  it("sends a voice message as voice, and a video as a video unless asFile", async () => {
    const { adapter, client } = await open()
    const bytes = new Uint8Array([1, 2, 3])
    client.sendMedia.mockClear()

    await adapter.send("-100500", "", { sendId: "1", attachments: [{ kind: "voice", name: "note.ogg", bytes }] })
    await adapter.send("-100500", "", { sendId: "2", attachments: [{ kind: "file", name: "trip.mp4", bytes }] })
    await adapter.send("-100500", "", {
      sendId: "3",
      attachments: [{ kind: "file", name: "trip.mp4", bytes, asFile: true }],
    })

    expect(client.sendMedia.mock.calls.map((call) => call[1])).toMatchObject([
      { type: "voice", fileMime: "audio/ogg" },
      { type: "video", fileName: "trip.mp4", fileMime: "video/mp4" },
      { type: "document", fileName: "trip.mp4" },
    ])
  })

  it("**sends a photo with its caption, the same random_id and the reply**, a file as a document, one per message", async () => {
    const { adapter, client } = await open()
    const bytes = new Uint8Array([1, 2, 3])

    const sent = await adapter.send("-100500", "look", {
      sendId: "123456789012345",
      replyTo: "7",
      attachments: [{ kind: "photo", name: "cat.png", bytes }],
    })
    await adapter.send("-100500", "", { sendId: "42", attachments: [{ kind: "file", name: "plan.pdf", bytes }] })

    expect(sent.message.id).toBe("98")
    const [[chat, photo, options], [, file]] = client.sendMedia.mock.calls as unknown[][] as [unknown[], unknown[]]
    expect(chat).toBe(-100500)
    expect(photo).toMatchObject({ type: "photo", file: bytes, fileName: "cat.png", caption: "look" })
    expect(String((options as { randomId: unknown }).randomId)).toBe("123456789012345")
    expect(options).toMatchObject({ replyTo: 7 })
    expect(file).toMatchObject({ type: "document", fileName: "plan.pdf" })
    expect(client.sendText).not.toHaveBeenCalled()
    expect(() =>
      adapter.send("-100500", "", {
        sendId: "42",
        attachments: [
          { kind: "photo", name: "a.png", bytes },
          { kind: "photo", name: "b.png", bytes },
        ],
      }),
    ).toThrow(/one file or photo/)
  })

  it("schedules with --at, and lists the queue soonest first, each with the time it goes", async () => {
    const { adapter, client } = await open()
    const at = "2030-01-01T09:00:00.000Z"
    client.scheduledQueue = [
      { ...message(8), isScheduled: true, date: new Date("2030-01-02T09:00:00.000Z") },
      { ...message(7), isScheduled: true, date: new Date(at) },
    ]

    await adapter.send("-100500", "later", { sendId: "42", at })
    const queued = await adapter.scheduled("-100500")

    const [, , options] = client.sendText.mock.calls[0] ?? []
    expect((options as { schedule: Date }).schedule.toISOString()).toBe(at)
    expect(queued.map((one) => [one.id, one.scheduledFor])).toEqual([
      ["7", at],
      ["8", "2030-01-02T09:00:00.000Z"],
    ])
  })

  it("**makes a timeout an unknown outcome** that names the send id to repeat", async () => {
    const { adapter, client } = await open()
    client.sendText.mockRejectedValueOnce(new MtTimeoutError(1000))

    await expect(adapter.send("-100500", "hola", { sendId: "42" })).rejects.toMatchObject({
      code: "outcome_unknown",
      details: { sendId: "42", cause: "timeout" },
    })
  })

  it("passes any other refusal through as it is", async () => {
    const { adapter, client } = await open()
    client.sendText.mockRejectedValueOnce(new tl.RpcError(403, "CHAT_WRITE_FORBIDDEN"))

    await expect(adapter.send("-100500", "hola", { sendId: "42" })).rejects.toMatchObject({ code: "permission_error" })
  })

  it("refuses a send id that is not a number without sending", async () => {
    const { adapter, client } = await open()
    expect(() => adapter.send("-100500", "hola", { sendId: "abc" })).toThrow(/--send-id/)
    expect(client.sendText).not.toHaveBeenCalled()
  })
})

describe("editing", () => {
  it("edits by chat and message id and answers with the edited message", async () => {
    const { adapter, client } = await open()

    const edited = await adapter.edit("-100500", "5", "fixed")

    expect(edited).toMatchObject({ id: "5" })
    expect(client.editMessage).toHaveBeenCalledWith({ chatId: -100500, message: 5, text: "fixed" })
  })

  it("sends an edit's markup as Telegram entities", async () => {
    const { adapter, client } = await open()

    await adapter.edit("-100500", "5", "fixed now", { markup: [{ type: "bold", from: 0, length: 5 }] })

    expect(client.editMessage).toHaveBeenCalledWith({
      chatId: -100500,
      message: 5,
      text: { text: "fixed now", entities: [{ _: "messageEntityBold", offset: 0, length: 5 }] },
    })
  })

  it("**takes an edit to the same text as done**, answering the message as it stands", async () => {
    const { adapter, client } = await open()
    client.editMessage.mockRejectedValueOnce(new tl.RpcError(400, "MESSAGE_NOT_MODIFIED"))
    client.found = message(5)

    await expect(adapter.edit("-100500", "5", "same")).resolves.toMatchObject({ id: "5" })
    expect(client.calls.find((call) => call.method === "getMessages")?.args).toEqual([-100500, [5]])
  })

  it("makes a timeout an unknown outcome, and passes a refusal through", async () => {
    const { adapter, client } = await open()
    client.editMessage.mockRejectedValueOnce(new MtTimeoutError(1000))
    client.editMessage.mockRejectedValueOnce(new tl.RpcError(403, "MESSAGE_AUTHOR_REQUIRED"))

    await expect(adapter.edit("-100500", "5", "x")).rejects.toMatchObject({ code: "outcome_unknown" })
    await expect(adapter.edit("-100500", "5", "x")).rejects.toMatchObject({ code: "permission_error" })
  })
})

describe("forwarding", () => {
  it("forwards one message by id, quietly when asked, and answers the copy", async () => {
    const { adapter, client } = await open()

    const copy = await adapter.forward("-100500", "5", "-1001", { sendId: "123456789012345", silent: true })

    expect(copy).toMatchObject({ id: "60", text: "synthetic copy", outgoing: true })
    const request = client.calls.find((call) => call.method === "call")?.args[0] as Record<string, unknown>
    expect(request).toMatchObject({ _: "messages.forwardMessages", id: [5], silent: true })
    expect(String((request.randomId as unknown[])[0])).toBe("123456789012345")
    expect(client.handleClientUpdate).toHaveBeenCalledOnce()
  })

  it("makes a timeout an unknown outcome that names the send id to repeat with", async () => {
    const { adapter, client } = await open()
    client.forwardAnswer = new MtTimeoutError(1000)

    await expect(adapter.forward("-100500", "5", "1", { sendId: "77" })).rejects.toMatchObject({
      code: "outcome_unknown",
      message: expect.stringContaining("--send-id 77"),
      details: { sendId: "77" },
    })
  })
})

describe("pinning", () => {
  it("pins quietly unless asked, and unpins by message id", async () => {
    const { adapter, client } = await open()

    await adapter.pin("-100500", "5", { notify: false })
    await adapter.unpin("-100500", "5")

    expect(client.pinMessage).toHaveBeenCalledWith({ chatId: -100500, message: 5, notify: false })
    expect(client.unpinMessage).toHaveBeenCalledWith({ chatId: -100500, message: 5 })
  })

  it("turns a missing admin right into a permission error", async () => {
    const { adapter, client } = await open()
    client.pinMessage.mockRejectedValueOnce(new tl.RpcError(403, "CHAT_ADMIN_REQUIRED"))

    await expect(adapter.pin("-100500", "5", { notify: true })).rejects.toMatchObject({ code: "permission_error" })
  })
})

describe("reacting", () => {
  it("sets one emoji, and null takes it off", async () => {
    const { adapter, client } = await open()

    await adapter.react("-100500", "5", "👍")
    await adapter.react("-100500", "5", null)

    expect(client.sendReaction.mock.calls).toEqual([
      [{ chatId: -100500, message: 5, emoji: "👍" }],
      [{ chatId: -100500, message: 5, emoji: null }],
    ])
  })

  it("passes an emoji the chat does not allow through as Telegram's refusal", async () => {
    const { adapter, client } = await open()
    client.sendReaction.mockRejectedValueOnce(new tl.RpcError(400, "REACTION_INVALID"))

    await expect(adapter.react("-100500", "5", "🦄")).rejects.toMatchObject({ code: "provider_error" })
  })
})

describe("making, joining and leaving groups", () => {
  const full = (id: number, title: string) => ({
    ...group(id, title),
    bio: "",
    inviteLink: null,
    defaultPermissions: { canPinMessages: false, canInviteUsers: true },
  })

  it("**makes a supergroup, never a legacy group**, adds the people after, and says who could not be added", async () => {
    const { adapter, client } = await open()
    client.fullChat = full(-100700, "Plans")
    client.addChatMembers.mockResolvedValueOnce([{ userId: 92 }])

    const card = await adapter.createGroup("Plans", ["91", "92"], { channel: false })

    expect(client.createSupergroup.mock.calls).toEqual([[{ title: "Plans" }]])
    expect(client.addChatMembers.mock.calls).toEqual([[-100700, [91, 92], {}]])
    expect(card).toMatchObject({
      id: "-100700",
      title: "Plans",
      description: null,
      settings: { allCanPin: false, onlyAdminsAdd: false, onlyAdminsCall: null },
      providerMetadata: { notAdded: ["92"] },
    })
  })

  it("makes a channel with --channel, and adds nobody when nobody was named", async () => {
    const { adapter, client } = await open()
    client.fullChat = full(-100701, "News")

    await adapter.createGroup("News", [], { channel: true })

    expect(client.createChannel).toHaveBeenCalledOnce()
    expect(client.addChatMembers).not.toHaveBeenCalled()
  })

  it("**turns references into user ids**, and refuses a chat where a person was expected", async () => {
    const { adapter, client } = await open()
    client.peer = user(91, "Ivan")
    expect(await adapter.people(["@ivan"])).toEqual(["91"])

    client.peer = group(-100500, "Book club")
    await expect(adapter.people(["@books"])).rejects.toMatchObject({ code: "validation_error" })
  })

  it("joins by link, and says a join that waits for admins was only requested", async () => {
    const { adapter, client } = await open()
    client.fullChat = full(-100702, "Joined")

    expect(await adapter.join("https://t.me/+abc")).toMatchObject({ id: "-100702" })
    expect(client.joinChat.mock.calls[0]).toEqual(["https://t.me/+abc"])

    client.joinChat.mockResolvedValueOnce({ status: "request_sent" })
    await expect(adapter.join("https://t.me/pisos_vlc")).rejects.toMatchObject({
      code: "provider_error",
      message: expect.stringContaining("request is sent"),
    })
    expect(client.joinChat.mock.calls[1]).toEqual(["pisos_vlc"])
  })

  it("**changes only the switches asked for**, keeping every other right Telegram holds", async () => {
    const { adapter, client } = await open()
    client.fullChat = {
      ...full(-100700, "Plans"),
      defaultPermissions: {
        canPinMessages: false,
        canInviteUsers: true,
        raw: { _: "chatBannedRights", untilDate: 0, pinMessages: true, sendPolls: true },
      },
    }

    await adapter.updateGroup("-100700", { title: "Plans 2", settings: { allCanPin: true, onlyAdminsAdd: true } })

    expect(client.setChatTitle.mock.calls).toEqual([[-100700, "Plans 2"]])
    expect(client.setChatDescription).not.toHaveBeenCalled()
    expect(client.setChatDefaultPermissions.mock.calls).toEqual([
      [-100700, { pinMessages: false, sendPolls: true, inviteUsers: true }],
    ])
    expect(() => adapter.updateGroup("-100700", { settings: { onlyAdminsCall: true } })).toThrow(/no group setting/)
  })

  it("reads a group, and replaces its link", async () => {
    const { adapter, client } = await open()
    client.fullChat = { ...full(-100700, "Plans"), inviteLink: { link: "https://t.me/+old" } }
    client.peer = group(-100700, "Plans")

    expect(await adapter.group("-100700")).toMatchObject({ link: "https://t.me/+old", settings: { allCanPin: false } })
    await adapter.resetInviteLink("-100700")
    expect(client.exportInviteLink.mock.calls).toEqual([[-100700]])
  })

  it("**adds people, naming who could not be added**, and refuses history per person", async () => {
    const { adapter, client } = await open()
    client.addChatMembers.mockResolvedValueOnce([{ userId: 92 }])

    expect(await adapter.addMembers("-100700", ["91", "92"], {})).toEqual({ notAdded: ["92"] })
    expect(client.addChatMembers.mock.calls).toEqual([[-100700, [91, 92], {}]])
    expect(() => adapter.addMembers("-100700", ["91"], { history: true })).toThrow(/group's setting/)
  })

  it("removes people one at a time, and gives or takes admin rights in Telegram's words", async () => {
    const { adapter, client } = await open()

    await adapter.removeMembers("-100700", ["91", "92"])
    await adapter.addAdmin("-100700", "91", ["pin", "members", "link"])
    await adapter.removeAdmin("-100700", "91")

    expect(client.kickChatMember.mock.calls).toEqual([
      [{ chatId: -100700, userId: 91 }],
      [{ chatId: -100700, userId: 92 }],
    ])
    expect(client.editAdminRights.mock.calls).toEqual([
      [{ chatId: -100700, userId: 91, rights: { pinMessages: true, banUsers: true, inviteUsers: true } }],
      [{ chatId: -100700, userId: 91, rights: {} }],
    ])
    expect(() => adapter.addAdmin("-100700", "91", ["read"])).toThrow(/no admin right read/)
  })

  it("leaves, answering the chat's id", async () => {
    const { adapter, client } = await open()
    client.peer = group(-100500, "Book club")

    expect(await adapter.leave("-100500")).toEqual({ chatId: "-100500" })
    expect(client.leaveChat).toHaveBeenCalledOnce()
  })
})

describe("chat folders", () => {
  const user7 = { _: "inputPeerUser", userId: 7, accessHash: 0 }
  const user8 = { _: "inputPeerUser", userId: 8, accessHash: 0 }
  const work = {
    _: "dialogFilter",
    id: 2,
    title: { _: "textWithEntities", text: "Work", entities: [] },
    pinnedPeers: [user8],
    includePeers: [user7],
    excludePeers: [],
  }

  it("**lists the folders, leaving out All chats**, pinned chats counted as in the folder", async () => {
    const { adapter, client } = await open()
    client.filters = [{ _: "dialogFilterDefault" }, work]

    expect(await adapter.folders()).toEqual([{ id: "2", title: "Work", chatIds: ["8", "7"] }])
  })

  it("**changes only the chats asked for**, keeping the rest of the folder", async () => {
    const { adapter, client } = await open()
    client.filters = [work]
    client.resolvePeer = (async (peer: unknown) => ({ _: "inputPeerUser", userId: peer, accessHash: 0 })) as never

    const changed = await adapter.updateFolder("2", { title: "Job", add: ["9", "7"], remove: ["7"] })

    expect(client.editFolder.mock.calls[0]?.[0]).toMatchObject({
      folder: work,
      modification: { title: { text: "Job" }, includePeers: [{ userId: 9 }, { userId: 7 }] },
    })
    expect(changed.title).toBe("Job")
    await expect(adapter.updateFolder("5", { title: "x" })).rejects.toMatchObject({ code: "not_found" })
  })

  it("creates a folder with its chats, and deletes one by id", async () => {
    const { adapter, client } = await open()
    client.resolvePeer = (async (peer: unknown) => ({ _: "inputPeerUser", userId: peer, accessHash: 0 })) as never

    expect(await adapter.createFolder("Home", ["7"])).toEqual({ id: "3", title: "Home", chatIds: ["7"] })
    await adapter.deleteFolder("3")
    expect(client.deleteFolder.mock.calls).toEqual([[3]])
  })
})

describe("the address book and the profile", () => {
  it("**adds a person under the name they show**, renames, removes, blocks and unblocks by id", async () => {
    const { adapter, client } = await open()
    client.peer = user(91, "Ivan Petrov", { firstName: "Ivan", lastName: "Petrov" })

    expect(await adapter.addContact("91")).toMatchObject({ id: "91" })
    await adapter.renameContact("91", "Vanya")
    await adapter.removeContact("91")
    await adapter.block("91")
    await adapter.unblock("91")

    expect(client.addContact.mock.calls).toEqual([
      [{ userId: 91, firstName: "Ivan", lastName: "Petrov" }],
      [{ userId: 91, firstName: "Vanya" }],
    ])
    expect(client.deleteContacts.mock.calls).toEqual([[[91]]])
    expect(client.blockUser.mock.calls).toEqual([[91]])
    expect(client.unblockUser.mock.calls).toEqual([[91]])
  })

  it("imports numbers with a plus, the name split at its first space, and answers who Telegram knew", async () => {
    const { adapter, client } = await open()

    const known = await adapter.importContacts([{ phone: "34600111222", name: "Ivan de la Cruz" }])

    expect(client.importContacts.mock.calls).toEqual([
      [[{ phone: "+34600111222", firstName: "Ivan", lastName: "de la Cruz" }]],
    ])
    expect(known).toMatchObject([{ id: "91" }])
  })

  it("**calls the description the bio**, puts a photo up, and ends other sessions with Telegram's own call", async () => {
    const { adapter, client } = await open()

    await adapter.updateProfile({
      firstName: "New",
      description: "hi",
      photo: { kind: "photo", name: "me.jpg", bytes: new Uint8Array([1]) },
    })
    await adapter.endOtherSessions()

    expect(client.updateProfile.mock.calls).toEqual([[{ firstName: "New", bio: "hi" }]])
    expect(client.setMyProfilePhoto.mock.calls[0]?.[0]).toMatchObject({ type: "photo" })
    expect(client.calls.filter((one) => one.method === "call").map((one) => (one.args[0] as { _: string })._)).toEqual([
      "auth.resetAuthorizations",
      "account.getAuthorizations",
    ])
  })
})

describe("marking read", () => {
  it("reads everything, or up to a message", async () => {
    const { adapter, client } = await open()

    await adapter.markRead("-100500")
    await adapter.markRead("-100500", "9")

    expect(client.readHistory.mock.calls).toEqual([
      [-100500, {}],
      [-100500, { maxId: 9 }],
    ])
  })

  it("refuses an --until that is not a message id before asking Telegram", async () => {
    const { adapter, client } = await open()
    expect(() => adapter.markRead("-100500", "yesterday")).toThrow(/--until/)
    expect(client.readHistory).not.toHaveBeenCalled()
  })
})

describe("deleting", () => {
  it("**always says whether for everyone**, since mtcute's default is yes", async () => {
    const { adapter, client } = await open()
    client.resolvePeer = async (peer) => ({ _: "inputPeerUser", peer })

    await adapter.delete("1", ["5", "6"], { forEveryone: false })
    await adapter.delete("1", ["7"], { forEveryone: true })

    expect(client.deleteMessagesById.mock.calls).toEqual([
      [{ _: "inputPeerUser", peer: 1 }, [5, 6], { revoke: false }],
      [{ _: "inputPeerUser", peer: 1 }, [7], { revoke: true }],
    ])
  })

  it("**refuses a delete for me in a supergroup**, where Telegram deletes for everyone", async () => {
    const { adapter, client } = await open()

    await expect(adapter.delete("-1001234567890", ["5"], { forEveryone: false })).rejects.toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("--for-everyone"),
    })
    await adapter.delete("-1001234567890", ["5"], { forEveryone: true })

    expect(client.deleteMessagesById).toHaveBeenCalledTimes(1)
  })
})

describe("polls", () => {
  it("**names each answer by its own bytes**, and counts voters only once they are known", async () => {
    const { adapter, client } = await open()
    client.found = { ...message(3), media: fakePoll({}) }

    const poll = await adapter.poll("-100500", "3")

    expect(poll.answers).toEqual([
      { id: "MA", text: "yes", voters: null, chosen: false },
      { id: "MQ", text: "no", voters: null, chosen: false },
    ])
    expect(poll).toMatchObject({ question: "Friday?", anonymous: false, closed: false, voters: null })
  })

  it("**votes with the answer's bytes, not its position**, and refuses an id the poll does not have", async () => {
    const { adapter, client } = await open()
    client.found = { ...message(3), media: fakePoll({}) }

    const voted = await adapter.vote("-100500", "3", ["MQ"])
    await expect(adapter.vote("-100500", "3", ["1"])).rejects.toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("MA, MQ"),
    })
    await adapter.vote("-100500", "3", [])

    expect(voted.answers.map((answer) => answer.voters)).toEqual([4, 1])
    const [first, retract] = client.sendVote.mock.calls.map(([params]) => params as { options: unknown })
    expect(first?.options).toEqual([new Uint8Array([0x31])])
    expect(retract?.options).toBeNull()
  })

  it("says a message without a poll is not found", async () => {
    const { adapter, client } = await open()
    client.found = message(3)

    await expect(adapter.poll("-100500", "3")).rejects.toMatchObject({ code: "not_found" })
  })

  it("closes a poll, and creates one with the send's random_id, public unless anonymous", async () => {
    const { adapter, client } = await open()
    client.sendMedia.mockClear()

    expect((await adapter.closePoll("-100500", "3")).closed).toBe(true)
    await adapter.createPoll(
      "-100500",
      { question: "Where?", answers: ["here", "there"], multiple: true, anonymous: false },
      { sendId: "77" },
    )
    await adapter.createPoll(
      "-100500",
      { question: "Again?", answers: ["yes", "no"], multiple: false, anonymous: true, revote: true },
      { sendId: "78" },
    )

    const [chat, media, options] = client.sendMedia.mock.calls[0] ?? []
    expect(chat).toBe(-100500)
    expect(media).toMatchObject({
      type: "poll",
      question: "Where?",
      multiple: true,
      public: true,
      disableRevoting: true,
    })
    expect(client.sendMedia.mock.calls[1]?.[1]).toMatchObject({ public: false, disableRevoting: false })
    expect(String((options as { randomId: unknown }).randomId)).toBe("77")
  })
})

describe("listening", () => {
  it("**passes messages, edits and deletions on until aborted**, then lets go of every handler", async () => {
    const { adapter, client } = await open({ listen: true })
    const events: MessageEvent[] = []
    const stop = new AbortController()
    let ready = false

    const watching = adapter.watch(
      (event) => events.push(event),
      stop.signal,
      () => {
        ready = true
      },
    )
    await vi.waitFor(() => expect(ready).toBe(true))
    client.onNewMessage.emit(message(1))
    client.onEditMessage.emit(message(1))
    client.onDeleteMessage.emit({ messageIds: [1], channelId: null })
    client.onRawUpdate.emit({ update: { _: "updateUserStatus" }, peers: {} })
    stop.abort()
    await watching

    expect(events.map((event) => event.event)).toEqual(["message", "edit", "delete"])
    expect(client.calls.map((call) => call.method)).toContain("startUpdatesLoop")
    expect(client.onNewMessage.handlers.size + client.onRawUpdate.handlers.size).toBe(0)
  })

  it("**fails on a revoked login before it says it is ready**, rather than listening to nothing", async () => {
    const { adapter, client } = await open({ listen: true })
    client.call = async (request: { _: string }) => {
      if (request._ === "updates.getState") throw new tl.RpcError(401, "AUTH_KEY_UNREGISTERED")
      return {}
    }
    let ready = false

    await expect(
      adapter.watch(
        () => {},
        new AbortController().signal,
        () => {
          ready = true
        },
      ),
    ).rejects.toMatchObject({ code: "authentication_error" })
    expect(ready).toBe(false)
    expect(client.onNewMessage.handlers.size).toBe(0)
  })
})

describe("closing", () => {
  it("logs out on Telegram's side, and close destroys the client", async () => {
    const { adapter, client } = await open()
    await adapter.logout()
    await adapter.close()

    expect(client.calls.map((call) => call.method).slice(-2)).toEqual(["logOut", "destroy"])
  })

  it("logs in by QR code and answers with the account", async () => {
    const { adapter, client } = await open()
    const account = await adapter.login({
      method: "qr",
      showQr: () => {},
      phone: async () => "",
      code: async () => "",
      password: async () => "",
      note: () => {},
    })

    expect(account).toEqual({ id: "1", name: "Owner", username: null })
    expect(client.calls.find((call) => call.method === "start")?.args[0]).toHaveProperty("qrCodeHandler")
  })
})

describe("message permalinks", () => {
  it.each([
    ["https://t.me/test_channel/12", "public"],
    ["https://t.me/c/500/3/12", "restricted"],
    ["https://other.example/12", "unknown"],
    ["https://t.me/test_channel/12?thread=3", "public"],
    ["https://t.me/test_channel/12?single&thread=3", "public"],
  ])("exports the individual target with thread context: %s", async (url, access) => {
    const { adapter, client } = await open()
    client.peer = { ...group(-100500, "Synthetic"), raw: { _: "channel" }, isForum: true }
    client.found = { id: 12 }
    client.exportedLink = url
    expect(await adapter.permalink("-100500", "12")).toEqual({ url, access, reason: null })
    expect(client.calls.find((call) => call.method === "getMessages")?.args[1]).toEqual([12])
    expect(client.calls.find((call) => call.method === "call")?.args[0]).toEqual({
      _: "channels.exportMessageLink",
      channel: { _: "inputChannel", channelId: 500, accessHash: 42 },
      id: 12,
      thread: true,
    })
    expect(client.readHistory).not.toHaveBeenCalled()
    expect(client.sendText).not.toHaveBeenCalled()
  })

  it.each([
    { type: "user", isSelf: false },
    { type: "user", isSelf: true },
    { type: "chat", raw: { _: "chat" } },
  ])("returns no native URL for unsupported chat kinds", async (peer) => {
    const { adapter, client } = await open()
    client.peer = peer
    client.found = { id: 12 }
    expect(await adapter.permalink("7", "12")).toEqual({ url: null, access: "unavailable", reason: "unsupported_chat" })
    expect(client.calls.some((call) => call.method === "call")).toBe(false)
  })

  it("refuses deleted targets and propagates export denial", async () => {
    const { adapter, client } = await open()
    client.found = null
    await expect(adapter.permalink("7", "12")).rejects.toMatchObject({ code: "not_found" })
    expect(client.calls.some((call) => call.method === "getPeer")).toBe(false)
    client.peer = { ...group(-100500, "Synthetic"), raw: { _: "channel" } }
    client.found = { id: 12 }
    client.exportedLink = new tl.RpcError(400, "CHANNEL_PRIVATE")
    await expect(adapter.permalink("-100500", "12")).rejects.toMatchObject({ code: "permission_error" })
  })

  it.each(["0", "-1", "2147483648", "9007199254740993", "12x"])(
    "refuses invalid ids without requests: %s",
    async (id) => {
      const { adapter, client } = await open()
      client.calls.length = 0
      await expect(async () => adapter.permalink("7", id)).rejects.toMatchObject({ code: "validation_error" })
      expect(client.calls).toEqual([])
    },
  )
})
