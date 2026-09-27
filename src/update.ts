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

/** npm, the clock, the terminal and the package manager as `tg update` sees them — faked in a test. */
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

export const runUpdate = (argv: string[], environment: UpdateEnvironment = {}): number =>
  environment.spawn ? environment.spawn(argv) : runPackageManager(argv)

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
    const pretty = !argv.includes("--json") && !argv.includes("--jsonl") && (tty ?? process.stdout.isTTY === true)
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
    })
  } catch {
    return Promise.resolve(undefined)
  }
}
