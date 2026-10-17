import type { Poll as TgPoll } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Poll } from "@wirecat/cli-core"
import type { NewPoll } from "@wirecat/cli-core/cli"
import { pollClosed } from "./errors.js"
import {
  type Feature,
  messageNumber,
  parseSendId,
  repeatWith,
  retryDetails,
  type Sent,
  topicNumber,
  unknownIfUnanswered,
  type Words,
} from "./feature.js"
import { answerId, toInputPoll, toMessage, toPoll } from "./map.js"
import { pollVotersOf } from "./poll-voters.js"
import { sendAsPeer } from "./send-as.js"

/** What Telegram would refuse anyway, said before anything is sent — the same checks max-cli makes. */
const refuseVote = (poll: TgPoll, answerIds: readonly string[], words: Words): void => {
  if (poll.isClosed) throw new CliError("validation_error", pollClosed(words))
  const voted = poll.answers.some((answer) => answer.chosen)
  if (answerIds.length === 0 && !voted) throw new CliError("validation_error", "you have not voted in this poll")
  if (voted && poll.isRevotingDisabled)
    throw new CliError("validation_error", "this poll takes one vote, and yours is final — it cannot be changed")
  if (answerIds.length > 1 && !poll.isMultiple)
    throw new CliError("validation_error", "this poll takes one answer; give one id")
}

const refuseClose = (poll: TgPoll): void => {
  if (poll.isClosed) throw new CliError("validation_error", "this poll is closed already")
  if (!poll.isCreator) throw new CliError("permission_error", "only whoever made a poll can close it")
}

export const poll = (feature: Feature, chatId: string, messageId: string): Promise<Poll> => {
  return feature.call(async () => toPoll(chatId, messageId, await pollOf(feature, chatId, messageId)))
}

export const pollVoters = (
  feature: Feature,
  chatId: string,
  messageId: string,
  window: { limit: number; answerId?: string },
) => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(() => pollVotersOf(feature.client, Number(chatId), id, window))
}

/** Votes by the answers' own bytes, never by index: mtcute would fetch the poll and pick by position. */
export const vote = (feature: Feature, chatId: string, messageId: string, answerIds: string[]): Promise<Poll> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(async () => {
    const current = await pollOf(feature, chatId, messageId)
    const known = new Map(current.answers.map((answer) => [answerId(answer.data), answer.data]))
    const unknown = answerIds.filter((answer) => !known.has(answer))
    if (unknown.length > 0) {
      throw new CliError(
        "validation_error",
        `${unknown.join(", ")} ${unknown.length === 1 ? "is" : "are"} not an answer of this poll — its answers are ${[...known.keys()].join(", ")}`,
      )
    }
    refuseVote(current, answerIds, feature.checks)
    const options = answerIds.length === 0 ? null : answerIds.map((answer) => known.get(answer) as Uint8Array)
    try {
      return toPoll(chatId, messageId, await feature.client.sendVote({ chatId: Number(chatId), message: id, options }))
    } catch (error) {
      throw unknownIfUnanswered(error, "the vote may have been cast — repeating it is safe")
    }
  })
}

export const closePoll = (feature: Feature, chatId: string, messageId: string): Promise<Poll> => {
  const id = messageNumber(messageId, "a message id is a number")
  return feature.call(async () => {
    refuseClose(await pollOf(feature, chatId, messageId))
    try {
      return toPoll(chatId, messageId, await feature.client.closePoll({ chatId: Number(chatId), message: id }))
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the poll may have been closed",
        check: "polls.show",
        after: "before repeating",
      })
    }
  })
}

/**
 * One `random_id` per logical create, as a send has: a retry repeats it and Telegram keeps one poll
 * (measured 2026-10-08: the second call answered the first poll's message id — unlike topic creation).
 */
export const createPoll = (
  feature: Feature,
  chatId: string,
  poll: NewPoll,
  { sendId, silent, threadId, sendAs }: { sendId: string; silent?: boolean; threadId?: string; sendAs?: string },
): Promise<Sent> => {
  const randomId = parseSendId(sendId)
  const thread = threadId === undefined ? undefined : topicNumber(threadId)
  const author = sendAs === undefined ? undefined : sendAsPeer(chatId, sendAs, feature.self(), feature.checks)
  return feature.send(async () => {
    try {
      const message = await feature.client.sendMedia(Number(chatId), toInputPoll(poll), {
        randomId,
        ...(thread === undefined || thread === 1 ? {} : { threadId: thread }),
        ...(silent ? { silent } : {}),
        ...(author === undefined ? {} : { sendAs: author }),
      })
      return { message: toMessage(message), sendId }
    } catch (error) {
      throw unknownIfUnanswered(
        error,
        `the poll may have been sent. Repeat with ${repeatWith(sendId, sendAs)}, never without it`,
        retryDetails(sendId, sendAs),
      )
    }
  })
}

const pollOf = async (feature: Feature, chatId: string, messageId: string): Promise<TgPoll> => {
  const id = messageNumber(messageId, "a message id is a number")
  const [found] = await feature.client.getMessages(Number(chatId), [id])
  if (!found) throw new CliError("not_found", `no message ${id} in that chat`)
  if (found.media?.type !== "poll") throw new CliError("not_found", `message ${id} carries no poll`)
  return found.media
}
