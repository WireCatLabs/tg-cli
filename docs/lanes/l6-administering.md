# Lane L6 · administering — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-30. **Not started** —
written ahead, to be picked up once L2–L4 have finished (three lanes at once).

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). This lane
brings the chat and contact administration max-cli has: creating and changing groups, members and
admins, invite links, folders, contact management, profile changes, and local moderation rules. It
is tier P3 — nothing depends on it. Plan: [the lanes plan](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-29-parity-lanes.md),
row L6 (from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, the sandbox, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| How a command is named — resource, verb, options | [max-cli CONVENTIONS, "Command names"](https://github.com/leemour/max-cli/blob/main/docs/dev/CONVENTIONS.md) — the one standard for both CLIs |
| How an optional adapter method is added and reached | `../cli-messaging/src/cli/messenger/port.ts` — the optional methods and `capability()` |
| What max-cli does, to copy the behaviour (read only) | the table in §4, column "max source" |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5 |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/cli/messenger/port.ts` — where each new Telegram operation is declared
   (optional, so no test fake needs an edit).
2. `../cli-messaging/src/cli/messenger/messages-delete-command.ts` — the shape of a command that
   changes something on the account: the guard, the confirmation, the run record, the MCP tool.
3. `../cli-messaging/src/mcp/tools/` — how a write tool carries its `permission`; L6 adds a new
   one (item 1).
4. `src/telegram/adapter.ts`, `members()` and `admins()` — how the Telegram side of a group is
   already read; the writes sit next to them.
5. max-cli `src/commands/chats.ts` — the whole administering surface in one file, with its help
   texts, which are the user-facing contract to match.

## 4. The work, in order

One PR per row: the shared command in cli-messaging, the Telegram method in tg, the MCP tool, the
README, `docs/mcp.md`, `skills/tg-cli/SKILL.md`, the test matrix. Names are the standard's — where
max-cli still uses an older name, the standard wins.

| # | Item | Done when | max source |
|---|---|---|---|
| 1 | MCP `--allow-moderate`: the permission every tool below needs | without it, `tools/list` has none of them | `src/commands/mcp.ts` |
| 2 | `chats create <title> [person...]`, `chats join <link>`, `chats leave <chat>` | a group made and left on a test account; `join` refuses a link that is not an invite | `src/commands/chats.ts` |
| 3 | `chats update <chat>` — title, description, and the group settings as `--<setting> on\|off`; `chats show` shows the settings | a change reads back through `chats show` | `chats.ts` `update`, `settings` |
| 4 | `chats members add\|remove <chat> <person...>` | the member list changes; `remove` keeps their messages | `chats.ts` `members` |
| 5 | `chats admins add\|remove <chat> <person>` with named rights | rights read back; `remove` leaves them a member | `chats.ts` `admins` |
| 6 | `chats link show\|reset <chat>` | `reset` makes the old link stop working | `chats.ts` `link` |
| 7 | `chats folders list\|create\|update\|delete` | the folders match what the Telegram app shows | `src/commands/folders.ts` |
| 8 | `contacts add\|remove\|block\|unblock\|rename\|import` | each reads back through `contacts show`; `import` takes a file, never phone numbers as arguments | `src/commands/contacts.ts` |
| 9 | `account update` — first and last name, bio, photo | reads back through `account show` | `src/commands/account.ts`, `src/profile.ts` |
| 10 | `account sessions end --others` | every other session ends, this one stays | `account.ts` |
| 11 | `chats rules show\|set\|unset` and `chats check` — local moderation rules and acting on them | `check` with no rule that allows an action takes none | `src/commands/rules.ts`, `check.ts`, `src/moderation/` |

## 5. Decisions you will make yourself

- **Where the moderation rules live.** max-cli keeps them in a per-profile JSON file
  (`src/moderation/rules.ts`). In cli-messaging they may go in the shared store instead — that is a
  **migration**: take the next number from the lanes plan §4, in a PR of its own, first.
- **Which Telegram call does each item.** Look it up in mtcute's documentation (mtcute.dev) or its
  types; never infer a Telegram method from max-cli's behaviour.
- **Which group settings exist on Telegram** for item 3. They differ from MAX's; keep only the ones
  Telegram has, under the same option names where the meaning is the same.
- **Whether a change asks for confirmation** in a terminal (as `messages delete` does). Anything
  others see — join, leave, remove, reset — should.

## 6. What will bite

1. **Everything here is visible to other people** — they see you join, leave, add or remove them.
   Live checks only in a group made for the check, with a second test account; never on a real
   chat, never on the owner's contacts.
2. **Telegram rate-limits admin actions hard** (FLOOD_WAIT, [`HANDOFF.md`](../../HANDOFF.md) §4).
   A test that adds many members in a loop will be told to wait for minutes or hours.
3. **Basic groups and supergroups are different objects** in Telegram, with different calls for
   the same action; a basic group becomes a supergroup on some changes and its id changes with it.
4. **`contacts import` takes phone numbers** — they never go into a log, a fixture or the run
   record; only the count does.
5. **`account sessions end --others` logs the owner out of their phone too.** Only ever live on a
   test account.

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named; never edit it.
- The main checkout and other lanes' worktrees; `.tg/` — the copied login.
- The guards (`.claude/settings.json`, `.claude/hooks/`).

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test          # both worktrees
bin/tg chats show <test-group> --json
bin/tg mcp --allow-moderate                       # then tools/list through the scratch client
```
