import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { captureStreams } from "@wirecat/cli-core"
import { describe, expect, it, onTestFinished } from "vitest"
import { run } from "../program.js"
import type { UpdateEnvironment } from "../update.js"

const PNPM =
  "/home/a/.local/share/pnpm/store/v11/links/@wirecat/tg-cli/0.1.0/x/node_modules/@wirecat/tg-cli/dist/update.js"

const update = async (
  argv: string[],
  { latest = "99.0.0" as string | null, scriptPath = PNPM, exit = 0, restartExit = 0 } = {},
) => {
  const ran: string[][] = []
  const environment: UpdateEnvironment = {
    scriptPath,
    fetch: async () =>
      latest === null ? new Response("", { status: 503 }) : new Response(JSON.stringify({ version: latest })),
    spawn: (command) => {
      ran.push(command)
      return command.includes("restart") ? restartExit : exit
    },
  }
  const streams = captureStreams()
  const code = await run(["upgrade", ...argv, "--json"], { streams, tty: false, update: environment })
  const [out] = streams.stdout
  return { code, ran, result: out ? JSON.parse(out) : undefined, stderr: streams.stderr.join("\n") }
}

describe("tg upgrade", () => {
  it("--check says what it would run and runs nothing", async () => {
    const { code, ran, result } = await update(["--check"])
    expect(code).toBe(0)
    expect(ran).toEqual([])
    expect(result).toMatchObject({
      latest: "99.0.0",
      newer: true,
      installer: "pnpm",
      command: "pnpm add -g @wirecat/tg-cli@latest",
      updated: false,
      restarted: [],
    })
  })

  it("runs the package manager that installed tg, and says it did", async () => {
    const { code, ran, result } = await update([])
    expect(code).toBe(0)
    expect(ran).toEqual([["pnpm", "add", "-g", "@wirecat/tg-cli@latest"]])
    expect(result).toMatchObject({ updated: true })
  })

  it("runs nothing when this is already the newest", async () => {
    const { ran, result } = await update([], { latest: "0.0.1" })
    expect(ran).toEqual([])
    expect(result).toMatchObject({ newer: false, updated: false })
  })

  it("runs nothing when npm does not answer", async () => {
    const { code, ran, result, stderr } = await update([], { latest: null })
    expect(code).toBe(0)
    expect(ran).toEqual([])
    expect(result).toMatchObject({ latest: null, updated: false })
    expect(stderr).toContain("npm did not answer")
  })

  it("runs nothing for a checkout, and says what to do instead", async () => {
    const { ran, result, stderr } = await update([], { scriptPath: "/home/a/Projects/tg-cli/dist/update.js" })
    expect(ran).toEqual([])
    expect(result).toMatchObject({ installer: "checkout", command: null, updated: false })
    expect(stderr).toContain("git pull")
  })

  it("fails with the package manager's exit code named, and does not claim an update", async () => {
    const { code, result, stderr } = await update([], { exit: 7 })
    expect(code).not.toBe(0)
    expect(result).toBeUndefined()
    expect(stderr).toContain("exited with 7")
  })
})

describe("tg upgrade and a running server", () => {
  const serving = (profile: string) => {
    const lock = join(process.env.TG_STATE_DIR ?? "", "serve", `${profile}.lock`)
    mkdirSync(dirname(lock), { recursive: true })
    writeFileSync(lock, JSON.stringify({ pid: process.pid, startedAt: "2026-09-29T10:00:00.000Z" }))
    onTestFinished(() => rmSync(lock, { force: true }))
  }

  it("**restarts each running server with the new tg**, so it stops running the old code", async () => {
    serving("work")
    const { ran, result } = await update([])

    expect(ran[1]).toEqual([process.execPath, expect.stringMatching(/bin[/\\]tg\.js$/), "work", "server", "restart"])
    expect(result).toMatchObject({ updated: true, restarted: ["work"] })
  })

  it("names a server it could not restart, and still reports the update", async () => {
    serving("work")
    const { code, result, stderr } = await update([], { restartExit: 2 })

    expect(code).toBe(0)
    expect(result).toMatchObject({ updated: true, restarted: [] })
    expect(stderr).toContain("`tg work server restart`")
  })

  it("ignores lock files whose names are not usable profiles", async () => {
    serving("work")
    serving("bad&name")
    const { ran, result } = await update([])
    expect(ran).toHaveLength(2)
    expect(result.restarted).toEqual(["work"])
    expect(JSON.stringify(ran)).not.toContain("bad&name")
  })
})
