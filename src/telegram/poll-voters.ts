import type { Page, PollVote } from "@leemour/cli-messaging"
import { PeersIndex, parsePeer, type TelegramClient, type tl } from "@mtcute/node"
import { answerId, toMember } from "./map.js"

type Client = Pick<TelegramClient, "call" | "resolvePeer">

/**
 * Newest first, as Telegram lists them. Asked for one answer, Telegram sends each vote without it
 * (`messagePeerVoteInputOption`): it is the answer asked for.
 */
export const pollVotersOf = async (
  client: Client,
  chatId: number,
  messageId: number,
  { limit, answerId: answer }: { limit: number; answerId?: string },
): Promise<Page<PollVote> & { total: number }> => {
  const list = await client.call({
    _: "messages.getPollVotes",
    peer: await client.resolvePeer(chatId),
    id: messageId,
    limit,
    ...(answer === undefined ? {} : { option: Buffer.from(answer, "base64url") }),
  })
  const peers = PeersIndex.from(list)
  const answersOf = (vote: tl.TypeMessagePeerVote) => {
    if (vote._ === "messagePeerVote") return [answerId(vote.option)]
    if (vote._ === "messagePeerVoteMultiple") return vote.options.map(answerId)
    return answer === undefined ? [] : [answer]
  }
  const items = list.votes.map((vote) => ({
    person: toMember(parsePeer(vote.peer, peers)),
    answers: answersOf(vote),
    votedAt: new Date(vote.date * 1000).toISOString(),
  }))
  // Live 2026-10-08, Telegram sent a next offset with one vote of one; the count decides.
  return { items, hasMore: Boolean(list.nextOffset) && items.length < list.count, total: list.count }
}
