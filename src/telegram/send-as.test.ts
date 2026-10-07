import { tl } from "@mtcute/node"
import { describe, expect, it, vi } from "vitest"
import { savedSenderOf, sendAsIdentities, sendAsPeer } from "./send-as.js"

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

    expect(await sendAsIdentities(fake, "-1000000001007")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: false },
      { id: "-1000000000002", title: "Synthetic channel", kind: "channel", premiumRequired: false, default: true },
      { id: "-1000000000003", title: "Synthetic group", kind: "group", premiumRequired: true, default: false },
    ])
    expect(call).toHaveBeenCalledWith({
      _: "channels.getSendAs",
      peer: expect.objectContaining({ channelId: -1000000001007 }),
    })
  })

  it("defaults to the account when the supergroup saved no choice", async () => {
    const { fake } = client({ _: "channelFull" }, { peers: [], chats: [], users: [] })
    expect(await sendAsIdentities(fake, "-1000000001007")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: true },
    ])
  })

  it.each(["-7", "42"])("offers only the account in a basic group or a private chat: %s", async (chat) => {
    const { fake, call } = client({ _: "chatFull" })
    const getFullChat = vi.spyOn(fake, "getFullChat")
    expect(await sendAsIdentities(fake, chat)).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: true },
    ])
    expect(getFullChat).not.toHaveBeenCalled()
    expect(call).not.toHaveBeenCalled()
  })

  it("offers only the account in a supergroup without send-as, and keeps other refusals", async () => {
    const { fake, call } = client({ _: "channelFull" })
    call.mockRejectedValueOnce(new tl.RpcError(400, "PEER_ID_INVALID"))
    expect(await sendAsIdentities(fake, "-1000000001007")).toEqual([
      { id: "1", title: "Owner", kind: "self", premiumRequired: false, default: true },
    ])
    call.mockRejectedValueOnce(new tl.RpcError(400, "CHANNEL_PRIVATE"))
    await expect(sendAsIdentities(fake, "-1000000001007")).rejects.toThrow("CHANNEL_PRIVATE")
  })

  it("skips a peer Telegram did not describe", async () => {
    const { fake } = client(
      { _: "channelFull" },
      { peers: [{ _: "sendAsPeer", peer: { _: "peerChannel", channelId: 9 } }], chats: [], users: [] },
    )
    expect(await sendAsIdentities(fake, "-1000000001007")).toHaveLength(1)
  })
})

describe("the send_as peer", () => {
  it("is passed in a supergroup, left out for the account elsewhere, and refused for another identity there", () => {
    expect(sendAsPeer("-1000000001007", "-1002", "1")).toBe(-1002)
    expect(sendAsPeer("-1000000001007", "1", "1")).toBe(1)
    expect(sendAsPeer("-7", "1", "1")).toBeUndefined()
    expect(sendAsPeer("42", "1", "1")).toBeUndefined()
    expect(() => sendAsPeer("-7", "-1002", "1")).toThrow("only a supergroup")
    expect(() => sendAsPeer("-1000000001007", "@channel", "1")).toThrow("--send-as takes")
  })
})

describe("the saved sender", () => {
  const full = (value: unknown) => ({ getFullChat: vi.fn(async () => ({ full: value })) })

  it("is the saved channel of a supergroup, and nothing where it is the account, unset, or not a supergroup", async () => {
    const channel = full({ _: "channelFull", defaultSendAs: { _: "peerChannel", channelId: 2 } })
    expect(await savedSenderOf(channel, "-1000000001007", "1")).toBe("-1000000000002")
    expect(
      await savedSenderOf(
        full({ _: "channelFull", defaultSendAs: { _: "peerUser", userId: 1 } }),
        "-1000000001007",
        "1",
      ),
    ).toBeNull()
    expect(await savedSenderOf(full({ _: "channelFull" }), "-1000000001007", "1")).toBeNull()
    const basic = full({ _: "chatFull" })
    expect(await savedSenderOf(basic, "-7", "1")).toBeNull()
    expect(basic.getFullChat).not.toHaveBeenCalled()
  })
})
