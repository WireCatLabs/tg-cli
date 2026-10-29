import { PeersIndex, parsePeer, type TelegramClient, tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Page, Reactor } from "@wirecat/cli-core"
import { toMember } from "./map.js"

type Client = Pick<TelegramClient, "call" | "resolvePeer" | "getMessages">

const nameOf = (reaction: tl.TypeReaction): string | null => {
  if (reaction._ === "reactionEmoji") return reaction.emoticon
  if (reaction._ === "reactionCustomEmoji") return `custom:${String(reaction.documentId)}`
  return reaction._ === "reactionPaid" ? "paid" : null
}

/**
 * Newest first. A message nobody reacted to is an empty list; one whose list Telegram hides is an error, because an
 * empty answer would read as "nobody reacted". `canSeeList` rides on the message, `BROADCAST_FORBIDDEN` on the call.
 */
export const reactorsOf = async (
  client: Client,
  chatId: number,
  messageId: number,
  { limit, emoji, cursor }: { limit: number; emoji?: string; cursor?: string },
): Promise<Page<Reactor> & { cursor?: string }> => {
  const [found] = await client.getMessages(chatId, [messageId])
  if (!found) throw new CliError("not_found", `no message ${messageId} in that chat`)
  if (!found.reactions) return { items: [], hasMore: false }
  if (!found.reactions.raw.canSeeList)
    throw new CliError("permission_error", "this chat does not let its members see who reacted", {
      reason: "reactions.list-hidden",
    })

  const list = await client
    .call({
      _: "messages.getMessageReactionsList",
      peer: await client.resolvePeer(chatId),
      id: messageId,
      limit,
      ...(emoji === undefined ? {} : { reaction: { _: "reactionEmoji", emoticon: emoji } }),
      ...(cursor === undefined ? {} : { offset: cursor }),
    })
    .catch((error: unknown) => {
      if (error instanceof tl.RpcError && error.text === "BROADCAST_FORBIDDEN")
        throw new CliError("permission_error", "a channel does not show who reacted to its posts", {
          reason: "reactions.broadcast",
        })
      throw error
    })
  const peers = PeersIndex.from(list)
  const items = list.reactions.flatMap((one) => {
    const reaction = nameOf(one.reaction)
    if (reaction === null) return []
    return [
      {
        person: toMember(parsePeer(one.peerId, peers)),
        reaction,
        reactedAt: new Date(one.date * 1000).toISOString(),
      },
    ]
  })
  // Live 2026-10-29: Telegram sent nextOffset on a last page of 4 asked with limit 20; a short page is the last.
  const more = Boolean(list.nextOffset) && list.reactions.length >= limit
  return { items, hasMore: more, ...(more && list.nextOffset ? { cursor: list.nextOffset } : {}) }
}
