import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { tg } from "../testing/scripted.js"

it("refuses the retired migration command without writing or connecting", async () => {
  const directory = mkdtempSync(join(tmpdir(), "tg-config-migrate-"))
  const path = join(directory, "config.json")
  const original = JSON.stringify({ defaults: { permissions: { messages: "readonly" }, limit: 7 }, profiles: {} })
  writeFileSync(path, original)
  const result = await tg(["config", "migrate", "--dry-run", "--json"], {
    env: { ...process.env, TG_CONFIG_DIR: directory },
    adapter: () => {
      throw new Error("configuration migration connected")
    },
  })
  expect(result.code).toBe(2)
  expect(result.stdout).toEqual([])
  expect(readFileSync(path, "utf8")).toBe(original)
})
