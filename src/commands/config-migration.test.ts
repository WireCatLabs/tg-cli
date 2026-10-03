import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { tg } from "../testing/scripted.js"

it("mounts shared migration: previews without writing, applies explicitly, never connects", async () => {
  const directory = mkdtempSync(join(tmpdir(), "tg-config-migrate-"))
  const path = join(directory, "config.json")
  const original = JSON.stringify({ defaults: { readOnly: true, limit: 7 }, profiles: {} })
  writeFileSync(path, original)
  const environment = {
    env: { ...process.env, TG_CONFIG_DIR: directory },
    adapter: () => {
      throw new Error("configuration migration connected")
    },
  }
  const preview = await tg(["config", "migrate", "--dry-run", "--json"], environment)
  expect(preview.code).toBe(0)
  expect(JSON.parse(preview.stdout[0] ?? "")).toMatchObject({ changed: true, dryRun: true })
  expect(readFileSync(path, "utf8")).toBe(original)
  const applied = await tg(["config", "migrate", "--json"], environment)
  expect(applied.code).toBe(0)
  expect(JSON.parse(applied.stdout[0] ?? "")).toMatchObject({ changed: true, dryRun: false })
  const migrated = JSON.parse(readFileSync(path, "utf8"))
  expect(migrated.defaults.limit).toBe(7)
  expect(migrated.defaults.readOnly).toBeUndefined()
  expect(migrated.defaults.permissions.messages).toBe("readonly")
  const second = await tg(["config", "migrate", "--json"], environment)
  expect(second.code).toBe(0)
  expect(JSON.parse(second.stdout[0] ?? "")).toMatchObject({ changed: false })
})
