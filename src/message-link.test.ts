import { CliError } from "@wirecat/cli-core"
import { rememberAccount } from "@wirecat/cli-messaging/cli"
import { openStore } from "@wirecat/cli-messaging/store"
import { describe, expect, it, vi } from "vitest"
import { TG } from "./app.js"
import { chat, message, scripted, tg } from "./testing/scripted.js"

describe("personal message links", () => {
  it("shares JSON and JSONL output and refuses another account before target lookup", async () => {
    rememberAccount(TG, "default", "1", process.env)
    const permalink = vi.fn(async () => ({
      url: "https://t.me/test_channel/42",
      access: "public" as const,
      reason: null,
    }))
    const close = vi.fn(async () => {})
    const adapter = vi.fn(() => scripted({ permalink, close }))
    for (const format of ["--json", "--jsonl"]) {
      const result = await tg(["messages", "link", chat.id, "42", format], { adapter })
      expect(result.code).toBe(0)
      expect(result.stdout.join("").trim().split("\n")).toHaveLength(1)
      expect(JSON.parse(result.stdout.join(""))).toEqual({
        locator: `msg:telegram/1/${chat.id}/42`,
        url: "https://t.me/test_channel/42",
        access: "public",
        reason: null,
      })
      expect(result.stderr.join("")).toBe("")
    }
    const wrong = await tg(["messages", "link", `msg:telegram/other/${chat.id}/42`, "--json"], { adapter })
    expect(wrong.code).not.toBe(0)
    expect(adapter).toHaveBeenCalledTimes(2)
    permalink.mockRejectedValueOnce(new CliError("permission_error", "synthetic denied"))
    expect((await tg(["messages", "link", chat.id, "42", "--json"], { adapter })).code).not.toBe(0)
    expect(close).toHaveBeenCalledTimes(3)
  })

  it("offline verifies a stored target without an adapter, and refuses deleted messages", async () => {
    rememberAccount(TG, "default", "1", process.env)
    const store = await openStore()
    const key = { provider: "telegram", account: "1" }
    try {
      await store.saveChats(key, [chat])
      await store.saveMessages(key, chat.id, [message("42")], { via: "history" })
      const adapter = vi.fn(() => {
        throw new Error("offline connected")
      })
      const linked = await tg(["--offline", "messages", "link", `msg:telegram/1/${chat.id}/42`, "--json"], { adapter })
      expect(linked.code).toBe(0)
      expect(JSON.parse(linked.stdout.join(""))).toEqual({
        locator: `msg:telegram/1/${chat.id}/42`,
        url: null,
        access: "unavailable",
        reason: "offline",
      })
      await store.markDeleted(key, ["42"], { chatId: chat.id })
      const deleted = await tg(["--offline", "messages", "link", chat.id, "42", "--json"], { adapter })
      expect(deleted.code).not.toBe(0)
      expect(JSON.parse(deleted.stderr.join("")).error.code).toBe("not_found")
      expect(adapter).not.toHaveBeenCalled()
    } finally {
      await store.close()
    }
  })
})
