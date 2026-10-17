import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import type { Adapter } from "./commands/context.js"
import { sessionFile } from "./paths.js"
import { run } from "./program.js"
import { scripted } from "./testing/scripted.js"

const READS = new Set([
  "self",
  "me",
  "chats",
  "history",
  "chat",
  "contact",
  "resolve",
  "people",
  "savedSender",
  "newSendId",
  "close",
])
const sandbox = process.env.TG_TEST_SANDBOX as string

const unreachable = async (): Promise<never> => {
  throw new Error("the lock lets no write reach the adapter")
}

const locked = async (argv: string[], env: NodeJS.ProcessEnv = {}) => {
  const writes: string[] = []
  let opened = 0
  const base = scripted({
    people: async () => ["777"],
    updateProfile: unreachable,
    updateGroup: unreachable,
  })
  const adapter = new Proxy(base, {
    get: (target, key) => {
      const name = String(key)
      const real = target[name as keyof Adapter] as ((...args: unknown[]) => unknown) | undefined
      if (typeof real !== "function") return real
      return (...args: unknown[]) => {
        if (!READS.has(name)) writes.push(name)
        return real(...args)
      }
    },
  })
  const botCalls: string[] = []
  const streams = captureStreams()
  const code = await run([...argv, "--json"], {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h", TG_BOT_TOKEN: "1:x", TG_READ_ONLY: "1", ...env },
    adapter: () => {
      opened += 1
      return adapter
    },
    botFetch: async (url) => {
      const method = url.split("/").at(-1) ?? ""
      botCalls.push(method)
      const result = method === "getMe" ? { id: 1, is_bot: true, first_name: "B", username: "b_bot" } : true
      return new Response(JSON.stringify({ ok: true, result }), { status: 200 })
    },
  })
  const error = JSON.parse(streams.stderr.find((line) => line.startsWith("{")) ?? "{}").error
  return { code, error, opened, writes: [...writes, ...botCalls.filter((method) => !method.startsWith("get"))] }
}

const seeded = (name: string, content = "kept") => {
  const path = join(sandbox, "read-only", name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}

describe("TG_READ_ONLY", () => {
  it("**keeps the session**: session end neither logs out nor deletes the session files", async () => {
    const path = sessionFile("ro-end")
    mkdirSync(dirname(path), { recursive: true })
    for (const suffix of ["", "-wal", "-shm"]) writeFileSync(`${path}${suffix}`, "")

    const { code, error, opened } = await locked(["ro-end", "session", "end"])

    expect(code).toBe(5)
    expect(error).toMatchObject({
      code: "permission_error",
      reason: "access.denied",
      message: expect.stringContaining("read-only (TG_READ_ONLY)"),
    })
    expect(opened).toBe(0)
    expect(["", "-wal", "-shm"].every((suffix) => existsSync(`${path}${suffix}`))).toBe(true)
  })

  it.each([
    ["session start", ["ro-start", "session", "start", "--qr-file", join(sandbox, "ro.png")]],
    ["setup", ["ro-setup", "setup", "--qr-file", join(sandbox, "ro.png")]],
  ])("refuses %s before connecting", async (_name, argv) => {
    const { code, error, opened } = await locked(argv)

    expect([code, error.code, opened]).toEqual([5, "permission_error", 0])
    expect(existsSync(join(sandbox, "ro.png"))).toBe(false)
  })

  it.each([
    ["reset", ["store", "reset", "--yes"]],
    ["restore", ["store", "restore", "BACKUP"]],
    ["clear", ["store", "clear", "--left", "--allow-dangerous"]],
    ["migrate", ["store", "migrate"]],
    ["repair", ["store", "repair"]],
    ["copies delete", ["store", "copies", "delete", "old_messages"]],
    ["decrypt", ["store", "decrypt", "BACKUP", "--output", "OUT"]],
  ])("refuses store %s and leaves the store file as it was", async (name, argv) => {
    const store = seeded(`${name}.db`)
    const backup = seeded(`${name}.backup`)
    const output = join(sandbox, "read-only", `${name}.out`)
    const words = argv.map((word) => (word === "BACKUP" ? backup : word === "OUT" ? output : word))

    const { code, error, opened } = await locked(["ro-store", ...words], { MESSAGING_STORE: store })

    expect([code, error.code, opened]).toEqual([5, "permission_error", 0])
    expect(error.message).toContain("cannot change the message store")
    expect(readFileSync(store, "utf8")).toBe("kept")
    expect(existsSync(output)).toBe(false)
  })

  it("still previews store repair with --dry-run", async () => {
    const { code } = await locked(["ro-store", "store", "repair", "--dry-run"], {
      MESSAGING_STORE: join(sandbox, "read-only", "preview.db"),
    })

    expect(code).toBe(0)
  })

  it.each([
    ["config set", ["config", "set", "limit", "5"]],
    ["config unset", ["config", "unset", "limit"]],
    ["mcp setup", ["mcp", "setup", "codex"]],
    ["server install", ["server", "install"]],
    ["schedule command", ["schedule", "command", "nightly", "chats list"]],
    ["skill install", ["skill", "install"]],
    ["upgrade", ["upgrade"]],
    ["messages send", ["messages", "send", "Valencia", "hello"]],
    ["account update", ["account", "update", "--first-name", "X"]],
    ["contacts add", ["contacts", "add", "777"]],
    ["chats update", ["chats", "update", "Valencia", "--title", "X"]],
    ["bot messages send", ["bot", "messages", "send", "123", "hi"]],
  ])("already refused %s, and writes nothing", async (_name, argv) => {
    const { code, error, writes } = await locked(["ro-shared", ...argv])

    expect([code, error.code]).toEqual([5, "permission_error"])
    expect(writes).toEqual([])
  })
})
