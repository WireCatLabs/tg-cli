import type { Page, PollVote } from "@leemour/cli-messaging"
import { PeersIndex, parsePeer, type TelegramClient, type tl } from "@mtcute/node"
import { answerId, toMember } from "./map.js"

type Client = Pick<TelegramClient, "call" | "resolvePeer">

/**
 * Newest first, as Telegram lists them. The account's own vote comes without its answers
 * (`messagePeerVoteInputOption`); `mine` gives them, from the poll's `chosen` answers.
 */
export const pollVotersOf = async (
  client: Client,
  chatId: number,
  messageId: number,
  { limit, answerId: answer, mine }: { limit: number; answerId?: string; mine: () => Promise<string[]> },
): Promise<Page<PollVote> & { total: number }> => {
  const list = await client.call({
    _: "messages.getPollVotes",
    peer: await client.resolvePeer(chatId),
    id: messageId,
    limit,
    ...(answer === undefined ? {} : { option: Buffer.from(answer, "base64url") }),
  })
  const peers = PeersIndex.from(list)
  const answersOf = async (vote: tl.TypeMessagePeerVote) => {
    if (vote._ === "messagePeerVote") return [answerId(vote.option)]
    if (vote._ === "messagePeerVoteMultiple") return vote.options.map(answerId)
    return mine()
  }
  const items: PollVote[] = []
  for (const vote of list.votes) {
    items.push({
      person: toMember(parsePeer(vote.peer, peers)),
      answers: await answersOf(vote),
      votedAt: new Date(vote.date * 1000).toISOString(),
    })
  }
  return { items, hasMore: Boolean(list.nextOffset), total: list.count }
}
