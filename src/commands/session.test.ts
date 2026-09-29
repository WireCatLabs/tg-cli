import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { sessionFile } from "../paths.js"
import { run } from "../program.js"
import type { LoginPrompts } from "../telegram/adapter.js"
import type { Adapter, Environment } from "./context.js"

const answers = vi.hoisted(() => ({ queue: [] as string[], prompts: [] as string[] }))
const opened = vi.hoisted(() => ({ urls: [] as string[] }))
const registered = vi.hoisted(() => ({ calls: 0 }))

vi.mock("@leemour/cli-messaging", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@leemour/cli-messaging")>()),
  readSecret: async (prompt: string) => {
    answers.prompts.push(prompt)
    return answers.queue.shift() ?? ""
  },
}))
vi.mock("../browser.js", () => ({
  openInBrowser: (url: string) => {
    opened.urls.push(url)
    return true
  },
}))
vi.mock("../telegram/registration.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../telegram/registration.js")>()),
  registerApp: async ({ phone, code }: { phone: () => Promise<string>; code: () => Promise<string> }) => {
    registered.calls += 1
    await phone()
    await code()
    return { id: 4242, hash: "registered-hash", created: true }
  },
}))

beforeEach(() => {
  answers.queue = []
  answers.prompts = []
  opened.urls = []
  registered.calls = 0
})

const terminal = () => Object.assign(Readable.from([]), { isTTY: true })

const loginAdapter = (seen: { prompts?: LoginPrompts; opened?: unknown; loggedOut?: boolean }) =>
  ({
    login: async (prompts: LoginPrompts) => {
      seen.prompts = prompts
      prompts.showQr("tg://login?token=x", new Date("2026-09-29T12:00:00.000Z"))
      if (prompts.method === "phone") await prompts.phone()
      return { id: "1", name: "Owner", username: null }
    },
    self: () => "1",
    logout: async () => {
      seen.loggedOut = true
    },
    close: async () => {},
  }) as unknown as Adapter

const tg = async (argv: string[], environment: Partial<Environment> = {}) => {
  const streams = captureStreams()
  const code = await run(argv, { streams, tty: false, keyring: memoryKeyring(), stdin: terminal(), ...environment })
  return { code, stdout: streams.stdout, stderr: streams.stderr }
}

describe("session start", () => {
  it("**logs in by QR code with the stored app** and answers with the account", async () => {
    const seen: { prompts?: LoginPrompts; opened?: unknown } = {}
    const { code, stdout, stderr } = await tg(["session", "start", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: (options) => {
        seen.opened = options.credentials
        return loginAdapter(seen)
      },
    })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toEqual({
      profile: "default",
      account: { id: "1", name: "Owner", username: null },
    })
    expect(seen.prompts?.method).toBe("qr")
    expect(seen.opened).toEqual({ id: 1, hash: "h" })
    expect(stderr.join("\n")).toContain("Link Desktop Device")
    expect(opened.urls).toEqual([])
  })

  it("logs in by phone number, asking for it on the terminal", async () => {
    const seen: { prompts?: LoginPrompts } = {}
    answers.queue = ["+34600000000"]
    const { code } = await tg(["session", "start", "phone"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter(seen),
    })

    expect(code).toBe(0)
    expect(seen.prompts?.method).toBe("phone")
    expect(answers.prompts).toEqual(["phone number, international format: "])
  })

  it("**opens my.telegram.org the first time**, and keeps the app only once Telegram accepted it", async () => {
    const keyring = memoryKeyring()
    answers.queue = ["12345", "abcdef"]
    const { code, stderr } = await tg(["session", "start", "--app", "browser"], {
      keyring,
      adapter: (options) => {
        expect(options.credentials).toEqual({ id: 12345, hash: "abcdef" })
        return loginAdapter({})
      },
    })

    expect(code).toBe(0)
    expect(opened.urls).toEqual(["https://my.telegram.org/apps"])
    expect(stderr.join("\n")).toContain("App api_id")
    expect([...keyring.entries.values()].some((value) => value.includes("12345"))).toBe(true)
  })

  it("stores nothing when the login fails", async () => {
    const keyring = memoryKeyring()
    answers.queue = ["12345", "abcdef"]
    const failing = { ...loginAdapter({}), login: async () => Promise.reject(new Error("no")) } as unknown as Adapter
    const { code } = await tg(["session", "start"], { keyring, adapter: () => failing })

    expect(code).not.toBe(0)
    expect(keyring.entries.size).toBe(0)
  })

  it("registers the app on my.telegram.org with --app auto", async () => {
    const keyring = memoryKeyring()
    answers.queue = ["+34600000000", "55555"]
    const { code, stderr } = await tg(["session", "start", "--app", "auto"], {
      keyring,
      adapter: (options) => {
        expect(options.credentials).toEqual({ id: 4242, hash: "registered-hash" })
        return loginAdapter({})
      },
    })

    expect(code).toBe(0)
    expect(registered.calls).toBe(1)
    expect(opened.urls).toEqual([])
    expect(stderr.join("\n")).toContain("registered a new app")
    expect([...keyring.entries.values()].some((value) => value.includes("4242"))).toBe(true)
  })

  it("**refuses to run without a terminal**, since it asks questions", async () => {
    const { code, stdout, stderr } = await tg(["session", "start"], {
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
      adapter: () => loginAdapter({}),
    })

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.message).toContain("in a terminal")
  })

  it("refuses a profile named like a command", async () => {
    const { code, stderr } = await tg(["session", "start"], {
      env: { ...process.env, TG_PROFILE: "chats", TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter({}),
    })

    expect(code).toBe(2)
    expect(JSON.parse(stderr[0] ?? "").error.message).toContain("chats")
  })
})

describe("session end", () => {
  it("answers ended: false when this profile has no session", async () => {
    const { code, stdout } = await tg(["session", "end", "--json"])

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toEqual({ profile: "default", ended: false })
  })

  it("**logs out on Telegram's side** and removes the session file", async () => {
    const path = sessionFile("ending")
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, "")
    writeFileSync(`${path}-wal`, "")
    const seen: { loggedOut?: boolean } = {}

    const { code, stdout } = await tg(["ending", "session", "end", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter(seen),
    })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toEqual({ profile: "ending", ended: true })
    expect(seen.loggedOut).toBe(true)
    expect(existsSync(path) || existsSync(`${path}-wal`)).toBe(false)
  })
})
