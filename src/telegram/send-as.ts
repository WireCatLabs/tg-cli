import { CliError } from "@leemour/cli-core"
import type { SenderIdentity } from "@leemour/cli-messaging"
import { getBasicPeerType, getMarkedPeerId, PeersIndex, type TelegramClient, tl } from "@mtcute/node"

type Client = Pick<TelegramClient, "getMe" | "getFullChat" | "resolvePeer" | "call">

/**
 * Reads only. `messages.saveDefaultSendAs` would change the chat's saved choice for every client of
 * the account, so the choice is made per send instead.
 */
export const sendAsIdentities = async (client: Client, chatId: string): Promise<SenderIdentity[]> => {
  const me = await client.getMe()
  const self = { id: String(me.id), title: me.displayName, kind: "self" as const, premiumRequired: false }
  const alone = [{ ...self, default: true }]
  if (getBasicPeerType(Number(chatId)) !== "channel") return alone
  const { full } = await client.getFullChat(Number(chatId))
  if (full._ !== "channelFull") return alone
  const chosen = full.defaultSendAs ? String(getMarkedPeerId(full.defaultSendAs)) : self.id
  let answer: tl.channels.TypeSendAsPeers
  try {
    answer = await client.call({ _: "channels.getSendAs", peer: await client.resolvePeer(Number(chatId)) })
  } catch (error) {
    // Measured 2026-10-04: a private supergroup the account is in answers PEER_ID_INVALID — no send-as there.
    if (tl.RpcError.is(error, "PEER_ID_INVALID")) return alone
    throw error
  }
  const index = PeersIndex.from(answer)
  const others = answer.peers.flatMap(({ peer, premiumRequired }) => {
    const found = index.has(peer) ? index.get(peer) : undefined
    if (found?._ !== "channel") return []
    return [
      {
        id: String(getMarkedPeerId(peer)),
        title: found.title,
        kind: found.broadcast ? ("channel" as const) : ("group" as const),
        premiumRequired: premiumRequired === true,
      },
    ]
  })
  return [self, ...others].map((one) => ({ ...one, default: one.id === chosen }))
}

/**
 * The group's saved default sender, when it is not the account: Telegram posts as it when a send names none
 * (measured 2026-10-07: a comment went out as the linked channel). One request, a supergroup only.
 */
export const savedSenderOf = async (
  client: Pick<TelegramClient, "getFullChat">,
  chatId: string,
  self: string | null,
): Promise<string | null> => {
  if (getBasicPeerType(Number(chatId)) !== "channel") return null
  const { full } = await client.getFullChat(Number(chatId))
  if (full._ !== "channelFull" || !full.defaultSendAs) return null
  const saved = String(getMarkedPeerId(full.defaultSendAs))
  return saved === self ? null : saved
}

/** Telegram takes `send_as` in channels and supergroups only; elsewhere the account is the one author. */
export const sendAsPeer = (chatId: string, sendAs: string, self: string | null): number | undefined => {
  if (!/^-?\d{1,16}$/.test(sendAs) || !Number.isSafeInteger(Number(sendAs))) {
    throw new CliError("validation_error", "--send-as takes an id from `tg chats send-as`")
  }
  if (getBasicPeerType(Number(chatId)) === "channel") return Number(sendAs)
  if (sendAs === self) return undefined
  throw new CliError("validation_error", "only a supergroup offers identities other than the account")
}
