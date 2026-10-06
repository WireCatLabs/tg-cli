import { existsSync, mkdtempSync, statSync, writeFileSync } from "node:fs"
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

  it.skipIf(process.platform === "win32")("keeps the session and its -wal and -shm owner-only", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-session-")), "test.session")
    const storage = await opened(path)
    storage.authKeys.set(2, new Uint8Array(256))
    await storage.driver.save?.()

    for (const file of [path, `${path}-wal`, `${path}-shm`]) {
      expect(existsSync(file)).toBe(true)
      expect(statSync(file).mode & 0o777).toBe(0o600)
    }
    await storage.driver.destroy?.()
  })

  it.skipIf(process.platform === "win32")("makes a session left readable by others owner-only again", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-session-")), "test.session")
    writeFileSync(path, "", { mode: 0o644 })
    const storage = await opened(path)
    expect(statSync(path).mode & 0o777).toBe(0o600)
    await storage.driver.destroy?.()
  })
})

const pts = (value: number) => {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setInt32(0, value, true)
  return bytes
}
const ptsOf = (bytes: Uint8Array | null) =>
  bytes ? new DataView(bytes.buffer, bytes.byteOffset).getInt32(0, true) : null

describe("two processes on one session file (docs/plans/2026-10-04-session-sharing.md)", () => {
  it("lets the last process to flush set the updates state, even an older one", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-session-")), "test.session")
    const serve = await opened(path)
    const watch = await opened(path)

    serve.kv.set("updates_pts", pts(200))
    await serve.driver.save?.()
    watch.kv.set("updates_pts", pts(150))
    await watch.driver.save?.()
    await Promise.all([serve.driver.destroy?.(), watch.driver.destroy?.()])

    const restarted = await opened(path)
    expect(ptsOf(restarted.kv.get("updates_pts") as Uint8Array | null)).toBe(150)
    await restarted.driver.destroy?.()
  })

  it("loses the login for every process once one of them drops the key", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-session-")), "test.session")
    const serve = await opened(path)
    serve.authKeys.set(2, new Uint8Array(256).fill(7))
    await serve.driver.save?.()
    const command = await opened(path)

    command.authKeys.set(2, null)

    expect(serve.authKeys.get(2)).toBeNull()
    await Promise.all([serve.driver.destroy?.(), command.driver.destroy?.()])
  })
})
