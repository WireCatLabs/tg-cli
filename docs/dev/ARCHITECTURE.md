# Architecture

**Status 2026-09-29, tg 0.4.0 on `@leemour/cli-messaging` 0.27.0.** This page is the map of `tg`'s own
code and its seams. What the project is and what is open lives in [HANDOFF.md](../../HANDOFF.md);
the shared design lives in cli-messaging and in
[max-cli's ARCHITECTURE.md](https://github.com/leemour/max-cli/blob/main/docs/dev/ARCHITECTURE.md),
which most of cli-messaging was copied from.

## 1. Most of `tg` is not in this repository

Every command except `session` and `update` comes from `@leemour/cli-messaging/cli`: the command
tree, `run()`, the output contract, the store and `--offline`, run records, the send guard, `mcp`.
`tg` hands it one description of Telegram and one adapter.

| Layer | Where | Knows |
|---|---|---|
| Entry | `src/bin/tg.ts` | argv → `run()` → exit code |
| Program | `src/program.ts` | which commands exist; wraps cli-messaging's `run()` for the daily update line |
| Telegram description | `src/commands/context.ts`, `TELEGRAM` | credentials, the session file, how to connect, `doctor`'s checks, `me` → Saved Messages |
| tg's own commands | `src/commands/session.ts`, `update.ts` | login and logout; self-update |
| Adapter | `src/telegram/adapter.ts` | the only door to Telegram — speaks the domain model outward |
| Mapping | `src/telegram/map.ts` | the only file that knows mtcute's object shapes |
| Errors | `src/telegram/errors.ts` | Telegram's refusals → the closed list of error codes |
| Session storage | `src/telegram/storage.ts` | mtcute's session over the runtime's own SQLite, not `better-sqlite3` |

**A lint rule enforces the direction**: only `src/telegram/` may import `@mtcute/*`, and commands may
not import the mapping or the error translation (`biome.json`, `noRestrictedImports`).

## 2. The seams a test uses

`run(argv, environment)` takes everything that reaches outside the process from `environment`
(`Environment` in `src/commands/context.ts`, extending cli-messaging's `BaseEnvironment`):

- `adapter` — a scripted Telegram in place of `TelegramAdapter.open`. Every command test uses it.
- `keyring` — `memoryKeyring()` from cli-core, so no test reaches the OS keychain.
- `streams`, `tty`, `stdin` — captured output and a pretend terminal.
- `signal` — ends `watch` and `serve` instead of Ctrl-C.
- `update` — the package manager and npm answers for `tg upgrade` and the daily notice.

`TelegramAdapter` itself is tested against a stand-in `TelegramClient` (`src/telegram/adapter.test.ts`
mocks the class and keeps mtcute's real helpers).

## 3. Adding an adapter method

The path is in [HANDOFF.md §3c](../../HANDOFF.md#3c-how-to-change-things); how lanes avoid colliding
in `adapter.ts` is in [agents.md](agents.md#where-lanes-collide).

## 4. One command, one connection, and it closes

A one-shot command opens with updates off and closes in a `finally`; an open socket keeps Node alive
and a piped command that prints and never returns is a defect. Only `watch` and `serve` open with
`listen`; only `serve` catches up on what arrived while nothing listened.
