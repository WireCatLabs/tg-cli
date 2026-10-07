import { tl } from "@mtcute/node"
import { describe, expect, it, vi } from "vitest"
import { answerJoinRequestOf, joinRequestsOf } from "./join-requests.js"

const member = (id: number, bio: string | null) => ({
  user: { id, displayName: `Synthetic ${id}`, username: null },
  date: new Date("2026-10-07T18:00:00Z"),
  bio,
})

const client = (total: number, members: ReturnType<typeof member>[]) => {
  const getInviteLinkMembers = vi.fn(async () => Object.assign(members, { total }))
  const hideJoinRequest = vi.fn(async () => {})
  return { getInviteLinkMembers, hideJoinRequest, fake: { getInviteLinkMembers, hideJoinRequest } as never }
}

describe("join requests", () => {
  it("lists pending requests only, with the note where they wrote one, and whether more remain", async () => {
    const c = client(3, [member(41, "synthetic note"), member(42, null)])
    expect(await joinRequestsOf(c.fake, -1007, 2)).toEqual({
      items: [
        {
          person: { id: "41", name: "Synthetic 41", username: null },
          requestedAt: "2026-10-07T18:00:00.000Z",
          about: "synthetic note",
        },
        { person: { id: "42", name: "Synthetic 42", username: null }, requestedAt: "2026-10-07T18:00:00.000Z" },
      ],
      hasMore: true,
      total: 3,
    })
    expect(c.getInviteLinkMembers).toHaveBeenCalledWith(-1007, { requested: true, limit: 2 })
    expect((await joinRequestsOf(c.fake, -1007, 2, { link: "https://t.me/+one" })).total).toBe(3)
    expect(c.getInviteLinkMembers).toHaveBeenLastCalledWith(-1007, {
      requested: true,
      limit: 2,
      link: "https://t.me/+one",
    })
    await joinRequestsOf(c.fake, -1007, 2, { search: "Ana" })
    expect(c.getInviteLinkMembers).toHaveBeenLastCalledWith(-1007, {
      requested: true,
      limit: 2,
      requestedSearch: "Ana",
    })
    expect((await joinRequestsOf(client(1, [member(41, null)]).fake, -1007, 5)).hasMore).toBe(false)
  })

  it.each([
    [true, "approve"],
    [false, "decline"],
  ] as const)("answers accept=%s as %s", async (accept, action) => {
    const c = client(0, [])
    expect(await answerJoinRequestOf(c.fake, -1007, 42, accept)).toEqual({ already: false })
    expect(c.hideJoinRequest).toHaveBeenCalledWith({ chatId: -1007, user: 42, action })
  })

  it("reads an existing member as already in, a missing request as not_found, and passes the rest on", async () => {
    const c = client(0, [])
    c.hideJoinRequest.mockRejectedValueOnce(new tl.RpcError(400, "USER_ALREADY_PARTICIPANT"))
    expect(await answerJoinRequestOf(c.fake, -1007, 42, true)).toEqual({ already: true })
    c.hideJoinRequest.mockRejectedValueOnce(new tl.RpcError(400, "HIDE_REQUESTER_MISSING"))
    await expect(answerJoinRequestOf(c.fake, -1007, 42, false)).rejects.toMatchObject({ code: "not_found" })
    c.hideJoinRequest.mockRejectedValueOnce(new tl.RpcError(400, "CHAT_ADMIN_REQUIRED"))
    await expect(answerJoinRequestOf(c.fake, -1007, 42, true)).rejects.toBeInstanceOf(tl.RpcError)
  })
})
