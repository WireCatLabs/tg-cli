import { Readable } from "node:stream"
import { CliError, captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Chat, Message } from "@leemour/cli-messaging"
import { describe, expect, it } from "vitest"
import type { Adapter, Environment } from "./commands/context.js"
import { run } from "./program.js"

const chat: Chat = {
  id: "-1001234567890",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 3,
  lastMessageAt: "2026-09-26T10:00:00.000Z",
  participantsCount: 5000,
}

const message: Message = {
  id: "42",
  chatId: "-1001234567890",
  senderId: "777",
  senderName: "Ana",
  timestamp: "2026-09-26T10:00:00.000Z",
  editedAt: null,
  text: "empadronamiento renewal",
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
}

const scripted = (overrides: Partial<Adapter> = {}): Adapter => ({
  login: async () => ({ id: "1", name: "Owner", username: null }),
  me: async () => ({ id: "1", name: "Owner", username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [message], hasMore: false }),
  send: async (_chat, text) => ({ message: { ...message, text, outgoing: true }, sendId: "-9001" }),
  logout: async () => {},
  close: async () => {},
  ...overrides,
})

const tg = async (argv: string[], environment: Partial<Environment> = {}) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
    adapter: () => scripted(),
    ...environment,
  })
  return { code, stdout: streams.stdout, stderr: streams.stderr }
}

describe("machine output", () => {
  it("writes one JSON value to stdout and nothing to stderr", async () => {
    const { code, stdout, stderr } = await tg(["chats", "list", "--json"])

    expect(code).toBe(0)
    expect(stdout).toHaveLength(1)
    expect(JSON.parse(stdout[0] ?? "")).toEqual({ items: [chat], page: 1, limit: 20, hasMore: false })
    expect(stderr).toEqual([])
  })

  it("keeps every id a string", async () => {
    const { stdout } = await tg(["messages", "list", "Valencia"])
    const [item] = JSON.parse(stdout[0] ?? "").items

    expect(typeof item.id).toBe("string")
    expect(typeof item.chatId).toBe("string")
  })

  it("says a failure on stderr as JSON, with the exit code for its kind", async () => {
    const { code, stdout, stderr } = await tg(["account", "show"], { env: { ...process.env }, adapter: undefined })

    expect(code).toBe(4)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.code).toBe("authentication_error")
  })
})

describe("a person at a terminal", () => {
  it("gets the message feed as lines, not one escaped line", async () => {
    const { code, stdout } = await tg(["messages", "list", "Valencia"], { tty: true })
    const printed = stdout.join("\n")

    expect(code).toBe(0)
    expect(printed.split("\n").length).toBeGreaterThan(1)
    expect(printed).not.toContain("\\x0a")
    expect(printed).toContain("empadronamiento renewal")
  })
})

describe("sending", () => {
  it("reads the text from stdin when none is given", async () => {
    const { code, stdout } = await tg(["messages", "send", "me"], { stdin: Readable.from(["from a pipe"]) })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ sendId: "-9001", message: { text: "from a pipe" } })
  })

  it("hands back the send id when the outcome is unknown, so a repeat cannot make a second copy", async () => {
    const unknown = () =>
      scripted({
        send: async () => {
          throw new CliError("outcome_unknown", "no answer", { sendId: "-9001" })
        },
      })
    const { code, stderr } = await tg(["messages", "send", "me", "hi"], { adapter: unknown })

    expect(code).toBe(14)
    expect(JSON.parse(stderr[0] ?? "").error.details.sendId).toBe("-9001")
  })

  it("refuses an empty message before connecting", async () => {
    let opened = false
    const { code } = await tg(["messages", "send", "me"], {
      stdin: Readable.from([""]),
      adapter: () => {
        opened = true
        return scripted()
      },
    })

    expect(code).toBe(2)
    expect(opened).toBe(false)
  })
})
