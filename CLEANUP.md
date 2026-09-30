# Cleanup — to remove after confirmation

- stale worktree record `.git/worktrees/rebase-agents` and its branch `feat/agents-guarded` — the sandbox cannot delete the record; `bin/lanes-take-settings` (owner, terminal) prunes it, then `git branch -D feat/agents-guarded` (2026-09-29)
- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- worktree `.worktrees/remove-agent` and branch `chore/remove-bin-agent` (local and on GitHub) — merged as PR #64 (2026-09-29)
- branch `chore/restore-agent-checks` (local and on GitHub) — merged as PR #66 (2026-09-29)
- branches `feat/messages-photo-tool` (tg-cli and cli-messaging), `chore/release-0.35.0` (cli-messaging), `chore/release-0.5.0` (tg-cli), local and on GitHub — merged (2026-09-29)
- branches `feat/messages-transcribe` (tg-cli and cli-messaging), `chore/release-0.37.0` (cli-messaging), `chore/release-0.7.0` (tg-cli), local and on GitHub — merged (2026-09-29)
- branches `feat/local-speech` (tg-cli and cli-messaging), `chore/release-0.41.0` (cli-messaging), local and on GitHub — merged (2026-09-29)
- `~/.cache/cli-messaging/` — empty since the speech models moved to `~/.cache/cli-common/models` (2026-09-29)
- branches `l4/cli-common-cache`, `l4/release-0.42.0`, `l4/sparse-model-fakes` (cli-messaging) and `l4/cli-messaging-0.42` (tg-cli), local and on GitHub — merged (2026-09-29)
- `bin/allow-lane-tg` (untracked, main checkout) — spent: its settings line is on main since PR #74 (2026-09-30)
