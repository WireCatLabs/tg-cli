import type { Message as TgMessage } from "@mtcute/node"
import { describe, expect, it } from "vitest"
import { toMessage } from "./map.js"

const tgMessage = (sender: { type: "user" | "chat"; id: number; displayName: string }) =>
  ({
    id: 7,
    chat: { id: -1001234567890 },
    sender,
    date: new Date("2026-09-27T10:00:00.000Z"),
    editDate: null,
    text: "hello",
    isOutgoing: false,
    media: null,
    replyToMessage: null,
    forward: null,
    isTopicMessage: false,
    reactions: null,
    views: null,
    forwards: null,
    groupedIdUnique: null,
    action: null,
    link: undefined,
  }) as unknown as TgMessage

describe("a Telegram message", () => {
  it("**says when its author is a chat**, so the store makes no person of a channel", () => {
    expect(toMessage(tgMessage({ type: "chat", id: -1001234567890, displayName: "News" })).senderIsChat).toBe(true)
    expect(toMessage(tgMessage({ type: "user", id: 777, displayName: "Ana" }))).not.toHaveProperty("senderIsChat")
  })
})
