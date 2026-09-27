# tg-cli + cli-messaging — start here

**State 2026-09-27, evening.** Read this once, then only the files your task needs from §3. It is context,
not history.

## 1. What this is

`tg` is a command line interface for the owner's **personal Telegram account** (MTProto through
[mtcute](https://mtcute.dev), not the Bot API). It is built for agents and scripts first: one
operation per call, one JSON value on stdout when piped, a typed error and a fixed exit code on
failure. Everything that is not specific to Telegram lives in the npm package
[`@leemour/cli-messaging`](https://github.com/leemour/cli-messaging) (checkout: `../cli-messaging`),
which `max` ([max-cli](https://github.com/leemour/max-cli), a MAX messenger CLI) will also move onto
later. Both sit on [`@leemour/cli-core`](https://github.com/leemour/cli-core).

The goal beyond the CLI: a local archive of every messenger with search, a cross-messenger contact
graph and a CRM on top. The full design:
[the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md).

## 2. Entry points

| Question | Where |
|---|---|
| The design, the phases, what is done | [`../cli-messaging/docs/plans/2026-09-26-platform-proposal.md`](../cli-messaging/docs/plans/2026-09-26-platform-proposal.md) — §8 lists every PR with **Done** marks; §4 is the store and the CRM model; §11 the owner's rulings (NEED-1…3) |
| What was measured against real Telegram | [`docs/plans/2026-09-27-spike-report.md`](docs/plans/2026-09-27-spike-report.md) — FIND-1…6 |
| What the shared package exports | [`../cli-messaging/README.md`](../cli-messaging/README.md) |
| What a user is told | [`README.md`](README.md) |
| How max-cli does something | `../max-cli/docs/dev/ARCHITECTURE.md` — the source most of cli-messaging was copied from. **Read only** |

There is no session journal and no backlog file in these two repositories yet; the proposal's §8
table is the backlog.

## 3. What to read for the next task

### 3a. Done 2026-09-27: shared read and send commands (cli-messaging 0.16.0) — Phase 1 complete (1.4–1.7)

`account show`, `chats list|show`, `contacts list|show` and `messages list|show|context` now come from cli-messaging (`accountCommand`,
`chatsCommand`, `messagesCommand`). tg describes Telegram once — `TELEGRAM` in
`src/commands/context.ts`: its `connect`, the chat help, `me` → the account's own id — and adds
what is its own by composition: `session`.
Saving reads to the store, `--offline` and the run events live in `../cli-messaging/src/cli/messenger/`.
Earlier the same day: run records, the store, and every read kept (proposal §8, 1.1b, 1.3, 2.1).
`tg backfill <chat>` (2.2) fetches a chat's history resumably; `sync_ranges` records what is held.

**cli-messaging releases belong to another session** (NEED-7 → A, 2026-09-27): a cli-messaging PR from
here carries no version bump and `bin/release` is not run. Ask for a release with `SendMessage` (it is
one of the `max-cli-*` or `asturio-bot` sessions in `ListAgents`), wait for npm, then add the version to
tg-cli's `pnpm-workspace.yaml` → `minimumReleaseAgeExclude`. Announce a store migration's number to that
session before writing it. To try an unreleased version in tg first, `pnpm pack` it and `pnpm add` the
tarball (see §4.1).

### 3b. Next planned work, in order

Phase 1 is complete. Phase 2 per proposal §8:

1. **PR 2.3** — the background process (`serve`), from max-cli's `src/server/`; edits, deletions and
   reactions (`watch --events`) come with it.
2. **PR 2.4** — the tokenizer measurement (proposal §6), then `tg messages search`.
3. **PR 2.5** — `tg sync status`, `tg export`.
4. Small, whenever: failures *before* a command runs are not kept as runs (max-cli `keepFailure`).
   Also small: `watch` prints "listening" before the adapter has connected and started the updates
   loop, so a script that sends on that line can miss the first message — give the port an
   `onReady` callback the adapter calls once the loop runs (additive, a minor version).
5. **Publish tg-cli on npm** once backfill and search exist (NEED-8 → A): a release script and
   trusted publishing as cli-messaging has, then `tg update`.

A new adapter method follows the path `around`, `chat` and `contact` took: `MessengerAdapter` in
`../cli-messaging/src/cli/messenger/port.ts`, a line in `observed.ts` and `stored.ts`, the store if
it should work `--offline`, then `TelegramAdapter` and the four test fakes in tg.

For any of these, read in this order:

| File | Answers |
|---|---|
| `src/commands/context.ts` | what only Telegram has (credentials, the session file, `connect`) and the `TELEGRAM` description the shared commands take |
| `../cli-messaging/src/cli/messenger/context.ts` | how a shared command connects inside `--timeout`, saves to the store and answers `--offline` |
| `../cli-messaging/src/cli/messenger/port.ts` | `MessengerAdapter` — what an adapter must do for the shared commands |
| `../cli-messaging/src/cli/messenger/stored.ts` | which reads are saved to the store, and why `resolve` is not |
| `../cli-messaging/src/cli/messenger/observed.ts` | which ids and counts a run record names per adapter call — a new adapter method gets a line here |
| `../cli-messaging/src/cli/messenger/commands.ts` | every shared command; `sendText` is the shape of a write: resolve → guard.check → send → guard.record |
| `src/telegram/adapter.ts` | the only door to Telegram: `open`, `login`, `me`, `chats`, `history`, `resolve`, `send` |
| `src/telegram/map.ts` | where mtcute's objects become the domain model — the only file that knows their shape |
| `../cli-messaging/src/store/store.ts` | what the store keeps, what an update may not erase, and how a sender becomes an identity and a person |
| `../cli-messaging/src/store/migrations.ts` | the schema, and the append-only rule for changing it |
| `../cli-messaging/src/cli/settings.ts` | flag → env → file → default; how a CLI adds its own settings (`SettingsExtension`) |
| `../cli-messaging/src/cli/program.ts` | `run()`, global flags, the profile as the first word |

## 4. What will bite

1. **A linked `cli-messaging` brings its own copy of cli-core and commander.** Then an error from
   one is not an `instanceof` the other (an ambiguous chat name exited 1 instead of 2), and
   TypeScript says `TS2883 … cannot be named without a reference`. `run()` recognises errors by
   shape (`isCliFailure`) for this reason. **Link only for a change that spans both repositories,
   and switch back to a published version before the PR.**
   To try an unreleased cli-messaging in tg without that, `pnpm pack` it and `pnpm add` the
   tarball: it shares tg's cli-core (done for 0.3.0).
2. **mtcute writes to stdout by default** — its log handler (`console.log`) and its login prompts.
   The adapter replaces the handler and passes `codeSentCallback` / `invalidCodeCallback`. Any new
   mtcute call path that can print must be checked for this.
3. **`sendText` reads the cached current user before any request.** The adapter calls
   `client.prepare()` right after opening; without it the first send of a process fails with "User
   info is not cached yet" (FIND-5).
4. **Session storage is ours, not `better-sqlite3`** (`src/telegram/storage.ts`, over cli-messaging's
   `openCache`): a global `pnpm add -g` leaves better-sqlite3 without its binary (FIND-1). Do not
   switch back to mtcute's default storage.
5. **mtcute is pinned at exactly 0.32.3.** Pre-1.0; read its `.d.ts` in `node_modules` rather than
   trusting docs.
6. **Never run `node dist/bin/tg.js` against the account — use `bin/tg`.** It keeps config, state,
   the session and the store in `.tg/` of the checkout. Each checkout needs its own
   `bin/tg session start` (the owner has one in this checkout). The `TG_*_DIR` variables also
   change which keyring entry is used.
7. **`pnpm test` must not reach anything real.** `src/testing/sandbox.ts` moves every directory and
   clears `TG_PROFILE`, `TG_PROFILE_LOCK`, `TG_TIMEOUT`, `TG_API_ID`, `TG_API_HASH`. A new variable
   that can point at something real goes there too.
8. **Biome `noRestrictedImports` in two overrides does not merge** — the later one replaces the
   earlier. `biome.json` repeats the mtcute pattern inside the `src/commands/**` rule for that reason.
9. **This is the owner's real account.** Live checks send only to Saved Messages (`me`).
   `bin/tg-spike-live` sends three messages each run — do not run it per PR. A read-only check is
   `bin/tg account show`, `bin/tg chats list --limit 3`, `bin/tg messages list me --limit 2`.
10. **Telegram deduplicates by `random_id`, also across connections** (measured, FIND-6). That is
    what makes `--send-id` after `outcome_unknown` safe. Never generate a new id on a retry.
11. **The store is a system of record, not a cache** — forward-only additive
    migrations, never max-cli's drop-and-rebuild (`../max-cli/src/cache/schema.ts` `migrate`), and
    tests must use `MESSAGING_STORE` (proposal §4, RISK-11).
12. **npm shows a new version only after a few minutes.** `bin/release` waits and tags; a check
    right after publishing can answer 404 for a version that is there.
13. **A typed chat is often a title.** A run event never names what was typed — only ids taken from
    an argument that already is one, or from the answer (`../cli-messaging/src/cli/messenger/observed.ts`).
14. **zsh copies stdout into a pipe** when you write `cmd 2>&1 >/dev/null | …` (its `MULTIOS`
    option), so the data seems to reach stderr. Check stream separation under `sh -c`.
15. **An adapter must set `Message.senderIsChat`** when the author is a chat (a channel post, a
    message sent as the group). Without it the store makes an identity and a person of a channel,
    and there is no clean way to undo those rows.
16. **`watch` opens its own connection with updates on** (`listen`), catch-up off: it starts from
    now and never replays what arrived while it was stopped (checked live 2026-09-27). One-shot
    commands keep `disableUpdates: true`. A busy account produces messages every few seconds — a live
    check that expects silence will be wrong.
17. **Migrations 1 and 2 are shipped and frozen** (2 is `sync_ranges`, for `backfill`). The next is
    migration 3, additive, in `../cli-messaging/src/store/migrations.ts` — announce its number to the
    releasing session first (rule 18).
18. **Another session works in cli-messaging too** (the max-cli bot writes the shared store). On
    2026-09-27 it used a worktree, `../cli-messaging-find`, **with `main` checked out**, so `git
    checkout main` failed in `../cli-messaging`; that worktree is gone now, but check `git worktree
    list` and never touch another session's. Twice on 2026-09-27 both sessions raised the version
    to the same number and the other released first (0.10.0, 0.13.0); `bin/release` refused and the fix
    was a bump PR (0.11.0, 0.14.0). Before a bump: `git fetch` and `npm view @leemour/cli-messaging
    version`. Without `main` checked out, `bin/release`'s CI mode is `gh workflow run release.yml --ref
    main` and `gh run watch` — after checking yourself that `origin/main` has the version and npm does not.
19. **npm's trusted publisher names a GitHub environment, `npm`.** A publish job outside it gets
    `E404` on the upload — it cost two failed releases on 2026-09-27. cli-messaging's
    `release.yml` publishes from `environment: npm`, as max-cli's does. cli-core's does not and
    fails the same way; that is cli-core's to fix, not yours.

## 5. Decisions you will make yourself — make them knowingly

- which of max-cli's command builders (`config`, `doctor`, `commands`, `complete`) move to
  cli-messaging next — the owner asked for a generous extraction with adapter overrides;

Already ruled, do not reopen: one shared store for all messengers (NEED-1); max-cli stays untouched
until Phase 4 (NEED-2); every user registers their own `api_id` (NEED-3); publish cli-messaging on
npm while it is 0.x (NEED-5).

## 6. How to check

```sh
# in either repository
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
# cli-messaging only
pnpm smoke:bun
# tg-cli, read-only against the owner's account
bin/tg account show && bin/tg chats list --limit 3 && bin/tg messages list me --limit 2
```

Conventional commits, a branch and a PR per change, rebase-merge after CI; the owner has asked for
PRs to be merged once green.

## 7. What NOT to read or touch

- **`../max-cli`** — read `src/` and `docs/dev/` to copy from; never edit it (several agents work
  there, worktree rules in its `CLAUDE.md`). Its `docs_ai/` is private and not needed here.
- **`../cli-core`** — use, do not change; it has its own release process.
- **mtcute's sources** beyond the `.d.ts` of the method you call.
- **`.tg/`** in the checkout — the owner's live session; never print, copy or commit it.
- **The spike report's history** — it is evidence, not instructions; the findings are summarised in §4.
