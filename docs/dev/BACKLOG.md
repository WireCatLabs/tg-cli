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

- **TG-2** · P1 · Release main: npm 0.81.0 still accepts a mistyped `permissions` key with only a warning, so the
  restriction does not hold, and still has `catch_up_marks_read`; main fixed both (cli-core 0.391.0). Starts at
  `CHANGELOG.md` `## Unreleased`, `bin/release`. Ship TG-4 in it.

## Next (P2)

- **TG-7** · P2 · Several photos in one album: `messages send --file` repeated, through raw
  `messages.sendMultiMedia` with random ids from the send id. Refusal today: src/telegram/messages.ts:270.
  [Slice 3](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#3-albums--tg-only),
  issue #445. 🚩 NEED: does an album count once or per item toward `sends_per_hour`.
- **TG-8** · P2 · Save a reply into the chat's draft: `messages send --draft` (decided 2026-10-04), mtcute
  `saveDraft`. Waits on cli-core: the shared `--draft` option, a port method and a guard key (`drafts`); then the
  adapter is one call. [Slice 2](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#2-drafts--both-shared-owned-by-telegram-actions-g4-b3).
- **TG-10** · P2 · Verified media archive: mount cli-core's `attachments download|check|jobs` once cli-core#1758
  is released. 🚧 `feat/media-archive` (PR #659, draft).
