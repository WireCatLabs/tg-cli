/**
 * Gives a worktree the owner's Telegram login by copying it from the main checkout's `.tg/`, as
 * max-cli's `scripts/seed-worktree.ts` does (its OPS-18).
 *
 *   node scripts/seed-worktree.ts <main checkout> <worktree> [--force]    # bin/lane runs it
 *
 * `bin/tg` keeps a checkout's state in its own `.tg/`, and those variables also move the keyring
 * entry, so a worktree would otherwise need `session start` — a new device on the real account.
 * Copied: the session files, the remembered accounts and profiles. Not copied: the message store (a
 * branch build may migrate it), runs, locks, the send journal and the inbox point.
 *
 * App credentials go keyring to keyring inside this process: never printed, never in argv or a
 * child's environment.
 */
import { chmodSync, copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Credentials } from "@wirecat/cli-core"

const SERVICE = "tg-cli"
const COPIED = ["sessions", "accounts", "profiles"]

const copyDirectory = (from: string, to: string): void => {
  mkdirSync(to, { recursive: true, mode: 0o700 })
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    copyFileSync(join(from, entry.name), join(to, entry.name))
    chmodSync(join(to, entry.name), statSync(join(from, entry.name)).mode & 0o777)
  }
}

const credentialsIn = (config: string) => new Credentials({ configDir: config, service: SERVICE, isolated: true })

// Absolute, because the keyring entry is keyed by the config path and bin/tg reads it by the absolute one.
export const seed = (main: string, worktree: string, force = false): string => {
  const from = join(resolve(main), ".tg")
  const to = join(resolve(worktree), ".tg")
  if (existsSync(join(to, "state", "sessions")) && !force) return "already seeded (--force copies again)"
  if (!existsSync(join(from, "state", "sessions"))) return `no login in ${from} — run bin/tg session start there first`

  for (const directory of COPIED) {
    const source = join(from, "state", directory)
    if (existsSync(source)) copyDirectory(source, join(to, "state", directory))
  }
  const profiles = readdirSync(join(from, "state", "sessions"))
    .filter((file) => file.endsWith(".session"))
    .map((file) => file.slice(0, -".session".length))
  const source = credentialsIn(join(from, "config"))
  const target = credentialsIn(join(to, "config"))
  const moved = profiles.filter((profile) => {
    const stored = source.read(`${profile}:api`)
    if (!stored) return false
    target.write(`${profile}:api`, stored.secret)
    return true
  })
  return `copied the login of profiles: ${profiles.join(", ") || "none"}; app credentials for: ${moved.join(", ") || "none"}`
}

/** Takes a worktree's copies of the app credentials out of the keyring, before the worktree goes. */
export const unseed = (relativeOrAbsolute: string): string => {
  const worktree = resolve(relativeOrAbsolute)
  const sessions = join(worktree, ".tg", "state", "sessions")
  const profiles = existsSync(sessions)
    ? readdirSync(sessions)
        .filter((file) => file.endsWith(".session"))
        .map((file) => file.slice(0, -".session".length))
    : []
  const target = credentialsIn(join(worktree, ".tg", "config"))
  const removed = profiles.filter((profile) => target.remove(`${profile}:api`).length > 0)
  return `removed the copied app credentials of profiles: ${removed.join(", ") || "none"}`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const paths = process.argv.slice(2).filter((word) => !word.startsWith("--"))
  const [main, worktree] = paths
  if (process.argv.includes("--remove")) {
    // `<main> <worktree> --remove` used to unseed the first path: the main checkout lost its app keys (BUG-173).
    if (paths.length !== 1) {
      process.stderr.write("--remove takes the worktree alone: node scripts/seed-worktree.ts <worktree> --remove\n")
      process.exit(2)
    }
    process.stderr.write(`${unseed(paths[0] as string)}\n`)
  } else if (!main || !worktree) {
    process.stderr.write(
      "usage: node scripts/seed-worktree.ts <main checkout> <worktree> [--force] | <worktree> --remove\n",
    )
    process.exit(2)
  } else {
    process.stderr.write(`${seed(main, worktree, process.argv.includes("--force"))}\n`)
  }
}
