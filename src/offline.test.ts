import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Chat, Message } from "@leemour/cli-messaging"
import { storePath } from "@leemour/cli-messaging/store"
import { describe, expect, it } from "vitest"
import type { Adapter } from "./commands/context.js"
import { run } from "./program.js"

const chat: Chat = {
  id: "-1001234567890",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 3,
  lastMessageAt: "2026-09-26T10:00:00.000Z",
  participantsCount: 5000,
}

const message: Message = {
  id: "42",
  chatId: chat.id,
  senderId: "777",
  senderName: "Ana",
  timestamp: "2026-09-26T10:00:00.000Z",
  editedAt: null,
  text: "empadronamiento renewal",
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
}

const telegram: Adapter = {
  self: () => "100",
  login: async () => ({ id: "100", name: "Owner", username: null }),
  me: async () => ({ id: "100", name: "Owner", username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [message], hasMore: false }),
  around: async () => [],
  resolve: async () => chat,
  send: async (_chat, text, { sendId }) => ({ message: { ...message, text }, sendId }),
  logout: async () => {},
  close: async () => {},
}

const unreachable = () => {
  throw new Error("--offline must never open Telegram")
}

const tg = async (argv: string[], { store, online = true }: { store: string; online?: boolean }) => {
  const streams = captureStreams()
  const env = { ...process.env, MESSAGING_STORE: store, ...(online ? { TG_API_ID: "1", TG_API_HASH: "h" } : {}) }
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env,
    adapter: online ? () => telegram : unreachable,
  })
  return { code, stdout: streams.stdout, stderr: streams.stderr }
}

const freshStore = () => join(mkdtempSync(join(tmpdir(), "tg-store-")), "messages.db")

describe("--offline", () => {
  it("**answers exactly what Telegram answered**, without connecting or credentials", async () => {
    const store = freshStore()
    const chats = await tg(["kept", "chats", "list", "--json"], { store })
    const messages = await tg(["kept", "messages", "list", "Valencia", "--json"], { store })

    const chatsOffline = await tg(["kept", "chats", "list", "--json", "--offline"], { store, online: false })
    const messagesOffline = await tg(["kept", "messages", "list", "Valencia", "--json", "--offline"], {
      store,
      online: false,
    })

    expect(chatsOffline).toEqual({ ...chats, stderr: [] })
    expect(messagesOffline).toEqual({ ...messages, stderr: [] })
    expect(messagesOffline.code).toBe(0)
  })

  it("finds Saved Messages as `me`", async () => {
    const store = freshStore()
    const saved = { ...message, chatId: "100" }
    telegram.history = async () => ({ items: [saved], hasMore: false })
    try {
      await tg(["saved", "messages", "list", "me"], { store })
      const { code, stdout } = await tg(["saved", "messages", "list", "me", "--json", "--offline"], {
        store,
        online: false,
      })
      expect(code).toBe(0)
      expect(JSON.parse(stdout[0] ?? "").items).toEqual([saved])
    } finally {
      telegram.history = async () => ({ items: [message], hasMore: false })
    }
  })

  it("refuses a profile it has never seen online, and says what to do", async () => {
    const { code, stderr } = await tg(["stranger", "chats", "list", "--offline"], {
      store: freshStore(),
      online: false,
    })

    expect(code).toBe(6)
    expect(JSON.parse(stderr[0] ?? "").error.message).toContain("without --offline")
  })

  it("refuses to send", async () => {
    const { code } = await tg(["kept", "messages", "send", "me", "hi", "--offline"], { store: freshStore() })

    expect(code).toBe(2)
  })
})

describe("saving to the store", () => {
  it("**never fails a read**: the answer is printed and the failure is a warning", async () => {
    const store = mkdtempSync(join(tmpdir(), "tg-store-"))
    mkdirSync(join(store, "messages.db"))

    const { code, stdout, stderr } = await tg(["broken", "chats", "list", "--json"], {
      store: join(store, "messages.db"),
    })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "").items).toEqual([chat])
    expect(stderr.join("\n")).toContain("not saved to the local store")
  })

  it("points at the test sandbox, never the owner's store", () => {
    expect(storePath()).toContain(process.env.TG_TEST_SANDBOX ?? "no sandbox")
  })
})
