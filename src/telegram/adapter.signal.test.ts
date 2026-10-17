import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"
import type { BaseSqliteStorage } from "@mtcute/node"
import { expect, it, vi } from "vitest"
import { TelegramAdapter } from "./adapter.js"

const opened = vi.hoisted(() => [] as BaseSqliteStorage[])

vi.mock("./storage.js", async (actual) => {
  const real = await actual<typeof import("./storage.js")>()
  return {
    ...real,
    openSessionStorage: async (path: string) => {
      const storage = await real.openSessionStorage(path)
      opened.push(storage)
      return storage
    },
  }
})

// A real SIGTERM to this test worker, caught the way `serve` catches it; an update still being stored, as it
// was live; then the close every exit path runs. Windows ends a process that signals itself. The listeners
// already there are set aside: the test setup's own one takes a real SIGTERM for the end of the worker and
// deletes the sandbox the session lives in.
it.skipIf(process.platform === "win32")(
  "closes a listening session stopped by SIGTERM and keeps what was still arriving after it",
  async () => {
    const setAside = process.listeners("SIGTERM")
    for (const listener of setAside) process.off("SIGTERM", listener)
    let signalled!: () => void
    const stopped = new Promise<void>((resolve) => {
      signalled = resolve
    })
    const serveListener = () => signalled()
    const sessionPath = join(mkdtempSync(join(tmpdir(), "tg-stop-")), "test.session")

    try {
      const adapter = await TelegramAdapter.open({
        credentials: { id: 1, hash: "0".repeat(32) },
        sessionPath,
        listen: true,
      })
      process.on("SIGTERM", serveListener)
      process.kill(process.pid, "SIGTERM")
      await stopped
      opened[0]?.kv.set("stop_probe", new Uint8Array([1, 4, 8]))
      await expect(adapter.close()).resolves.toBeUndefined()
    } finally {
      process.off("SIGTERM", serveListener)
      for (const listener of setAside) process.on("SIGTERM", listener)
    }

    const session = new DatabaseSync(sessionPath, { readOnly: true })
    const row = session.prepare("select value from key_value where key = ?").get("stop_probe")
    session.close()
    expect(row?.value).toEqual(new Uint8Array([1, 4, 8]))
  },
)
