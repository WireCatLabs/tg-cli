# Generated Bot API code is never edited, and it decides policy

- `src/bot/generated/*` and `docs/dev/bot-api-coverage.md` start with `GENERATED. DO NOT EDIT`; change the spec or the generator (`pnpm bot:generate`).
- Every operation with `effect === "destructive"` defaults to `ask` under `bot.api.<command>`; every non-read goes through `guardedWrite`.
- A `response.sensitive` operation never prints its credential: check it with `getMe`, store it in the keyring, print a receipt.
- A body file holding secrets must be owner-only (`mode & 0o077 === 0`).

**Why:** Policy follows the spec, so a new Bot API method is safe by default.

**Open:** `getUpdates` is `destructive` because it moves the offset — is "moves server-side state" the intended definition?

See: `src/bot/generated/manifest.ts:1-3` · `src/commands/bot-api.ts:309-343`
