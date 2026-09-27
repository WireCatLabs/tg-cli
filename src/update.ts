import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import type { FetchLike } from "@leemour/cli-core/http"
import { type Installer, installerOf, latestVersion, runUpdate as runPackageManager } from "@leemour/cli-core/update"

export const PACKAGE = "@leemour/tg-cli"

/** npm and the package manager as `tg update` sees them — faked in a test. */
export interface UpdateEnvironment {
  fetch?: FetchLike
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
