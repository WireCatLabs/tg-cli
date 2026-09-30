import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams } from "@leemour/cli-core"
import { describe, expect, it } from "vitest"
import { run } from "./program.js"
import { type UpdateEnvironment, updateNotice } from "./update.js"

const PNPM =
  "/home/a/.local/share/pnpm/store/v11/links/@leemour/tg-cli/0.1.0/x/node_modules/@leemour/tg-cli/dist/update.js"

const setup = (latest: string | Error = "99.0.0") => {
  const home = mkdtempSync(join(process.env.TG_TEST_SANDBOX as string, "update-"))
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    TG_NO_UPDATE_CHECK: undefined,
    CI: undefined,
    TG_STATE_DIR: join(home, "state"),
    TG_CONFIG_DIR: join(home, "config"),
  }
  let asked = 0
  let now = 1_000_000
  const environment: UpdateEnvironment = {
    scriptPath: PNPM,
    stderrIsTTY: true,
    now: () => now,
    fetch: async () => {
      asked += 1
      if (latest instanceof Error) throw latest
      return new Response(JSON.stringify({ version: latest }))
    },
    spawn: () => {
      throw new Error("a notice never installs anything")
    },
  }
  const notice = (argv = ["chats", "list"], tty = true) => updateNotice(argv, { tty, environment, env })
  return { env, environment, notice, asked: () => asked, later: (ms: number) => (now += ms) }
}

describe("the daily line about a newer version", () => {
  it("tells a person at a terminal, on stderr, after the command", async () => {
    const { env, environment } = setup()
    const streams = captureStreams()
    const code = await run(["commands"], { streams, tty: true, env, update: environment })
    expect(code).toBe(0)
    expect(streams.stderr.at(-1)).toMatch(/tg 99\.0\.0 is out — you have .+ `tg upgrade` installs it/)
    expect(streams.stdout.join("\n")).not.toContain("99.0.0")
  })

  it("tells nobody reading JSON, a pipe, --quiet or CI — and then does not ask npm at all", async () => {
    const { notice, asked, env } = setup()
    expect(await notice(["chats", "list", "--json"])).toBeUndefined()
    expect(await notice(["chats", "list"], false)).toBeUndefined()
    expect(await notice(["chats", "list", "--quiet"])).toBeUndefined()
    env.CI = "true"
    expect(await notice()).toBeUndefined()
    env.CI = undefined
    env.TG_NO_UPDATE_CHECK = "1"
    expect(await notice()).toBeUndefined()
    expect(asked()).toBe(0)
  })

  it("asks npm at most once a day, and keeps telling from what it last heard", async () => {
    const { notice, asked, later } = setup()
    await notice()
    later(60 * 60 * 1000)
    expect(await notice()).toMatch(/99\.0\.0/)
    expect(asked()).toBe(1)
    later(24 * 60 * 60 * 1000)
    await notice()
    expect(asked()).toBe(2)
  })

  it("says nothing, and fails nothing, when npm cannot be reached", async () => {
    expect(await setup(new Error("offline")).notice()).toBeUndefined()
  })

  it("says nothing when the version in use is the newest", async () => {
    expect(await setup("0.0.1").notice()).toBeUndefined()
  })

  it("stays off when the defaults say updateCheck: false", async () => {
    const { notice, env, asked } = setup()
    mkdirSync(env.TG_CONFIG_DIR as string, { recursive: true })
    writeFileSync(
      join(env.TG_CONFIG_DIR as string, "config.json"),
      JSON.stringify({ defaults: { updateCheck: false } }),
    )
    expect(await notice()).toBeUndefined()
    expect(asked()).toBe(0)
  })

  it("never runs for a Tab or for tg upgrade itself", async () => {
    const { notice, asked } = setup()
    expect(await notice(["complete", "--", "ch"])).toBeUndefined()
    expect(await notice(["upgrade"])).toBeUndefined()
    expect(await notice(["--timeout", "30s", "upgrade"])).toBeUndefined()
    expect(asked()).toBe(0)
  })
})
