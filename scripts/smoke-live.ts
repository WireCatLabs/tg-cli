/**
 * Every write once against the real Telegram, in Saved Messages only, before a release is announced.
 * Run by hand, never by CI, and only with the owner's yes each time.
 *
 *   pnpm smoke:live
 *
 * It drives `bin/tg`, the checkout's own build with its own profile in `.tg/` — never the installed
 * `tg`, whose store a branch build could migrate. Each command reuses the saved session; a
 * `session start` would be a new device on the owner's account. From an agent inside this
 * repository's sandbox `bin/tg` has no network when a script starts it: run this from a terminal.
 *
 * Printed: one line per step, `ok` or `FAIL` with the error code the command gave. Never a message
 * of the owner's, a name or an id. Everything it creates is deleted at the end.
 */
import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const SAVED = "me"
const stamp = new Date().toISOString()
// Telegram answers a burst of writes with FLOOD_WAIT; a person's pace costs half a minute.
const PACE_MS = 2000

type Answer = { message?: { id?: unknown }; id?: unknown; items?: { id?: unknown; text?: unknown }[] }

const tg = (...args: string[]) => {
  const done = spawnSync(join(root, "bin", "tg"), [...args, "--json"], { encoding: "utf8", timeout: 120_000 })
  if (done.status === 0) return JSON.parse(done.stdout) as Answer
  let code = `exit ${done.status ?? done.signal}`
  try {
    code = (JSON.parse(done.stderr) as { error?: { code?: string } }).error?.code ?? code
  } catch {}
  throw new Error(code)
}

const created: string[] = []
const failures: string[] = []

const step = async <T>(label: string, run: () => T | Promise<T>): Promise<T | undefined> => {
  await new Promise((done) => setTimeout(done, PACE_MS))
  try {
    const result = await run()
    console.log(`ok    ${label}`)
    return result
  } catch (error) {
    console.log(`FAIL  ${label}: ${error instanceof Error ? error.message : String(error)}`)
    failures.push(label)
    return undefined
  }
}

const keep = (answer: Answer | undefined) => {
  const id = answer?.message?.id ?? answer?.id
  if (id === undefined) return undefined
  created.push(String(id))
  return String(id)
}

const files = mkdtempSync(join(tmpdir(), "tg-smoke-"))
const pixel = join(files, "pixel.png")
writeFileSync(
  pixel,
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  ),
)
const note = join(files, "note.txt")
writeFileSync(note, `tg-cli smoke ${stamp}\n`)

try {
  if (!(await step("account show", () => tg("account", "show")))) {
    console.log("\nno session in this checkout — run `bin/tg session start` or seed the worktree first")
    process.exit(2)
  }

  const text = keep(await step("send text", () => tg("messages", "send", SAVED, `tg-cli smoke ${stamp}`)))
  keep(await step("send with markdown", () => tg("messages", "send", SAVED, "tg-cli smoke **bold** _italic_", "--md")))
  if (text) {
    keep(await step("reply", () => tg("messages", "send", SAVED, "tg-cli smoke reply", "--reply-to", text)))
    await step("edit", () => tg("messages", "edit", SAVED, text, `tg-cli smoke ${stamp} (edited)`))
    await step("react", () => tg("reactions", "add", SAVED, text, "👍"))
    await step("unreact", () => tg("reactions", "remove", SAVED, text))
    keep(await step("forward", () => tg("messages", "forward", SAVED, text, "--to", SAVED)))
    await step("pin", () => tg("messages", "pin", SAVED, text))
    await step("unpin", () => tg("messages", "unpin", SAVED, text))
  }
  keep(await step("send a photo", () => tg("messages", "send", SAVED, "", "--photo", pixel)))
  keep(await step("send a file", () => tg("messages", "send", SAVED, "", "--file", note)))

  const poll = keep(await step("create a poll", () => tg("polls", "create", SAVED, "tg-cli smoke poll", "one", "two")))
  if (poll) await step("close the poll", () => tg("polls", "close", SAVED, poll))

  const scheduled = await step("schedule a send", () =>
    tg("messages", "send", SAVED, "tg-cli smoke scheduled", "--at", "1m"),
  )
  if (scheduled) {
    await step("list the scheduled", () => {
      if (!tg("messages", "scheduled", SAVED).items?.length) throw new Error("the queue is empty")
    })
    // Sent, it is a new message with a new id, so the queued id would delete nothing.
    await step("wait for the scheduled send to fire (≤ 3 min)", async () => {
      const deadline = Date.now() + 180_000
      while (Date.now() < deadline) {
        await new Promise((done) => setTimeout(done, 15_000))
        const fired = tg("messages", "list", SAVED, "--after-time", stamp, "--limit", "50").items ?? []
        const found = fired.filter((message) => message.text === "tg-cli smoke scheduled")
        if (found.length > 0) {
          for (const message of found) created.push(String(message.id))
          return
        }
      }
      throw new Error("still queued after 3 minutes — cancel it in the Telegram app")
    })
  }

  for (let start = 0; start < created.length; start += 10) {
    const batch = created.slice(start, start + 10)
    await step(`delete ${batch.length} test messages`, () =>
      tg("messages", "delete", SAVED, ...batch, "--allow-dangerous"),
    )
  }

  // A pin leaves a service message behind in a private chat; count what is left, never show it.
  await step("nothing left since the start", () => {
    const left = (tg("messages", "list", SAVED, "--after-time", stamp, "--limit", "50").items ?? []).filter(
      (message) => !created.includes(String(message.id)),
    )
    if (left.length > 0) throw new Error(`${left.length} message(s) since the start — look in Saved Messages`)
  })
} finally {
  rmSync(files, { recursive: true, force: true })
}

console.log(failures.length === 0 ? "\nall steps passed" : `\n${failures.length} failed: ${failures.join("; ")}`)
process.exit(failures.length === 0 ? 0 : 1)
