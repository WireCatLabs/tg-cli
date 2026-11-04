import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { tg } from "../testing/scripted.js"

it("config migrate fills the missing settings without connecting, keeps the owner's, and --dry-run writes nothing", async () => {
  const directory = mkdtempSync(join(tmpdir(), "tg-config-migrate-"))
  const path = join(directory, "config.json")
  const original = JSON.stringify({ defaults: { permissions: { messages: "readonly" }, limit: 7 }, profiles: {} })
  writeFileSync(path, original)
  const run = (...args: string[]) =>
    tg(["config", "migrate", ...args, "--json"], {
      env: { ...process.env, TG_CONFIG_DIR: directory },
      adapter: () => {
        throw new Error("configuration migration connected")
      },
    })

  expect((await run("--dry-run")).code).toBe(0)
  expect(readFileSync(path, "utf8")).toBe(original)

  expect((await run()).code).toBe(0)
  const saved = JSON.parse(readFileSync(path, "utf8"))
  expect(saved.defaults).toMatchObject({ permissions: { messages: "readonly" }, limit: 7, sends_per_hour: 30 })
  expect(Object.keys(saved.defaults).slice(0, 2)).toEqual(["permissions", "limit"])
  const filled = readFileSync(path, "utf8")
  expect((await run()).code).toBe(0)
  expect(readFileSync(path, "utf8")).toBe(filled)
})
