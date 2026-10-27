# Architecture

How `tg` is put together, and which seams you may not cross. The rules are the handbook's
[Architecture](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md) and
[Lifecycle](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/lifecycle.md) pages (`WC-ARCH-<n>`,
`WC-LIFE-<n>`), which win over this page; this page is how `tg` keeps them. Open work is in
[BACKLOG.md](BACKLOG.md).

## 1. Most of `tg` is not in this repository

`tg` is one of the messengers on [`@wirecat/cli-core`](https://github.com/WireCatLabs/cli-core), beside max-cli and
whatsapp-cli; the version it builds on is the exact pin in `package.json`. cli-core owns the command tree, `run()`,
the output contract, the message store and its search, `--offline`, run records, the send guard, `serve`, `watch`,
`inbox` and `mcp`. This repository adds three things: an **adapter** that maps Telegram onto cli-core's messenger
port, a **description** of Telegram that cli-core reads, and the few commands only Telegram needs (`session`,
`setup`, `upgrade`, `bot api`). The adapter contract is cli-core's
[ADAPTERS.md](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/ADAPTERS.md).

## 2. The layers

```text
src/bin/tg.ts            argv → run() → exit code
src/program.ts           the shared commands, mounted whole; tg's own beside them     cli-core
src/commands/            TELEGRAM (context.ts), session, setup, upgrade, bot
src/telegram/            Telegram → cli-core's domain (Chat, Message); the only mtcute user
src/bot/                 the Bot API side of `tg bot`, over HTTPS
mtcute                   MTProto, in-process (@mtcute/node, pinned exactly)
```

| Layer | Where | Knows |
|---|---|---|
| Entry | `src/bin/tg.ts` | loads the runtime's SQLite (`ensureSqlite`), then `run()` |
| Program | `src/program.ts` | which commands exist; wraps cli-core's `run()` for the daily update line |
| Telegram description | `src/commands/context.ts`, `TELEGRAM` | credentials, the session file, how to connect, what `doctor` reads, `me` → Saved Messages, which optional port features Telegram has |
| Check words | `checkWords("tg", profile)` from cli-core, called in `src/commands/context.ts` | the `tg <profile> …` command an unknown outcome sends a person to, the profile included; the adapter names it only by a typed check (`"polls.show"`, `CHECKS` in `src/telegram/feature.ts`) |
| Adapter | `src/telegram/adapter.ts`, `TelegramAdapter` | the only door to Telegram; speaks the domain model outward |
| Adapter features | `src/telegram/messages.ts`, `chats.ts`, `polls.ts`, `topics.ts`, `groups.ts`, `folders.ts`, `contacts.ts`, `account.ts`, `login.ts`, `stats.ts`, `watch.ts` … | one feature each, over the `Feature` context in `feature.ts`; the adapter's method is one line handing it on |
| Mapping | `src/telegram/map.ts` | the only file that knows mtcute's object shapes |
| Errors | `src/telegram/errors.ts`, `toCliError` | Telegram's refusals → cli-core's closed list of error codes |
| Session storage | `src/telegram/storage.ts` | mtcute's session over the runtime's own SQLite, not `better-sqlite3` |

Dependencies point down only. `biome.json` (`noRestrictedImports`) enforces two of them: only `src/telegram/` may
import `@mtcute/*`, and `src/commands/` may not import the mapping or the error translation
([WC-ARCH-3](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md),
[WC-TOOL-15](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/toolchain.md)). No lint rule yet keeps
`src/telegram/` from importing commands or the program; today it imports neither. `src/telegram/adapter.ts` has its
own line cap in `biome.json`, so a new feature goes into a feature file, not into the adapter.

**What ships is a bundle.** `pnpm build` compiles `src/` to `dist/` with `tsc`, then
cli-base's `cli-dev bundle` ([WC-LAY-10](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/layout.md))
bundles `dist/bin/tg.js` with esbuild into `dist/bundle/` and makes `dist/bin/tg.js` a loader that answers `--version`,
turns the compile cache on and imports it: a command loads about 55 files instead of
about 1,100. Every lazy `import()` stays a chunk of its own. cli-core, cli-base, mtcute and the native packages stay
dependencies: a bundled module's `import.meta.url`, `import.meta.resolve` and run-time `import()` of a package
answer from the module's own place, not the chunk's. The tests run against `src/`; `pnpm smoke:node` and
`pnpm smoke:bun` run the bundle.

## 3. History comes from Telegram's servers

Telegram keeps every chat's history on its servers, so `TELEGRAM` leaves cli-core's `history` at its default,
`"server"`:

- **Reads connect.** `chats list`, `messages list` and `search` ask Telegram, and cli-core saves what came back to
  the store. `--offline` answers the same commands from the store without connecting.
- **`serve` keeps the store current.** It listens with `catchUp: true`, so it first fetches what arrived while
  nothing listened. `watch` listens from now on (`catchUp` off).
- **Live events** are new messages, edits, deletions and reactions (`watch` in `src/telegram/watch.ts`, from mtcute's
  `onNewMessage`, `onEditMessage`, `onDeleteMessage` and raw reaction updates).
- **Older history** is paged from the server (`history`, `historyAfter`, `historyBefore`, `historyFrom` in
  `src/telegram/messages.ts`), which is what `messages sync` walks.
- **A channel post or a message sent as the group** sets `Message.senderIsChat`, so the store does not make a person
  of a channel.

## 4. The adapter

- **One client per adapter.** `TelegramAdapter.open` creates the session folder (0700), opens the session storage and
  calls `client.prepare()` before anything else: `sendText` reads the cached current user before it makes a
  request, and fails without it.
- **Nothing on stdout.** mtcute's log handler writes with `console.log`; the constructor replaces it with the
  diagnostic stream, and login prompts go through `LoginPrompts`, never mtcute's own.
- **`Feature`** (`src/telegram/feature.ts`) is what every feature file gets: the client, `inputOf` (a typed chat →
  an mtcute peer), and four ways to call Telegram. `call` translates any failure through `toCliError`. `send` is a
  call that carries a `random_id`, so a retry with the same `--send-id` repeats the same message and Telegram drops
  the copy. `write` is a call with no id to repeat it by: no answer becomes `outcome_unknown`, with the check to
  run. `unanswered` builds that error for a feature that decides itself.
- **Rate limits.** mtcute's flood waiter sits out a `FLOOD_WAIT` up to `FLOOD_SLEEP` (10 s, twice, for a one-shot;
  120 s, three times, for `watch` and `serve`) and says so on stderr. A longer wait becomes `rate_limited` with
  `retry_after_ms`. `PEER_FLOOD` and similar refusals carry a `standing` (`STANDINGS` in `errors.ts`).
