# Backlog

Open work only, P1 and P2, most important first. P3 and research: [BACKLOG_LATER.md](BACKLOG_LATER.md).
What tg does today: [`../commands.md`](../commands.md) (generated). What shipped: `CHANGELOG.md`.

## Rules

- **An id is permanent** and never reused: `TG-<n>`, the next number above the highest on any branch.
- **One item:** id · priority · the task as a title · where the work starts · a link to details. Analysis goes
  to a plan or [BACKLOG-NOTES.md](BACKLOG-NOTES.md), a ruling to the private `DECISIONS.md`.
- **Priority:** **P1** breaks something real, tells users something untrue, or blocks install — done before
  tg is advertised · **P2** this cycle · **P3** someday, in [BACKLOG_LATER.md](BACKLOG_LATER.md).
- **Mark:** none — not started · 🚧 `<branch>` — taken · 🟡 — half done, the rest named · ⏸️ — deferred by the
  owner · 🚩 — waits on an owner decision.
- **Claim before code:** put `🚧 <branch>` on the line in the first push of the branch.
- **Close in the PR that ships the work:** delete the line here in that PR.

## Launch blockers (P1)

None.

## Next (P2)

- **TG-34** · P2 · Switch `src/bin/tg.ts` to cli-core's `startCli` ([cli-core
  #1924](https://github.com/WireCatLabs/cli-core/pull/1924)): `sqlite: true`, `run: ({ args }) => run(args)`. Only the
  bin changes — cli-core's `run()` keeps the signals and pipes, so do not wrap it in a second set. Start:
  `src/bin/tg.ts`.
