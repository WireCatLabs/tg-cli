/**
 * The spike's live criteria in one run, after `bin/tg session start`. Prints only what the report
 * needs — exit codes, counts, timings, whether ids are strings — never a chat title or a message,
 * because the output is pasted into a public document.
 *
 *   bin/tg-spike-live
 */
import { spawnSync } from "node:child_process"
import { statSync } from "node:fs"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const tg = join(root, "bin", "tg")

const call = (...args: string[]) => {
  const started = performance.now()
  const result = spawnSync(tg, args, { encoding: "utf8", timeout: 120_000 })
  const seconds = Number(((performance.now() - started) / 1000).toFixed(2))
  const lines = result.stdout.split("\n").filter(Boolean)
  let value: unknown
  try {
    value = lines.length === 1 ? JSON.parse(lines[0] ?? "") : undefined
  } catch {
    value = undefined
  }
  return { exit: result.status, seconds, stdoutLines: lines.length, stderrEmpty: result.stderr.trim() === "", value }
}

const idsAreStrings = (items: unknown): boolean =>
  Array.isArray(items) && items.every((item) => typeof (item as { id?: unknown }).id === "string")

const summary = (name: string, run: ReturnType<typeof call>) => {
  const items = (run.value as { items?: unknown[] } | undefined)?.items
  return {
    name,
    exit: run.exit,
    seconds: run.seconds,
    oneJsonValue: run.stdoutLines === 1 && run.value !== undefined,
    stderrEmpty: run.stderrEmpty,
    items: items?.length ?? null,
    idsAreStrings: items ? idsAreStrings(items) : null,
  }
}

const results: unknown[] = []
results.push(summary("account show", call("account", "show", "--json")))
results.push(summary("chats list", call("chats", "list", "--limit", "5", "--json")))
results.push(summary("messages list me", call("messages", "list", "me", "--limit", "5", "--json")))

const sent = call("messages", "send", "me", `tg-cli spike: live check ${new Date().toISOString()}`, "--json")
const sendId = (sent.value as { sendId?: unknown } | undefined)?.sendId
results.push({ ...summary("messages send me", sent), sendIdIsString: typeof sendId === "string" })

const session = join(root, ".tg", "state", "sessions", `${process.env.TG_PROFILE ?? "default"}.session`)
let sessionMode: string
try {
  sessionMode = (statSync(session).mode & 0o777).toString(8)
} catch {
  sessionMode = "missing"
}
results.push({ name: "session file mode", mode: sessionMode })

const probe = spawnSync("node", ["--experimental-strip-types", join(root, "scripts", "probe-random-id.ts")], {
  encoding: "utf8",
  timeout: 180_000,
})
let deduplication: unknown
try {
  deduplication = JSON.parse(probe.stdout)
} catch {
  deduplication = { exit: probe.status, unparsed: true }
}
results.push({ name: "random_id probe", result: deduplication })

console.log(JSON.stringify(results, null, 2))
