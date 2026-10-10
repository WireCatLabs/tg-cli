import { join } from "node:path"
import { type Paths, pathsAreOverridden, resolvePaths } from "@wirecat/cli-core"
import { TG } from "./app.js"

export const APP = TG.appName

export const pathsFor = (env: NodeJS.ProcessEnv = process.env): Paths =>
  resolvePaths({ appName: TG.appName, prefix: TG.envPrefix, env })

/** A throwaway config directory must not share the real keyring entry (cli-core `isolated`). */
export const isolated = (env: NodeJS.ProcessEnv = process.env) =>
  pathsAreOverridden({ appName: TG.appName, prefix: TG.envPrefix, env })

/** The MTProto session: an auth key, which is a credential as good as a password. */
export const sessionFile = (profile: string, env: NodeJS.ProcessEnv = process.env): string =>
  join(pathsFor(env).state, "sessions", `${profile}.session`)

export const botSessionFile = (profile: string, botId: string, env: NodeJS.ProcessEnv = process.env): string =>
  join(pathsFor(env).state, "bots", profile, `mtproto-${botId}.session`)
