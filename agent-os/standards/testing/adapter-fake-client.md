# Adapter tests: hoisted fake client, timings as exported constants

- Capture the client with `vi.hoisted` and `vi.mock("@mtcute/node", importOriginal)`; replace only `TelegramClient` with a `FakeClient` whose answer fields can be an `Error`.
- Mock `./storage.js` to a no-op.
- Export every timing the tests advance by (`LOOP_CHECK_MS`, `HEARTBEAT_TICKS`) and advance fake timers by those constants, never by numbers.

**Why:** Open.

**Open:** Should the duplicated `vi.mock` / `FakeClient` setup move into `src/testing/`?

See: `src/telegram/adapter.test.ts:17,301-312` · `src/telegram/adapter.ts:2027-2040`
