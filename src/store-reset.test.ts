import { mkdtempSync, readdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { captureStreams } from "@wirecat/cli-base"
import { openStore } from "@wirecat/cli-core/store"
import { describe, expect, it } from "vitest"
import { run } from "./program.js"

describe("offline store reset", () => {
  it("backs up by default, requires confirmation, and supports explicit no-backup without connecting", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-reset-")), "wirecat.db")
    const env = { ...process.env, MESSAGING_STORE: path }
    const key = { provider: "telegram" as const, account: "synthetic" }
    const original = await openStore({ path })
    await original.accounts.saveAccount(key, { name: null })
    await original.sync.setSyncState(key, "fixture", "retained-marker")
    await original.close()
    const call = async (args: string[]) => {
      const streams = captureStreams()
      const code = await run(args, {
        env,
        streams,
        tty: false,
        adapter: () => {
          throw new Error("reset must stay offline")
        },
      })
      return { code, stdout: streams.stdout, answer: JSON.parse(streams.stdout[0] ?? "null") }
    }
    const preview = await call(["store", "reset", "--dry-run", "--json"])
    expect(preview.code).toBe(0)
    expect(preview.answer.item).toMatchObject({ path, reset: false, dry_run: true, backup_first: true })
    const refused = await call(["store", "reset", "--json"])
    expect(refused.code).not.toBe(0)
    const untouched = await openStore({ path })
    expect(await untouched.sync.syncState(key, "fixture")).toMatchObject({ value: "retained-marker" })
    await untouched.close()
    const reset = await call(["store", "reset", "--yes", "--json"])
    expect(reset.code).toBe(0)
    expect(reset.answer.item).toMatchObject({ path, reset: true, backup: expect.any(String) })
    const backup = await openStore({ path: reset.answer.item.backup })
    expect(await backup.sync.syncState(key, "fixture")).toMatchObject({ value: "retained-marker" })
    await backup.close()
    const cleared = await openStore({ path })
    expect(await cleared.sync.syncState(key, "fixture")).toBeUndefined()
    await cleared.close()
    const before = readdirSync(dirname(path)).filter((name) => name.includes(".backup-"))
    const second = await call(["store", "reset", "--no-backup", "--yes", "--json"])
    expect(second.code).toBe(0)
    expect(second.answer.item).toMatchObject({ reset: true, backup: null, backed_up: null })
    expect(readdirSync(dirname(path)).filter((name) => name.includes(".backup-"))).toEqual(before)
  })
})
