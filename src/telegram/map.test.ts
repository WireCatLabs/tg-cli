import type { DeleteMessageUpdate, Message as TgMessage } from "@mtcute/node"
import { describe, expect, it } from "vitest"
import {
  peerToChat,
  toAccount,
  toChat,
  toDeletions,
  toGroupMember,
  toMessage,
  toMessageHit,
  toReactionChange,
} from "./map.js"

const tgMessage = (sender: { type: "user" | "chat"; id: number; displayName: string; username?: string }) =>
  ({
    id: 7,
    chat: { id: -1001234567890 },
    sender,
    date: new Date("2026-09-27T10:00:00.000Z"),
    editDate: null,
    text: "hello",
    entities: [],
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

describe("ranking linkage", () => {
  it("keeps an explicit cross-chat reply and leaves forum placement ambiguous", () => {
    const base = tgMessage({ type: "user", id: 777, displayName: "Synthetic person" })
    expect(
      toMessage({
        ...base,
        replyToMessage: { id: 5, chat: { id: -1007 }, threadId: null, isForumTopic: false },
      } as never).providerMetadata?.graph,
    ).toMatchObject({ version: 1, reply: { chatId: "-1007", messageId: "5" } })
    expect(
      toMessage({ ...base, replyToMessage: { id: 5, chat: null, threadId: 5, isForumTopic: true } } as never)
        .providerMetadata?.graph,
    ).not.toHaveProperty("reply")
  })
  it("records automatic copies only with explicit SDK evidence and linked group ids", () => {
    const base = tgMessage({ type: "chat", id: -1001234567890, displayName: "Synthetic channel" })
    const forward = {
      fromMessageId: 9,
      date: new Date("2026-10-07"),
      sender: { type: "chat", id: -10044, displayName: "Source" },
      raw: { savedFromPeer: { _: "peerChannel", channelId: 44 }, savedFromMsgId: 9 },
    }
    const mapped = toMessage({
      ...base,
      forward,
      isAutomaticForward: true,
      replies: { hasComments: true, count: 2, discussion: -10088 },
    } as never)
    expect(mapped.providerMetadata?.graph).toMatchObject({
      discussionChatId: "-10088",
      discussionSource: { chatId: "-1000000000044", messageId: "9" },
    })
    expect(
      toMessage({ ...base, forward, isAutomaticForward: false } as never).providerMetadata?.graph,
    ).not.toHaveProperty("discussionSource")
  })
})

describe("a Telegram message", () => {
  it("**says when its author is a chat**, so the store makes no person of a channel", () => {
    expect(toMessage(tgMessage({ type: "chat", id: -1001234567890, displayName: "News" })).senderIsChat).toBe(true)
    expect(toMessage(tgMessage({ type: "user", id: 777, displayName: "Ana" }))).not.toHaveProperty("senderIsChat")
  })

  it("carries a person's username, so a mention can be matched to them, and a channel's none", () => {
    const person = { type: "user", id: 777, displayName: "Ana", username: "ana_v" } as const
    expect(toMessage(tgMessage(person))).toHaveProperty("senderUsername", "ana_v")
    expect(toMessage(tgMessage({ type: "user", id: 778, displayName: "Luis" }))).not.toHaveProperty("senderUsername")
    const channel = { type: "chat", id: -1001234567890, displayName: "News", username: "news" } as const
    expect(toMessage(tgMessage(channel))).not.toHaveProperty("senderUsername")
  })
})

describe("a deletion", () => {
  it("**names a channel by its marked id**, and no chat where Telegram names none", () => {
    const deleted = (channelId: number | null) => ({ messageIds: [5, 6], channelId }) as unknown as DeleteMessageUpdate

    expect(toDeletions(deleted(1234567890)).map((change) => ("chatId" in change ? change.chatId : undefined))).toEqual([
      "-1001234567890",
      "-1001234567890",
    ])
    expect(toDeletions(deleted(null))).toEqual([
      { event: "delete", chatId: null, chatTitle: null, messageId: "5" },
      { event: "delete", chatId: null, chatTitle: null, messageId: "6" },
    ])
  })
})

describe("a message's details", () => {
  const base = tgMessage({ type: "user", id: 777, displayName: "Ana" }) as unknown as Record<string, unknown>
  const with_ = (fields: Record<string, unknown>) => ({ ...base, ...fields }) as unknown as TgMessage

  it("keeps whom it mentions by name, once each, and nothing for an @username or a link", () => {
    const entities = [
      { params: { kind: "text_mention", userId: 42 } },
      { params: { kind: "mention" } },
      { params: { kind: "text_mention", userId: 42 } },
      { params: { kind: "text_link", url: "https://example.com" } },
    ]
    expect(toMessage(with_({ entities })).mentions).toEqual(["42"])
    expect(toMessage(with_({})).mentions).toBeUndefined()
  })

  it("describes a document's attachment in the domain type's field order", () => {
    const media = { type: "document", fileName: "a.pdf", mimeType: "application/pdf", fileSize: 10, width: null }
    const [attachment] = toMessage(with_({ media })).attachments

    expect(attachment).toEqual({ kind: "document", name: "a.pdf", size: 10, mime: "application/pdf" })
    expect(Object.keys(attachment ?? {})).toEqual(["kind", "name", "size", "mime"])
  })

  it("keeps a photo's size and a voice note's duration", () => {
    expect(toMessage(with_({ media: { type: "photo", width: 800, height: 600 } })).attachments).toEqual([
      { kind: "photo", width: 800, height: 600 },
    ])
    expect(toMessage(with_({ media: { type: "voice", duration: 4, fileName: "" } })).attachments).toEqual([
      { kind: "voice", duration: 4 },
    ])
  })

  it("names what it answers and its forum topic", () => {
    const mapped = toMessage(with_({ replyToMessage: { id: 5, threadId: 3 }, isTopicMessage: true }))
    expect(mapped).toMatchObject({ replyToId: "5", threadId: "3" })
  })

  it("names the original author of a forward, and none for an anonymous one", () => {
    const forward = (sender: unknown) =>
      toMessage(with_({ forward: { fromMessageId: 9, date: new Date("2026-09-01T00:00:00.000Z"), sender } }))
        .forwardedFrom

    expect(forward({ type: "user", id: 42, displayName: "Luis" })).toMatchObject({
      id: "9",
      senderId: "42",
      senderName: "Luis",
      timestamp: "2026-09-01T00:00:00.000Z",
      text: "",
    })
    expect(forward({ type: "anonymous", displayName: "Hidden" })).toMatchObject({ senderId: null })
  })

  it("counts reactions and says which one is the account's own", () => {
    const reactions = {
      reactions: [
        { emoji: "👍", count: 3, order: 1 },
        { emoji: 12345n, count: 1, order: null },
      ],
    }
    expect(toMessage(with_({ reactions })).reactions).toEqual({
      counts: [
        { reaction: "👍", count: 3 },
        { reaction: "custom:12345", count: 1 },
      ],
      mine: "👍",
      total: 4,
    })
  })

  it("keeps views, forwards and a public link as provider metadata, and survives a chat with no link", () => {
    expect(toMessage(with_({ views: 10, forwards: 2, link: "https://t.me/x/7" })).providerMetadata).toEqual({
      views: 10,
      forwards: 2,
      link: "https://t.me/x/7",
      graph: { version: 1, reply: null },
    })
    expect(toMessage(with_({ replies: { hasComments: true, count: 4 } })).providerMetadata).toEqual({
      comments: 4,
      graph: { version: 1, reply: null },
    })
    expect(toMessage(with_({ replies: { hasComments: false, count: 9 } })).providerMetadata).toEqual({
      graph: { version: 1, reply: null },
    })
    const private_ = Object.defineProperty({ ...base }, "link", {
      get: () => {
        throw new Error("not public")
      },
    }) as unknown as TgMessage
    expect(toMessage(private_).providerMetadata).toEqual({ graph: { version: 1, reply: null } })
  })

  it("names the chat's title in a live message", () => {
    expect(
      toMessageHit(with_({ chat: { type: "chat", id: -100, displayName: "News", chatType: "channel" } })),
    ).toMatchObject({ chatTitle: "News" })
  })
})

describe("a chat", () => {
  const peer = (fields: Record<string, unknown>) => ({ username: null, displayName: "X", id: 1, ...fields }) as never

  it("is Saved Messages when it is the account itself, a dialog for another person", () => {
    expect(peerToChat(peer({ type: "user", isSelf: true }))).toMatchObject({ kind: "saved", title: "Saved Messages" })
    expect(peerToChat(peer({ type: "user", isSelf: false, isBot: true, username: "helper" }))).toMatchObject({
      kind: "dialog",
      providerMetadata: { isBot: true, username: "helper" },
    })
  })

  it("is a channel or a group by its chat type, with its member count", () => {
    expect(peerToChat(peer({ type: "chat", chatType: "channel", membersCount: 9 }))).toMatchObject({
      kind: "channel",
      participantsCount: 9,
    })
    expect(peerToChat(peer({ type: "chat", chatType: "supergroup", isForum: true }))).toMatchObject({
      kind: "group",
      providerMetadata: { isForum: true, chatType: "supergroup" },
    })
  })

  it("counts a basic group's members from the chat itself, and an unknown count as null, not 0", () => {
    const basicFull = peer({
      type: "chat",
      chatType: "group",
      membersCount: 0,
      raw: { _: "chat", participantsCount: 3 },
    })
    expect(peerToChat(basicFull)).toMatchObject({ participantsCount: 3 })
    const supergroup = peer({ type: "chat", chatType: "supergroup", membersCount: 0, raw: { _: "channel" } })
    expect(peerToChat(supergroup)).toMatchObject({ participantsCount: null })
  })

  it("carries a dialog's unread count, mentions, last message time, and muted, archived and pinned marks", () => {
    const dialog = {
      peer: peer({ type: "chat", chatType: "group" }),
      isMuted: true,
      isArchived: true,
      isPinned: true,
      unreadCount: 4,
      unreadMentionsCount: 1,
      lastMessage: { date: new Date("2026-09-27T10:00:00.000Z") },
    } as never
    expect(toChat(dialog)).toMatchObject({
      unreadCount: 4,
      unreadMentions: 1,
      lastMessageAt: "2026-09-27T10:00:00.000Z",
      muted: true,
      archived: true,
      providerMetadata: { pinned: true },
    })
  })

  it("leaves muted out when the chat follows the account's default", () => {
    const dialog = { peer: peer({ type: "user" }), isMuted: null, isArchived: false, unreadMentionsCount: 0 } as never
    expect(toChat(dialog)).not.toHaveProperty("muted")
  })

  it("an account keeps its id as a string", () => {
    expect(toAccount(peer({ type: "user", id: 5, displayName: "" }))).toEqual({ id: "5", name: null, username: null })
  })
})

describe("a reaction update", () => {
  it("is a reaction change on the message it names, and nothing for any other update", () => {
    const update = {
      _: "updateMessageReactions",
      peer: { _: "peerUser", userId: 777 },
      msgId: 7,
      reactions: { _: "messageReactions", results: [{ reaction: { _: "reactionEmoji", emoticon: "🔥" }, count: 2 }] },
    }
    expect(toReactionChange({ update, peers: {} } as never)).toMatchObject({
      event: "reaction",
      chatId: "777",
      messageId: "7",
      reactions: { total: 2 },
    })
    expect(toReactionChange({ update: { _: "updateUserStatus" }, peers: {} } as never)).toBeUndefined()
  })
})

describe("a Telegram group member", () => {
  const user = { id: 777, displayName: "Ana", username: null, isBot: false, isDeleted: false, isScam: false }
  const member = (extra: Record<string, unknown>, own: Record<string, unknown> = {}) =>
    toGroupMember({
      status: "member",
      joinedDate: null,
      invitedBy: null,
      user: { ...user, isFake: false, photo: null, lastOnline: null, ...own },
      ...extra,
    } as unknown as Parameters<typeof toGroupMember>[0])

  it("keeps what the list says for free: when they joined, who brought them, and the account's own marks", () => {
    expect(
      member(
        { joinedDate: new Date("2026-09-01T12:00:00.000Z"), invitedBy: { id: 99 } },
        { isBot: true, isScam: true, photo: {} },
      ),
    ).toMatchObject({
      id: "777",
      joinedAt: "2026-09-01T12:00:00.000Z",
      invitedBy: "99",
      isBot: true,
      deleted: false,
      flagged: "scam",
      hasPhoto: true,
    })
    expect(member({})).toMatchObject({ joinedAt: null, invitedBy: null, hasPhoto: false })
    expect(member({})).not.toHaveProperty("flagged")
  })
})
