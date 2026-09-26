import { join } from "node:path"
import { CliError, pathsAreOverridden, resolvePaths } from "@leemour/cli-core"

export const APP = "tg-cli"
const PREFIX = "TG"

export const pathsFor = (env: NodeJS.ProcessEnv = process.env) => resolvePaths({ appName: APP, prefix: PREFIX, env })

/** A throwaway config directory must not share the real keyring entry (cli-core `isolated`). */
export const isolated = (env: NodeJS.ProcessEnv = process.env) =>
  pathsAreOverridden({ appName: APP, prefix: PREFIX, env })

/** Names become file names and keyring accounts. */
export const profileFrom = (env: NodeJS.ProcessEnv = process.env): string => {
  const profile = env.TG_PROFILE?.trim() || "default"
  if (!/^[A-Za-z0-9._-]+$/.test(profile)) {
    throw new CliError("validation_error", "TG_PROFILE may hold letters, digits, '.', '-' and '_' only")
  }
  return profile
}

/** The MTProto session: an auth key, which is a credential as good as a password. */
export const sessionFile = (profile: string, env: NodeJS.ProcessEnv = process.env): string =>
  join(pathsFor(env).state, "sessions", `${profile}.session`)
