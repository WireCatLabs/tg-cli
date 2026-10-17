# Every write states whether repeating it is safe

- A send-like write (send, forward, poll) carries a `random_id` parsed from `--operation-id` (`parseSendId`) before the request; no answer becomes `outcome_unknown` with "Repeat with `--operation-id …`, never without it" (`repeatWith`) and the id as `operation_id`.
- Topic creation carries a `random_id` too, but a lost answer is `retryable: false` and says to check `topics list` and not repeat it.
- Writes without an id go through `feature.write("<thing> may have been <done> — repeating it is safe", …)`; only `timeout` / `network_error` become `outcome_unknown` (`unknownIfUnanswered`).
- A `*_NOT_MODIFIED` reply is success: read the object back and return it.
- Uploads happen before the message exists, so they retry up to `UPLOAD_ATTEMPTS = 3` on network drops only, and say "nothing was sent".

**Why:** Telegram deduplicates by `random_id`, so a repeat with the same id cannot send twice.

See: `src/telegram/feature.ts` (`repeatWith`, `unknownIfUnanswered`, `parseSendId`) · `src/telegram/messages.ts` (`send`, `forward`) · `src/telegram/polls.ts` (`createPoll`) · `src/telegram/topics.ts` (`createTopic`) · `src/telegram/upload.ts`
