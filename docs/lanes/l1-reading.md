# Lane L1 · reading — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-29.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). This lane
brings tg's **reading** to max-cli's level and past it — each command with its MCP tool, in one PR
per item. Why and how the lanes split: [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md)
(from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, permissions, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The path a new adapter method takes, and what bites project-wide | [`HANDOFF.md`](../../HANDOFF.md) §3c and §4 — only those two sections |
| What max-cli does, to copy | `/home/leemour/Projects/AI/max-cli/src/commands/`, `src/client.ts`, `src/mcp/tools.ts`, `docs/commands.md` (read only) |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5 |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/cli/messenger/inbox.ts` — the newest shared command: how a command, its
   pure logic over the adapter and its tool fit together; the shape to copy.
2. `../cli-messaging/src/mcp/tools/inbox.ts` and `../cli-messaging/src/mcp/tool.ts` — how a tool
   is declared, and that it answers what the command's `--json` prints.
3. `../cli-messaging/src/cli/messenger/port.ts` — `MessengerAdapter`; a method you add is
   **optional**, reached with `capability()`.
4. `src/telegram/adapter.ts` `chats()` and `history()`, and `src/telegram/map.ts` `toChat` — how a
   Telegram dialog becomes a `Chat`; where muted, archived and mentions will come from.
5. The max-cli source of the item you are on (the table below names it).

## 4. The work, in order

| # | Item | Done when | max-cli source |
|---|---|---|---|
| 1 | **`inbox` leaves out muted and archived chats** unless they mention the owner or reply to them; `--all` shows everything (owner: NEED-19 → A). Telegram's dialog has `isMuted`, `isArchived`, `unreadMentionsCount` (mtcute `Dialog`, `node_modules/.pnpm/@mtcute+core@0.32.3/…/types/messages/dialog.d.ts`). First measure, counts only: how many of the owner's unread chats are muted | `bin/tg inbox --json` shows mostly chats the owner would be notified about; the tool takes `all` | `src/client.ts` `inbox` (no filter there — this is Telegram's extra) |
| 2 | `review` and the `review` prompt, with `--chat` and `--unanswered` | a review of 1d answers, cut at the snapshot, `until` is the next `--since` | `src/review.ts`, `src/commands/review.ts`, `src/client.ts` `inbox.review`, `src/mcp/prompts.ts` |
| 3 | `chats list --search --kind --unread` (the tool too) | filters combine; `--search` at least 3 characters | `src/commands/chats.ts`, `max_chats_list` |
| 4 | `messages list --after` (a message id or a time) | `--before` and `--after` together is exit 2 | `src/commands/messages.ts` |
| 5 | `chats events` — joins, leaves, adds, removes from service messages | 7 days without `--since` | `src/commands/chats.ts`, `max_chats_events` |
| 6 | `chats members list` | the whole list of a group, paged | `max_chats_members` |
| 7 | `contacts lookup` (phone from stdin, never argv) and `contacts sync` | a number never appears in argv, a run or a log | `src/commands/contacts.ts` |
| 8 | `account sessions list` | lists the owner's devices; nothing ends one | `src/commands/account.ts` |
| 9 | `chats inspect <link>` | what an invite leads to, without joining | `src/commands/chats.ts` |
| 10 | `topics list\|search` — forum topics (Telegram has them, MAX does not; kfastov/tgcli does) | a forum group's topics with ids | — |

Each item: the command in cli-messaging, its adapter method in tg, its tool, tests on both sides,
README, `docs/mcp.md`, `skills/tg-cli/SKILL.md`. Then release (docs/dev/agents.md).

## 5. Decisions you will make yourself

- Whether muted/archived/mentions become `Chat` fields (an additive change to the output contract)
  or stay in `providerMetadata`. Prefer fields: `inbox` and `chats list --unread` both need them.
- The name and default of the `inbox` flag (`--all`), and whether the tool's default matches.
- For `--after` with a Telegram message id: ids are per chat, so `--after <id>` is exact within a
  chat, and a time works everywhere.

## 6. What will bite

1. **The owner's account is busy**: 88 of the newest 100 chats had unread messages on 2026-09-29,
   3.3 million in groups. Anything that reads "every unread" must be capped, and every live check
   prints counts, never text.
2. **Walking every dialog hit FLOOD_WAIT once** (HANDOFF.md §4.14). Read a window (`limit: 100`)
   and say `partial` when there is more; never page to the end to filter.
3. **`Date.parse("12345")` is the year 12345.** Decide time versus id by shape (see `momentOf` in
   `inbox.ts`), never by trying `Date.parse`.
4. **A Telegram message id carries no time**, unlike MAX's (max-cli's `timeOfMessageId`). Every
   max-cli feature that turns an id into a time needs a different answer here.
5. **Lanes L2 and L3 also edit `messages-command.ts`** — put your subcommand in a file of its own.
6. **Store migration**: the next free number is in the lanes plan §4; `chats events` or members may
   want one. Announce before writing it.

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named above; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes' worktrees.
- `.tg/` — the copied login; never print, copy or commit it.
- cli-messaging's `src/store/` unless your item needs a migration.

## 8. How to check

```sh
# in each worktree
pnpm lint && pnpm typecheck && pnpm test
# tg, live and read-only, counts only
bin/tg inbox --json | jq '{mode, chats: (.chats|length), skipped: (.skipped|length)}'
```
