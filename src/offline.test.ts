import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { storePath } from "@leemour/cli-messaging/store"
import { describe, expect, it } from "vitest"
import { run } from "./program.js"
import { chat, scripted, message as scriptedMessage } from "./testing/scripted.js"

const message = scriptedMessage("42")
const telegram = scripted({ history: async () => ({ items: [message], hasMore: false }) })

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
  it("reads an evidence packet from the archive without credentials or a Telegram connection", async () => {
    const store = freshStore()
    await tg(["evidence", "messages", "list", "Valencia", "--json"], { store })
    const result = await tg(["evidence", "messages", "evidence", message.chatId, "--limit", "1", "--json"], {
      store,
      online: false,
    })
    expect(result.code).toBe(0)
    expect(result.stderr).toEqual([])
    expect(JSON.parse(result.stdout[0] ?? "")).toMatchObject({
      kind: "chats",
      source: { provider: "telegram", chat: message.chatId },
      nextBeforeId: null,
      coverage: { provided: 1, included: 1, omitted: 0, history: "unknown" },
      items: [{ text: message.text }],
    })
    const older = await tg(["evidence", "messages", "evidence", message.chatId, "--before-id", message.id, "--jsonl"], {
      store,
      online: false,
    })
    expect(older.code).toBe(0)
    expect(JSON.parse(older.stdout[0] ?? "")).toMatchObject({ items: [], nextBeforeId: null })
    const failed = await tg(["evidence", "messages", "evidence", message.chatId, "--limit", "101", "--json"], {
      store,
      online: false,
    })
    expect(failed.code).toBe(2)
    expect(failed.stdout).toEqual([])
    expect(JSON.parse(failed.stderr[0] ?? "").error.code).toBe("validation_error")
  })

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

  it("counts a stored chat's period by calendar day in a timezone, without connecting", async () => {
    const store = freshStore()
    await tg(["activity", "messages", "list", "Valencia", "--json"], { store })

    const { code, stdout } = await tg(
      [
        "activity",
        "stats",
        "chats",
        "show",
        message.chatId,
        "--offline",
        "--since-time",
        "2000-01-01",
        "--by",
        "day",
        "--timezone",
        "UTC",
        "--json",
      ],
      { store, online: false },
    )

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({
      chatId: message.chatId,
      since: "2000-01-01T00:00:00.000Z",
      messages: 1,
      senders: 1,
      complete: false,
      series: [{ key: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), messages: 1, senders: 1 }],
    })
  })

  it("finds Saved Messages as `me`", async () => {
    const store = freshStore()
    const saved = { ...message, chatId: "1" }
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

  it("**hides a chat the account left, and `store clear --left` deletes it** only with --allow-dangerous", async () => {
    const store = freshStore()
    const left = scripted({ history: async () => ({ items: [message], hasMore: false }) })
    const other = { ...chat, id: "-1009", title: "Other" }
    const tgWith = async (argv: string[], adapter: typeof left) => {
      const streams = captureStreams()
      const code = await run(argv, {
        streams,
        tty: false,
        keyring: memoryKeyring(),
        env: { ...process.env, MESSAGING_STORE: store, TG_API_ID: "1", TG_API_HASH: "h" },
        adapter: () => adapter,
      })
      return { code, stdout: streams.stdout, stderr: streams.stderr }
    }
    await tgWith(["gone", "messages", "list", "Valencia"], left)
    await tgWith(["gone", "chats", "list"], left)
    left.chats = async () => ({ items: [other], hasMore: false })
    await tgWith(["gone", "chats", "list"], left)

    const offline = await tg(["gone", "chats", "list", "--json", "--offline"], { store, online: false })
    expect(JSON.parse(offline.stdout[0] ?? "").items.map((one: { id: string }) => one.id)).toEqual(["-1009"])

    const unconfirmed = await tgWith(["gone", "store", "clear", "--left"], left)
    expect(unconfirmed.code).not.toBe(0)
    const cleared = await tgWith(["gone", "store", "clear", "--left", "--allow-dangerous", "--json"], left)
    expect(JSON.parse(cleared.stdout[0] ?? "")).toEqual({ cleared: true, chats: 1, messages: 1 })
  })
})

describe("the tgcli parity follow-ups, offline", () => {
  it("retries no job when none failed, and refreshes metadata only for stored chats that lack it", async () => {
    const store = freshStore()
    const state = mkdtempSync(join(tmpdir(), "tg-state-"))
    const env = { ...process.env, MESSAGING_STORE: store, TG_STATE_DIR: state, TG_API_ID: "1", TG_API_HASH: "h" }
    const call = async (argv: string[]) => {
      const out = captureStreams()
      const code = await run(argv, { streams: out, tty: false, keyring: memoryKeyring(), env, adapter: () => telegram })
      return { code, answer: JSON.parse(out.stdout[0] ?? "null"), stderr: out.stderr }
    }

    expect(await call(["store", "jobs", "retry", "--failed", "--json"])).toMatchObject({
      code: 0,
      answer: { items: [] },
    })
    expect(await call(["store", "jobs", "list", "--state", "failed", "--json"])).toMatchObject({
      code: 0,
      answer: { items: [] },
    })

    await call(["chats", "list", "--json"])
    const refreshed = await call(["--offline", "metadata", "refresh", "--only-missing", "--json"])
    expect(refreshed.code, refreshed.stderr.join("\n")).toBe(0)
    expect(refreshed.answer).toMatchObject({ hasMore: false })
  })
})
