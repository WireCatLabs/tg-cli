# Lane L5 · archive and service — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-29.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). tg already
keeps a local archive (`backfill`, `serve`, `sync status`, `export`, `messages search`). This lane
makes it the archiver kfastov/tgcli is — `serve` as a system service, backfill as background jobs,
Markdown export, regex search — plus max-cli's report and estimate commands. Plan:
[the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md), row L5
(from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, the sandbox, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The store: what it keeps, what may never be dropped, migrations | [`HANDOFF.md`](../../HANDOFF.md) §4 trap 11, `../cli-messaging/src/store/migrations.ts` |
| How `serve` and `watch --events` were designed | `../cli-messaging/docs/plans/2026-09-27-background-process.md` |
| What kfastov/tgcli does (the competitor) | `github.com/kfastov/tgcli`: `service install\|start\|stop\|status\|logs`, `backfill --background`, `backfill status\|jobs`, `messages search --regex`, `auth --qr-file` |
| What max-cli does, to copy | `/home/leemour/Projects/AI/max-cli/src/commands/backup.ts` + `src/backup.ts` (estimate), `src/report.ts` + `doctor report`, `src/export.ts` (Markdown), `src/commands/server.ts` (a background server's start/stop/status) — read only |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5 — **`serve` never starts by itself** (NEED-9) |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/cli/messenger/serve-command.ts` — what `serve` does, and its lock per profile.
2. `../cli-messaging/src/cli/messenger/backfill-command.ts` — how a chat's history is walked,
   resumable and FLOOD_WAIT-aware; what a background job must wrap.
3. `../cli-messaging/src/cli/messenger/archive-commands.ts` — `sync status` and `export`.
4. `../cli-messaging/src/store/store.ts` `find` — the word index behind `messages search`, before
   adding `--regex`.
5. `../cli-messaging/docs/plans/2026-09-27-background-process.md` — why `serve` is shaped as it is.

## 4. The work, in order

| # | Item | Done when | Source |
|---|---|---|---|
| 1 | `service install\|uninstall\|start\|stop\|status\|logs` for `serve`: a systemd **user** unit on Linux, a launchd agent on macOS | `install` writes the unit and **does not start or enable it** (NEED-9); `start` starts it; `status` answers from the unit and the lock | tgcli `service` |
| 2 | backfill as jobs: `backfill --background`, `backfill status\|list\|cancel` | a job survives the command exiting; `status` shows per-chat progress from `sync_ranges` | tgcli `backfill` |
| 3 | `backfill --estimate` — how many requests and how long, before any are made | answers without fetching history | max `backup.ts` |
| 4 | `export --format markdown` | a readable transcript of a chat from the store | max `export.ts` |
| 5 | `messages search --regex` | a regex over the stored text, bounded (`--limit`), no index change needed | tgcli |
| 6 | `doctor report [create]` — a problem report with no message text | the file holds versions, paths, errors — never a message, a title or a token | max `report.ts` |
| 7 | `session start --qr-file <png>` — the login QR as an image an agent can pass on | the PNG decodes to the same login URL | tgcli `auth --qr-file` |

Each item: cli-messaging where shared (most of these are), tg where Telegram-specific, the MCP
tool where it makes sense (a `sync status` or `backfill status` tool — read-only), README,
`docs/mcp.md`, `skills/tg-cli/SKILL.md`. Then release your own work ([`docs/dev/agents.md`](../dev/agents.md)).

## 5. Decisions you will make yourself

- Where a background job lives: a detached process with a pid file and a log under the CLI's state
  folder, or `serve` taking backfill work. Prefer the smaller one that `status` can report truthfully.
- Whether `service` belongs in cli-messaging (max-cli has its own `server`) — shared if it names no
  messenger.
- Whether regex search needs a store change. If it does, it is a **migration**: the next free
  number is in the lanes plan §4 — announce it there first, in a PR of its own.

## 6. What will bite

1. **The sandbox allows writes only to tg-cli, cli-messaging, cli-core, the caches and `/tmp`.**
   `service install` writes `~/.config/systemd/user/` — outside. Test it with `XDG_CONFIG_HOME`
   pointed into `$TMPDIR`, and leave the real install to the owner; never run `systemctl` for real.
2. **The store is a system of record, not a cache** (HANDOFF.md §4.11): a base table is never
   dropped; migrations are additive and numbered; the next number is announced first.
3. **`serve` holds a lock per profile** — a service and a hand-started `serve` must not both run;
   `status` reads the lock.
4. **Backfill hits FLOOD_WAIT** on a busy account (HANDOFF.md §4.14). A background job obeys the
   wait and records it; live checks backfill one small chat with a low `--max`.
5. **Only a plain `bin/tg …` runs outside the sandbox** (Telegram's raw TCP); a background job
   started by `bin/tg backfill --background` is its child — check it can still reach Telegram.
6. **A report never holds message text, titles, phone numbers or the session** (project rule 5).

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes'
  worktrees. `.tg/` — the copied login. The owner's real `~/.config/systemd`.
- The guards (`.claude/settings.json`, `.claude/hooks/`) — the owner's; the hook refuses them.

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test          # both worktrees
bin/tg sync status --json
bin/tg backfill me --max 50 --json
```
