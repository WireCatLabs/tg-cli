import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, vi } from "vitest"

/**
 * The setup file gives each test file one home, so its tests share profiles, config, recorded runs and the store.
 * The XDG folders and not `TG_*_DIR`: those mark the paths as overridden, which the CLI treats as an isolated install.
 */
export const freshHome = () => {
  const home = mkdtempSync(join(tmpdir(), "home-"))
  const data = join(home, ".local", "share")
  return {
    HOME: home,
    XDG_CONFIG_HOME: join(home, ".config"),
    XDG_DATA_HOME: data,
    XDG_STATE_HOME: join(home, ".local", "state"),
    XDG_CACHE_HOME: join(home, ".cache"),
    MESSAGING_STORE: join(data, "WireCat", "wirecat.db"),
  }
}

export const freshHomeEachTest = () => {
  beforeEach(() => {
    for (const [key, value] of Object.entries(freshHome())) vi.stubEnv(key, value)
  })
  afterEach(() => vi.unstubAllEnvs())
}
