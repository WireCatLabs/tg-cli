import { tmpdir } from "node:os"
import { join } from "node:path"
import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { type CommandInfo, describeProgram } from "@leemour/cli-core/commands"
import { describe, expect, it } from "vitest"
import { createProgram, run } from "./program.js"
import { chat, message, scripted } from "./testing/scripted.js"

const telegram = scripted({
  chat: async () => ({ ...chat, members: [] }),
  contact: async () => ({ id: "777", name: "Ana", username: null, description: null, lastMessagedAt: null, chats: [] }),
  around: async () => [{ ...message("42"), anchor: true }],
})

const PLACEHOLDER: Record<string, string> = {
  chat: "Valencia",
  message: "42",
  person: "Ana",
  "run-id": "none",
  text: "hi",
}

/** Options a command needs so the suite writes nothing outside its sandbox. */
const CONFINED: Record<string, string[]> = {
  "doctor report create": ["--output", join(process.env.TG_TEST_SANDBOX ?? tmpdir(), "report.json")],
}

const leaves = (list: readonly CommandInfo[]): CommandInfo[] =>
  list.flatMap((one) => (one.commands.length > 0 ? leaves(one.commands) : [one]))

describe("the stdout contract", () => {
  const commands = leaves(describeProgram(createProgram())).filter((one) => one.path.join(" ") !== "help")

  it.each(commands.map((one) => [one.path.join(" "), one] as const))(
    "**%s --json** prints one JSON value when it succeeds and nothing when it fails",
    async (_name, command) => {
      const streams = captureStreams()
      const args = command.arguments.map((one) => PLACEHOLDER[one.name] ?? "x")
      const code = await run([...command.path, ...args, ...(CONFINED[command.path.join(" ")] ?? []), "--json"], {
        streams,
        tty: false,
        stdin: Object.assign(Readable.from(["hi"]), { isTTY: false }),
        keyring: memoryKeyring(),
        env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
        adapter: () => telegram,
        update: { fetch: async () => new Response("{}", { status: 404 }), spawn: () => 1 },
        system: {
          platform: "linux",
          uid: 1000,
          entry: ["/usr/bin/node", "/opt/tg/dist/bin/tg.js"],
          run: async () => ({ code: 0, stdout: "", stderr: "" }),
        },
      })

      if (code === 0) {
        expect(streams.stdout).toHaveLength(1)
        expect(() => JSON.parse(streams.stdout[0] ?? "")).not.toThrow()
      } else {
        expect(streams.stdout).toEqual([])
      }
    },
  )
})
