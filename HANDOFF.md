# tg-cli — start here

Read this once, then only the files your task needs.

## 1. What this is

`tg` is a command line interface for the owner's **personal Telegram account** (MTProto through
[mtcute](https://mtcute.dev), not the Bot API). It is built for agents and scripts first: one
operation per call, one JSON value on stdout when piped, a typed error and a fixed exit code on
failure. Everything that is not specific to Telegram lives in the npm package
[`@wirecat/cli-messaging`](https://github.com/WireCatLabs/cli-messaging) (checkout: `../cli-messaging`),
which `max` ([max-cli](https://github.com/WireCatLabs/max-cli), a MAX messenger CLI) also uses. Both sit
on [`@wirecat/cli-core`](https://github.com/WireCatLabs/cli-core).

## 2. Entry points

| Question | Where |
|---|---|
| What a user is told — every command | [`README.md`](README.md), then [`docs/index.md`](docs/index.md); every command and option: [`docs/commands.md`](docs/commands.md) (generated) |
| How tg is built, tested and written | [`docs/dev/ARCHITECTURE.md`](docs/dev/ARCHITECTURE.md), [`docs/dev/TESTING.md`](docs/dev/TESTING.md), [`docs/dev/CONVENTIONS.md`](docs/dev/CONVENTIONS.md) |
| Open work | [`docs/dev/BACKLOG.md`](docs/dev/BACKLOG.md); the shared package's: [cli-messaging BACKLOG](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/BACKLOG.md) |
| How agents run here (worktrees, guards, `bin/tg-live`) | [`docs/dev/agents.md`](docs/dev/agents.md) |
| Live checks before a release | [`docs/dev/live-scenarios.md`](docs/dev/live-scenarios.md) |
| What the shared package exports | [`../cli-messaging/README.md`](../cli-messaging/README.md) |
| How max-cli does something | `../max-cli/docs/dev/ARCHITECTURE.md` — **read only** |

Releases run from GitHub through `bin/release` (trusted publishing; the workflow publishes and tags).
A cli-messaging change reaches tg through a cli-messaging release and a pin bump here.

## 3. How to change things

**A new adapter method** takes the path `around`, `chat`, `contact` and `watch` took:
`MessengerAdapter` in `../cli-messaging/src/cli/messenger/port.ts` → a line in `observed.ts` (run
events) and `stored.ts` (saving) → the store if it should work `--offline` → a command in its
resource's `<resource>-command.ts` → `TelegramAdapter` and its mapping in `map.ts` → the test fakes in tg
(`src/program.test.ts`, `src/runs.test.ts`, `src/send-guard.test.ts`, `src/offline.test.ts`,
`src/contract.test.ts`).

**A cli-messaging change reaches tg in three steps** (NEED-10 → C: each session releases its own
PRs): merge the feature PR **without** a version bump; right before releasing, `git fetch` and
`npm view @wirecat/cli-messaging version`, raise the version in a `chore: release` PR, merge, run
`bin/release` in `../cli-messaging`; then in tg `pnpm add @wirecat/cli-messaging@<v>` and add the
version to `pnpm-workspace.yaml` → `minimumReleaseAgeExclude`. To try an unreleased cli-messaging in
tg first, `pnpm pack` it and `pnpm add` the tarball — never commit that `file:` path.

Read in this order:

| File | Answers |
|---|---|
| `src/commands/context.ts` | what only Telegram has (credentials, the session file, `connect`) and the `TELEGRAM` description |
| `../cli-messaging/src/cli/messenger/context.ts` | how a shared command connects inside `--timeout`, saves to the store and answers `--offline` |
| `../cli-messaging/src/cli/messenger/port.ts` | `MessengerAdapter` — what an adapter must do for the shared commands |
| `../cli-messaging/src/cli/messenger/messages-command.ts` | the shared message commands; `sendText` is the shape of a write: resolve → guard.check → send → guard.record. |
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
11. **The store is a system of record, not a cache.** Consult the shared migration manifest and claim the next number before implementation; a derived search
    index may be dropped and rebuilt, a base table never. Take a migration's number in cli-messaging's `COORDINATION.md` before writing it.
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
    of the login and an empty message store; never point it at the main checkout's `.tg/`. For the live
    checks, `bin/tg-live` runs a worktree's build with the main checkout's logins (`default`, and the
    test account `tgtest`) and the worktree's own store — no second login per worktree.

22. **Another session may change the shared store.** Fetch before a store change; the next
    migration number is in cli-messaging's [`COORDINATION.md`](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/COORDINATION.md).

## 5. Rulings in force

One shared store for all messengers (NEED-1); every user registers their own `api_id` (NEED-3);
tg is on npm and releases from GitHub (NEED-8, NEED-13, NEED-14); each session releases its own
cli-messaging PRs (NEED-10 → C); `serve` never starts by itself (NEED-9); the MCP server may send,
as max-cli's (NEED-15 → B); feature parity with max-cli and kfastov/tgcli (NEED-15); Claude may
commit, push, open and merge PRs without a prompt (NEED-17 → A).

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
