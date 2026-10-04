# Several processes on one Telegram session

**TASK-366, 2026-10-04.** The question: what happens when `tg serve`, one-shot commands, `tg mcp` and
`tg watch` use one profile's session at the same time? Short answer: the session file itself is
safe. **Telegram's rules are not met:** every process opens its own main connection on the same
login, and Telegram's docs say that revokes the login. Fixing it needs one process to own the
connection (option (c) below).

**Conclusion (owner's ruling NEED-600 A):** the risk is real according to the docs, but it has not
been observed in practice (§6). (c) stays a plan until evidence appears; §6 names the signal.

Mtcute line numbers are for `@mtcute/core@0.32.3` (the pinned version), relative to
`node_modules/.pnpm/@mtcute+node@0.32.3/node_modules/@mtcute/core/`.

## 1. Telegram's rules: one main session per login

- [Error handling, 406](https://core.telegram.org/api/errors): AUTH_KEY_DUPLICATED "is only emitted
  if any of the non-media DC detects that an authorized session is sending requests in parallel from
  two separate TCP connections, from the same or different IP addresses … opening additional parallel
  main sessions (i.e. multiple session_ids over the same authorization key, or multiple TCP
  connections to the main DC) is what triggers this error." After it, "the user must generate a new
  auth key and login again".
- [Datacenters, parallel sessions](https://core.telegram.org/api/datacenter#parallel-sessions): one
  key *may* carry several MTProto sessions, but the number of parallel main sessions to the home DC
  is the `tmp_sessions` field of `config` / `auth.authorization`: "when the field is absent or ≤ 1,
  a single main session must be used." More than that "will terminate all sessions an
  AUTH_KEY_DUPLICATED error, which will also invalidate the authorization key". With
  `tmp_sessions` > 1, every session must also use Perfect Forward Secrecy (temporary keys).
  Only file-transfer sessions on media DCs are exempt.
- [MTProto, session](https://core.telegram.org/mtproto/description): a session id is a random
  64-bit number the client picks per application instance.

This is what the docs describe. Whether Telegram enforces it on one machine and one IP is **not
measured**. No revocation has been seen on the owner's account so far.
The probe in §5 can confirm the rule on the test account, but it cannot clear it.

## 2. What each process opens

| Process | Connection | Updates | Lifetime |
|---|---|---|---|
| `tg serve` | its own main connection | on, `catchUp: true` | until stopped |
| `tg watch` | its own main connection | on, `catchUp: false` | until stopped |
| one-shot command | its own main connection | off (`invokeWithoutUpdates`) | one command |
| `tg mcp` | its own main connection, kept between calls | off | up to 2 min idle, 5 min in all (cli-messaging `src/mcp/session.ts`) |

- Every `TelegramClient` picks a fresh random session id (`network/mtproto-session.js:23`). Turning
  updates off only wraps each call in `invokeWithoutUpdates` (`network/session-connection.js:1018`).
  It is still a main session to the home DC.
- Inside one process mtcute keeps to `tmp_sessions` (`network/network-manager.js:62`). Nothing
  coordinates two processes.
- **So any two of them at once are two main sessions on one key.** That covers `serve` next to a
  command, `mcp` or `watch`, but also, with no `serve`, a command while `mcp` holds its connection,
  or two commands an agent runs in parallel. With MCP the overlap lasts minutes. The only guard is the lock against a second `serve`
  (cli-messaging `src/cli/messenger/serve-command.ts:24-31`). That lock is read, then written, not
  taken atomically, so two `serve`s started in the same instant can both pass.

## 3. What each process writes to the session file

The file is mtcute's SQLite storage over our driver (`src/telegram/storage.ts`).

- **SQLite itself is sound.** `openCache` sets WAL and `busy_timeout = 5000`
  (cli-messaging `src/store/open.ts:17`, `src/store/driver.ts:41-42`). mtcute flushes its pending
  writes in one `BEGIN IMMEDIATE` transaction (`src/telegram/storage.ts:39-41`). Two writers wait for
  each other; they do not corrupt the file. Do not "fix" this.
- **Every write replaces whole rows** (`insert or replace` in `storage/sqlite/repository/*.js`).
  The last process to flush wins, row by row.
- **Update state (pts, qts, date, seq, channel pts)** is written only by an `UpdatesManager`. mtcute
  builds one only when updates are on (`highlevel/base.js:38`, `highlevel/updates/manager.js:30`).
  **One-shot commands and MCP never write update state** — option (a) already holds, and
  `src/telegram/adapter.test.ts:350` holds it in place.
- **`watch` writes update state too.** It does not catch up: it takes the server's current state
  (`manager.js:146`, `:302`) and saves after every pass of its loop (`manager.js:1563`). `serve`
  reads the stored state only when it starts (`manager.js:352`). So `watch` can move or roll back
  the point a restarted `serve` catches up from (reproduced: `src/telegram/storage.test.ts`, "lets
  the last process to flush set the updates state"). No message is lost: `watch` saves what it sees
  to the store (cli-messaging `src/cli/messenger/stored.ts:141`). Re-reading only repeats work.
- **Peers, the current user, DC options and salts** are written by every process, with fresh data.
  Last writer wins, which is harmless.
- **A dropped key is dropped for everyone.** When the server stops knowing the key (after
  AUTH_KEY_DUPLICATED, say), mtcute deletes the key from the file at once
  (`network/session-connection.js:183-187` → `network/network-manager.js:115` →
  `storage/sqlite/repository/auth-keys.js:36`; reproduced in `storage.test.ts`). One revoked process
  therefore logs out every process on the profile.

The message store (cli-messaging) is a separate SQLite file with the same pragmas. Every process
writes to it by inserting or updating rows, so the store is not at risk.

## 4. The fix

| Option | Correct? |
|---|---|
| (a) one-shots never write serve's keys | already true for update state (§3); does nothing for §1 |
| (b) a file lock, error or wait | correct only if commands cannot run while `serve` runs: `serve` holds the connection forever, so a waiting command waits forever |
| (c) commands and MCP go through a running `serve` | the only option that meets §1 and keeps commands working beside `serve` |

**Plan for (c)**: messenger-neutral, in cli-messaging. max-cli already works this way (its
`src/server/`, a per-profile Unix socket).

1. `serve` listens on `<state>/serve/<profile>.sock` (mode 0600; a named pipe on Windows) once
   `listeningAt` is set. Requests are one JSON line: `{id, method, args}` → `{id, result}` or
   `{id, error}`. An error keeps the `CliError` code and details.
2. `messengerContext`'s connect returns a forwarding `MessengerAdapter` when a live lock and its
   socket answer. Every port method is data in and data out; file paths work, because both
   processes are on one machine. `serve` runs the calls one at a time on its own adapter.
3. Without a `serve`, a command connects directly, as now. It holds a short per-profile connection
   lock (an exclusive create with its PID). `serve` waits for that lock before it connects. Two
   direct commands still overlap; the same lock, held for the length of a connection, serialises
   them.
4. `watch` while `serve` runs reads `serve`'s event stream over the socket, rather than a second
   listener. `session start` and `session end` stop `serve` first.
5. A version mismatch with the lock's `version` refuses to forward, and says to restart `serve`.

The size, judged from max-cli's `src/server/`: one to two days, mostly in cli-messaging, and a
cli-messaging release before tg can use it.

## 5. The live check

Run from the tg-cli checkout. It needs B's login (`tgtest`) in the main checkout, and runs on that
profile only; the profile is fixed in `scripts/live-two-processes.ts`.

- `pnpm probe:sessions` prints `tmp_sessions` from `help.getConfig`, over one connection. Absent or
  ≤ 1 means Telegram's rule applies to this account.
- `pnpm probe:sessions-parallel` also keeps a listening connection open for 90 s, with one-shot
  connections beside it. It then reports Telegram's error names and whether the login survived.
  **It may revoke the tgtest login.**

Read the result in one direction only. A revoked login confirms the rule. A surviving login shows
only that this pattern was not caught in 90 s: the detection may come later, or depend on traffic.
It is not a reason to skip (c).

An interim step, if (c) waits: refuse `watch` while `serve` runs (the existing lock). `serve`
already keeps the store current, so nothing is lost.

## 6. Measured 2026-10-04, and what reopens (c)

Run on `tgtest` with the owner's yes:

- `pnpm probe:sessions` → `{"profile":"tgtest","tmpSessions":null}`. Telegram grants no parallel main
  sessions to this account, so by its docs a single main session is required.
- `pnpm probe:sessions-parallel` → `{"tmpSessions":null,"parallel":{"oneShots":18,"errors":{}},"after":{"survived":true}}`.
  One listening connection, 18 one-shot connections beside it over 90 s, no error, and the login
  survived.
- The owner's account has run `serve` beside commands for weeks with no revocation.

**What this proves:** on one machine and one IP, Telegram did not enforce its rule within 90 s, nor
over weeks of normal use. **What it does not prove:** that it never will. The detection may come
later, need more traffic or parallel requests, apply only across IP addresses, or change on
Telegram's side without notice. The docs' rule stands. We do not rely on Telegram ignoring it; we
only defer the work.

**The signal that reopens (c):** any `AUTH_KEY_DUPLICATED`. Since this change, `tg` maps it to
`authentication_error` (exit 4, so a `serve` unit stops retrying). The message names overlapping
connections as the cause, and `providerError: "AUTH_KEY_DUPLICATED"` is kept in the error details,
so it shows in run records (`tg runs`). A login that ends for no known reason
(`AUTH_KEY_UNREGISTERED` while nobody logged out) is the weaker signal to look into too.
