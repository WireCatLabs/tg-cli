# Cleanup — to remove after confirmation

- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- branch `chore/release-0.40.0` in cli-messaging, on GitHub — two PRs under that name, one merged and one closed; ask the lane that closed its PR before deleting (2026-09-30)
- worktrees `.worktrees/l2-actions/{tg-cli,cli-messaging}` — lane L2 is done and both are clean; `bin/lane --remove l2-actions` (2026-09-30)
- file `x` at the repo root — a 217 KB SQLite store with test rows (1 account, 1 chat, 2 messages, made-up ids), committed by mistake in #135; `git rm x` (2026-09-30)
