import { spawnSync } from "node:child_process"
import { realpathSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import type { FetchLike } from "@leemour/cli-core/http"
import {
  type Installer,
  installerOf,
  latestVersion,
  runUpdate as runPackageManager,
  updateNotice as sharedNotice,
} from "@leemour/cli-core/update"
import { resolveSettings } from "./app.js"
import { pathsFor } from "./paths.js"
import { VERSION } from "./version.js"

export const PACKAGE = "@leemour/tg-cli"

/** npm, the clock, the terminal and the package manager as `tg upgrade` sees them — faked in a test. */
export interface UpdateEnvironment {
  fetch?: FetchLike
  now?: () => number
  stderrIsTTY?: boolean
  scriptPath?: string
  /** Runs the update and answers its exit code; its output goes to stderr. */
  spawn?: (argv: string[]) => number
}

export const installer = ({ scriptPath }: UpdateEnvironment = {}): Installer =>
  installerOf(scriptPath ?? realpathSync(fileURLToPath(import.meta.url)))

export const latest = (environment: UpdateEnvironment = {}) =>
  latestVersion(PACKAGE, environment.fetch ?? fetch, { timeoutMs: 3000 })

/** This install's own entry point — after an update, the new code at the same path. */
export const tgScript = (): string => fileURLToPath(new URL("./bin/tg.js", import.meta.url))

export const runUpdate = (argv: string[], environment: UpdateEnvironment = {}): number =>
  environment.spawn ? environment.spawn(argv) : runPackageManager(argv)

export const restartServer = (profile: string, env: NodeJS.ProcessEnv, environment: UpdateEnvironment = {}): number => {
  const argv = [tgScript(), profile, "server", "restart"]
  return environment.spawn
    ? environment.spawn([process.execPath, ...argv])
    : (spawnSync(process.execPath, argv, { env, shell: false, stdio: ["ignore", 2, 2] }).status ?? 1)
}

/**
 * The daily "a newer version exists" line, or `undefined`. Started beside the command and awaited
 * after it, so asking npm costs the command nothing; any failure is silence, never an error.
 */
export const updateNotice = (
  argv: readonly string[],
  {
    tty,
    environment = {},
    env = process.env,
  }: { tty?: boolean; environment?: UpdateEnvironment; env?: NodeJS.ProcessEnv },
): Promise<string | undefined> => {
  try {
    const delimiter = argv.indexOf("--")
    const options = argv.slice(0, delimiter < 0 ? undefined : delimiter)
    if (
      ["--help", "-h", "--version", "-V", "--json", "--jsonl", "--dry-run", "--timeout", "commands"].some((word) =>
        options.includes(word),
      )
    )
      return Promise.resolve(undefined)

    if (argv.includes("upgrade")) return Promise.resolve(undefined)
    const pretty = !argv.includes("--json") && !argv.includes("--jsonl") && (tty ?? process.stdout.isTTY === true)
    // cli-core 0.8 names the command `update` in its line; tg's is `upgrade`.
    return sharedNotice({
      argv,
      packageName: PACKAGE,
      command: "tg",
      version: VERSION,
      statePath: join(pathsFor(env).state, "update-check.json"),
      fetch: environment.fetch ?? fetch,
      ...(environment.now ? { now: environment.now } : {}),
      format: pretty ? "pretty" : "json",
      stderrIsTTY: environment.stderrIsTTY ?? process.stderr.isTTY === true,
      quiet: argv.includes("--quiet"),
      enabled: resolveSettings({}, { env }).updateCheck,
      installer: installer(environment),
      env,
      offVariables: ["TG_NO_UPDATE_CHECK"],
    }).then((line) => line?.replace("`tg update`", "`tg upgrade`"))
  } catch {
    return Promise.resolve(undefined)
  }
}
