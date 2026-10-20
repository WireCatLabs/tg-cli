# Adapter tests: a fake TelegramClient under the real adapter, timings as exported constants

- A test that opens `TelegramAdapter` replaces only the `TelegramClient` constructor: `vi.mock("@mtcute/node", importOriginal)` spreads the real module and returns a fake held in a `vi.hoisted` stand. mtcute's helpers (`tl`, `Long`, `FileLocation`, `MtPeerNotFoundError`) stay real, so `map.ts` and `errors.ts` see real objects.
- The fake records each call and answers from fields a test sets; a field typed `T | Error` is thrown when it holds an `Error`. One fake per file, sized to what that file needs: `FakeClient` (adapter, bot history), `SeededClient` (the shared contract), `StatsClient` (statistics).
- Mock `./storage.js` so `openSessionStorage` returns an empty object; only the signal test keeps the real storage, wrapped to see what it opened.
- The shared adapter contract is cli-core's `contractCases`, run over `SeededClient` with Telegram's own id shapes (`telegramIds`).
- A feature file's function (`commentsOf`, `pollVotersOf`, `joinRequestsOf`, `sendAsIdentities`) is tested without a module mock: a plain object with the client methods it calls, cast to its parameter type.
- Export every timing and count a test depends on (`LOOP_CHECK_MS`, `HEARTBEAT_TICKS`, `STATE_WAIT_MS`, `TRANSCRIBE_POLL_MS`, `FLOOD_SLEEP`, `UPLOAD_ATTEMPTS`); advance fake timers and count calls by those constants, never by numbers.
- Command tests never reach this layer: they hand `run()` a scripted adapter (`environment-seams`).

**Why:** tg has no port of its own below the adapter: mtcute's `TelegramClient` is the edge, and only `src/telegram/` knows its shapes. Faking the class there tests the adapter and its mapping against real mtcute types; mocking more of the library would test the mock. `wa` fakes its `WhatsAppEngine` port instead, because it has one.

**Open:** Should the `vi.mock` / fake-client setup, repeated in four files, move into `src/testing/`?

See: `src/telegram/adapter.test.ts` (`FakeClient`, `stand`) · `src/telegram/adapter.contract.test.ts` (`SeededClient`, `telegramIds`) · `src/telegram/adapter.stats.test.ts` (`StatsClient`) · `src/telegram/adapter.signal.test.ts` · `src/telegram/comments.test.ts` · `src/telegram/watch.ts` (`LOOP_CHECK_MS`)
