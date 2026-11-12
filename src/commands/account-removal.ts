import { existsSync, rmSync } from "node:fs"
import { join } from "node:path"
import { CliError } from "@wirecat/cli-base"
import { checkWords } from "@wirecat/cli-core"
import type { AccountRemoval } from "@wirecat/cli-core/cli"
import { resolveSettings } from "../app.js"
import { APP, isolated, pathsFor, sessionFile, usesOwnersSession } from "../paths.js"
import type { Check } from "../telegram/adapter.js"
import { apiCredentials } from "../telegram/credentials.js"
import { resolveProxy } from "../telegram/proxy.js"

const SUFFIXES = ["", "-wal", "-shm"]

/** Telegram already ended this login: there is nothing left to log out of. */
const alreadyEnded = (error: unknown) => error instanceof CliError && error.details?.reason === "login.revoked"

const logOut = async (profile: string, sessionPath: string, context: Parameters<AccountRemoval["signOut"]>[1]) => {
  const { env, keyring } = context
  const credentials = apiCredentials({ profile, env, ...(keyring ? { keyring } : {}) }).read()
  if (!credentials) return false
  const settings = resolveSettings({ profile }, { env })
  const through = resolveProxy(settings, {
    env,
    checks: checkWords<Check>("tg", profile),
    ...(keyring ? { keyring } : {}),
  })
  const { TelegramAdapter } = await import("../telegram/adapter.js")
  const adapter = await TelegramAdapter.open({ credentials, sessionPath, ...(through ? { proxy: through.proxy } : {}) })
  try {
    await adapter.logout()
    return true
  } catch (error) {
    if (alreadyEnded(error)) return true
    throw error
  } finally {
    await adapter.close().catch(() => {})
  }
}

export const TELEGRAM_REMOVAL: AccountRemoval = {
  signOut: async (profile, context) => {
    const sessionPath = sessionFile(profile, context.env)
    if (!existsSync(sessionPath)) return { revoked: null, removed: [] }
    if (usesOwnersSession(profile, context.env)) return { revoked: false, removed: [] }
    // A moved run never logs out at Telegram: a session file copied into its folders would still be the owner's login.
    const revoked = context.mayRevoke ? await logOut(profile, sessionPath, context) : false
    for (const suffix of SUFFIXES) rmSync(`${sessionPath}${suffix}`, { force: true })
    return { revoked, removed: ["the Telegram session"] }
  },
  secrets: (profile, { env }) => [
    {
      credentials: { configDir: pathsFor(env).config, service: APP, isolated: isolated(env), env },
      accounts: [`${profile}:api`, `proxy:profile:${profile}`],
    },
  ],
  stateFiles: (profile, { env }) =>
    usesOwnersSession(profile, env) ? [] : [join(pathsFor(env).state, "bots", profile)],
}
