import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { NodePlatform } from "@mtcute/node"
import { LogManager } from "@mtcute/node/utils.js"
import { describe, expect, it } from "vitest"
import { openSessionStorage } from "./storage.js"

const opened = async (path: string) => {
  const storage = await openSessionStorage(path)
  const platform = new NodePlatform()
  const log = new LogManager("test", platform)
  log.level = LogManager.OFF
  storage.driver.setup?.(log, platform)
  await storage.driver.load?.()
  return storage
}

describe("the session storage over the runtime's own SQLite", () => {
  it("runs mtcute's migrations and keeps an auth key and a peer across a reopen", async () => {
    // A 64-bit access hash and a channel's marked id: what a real login writes for every dialog.
    const peer = {
      id: -1002345678901,
      accessHash: "-8446744073709551615",
      isMin: false,
      usernames: ["valencia_expats"],
      updated: 1_790_000_000,
      complete: new Uint8Array([1, 2, 3]),
    }
    const path = join(mkdtempSync(join(tmpdir(), "tg-session-")), "test.session")
    const key = new Uint8Array(256).map((_, index) => index)

    const first = await opened(path)
    first.authKeys.set(2, key)
    first.peers.store(peer)
    await first.driver.save?.()
    await first.driver.destroy?.()

    const second = await opened(path)
    expect(second.authKeys.get(2)).toEqual(key)
    expect(second.peers.getById(peer.id)).toEqual(peer)
    await second.driver.destroy?.()
  })
})
