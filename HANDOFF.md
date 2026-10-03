# tg-cli + cli-messaging — start here

**State 2026-09-29.** Read this once, then only the files your task needs from §3. It is
context, not history.

## 1. What this is

`tg` is a command line interface for the owner's **personal Telegram account** (MTProto through
[mtcute](https://mtcute.dev), not the Bot API). It is built for agents and scripts first: one
operation per call, one JSON value on stdout when piped, a typed error and a fixed exit code on
failure. Everything that is not specific to Telegram lives in the npm package
[`@leemour/cli-messaging`](https://github.com/leemour/cli-messaging) (checkout: `../cli-messaging`),
which `max` ([max-cli](https://github.com/leemour/max-cli), a MAX messenger CLI) also uses.
**Correction 2026-10-04:** MAX completed its shared command/cache cutover and P7 permissions;
the coordinated consumer release is prepared in `docs/dev/coordinated-release.md`. Both sit on [`@leemour/cli-core`](https://github.com/leemour/cli-core).

The goal beyond the CLI: a local archive of every messenger with search, a cross-messenger contact
graph and a CRM on top. The full design:
[the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md).

## 2. Entry points

| Question | Where |
|---|---|
| The design, the phases, what is done | [`../cli-messaging/docs/plans/2026-09-26-platform-proposal.md`](../cli-messaging/docs/plans/2026-09-26-platform-proposal.md) — §8 lists every PR with **Done** marks (row 2.4 has the search measurement); §4 the store and the CRM model; §11 the owner's rulings |
| How `serve` and `watch --events` were designed | [`../cli-messaging/docs/plans/2026-09-27-background-process.md`](../cli-messaging/docs/plans/2026-09-27-background-process.md) |
| What was measured against real Telegram in the spike | [`docs/plans/2026-09-27-spike-report.md`](docs/plans/2026-09-27-spike-report.md) — FIND-1…6 |
| What the shared package exports | [`../cli-messaging/README.md`](../cli-messaging/README.md) |
| What a user is told — every command | [`README.md`](README.md), then [`docs/index.md`](docs/index.md) and the pages it lists (**Correction 2026-10-01, evening:** the README is the full introduction again, in max's section order — owner's ruling on NEED-500; `index.md` is the short start page of the docs site) |
| How tg is built, tested and written | [`docs/dev/ARCHITECTURE.md`](docs/dev/ARCHITECTURE.md), [`docs/dev/TESTING.md`](docs/dev/TESTING.md), [`docs/dev/CONVENTIONS.md`](docs/dev/CONVENTIONS.md); what each release changed: [`CHANGELOG.md`](CHANGELOG.md) |
| How max-cli does something | `../max-cli/docs/dev/ARCHITECTURE.md` — the source most of cli-messaging was copied from. **Read only** |

No session journal and no backlog file exist in these two repositories; the proposal's §8 table is
the backlog.

## 3. Where things stand, and what to read for the next task

### 3a. Done — Phases 1 and 2 of the proposal (2026-09-27)

`tg` uses **`@leemour/cli-messaging`** (**Correction 2026-10-01:** the version is the pin in
`package.json`, not one written here). What it does now: login (`session`), guided first run (`setup`; **Correction 2026-10-03:**
root help, `setup --help` and `skill show` explain onboarding before login), `upgrade`, `account show`,
`chats list|show`, `contacts list|show`, `messages list|show|context|send|search`, `watch
[--events]`, `serve`, `store fetch|status|export|jobs`, `recipients`, `sends`, `runs`, `config`,
`doctor`, `commands`, `complete`. Every read is saved to a local store shared by all messenger CLIs;
`--offline` answers the list and show commands from it; `search`, `store status` and `store export`
only ever read it.

The split: **everything messenger-neutral is in cli-messaging** — the commands, saving to the store,
`--offline`, run records, the send guard, the store and its migrations. tg describes Telegram once —
`TELEGRAM` in `src/commands/context.ts` (how to connect, the chat help, `me` → Saved Messages, the
partner of a dialog, `doctor`'s Telegram checks) — and keeps only `session` and the adapter.

### 3b. Open right now

1. **tg is on npm: `@leemour/tg-cli@0.25.0`** (**Correction 2026-10-04:** current npm version; 0.26.0 is a draft candidate), released from GitHub by `bin/release`
   (trusted publishing works; the workflow publishes and tags). 0.2.0 added what is now `tg upgrade [--check]`
   and the daily "a newer version exists" line on stderr (`src/update.ts`; it wraps cli-messaging's
   `run` in `src/program.ts`). A real `npm install -g` into a throwaway prefix detected `npm`; the
   pnpm and bun paths are covered only by the path patterns in `@leemour/cli-core/update`.
2. **Not yet seen live:** a reaction update (`watch --events` / `serve` handle them through mtcute's
   raw update stream; 150 s of listening saw none). Edits and deletions are confirmed.
3. **Search ranking quality is unmeasured** — it needs a person to judge the results.
4. **Done in cli-messaging 0.21.0:** a failure *before* a command runs (a usage error, a config that
   will not load, a command that never opens a run) is kept as a run by `run()`; tg passes
   `configuration: CONFIG` in its program definition for that. The command path stops at the first
   word that is not a command, so `--timeout 30s chats list` is kept as bare `tg` (as in max-cli).
5. **Phase 3 is done** (the owner: MCP may send, as max-cli; aim at feature parity with max-cli —
   proposal §8 has the Phase 3 rows and the parity tiers P1–P3): `tg mcp` with read tools,
   `--allow-send` / `--confirm-send`, the `reply` and `find` prompts, the `tg://chat/{id}` resource
   (`../cli-messaging/src/mcp/`; a write tool carries `permission` and goes through `guardedSend` in
   `messages-command.ts`; user docs in [`docs/mcp.md`](docs/mcp.md)), and `tg skill show`
   (**Correction 2026-10-01:** since cli-messaging 0.77.0 the profile's `permissions` levels decide
   which tools an agent gets; `--allow-send`, `--allow-mark-read` and `--allow-delete` only warn)
   ([`skills/tg-cli/SKILL.md`](skills/tg-cli/SKILL.md) — keep it in step with every new command).
   `tg inbox` shipped (**Correction 2026-10-01:** the version stamp is dropped, see `CHANGELOG.md`). **Parity now runs in parallel lanes** — the plan:
   [`2026-09-29-parity-lanes.md`](../cli-messaging/docs/plans/2026-09-29-parity-lanes.md); how agents
   run them: [`docs/dev/agents.md`](docs/dev/agents.md); each lane's handoff: [`docs/lanes/`](docs/lanes/)
   (standard: [`docs/dev/handoff-standard.md`](docs/dev/handoff-standard.md)). **Every parity command
   PR adds its MCP tool in the same PR.** Live MCP check:
   the scratch client pattern — spawn `bin/tg mcp` with the SDK's `StdioClientTransport`, and pass
   `XDG_RUNTIME_DIR` in its `env`, or the keyring is out of reach.
6. **Lanes are ordinary Claude Code sessions** (2026-09-29): `bin/lane <lane>` makes the worktrees,
   then the owner starts `claude` in `.worktrees/<lane>/tg-cli`. The guards in `.claude/` (the Bash
   sandbox, the hooks refusing a sandbox escape and edits outside tg-cli, cli-messaging and cli-core,
   `sudo` denied) are the owner's; agents cannot edit them. A plain `bin/tg …` runs outside the
   sandbox. `bin/check-agents` (owner, from a terminal) proves the guards hold. Details:
   [`docs/dev/agents.md`](docs/dev/agents.md). The bypass-mode launcher (`bin/agent`) was removed at
   the owner's request: it started sessions without the owner's settings.
7. **Phase 4** per proposal §8: max-cli moves onto cli-messaging (under max-cli's own rules — NEED-2).

### 3c. How to change things

**A new adapter method** takes the path `around`, `chat`, `contact` and `watch` took:
`MessengerAdapter` in `../cli-messaging/src/cli/messenger/port.ts` → a line in `observed.ts` (run
events) and `stored.ts` (saving) → the store if it should work `--offline` → a command in its
resource's `<resource>-command.ts` (**Correction 2026-10-01:** `commands.ts` was split per resource
on 2026-09-29, cli-messaging 3eb944b) → `TelegramAdapter` and its mapping in `map.ts` → the test fakes in tg
(`src/program.test.ts`, `src/runs.test.ts`, `src/send-guard.test.ts`, `src/offline.test.ts`,
`src/contract.test.ts`).

**A cli-messaging change reaches tg in three steps** (NEED-10 → C: each session releases its own
PRs): merge the feature PR **without** a version bump; right before releasing, `git fetch` and
`npm view @leemour/cli-messaging version`, raise the version in a `chore: release` PR, merge, run
`bin/release` in `../cli-messaging`; then in tg `pnpm add @leemour/cli-messaging@<v>` and add the
version to `pnpm-workspace.yaml` → `minimumReleaseAgeExclude`. To try an unreleased cli-messaging in
tg first, `pnpm pack` it and `pnpm add` the tarball — never commit that `file:` path.

Read in this order:

| File | Answers |
|---|---|
| `src/commands/context.ts` | what only Telegram has (credentials, the session file, `connect`) and the `TELEGRAM` description |
| `../cli-messaging/src/cli/messenger/context.ts` | how a shared command connects inside `--timeout`, saves to the store and answers `--offline` |
| `../cli-messaging/src/cli/messenger/port.ts` | `MessengerAdapter` — what an adapter must do for the shared commands |
| `../cli-messaging/src/cli/messenger/messages-command.ts` | the shared message commands; `sendText` is the shape of a write: resolve → guard.check → send → guard.record. **Correction 2026-10-01:** `commands.ts` was split into one `<resource>-command.ts` per resource on 2026-09-29 (cli-messaging 3eb944b) |
| `../cli-messaging/src/cli/messenger/watch-command.ts` | `listenUntilStopped` — how `watch` and `serve` end |
| `../cli-messaging/src/cli/messenger/stored.ts` | which reads and events are saved, and why `resolve` and `chat` are not |
| `../cli-messaging/src/cli/messenger/observed.ts` | which ids and counts a run record names per adapter call |
| `src/telegram/adapter.ts` | the only door to Telegram |
| `src/telegram/map.ts` | where mtcute's objects become the domain model — the only file that knows their shape |
| `../cli-messaging/src/store/store.ts` | what the store keeps, what an update may not erase, how a sender becomes an identity and a person |
| `../cli-messaging/src/store/migrations.ts` | the schema, and the append-only rule for changing it |

## 4. What will bite

1. **A linked `cli-messaging` brings its own copy of cli-core and commander.** An error from one is
   not an `instanceof` the other, and TypeScript says `TS2883 … cannot be named`. `run()` recognises
   errors by shape (`isCliFailure`). Use `pnpm pack` + `pnpm add` of the tarball instead of a link.
2. **mtcute writes to stdout by default** — its log handler and its login prompts. The adapter
   replaces the handler and passes `codeSentCallback` / `invalidCodeCallback`. Check any new mtcute
   call path that can print.
3. **`sendText` reads the cached current user before any request.** The adapter calls
   `client.prepare()` right after opening; without it the first send fails (FIND-5).
4. **Session storage is ours, not `better-sqlite3`** (`src/telegram/storage.ts`): a global install
   leaves better-sqlite3 without its binary (FIND-1).
5. **mtcute is pinned at exactly 0.32.3.** Pre-1.0; read its `.d.ts` in `node_modules`. `@mtcute/node`
   re-exports everything from `@mtcute/core`, including `getMarkedPeerId` and `MessageReactions`.
6. **Never run `node dist/bin/tg.js` against the account — use `bin/tg`.** It keeps config, state,
   the session and the store in `.tg/` of the checkout (the owner has a session here). The `TG_*_DIR`
   variables also change which keyring entry is used.
7. **`pnpm test` must not reach anything real.** `src/testing/sandbox.ts` moves every directory and
   clears `TG_PROFILE`, `TG_PROFILE_LOCK`, `TG_TIMEOUT`, `TG_API_ID`, `TG_API_HASH`; cli-messaging has
   its own sandbox for `MESSAGING_STORE`. A new variable that can point at something real goes there.
8. **Biome `noRestrictedImports` in two overrides does not merge** — `biome.json` repeats the mtcute
   pattern inside the `src/commands/**` rule for that reason.
9. **This is the owner's real account.** Live checks send only to Saved Messages (`me`), and only
   when the change is about sending. Read-only check: `bin/tg account show`, `bin/tg chats list
   --limit 3`, `bin/tg messages list me --limit 2`. Print counts and ids in checks, never message text.
10. **Telegram deduplicates by `random_id`, also across connections** (FIND-6) — that is what makes
    `--send-id` after `outcome_unknown` safe. Never generate a new id on a retry.
11. **The store is a system of record, not a cache.** Migrations 1–3 are shipped and frozen (2
    `sync_ranges`, 3 the word index for message text). The next is **4**, additive; a derived search
    index may be dropped and rebuilt, a base table never. Announce a migration's number to the other
    sessions (`ListAgents`) before writing it.
12. **An adapter must set `Message.senderIsChat`** for a channel post or a message sent as the group,
    or the store makes a person of a channel.
13. **`watch` starts from now; `serve` catches up.** Both open their own connection with updates on
    (`listen`); one-shot commands keep `disableUpdates: true`. A busy account produces messages every
    few seconds — a live check that expects silence is wrong. `serve` holds a lock file per profile.
14. **Telegram rate limits:** walking every dialog (`chats list --all`) right after other calls hit
    FLOOD_WAIT once; `store fetch` of 5,000 messages at one page a second did not.
15. **A typed chat is often a title.** A run event never names what was typed.
16. **zsh copies stdout into a pipe** (`cmd 2>&1 >/dev/null | …`, its `MULTIOS`) — check stream
    separation under `sh -c`. zsh also does not split `$var` into words; write multi-step live checks
    as `sh` scripts.
17. **Other sessions work in cli-messaging too** (the max-cli bot writes the shared store). Check
    `git worktree list`; never touch another session's worktree. Messages to other sessions wait for
    the owner's approval in their window and often expire — do not depend on them.
18. **npm trusted publishing:** a publish job must run in the GitHub environment `npm`, and the
    package must already exist on npm with the trusted publisher set — otherwise `E404` on the upload
    (happened for cli-messaging twice, and for tg's first publish). npm shows a new version only
    after a few minutes; `bin/release` waits and tags.
19. **A local `tsc --build` can leave `dist` without JavaScript** after `pnpm typecheck` (declarations
    only) and a deleted `dist`, from stale build info. A clean clone builds correctly — which is what
    the release workflow uses. Locally: `rm -f tsconfig.tsbuildinfo dist/tsconfig.tsbuildinfo` first.
20. **File edits outside this project, cli-messaging and cli-core are refused by a hook**
    (`.claude/hooks/writes-stay-inside.sh`), in every permission mode; `sudo` is denied. Shell
    commands are otherwise free — the sandbox was tried and turned off for the friction it caused
    ([`docs/dev/agents.md`](docs/dev/agents.md)). A refusal naming the hook is the rule working.
21. **A worktree is a lane's, never shared** (`.worktrees/<lane>/`, gitignored). It has its own copy
    of the login and an empty message store; never point it at the main checkout's `.tg/`. **Correction 2026-10-01:** for the live
    checks, `bin/tg-live` runs a worktree's build with the main checkout's logins (`default`, and the
    test account `tgtest`) and the worktree's own store — no second login per worktree.

22. **Another session also changes the shared store** — migration 4 (`account_identities`,
    cli-messaging #48, a breaking `savePeople`) came from max-cli's side on 2026-09-29, and max-cli's
    personal accounts move into the store next. Fetch before a store change; the next migration
    number lives in the lanes plan §4.

## 5. Decisions you will make yourself — make them knowingly

- what Phase 3 (MCP) exposes first.

Already ruled, do not reopen: one shared store for all messengers (NEED-1); max-cli stays untouched
until Phase 4 (NEED-2); every user registers their own `api_id` (NEED-3); publish cli-messaging on
npm while it is 0.x (NEED-5); tg is on npm and releases from GitHub (NEED-8, NEED-13, NEED-14); each session releases its own
cli-messaging PRs (NEED-10 → C); `serve` never starts by itself (NEED-9, the default); the MCP server may send, as max-cli's (NEED-15 → B);
aim at feature parity with max-cli and cover kfastov/tgcli, in parallel lanes (NEED-15, and
[the lanes plan](../cli-messaging/docs/plans/2026-09-29-parity-lanes.md)); Claude may commit, push and
open and merge PRs without a prompt (NEED-17 → A, `.claude/settings.json`); `inbox` and `review` open
tier P1 (NEED-18 → A). NEED-1…4 in the PR texts of 2026-09-28 are these, numbered before the
project's list was checked.

## 6. How to check

```sh
# in either repository
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm smoke:bun
# tg-cli only
pnpm test:coverage && pnpm test:matrix && pnpm docs:check
# tg-cli, read-only against the owner's account
bin/tg account show && bin/tg chats list --limit 3 && bin/tg messages list me --limit 2
bin/tg doctor && bin/tg store status
```

Conventional commits, a branch and a PR per change, rebase-merge after CI; the owner has asked for
PRs to be merged once green.

## 7. What NOT to read or touch

- **`../max-cli`** — read `src/` and `docs/dev/` to copy from; never edit it. Its `docs_ai/` is private.
- **`../cli-core`** — use, do not change; it has its own release process.
- **mtcute's sources** beyond the `.d.ts` of the method you call.
- **`.tg/`** in the checkout — the owner's live session and store; never print, copy or commit it.
- **`CLEANUP.md`** in both repositories lists leftover local branches, waiting for the owner's OK.
- **The spike report's history** — it is evidence, not instructions; the findings are in §4.
