import { join } from "node:path"
import { Long, MtPeerNotFoundError, tl } from "@mtcute/node"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { openBotHistory } from "./bot-history.js"

const CHAT = "-1000000000700"
const stand = vi.hoisted(() => ({ client: undefined as unknown as FakeClient, options: undefined as unknown }))

const page = (ids: number[]): tl.messages.RawMessages => ({
  _: "messages.messages",
  messages: ids.map((id) => ({
    _: "message",
    id,
    peerId: { _: "peerChannel", channelId: 700 },
    fromId: { _: "peerUser", userId: 42 },
    date: 1_700_000_000 + id,
    message: `synthetic ${id}`,
  })),
  chats: [
    {
      _: "channel",
      id: 700,
      title: "Synthetic",
      photo: { _: "chatPhotoEmpty" },
      date: 1,
      accessHash: Long.ZERO,
      megagroup: true,
    },
  ],
  users: [{ _: "user", id: 42, firstName: "Synthetic" }],
  topics: [],
})

class FakeClient {
  log = { mgr: { handler: undefined as unknown } }
  start = vi.fn(async (_: unknown) => ({ id: 900, isBot: true }))
  destroy = vi.fn(async () => {})
  resolveChannel = vi.fn(async (_: unknown) => ({ _: "inputChannel" as const, channelId: 700, accessHash: Long.ZERO }))
  resolvePeer = vi.fn(async (peer: unknown) => ({
    _: "inputPeerChannel" as const,
    channelId: peer === "other" ? 701 : 700,
    accessHash: Long.ZERO,
  }))
  read: (ids: number[]) => tl.messages.TypeMessages = (ids) => page(ids)
  channels: tl.messages.TypeChats = { _: "messages.chats", chats: page([]).chats }
  call = vi.fn(async (request: { _: string; id: ({ id: number } | { channelId: number })[] }, _options: unknown) => {
    if (request._ === "channels.getChannels") return this.channels
    return this.read(request.id.flatMap((one) => ("id" in one ? [one.id] : [])))
  })
}

vi.mock("@mtcute/node", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@mtcute/node")>()),
  TelegramClient: function TelegramClient(options: unknown) {
    stand.options = options
    stand.client = new FakeClient()
    return stand.client
  },
}))
vi.mock("./storage.js", () => ({ openSessionStorage: async () => ({}) }))

const open = (extra: Partial<Parameters<typeof openBotHistory>[0]> = {}) =>
  openBotHistory({
    credentials: { id: 1, hash: "synthetic" },
    sessionPath: join(process.env.TG_STATE_DIR ?? "", "bots", "test", "bot.session"),
    token: "900:synthetic",
    pauseMs: 0,
    newest: async () => "250",
    ...extra,
  })

beforeEach(() => vi.clearAllMocks())

