# Backlog

Open work only. A finished item is deleted in the PR that ships it; users read what shipped in
`CHANGELOG.md`.

- **Setup JSON alignment** (WC-OUT-9, WC-OUT-11, WC-OUT-12): rename `setup`'s `item.next` command map
  to `item.commands`, reserving envelope `next` for structured continuation steps. Keep login details under
  `item.session`, as WhatsApp's standards alignment does; move this answer construction into cli-core when the
  whole setup wizard is shared. Source: `src/commands/setup.ts:182`. The shared package currently owns only
  screen/prompt helpers, not the answer. No runtime change is included in this backlog entry.

- **Reactions broken down by emoji in message rankings** — `tg stats messages top --measure reactions` ranks by
  the total only; show each top message's reactions by emoji (for example 👍 4, 😂 3) beside the total, in the
  table and in `--json`. Starts in cli-core `src/store/sqlite/rankings.ts` and `src/domain/rankings-options.ts`.
- **Commands and MCP through a running `serve`** — Telegram asks for one main session per login, and
  today every process opens its own connection. Measured harmless so far; the design for routing
  through `serve` is in [session-sharing.md](session-sharing.md). Deferred.
- **A reaction update seen live** — `watch --events` and `serve` handle reactions through mtcute's raw
  update stream, but no live run has observed one yet.
- **Search ranking quality** — unmeasured; it needs a person to judge results.
