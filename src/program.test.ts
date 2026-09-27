import { Readable } from "node:stream"
import { CliError, captureStreams, memoryKeyring } from "@leemour/cli-core"
import { type Chat, type Message, pickChat } from "@leemour/cli-messaging"
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
  self: () => "1",
  login: async () => ({ id: "1", name: "Owner", username: null }),
  me: async () => ({ id: "1", name: "Owner", username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [message], hasMore: false }),
  chat: async () => ({ ...chat, members: null }),
  around: async () => [],
  resolve: async (reference) =>
    reference === "me" ? { ...chat, id: "1", kind: "saved", title: "Saved Messages" } : chat,
  send: async (_chat, text, { sendId }) => ({ message: { ...message, text, outgoing: true }, sendId }),
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

  it("pages chats through the shared flags, and refuses --all with --page", async () => {
    let asked: unknown
    const { code, stdout } = await tg(["chats", "list", "--limit", "5", "--page", "3"], {
      adapter: () =>
        scripted({
          chats: async (window) => {
            asked = window
            return { items: [chat], hasMore: true }
          },
        }),
    })

    expect(code).toBe(0)
    expect(asked).toEqual({ limit: 5, offset: 10 })
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ page: 3, limit: 5, hasMore: true })
    expect((await tg(["chats", "list", "--all", "--page", "2"])).code).toBe(2)
  })

  it("reads the first word as the profile", async () => {
    let profile = ""
    await tg(["work", "chats", "list"], {
      adapter: (options) => {
        profile = options.sessionPath
        return scripted()
      },
    })
    expect(profile).toMatch(/work\.session$/)
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

describe("a chat named ambiguously", () => {
  it("**lists the candidates with exit 2**, although the error comes from cli-messaging's copy of cli-core", async () => {
    const twoMatches = () =>
      scripted({
        history: async (reference) => {
          pickChat(reference, [chat, { ...chat, id: "-1009", title: "Valencia housing" }])
          return { items: [], hasMore: false }
        },
      })
    const { code, stdout, stderr } = await tg(["messages", "list", "Valencia"], { adapter: twoMatches })

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.candidates).toHaveLength(2)
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
    const { code, stdout } = await tg(["messages", "send", "me", "--send-id", "-9001"], {
      stdin: Readable.from(["from a pipe"]),
    })

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
    expect(JSON.parse(stderr[0] ?? "").error.sendId).toBe("-9001")
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
