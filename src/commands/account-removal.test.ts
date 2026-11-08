import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { captureStreams, type KeyringStore, memoryKeyring } from "@wirecat/cli-base"
import { holdLock, lockPath } from "@wirecat/cli-core/background"
import { describe, expect, it, vi } from "vitest"
import { TG } from "../app.js"
import { run } from "../program.js"
import { TELEGRAM_REMOVAL } from "./account-removal.js"

const telegram = vi.hoisted(() => ({ loggedOut: [] as string[], failWith: undefined as Error | undefined }))

vi.mock("../telegram/adapter.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../telegram/adapter.js")>()
  return {
    ...original,
    TelegramAdapter: {
      open: async ({ sessionPath }: { sessionPath: string }) => ({
        logout: async () => {
          if (telegram.failWith) throw telegram.failWith
          telegram.loggedOut.push(sessionPath)
        },
        close: async () => {},
      }),
    },
  }
})

const SERVICE = TG.appName

const setup = () => {
  const root = mkdtempSync(join(tmpdir(), "tg-account-remove-"))
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    TG_CONFIG_DIR: join(root, "config"),
    TG_STATE_DIR: join(root, "state"),
    TG_CACHE_DIR: join(root, "cache"),
    MESSAGING_STORE: join(root, "m.db"),
  }
  mkdirSync(join(root, "config"), { recursive: true })
  writeFileSync(join(root, "config", "config.json"), JSON.stringify({ profiles: { personal: {}, work: {} } }))
  const sessions = join(root, "state", "sessions")
  mkdirSync(sessions, { recursive: true })
  for (const profile of ["personal", "work"]) {
    writeFileSync(join(sessions, `${profile}.session`), "synthetic")
    writeFileSync(join(sessions, `${profile}.session-wal`), "synthetic")
    mkdirSync(join(root, "state", "bots", profile), { recursive: true })
    writeFileSync(join(root, "state", "bots", profile, "mtproto-1.session"), "synthetic")
  }
  const keyring = memoryKeyring({
    [`${SERVICE}:personal:api`]: JSON.stringify({ id: 1, hash: "h" }),
    [`${SERVICE}:work:api`]: JSON.stringify({ id: 2, hash: "h" }),
    [`${SERVICE}:proxy:profile:personal`]: "synthetic",
    [`${SERVICE}:proxy:profile:work`]: "synthetic",
    [`${SERVICE}:bot:personal`]: "synthetic",
  })
  return { root, env, keyring, sessions }
}

const tg = async (argv: string[], { env, keyring }: { env: NodeJS.ProcessEnv; keyring: KeyringStore }) => {
  const streams = captureStreams()
  const code = await run(argv, { streams, tty: false, env, keyring })
  const out = streams.stdout.join("")
  return { code, item: out ? JSON.parse(out).item : undefined }
}

const held = (keyring: KeyringStore, account: string) => keyring.get(SERVICE, account) !== null

describe("account remove", () => {
  it("**logs out on Telegram and forgets only this profile** with --keep-data", async () => {
    const here = setup()
    telegram.loggedOut = []

    const { code, item } = await tg(["personal", "account", "remove", "--keep-data", "--yes", "--json"], here)

    expect(code).toBe(0)
    expect(item.revoked).toBe(true)
    expect(telegram.loggedOut).toEqual([join(here.sessions, "personal.session")])
    expect(existsSync(join(here.sessions, "personal.session"))).toBe(false)
    expect(existsSync(join(here.sessions, "personal.session-wal"))).toBe(false)
    expect(existsSync(join(here.root, "state", "bots", "personal"))).toBe(false)
    expect(held(here.keyring, "personal:api")).toBe(false)
    expect(held(here.keyring, "proxy:profile:personal")).toBe(false)
    expect(existsSync(join(here.sessions, "work.session"))).toBe(true)
    expect(existsSync(join(here.root, "state", "bots", "work", "mtproto-1.session"))).toBe(true)
    expect(held(here.keyring, "work:api")).toBe(true)
    expect(held(here.keyring, "proxy:profile:work")).toBe(true)
    expect(held(here.keyring, "bot:personal")).toBe(true)
  })

  it("**--delete-data removes the same sign-in files** and answers that the data went", async () => {
    const here = setup()

    const { code, item } = await tg(["work", "account", "remove", "--delete-data", "--yes", "--json"], here)

    expect(code).toBe(0)
    expect(item.data).toBe("deleted")
    expect(existsSync(join(here.sessions, "work.session"))).toBe(false)
    expect(existsSync(join(here.sessions, "personal.session"))).toBe(true)
  })

  it("**succeeds on a profile that is already signed out** and logs nothing out", async () => {
    const here = setup()
    telegram.loggedOut = []
    for (const suffix of ["", "-wal"]) rmSync(join(here.sessions, `work.session${suffix}`))

    const { code, item } = await tg(["work", "account", "remove", "--keep-data", "--yes", "--json"], here)

    expect(code).toBe(0)
    expect(item.revoked).toBeNull()
    expect(telegram.loggedOut).toEqual([])
    expect(held(here.keyring, "work:api")).toBe(false)
  })

  it("**keeps everything when Telegram refuses the log out**", async () => {
    const here = setup()
    telegram.failWith = new Error("network down")

    const { code } = await tg(["personal", "account", "remove", "--keep-data", "--yes", "--json"], here)
    telegram.failWith = undefined

    expect(code).not.toBe(0)
    expect(existsSync(join(here.sessions, "personal.session"))).toBe(true)
    expect(held(here.keyring, "personal:api")).toBe(true)
  })

  it("**refuses while tg serve holds the profile** and signs nothing out", async () => {
    const here = setup()
    const lock = lockPath(TG, "personal", here.env)
    mkdirSync(dirname(lock), { recursive: true, mode: 0o700 })
    holdLock(lock, { pid: process.pid, startedAt: new Date().toISOString() })
    telegram.loggedOut = []

    const { code } = await tg(["personal", "account", "remove", "--keep-data", "--yes", "--json"], here)

    expect(code).not.toBe(0)
    expect(telegram.loggedOut).toEqual([])
    expect(existsSync(join(here.sessions, "personal.session"))).toBe(true)
  })

  it("**does not log out at Telegram when the run may not revoke**, but forgets its own session file", async () => {
    const here = setup()
    telegram.loggedOut = []

    const signed = await TELEGRAM_REMOVAL.signOut("personal", {
      env: here.env,
      keyring: here.keyring,
      mayRevoke: false,
    })

    expect(signed).toEqual({ revoked: false, removed: ["the Telegram session"] })
    expect(telegram.loggedOut).toEqual([])
    expect(existsSync(join(here.sessions, "personal.session"))).toBe(false)
  })
})
