/**
 * Does Telegram tolerate two connections on one login at once — what `tg serve` next to a one-shot
 * command or `tg mcp` is? Its docs say no: a second main session on one auth key, unless the server
 * grants `tmp_sessions` > 1, ends in AUTH_KEY_DUPLICATED and a revoked login
 * (docs/plans/2026-10-04-session-sharing.md).
 *
 * **Test account B (`tgtest`) only** — the profile is fixed here, so the owner's login cannot be
 * named. Uses the main checkout's logins, as bin/tg-live does. Prints counts and Telegram's error
 * names, never a message, a name or an id.
 *
 *   pnpm probe:sessions            phase 1: one connection, prints tmp_sessions from help.getConfig
 *   pnpm probe:sessions-parallel   phase 2: a listening connection plus one-shot connections beside
 *                                  it for 90 s — MAY REVOKE THE tgtest LOGIN; log it in again after
 */
import { execFileSync } from "node:child_process"
import { join, resolve } from "node:path"

const PROFILE = "tgtest"
const PARALLEL_MS = 90_000
const ONE_SHOT_EVERY_MS = 5_000

const root = resolve(import.meta.dirname, "..")
const main = resolve(
  execFileSync("git", ["-C", root, "rev-parse", "--git-common-dir"], { encoding: "utf8" }).trim(),
  "..",
)
process.env.TG_CONFIG_DIR = join(main, ".tg/config")
process.env.TG_STATE_DIR = join(main, ".tg/state")
process.env.TG_CACHE_DIR = join(root, ".tg/cache")
process.env.TG_PROFILE = PROFILE

const { TelegramClient } = await import("@mtcute/node")
const { TelegramAdapter } = await import("../dist/telegram/adapter.js")
const { openSessionStorage } = await import("../dist/telegram/storage.js")
const { apiCredentials } = await import("../dist/telegram/credentials.js")
const { sessionFile } = await import("../dist/paths.js")

const credentials = apiCredentials({ profile: PROFILE }).read()
if (!credentials) {
  console.error(`no app credentials for ${PROFILE} — log B in with bin/tg -p ${PROFILE} session start in ${main}`)
  process.exit(4)
}
const sessionPath = sessionFile(PROFILE)
const quiet = () => {}

const errorName = (error: unknown) => {
  const { code, details } = error as { code?: string; details?: { providerError?: string } }
  return details?.providerError ?? code ?? (error as Error).name
}

const tmpSessions = async () => {
  const client = new TelegramClient({
    apiId: credentials.id,
    apiHash: credentials.hash,
    storage: await openSessionStorage(sessionPath),
    disableUpdates: true,
    logLevel: 0,
  })
  client.log.mgr.handler = quiet
  try {
    await client.connect()
    const config = await client.call({ _: "help.getConfig" })
    return config.tmpSessions ?? null
  } finally {
    await client.destroy()
  }
}

const loginSurvives = async () => {
  const telegram = await TelegramAdapter.open({ credentials, sessionPath, diagnostic: quiet })
  try {
    await telegram.me()
    return { survived: true }
  } catch (error) {
    return { survived: false, error: errorName(error) }
  } finally {
    await telegram.close()
  }
}

const parallel = async () => {
  const errors: Record<string, number> = {}
  const note = (error: unknown) => {
    const name = errorName(error)
    errors[name] = (errors[name] ?? 0) + 1
  }
  const stop = new AbortController()
  const listener = await TelegramAdapter.open({ credentials, sessionPath, listen: true, diagnostic: quiet })
  const listening = listener.watch(quiet, stop.signal).catch(note)

  let oneShots = 0
  const until = Date.now() + PARALLEL_MS
  while (Date.now() < until) {
    const command = await TelegramAdapter.open({ credentials, sessionPath, diagnostic: quiet })
    try {
      await command.me()
      oneShots++
    } catch (error) {
      note(error)
    } finally {
      await command.close()
    }
    await new Promise((done) => setTimeout(done, ONE_SHOT_EVERY_MS))
  }
  stop.abort()
  await listening
  await listener.close()
  return { oneShots, errors }
}

const result: Record<string, unknown> = { profile: PROFILE, tmpSessions: await tmpSessions() }
if (process.argv.includes("--parallel")) {
  result.parallel = await parallel()
  result.after = await loginSurvives()
}
console.log(JSON.stringify(result, null, 2))
