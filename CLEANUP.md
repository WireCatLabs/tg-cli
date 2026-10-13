# Cleanup — to remove after confirmation

- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- `/home/leemour/Projects/AI/tg-cli-wt-standards-lint` (worktree, branch `feat/standards-lint`) — phase 0 command lint wiring; remove after its PR merges; 2026-10-13
