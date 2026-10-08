import { describe, expect, it, vi } from "vitest"
import { pollVotersOf } from "./poll-voters.js"

const yes = new Uint8Array([48])
const no = new Uint8Array([49])
const user = (id: number) => ({ _: "user", id, firstName: `Synthetic ${id}`, accessHash: { low: 0, high: 0 } })
const votedAt = "2026-09-21T14:13:20.000Z"

const client = (answer: Record<string, unknown>) => {
  const call = vi.fn(async (_request: Record<string, unknown>) => ({
    _: "messages.votesList",
    chats: [],
    users: [user(41), user(42)],
    ...answer,
  }))
  return { call, fake: { call, resolvePeer: async () => ({ _: "inputPeerChannel" }) } as never }
}

describe("poll voters", () => {
  it("names each voter with their answers, and says more remain only when the count says so", async () => {
    const votes = [
      { _: "messagePeerVote", peer: { _: "peerUser", userId: 41 }, option: yes, date: 1_790_000_000 },
      { _: "messagePeerVoteMultiple", peer: { _: "peerUser", userId: 42 }, options: [yes, no], date: 1_790_000_000 },
    ]
    const more = client({ count: 3, nextOffset: "next", votes })
    const all = client({ count: 2, nextOffset: "next", votes })

    expect(await pollVotersOf(more.fake, -1007, 3, { limit: 2 })).toEqual({
      items: [
        { person: { id: "41", name: "Synthetic 41", username: null }, answers: ["MA"], votedAt },
        { person: { id: "42", name: "Synthetic 42", username: null }, answers: ["MA", "MQ"], votedAt },
      ],
      hasMore: true,
      total: 3,
    })
    expect((await pollVotersOf(all.fake, -1007, 3, { limit: 2 })).hasMore).toBe(false)
    expect(more.call.mock.calls[0]?.[0]).toMatchObject({ _: "messages.getPollVotes", id: 3, limit: 2 })
    expect(more.call.mock.calls[0]?.[0]).not.toHaveProperty("option")
  })

  it("asks for one answer by its own bytes, and gives that answer to each vote Telegram sends without it", async () => {
    const c = client({
      count: 1,
      votes: [{ _: "messagePeerVoteInputOption", peer: { _: "peerUser", userId: 41 }, date: 1_790_000_000 }],
    })

    expect(await pollVotersOf(c.fake, -1007, 3, { limit: 5, answerId: "MQ" })).toEqual({
      items: [{ person: { id: "41", name: "Synthetic 41", username: null }, answers: ["MQ"], votedAt }],
      hasMore: false,
      total: 1,
    })
    expect(c.call.mock.calls[0]?.[0]).toMatchObject({ option: Buffer.from(no) })
  })
})
