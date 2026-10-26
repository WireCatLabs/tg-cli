import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname } from "node:path"
import { PassThrough, Readable } from "node:stream"
import { CliError, captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { itemEnvelopeSchema } from "@wirecat/cli-base/standards"
import { PASTE_QR, plainQr } from "@wirecat/cli-core"
import { holdLock, listenRelay, lockPath, RELAY_PROTOCOL, relayPath } from "@wirecat/cli-core/background"
import * as v from "valibot"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TG } from "../app.js"
import { sessionFile } from "../paths.js"
import { run } from "../program.js"
import type { LoginPrompts } from "../telegram/adapter.js"
import { scripted } from "../testing/scripted.js"
import type { Environment } from "./context.js"

const answers = vi.hoisted(() => ({ queue: [] as string[], prompts: [] as string[] }))
const opened = vi.hoisted(() => ({ urls: [] as string[] }))
const registered = vi.hoisted(() => ({ calls: 0, error: undefined as Error | undefined }))

vi.mock("@wirecat/cli-core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@wirecat/cli-core")>()),
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
    if (registered.error) throw registered.error
    await phone()
    await code()
    return { id: 4242, hash: "registered-hash", created: true }
  },
}))

beforeEach(() => {
  vi.stubEnv("CI", "")
  answers.queue = []
  answers.prompts = []
  opened.urls = []
  registered.calls = 0
})

afterEach(() => vi.unstubAllEnvs())

const terminal = () => Object.assign(Readable.from([]), { isTTY: true })

const loginAdapter = (seen: { prompts?: LoginPrompts; opened?: unknown; loggedOut?: boolean }) =>
  scripted({
    login: async (prompts) => {
      seen.prompts = prompts
      prompts.showQr("tg://login?token=x", new Date("2026-09-29T12:00:00.000Z"))
      if (prompts.method === "phone") await prompts.phone()
      return { id: "1", name: "Owner", username: null }
    },
    logout: async () => {
      seen.loggedOut = true
    },
  })

