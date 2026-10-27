import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { listRuns, runsDirFor, startRun } from "@wirecat/cli-core/cli"
import { describe, expect, it } from "vitest"
import { TG } from "./app.js"
import type { Adapter } from "./commands/context.js"
import { run } from "./program.js"
import { scripted } from "./testing/scripted.js"

const BODY = "the door code is 4321"

const tg = async (argv: string[], overrides: Partial<Adapter> = {}) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
    adapter: () => scripted(overrides),
  })
  return { code, stdout: streams.stdout, stderr: streams.stderr }
}

const runsOf = (profile: string) => listRuns(runsDirFor(TG)).filter((one) => one.profile === profile)

const keptFor = (profile: string): string => {
  const dir = runsDirFor(TG)
  const runIds = runsOf(profile).map((one) => one.runId)
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => readFileSync(join(entry.parentPath, entry.name), "utf8"))
    .filter((text) => runIds.some((runId) => text.includes(runId)))
    .join("\n")
}

/** Since cli-core 0.439 a run keeps the command line as typed (`argv`, `record_input` turns it off); nothing else may. */
const besideArgv = (kept: string) => kept.replace(/"argv": ?\[[^\]]*\]/g, "")

describe("run records", () => {
  it("**keep a send's ids, and the chat's title and the text only as typed**", async () => {
    const { code, stdout } = await tg(["recorded", "messages", "send", "Valencia", BODY, "--record", "--json"])

    expect(code).toBe(0)
    expect(stdout).toHaveLength(1)
    expect(runsOf("recorded")[0]).toMatchObject({ command: "messages send", status: "success", requests: 2 })
    const kept = keptFor("recorded")
    expect(kept).toContain('"operation":"messages.send"')
    expect(kept).toContain('"chat":"-1001234567890"')
    expect(kept).toContain(JSON.stringify(["recorded", "messages", "send", "Valencia", BODY, "--record", "--json"]))
    expect(besideArgv(kept)).not.toContain("Valencia")
    expect(besideArgv(kept)).not.toContain(BODY)
  })

  it("keep a failed read with Telegram's name for the refusal", async () => {
    const { code } = await tg(["failing", "chats", "list"], {
      chats: async () => {
        throw new CliError("provider_error", "Telegram refused: CHAT_ADMIN_REQUIRED", {
          provider_error: "CHAT_ADMIN_REQUIRED",
        })
      },
    })

    expect(code).toBe(11)
    expect(runsOf("failing")).toHaveLength(1)
    expect(runsOf("failing")[0]).toMatchObject({
      status: "failed",
      errorCode: "provider_error",
      providerError: "CHAT_ADMIN_REQUIRED",
    })
    // Every run is recorded since cli-core 0.467, so a failure is no longer kept as the exception.
    expect(runsOf("failing")[0]).not.toHaveProperty("keptBecauseFailed")
  })

  it("keep a usage error, naming the command, with what was typed only as typed", async () => {
    const { code } = await tg(["usage", "messages", "send", "Valencia", BODY, "--no-such-flag"])

    expect(code).not.toBe(0)
    expect(runsOf("usage")).toHaveLength(1)
    expect(runsOf("usage")[0]).toMatchObject({ command: "messages send", errorCode: "validation_error" })
    expect(besideArgv(keptFor("usage"))).not.toContain(BODY)
  })

  it("are listed by `tg runs list` without it starting a run of its own", async () => {
    await tg(["listed", "account", "show", "--record"])
    const before = listRuns(runsDirFor(TG)).length

    const { code, stdout } = await tg(["runs", "list", "--json"])

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "").items.some((one: { profile: string }) => one.profile === "listed")).toBe(true)
    expect(listRuns(runsDirFor(TG))).toHaveLength(before)
  })
  it("searches partial failure IDs with filters without connecting or recording itself", async () => {
    const dir = runsDirFor(TG)
    const recorded = startRun({
      runsDir: dir,
      profile: "search-fixture",
      command: "messages download",
      cliVersion: TG.version,
      service: TG.command,
    })
    recorded.logger.info({
      event: "response",
      operation: "messages.download",
      errorCode: "rate_limited",
      ids: { chat: "50" },
    })
    await recorded.finish("partial", {
      partial: { failed: 1, failures: [{ id: "50", stage: "download", errorCode: "rate_limited" }] },
    })
    const before = listRuns(dir).length
    const { code, stdout, stderr } = await tg([
      "search",
      "runs",
      "50",
      "status:partial",
      "error_code:rate_limited",
      "operation:messages.download",
      "profile:search-fixture",
      "started_at>=2020-01-01",
      "--limit",
      "1",
      "--page",
      "1",
      "--json",
    ])
    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "").items).toMatchObject([
      { profile: "search-fixture", status: "partial", partial: { failed: 1 } },
    ])
    expect(stderr).toEqual([])
    expect(listRuns(dir)).toHaveLength(before)
  })

  it("**--debug adds the failure's record** as a second line after the error object", async () => {
    const { code, stdout, stderr } = await tg(["runs", "show", "no-such-run", "--json", "--debug"])

    expect(code).not.toBe(0)
    expect(stdout).toEqual([])
    const [object, record] = stderr
      .join("\n")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    expect(object.error).toMatchObject({ code: "not_found" })
    expect(record).toMatchObject({ severity: "error", command: "runs show", resource: { service: "tg" } })
  })

  it("**--problems** is accepted on a run that is not there and still says so", async () => {
    const { code, stdout } = await tg(["runs", "show", "no-such-run", "--problems", "--json"])

    expect(code).not.toBe(0)
    expect(stdout).toEqual([])
  })
})
