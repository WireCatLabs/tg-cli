import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { afterEach, describe, expect, it } from "vitest"
import { run } from "./program.js"

describe("tg --version", () => {
  const before = process.env.TG_TEST_ARGV_LOG
  afterEach(() => {
    if (before === undefined) delete process.env.TG_TEST_ARGV_LOG
    else process.env.TG_TEST_ARGV_LOG = before
  })

  it("writes one line to the argv log", async () => {
    const log = join(mkdtempSync(join(tmpdir(), "tg-argv-")), "argv.jsonl")
    process.env.TG_TEST_ARGV_LOG = log
    expect(await run(["--version"], { streams: captureStreams(), tty: false })).toBe(0)
    expect(readFileSync(log, "utf8").trim().split("\n")).toHaveLength(1)
  })
})
