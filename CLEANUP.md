# Cleanup — to remove after confirmation

- stale worktree record `.git/worktrees/rebase-agents` and its branch `feat/agents-guarded` — the sandbox cannot delete the record; `bin/lanes-take-settings` (owner, terminal) prunes it, then `git branch -D feat/agents-guarded` (2026-09-29)
- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
