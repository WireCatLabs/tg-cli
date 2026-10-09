import { spawnSync } from "node:child_process"
import { describe, expect, it, vi } from "vitest"
import { restartServer, tgScript } from "./update.js"

vi.mock("node:child_process", async (original) => ({
  ...(await original<typeof import("node:child_process")>()),
  spawnSync: vi.fn(),
}))

describe("server restart after upgrade", () => {
  it("runs the Node executable directly with separate arguments and the command environment", () => {
    const env = { TG_STATE_DIR: "C:\\Program Files\\Synthetic\\state" }
    vi.mocked(spawnSync).mockReturnValue({ status: 0 } as ReturnType<typeof spawnSync>)
    expect(restartServer("work", env)).toBe(0)
    expect(spawnSync).toHaveBeenCalledWith(process.execPath, [tgScript(), "work", "server", "restart"], {
      env,
      shell: false,
      stdio: ["ignore", 2, 2],
    })
    vi.mocked(spawnSync).mockReturnValue({ status: null } as ReturnType<typeof spawnSync>)
    expect(restartServer("work", env)).toBe(1)
  })
})