describe("bot MTProto history", () => {
  it("logs in as the bot with updates off, reads at most 100 numbers and closes", async () => {
    const reader = await open()
    expect(stand.options).toMatchObject({ apiId: 1, disableUpdates: true, logLevel: 0 })
    expect(stand.client.start).toHaveBeenCalledWith({ botToken: "900:synthetic" })
    const first = await reader.historyBefore(CHAT, { limit: 500 })
    expect(first.items.map((one) => one.id)).toEqual(Array.from({ length: 100 }, (_, i) => String(250 - i)))
    expect(first.hasMore).toBe(true)
    expect(stand.client.call.mock.calls[0]?.[1]).toEqual({ floodSleepThreshold: 0 })
    const last = await reader.historyBefore(CHAT, { limit: 20, before: "3" })
    expect(last.items.map((one) => one.id)).toEqual(["2", "1"])
    expect(last.hasMore).toBe(false)
    await reader.close()
    expect(stand.client.destroy).toHaveBeenCalledOnce()
  })

  it("crosses wholly empty ranges, and stops only at number 1", async () => {
    const reader = await open()
    stand.client.read = (ids) => page(ids.filter((id) => id === 40))
    const found = await reader.historyBefore(CHAT, { limit: 100 })
    expect(found.items.map((one) => one.id)).toEqual(["40"])
    expect(found.hasMore).toBe(false)
    expect(stand.client.call).toHaveBeenCalledTimes(3)
    expect(await reader.historyBefore(CHAT, { limit: 100, before: "40" })).toEqual({ items: [], hasMore: false })
    expect(await reader.historyBefore(CHAT, { limit: 100, before: "1" })).toEqual({ items: [], hasMore: false })
    await reader.close()
  })

  it("resolves an uncached channel without updates, and refuses inaccessible ones", async () => {
    const reader = await open({ from: "https://t.me/c/700/7" })
    stand.client.resolveChannel.mockRejectedValueOnce(new MtPeerNotFoundError("synthetic"))
    expect((await reader.historyBefore(CHAT, { limit: 1 })).items[0]?.id).toBe("7")
    expect(stand.client.call).toHaveBeenNthCalledWith(
      1,
      { _: "channels.getChannels", id: [{ _: "inputChannel", channelId: 700, accessHash: Long.ZERO }] },
      { floodSleepThreshold: 0 },
    )
    expect(stand.client.resolvePeer).not.toHaveBeenCalled()
    stand.client.resolveChannel.mockRejectedValueOnce(new MtPeerNotFoundError("synthetic"))
    stand.client.channels = { _: "messages.chats", chats: [] }
    await expect(reader.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({ code: "permission_error" })
    stand.client.resolveChannel.mockRejectedValueOnce(new Error("900:synthetic"))
    await expect(reader.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({
      message: "Telegram history read did not finish",
    })
    await reader.close()
  })

  it("tracks the connection before login, sanitizes login failures and rejects another identity", async () => {
    for (const result of [{ id: 901, isBot: true }, { id: 900, isBot: false }, undefined]) {
      const track = vi.fn(() => {
        if (result) stand.client.start.mockResolvedValueOnce(result)
        else stand.client.start.mockRejectedValueOnce(new Error("900:synthetic"))
      })
      await expect(open({ track })).rejects.toMatchObject({
        message: result ? "the history session belongs to a different bot" : "Telegram history read did not finish",
      })
      expect(track).toHaveBeenCalledOnce()
      expect(stand.client.destroy).toHaveBeenCalledOnce()
    }
  })

  it("starts at an inclusive private or public link and rejects a different chat", async () => {
    const newest = vi.fn(async () => undefined)
    for (const from of ["https://t.me/c/700/7", "https://t.me/synthetic/7"]) {
      const reader = await open({ from, newest })
      expect((await reader.historyBefore(CHAT, { limit: 2 })).items.map((one) => one.id)).toEqual(["7", "6"])
      await reader.close()
    }
    expect(newest).not.toHaveBeenCalled()
    const wrong = await open({ from: "https://t.me/other/7" })
    await expect(wrong.historyBefore(CHAT, { limit: 2 })).rejects.toMatchObject({
      code: "validation_error",
      message: expect.stringContaining("different chat"),
    })
    await wrong.close()
  })

  it("refuses unsupported chats, bad bounds, and a missing start point without id requests", async () => {
    const reader = await open({ newest: async () => undefined })
    for (const chat of ["42", "user:42", "-42"])
      await expect(reader.historyBefore(chat, { limit: 1 })).rejects.toMatchObject({
        code: "validation_error",
        message: expect.stringContaining("private chats and basic groups"),
      })
    for (const before of ["0", "abc", "2147483649"])
      await expect(reader.historyBefore(CHAT, { limit: 1, before })).rejects.toMatchObject({ code: "validation_error" })
    await expect(reader.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({
      message: expect.stringContaining("--from <message link>"),
    })
    expect(stand.client.call).not.toHaveBeenCalled()
    await reader.close()
    for (const from of ["wrong", "https://t.me/synthetic/7?comment=9"]) {
      const invalid = await open({ from })
      await expect(invalid.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({ code: "validation_error" })
      await invalid.close()
    }
  })

  it("lets the shared loop handle flood waits, and remembers gaps already scanned", async () => {
    const reader = await open()
    let asked = 0
    stand.client.read = (ids) => {
      asked++
      if (asked === 1) return page([])
      if (asked === 2) throw Object.assign(new tl.RpcError(420, "FLOOD_WAIT_%d"), { seconds: 1 })
      return page(ids.slice(0, 1))
    }
    await expect(reader.historyBefore(CHAT, { limit: 100 })).rejects.toMatchObject({
      code: "rate_limited",
      details: { retryAfterMs: 1000 },
    })
    expect((await reader.historyBefore(CHAT, { limit: 100 })).items[0]?.id).toBe("150")
    await reader.close()
  })

  it("stops a gap scan when aborted and never returns a false empty page", async () => {
    const stop = new AbortController()
    const reader = await open({ stop: stop.signal })
    stand.client.read = () => {
      stop.abort()
      return page([])
    }
    await expect(reader.historyBefore(CHAT, { limit: 100 })).rejects.toMatchObject({ code: "cancelled" })
    expect(stand.client.call).toHaveBeenCalledOnce()
    await reader.close()
  })

  it("does not call an unexpected reply the start, and strips unknown error text", async () => {
    const reader = await open()
    stand.client.read = () => ({ _: "messages.messagesNotModified", count: 0 })
    await expect(reader.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({ code: "provider_error" })
    stand.client.read = () => {
      throw new Error("900:synthetic")
    }
    await expect(reader.historyBefore(CHAT, { limit: 1 })).rejects.toMatchObject({
      message: "Telegram history read did not finish",
    })
    await reader.close()
  })
})
