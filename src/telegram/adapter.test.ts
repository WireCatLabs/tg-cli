import { mkdtempSync } from "node:fs"
import { join } from "node:path"
import type { MessageEvent } from "@leemour/cli-messaging"
import { FileLocation, MtTimeoutError, tl } from "@mtcute/node"
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

const page = <T>(items: T[], next?: unknown) => Object.assign([...items], { next })

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
  peer: unknown = undefined
  members: unknown = []
  found: unknown = null
  transcripts: { text: string; pending?: boolean }[] = []
  resolvePeer = async (peer: unknown) => ({ _: "inputPeerChannel", peer })
  call = async (request: { _: string }) => {
    this.#record("call", [request])
    return this.transcripts.shift() ?? { text: "", pending: true }
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
  sendText = vi.fn(async (..._args: unknown[]): Promise<unknown> => message(99))
  editMessage = vi.fn(async (..._args: unknown[]): Promise<unknown> => message(5))

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
    return page(this.history, this.historyNext)
  }
  getPeerDialogs = async (peer: unknown) => {
    this.#record("getPeerDialogs", [peer])
    return Array.isArray(peer) ? peer.map(() => this.dialogs[0] ?? null) : [this.dialogs[0]]
  }
  getPeer = async (peer: unknown) => {
    this.#record("getPeer", [peer])
    return this.peer
  }
  getFullUser = async () => ({ bio: "a bio" })
  getCommonChats = async () => [{ id: -100500 }]
  getChatMembers = async () => {
    if (this.members instanceof Error) throw this.members
    return this.members
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

function message(id: number) {
  return {
    id,
    chat: group(-100500, "Valencia expats"),
    sender: user(777, "Ana"),
    date: new Date("2026-09-27T10:00:00.000Z"),
    editDate: null,
    text: `message ${id}`,
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
    expect(client.calls.find((call) => call.method === "iterDialogs")?.args[0]).toEqual({ limit: 4, archived: "keep" })
    expect((await adapter.chats({ offset: 0 })).items).toHaveLength(4)
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

  it("shows a person with their bio and the chats in common", async () => {
    const { adapter, client } = await open()
    client.peer = user(777, "Ana")
    client.dialogs = [dialog(group(-100500, "Valencia expats"))]

    const card = await adapter.contact("777")

    expect(card).toMatchObject({ id: "777", name: "Ana", description: "a bio" })
    expect(card.chats).toEqual([
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
