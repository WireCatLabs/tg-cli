import type { SenderIdentity } from "@leemour/cli-messaging"
import { getMarkedPeerId, PeersIndex, type TelegramClient } from "@mtcute/node"

type Client = Pick<TelegramClient, "getMe" | "getFullChat" | "resolvePeer" | "call">

/**
 * Reads only. `messages.saveDefaultSendAs` would change the chat's saved choice for every client of
 * the account, so the choice is made per send instead.
 */
export const sendAsIdentities = async (client: Client, chatId: string): Promise<SenderIdentity[]> => {
  const me = await client.getMe()
  const self = { id: String(me.id), title: me.displayName, kind: "self" as const, premiumRequired: false }
  const { full } = await client.getFullChat(Number(chatId))
  if (full._ !== "channelFull") return [{ ...self, default: true }]
  const chosen = full.defaultSendAs ? String(getMarkedPeerId(full.defaultSendAs)) : self.id
  const answer = await client.call({ _: "channels.getSendAs", peer: await client.resolvePeer(Number(chatId)) })
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
