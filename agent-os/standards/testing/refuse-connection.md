# A command that must not connect gets a throwing adapter

- Give `--offline` and local-only commands an `adapter` that throws with the rule as its message ("--offline must never open Telegram").
- When shared across a file, make it a `vi.fn` and check `expect(refuse).not.toHaveBeenCalled()` in `afterAll`, so a swallowed error still fails.
- Leave `TG_API_ID` / `TG_API_HASH` out of `env` to show no credentials are needed.

**Why:** Open — likely a command once swallowed the adapter error and still passed.

**Open:** Should every offline or local test be required to use the `afterAll` check?

See: `src/offline.test.ts:13-25` · `src/search-adoption.test.ts:12-26` · `src/rankings-adoption.test.ts:10-43`
