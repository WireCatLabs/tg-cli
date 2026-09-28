# Lane L3 · richer sending — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot 2026-09-29.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). Today
`tg messages send` sends plain text. This lane makes it send what max-cli and kfastov/tgcli send —
files, photos, voice, silent, formatted, scheduled, into a forum topic — with the MCP send tool
taking the same options. Plan: [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md)
(from a worktree: `../cli-messaging/docs/plans/2026-09-29-parity-lanes.md`).

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, permissions, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The path a new adapter method takes, and what bites project-wide | [`HANDOFF.md`](../../HANDOFF.md) §3c and §4 |
| What max-cli does, to copy | `/home/leemour/Projects/AI/max-cli/src/commands/messages.ts` (send), `src/upload.ts`, `src/voice.ts`, `src/markdown.ts`, `src/config.ts` `sendTime`, `src/mcp/tools.ts` `max_messages_send` and `max_messages_scheduled` (read only) |
| What kfastov/tgcli offers on send | its `docs/cli.md`, `send text\|photo\|file`: `--schedule`, `--silent`, `--no-preview`, `--parse-mode`, `--topic`, `--spoiler`, `--force-document` |

## 3. What to read for this lane, in order

1. `../cli-messaging/src/cli/messenger/messages-command.ts` `sendText` and `guardedSend` — the one
   guarded path every send takes; your options travel through it, never around it.
2. `../cli-messaging/src/cli/messenger/port.ts` `send()` — its options object is where new send
   options go (`silent`, `markdown`, `at`, `topic`); an attachment may be a new optional method.
3. `../cli-messaging/src/mcp/tools/messages-send.ts` and `confirm.ts` — the tool's input, and what
   the confirmation form shows (it must show a file's name and the send time).
4. `src/telegram/adapter.ts` `send()` — `sendText` with `randomId`; mtcute's `sendMedia`,
   `sendText` options (`silent`, `schedule`, `replyTo`, `parseMode`) in its `.d.ts`.
5. The max-cli source of your item.

## 4. The work, in order

| # | Item | Done when | Source |
|---|---|---|---|
| 1 | `--silent`, `--no-preview`, `--md` (Markdown → Telegram entities) | options reach Telegram; the journal records none of the text | max `markdown.ts`; tgcli |
| 2 | `--at <time>` (scheduled) + `messages scheduled <chat>` + tool | a scheduled send answers `scheduledFor`; never retried; the form shows the time | max `sendTime`, `scheduled.test.ts` |
| 3 | `--file <path>`, `--photo <path>` (+ caption from the text) | the send id still dedupes a retry; the tool takes a path only with `--allow-send` | max `upload.ts`, `upload.test.ts`; tgcli `send photo\|file` |
| 4 | `--voice`, `--video` | Telegram shows a voice note, not a file | max `voice.ts` |
| 5 | `--topic <id>` for forum groups | lands in the topic | tgcli `--topic` |
| 6 | albums (several photos in one message) | one message, several media | — |

Each item: cli-messaging (command, options, tool, tests), tg (adapter, map, tests), README,
`docs/mcp.md`, the skill. Then release (docs/dev/agents.md).

## 5. Decisions you will make yourself

- Whether attachments extend `send()`'s options or become `sendFile?()`; prefer the smaller change
  that keeps one guarded path.
- How `--md` maps: Telegram has its own Markdown and HTML parse modes; max-cli converts Markdown
  itself. Choose one and say why in the PR.
- What an MCP client may upload: a path the server reads from disk is a way to exfiltrate a file.
  Copy max-cli's limits and state them.

## 6. What will bite

1. **Every live check here sends.** Only to Saved Messages (`me`), one message per check.
2. **A scheduled message is not sent**: it has another id once it goes, and a retry schedules a
   second one. max-cli refuses `--at` with `--send-id`; do the same.
3. **`random_id` dedupes a text send across connections** (HANDOFF.md §4.10). Check that it holds
   for media before promising a safe retry.
4. **Lane L2 also edits `messages-command.ts`** (edit, forward, pin, delete). Keep `send`'s changes
   inside `sendText`/`guardedSend` and new options; new subcommands in files of their own.
5. **The journal never holds text, captions or file names** — only lengths and kinds.

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` beyond the files named; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes' worktrees.
- `.tg/` — the copied login.
- Any chat but Saved Messages, live.

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test          # both worktrees
bin/tg messages send me "L3 *check*" --md --silent --json | jq '.message.id'
bin/tg sends list --json | jq '.items[:3] | map({kind, outcome, length})'
```