- **A proxy** (`src/telegram/proxy.ts`) replaces mtcute's transport. A one-shot command fails when the proxy does;
  `watch` and `serve` keep mtcute's own retries.

## 5. Connections, and why there is no lock

**Every process opens its own main connection.** A one-shot command opens with `disableUpdates: true` and closes
in a `finally` ([WC-LIFE-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/lifecycle.md)); only
`watch` and `serve` open with `listen`. `mcp` keeps one connection between calls for a few minutes.

**Nothing serialises them.** Telegram's documentation allows one main session per login unless the account is
granted more, so `serve`, `watch`, `mcp` and a command beside them break that rule on paper. By the owner's ruling
NEED-600 A ([session-sharing.md](session-sharing.md)) `tg` accepts it: it was not observed on the owner's account or
in the probe on the test account, and routing every command through `serve` waits until evidence appears. So:

- `TELEGRAM` does not set cli-core's `connection: "exclusive"`, and commands do not go through a running `serve`.
- The only lock is cli-core's serve lock (`<state>/serve/<profile>.lock`), which keeps a second `serve` off the
  profile. `session end` refuses while `serve` runs for the profile, since logging out would end `serve`'s login and
  delete the session file under it.
- **The signal that reopens it** is `AUTH_KEY_DUPLICATED`: `toCliError` maps it to `authentication_error` (exit 4,
  so a `serve` unit stops restarting) and keeps `provider_error: "AUTH_KEY_DUPLICATED"` in the details, where run
  records show it.

The session file itself is safe under several processes: SQLite in WAL mode, mtcute's writes in one
`BEGIN IMMEDIATE` transaction, last writer wins row by row ([session-sharing.md §3](session-sharing.md)).

## 5a. Logging in

`tg session start [qr|phone]` and `tg setup` share `startSession` (`src/commands/session.ts`) over
`login` in `src/telegram/login.ts`. Every user brings their own app registration (`api_id` and `api_hash`, NEED-3):
`src/telegram/registration.ts` can register it on my.telegram.org without a browser, and
`src/telegram/credentials.ts` keeps it in the OS keyring, or in `credentials.json` in the config folder where there is
no keyring. `TG_API_ID` and `TG_API_HASH` outrank the keyring. A QR
login with stored app keys and no two-step password asks nothing, so it runs without a terminal; anything that would
ask is refused without one.

## 6. The seams a test uses

