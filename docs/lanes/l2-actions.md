# Lane L2 · acting on messages — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-29.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). This lane
adds what **changes a message others see** — edit, delete, forward, pin, react, mark read, polls —
each command with its MCP tool, as max-cli has them. Every one of them is a write to a real person.
Plan: [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md)
(from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, permissions, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The path a new adapter method takes, and what bites project-wide | [`HANDOFF.md`](../../HANDOFF.md) §3c and §4 |
| What max-cli does, to copy | `/home/leemour/Projects/AI/max-cli/src/commands/messages.ts`, `reactions.ts`, `polls.ts`, `src/client.ts` `messages`/`polls`, `src/mcp/tools.ts` `SEND_TOOLS`/`MARK_READ_TOOLS`/`DELETE_TOOLS`, `src/commands/mcp.ts` flags (read only) |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5 |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/cli/messenger/messages-command.ts` `guardedSend` — **the shape of every
   write**: resolve → `guard.check` → act → `guard.record`, on every outcome. Yours copy it.
2. `../cli-messaging/src/sends/guard.ts` and `permissions.ts` — the guard already knows every kind
   you need (`edit`, `forward`, `pin`, `reaction`, `read`, `delete`) and which count toward the
   hourly limit; copied from max-cli, unused until now.
3. `../cli-messaging/src/mcp/tools/messages-send.ts` and `../cli-messaging/src/mcp/server.ts` — a
   write tool carries `permission`, is offered only with its flag, and goes through `--confirm-send`.
4. `../cli-messaging/src/cli/messenger/mcp-command.ts` — where `--allow-mark-read` and
   `--allow-delete` go, beside `--allow-send`.
5. `src/telegram/adapter.ts` `send()` — how a Telegram write is called and its errors mapped;
   `src/send-guard.test.ts` — how tg tests a guarded write.

## 4. The work, in order

| # | Item | Done when | max-cli source |
|---|---|---|---|
| 1 | `messages edit` + tool | guarded as `edit`; the answer is the edited message | `messages.ts`, `edit-pin-forward.test.ts` |
| 2 | `messages forward` + tool (`--silent`) | guarded as `forward` against the *target* chat | same |
| 3 | `messages pin\|unpin` + tools | groups and channels; `--notify` off by default | same |
| 4 | `reactions add\|remove` + tools | permission `reaction`; the emoji is shown in the confirm form | `reactions.ts`, `reply-and-react.test.ts` |
| 5 | `chats mark-read` + MCP `--allow-mark-read` | the other side sees it — a separate flag, not implied by `--allow-send` | `chats.ts`, `mark-read.test.ts` |
| 6 | `messages delete` (owner only by default, `--for-everyone`, `--allow-dangerous`) + MCP `--allow-delete` | at most 10 at once; each counts in `sendsPerHour` | `messages.ts`, `delete-messages.test.ts` |
| 7 | `polls vote\|create\|close` + tools | options by id, not position | `polls.ts`, `polls.test.ts` |

Each item: command in cli-messaging, adapter method in tg, tool, tests both sides, README,
`docs/mcp.md`, the skill's boundaries. Then release (docs/dev/agents.md).

## 5. Decisions you will make yourself

- The subcommand layout: put your subcommands in files of their own and add one line each to
  `messagesCommand`, so lane L3 (which also extends `messages`) does not conflict with you.
- Which of Telegram's extras to take now (e.g. revoking a forward's author, reaction limits for
  non-Premium) and which to leave for later.

## 6. What will bite

1. **Every live check here writes.** Only in Saved Messages (`me`), and only for the item you are
   on: send a message there, then edit, pin, react to, and delete *that* message. Never another chat.
2. **An unknown outcome is not a failure.** Copy `guardedSend`'s handling: `outcome_unknown` is
   recorded as such and the retry handle is handed back (Telegram dedupes sends by `random_id`,
   HANDOFF.md §4.10; check whether your call has an equivalent before promising a safe retry).
3. **`--confirm-send` resolves chat arguments named `chat` and `to`** (`confirm.ts`
   `CHAT_ARGUMENTS`). Name a forward's target `to`, so the form shows where it goes.
4. **Telegram's delete is one call for "for me" and "for everyone"** (`revoke`); the default must be
   the owner only, as in max-cli.
5. **Lane L3 also edits `messages-command.ts`**; see §5.

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes' worktrees.
- `.tg/` — the copied login.
- Any chat but Saved Messages, live.

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test          # both worktrees
bin/tg messages send me "L2 check" --json   # alone, never piped; then edit/pin/react/delete that id
bin/tg sends list --limit 3 --json
```
