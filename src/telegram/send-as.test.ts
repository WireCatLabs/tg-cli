import { describe, expect, it, vi } from "vitest"
import { sendAsIdentities } from "./send-as.js"

const me = { id: 1, displayName: "Owner" }
const channel = (id: number, title: string, broadcast: boolean) => ({ _: "channel", id, title, broadcast })

const client = (full: unknown, answer?: unknown) => {
  const call = vi.fn(async () => answer)
  return {
    call,
    fake: {
      getMe: async () => me,
      getFullChat: async () => ({ full }),
      resolvePeer: async (peer: number) => ({ _: "inputPeerChannel", channelId: peer, accessHash: 0 }),
      call,
    } as unknown as Parameters<typeof sendAsIdentities>[0],
  }
}

describe("sender identities", () => {
  it("lists the account and the channels a supergroup offers, with its saved choice", async () => {
    const { fake, call } = client(
      { _: "channelFull", defaultSendAs: { _: "peerChannel", channelId: 2 } },
      {
        peers: [
          { _: "sendAsPeer", peer: { _: "peerUser", userId: 1 } },
          { _: "sendAsPeer", peer: { _: "peerChannel", channelId: 2 } },
          { _: "sendAsPeer", peer: { _: "peerChannel", channelId: 3 }, premiumRequired: true },
        ],
        chats: [channel(2, "Synthetic channel", true), channel(3, "Synthetic group", false)],
        users: [],
      },
    )

    expect(await sendAsIdentities(fake, "-1007")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: false },
      { id: "-1000000000002", title: "Synthetic channel", kind: "channel", premiumRequired: false, default: true },
      { id: "-1000000000003", title: "Synthetic group", kind: "group", premiumRequired: true, default: false },
    ])
    expect(call).toHaveBeenCalledWith({ _: "channels.getSendAs", peer: expect.objectContaining({ channelId: -1007 }) })
  })

  it("defaults to the account when the supergroup saved no choice", async () => {
    const { fake } = client({ _: "channelFull" }, { peers: [], chats: [], users: [] })
    expect(await sendAsIdentities(fake, "-1007")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: true },
    ])
  })

  it("offers only the account in a basic group or a private chat, without asking Telegram for more", async () => {
    const { fake, call } = client({ _: "chatFull" })
    expect(await sendAsIdentities(fake, "-7")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: true },
    ])
    expect(call).not.toHaveBeenCalled()
  })

  it("skips a peer Telegram did not describe", async () => {
    const { fake } = client(
      { _: "channelFull" },
      { peers: [{ _: "sendAsPeer", peer: { _: "peerChannel", channelId: 9 } }], chats: [], users: [] },
    )
    expect(await sendAsIdentities(fake, "-1007")).toHaveLength(1)
  })
})
