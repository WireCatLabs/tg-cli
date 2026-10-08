# Cleanup — to remove after confirmation

- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- worktree records whose folders are already gone — `.worktrees/{check,folder-rules,tgcli-gaps}` and four under `/tmp` — and their merged branches; the sandbox cannot delete a record: run `bin/prune-worktrees` (2026-10-08)
