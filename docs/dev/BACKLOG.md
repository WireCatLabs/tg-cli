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

- **TG-8** · P2 · Save a reply into the chat's draft: `messages send --draft` (decided 2026-10-04), mtcute
  `saveDraft`. Waits on cli-core: the shared `--draft` option, a port method and a guard key (`drafts`); then the
  adapter is one call. [Slice 2](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#2-drafts--both-shared-owned-by-telegram-actions-g4-b3).
