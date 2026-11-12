import { userInfo } from "node:os"
import { join, resolve } from "node:path"
import { isMovedRun, type Paths, pathsAreOverridden, resolvePaths } from "@wirecat/cli-base"
import { TG } from "./app.js"

export const APP = TG.appName

export const pathsFor = (env: NodeJS.ProcessEnv = process.env): Paths =>
  resolvePaths({ appName: TG.appName, prefix: TG.envPrefix, env })

/** A throwaway config directory must not share the real keyring entry (cli-base `isolated`). */
export const isolated = (env: NodeJS.ProcessEnv = process.env) =>
  pathsAreOverridden({ appName: TG.appName, prefix: TG.envPrefix, env })

/** The MTProto session: an auth key, which is a credential as good as a password. */
export const sessionFile = (profile: string, env: NodeJS.ProcessEnv = process.env): string =>
  join(pathsFor(env).state, "sessions", `${profile}.session`)

const accountHome = () => {
  try {
    return userInfo().homedir
  } catch {
    return undefined
  }
}

/**
 * **A run whose folders are not the owner's**, which never logs out at Telegram (WC-SECR-24): a session file copied
 * into its folders is still the owner's login. A keyring handed in means a test, as in cli-core's `mayRevoke`.
 */
export const isMoved = (env: NodeJS.ProcessEnv, keyring?: unknown) =>
  keyring === undefined && isMovedRun({ appName: TG.appName, prefix: TG.envPrefix, env })

/**
 * **A run with moved folders holding the owner's own login**: only the config or cache folder moved, so the state
 * folder and the session file in it are the owner's. Such a run may use the login but never end or delete it
 * (WC-SECR-24). An account with no home counts as the owner's, the safe answer.
 */
export const usesOwnersSession = (profile: string, env: NodeJS.ProcessEnv = process.env, home = accountHome()) => {
  if (!isMovedRun({ appName: TG.appName, prefix: TG.envPrefix, env, home })) return false
  if (home === undefined) return true
  return resolve(sessionFile(profile, env)) === resolve(sessionFile(profile, { HOME: home, USERPROFILE: home }))
}

export const botSessionFile = (profile: string, botId: string, env: NodeJS.ProcessEnv = process.env): string =>
  join(pathsFor(env).state, "bots", profile, `mtproto-${botId}.session`)
