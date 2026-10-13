import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { parseCommandsDocument } from "@wirecat/cli-base/commands"
import { describe, expect, it } from "vitest"
import { run } from "./program.js"

describe("tg commands --json", () => {
  it("prints the shared commands document that cli-dev lint reads", async () => {
    const streams = captureStreams()
    const adapter = () => {
      throw new Error("commands --json must not open the messenger")
    }
    const code = await run(["commands", "--json"], { streams, tty: false, adapter, keyring: memoryKeyring() })
    expect(code).toBe(0)
    expect(parseCommandsDocument(JSON.parse(streams.stdout.join("")))).not.toHaveProperty("problems")
  })
})
