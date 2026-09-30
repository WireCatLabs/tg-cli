# Lane L4 · media — handoff

**Read this instead of [`HANDOFF.md`](../../HANDOFF.md).** Standard:
[`docs/dev/handoff-standard.md`](../dev/handoff-standard.md). Snapshot **2026-09-30**: every item
released — 1–5 (tg 0.11.0, cli-messaging 0.47.0), A (tg 0.15.0, cli-messaging 0.51.0), B (cli-messaging
0.53.0, tg 0.17.0). What is still open is under §4.

## 1. What this is

`tg` is a CLI for the owner's personal Telegram account, for agents first; everything
messenger-neutral lives in `@leemour/cli-messaging` (your worktree `../cli-messaging`). This lane
lets tg **fetch** a message's media — save its file, hand an agent a photo, turn a voice message
into text by Telegram or by a speech model on this machine — each with its MCP tool, as max-cli has
them. Plan: [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md), row L4.

## 2. Entry points

| Question | Where |
|---|---|
| How agents work here: worktrees, the sandbox, releasing, collisions | [`docs/dev/agents.md`](../dev/agents.md) — **read first** |
| The path a new adapter method takes, and what bites project-wide | [`HANDOFF.md`](../../HANDOFF.md) §3c and §4 |
| What each command and tool does, for a user | [`README.md`](../../README.md), [`docs/mcp.md`](../mcp.md) |
| What shipped when, and why | the changelogs: tg 0.5.0–0.11.0, cli-messaging 0.30.0–0.47.0 |
| Rulings | [`HANDOFF.md`](../../HANDOFF.md) §5; voice to text is **NEED-20 → A**: Telegram first, the local model otherwise, configurable. The owner's later calls: Parakeet first by default, a CLI may put its own model first (max-cli: GigaAM); models in `~/.cache/cli-common` |

## 3. What to read for the work left, in order

1. `../cli-messaging/src/speech/recognize.ts`, `openRecognizer` — **why quiet speech is lost**: the
   voice detector's settings (`threshold`, `minSilenceDuration`, `maxSpeechDuration`) and the half
   second of silence put ahead of the audio.
2. `../cli-messaging/src/speech/transcribe.ts` — **how a voice message reaches a model**: `choose`
   (flag → profile → CLI order), `hearOnline` (Telegram, or the bytes), `hearLocally`.
3. `../cli-messaging/src/speech/hearing.ts` — **how lists hear many at once**: the two-minute
   budget, what is kept and where (`openKept`).
4. `../cli-messaging/src/cli/messenger/download-command.ts` — **how a file is saved**: safe names,
   never overwriting; item 6 builds on `save`.
5. `src/telegram/adapter.ts`, `download` and `transcribe` — **what tg asks Telegram**: the message
   fetched afresh, `downloadAsIterable`, the raw `messages.transcribeAudio` polled until finished.

## 4. The work left

| # | Item | Done when |
|---|---|---|
| 1–5 | download, the photo tool, Telegram transcription, local models, `--transcribe` on lists | **released** — tg #61, #71, #75, #84, #97; cli-messaging #71, #90, #95, #106, #119, #134 |
| A | quiet speech kept by local models: the voice detector's threshold 0.5 → 0.3 | **released** — cli-messaging #147 (0.51.0), tg #111 (0.15.0) |
| B | `messages download <chat> --all`: paged, resumable (`.download-<chat>.json` beside the files), rate-limit aware | **released** — cli-messaging #154 (0.53.0), tg #117 (0.17.0) |

Still open:
- **A has no test on real speech.** The detector needs a speech recording in the repository, and the
  only ones measured are the owner's own voice (Saved Messages 126507, 126508). The owner decides
  whether one goes in, or a synthetic one is found.
- **One `tg messages download` printed its answer and never exited** (2026-09-30, stopped after 30
  minutes), although it was given `--timeout 60s` — so something stayed open after the command had
  finished, not a slow request. Not reproduced in five more runs. Since tg #125, tg names what is still
  open five seconds after a command finishes (`tg: finished, but … stayed open`) and exits: if that line
  ever shows up, it is the evidence for the cause.
- **`--all` can save a named file twice.** When a run is cut after a file is saved but before the
  progress file records it, the next run finds the plain name taken and saves `<id>-<n>-<name>` beside
  it. Only unnamed files (photos, voice notes) are recognised as `existing`. At most one file per cut.
- **`bin/release` renames a released changelog heading.** When the version it prepares is already on
  npm, it renames `## <old> —` to the next number — and if another lane released `<old>` first, that
  heading is the other lane's released section (cli-messaging `beb54e9` turned 0.51.0 into 0.52.0;
  repaired in #155). Fix idea: add a new heading, never rename one.

