import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { type CommandInfo, describeProgram } from "@leemour/cli-core/commands"
import type { Chat, Message } from "@leemour/cli-messaging"
import { describe, expect, it } from "vitest"
import type { Adapter } from "./commands/context.js"
import { createProgram, run } from "./program.js"

const chat: Chat = {
  id: "-100500",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 0,
  lastMessageAt: "2026-09-27T10:00:00.000Z",
  participantsCount: 3,
}
const message: Message = {
  id: "42",
  chatId: chat.id,
  senderId: "7",
  senderName: "Ana",
  timestamp: "2026-09-27T10:00:00.000Z",
  editedAt: null,
  text: "hola",
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
}

const telegram: Adapter = {
  self: () => "1",
  login: async () => ({ id: "1", name: "Owner", username: null }),
  me: async () => ({ id: "1", name: "Owner", username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [message], hasMore: false }),
  resolve: async () => chat,
  chat: async () => ({ ...chat, members: [] }),
  contact: async () => ({ id: "7", name: "Ana", username: null, description: null, lastMessagedAt: null, chats: [] }),
  around: async () => [{ ...message, anchor: true }],
  send: async (_chat, text, { sendId }) => ({ message: { ...message, text }, sendId }),
  logout: async () => {},
  close: async () => {},
}

const PLACEHOLDER: Record<string, string> = {
  chat: "Valencia",
  message: "42",
  person: "Ana",
  "run-id": "none",
  text: "hi",
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
      const code = await run([...command.path, ...args, "--json"], {
        streams,
        tty: false,
        stdin: Object.assign(Readable.from(["hi"]), { isTTY: false }),
        keyring: memoryKeyring(),
        env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
        adapter: () => telegram,
        update: { fetch: async () => new Response("{}", { status: 404 }), spawn: () => 1 },
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
