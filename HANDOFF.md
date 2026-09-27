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

### 3a. Done 2026-09-27: 0.4.0 released — run records and the message store

`@leemour/cli-messaging@0.4.0` is on npm and tg-cli depends on it.

- **Run records** (0.3.0): `baseContext().run` records a run (`--record`, or any failure unless
  `--no-record`) and hands the body an event sink; tg's `withTelegram` wraps the adapter in
  `src/commands/observed.ts`. `tg runs list|show|path` come from cli-messaging's `runsCommand`.
- **The store** (0.4.0): `openStore()` in `@leemour/cli-messaging/store` — schema, migrations,
  save and read methods, trigram search. Nothing in tg writes to it yet. What was left out of
  migration 1, and why, is the 1.3 row of proposal §8.

A cli-messaging release is `bin/release` in `../cli-messaging` after the version bump is merged — it
runs on GitHub Actions with no token. A new version also goes into tg-cli's `pnpm-workspace.yaml` →
`minimumReleaseAgeExclude` (pnpm 11 refuses a version younger than its release-age window).

### 3b. Next planned work — the order is the owner's call

Proposal §8 puts **1.4–1.7** (the generic read commands, `send|reply`, `doctor`/`config`/…, `watch`)
before **Phase 2**. The previous handoff said Phase 2 next. Ask the owner which comes first:

- **2.1 — ingestion**: every read writes to the store, `--offline` answers from it. The store's
  first real writer, and the first step of the business milestone (archive, backfill, search).
- **1.4 — skeleton, part 2**: the generic read commands move into cli-messaging with hooks, so max
  can reuse them in Phase 4.

Small, whenever: failures *before* a command runs (usage errors, a config that will not load) are
not kept as runs. max-cli does it in `program.ts` (`keepFailure`).

For any of these, read in this order:

| File | Answers |
|---|---|
| `src/commands/context.ts` | how a command gets settings, the renderer, the guard and a Telegram connection — and how `--timeout` and the run record reach it (`withTelegram`) |
| `src/commands/observed.ts` | which ids and counts a run record names per adapter call — a new adapter method gets a line here |
| `src/commands/messages.ts` | the shape of a write: resolve → guard.check → send → guard.record |
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
    an argument that already is one, or from the answer (`src/commands/observed.ts`).
14. **zsh copies stdout into a pipe** when you write `cmd 2>&1 >/dev/null | …` (its `MULTIOS`
    option), so the data seems to reach stderr. Check stream separation under `sh -c`.
15. **An adapter must set `Message.senderIsChat`** when the author is a chat (a channel post, a
    message sent as the group). Without it the store makes an identity and a person of a channel,
    and there is no clean way to undo those rows.
16. **Migration 1 is not frozen until the first real write** (PR 2.1). Until then it may still be
    amended. A `.tg/messages.db` made by a branch build is then stale — record it in `CLEANUP.md`,
    do not delete it mid-task.
17. **npm's trusted publisher names a GitHub environment, `npm`.** A publish job outside it gets
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