const tg = async (argv: string[], environment: Partial<Environment> = {}) => {
  const streams = captureStreams()
  const code = await run(argv, { streams, tty: true, keyring: memoryKeyring(), stdin: terminal(), ...environment })
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
    const answer = v.parse(itemEnvelopeSchema(v.unknown()), JSON.parse(stdout[0] ?? ""))
    expect(answer.item).toEqual({
      profile: "default",
      account: { id: "1", name: "Owner", username: null },
      session: sessionFile("default"),
      app_keys: "environment",
      already_logged_in: false,
    })
    expect(seen.prompts?.method).toBe("qr")
    expect(seen.opened).toEqual({ id: 1, hash: "h" })
    expect(stderr.join("\n")).toContain("Link Desktop Device")
    expect(opened.urls).toEqual([])
  })

  it("says until when the QR code is valid in the computer's zone, and names it", async () => {
    vi.stubEnv("TZ", "Asia/Vladivostok")
    const { code, stderr } = await tg(["session", "start", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter({}),
    })

    expect(code).toBe(0)
    expect(stderr.join("\n")).toContain("(valid until 22:00:00 Asia/Vladivostok)")
  })

  // The app shows a path under home as `~/…` with forward slashes, on Windows too.
  const shownPath = (file: string) => {
    const home = homedir().replaceAll("\\", "/")
    const portable = file.replaceAll("\\", "/")
    return portable.startsWith(`${home}/`) ? `~${portable.slice(home.length)}` : file
  }

  it("tells a person who is logged in, where the session is, and where the app keys live", async () => {
    const { stdout } = await tg(["session", "start"], {
      tty: true,
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter({}),
    })

    expect(stdout.join("\n")).toBe(
      [
        "Logged in as Owner (id 1) — profile default.",
        `Session:  ${shownPath(sessionFile("default"))}`,
        "App keys: from TG_API_ID and TG_API_HASH",
        "Next:     tg default chats list · tg default server install to keep the archive current",
      ].join("\n"),
    )
  })

  it("**says it was already logged in** when Telegram still accepts the session and nothing was asked", async () => {
    const still = { ...loginAdapter({}), login: async () => ({ id: "1", name: "Owner", username: null }) }
    const env = { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" }
    const pretty = await tg(["tgtest", "session", "start", "phone"], { tty: true, env, adapter: () => still })
    const json = await tg(["session", "start", "--json"], { env, adapter: () => still })

    expect(pretty.stdout.join("\n").split("\n")[0]).toBe(
      "Already logged in as Owner (id 1) — profile tgtest; nothing was asked. `tg tgtest session end` first to log in again.",
    )
    expect(json.stderr).toEqual([])
    expect(JSON.parse(json.stdout[0] ?? "")).toMatchObject({ item: { already_logged_in: true } })
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
    expect(seen.prompts?.forceSms).toBeUndefined()
    expect(answers.prompts).toEqual(["phone number, international format: "])
  })

  it("asks Telegram for the code by SMS with --sms, and only for a phone login", async () => {
    const seen: { prompts?: LoginPrompts } = {}
    answers.queue = ["+34600000000"]
    const { code } = await tg(["session", "start", "phone", "--sms"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter(seen),
    })
    expect(code).toBe(0)
    expect(seen.prompts?.forceSms).toBe(true)

    const qr = await tg(["session", "start", "--sms", "--json"], { adapter: () => loginAdapter({}) })
    expect(JSON.parse(qr.stderr.at(-1) ?? "").error.message).toContain("--sms is for a phone login")
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
    const failing = { ...loginAdapter({}), login: async () => Promise.reject(new Error("no")) }
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

  it("names this profile's session start in the fallback after a failed app registration", async () => {
    registered.error = new CliError("invalid_response", "synthetic unreadable app page")
    try {
      const { code, stderr } = await tg(["work", "session", "start", "--app", "auto"], { keyring: memoryKeyring() })
      expect(code).not.toBe(0)
      expect(stderr.join("\n")).toContain("`tg work session start --app browser`")
    } finally {
      registered.error = undefined
    }
  })

  it("**refuses to run without a terminal**, since it asks questions", async () => {
    const { code, stdout, stderr } = await tg(["session", "start"], {
      tty: false,
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
      adapter: () => loginAdapter({}),
    })

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.message).toContain("without one it needs stored app keys")
  })

  it("**prints the QR code as text an agent pastes into the chat**, with no terminal, and each code as a JSON line", async () => {
    const { code, stderr } = await tg(["session", "start", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      tty: false,
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
      adapter: () => ({
        ...loginAdapter({}),
        login: async (prompts: LoginPrompts) => {
          prompts.showQr("tg://login?token=x", new Date("2026-09-29T12:00:00.000Z"))
          prompts.showQr("tg://login?token=y", new Date("2026-09-29T12:00:30.000Z"))
          return { id: "1", name: "Owner", username: null }
        },
      }),
    })

    expect(code).toBe(0)
    const shown = stderr.join("\n")
    expect(shown).toContain(plainQr("tg://login?token=x"))
    expect(shown).toContain(PASTE_QR)
    expect(shown).not.toContain("\x1b")
    const events = stderr.filter((line) => line.startsWith('{"event"')).map((line) => JSON.parse(line))
    expect(events).toEqual([
      {
        event: "qr",
        qr: { text: plainQr("tg://login?token=x"), expires_at: "2026-09-29T12:00:00.000Z", scan: expect.any(String) },
      },
      {
        event: "qr",
        qr: { text: plainQr("tg://login?token=y"), expires_at: "2026-09-29T12:00:30.000Z", scan: expect.any(String) },
      },
    ])
  })

  const drawnAt = async (columns: number) => {
    const before = Object.getOwnPropertyDescriptor(process.stderr, "columns")
    Object.defineProperty(process.stderr, "columns", { value: columns, configurable: true })
    try {
      const { code, stderr } = await tg(["session", "start"], {
        env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
        adapter: () => loginAdapter({}),
      })
      expect(code).toBe(0)
      return stderr.join("\n")
    } finally {
      if (before) Object.defineProperty(process.stderr, "columns", before)
      else delete (process.stderr as { columns?: number }).columns
    }
  }

  it("**says where to scan after the code it draws**", async () => {
    const shown = await drawnAt(200)
    expect(shown.indexOf("▀")).toBeGreaterThan(-1)
    expect(shown.indexOf("Link Desktop Device")).toBeGreaterThan(shown.lastIndexOf("▀"))
  })

  it("**does not ask to scan a code a narrow terminal could not draw**", async () => {
    const shown = await drawnAt(20)
    expect(shown).toContain("20 columns wide")
    expect(shown).not.toContain("▀")
    expect(shown).not.toContain("Link Desktop Device")
  })

  it("a login without a terminal still refuses to ask for what it would have to ask", async () => {
    const { code, stderr } = await tg(["session", "start"], {
      tty: false,
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
      adapter: () => loginAdapter({}),
    })

    expect(code).toBe(2)
    expect(JSON.parse(stderr.at(-1) ?? "").error.message).toContain("asks questions — run it in a terminal")
    const phone = await tg(["session", "start", "phone", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      adapter: () => loginAdapter({}),
    })
    expect(JSON.parse(phone.stderr.at(-1) ?? "").error.message).toContain("asks questions — run it in a terminal")
  })

  it("**asks each question as a `needs` line and reads its answer from stdin** with --answer-stdin", async () => {
    const keyring = memoryKeyring()
    const stdin = Object.assign(new PassThrough(), { isTTY: false })
    stdin.write("12345\nabcdef\n+34600000000\n55555\nnot-a-real-2fa\n")
    const given: string[] = []
    const { code, stdout, stderr } = await tg(["session", "start", "phone", "--json", "--answer-stdin"], {
      tty: false,
      stdin,
      keyring,
      adapter: (options) => {
        expect(options.credentials).toEqual({ id: 12345, hash: "abcdef" })
        return {
          ...loginAdapter({}),
          login: async (prompts: LoginPrompts) => {
            given.push(await prompts.phone(), await prompts.code(), await prompts.password())
            return { id: "1", name: "Owner", username: null }
          },
        }
      },
    })

    expect(code).toBe(0)
    expect(given).toEqual(["+34600000000", "55555", "not-a-real-2fa"])
    const events = stderr.filter((line) => line.startsWith('{"event"')).map((line) => JSON.parse(line))
    expect(events.map((e) => [e.event, e.field ?? e.url, e.secret])).toEqual([
      ["open_url", "https://my.telegram.org/apps", undefined],
      ["needs", "api_id", false],
      ["needs", "api_hash", true],
      ["needs", "phone", false],
      ["needs", "code", false],
      ["needs", "password", true],
    ])
    expect([...stdout, ...stderr].join("\n")).not.toContain("not-a-real-2fa")
    expect(answers.prompts).toEqual([])
  })

  it("still refuses a phone login without a terminal when --answer-stdin is left out", async () => {
    const { code, stderr } = await tg(["session", "start", "phone", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
      tty: false,
      stdin: Object.assign(new PassThrough(), { isTTY: false }),
      adapter: () => loginAdapter({}),
    })
    expect(code).toBe(2)
    expect(JSON.parse(stderr.at(-1) ?? "").error.message).toContain("asks questions — run it in a terminal")
  })

  it("refuses a profile named like a command", async () => {
    const { code, stderr } = await tg(["session", "start", "--json"], {
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
    expect(v.parse(itemEnvelopeSchema(v.unknown()), JSON.parse(stdout[0] ?? "")).item).toEqual({
      profile: "default",
      ended: false,
    })
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
    expect(v.parse(itemEnvelopeSchema(v.unknown()), JSON.parse(stdout[0] ?? "")).item).toEqual({
      profile: "ending",
      ended: true,
    })
    expect(seen.loggedOut).toBe(true)
    expect(existsSync(path) || existsSync(`${path}-wal`)).toBe(false)
  })

  // serve offers no relay on Windows.
  it.skipIf(process.platform === "win32")(
    "**stays off a running serve's relay** and leaves serve's login and session file alone",
    async () => {
      const path = sessionFile("served")
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, "")
      const lock = lockPath(TG, "served", process.env)
      mkdirSync(dirname(lock), { recursive: true, mode: 0o700 })
      const relayed: string[][] = []
      const relay = await listenRelay(relayPath(lock), async ({ argv }) => {
        relayed.push(argv)
        return 0
      })
      holdLock(lock, {
        pid: process.pid,
        startedAt: new Date().toISOString(),
        relay: { path: relayPath(lock), protocol: RELAY_PROTOCOL },
      })
      const seen: { loggedOut?: boolean } = {}

      try {
        const { code, stderr } = await tg(["served", "session", "end", "--json"], {
          env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
          adapter: () => loginAdapter(seen),
        })

        expect(relayed).toEqual([])
        expect(code).toBe(2)
        expect(JSON.parse(stderr[0] ?? "").error.message).toContain("server stop")
        expect(seen.loggedOut).toBeUndefined()
        expect(existsSync(path)).toBe(true)
      } finally {
        await relay.close()
      }
    },
  )
})
