# Backlog

Open work only. A finished item is deleted in the PR that ships it; users read what shipped in
`CHANGELOG.md`.

- **Commands and MCP through a running `serve`** — Telegram asks for one main session per login, and
  today every process opens its own connection. Measured harmless so far; the design for routing
  through `serve` is in [session-sharing.md](session-sharing.md). Deferred.
- **A reaction update seen live** — `watch --events` and `serve` handle reactions through mtcute's raw
  update stream, but no live run has observed one yet.
- **Search ranking quality** — unmeasured; it needs a person to judge results.
