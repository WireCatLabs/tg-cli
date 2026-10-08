# Every Bot API write passes { reads: false }

- A state-changing `transport.call` passes `{ reads: false }`; reads use the default.
- A write with no answer becomes `outcome_unknown`, `retryable: false`; a read with no answer becomes `timeout` / `network_error`, `retryable: true`.
- `bot api` takes the flag from the manifest (`operation.effect === "read"`), never by hand.
- A proxy failure or a cancelled signal returns before this check.

**Why:** A write that got no answer may have happened; retrying it could do it twice.

**Open:** Should "a write with no answer is never retried" be a rule for every transport in tg and max?

See: `src/bot/transport.ts:53-56` · `src/bot/transport.ts:144-163` · `src/commands/bot-api.ts:388`
