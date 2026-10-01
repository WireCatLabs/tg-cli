/**
 * The second runtime, actually executed against the built command, as max-cli's `scripts/smoke.ts`.
 * Bun cannot run the Vitest suite, and the session storage picks a different SQLite module under
 * each runtime, so a type check proves nothing about it.
 *
 *   pnpm build && pnpm smoke:bun
 */
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { NodePlatform } from "@mtcute/node"
import { LogManager } from "@mtcute/node/utils.js"
import { openSessionStorage } from "../dist/telegram/storage.js"

const runtime = typeof (globalThis as { Bun?: unknown }).Bun === "undefined" ? "node" : "bun"
const failures: string[] = []
const check = (what: string, condition: boolean) => {
  if (!condition) failures.push(what)
}

// Every command below gets directories of its own: they also move the keyring entry, so nothing
// here can read the owner's session, app credentials or message store.
const isolated = mkdtempSync(join(tmpdir(), "tg-smoke-"))
const tg = (...args: string[]) =>
  spawnSync(process.execPath, ["dist/bin/tg.js", ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      TG_CONFIG_DIR: join(isolated, "config"),
      TG_STATE_DIR: join(isolated, "state"),
      TG_CACHE_DIR: join(isolated, "cache"),
      MESSAGING_STORE: join(isolated, "messages.db"),
      TG_NO_UPDATE_CHECK: "1",
      TG_API_ID: "",
      TG_API_HASH: "",
      TG_PROFILE: "",
    },
  })

const version = tg("--version")
check("--version exits cleanly", version.status === 0)
check("--version prints a version on stdout", /^\d+\.\d+\.\d+$/.test(version.stdout.trim()))
check("--version says nothing on stderr", version.stderr === "")

check("--help names the command", tg("--help").stdout.includes("Usage: tg"))

const bad = tg("--nonsense")
check("an unknown option fails", bad.status !== 0)
check("an unknown option keeps stdout clean", bad.stdout === "")
check("an unknown option explains itself on stderr", bad.stderr.includes("unknown option"))

const skill = tg("skill", "show")
check("skill show prints the SKILL.md the package ships", skill.status === 0 && skill.stdout.startsWith("---"))

const doctor = tg("doctor", "--json")
check("doctor answers one JSON value with no login", doctor.stdout !== "" && JSON.parse(doctor.stdout) !== null)

// Every failure is kept as a run, so the unknown option above left one: the run directory and its
// atomic writes work under this runtime.
const runs = tg("runs", "list", "--json")
const [kept] =
  runs.status === 0 ? (JSON.parse(runs.stdout) as { items: { runId: string; errorCode?: string }[] }).items : []
check("runs list finds the failure that was kept", kept?.errorCode === "validation_error")
check(
  "runs show answers with that run",
  JSON.parse(tg("runs", "show", kept?.runId ?? "", "--json").stdout || "{}").runId === kept?.runId,
)
check("doctor exits cleanly with no login", doctor.status === 0)

const offline = tg("chats", "list", "--offline", "--json")
check("an offline read with nothing recorded fails", offline.status !== 0)
check("and keeps stdout clean", offline.stdout === "")

const opened = async (path: string) => {
  const storage = await openSessionStorage(path)
  const platform = new NodePlatform()
  const log = new LogManager("smoke", platform)
  log.level = LogManager.OFF
  storage.driver.setup?.(log, platform)
  await storage.driver.load?.()
  return storage
}
const path = join(isolated, "smoke.session")
const key = new Uint8Array(256).map((_, index) => index)
const first = await opened(path)
first.authKeys.set(2, key)
await first.driver.save?.()
await first.driver.destroy?.()
const second = await opened(path)
check("the session storage keeps an auth key across a reopen", second.authKeys.get(2)?.[255] === 255)
await second.driver.destroy?.()

rmSync(isolated, { recursive: true, force: true })

if (failures.length > 0) {
  console.error(`tg-cli smoke FAILED under ${runtime}:`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log(`tg-cli smoke passed under ${runtime}`)
