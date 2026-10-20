import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { sessionFile } from "./paths.js"
import { run } from "./program.js"

const doctor = async (env: NodeJS.ProcessEnv) => {
  const streams = captureStreams()
  const code = await run(["--offline", "doctor", "--json"], {
    env,
    keyring: memoryKeyring(),
    adapter: async () => {
      throw new Error("doctor must not connect")
    },
    streams,
    tty: false,
  })
  expect(code, streams.stderr.join("")).toBe(0)
  return JSON.parse(streams.stdout.join(""))
}

describe.skipIf(process.platform === "win32")("doctor's session files block", () => {
  const sandbox = () => {
    const root = mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? tmpdir(), "doctor-files-"))
    const env = {
      ...process.env,
      MESSAGING_STORE: join(root, "messages.db"),
      TG_CONFIG_DIR: join(root, "config"),
      TG_STATE_DIR: join(root, "state"),
    }
    const path = sessionFile("default", env)
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    chmodSync(dirname(path), 0o700)
    writeFileSync(path, "", { mode: 0o600 })
    return { env, path }
  }

  it("is ok when only the owner can reach the session", async () => {
    const { env } = sandbox()
    expect((await doctor(env)).item.telegram.session.files).toEqual({ checked: true, ok: true, problems: [] })
  })

  it("names the -wal file and the folder others can open, with the chmod that fixes each", async () => {
    const { env, path } = sandbox()
    writeFileSync(`${path}-wal`, "")
    chmodSync(`${path}-wal`, 0o644)
    chmodSync(dirname(path), 0o755)

    expect((await doctor(env)).item.telegram.session.files).toEqual({
      checked: true,
      ok: false,
      problems: [
        { path: `${path}-wal`, mode: "0644", want: "0600", fix: `chmod 600 '${path}-wal'` },
        { path: dirname(path), mode: "0755", want: "0700", fix: `chmod 700 '${dirname(path)}'` },
      ],
    })
  })
})
