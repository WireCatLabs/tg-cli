import { readFileSync } from "node:fs"
import { join } from "node:path"
import { writeSecurely } from "@leemour/cli-core"
import type { AccountKey } from "@leemour/cli-messaging/store"
import { pathsFor } from "./paths.js"

/** Which Telegram account a profile is, remembered so `--offline` can find its rows without connecting. */
const accountFile = (profile: string, env: NodeJS.ProcessEnv) =>
  join(pathsFor(env).state, "accounts", `${profile}.json`)

export const rememberAccount = (profile: string, id: string, env: NodeJS.ProcessEnv): void =>
  writeSecurely(accountFile(profile, env), `${JSON.stringify({ account: id })}\n`, 0o600)

export const recalledAccount = (profile: string, env: NodeJS.ProcessEnv): AccountKey | undefined => {
  try {
    const { account } = JSON.parse(readFileSync(accountFile(profile, env), "utf8")) as { account?: unknown }
    return typeof account === "string" ? { provider: "telegram", account } : undefined
  } catch {
    return undefined
  }
}
