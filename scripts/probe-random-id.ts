/**
 * Does Telegram send one message or two when the same `random_id` arrives twice — the second time
 * over a new connection, which is what a retry after a lost answer looks like? max-cli measured the
 * same for MAX's `cid` before it allowed a retry; this is that measurement for Telegram.
 *
 * Sends only to Saved Messages, a fixed probe text, and prints ids and error names — never a
 * session, a credential or a message someone else wrote.
 *
 *   pnpm probe:random-id
 */
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
process.env.TG_CONFIG_DIR ??= join(root, ".tg/config")
process.env.TG_STATE_DIR ??= join(root, ".tg/state")
process.env.TG_CACHE_DIR ??= join(root, ".tg/cache")

const { TelegramAdapter } = await import("../dist/telegram/adapter.js")
const { apiCredentials } = await import("../dist/telegram/credentials.js")
const { profileFrom, sessionFile } = await import("../dist/paths.js")

const profile = profileFrom()
const credentials = apiCredentials({ profile }).read()
if (!credentials) {
  console.error("no app credentials — run bin/tg session start first")
  process.exit(4)
}

const open = () => TelegramAdapter.open({ credentials, sessionPath: sessionFile(profile) })
const text = `tg-cli probe: random_id deduplication, ${new Date().toISOString()}`

const attempt = async (sendId?: string) => {
  const telegram = await open()
  try {
    const sent = await telegram.send("me", text, sendId === undefined ? {} : { sendId })
    return { ok: true, sendId: sent.sendId, messageId: sent.message.id }
  } catch (error) {
    const { code, details } = error as { code?: string; details?: { providerError?: string } }
    return { ok: false, code, providerError: details?.providerError ?? null, name: (error as Error).name }
  } finally {
    await telegram.close()
  }
}

const first = await attempt()
if (!first.ok || !("sendId" in first)) {
  console.log(JSON.stringify({ first }, null, 2))
  process.exit(1)
}
const second = await attempt(first.sendId)

const reader = await open()
let copies: number
try {
  const recent = await reader.history("me", { limit: 10 })
  copies = recent.items.filter((message) => message.text === text).length
} finally {
  await reader.close()
}

console.log(JSON.stringify({ first, second, copiesInSavedMessages: copies }, null, 2))
