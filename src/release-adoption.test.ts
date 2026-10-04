import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it, vi } from "vitest"
import { chat, scripted, tg } from "./testing/scripted.js"

const decoded = (lines: string[]) => JSON.parse(lines.join("\n"))

describe("the shared release through the Telegram program", () => {
  it("counts stored group activity offline without asking for membership", async () => {
    const store = join(mkdtempSync(join(tmpdir(), "tg-release-stats-")), "messages.db")
    const online = scripted()
    const env = { ...process.env, TG_API_ID: "1", TG_API_HASH: "h", MESSAGING_STORE: store }
    expect((await tg(["messages", "list", chat.id, "--json"], { env, adapter: () => online })).code).toBe(0)
    const connect = vi.fn(() => {
      throw new Error("offline stats must not connect")
    })
    const found = await tg(
      [
        "chats",
        "stats",
        chat.id,
        "--offline",
        "--since-time",
        "2026-09-01",
        "--by",
        "day",
        "--timezone",
        "Europe/Madrid",
        "--json",
      ],
      { env, adapter: connect },
    )
    expect(found.code).toBe(0)
    expect(decoded(found.stdout)).toMatchObject({ chatId: chat.id, messages: 1, complete: false })
    expect(decoded(found.stdout)).not.toHaveProperty("members")
    expect(connect).not.toHaveBeenCalled()
  })

  it("rejects an invalid HTTP port and tunnel address before connecting", async () => {
    const connect = vi.fn(() => {
      throw new Error("invalid HTTP options must not connect")
    })
    for (const options of [
      ["--http"],
      ["--http", "--public-url", "http://public.example"],
      ["--http", "--public-url", "https://public.example", "--port", "0"],
    ]) {
      const found = await tg(["mcp", ...options, "--json"], { adapter: connect })
      expect(found.code).toBe(options.length === 1 ? 3 : 2)
      expect(found.stdout).toEqual([])
    }
    expect(connect).not.toHaveBeenCalled()
  })

  it("revokes browser logins locally without ending the Telegram session", async () => {
    const connect = vi.fn(() => {
      throw new Error("revoke must not connect")
    })
    const found = await tg(["mcp", "--revoke", "--json"], { adapter: connect })
    expect(found.code).toBe(0)
    expect(decoded(found.stdout)).toMatchObject({ revoked: true })
    expect(connect).not.toHaveBeenCalled()
  })
})
