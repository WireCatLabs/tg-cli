import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { Readable, Writable } from "node:stream"
import { stripVTControlCharacters } from "node:util"
import { CliError, captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { installSkill } from "@wirecat/cli-base/skill"
import { itemEnvelopeSchema } from "@wirecat/cli-base/standards"
import { PASTE_QR, plainQr } from "@wirecat/cli-core"
import * as v from "valibot"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { sessionFile } from "../paths.js"
import { run } from "../program.js"
import { chat, scripted } from "../testing/scripted.js"
import type { Adapter, Environment } from "./context.js"

const input = vi.hoisted(() => ({ answers: [] as string[], prompts: [] as string[] }))
const registration = vi.hoisted(() => ({ calls: 0, error: undefined as Error | undefined }))
const browser = vi.hoisted(() => ({ urls: [] as string[] }))

vi.mock("@wirecat/cli-core", async (original) => ({
  ...(await original<typeof import("@wirecat/cli-core")>()),
  readSecret: async (prompt: string) => {
    input.prompts.push(prompt)
    return input.answers.shift() ?? ""
  },
}))
vi.mock("@wirecat/cli-base/skill", async (original) => ({
  ...(await original<typeof import("@wirecat/cli-base/skill")>()),
  installSkill: vi.fn((_app, _skill, options: { targets: string[] }) =>
    options.targets.map((target) => join(process.env.TG_TEST_SANDBOX ?? "", target, "tg-cli", "SKILL.md")),
  ),
}))
vi.mock("../browser.js", () => ({
  openInBrowser: (url: string) => {
    browser.urls.push(url)
    return true
  },
}))
vi.mock("../telegram/registration.js", async (original) => ({
  ...(await original<typeof import("../telegram/registration.js")>()),
  registerApp: async (prompts: { phone: () => Promise<string>; code: () => Promise<string> }) => {
    registration.calls += 1
    if (registration.error) throw registration.error
    await prompts.phone()
    await prompts.code()
    return { id: 4242, hash: "synthetic-app-hash", created: true }
  },
}))

let env: NodeJS.ProcessEnv
beforeEach(() => {
  const root = mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "setup-"))
  env = {
    ...process.env,
    CI: "",
    TG_CONFIG_DIR: join(root, "config"),
    TG_STATE_DIR: join(root, "state"),
    TG_CACHE_DIR: join(root, "cache"),
    MESSAGING_STORE: join(root, "messages.db"),
  }
  input.answers = []
  input.prompts = []
  registration.calls = 0
  registration.error = undefined
  browser.urls = []
  vi.mocked(installSkill).mockClear()
})

const withKeys = () => {
  env.TG_API_ID = "1"
  env.TG_API_HASH = "synthetic-env-hash"
}
const existingSession = (profile = "default") => {
  const path = sessionFile(profile, env)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, "synthetic session")
  withKeys()
  return path
}
const prompted = () => {
  const chunks: string[] = []
  const stderr = new Writable({
    write(chunk, _encoding, done) {
      chunks.push(String(chunk))
      done()
    },
  })
  return { stderr, text: () => stripVTControlCharacters(chunks.join("")) }
}
const typed = (text: string) => Object.assign(Readable.from([text]), { isTTY: true })
const execute = async (argv: string[], environment: Partial<Environment> = {}, overrides: Partial<Adapter> = {}) => {
  const streams = captureStreams()
  const closed = vi.fn(async () => {})
  const login = vi.fn(async (prompts) => {
    if (prompts.method === "qr") prompts.showQr("tg://login?token=synthetic", new Date())
    else {
      await prompts.phone()
      await prompts.code()
      await prompts.password()
    }
    const path = sessionFile(env.TG_PROFILE ?? "default", env)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, "synthetic session")
    return { id: "1", name: "Owner", username: null }
  })
  const chats = vi.fn(async () => ({ items: [chat], hasMore: true }))
  const opened = vi.fn(() => scripted({ login, chats, close: closed, ...overrides }))
  const code = await run(argv, {
    streams,
    tty: true,
    stdin: Object.assign(Readable.from([]), { isTTY: true }),
    keyring: memoryKeyring(),
    env,
    adapter: opened,
    ...environment,
  })
  return { code, stdout: streams.stdout, stderr: streams.stderr, login, chats, opened, closed }
}

