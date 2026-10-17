import { tmpdir } from "node:os"
import { ARGV_LOG } from "./argv-log.js"

/**
 * tg's own part of the test setup. `@wirecat/cli-base/testing/setup` runs first and already gives each file a fresh
 * TMPDIR and HOME (the config, state, cache and store folders fall under it), a keyring that throws and no network.
 */
// Read before the keyring: exported in the shell, they would point the suite at a real app.
delete process.env.TG_API_ID
delete process.env.TG_API_HASH
delete process.env.TG_BOT_TOKEN
// No profile is assumed; tests run as `default`, and one that means "none named" passes its own env.
process.env.TG_PROFILE = "default"
delete process.env.TG_PROFILE_LOCK
delete process.env.TG_TIMEOUT
delete process.env.TG_PROXY
for (const key of Object.keys(process.env)) {
  if (/^TG_(MODELS|EMBEDDING|ANALYSIS)_/.test(key)) delete process.env[key]
}
// Unit tests use scripted adapters; request pacing must never introduce a real wait. One profile's pace file is
// shared by every test: paced, a file of tests would wait on each other's calls.
process.env.TG_REQUESTS_PER_MINUTE = "0"
// At a terminal the daily update check would otherwise ask npm from inside the suite.
process.env.TG_NO_UPDATE_CHECK = "1"
// Run by an agent, the suite would see the owner's skill copy under ~/.claude and print a hint to install it.
delete process.env.CLAUDECODE
delete process.env.AI_AGENT
process.env.TG_TEST_SANDBOX = tmpdir()
process.env.TG_TEST_ARGV_LOG = ARGV_LOG
