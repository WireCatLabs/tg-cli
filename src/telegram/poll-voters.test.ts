import { describe, expect, it, vi } from "vitest"
import { pollVotersOf } from "./poll-voters.js"

const yes = new Uint8Array([48])
const no = new Uint8Array([49])
const user = (id: number) => ({ _: "user", id, firstName: `Synthetic ${id}`, accessHash: { low: 0, high: 0 } })

const client = (answer: Record<string, unknown>) => {
  const call = vi.fn(async (_request: Record<string, unknown>) => ({
    _: "messages.votesList",
    chats: [],
    users: [user(41), user(42), user(1)],
    ...answer,
  }))
  return { call, fake: { call, resolvePeer: async () => ({ _: "inputPeerChannel" }) } as never }
}

describe("poll voters", () => {
  it("names each voter with their answers, the account's own from the poll, and says whether more remain", async () => {
    const c = client({
      count: 4,
      nextOffset: "next",
      votes: [
        { _: "messagePeerVote", peer: { _: "peerUser", userId: 41 }, option: yes, date: 1_790_000_000 },
        { _: "messagePeerVoteMultiple", peer: { _: "peerUser", userId: 42 }, options: [yes, no], date: 1_790_000_000 },
        { _: "messagePeerVoteInputOption", peer: { _: "peerUser", userId: 1 }, date: 1_790_000_000 },
      ],
    })
    const mine = vi.fn(async () => ["MQ"])

    const page = await pollVotersOf(c.fake, -1007, 3, { limit: 3, mine })

    expect(page).toEqual({
      items: [
        {
          person: { id: "41", name: "Synthetic 41", username: null },
          answers: ["MA"],
          votedAt: "2026-09-21T14:13:20.000Z",
        },
        {
          person: { id: "42", name: "Synthetic 42", username: null },
          answers: ["MA", "MQ"],
          votedAt: "2026-09-21T14:13:20.000Z",
        },
        {
          person: { id: "1", name: "Synthetic 1", username: null },
          answers: ["MQ"],
          votedAt: "2026-09-21T14:13:20.000Z",
        },
      ],
      hasMore: true,
      total: 4,
    })
    expect(c.call.mock.calls[0]?.[0]).toMatchObject({ _: "messages.getPollVotes", id: 3, limit: 3 })
    expect(c.call.mock.calls[0]?.[0]).not.toHaveProperty("option")
  })

  it("asks for one answer by its own bytes, and reads no poll when the account's vote is not on the page", async () => {
    const c = client({ count: 0, votes: [] })
    const mine = vi.fn(async () => [])

    expect(await pollVotersOf(c.fake, -1007, 3, { limit: 5, answerId: "MQ", mine })).toEqual({
      items: [],
      hasMore: false,
      total: 0,
    })
    expect(c.call.mock.calls[0]?.[0]).toMatchObject({ option: Buffer.from(no) })
    expect(mine).not.toHaveBeenCalled()
  })
})
