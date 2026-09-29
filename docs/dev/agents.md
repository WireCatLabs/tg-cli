# Running agents on tg-cli

Several Claude Code sessions work at once, each on a **lane** of
[the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md), each in worktrees of
its own, without asking the owner for permission. This file is how.

## Start a lane

```sh
bin/lane l1-reading     # .worktrees/l1-reading/{tg-cli,cli-messaging}: install, build, copy the login in
bin/agent l1-reading    # Claude Code there, no permission prompts, told to read docs/lanes/l1-reading.md
bin/lane --remove l1-reading   # at the end; refuses while either worktree has uncommitted work
```

- **Worktrees live in `.worktrees/`** of the main checkout, which `.gitignore` excludes — without
  that, `git add -A` would stage each one as an embedded repository (chitchat, 2026-07-26). Checked:
  `git add -A --dry-run` lists nothing under it.
- **The login is copied, never repeated.** `scripts/seed-worktree.ts` copies the main checkout's
  session files and moves the app credentials keyring to keyring in-process; a `session start` per
  worktree would be a new device on the owner's account. The **message store is not copied**: a
  branch build may migrate it, so each lane starts with an empty one and reads fill it.
- **The two worktrees of a lane sit side by side**, so `bin/try-messaging` in the tg worktree packs
  the lane's cli-messaging and tries it, and `--undo` puts the release back. Never commit the
  `file:` path it writes.

## What an agent may do, and what stops it

| | How |
|---|---|
| **No prompts** | `bin/agent` starts `claude --permission-mode bypassPermissions --setting-sources project,local`. Bypass mode cannot be chosen in a project `settings.json` (the docs say it is ignored there), so it is the flag. `--setting-sources project,local` leaves out the owner's own settings, whose `ask` rules (`rm`, `git reset`, `git branch -D` …) ask even in bypass mode — measured. The owner's CLAUDE.md still loads |
| **File edits only in this project, cli-messaging and cli-core** | [`.claude/hooks/writes-stay-inside.sh`](../../.claude/hooks/writes-stay-inside.sh) on Edit, Write and NotebookEdit, in every mode. It also refuses the guards themselves — `.claude/settings*.json` and `.claude/hooks/` in any checkout — so an agent cannot lift them; the owner changes those |
| **Shell commands in the same folders** | the Bash sandbox ([`.claude/settings.json`](../../.claude/settings.json) `sandbox`): writes only to these three repositories, the pnpm and npm caches and `/tmp`. Local sockets are open (`allowAllUnixSockets`), so the keyring over D-Bus works — `gh` needs it. On Ubuntu 26.04 it needed [`bin/enable-sandbox`](../../bin/enable-sandbox) once, run by the owner |
| **No way out of the sandbox** | [`.claude/hooks/sandbox-stays-on.sh`](../../.claude/hooks/sandbox-stays-on.sh) refuses any Bash call that asks for `dangerouslyDisableSandbox`, which bypass mode would otherwise grant unasked |
| **The one command outside it** | a **plain** `bin/tg …` (`excludedCommands`) — Telegram connects to IP addresses over raw TCP, which the sandbox has no route for. Matched as typed: `bin/tg … \| jq`, `bin/tg … > file` or `cd x && bin/tg …` run *inside* and fail with `ENETUNREACH`. Run it alone and read the tool's output |
| **Git** | over HTTPS with `gh` as the credential helper ([`bin/git-over-https`](../../bin/git-over-https), run once by the owner) — the sandbox does not let SSH read `~/.ssh`. The sandbox also masks `.git/config` in the working folder, so an agent cannot change a repository's git config |
| **Refused, in every mode** | `sudo` (`permissions.deny`) |
| **Measured 2026-09-29**, headless, bypass | refused: shell writes to max-cli and `~`, `rm` of max-cli's `package.json`, a Write into max-cli, a Bash call asking to leave the sandbox, `sudo`; ran with no prompt: `rm` and `git branch -D` inside the project, `gh` (chained too), `git push --dry-run` over HTTPS, `pnpm test`, a plain `bin/tg account show` |
| **The owner's real account** | project rule 1: live checks read, or send only to Saved Messages through the worktree's `bin/tg` |

## Rules for a lane

- **Read your handoff, not HANDOFF.md.** `docs/lanes/<lane>.md` says what to read, in order.
- **A branch and a PR per item**, off `origin/main`, in both repositories: `git switch -c feat/<item>
  origin/main`. The worktree's own `lane/<lane>` branch is only where it parks.
- **Rebase-merge your PR once CI is green**, then start the next item without waiting.
- **Release your own merged work** (NEED-10 → C): `git fetch`, `npm view @leemour/cli-messaging
  version`, a `chore: release` PR raising it from what is really published, `bin/release`. Another
  lane may release first — `bin/release` refuses a version already on npm, so rebase, raise the
  number again, retry. Then tg: `pnpm add @leemour/cli-messaging@<v>`.
- **A store migration is announced before it is written**: the lanes plan §4 names the next free
  number; take it by editing that line in a PR of its own, merged first.
- **Do not touch another lane's worktree or branch**, even to help.

## Where lanes collide

| Where | What to do |
|---|---|
| `cli-messaging/src/cli/messenger/messages-command.ts` | L2 and L3 both add to `messages`. Put a new subcommand in a file of its own and add one line to `messagesCommand`; rebase keeps both |
| `tg-cli/src/telegram/adapter.ts`, `map.ts` | every lane adds methods. Add yours as a group at the end of the class; a rebase conflict here is two groups, keep both |
| `MessengerAdapter` in `port.ts` | a new method is optional (`edit?`), asked for with `capability()`; the wrappers pass it through (`throughWrapper`) — no edit to `observed.ts`/`stored.ts` unless you want ids in the run or a save |
| `mcp/tools/<resource>.ts` | one file per resource; a new one is a file and a line in `tools.ts` |
| `README.md`, `docs/mcp.md`, `skills/tg-cli/SKILL.md`, the proposal §8 | lists; on a conflict keep both rows |
| the version in `package.json` | see releasing, above |
| `docs/dev/test-matrix.md` | generated — on a conflict run `pnpm test:matrix` and commit what it writes, never merge it by hand. A new command or option needs a test through `run()` or an entry in `scripts/test-matrix-untested.ts`, or CI fails ([TESTING.md](TESTING.md#every-command-and-option-has-a-test-or-a-reason)) |
| coverage (`pnpm test:coverage`) | every file keeps at least 50 % of its lines; a new adapter group comes with its cases in `src/telegram/adapter.test.ts` ([TESTING.md](TESTING.md#coverage-has-a-floor)) |
| Telegram's rate limits | three lanes reading live at once share one account's FLOOD_WAIT budget; keep live checks small (`--limit 3`) |
