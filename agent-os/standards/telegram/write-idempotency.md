# Every write states whether repeating it is safe

- A send-like write (send, forward, poll, topic) carries a `random_id` parsed from `--send-id` before the request; no answer becomes `outcome_unknown` with "Repeat with `--send-id …`, never without it".
- Writes without an id go through `#write("<thing> may have been <done> — repeating it is safe", …)`; only `timeout` / `network_error` become `outcome_unknown`.
- A `*_NOT_MODIFIED` reply is success: read the object back and return it.
- Uploads happen before the message exists, so they retry up to `UPLOAD_ATTEMPTS = 3` on network drops only, and say "nothing was sent".

**Why:** Telegram deduplicates by `random_id`, so a repeat with the same id cannot send twice.

**Open:** `createTopic` carries a `randomId` but is `retryable: false` — which writes does Telegram not deduplicate?

See: `src/telegram/adapter.ts:571-630` · `src/telegram/adapter.ts:2071-2079` · `src/telegram/upload.ts:338-362`
