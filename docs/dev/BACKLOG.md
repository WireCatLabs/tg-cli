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

- **TG-1** · P1 · Docs and the skill say `search all` reads only this machine; by default it also sends the
  query to Telegram's server (`--backend both`). Say so, and say that `--offline` keeps it local — verified
  2026-10-23: no network connection, exit 0, exit 6 on an empty store. Fix README.md:76, docs/usage.md:541,
  skills/tg-cli/SKILL.md:150 and :293 to match docs/search.md:526; name `--offline` and `--backend archive` in
  `search all --help`.
- **TG-31** · P1 · `docs/compare.md` is stale: it links the old tgcli upstream, says tgcli has no multi-account
  (it has), and leaves out tlgr and mcp-telegram. Evidence: cli-private `research/comparisons/tg.md`.
- **TG-2** · P1 · Release main: npm 0.81.0 still accepts a mistyped `permissions` key with only a warning, so the
  restriction does not hold, and still has `catch_up_marks_read`; main fixed both (cli-core 0.391.0). Starts at
  `CHANGELOG.md` `## Unreleased`, `bin/release`. Ship TG-4 in it.
- **TG-3** · P1 · Installation names only npm 12's "install scripts blocked"; npm 11.17 already prints
  `allow-scripts … not yet covered by allowScripts` for `@wirecat/tg-cli` and `better-sqlite3`. Say both are
  harmless and why. docs/installation.md:19,41, README.md:50.

## Next (P2)

- **TG-4** · P2 · `contacts prepare` (unreleased) is only in the generated commands page: add it to
  docs/people.md and skills/tg-cli/SKILL.md beside `contacts context`.
- **TG-5** · P2 · Chat archive, pin and mark unread: mount cli-core's `chats archive|unarchive|pin|unpin|mark-unread`
  in the adapter (wa has them). mtcute `archiveChats`, `markChatUnread`; pin is raw. Starts in
  src/telegram/adapter.ts. [Plan, slice 4](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#4-archive-chat-pins-and-unread--shared-commands-built-tg-and-max-adapters-open).
- **TG-6** · P2 · Settings writes: `chats mute|unmute --until` (max and wa have them). Starts in
  src/telegram/adapter.ts; the shared command's `AccountSettings` group. Issue #447.
- **TG-7** · P2 · Several photos in one album: `messages send --file` repeated, through raw
  `messages.sendMultiMedia` with random ids from the send id. Refusal today: src/telegram/messages.ts:270.
  [Slice 3](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#3-albums--tg-only),
  issue #445. 🚩 NEED: does an album count once or per item toward `sends_per_hour`.
- **TG-8** · P2 · Save a reply into the chat's draft: `messages send --draft` (decided 2026-10-04), mtcute
  `saveDraft`. [Slice 2](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#2-drafts--both-shared-owned-by-telegram-actions-g4-b3).
- **TG-10** · P2 · Verified media archive: mount cli-core's `attachments download|check|jobs` once cli-core#1758
  is released. 🚧 `feat/media-archive` (PR #659, draft).
- **TG-11** · P2 · 🟡 The release-checks workflow now calls cli-base's `release-checks.yml` 0.50.1. Left: cli-base
  0.49.0 → 0.50.1 in package.json, which PR #662 does with cli-core 0.396.0.
- **TG-12** · P2 · cli-core's parity.json is behind tg: it lists `guide`, `mentions`, `runs search`, `tasks reject`,
  `--brief`/`--full` as missing from tg, and its "tg-cli backlog: …" pointers named no item here. Point them at
  TG-5…TG-8 and BACKLOG_LATER ids. Starts in cli-core `parity.json`.
- **TG-13** · P2 · The on-disk `HANDOFF.md` (kept out of git since #614) was last changed 2026-10-14 and a new
  worktree has no copy; cli-core's gaps plan cites a "§3b.5" it does not have. Refresh it, and say in
  docs/dev/agents.md where a lane gets it.
- **TG-14** · P2 · Decide PR #469 (skill: search again in other words before saying "not there"), open since
  2026-10-13: merge after a rebase or close.
- **TG-19** · P2 · Bot buttons and bots: `messages press` (`getCallbackAnswer`, never its password), `chats start`,
  `chats app`. Needs a shared button model and a verb (🚩).
  [Slice 6](https://github.com/WireCatLabs/cli-core/blob/main/docs/dev/messenger-feature-gaps.md#6-pressing-buttons-in-bot-messages--shared-model-first).
- **TG-32** · P2 · MCP offers every command (owner, 2026-10-23); 95 commands and the 185 raw `bot api` methods are
  missing today — among them `store export|backup`, `replies *`, `schedule *`, `recipients add|remove|clear`,
  `chats rules set`, `bot webhooks *`. The docs list the few exceptions.
