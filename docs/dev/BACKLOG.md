# Backlog

Open work only. A finished item is deleted in the PR that ships it; users read what shipped in
`CHANGELOG.md`.

- **Reactions broken down by emoji in message rankings** — `tg stats messages top --measure reactions` ranks by
  the total only; show each top message's reactions by emoji (for example 👍 4, 😂 3) beside the total, in the
  table and in `--json`. Starts in cli-messaging `src/store/sqlite/rankings.ts` and `src/domain/rankings-options.ts`.
- **Commands and MCP through a running `serve`** — Telegram asks for one main session per login, and
  today every process opens its own connection. Measured harmless so far; the design for routing
  through `serve` is in [session-sharing.md](session-sharing.md). Deferred.
- **A reaction update seen live** — `watch --events` and `serve` handle reactions through mtcute's raw
  update stream, but no live run has observed one yet.
- **Search ranking quality** — unmeasured; it needs a person to judge results.
