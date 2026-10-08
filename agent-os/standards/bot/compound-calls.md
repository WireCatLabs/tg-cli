# Two-call operations report the half that succeeded

- When one verb needs two Bot API calls, the second ends with `.catch((e) => halfDone("<what already happened>", e))`.
- `halfDone` keeps the second error's code and puts the finished part in front of the message; a non-`CliError` is rethrown unchanged.
- There is no rollback of the first call.

**Why:** The caller learns exactly what state the chat is in.

**Open:** Was rollback rejected because undoing is itself a write that can fail?

See: `src/bot/adapter.ts:24-28` · `src/bot/adapter.ts:163-165` · `src/bot/adapter.ts:261-263`
