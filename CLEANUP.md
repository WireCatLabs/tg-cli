# Cleanup — to remove after confirmation

- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- `/home/leemour/Projects/AI/tg-cli-wt-standards-lint` (worktree, branch `feat/standards-lint`) — phase 0 command lint wiring; remove after its PR merges; 2026-10-13
/home/leemour/Projects/AI/tg-cli-wt-baseline-biome — worktree for the Biome baseline exclusion, merged — 2026-10-13
- `/home/leemour/Projects/AI/tg-cli-wt-core-268` (worktree, branch `chore/cli-core-0.268`) — the cli-core 0.268.0 adoption; remove after its PR merges; temp state folders `/var/tmp/tmp.*` from its test runs; 2026-10-14
- `backup/source-search-own-baf28a5` (local branch) — the earlier tasks-and-notes version of feat/source-search-own, before the owner reversed it; remove after tg-cli#487 merges; 2026-10-14