## 5. Decisions you will make yourself

- For A: which detector setting moves (lower `threshold`, longer `minSilenceDuration`), and whether
  it becomes a profile setting or stays a constant. Measure on 126508 before and after.
- For B: where a resumable download remembers how far it got (a file beside the output, or the
  store — a store migration is announced first, lanes plan §4, and storage phase 1 is rewriting the
  store now).

## 6. What will bite

1. **A plain `bin/tg` runs the main checkout's build, not yours**: the shell starts in the main
   checkout for every command. The lane's build reaches Telegram only when typed exactly as
   `.worktrees/l4-media/tg-cli/bin/tg …` — the owner's **uncommitted** exception in the main
   checkout's `.claude/settings.json` (NEED-5 → B: it stays local). `cd … && bin/tg`, a pipe or
   an absolute path run inside the sandbox and fail with `ENETUNREACH`.
2. **Always pass `--timeout`** to a live `bin/tg`: without Telegram, tg retries forever (BUG-18, lane L1).
3. **Telegram's transcription answers "pending" first**, and the finished text comes as an update a
   one-shot connection never gets. A repeat call returns it — measured 2026-09-29, pending twice then
   the text — so the adapter polls every 2 s for up to a minute. The account is Premium; a
   non-Premium one gets a weekly trial and `PREMIUM_ACCOUNT_REQUIRED`, which `auto` falls back on.
4. **Never download a model unasked** — hundreds of MB, the owner's call. Installed now in
   `~/.cache/cli-common/models/audio` (`CLI_COMMON_CACHE_DIR`): `parakeet-v3`, `gigaam-v3`. The
   owner's real profile sets `speechModel: gigaam-v3` (`~/.config/tg-cli/config.json`).
5. **Transcripts are kept per profile** in `<app cache>/transcripts-<profile>.db` — for `bin/tg`,
   the checkout's `.tg/cache`. A test must give its app a `<PREFIX>_CACHE_DIR`, or one test's
   transcript shows up in another (cli-messaging's `src/testing/sandbox.ts` does it for the test apps).
6. **Fake an installed model with a sparse file** (`truncateSync`), never real zeros: 670 MB per test
   pushed two tests past the 5 s limit on GitHub and failed a release (cli-messaging #123).
7. **Every lane releases, often minutes apart.** Name branches `l4/…`, check
   `git ls-remote origin refs/heads/<branch>` before creating a release branch — reusing another
   lane's name opened a stray PR once (cli-messaging #111). `main` may already carry the next
   version, and a release run may fail "already on npm" because another lane published it: check npm.
8. **A rebase can file a changelog entry under a version already released** — tg 0.9.0 listed local
   speech it did not have (fixed in #92). After a rebase, read the `## Unreleased` section.
9. **Bumping cli-messaging brings other lanes' commands** whose tg tests are not written yet, and
   `pnpm test:matrix` fails. Wait for that lane's tg PR, or name the lane in
   `scripts/test-matrix-untested.ts` and tell it.
10. **cli-messaging's tests write to the real home folder in one place** (`program.test.ts`, the
    `--timeout` test): inside the sandbox run them as `HOME=$TMPDIR pnpm test:coverage`.
11. **The main checkout cannot `git pull`**: the owner's uncommitted `.claude/settings.json` collides
    with `main`'s. Build in a worktree; never stash or touch that file.
12. **Telegram calls a voice message `voice`, MAX `audio`** — `isVoice` matches `voice` or `audio/ogg`.
13. **Never `git stash`**: every worktree of a repository shares one stash list, and a `pop` can take
    another lane's work (it happened 2026-09-30). Park work in a temporary commit instead.

## 7. What not to read or touch

- `/home/leemour/Projects/AI/max-cli` — read only; never edit it.
- The main checkout (`/home/leemour/Projects/AI/tg-cli`, outside `.worktrees/`) and other lanes'
  worktrees. `.tg/` — the copied login.
- The guards (`.claude/settings.json`, `.claude/hooks/`) — the owner's; the hook refuses them.
- The downloaded models — never delete or re-download them to "test" something.

## 8. How to check

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm test:matrix     # tg worktree
HOME=$TMPDIR pnpm test:coverage && pnpm docs:check                # cli-messaging worktree
.worktrees/l4-media/tg-cli/bin/tg messages transcribe me 126508 --model gigaam-v3 --json --timeout 120s
.worktrees/l4-media/tg-cli/bin/tg messages list me --limit 8 --transcribe --json --timeout 180s
```

Live checks read, or send only to Saved Messages (project rule 1).
