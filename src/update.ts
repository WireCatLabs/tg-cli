import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { appUpdate, type UpdateEnvironment } from "@wirecat/cli-core/update"
import { resolveSettings } from "./app.js"
import { pathsFor } from "./paths.js"
import { VERSION } from "./version.js"

export type { UpdateEnvironment }

export const PACKAGE = "@wirecat/tg-cli"

export const { installer, latest, runUpdate, updateNotice } = appUpdate({
  packageName: PACKAGE,
  command: "tg",
  version: VERSION,
  entry: import.meta.url,
  statePath: (env) => join(pathsFor(env).state, "update-check.json"),
  enabled: (env) => resolveSettings({}, { env, needsProfile: false }).updateCheck,
  offVariables: ["TG_NO_UPDATE_CHECK"],
})

/** This install's own entry point — after an update, the new code at the same path. */
export const tgScript = (): string => fileURLToPath(new URL("./bin/tg.js", import.meta.url))

export const restartServer = (profile: string, env: NodeJS.ProcessEnv, environment: UpdateEnvironment = {}): number => {
  const argv = [tgScript(), profile, "server", "restart"]
  return environment.spawn
    ? environment.spawn([process.execPath, ...argv])
    : (spawnSync(process.execPath, argv, { env, shell: false, stdio: ["ignore", 2, 2] }).status ?? 1)
}
