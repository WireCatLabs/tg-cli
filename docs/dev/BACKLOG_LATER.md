# Backlog — later

P3: nice-to-haves, research and someday work. An item moves to [BACKLOG.md](BACKLOG.md) when it becomes P2,
with the same id. Same rules and marks as there.

## Features

- **TG-15** · P3 · Reactions by emoji in message rankings: `stats messages top --measure reactions` shows only the
  total; add each top message's reactions by emoji (👍 4, 😂 3) in the table and `--json`. cli-core
  `src/store/sqlite/rankings.ts`, `src/domain/rankings-options.ts`. Issue #448.
- **TG-16** · P3 · Private notes on chats, as tgcli keeps beside its tags (people already have them). Issue #446.
- **TG-17** · P3 🚩 · `chats delete` and `chats clear` for yourself (max and wa have them). Owner rules first whether
  clearing is allowed at all. [Slice 8](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#8-later-or-only-after-a-ruling).
- **TG-18** · P3 · Server reads: `calls list`, `chats media --type` (max has them). Issue #447.
- **TG-20** · P3 · Stickers: `stickers list`, `messages send --sticker` (max has them).
- **TG-21** · P3 · Group photo: `chats update --photo|--remove-photo`; also `--only-admins-send`,
  `--only-admins-edit-info`, `--disappear-after` (Telegram's default banned rights and auto-delete timer).
- **TG-22** · P3 · Account privacy: `account privacy show|set` (max and wa have them). Lowest priority: a wrong
  setting can expose the phone number.
- **TG-23** · P3 · Typing and location: `messages send --location <lat,lon>` and a typing signal.
  [Slice 5](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#5-typing-and-location--both-shared).
- **TG-24** · P3 ⏸️ · Commands and MCP through a running `serve`: Telegram asks for one main session per login, and
  every process opens its own connection. Measured harmless so far. Design: [session-sharing.md](session-sharing.md).

- **TG-33** · P3 · Parallel bulk download with resume, as tdl does.

## Research

- **TG-25** · P3 · A reaction update seen live: `watch --events` and `serve` handle reactions through mtcute's raw
  update stream, but no live run has observed one yet. [live-scenarios.md](live-scenarios.md).
- **TG-26** · P3 · Search ranking quality is unmeasured; it needs a person to judge results. Shared with cli-core's
  "one message search" ranking test set.
- **TG-27** · P3 · `tasks` help says "review and serve add them"; max's says "review, inbox and messages sync add
  them, serve only the requests of auto-reply rules". Find which is true for tg and fix the summary.
- **TG-28** · P3 · `tg guide <scenario>` prints steps as `tg review …` without the profile; pasted as shown they stop
  with "name a profile". Print `tg <profile> review …` (shared, in cli-core).

## Tooling

- **TG-29** · P3 · Port max-cli's `bin/next-id` so ids come from one locked counter across worktrees.
