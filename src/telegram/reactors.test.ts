import { tl } from "@mtcute/node"
import { describe, expect, it, vi } from "vitest"
import { reactorsOf } from "./reactors.js"

const user = (id: number) => ({ _: "user", id, firstName: `Synthetic ${id}`, accessHash: { low: 0, high: 0 } })
const reactedAt = "2026-09-21T14:13:20.000Z"
const reaction = (userId: number, emoticon: string) => ({
  _: "messagePeerReaction",
  peerId: { _: "peerUser", userId },
  date: 1_790_000_000,
  reaction: { _: "reactionEmoji", emoticon },
})

const client = ({
  canSeeList = true,
  reactions = {},
  answer = {},
  failure,
}: {
  canSeeList?: boolean
  reactions?: object | null
  answer?: Record<string, unknown>
  failure?: Error
} = {}) => {
  const call = vi.fn(async (_request: Record<string, unknown>) => {
    if (failure) throw failure
    return { _: "messages.messageReactionsList", chats: [], users: [user(41), user(42)], count: 2, ...answer }
  })
  const getMessages = vi.fn(async () => [
    reactions === null ? { reactions: null } : { reactions: { raw: { canSeeList, ...reactions } } },
  ])
  return { call, fake: { call, getMessages, resolvePeer: async () => ({ _: "inputPeerChannel" }) } as never }
}

describe("reactors", () => {
  it("names each person with their reaction, and hands back the cursor while Telegram has more", async () => {
    const c = client({
      answer: { reactions: [reaction(41, "🔥"), reaction(42, "👍")], nextOffset: "next" },
    })

    expect(await reactorsOf(c.fake, -1007, 3, { limit: 2, emoji: "🔥", cursor: "first" })).toEqual({
      items: [
        { person: { id: "41", name: "Synthetic 41", username: null }, reaction: "🔥", reactedAt },
        { person: { id: "42", name: "Synthetic 42", username: null }, reaction: "👍", reactedAt },
      ],
      hasMore: true,
      cursor: "next",
    })
    expect(c.call.mock.calls[0]?.[0]).toMatchObject({
      _: "messages.getMessageReactionsList",
      id: 3,
      limit: 2,
      offset: "first",
      reaction: { _: "reactionEmoji", emoticon: "🔥" },
    })
  })

  it("answers an empty last page without a cursor, and an unreacted message without asking Telegram", async () => {
    const last = client({ answer: { reactions: [reaction(41, "🔥")], count: 1 } })
    const none = client({ reactions: null })

    expect(await reactorsOf(last.fake, -1007, 3, { limit: 5 })).toMatchObject({ hasMore: false })
    expect(last.call.mock.calls[0]?.[0]).not.toHaveProperty("reaction")
    expect(await reactorsOf(none.fake, -1007, 3, { limit: 5 })).toEqual({ items: [], hasMore: false })
    expect(none.call).not.toHaveBeenCalled()
  })

  it("refuses with a reason where the list is hidden, rather than answering with none", async () => {
    const hidden = client({ canSeeList: false })
    const channel = client({ failure: new tl.RpcError(403, "BROADCAST_FORBIDDEN") })

    await expect(reactorsOf(hidden.fake, -1007, 3, { limit: 5 })).rejects.toMatchObject({
      code: "permission_error",
      details: { reason: "reactions.list-hidden" },
    })
    await expect(reactorsOf(channel.fake, -1007, 3, { limit: 5 })).rejects.toMatchObject({
      code: "permission_error",
      details: { reason: "reactions.broadcast" },
    })
    expect(hidden.call).not.toHaveBeenCalled()
  })
})
