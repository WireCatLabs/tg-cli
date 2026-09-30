# Cleanup — to remove after confirmation

- stale worktree records in `.git/worktrees/` — folders that no longer exist (`rebase-agents`, `wt`, `tg-cli3`, `tg`, `tg-cli-wt-*`) — and the branches they hold, `feat/agents-guarded`, `lane/l5-archive`, `l5/cleanup-done`, all merged; the sandbox cannot delete them. From the main checkout: `git worktree prune -v && git branch -D feat/agents-guarded lane/l5-archive l5/cleanup-done`. `prune` touches only records whose folder is gone — `git worktree prune --dry-run -v` lists them first — never a running agent's worktree (2026-09-30)
- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- branch `chore/release-0.40.0` in cli-messaging, on GitHub — two PRs under that name, one merged and one closed; ask the lane that closed its PR before deleting (2026-09-30)
