# Handoff — tgcli parity follow-ups: SMS login, folder show, metadata only-missing, job management (2026-10-08)

## 1. What this is

`tg` (this repo) is a CLI for a personal Telegram account built on the shared SDK `@leemour/cli-messaging`
([HANDOFF.md](../../HANDOFF.md) is the project map). It now matches [dapi/tgcli](https://github.com/dapi/tgcli)
except four small options, listed in [from-tgcli.md](../from-tgcli.md). The owner asked for all four:

1. **SMS login code** — `tg session start phone` never asks Telegram for SMS; tgcli has `auth --force-sms`.
2. **`tg chats folders show <folder>`** — one folder's chats **with their names**; `folders list` gives ids only.
   Owner: the help text does not mention that it costs requests.
3. **`tg metadata refresh --only-missing`** — refresh only groups/channels with no stored metadata yet.
4. **`tg store jobs retry`**, plus any other job management or stats that are useful (owner: "add if useful").

## 2. Orient in one call

```sh
mkdir -p ~/.cache; { T=/home/leemour/Projects/AI/tg-cli; C=/home/leemour/Projects/AI/cli-messaging
  git -C $T fetch -q; git -C $C fetch -q
  echo "== pins"; git -C $T show origin/main:package.json | grep '"@leemour/cli-messaging"'; npm view @leemour/cli-messaging version
  echo "== 1 tg login: LoginPrompts + login()"; git -C $T show origin/main:src/telegram/adapter.ts | sed -n '128,135p;233,245p'
  echo "== 1 tg session start"; git -C $T show origin/main:src/commands/session.ts | sed -n '100,108p;176,182p;200,205p'
  echo "== 2 shared folders list command"; git -C $C show origin/main:src/cli/messenger/admin-folders-command.ts | sed -n '60,70p'
  echo "== 2 shared folders service"; git -C $C show origin/main:src/services/folders.ts | sed -n '24,40p;84,85p'
  echo "== 3 shared metadata refresh command"; git -C $C show origin/main:src/cli/messenger/metadata-command.ts | sed -n '14,40p'
  echo "== 3 shared metadata service"; git -C $C show origin/main:src/services/metadata.ts | sed -n '8,35p'
  echo "== 4 shared jobs model"; git -C $C show origin/main:src/services/backfill-jobs.ts | sed -n '10,30p;82,130p'
  echo "== 4 shared jobs commands"; git -C $C show origin/main:src/cli/messenger/backfill-command.ts | sed -n '203,250p'
  echo "== open PRs"; gh pr list --repo leemour/tg-cli --limit 8; gh pr list --repo leemour/cli-messaging --limit 8
} > ~/.cache/tgcli-followups-orient.txt 2>&1
```

Then read `~/.cache/tgcli-followups-orient.txt`. It shows: the SDK pin on tg main and npm's latest; how tg calls
mtcute's `start()` for a phone login and how `session start` takes its method; the shared `folders list`
command and service; the shared `metadata refresh` command (it requires `--chat`) and service; the job record,
its states and how a job is started; the `store jobs list|show|cancel` commands; open PRs in both repos.

## 3. Read in this order (only if the orient output is not enough)

1. `node_modules/.pnpm/@mtcute+core@0.32.3/node_modules/@mtcute/core/highlevel/methods/auth/start.js:76-90` —
   what `forceSms` does: it calls `resendCode` only when the first code went to the app or e-mail.
2. `…/@mtcute/core/highlevel/methods/auth/resend-code.d.ts` — Telegram picks the next delivery type
   (`nextType`); SMS is not guaranteed.
3. cli-messaging `src/cli/messenger/backfill-command.ts` (the `store fetch` action above line 200) — the argv a
   background job is spawned with, which `retry` must rebuild.
4. cli-messaging `src/store/store.ts`, `chatMetadata` and `chats` — how to tell "no metadata yet" and list
   stored groups/channels.
5. [docs/dev/agents.md](../dev/agents.md) "The one command outside it" — how live checks run.

## 4. Do

One shared PR per item in cli-messaging where the command is shared (2, 3, 4), then one cli-messaging release,
then one tg PR adopting it. Item 1 is tg only.

1. **SMS login (tg only).** Add `--sms` to `tg session start phone` (refuse it with `qr`), carry it in
   `StartSessionOptions` and `LoginPrompts`, and pass `forceSms: true` to `this.#client.start()` in
   `src/telegram/adapter.ts` `login()`. The existing `codeSentCallback` note already prints the type Telegram
   used (`sms`, `app`, …), so the user sees whether SMS was really sent. Decision yours: flag name `--sms`
   (short, matches the tg style) or `--force-sms` (tgcli's). Check: a test in `src/commands/session.test.ts`
   that the flag reaches `start({ forceSms: true })`; `pnpm test`.
2. **`chats folders show <folder>` (shared).** Folder by id or exact title (reuse `folderOf` in
   `src/services/folders.ts`), then each chat id → name: from the local store first (`store.chats`), the
   adapter (`resolve`/`chat`) only for ids the store lacks. Answer: the folder plus `chats: [{id, title, kind}]`,
   and pinned/excluded lists by name too. Decision yours: also `--offline` (store names only, unknown ids left as
   ids) — cheap to add. Help text stays plain; do not mention cost (owner). Check: a CLI test over the fake
   adapter in `src/cli/messenger/admin-commands.test.ts`; parity row planned for tg.
3. **`metadata refresh --only-missing` (shared).** `--chat` is required. Make `--only-missing` work
   without `--chat`: every stored group/channel (`store.chats`, kind group|channel) whose `chatMetadata` is
   null, up to `--limit`. With `--chat`, skip those that already have metadata. Decision yours: whether
   `--chat` becomes optional only together with `--only-missing` (smallest change) or a general `--all`.
   Check: service test with one chat stored with metadata and one without.
4. **Job management (shared).** `store jobs retry <job>` — a `failed` or `died` job starts again as a new job
   with the same chat, `limit`, `pageSize`, `last`; a fetch resumes where the store stopped, so this is safe.
   `--failed` retries every failed/died job of the profile. Useful additions, decision yours which:
   `store jobs list --state <running|done|failed|cancelled|died>`; `store jobs clear` (remove finished job
   records and their logs; never a running one); a summary line in `list` (counts per state, messages fetched).
   Check: tests in `src/cli/messenger/backfill.test.ts` with the injected `spawnJob` — never a real spawn.
5. **Docs.** Each tg PR: `docs/usage.md`, `CHANGELOG.md` under `## Unreleased`, regenerated `docs/commands.md`
   (`pnpm build && node --experimental-strip-types scripts/commands.ts`) and test matrix (section 7), and the
   four rows in [from-tgcli.md](../from-tgcli.md) moved from "not in tg" to the new commands.
6. **Live check (owner approved this kind).** `bin/tg chats folders show <a folder>` read-only. SMS: do **not**
   log in on the owner's profile — it would replace the session; ask the owner to run `tg session start phone
   --sms` on a spare profile themselves. Record results in `docs_ai/live-cast.md` (private, untracked).

## 5. What bites

1. **A job does not store its command line.** `Job` has chat, limit, pageSize, last — not argv. `retry` must
   rebuild the `store fetch … --background` argv the same way the fetch command does; read it there, do not
   guess.
2. **Main moves under every PR.** Rebases conflict in `CHANGELOG.md`, `parity.json` and generated
   `docs/dev/STANDARD.md` / `docs/commands.md` / `docs/dev/test-matrix.md`: take main's generated file and
   regenerate; when a rebase resolves the changelog, check your entry is still under `## Unreleased`, not under
   a released version. When a test file conflicts on adjacent `it(` blocks, the closing `})` of one is often
   lost — run typecheck before continuing.
3. **`gh pr merge --delete-branch` reports failure when the branch is checked out in a worktree** — the PR is
   merged anyway; check with `gh pr view N --json state`.
4. **Releases collide.** Other sessions release cli-messaging often. Before a release: `npm view
   @leemour/cli-messaging version`, `gh run list --workflow release.yml --limit 1`; if a run is going, wait
   and check whether it already contains your commit. Owner: do not wait the two-hour gap — mark it
   `Released early: <who waits>` in the changelog, as `bin/release --blocked` does.
5. **Sandbox.** Only a plain `bin/tg …` reaches Telegram (no pipes, no `cd &&`). The git config is masked:
   `git switch -c <b> --no-track origin/main`, `git push origin <b>` without `-u`. A worktree's record cannot be
   deleted from here — `bin/prune-worktrees` from the owner's terminal does it.
6. **Every new option needs a CLI-level test** or tg CI fails on the test matrix; new shared commands need a
   `parity.json` row (planned for tg in the shared PR).
7. **Telegram decides SMS.** `forceSms` only asks; the answer may still be `app`, or `PHONE_CODE_EXPIRED`
   style errors on a slow resend. Show what Telegram chose; do not claim SMS was sent.

## 6. Do not touch

- `bin/release` in both repos and npm publishing of tg-cli — the coordinated release (tg PR 356 is preparing
  0.36.0); release only cli-messaging, and only your own merged work.
- The owner's `default` session: no `session start` / `session end` on it.
- Other agents' worktrees and open PRs (orient output lists them).

## 7. Check

```sh
# tg-cli worktree
pnpm lint && pnpm typecheck && pnpm test && pnpm docs:check && pnpm parity:check && pnpm test:matrix
# cli-messaging worktree
pnpm lint && pnpm typecheck && pnpm test && pnpm docs:check && pnpm parity:render && pnpm vitest run src/parity
```

Live checks: profile `default` through this checkout's `bin/tg` (it has its own login in `.tg/`); test chats
and accounts are in `docs_ai/live-cast.md`.
