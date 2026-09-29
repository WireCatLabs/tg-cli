import { beforeEach, describe, expect, it, vi } from "vitest"
import { openInBrowser } from "./browser.js"

const spawned = vi.hoisted(() => ({ calls: [] as unknown[][], fail: false, unref: 0 }))

vi.mock("node:child_process", () => ({
  spawn: (...args: unknown[]) => {
    if (spawned.fail) throw new Error("ENOENT")
    spawned.calls.push(args)
    return {
      on: () => {},
      unref: () => {
        spawned.unref += 1
      },
    }
  },
}))

beforeEach(() => {
  spawned.calls = []
  spawned.fail = false
  spawned.unref = 0
})

describe("opening a link", () => {
  it("uses each system's own opener, detached so the CLI can exit", () => {
    const url = "https://my.telegram.org/apps"
    for (const platform of ["linux", "darwin", "win32"] as const) expect(openInBrowser(url, platform)).toBe(true)

    expect(spawned.calls.map(([command, args]) => [command, args])).toEqual([
      ["xdg-open", [url]],
      ["open", [url]],
      ["cmd", ["/c", "start", "", url]],
    ])
    expect(spawned.calls.every(([, , options]) => (options as { detached: boolean }).detached)).toBe(true)
    expect(spawned.unref).toBe(3)
  })

  it("answers false instead of throwing when there is no opener", () => {
    spawned.fail = true
    expect(openInBrowser("https://example.org", "linux")).toBe(false)
  })
})