`run(argv, environment)` takes everything that reaches outside the process from `environment` (`Environment` in
`src/commands/context.ts`, extending cli-core's `BaseEnvironment`):

- `adapter` — a scripted Telegram in place of `TelegramAdapter.open` (`scripted` in `src/testing/scripted.ts`).
  Every command test uses it.
- `keyring` — `memoryKeyring()` from cli-base, so no test reaches the OS keychain.
- `streams`, `tty`, `stdin` — captured output and a pretend terminal.
- `signal` — ends `watch` and `serve` instead of Ctrl-C.
- `update` — the package manager and npm answers for `tg upgrade` and the daily notice.
- `system`, `botFetch`, `botHistory` — the service manager, the Bot API and a bot's history reader.

The test setup keeps every run off the real machine: cli-base's `@wirecat/cli-base/testing/setup` gives each test
file a fresh `HOME` and `TMPDIR` (so the config, state, cache and store folders fall under it), a keyring that throws
and no network; `src/testing/sandbox.ts` then clears the `TG_*` variables that could point at a real app, profile or
proxy.
`TelegramAdapter` itself is tested below the port, against a fake `TelegramClient`
([adapter-fake-client](../../agent-os/standards/testing/adapter-fake-client.md)).

**A new adapter method** takes this path: `MessengerAdapter` in cli-core's `src/cli/messenger/port.ts` → a line in
cli-core's `observed.ts` (run records) and `stored.ts` (saving) → the store, if it should work `--offline` → the
command in cli-core → `TelegramAdapter`, a feature file and its mapping in `map.ts` → the scripted adapter in tg's
`src/program.test.ts`, `src/runs.test.ts`, `src/send-guard.test.ts`, `src/offline.test.ts` and
`src/contract.test.ts`. How lanes avoid colliding in `adapter.ts` is in [agents.md](agents.md#where-lanes-collide).

## 7. What is on disk

Directories follow cli-base's `resolvePaths` (XDG on Linux and macOS); `TG_CONFIG_DIR`, `TG_STATE_DIR` and
`TG_CACHE_DIR` move them, and `bin/tg` points them into `.tg/` of the checkout.

| Path | What | Mode |
|---|---|---|
| `~/.local/share/tg-cli/sessions/<profile>.session` | mtcute's session: the auth key, a credential as good as a password; `-wal` and `-shm` beside it | 0600, dir 0700 |
| `~/.local/share/tg-cli/bots/<profile>/mtproto-<bot id>.session` | a bot's own MTProto session, to read its history | 0600 |
| `~/.local/share/tg-cli/serve/<profile>.lock`, `.log` | cli-core's serve lock and the service's log | cli-core's |
| `~/.config/tg-cli/config.json` | settings; never a secret | |
| OS keyring, service `tg-cli` | `<profile>:api` (the app registration), `proxy:profile:<profile>` and `proxy:defaults` (proxy secrets); `~/.config/tg-cli/credentials.json` where there is no keyring | |
| cli-core's store (`~/.local/share/WireCat/wirecat.db`) | chats, people, messages for every messenger | cli-core's |

`storage.ts` creates the session file 0600 before SQLite opens it, so `-wal` and `-shm` inherit that mode, and
`close` puts the three modes right again. `doctor` only `stat`s them (`sessionModes`) and prints the fix.

## 8. On the wire

MTProto through [mtcute](https://mtcute.dev), in this process. `tg` sends mtcute's default `initConnection`: the
device model is `mtcute on <system>`, the app version mtcute's own; the `api_id` is the user's own registration.
`tg bot` speaks the [Bot API](https://core.telegram.org/bots/api) over HTTPS (`src/bot/transport.ts`); the token is
part of every address there, so the address never leaves `transport.ts`, not even in an error.

## 9. Standards it follows

Telegram and MAX share one
[CLI standard and adoption profile](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/STANDARD.md#external-references-and-our-adoption-profile),
drawn from [POSIX utility conventions](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap12.html),
[GNU command-line conventions](https://www.gnu.org/prep/standards/html_node/Command_002dLine-Interfaces) and
[Command Line Interface Guidelines](https://clig.dev/), and assessed against the
[MCP tools specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) and the
[Agent Skills format](https://agentskills.io/specification). These references do not certify the CLI or prescribe
its command tree. The [compliance audit](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/CLI-COMPLIANCE.md)
separates source evidence from intentional differences.

Rankings, administrator statistics and retention live in cli-core's services and store; the
[ranking guide](../rankings.md) describes them for a user. Two Telegram facts feed them: `map.ts` keeps the reply
target, the linked discussion group and proven automatic channel copies in `providerMetadata.graph`, and
`TelegramAdapter.fetchCounters` reads views, reactions and comments with exact `getMessages` calls.
