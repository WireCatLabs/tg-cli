# Telegram spike — report

**Status 2026-09-27: built. Everything that needs no Telegram account is measured. The live
criteria wait for the owner's first login.**
Criteria from §9 of
[the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md).

Evidence levels: **measured** means run and its output seen. **Read in the source** gives a path
and line. **Pending** means it needs the real account.

## Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | QR and phone + 2FA login; the next command needs no prompt | pending | needs the owner's phone |
| 2 | stdout is one JSON value, stderr is empty, ids are strings | measured with a scripted Telegram; live pending | `src/program.test.ts` — "writes one JSON value…", "keeps every id a string" |
| 3 | the same `random_id` twice gives one message | the code path is read in the source; Telegram's behaviour is pending | mtcute passes our id through (`@mtcute/core/highlevel/methods/messages/send-text.js:65`, `params.randomId ?? randomLong()`). `pnpm probe:random-id` measures the rest |
| 4 | the process exits right after printing | measured without a session: 0.3 s; live pending | `time bin/tg chats list --json` |
| 5 | mtcute is imported only under `src/telegram/` | measured | a deliberate `import "@mtcute/node"` in `src/` and in `src/commands/`, and `import "../telegram/map.js"` in `src/commands/`, each turned `pnpm lint` red |
| 6 | the session file is mode 600 and printed nowhere | measured for the file; the output side is read in the source | a session file opened from a global install came out `600`. No command prints the session or the app credentials |
| 7 | `npm i -g` and `pnpm add -g` both give a working `tg` | **measured: pnpm failed, fixed, both work** | see below |
| 8 | lines reused, copied and new | counted | see below |

## What the spike found

**FIND-1 · pnpm's global install breaks mtcute's session storage.** `@mtcute/node` depends on
`better-sqlite3`, a native module. pnpm 11 does not run a dependency's install script unless that
dependency is allowed, so `pnpm add -g` installed it without its binary. Opening the database then
failed with "Could not locate the bindings file". Measured 2026-09-27 on Node 24.19.0 and pnpm 11.20.0.

npm 11.17.0 installed it, but it warned that it will ask for `--allow-scripts` for `better-sqlite3`.
The binary came from npm's prebuilt cache (`~/.npm/_prebuilds`). This path will likely break once
npm starts blocking scripts too.

**The fix is neither transport A nor B from the proposal, but a third one.** `@mtcute/node` stays for
the network and crypto. Its session storage runs over the SQLite the runtime already has
(`node:sqlite`, and `bun:sqlite` later), through cli-messaging's seam (`src/telegram/storage.ts`).
better-sqlite3 loads its native part only when a database is opened
(`better-sqlite3/lib/database.js:48`), and this storage never opens one. After the change, a session
database opened and closed from both global installs.

⚠ **This fixes pnpm; npm is only mitigated.** `better-sqlite3` is still a dependency of
`@mtcute/node`, and npm still runs its install script. On a machine with no prebuilt binary for its
Node version and no compiler, that script fails and npm aborts the whole install, although `tg`
never opens the module. The real fix is to depend on `@mtcute/core` and bring the network transport
ourselves (transport B). Not needed yet.

What mtcute needs from a database is small, and it is written down in
`@mtcute/core/storage/sqlite/types.d.ts`:
- on the database: `prepare`, `exec`, `transaction`, `close`;
- on a statement: `run`, `get`, `all`.

`src/telegram/storage.test.ts` runs mtcute's own migrations over it. It writes an auth key and a peer
with a 64-bit access hash and a channel's marked id, saves through mtcute's deferred writes, reopens,
and reads both back unchanged. mtcute keeps the access hash as `text`
(`@mtcute/core/storage/sqlite/repository/peers.js`), so no integer column holds a value past 2⁵³. It
opens transactions in two places (`@mtcute/core/storage/sqlite/driver.js:75`, `:80`), and neither is
inside the other.

**FIND-2 · mtcute writes to stdout by default.** This would break the rule that stdout carries data
and nothing else. There are two places:
- its log handler uses `console.log` (`@mtcute/node/utils/logging.js:22`);
- its login flow prints "code sent" and "invalid code" (`@mtcute/core/highlevel/methods/auth/start.js:91`,
  `:115`, `:144`).

The adapter replaces the handler with one that writes to stderr. It also passes `codeSentCallback`
and `invalidCodeCallback`, so the login flow's own lines are never reached.

**FIND-3 · pnpm's global bin directory has to be on `PATH` before `pnpm add -g` will install.** It
refuses with "global bin directory … is not in PATH". This is for the install instructions, not the
code.

## Counts

| | lines (no tests) |
|---|---|
| cli-core, used as is | 1507 |
| cli-messaging, copied from max-cli and generalised | 859 |
| tg-cli, new | 878, of which `src/telegram/` is 497 |

All the Telegram-specific code sits in `src/telegram/`. The rest of tg-cli is thin commands and the
program that will become cli-messaging's skeleton in Phase 1.

## What the owner runs

1. Create an app at [my.telegram.org/apps](https://my.telegram.org/apps).
2. In your own terminal, from the checkout: `pnpm build && bin/tg session start`. It refuses to run
   without a terminal. It asks for `api_id`, then `api_hash` (hidden), then shows a QR code. Scan it
   from Telegram → Settings → Devices → Link Desktop Device. To use a phone code instead, run
   `bin/tg session start phone`.
3. `bin/tg-spike-live`. It runs every live check and prints only codes, counts and timings. It sends
   three messages, all to Saved Messages: one check message, and two probe messages sharing one
   `random_id`, the second over a new connection.

Its output goes into the table above in place of "pending".
