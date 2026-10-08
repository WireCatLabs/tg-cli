# Bot API refusals map by HTTP status, not error_code

- `parameters.retry_after` first → `rate_limited` with `retryAfterMs`, `retryable: true`.
- `parameters.migrate_to_chat_id` next → `not_found` with `migratedTo`.
- Then 401/404 → `authentication_error`, 403 → `permission_error`, 5xx → `provider_unavailable`, a "not found" description → `not_found`, 400 → `validation_error`, else `provider_error`.
- Telegram's description always goes into the message.

**Why:** Telegram documents `error_code` as subject to change; a 404 means the token could not be parsed (`transport.ts:185,206`).

**Open:** Should this table be the documented contract for Bot API errors, beside `src/telegram/errors.ts`?

See: `src/bot/transport.ts:183-222`
