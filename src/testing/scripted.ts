import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Chat, Message } from "@leemour/cli-messaging"
import type { Adapter, Environment } from "../commands/context.js"
import { run } from "../program.js"

export const chat: Chat = {
  id: "-1001234567890",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 1,
  lastMessageAt: "2026-09-26T10:00:00.000Z",
  participantsCount: 5000,
}

export const dialog = (id: string, title: string, lastMessageAt: string): Chat => ({
  id,
  title,
  kind: "dialog",
  unreadCount: 0,
  lastMessageAt,
  participantsCount: null,
})

export const message = (id: string, fields: Partial<Message> = {}): Message => ({
  id,
  chatId: chat.id,
  senderId: "777",
  senderName: "Ana",
  timestamp: "2026-09-26T10:00:00.000Z",
  editedAt: null,
  text: `synthetic text ${id}`,
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
  ...fields,
})

/** A Telegram that answers at once and never connects; override what a test asks about. */
export const scripted = (overrides: Partial<Adapter> = {}): Adapter => ({
  self: () => "1",
  login: async () => ({ id: "1", name: "Owner", username: null }),
  me: async () => ({ id: "1", name: "Owner", username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [message("42")], hasMore: false }),
  chat: async () => ({ ...chat, members: null }),
  contact: async () => ({ id: "1", name: null, username: null, description: null, lastMessagedAt: null, chats: [] }),
  around: async () => [],
  resolve: async (reference) =>
    reference === "me" ? { ...chat, id: "1", kind: "saved", title: "Saved Messages" } : chat,
  send: async (_chat, text, { sendId }) => ({ message: { ...message("43"), text, outgoing: true }, sendId }),
  logout: async () => {},
  close: async () => {},
  ...overrides,
})

export const tg = async (argv: string[], environment: Partial<Environment> = {}) => {
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
