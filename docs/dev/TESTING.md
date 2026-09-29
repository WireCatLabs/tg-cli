# Testing

```sh
pnpm lint && pnpm typecheck && pnpm test:coverage   # what CI runs, with the coverage floor
pnpm docs:check                                     # links, anchors, user pages, the changelog's shape
pnpm test:slow                                      # the 20 slowest tests and the 10 slowest files
pnpm build && pnpm smoke:bun                        # the built command, executed under Bun
```

CI runs all of them ([ci.yml](../../.github/workflows/ci.yml)). Windows and macOS run by hand before
a release: Actions → Windows and macOS → Run workflow ([windows.yml](../../.github/workflows/windows.yml)).
The reasons behind each rule below are in
[max-cli's TESTING.md](https://github.com/leemour/max-cli/blob/main/docs/dev/TESTING.md), where they
were learnt.

## No test touches the owner's account or files

`src/testing/sandbox.ts`, a vitest `setupFiles` entry, points config, state, cache and the shared
message store at a temporary directory, and clears `TG_API_ID`, `TG_API_HASH`, `TG_PROFILE`,
`TG_PROFILE_LOCK` and `TG_TIMEOUT` for every test file. The moved directories also move the keyring
entry. **A new variable that can point at something real goes there.**

Telegram is never contacted: command tests hand `run()` a scripted adapter, and the adapter's own
test replaces mtcute's `TelegramClient` with a stand-in. A test that could open a browser
(`session start --app browser`) or reach my.telegram.org (`--app auto`) mocks that module.

## No test waits for real

The whole suite runs in about a second. A test that takes a round second is sleeping in the code
under test; inject the wait instead — `watch` and `serve` take `signal` in the environment, and a
scripted adapter answers at once. `pnpm test:slow` shows where time goes.

## Coverage has a floor

`vitest.config.ts` holds it: lines 93 %, statements 92 %, functions 90 %, branches 80 % over `src/`,
and **every file at least 50 % of its lines**. The numbers sit just under what the suite reached on
2026-09-29 (lines 94.9 %). Raise them when coverage rises; never lower them to let a change through —
write the test instead. Only the entry point `src/bin/` is left out, with its reason in the config.

**A new adapter method comes with its test** in `src/telegram/adapter.test.ts`, or `adapter.ts` can
fall under the per-file floor.

## The second runtime

`scripts/smoke.ts` runs the built `dist/bin/tg.js` under Bun with directories of its own: the version,
help and an unknown option, `doctor`, a failure kept as a run, and tg's session storage over
`bun:sqlite`. Bun cannot run the vitest suite, so this is the only proof the Bun path works.
