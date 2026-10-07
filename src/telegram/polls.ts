import { CliError } from "@leemour/cli-core"
import type { Poll as TgPoll } from "@mtcute/node"

/** What Telegram would refuse anyway, said before anything is sent — the same checks max-cli makes. */
export const refuseVote = (poll: TgPoll, answerIds: readonly string[]): void => {
  if (poll.isClosed) throw new CliError("validation_error", "this poll is closed; `tg polls show` has its result")
  const voted = poll.answers.some((answer) => answer.chosen)
  if (answerIds.length === 0 && !voted) throw new CliError("validation_error", "you have not voted in this poll")
  if (voted && poll.isRevotingDisabled)
    throw new CliError("validation_error", "this poll takes one vote, and yours is final — it cannot be changed")
  if (answerIds.length > 1 && !poll.isMultiple)
    throw new CliError("validation_error", "this poll takes one answer; give one id")
}

export const refuseClose = (poll: TgPoll): void => {
  if (poll.isClosed) throw new CliError("validation_error", "this poll is closed already")
  if (!poll.isCreator) throw new CliError("permission_error", "only whoever made a poll can close it")
}
