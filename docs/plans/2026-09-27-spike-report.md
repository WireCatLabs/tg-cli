# Telegram spike — report

**Status 2026-09-27: done.** Every criterion is measured against the owner's real account, except
the phone-and-code login. The owner logged in once, and the method was not recorded.
Criteria from §9 of
[the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md).

Evidence levels: **measured** means run and its output seen. **Read in the source** gives a path
and line. **Pending** means it needs the real account.

## Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | QR and phone + 2FA login; the next command needs no prompt | **measured, one method** | the owner logged in once; every later command ran with no prompt. The other method has not been tried |
| 2 | stdout is one JSON value, stderr is empty, ids are strings | **measured live** | `bin/tg-spike-live`: `account show`, `chats list` (5), `messages list me` (5) and `messages send me` each gave one JSON value and an empty stderr, with string ids |
| 3 | the same `random_id` twice gives one message | **measured live: yes** | `pnpm probe:random-id`: the second send, over a new connection with the same `random_id`, got back the **same message id**, and Saved Messages held **one** copy |
| 4 | the process exits right after printing | **measured live** | every live command exited in 0.31–0.45 s, connection included |
| 5 | mtcute is imported only under `src/telegram/` | measured | a deliberate `import "@mtcute/node"` in `src/` and in `src/commands/`, and `import "../telegram/map.js"` in `src/commands/`, each turned `pnpm lint` red |
| 6 | the session file is mode 600 and printed nowhere | **measured live** for the file; the output side is read in the source | the owner's real session file is `600`, and its directory `700`. No command prints the session or the app credentials |
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

**FIND-4 · Getting the app credentials is automated two ways (added 2026-09-27, owner's request).**
`--app browser` opens my.telegram.org and waits for a paste. `--app auto` drives the site:
- The login half is read from the page's own script: `send_password {phone}` answers
  `{random_hash}`, then `login {phone, random_hash, password}`.
- The `/apps` page and `/apps/create` sit behind that login. They are read from two clients that drive
  it the same way, MadelineProto (`src/MyTelegramOrgWrapper.php`) and gogram (`telegram/auth.go`).
  **Not measured until the first real run.**
- One request with an invalid number (`+0`) was answered `200` with "Sorry, too many tries. Please try
  again later." That is either its answer for a bad number or a limit on this IP. The command shows
  the site's own sentence either way.

**FIND-5 · The first send failed with "User info is not cached yet" (fixed).** The first live send
to Saved Messages was refused before anything reached Telegram. `sendText` reads the logged-in user
from mtcute's cache (`@mtcute/core/highlevel/methods/messages/send-text.js:103`), but mtcute fills
that cache only on the first request (`highlevel/base.js:78`, `prepare`). Reading history worked,
because resolving the chat makes a request first. The adapter now calls `prepare()` right after
opening. It reads the session file only, with no network. Scripted tests could not catch this,
because the scripted Telegram replaces the adapter.

**FIND-6 · Telegram deduplicates by `random_id`, also across connections.** This is what makes the
retry rule safe. A send with no answer returns `outcome_unknown` with its `--send-id`, and repeating
it cannot create a second message. The same holds for MAX's `cid`, as max-cli measured. How long
Telegram remembers a `random_id` is not measured: the two sends were seconds apart.
Measured again on 2026-09-29 with the build on `main` (0.8.0, mtcute 0.32.3): same result — the
second send came back with the first one's message id, and Saved Messages held one copy.

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
2. In your own terminal, from the checkout: `pnpm build && bin/tg session start` (or add `--app auto`
   to have the app registered for you). It refuses to run
   without a terminal. It asks for `api_id`, then `api_hash` (hidden), then shows a QR code. Scan it
   from Telegram → Settings → Devices → Link Desktop Device. To use a phone code instead, run
   `bin/tg session start phone`.
3. `bin/tg-spike-live`. It runs every live check and prints only codes, counts and timings. It sends
   three messages, all to Saved Messages: one check message, and two probe messages sharing one
   `random_id`, the second over a new connection.

Its output goes into the table above in place of "pending".
