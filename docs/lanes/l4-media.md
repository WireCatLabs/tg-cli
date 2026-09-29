# Lane L4 · media — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-29.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). Today tg
reads a message's attachments as metadata only. This lane lets it **fetch** them — save a file, hand
an agent a photo, turn a voice message into text — each command with its MCP tool, as max-cli has
them. Plan: [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md), row L4
(from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, the sandbox, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The path a new adapter method takes, and what bites project-wide | [`HANDOFF.md`](../../HANDOFF.md) §3c and §4 |
| What max-cli does, to copy | `/home/leemour/Projects/AI/max-cli/src/download.ts`, `src/commands/messages.ts` (`download`, `transcribe`), `src/transcribe/` (`index.ts`, `models.ts`, `install.ts`, `speech.ts`), `src/commands/models.ts`, `src/commands/hearing.ts`, `src/mcp/tools.ts` (`max_messages_photo`, `max_messages_transcribe`, `heardIn`) — read only |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5; voice to text is **NEED-20 → A**: Telegram's own transcription when the account has Premium, the local model otherwise, **configurable** |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/domain/models.ts` `Attachment` — what a message already says about its
   files; a download needs a handle to fetch it again.
2. `../cli-messaging/src/cli/messenger/port.ts` — a new method is optional (`download?`,
   `transcribe?`), reached with `capability()`.
3. `src/telegram/map.ts` — where mtcute's media become `Attachment`s; the file id you will need.
4. `/home/leemour/Projects/AI/max-cli/src/download.ts` and `src/transcribe/index.ts` — the shape
   and the limits to copy.
5. `../cli-messaging/src/mcp/tools/messages.ts` and `../cli-messaging/src/mcp/tool.ts` — how a tool
   answers; the photo tool answers **image content**, not JSON (`Picture` in max-cli's `tools.ts`).

## 4. The work, in order

| # | Item | Done when | max-cli source |
|---|---|---|---|
| 1 | `messages download <chat> <message> [--output dir]` — every attachment of one message, to a folder | files land where asked, named safely; the answer lists paths and sizes, never contents | `download.ts`, `download.test.ts` |
| 2 | the MCP photo tool (`<cli>_messages_photo`): one photo as image content, ≤ 512 KB; anything else refused with the command that saves it | a Telegram photo reaches an MCP client as an image; the file's link is never in the answer | `max_messages_photo` |
| 3 | voice to text through **Telegram**: `messages transcribe <chat> <message>` + tool, via the raw `messages.transcribeAudio` call (mtcute has no high-level method; `User.isPremium` says whether it is allowed) | a Premium account gets the text; a non-Premium one gets a clear refusal naming the local model | `commands/messages.ts` `transcribe` |
| 4 | voice to text **on this machine**: `models audio list\|download`, the local model as in max-cli, and a setting choosing `telegram`, `local` or `auto` (NEED-20 → A) | `auto` uses Telegram on Premium and the local model otherwise; a missing model is a refusal naming `models audio download`, never a download | `transcribe/`, `models.ts` |
| 5 | `--transcribe` on `messages list` and `inbox`, and `transcript` on voice messages already heard | as max-cli's `hearingFields`: `unheard` lists what was not heard | `hearing.ts` |
| 6 | later: `messages download --all <chat>` (bulk, tgcli has one-message only) | paged, resumable, FLOOD_WAIT-aware | — |

Each item: cli-messaging (command, tool, tests), tg (adapter, map, tests), README, `docs/mcp.md`,
`skills/tg-cli/SKILL.md`. Then release your own work ([`docs/dev/agents.md`](../dev/agents.md)).

## 5. Decisions you will make yourself

- Where a transcript is kept: in the store (a column or a table — a **migration**, next free number
  in the lanes plan §4, announced first) or a cache file. The store is a system of record; a
  transcript is derived, so a cache may be enough.
- The default `--output`: the current folder, as max-cli, or the CLI's cache. Say why in the PR.
- The setting's name and default for the transcription source (`auto` is the ruling's spirit).

## 6. What will bite

1. **The sandbox allows writes only to tg-cli, cli-messaging, cli-core, the caches and `/tmp`.** A
   live `messages download` from your session must write under `$TMPDIR`, never `~/Downloads`.
2. **Never download a speech model yourself** — hundreds of MB, and the choice is the owner's
   (max-cli's rule). Test the local path with a fake model; tell the owner the command.
3. **Only a plain `bin/tg …` runs outside the sandbox** (Telegram's raw TCP). Do not pipe it or
   redirect it: read the tool's output.
4. **A file name comes from other people.** Sanitise it (no `/`, no `..`, no leading `.`), as
   max-cli's `download.ts` does.
5. **Media ids expire** (Telegram file references). Fetch from the message, not from a stored id,
   or refresh the reference on `FILE_REFERENCE_EXPIRED`.
6. **The owner's account is busy**: live checks on Saved Messages only — send yourself a photo and a
   voice note there (a send: only in Saved Messages, HANDOFF.md §4.9).

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes'
  worktrees. `.tg/` — the copied login.
- The guards (`.claude/settings.json`, `.claude/hooks/`) — the owner's; the hook refuses them.

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test          # both worktrees
bin/tg messages download me <id> --output "$TMPDIR" --json
```
