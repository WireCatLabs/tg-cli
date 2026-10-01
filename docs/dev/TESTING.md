# Testing

```sh
pnpm lint && pnpm typecheck && pnpm test:coverage   # what CI runs, with the coverage floor
pnpm test:matrix                                    # every command and option has a test or a reason
pnpm docs:check                                     # links, anchors, user pages, the changelog's shape
pnpm test:slow                                      # the 20 slowest tests and the 10 slowest files
pnpm build && pnpm smoke:bun                        # the built command, executed under Bun
```

CI runs all of them ([ci.yml](../../.github/workflows/ci.yml)). Windows and macOS run by hand before
a release: Actions → Windows and macOS → Run workflow ([windows.yml](../../.github/workflows/windows.yml)).
What only the real Telegram can check, and how, is [live-scenarios.md](live-scenarios.md); the
`release`, `test-live` and `add-command` skills in `.claude/skills/` walk an agent through it.
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

## Every command and option has a test, or a reason

```sh
pnpm test:matrix       # the suite, a fresh build, then docs/dev/test-matrix.md; fails on any ❌
```

[`test-matrix.md`](test-matrix.md) lists every command and option of `tg` and marks each ✅ (a test
drove it through `run()`), ⛔ (not testable offline — the reason and where it is checked instead) or
❌ (nothing). CI fails on a ❌, on a ⛔ entry that names nothing any more, and on a stale page.

It is **measured, not searched for**: under vitest (`TG_TEST_ARGV_LOG`, set by the sandbox) each
top-level command's `preAction` hook appends the command path and the option names given to
`coverage/argv.jsonl` — names, never a value (`src/program.ts`, `logParsed`). The hook sits on the
top-level commands because the root program is built inside cli-messaging. A flag a test only
mentions does not count, and neither does a test that calls a function directly: the matrix is
about what a person types.

The ⛔ list is `scripts/test-matrix-untested.ts`. A new command or option comes with the test that
passes it through `run()` — `src/testing/scripted.ts` has a scripted Telegram and a `tg()` helper —
or, when it truly cannot run offline, an entry there naming where it is checked instead.
