# map.ts declares only the Bot API fields it reads

- Hand-written `Tg*` interfaces hold only the fields read, each with a JSDoc link to `core.telegram.org/bots/api#…`; never import the full `generated/types.ts` into the adapter or mapper.
- Vocabulary tables are `Record` / `as const` with `satisfies` (`KINDS`, `ENTITY`, `ACTIONS`).
- An unmapped value throws `validation_error` ("a Telegram bot cannot …") or becomes `event: "other"` under Telegram's own name.
- Ids become strings here with `String(...)` and go back with `Number()` (ids fit in 52 bits).

**Why:** Open — the code doesn't say.

**Open:** Why partial hand-written types when `generated/types.ts` has the full ones — regeneration churn, or its ids typed as strings?

See: `src/bot/map.ts:14-64` · `src/bot/adapter.ts:30-49`
