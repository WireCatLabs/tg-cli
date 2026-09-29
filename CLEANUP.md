# Cleanup — to remove after confirmation

- local branches `feat/agents-guarded`, `feat/agents-sandboxed-no-prompts`, `feat/sandbox` — merged as #52 (the first two, rebased) or superseded (`feat/sandbox`, never pushed); `git branch -D` asks under the owner's rules (2026-09-29)
- stale worktree record `.git/worktrees/rebase-agents` — the worktree is gone, but `git worktree prune` cannot delete the record from inside the sandbox; run `git worktree prune` from a terminal (2026-09-29)
- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- `sandbox-probe.1132107` at the repo root — a probe file left by a `bin/check-agents` run that stopped before item 3 removed it (2026-09-29)
