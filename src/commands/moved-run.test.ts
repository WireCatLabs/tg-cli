import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { sessionFile, usesOwnersSession } from "../paths.js"
import { run } from "../program.js"
import { scripted } from "../testing/scripted.js"
import { TELEGRAM_REMOVAL } from "./account-removal.js"

const telegram = vi.hoisted(() => ({ loggedOut: [] as string[] }))

// The sandboxed HOME stands in for the owner's: a run that moves only some folders then reaches "the owner's" files.
vi.mock("node:os", async (importOriginal) => {
  const original = await importOriginal<typeof import("node:os")>()
  return { ...original, userInfo: () => ({ ...original.userInfo(), homedir: process.env.HOME ?? "" }) }
})

vi.mock("../telegram/adapter.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../telegram/adapter.js")>()
  return {
    ...original,
    TelegramAdapter: {
      open: async ({ sessionPath }: { sessionPath: string }) => ({
        logout: async () => {
          telegram.loggedOut.push(sessionPath)
        },
        close: async () => {},
      }),
    },
  }
})

const PROFILE = "moved"

const ownersSession = () => {
  const path = sessionFile(PROFILE, { HOME: process.env.HOME })
  mkdirSync(dirname(path), { recursive: true })
  for (const suffix of ["", "-wal"]) writeFileSync(`${path}${suffix}`, "synthetic")
  return path
}

const moved = (...kinds: ("CONFIG" | "STATE")[]) => {
  const root = mkdtempSync(join(tmpdir(), "tg-moved-"))
  const env: NodeJS.ProcessEnv = { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" }
  for (const kind of kinds) env[`TG_${kind}_DIR`] = join(root, kind.toLowerCase())
  return env
}

const end = async (env: NodeJS.ProcessEnv) => {
  const streams = captureStreams()
  const code = await run([PROFILE, "session", "end", "--json"], { streams, tty: false, env, keyring: memoryKeyring() })
  return { code, item: JSON.parse(streams.stdout.join("")).item, stderr: streams.stderr.join("") }
}

beforeEach(() => {
  telegram.loggedOut = []
})

describe("a run with only the config folder moved (SEC-189)", () => {
  it("**session end keeps the owner's login**: no log out on Telegram, the session file stays", async () => {
    const path = ownersSession()
    const env = moved("CONFIG")
    expect(usesOwnersSession(PROFILE, env)).toBe(true)

    const { code, item, stderr } = await end(env)

    expect(code).toBe(0)
    expect(item).toEqual({ profile: PROFILE, ended: false, kept: "owners-sign-in" })
    expect(stderr).toContain("owner's own folders")
    expect(telegram.loggedOut).toEqual([])
    expect(existsSync(path) && existsSync(`${path}-wal`)).toBe(true)
  })

  it("**account removal keeps the owner's session file and bots folder** and logs nothing out", async () => {
    const path = ownersSession()
    const env = moved("CONFIG")

    const signed = await TELEGRAM_REMOVAL.signOut(PROFILE, { env, mayRevoke: false })

    expect(signed).toEqual({ revoked: false, removed: [] })
    expect(telegram.loggedOut).toEqual([])
    expect(existsSync(path)).toBe(true)
    expect(TELEGRAM_REMOVAL.stateFiles?.(PROFILE, { env, mayRevoke: false })).toEqual([])
  })
})

describe("a run whose state folder is moved too", () => {
  it("**session end forgets the run's own session without logging out**, and leaves the owner's file alone", async () => {
    const owners = ownersSession()
    const env = moved("CONFIG", "STATE")
    const own = sessionFile(PROFILE, env)
    mkdirSync(dirname(own), { recursive: true })
    writeFileSync(own, "synthetic")
    expect(usesOwnersSession(PROFILE, env)).toBe(false)

    const loggedOut: boolean[] = []
    const streams = captureStreams()
    const code = await run([PROFILE, "session", "end", "--json"], {
      streams,
      tty: false,
      env,
      adapter: () => scripted({ logout: async () => void loggedOut.push(true) }),
    })

    expect(code).toBe(0)
    expect(JSON.parse(streams.stdout.join("")).item).toEqual({ profile: PROFILE, ended: true, logged_out: false })
    expect(streams.stderr.join("")).toContain("list of sessions")
    expect(loggedOut).toEqual([])
    expect(existsSync(own)).toBe(false)
    expect(existsSync(owners)).toBe(true)
  })
})
