# Cleanup — to remove after confirmation

- stale worktree records `.git/worktrees/rebase-agents` and `.git/worktrees/wt`, and the branch `feat/agents-guarded` — the sandbox cannot delete them; from the main checkout: `git worktree prune && git branch -D feat/agents-guarded` (2026-09-29)
- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- branch `chore/release-0.40.0` in cli-messaging, on GitHub — two PRs under that name, one merged and one closed; ask the lane that closed its PR before deleting (2026-09-30)
- lane L5's worktrees `.worktrees/l5-archive/{cli-messaging,tg}` and branches `lane/l5-archive` (both repos) and `l5/*`, `feat/*`, `fix/*` it made locally — its work is merged; remove when L5 is closed (2026-09-30)
