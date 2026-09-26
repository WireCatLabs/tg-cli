import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterAll } from "vitest"

/**
 * **`pnpm test` must not be able to touch anything the owner has** — config, the keyring entry, the
 * Telegram session, or the shared message store. max-cli learnt this on 2026-09-22, when a test run
 * migrated the owner's real cache and lost its history. The same variables also scope the keyring
 * entry (cli-core `isolated`), so a test cannot overwrite the real app credentials either.
 */
const sandbox = mkdtempSync(join(process.platform === "darwin" ? "/tmp" : tmpdir(), "tg-test-"))

process.env.TG_CONFIG_DIR = join(sandbox, "config")
process.env.TG_STATE_DIR = join(sandbox, "state")
process.env.TG_CACHE_DIR = join(sandbox, "cache")
process.env.MESSAGING_STORE = join(sandbox, "messages.db")
process.env.TMPDIR = sandbox
// Read before the keyring: exported in the shell, they would point the suite at a real app.
delete process.env.TG_API_ID
delete process.env.TG_API_HASH
delete process.env.TG_PROFILE
process.env.TG_TEST_SANDBOX = sandbox

afterAll(() => rmSync(sandbox, { recursive: true, force: true }))