describe("setup", () => {
  it("**needs a profile name on a new computer**, and says which command to run", async () => {
    const { TG_PROFILE: _, ...unnamed } = env
    const result = await execute(["setup", "--json"], { env: unnamed, tty: false })
    expect(result.code).toBe(2)
    expect(JSON.parse(result.stderr.at(-1) ?? "").error.message).toContain("create one with `tg personal setup`")
    expect(result.opened).not.toHaveBeenCalled()
  })

  it("gets the app automatically, logs in, checks five chats and installs the selected skill", async () => {
    input.answers = ["synthetic-number", "synthetic-code"]
    const result = await execute(
      ["setup", "--agent", "codex"],
      {},
      {
        me: async () => ({ id: "1", name: "Owner", username: null, phone: "synthetic-phone" }),
      },
    )
    expect(result.code).toBe(0)
    expect(result.stdout.join()).toContain("Telegram is ready")
    expect(result.stdout.join()).not.toMatch(/synthetic-(app-hash|code|number|phone)/)
    expect(result.stderr.join()).not.toMatch(/synthetic-(app-hash|code|number|phone)/)
    expect(registration.calls).toBe(1)
    expect(result.login).toHaveBeenCalledTimes(1)
    expect(result.chats).toHaveBeenCalledWith({ limit: 5, offset: 0 })
    expect(result.closed).toHaveBeenCalledTimes(2)
    expect(installSkill).toHaveBeenCalledWith(expect.anything(), expect.any(URL), { targets: ["agents"], env })
    const notes = result.stderr.join("\n")
    expect(notes).toContain("about 5 minutes")
    for (let step = 1; step <= 5; step++) expect(notes).toContain(`${step}/5`)
    expect(notes).toContain("history is a separate step")
    expect(existsSync(env.MESSAGING_STORE ?? "")).toBe(true)
  })

  it("reuses the session on a second run, without another login or app registration", async () => {
    withKeys()
    expect((await execute(["setup", "--agent", "claude"])).code).toBe(0)
    const again = await execute(["setup", "--agent", "claude", "--json"])
    expect(again.code).toBe(0)
    const answer = v.parse(
      itemEnvelopeSchema(v.looseObject({ session: v.object({ reused: v.boolean() }) })),
      JSON.parse(again.stdout[0] ?? ""),
    )
    expect(answer.item.session.reused).toBe(true)
    expect(again.stderr.join("\n")).toContain("3/5 — Link this device")
    expect(again.login).not.toHaveBeenCalled()
    expect(registration.calls).toBe(0)
    expect(again.closed).toHaveBeenCalledTimes(1)
    expect(installSkill).toHaveBeenLastCalledWith(expect.anything(), expect.any(URL), { targets: ["claude"], env })
  })

  it.each(["cursor", "gemini", "all"])("maps %s to supported skill targets", async (agent) => {
    existingSession()
    const result = await execute(["setup", "--agent", agent, "--json"])
    expect(result.code).toBe(0)
    expect(installSkill).toHaveBeenCalledWith(expect.anything(), expect.any(URL), {
      targets: agent === "all" ? ["claude", "agents"] : ["agents"],
      env,
    })
  })

  it("shows a person each step as a heading, its details and the QR code indented under it", async () => {
    input.answers = ["synthetic-number", "synthetic-code"]
    const result = await execute(["setup", "--agent", "codex"], { tty: true })
    expect(result.code).toBe(0)
    const screen = result.stderr.join("\n")
    for (let step = 1; step <= 5; step++) expect(screen).toMatch(new RegExp(`\n\\[${step}/5\\] `))
    expect(screen).toContain("\n      ✓ local directories ready")
    expect(screen).toMatch(/\n\n {8}\S/)
    expect(screen).not.toMatch(/^· \d\/5/m)
    expect(screen).toContain("[3/5] Link this device")
    expect(screen.slice(0, screen.indexOf("▀"))).not.toMatch(/scan/i)
  })

  it("asks a person for their agent and prints a readable completion", async () => {
    existingSession()
    const prompt = prompted()
    const result = await execute(["setup"], { stdin: typed(" GEMINI \n"), tty: true, stderr: prompt.stderr })
    expect(result.code).toBe(0)
    expect(prompt.text()).toContain("Agent [codex/cursor/claude/gemini/all/none]")
    expect(result.stdout.join()).toContain("installed for gemini")
    expect(result.stdout.join()).toContain("tg default inbox --limit 5")
    expect(stripVTControlCharacters(result.stdout.join())).toMatch(/For an agent +tg default skill show/)
  })

  it("an empty agent choice skips installation", async () => {
    existingSession()
    const result = await execute(["setup"], { stdin: typed("\n"), tty: true })
    expect(result.code).toBe(0)
    expect(stripVTControlCharacters(result.stdout.join())).toMatch(/Agent skill +skipped/)
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("never asks about agents in machine mode and defaults to no installation", async () => {
    existingSession()
    const prompt = prompted()
    const result = await execute(["setup", "--json"], { stderr: prompt.stderr })
    expect(result.code).toBe(0)
    expect(input.prompts).toEqual([])
    expect(prompt.text()).not.toContain("Agent [")
    expect(installSkill).not.toHaveBeenCalled()
    expect(JSON.parse(result.stdout[0] ?? "").item.next.mcp).toBe("tg default mcp config")
  })

  it("rejects an unknown interactive choice without installing a skill", async () => {
    existingSession()
    const result = await execute(["setup"], { stdin: typed("unknown\n"), tty: true })
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(installSkill).not.toHaveBeenCalled()
    expect(result.closed).toHaveBeenCalledTimes(1)
  })

  it("cancels cleanly at the agent choice and preserves the existing session", async () => {
    const path = existingSession()
    const result = await execute(["setup"], { tty: true })
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(readFileSync(path, "utf8")).toBe("synthetic session")
    expect(result.closed).toHaveBeenCalledTimes(1)
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("refuses a first login without a terminal before opening Telegram", async () => {
    const result = await execute(["setup", "--agent", "none"], {
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
    })
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(result.opened).not.toHaveBeenCalled()
    expect(registration.calls).toBe(0)
  })

  it("skips the optional agent question under CI even on a terminal", async () => {
    existingSession()
    env.CI = "true"
    const prompt = prompted()
    const result = await execute(["setup"], { tty: true, stderr: prompt.stderr })
    expect(result.code).toBe(0)
    expect(input.prompts).toEqual([])
    expect(prompt.text()).not.toContain("Agent [")
    expect(installSkill).not.toHaveBeenCalled()
  })

  it.each(["--json", "--jsonl", "--no-input"])(
    "refuses interactive first login with %s even on a terminal",
    async (flag) => {
      const result = await execute(["setup", "--agent", "none", flag], { tty: true })
      expect(result.code).toBe(2)
      expect(input.prompts).toEqual([])
      expect(browser.urls).toEqual([])
      expect(registration.calls).toBe(0)
      expect(result.opened).not.toHaveBeenCalled()
    },
  )

  it("prints the QR code as text for an agent without a terminal, with stored app keys", async () => {
    withKeys()
    const result = await execute(["setup", "--agent", "none", "--json"], {
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
    })
    expect(result.code).toBe(0)
    expect(result.stderr.join("\n")).toContain(plainQr("tg://login?token=synthetic"))
    expect(result.stderr.join("\n")).toContain(PASTE_QR)
    expect(result.stderr.join("\n")).not.toContain("\x1b")
  })

  it("refuses a first login without a terminal when the app keys would have to be typed", async () => {
    const result = await execute(["setup", "--agent", "none", "--json"], {
      stdin: Object.assign(Readable.from([]), { isTTY: false }),
    })
    expect(result.code).toBe(2)
    expect(JSON.parse(result.stderr.at(-1) ?? "").error.message).toContain("with stored app credentials")
    expect(result.opened).not.toHaveBeenCalled()
  })

  it("phone login and browser app registration remain available", async () => {
    input.answers = ["12345", "abcdef", "synthetic-number", "synthetic-code", "synthetic-password"]
    const result = await execute(["setup", "--method", "phone", "--app", "browser", "--agent", "none"])
    expect(result.code).toBe(0)
    expect(browser.urls).toEqual(["https://my.telegram.org/apps"])
    expect(result.stderr.join()).toContain("API development tools")
    expect(result.login).toHaveBeenCalledWith(expect.objectContaining({ method: "phone" }))
    expect(registration.calls).toBe(0)
    expect(result.stdout.join()).not.toContain("synthetic-password")
  })

  it("shows the manual app fallback for this profile without retrying a failed registration", async () => {
    registration.error = new CliError("rate_limited", "synthetic refusal")
    const keyring = memoryKeyring()
    const result = await execute(["work", "setup", "--app", "auto", "--agent", "none"], { keyring })
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("tg work setup --app browser")
    expect(registration.calls).toBe(1)
    expect(result.opened).not.toHaveBeenCalled()
    expect(keyring.entries.size).toBe(0)
  })

  it("never silently logs in again when an existing session is rejected", async () => {
    const path = existingSession()
    const result = await execute(
      ["setup", "--agent", "none", "--json"],
      {},
      {
        me: async () => {
          throw new CliError("authentication_error", "synthetic expired session")
        },
      },
    )
    expect(result.code).toBe(4)
    expect(result.stdout).toEqual([])
    expect(result.login).not.toHaveBeenCalled()
    expect(result.closed).toHaveBeenCalledTimes(1)
    expect(readFileSync(path, "utf8")).toBe("synthetic session")
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("does not request new keys when an existing session has lost access to its credentials", async () => {
    existingSession()
    delete env.TG_API_ID
    delete env.TG_API_HASH
    const result = await execute(["setup", "--agent", "none", "--json"])
    expect(result.code).toBe(4)
    expect(result.opened).not.toHaveBeenCalled()
    expect(registration.calls).toBe(0)
    expect(result.stderr.join()).toContain("keyring is probably out of reach")
  })

  it("closes a connection that cannot list chats", async () => {
    existingSession()
    const result = await execute(["setup", "--agent", "none", "--json"], {}, { chats: undefined })
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(result.closed).toHaveBeenCalledTimes(1)
  })

  it("ends a stalled account check on timeout, closes it and installs nothing", async () => {
    existingSession()
    let rejectRequest: ((error: Error) => void) | undefined
    const close = vi.fn(async () => rejectRequest?.(new Error("synthetic connection closed")))
    const result = await execute(
      ["setup", "--agent", "codex", "--timeout", "100ms", "--json"],
      {},
      {
        me: () =>
          new Promise((_resolve, reject) => {
            rejectRequest = reject
          }),
        close,
      },
    )
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toMatch(/timeout|did not finish within/)
    expect(close).toHaveBeenCalled()
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("cancels a pending agent choice on the whole-command deadline without ending stdin", async () => {
    existingSession()
    const stdin = Object.assign(new Readable({ read() {} }), { isTTY: true })
    const ended = vi.fn()
    stdin.on("end", ended)
    const prompt = prompted()
    const result = await execute(["setup", "--timeout", "100ms"], { stdin, tty: true, stderr: prompt.stderr })
    expect(prompt.text()).toContain("Agent [codex/cursor/claude/gemini/all/none]")
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("did not finish within 100ms")
    expect(ended).not.toHaveBeenCalled()
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("closes a stalled login on timeout", async () => {
    withKeys()
    let rejectRequest: ((error: Error) => void) | undefined
    const close = vi.fn(async () => rejectRequest?.(new Error("synthetic connection closed")))
    const result = await execute(
      ["setup", "--agent", "codex", "--timeout", "100ms", "--json"],
      {},
      {
        login: (prompts) =>
          new Promise((_resolve, reject) => {
            rejectRequest = reject
            prompts.showQr("tg://login?token=synthetic", new Date())
          }),
        close,
      },
    )
    expect(result.code).not.toBe(0)
    expect(result.stdout).toEqual([])
    expect(close).toHaveBeenCalled()
    expect(installSkill).not.toHaveBeenCalled()
  })

  it("closes the connection when login is cancelled", async () => {
    withKeys()
    const result = await execute(
      ["setup", "--agent", "none", "--json"],
      {},
      {
        login: async (prompts) => {
          prompts.showQr("tg://login?token=synthetic", new Date())
          throw new CliError("cancelled", "synthetic cancellation")
        },
      },
    )
    expect(result.code).not.toBe(0)
    expect(result.closed).toHaveBeenCalledTimes(1)
    expect(result.stdout).toEqual([])
    expect(installSkill).not.toHaveBeenCalled()
  })

  it.each(["account.show", "chats.list"])("respects a denied %s permission before connecting", async (permission) => {
    existingSession()
    mkdirSync(env.TG_CONFIG_DIR ?? "", { recursive: true })
    writeFileSync(
      join(env.TG_CONFIG_DIR ?? "", "config.json"),
      JSON.stringify({ profiles: {}, defaults: { permissions: { [permission]: "deny" } } }),
    )
    const result = await execute(["setup", "--agent", "none", "--json"])
    expect(result.code).toBe(5)
    expect(result.stdout).toEqual([])
    expect(result.opened).not.toHaveBeenCalled()
  })

  it.each([{ flags: ["--offline"] }, { flags: ["--qr-file", "login.png"] }])(
    "refuses incompatible flags: %s",
    async ({ flags }) => {
      const result = await execute(["setup", "--agent", "none", ...flags])
      expect(result.code).toBe(2)
      expect(result.opened).not.toHaveBeenCalled()
    },
  )

  it("keeps the profile in next commands when running through npm exec", async () => {
    existingSession("work")
    const result = await execute(["work", "setup", "--agent", "none", "--json"], {
      update: { scriptPath: "/home/test/.npm/_npx/key/node_modules/@wirecat/tg-cli/dist/bin/tg.js" },
    })
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout[0] ?? "").item.next.inbox).toMatch(
      /npm(?:\.cmd)? exec --yes --package=@wirecat\/tg-cli -- tg work inbox --limit 5/,
    )
  })
})
