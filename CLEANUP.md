# Cleanup — to remove after confirmation

- AppArmor: `/etc/apparmor.d/bwrap` and the `disable/bwrap-userns-restrict` link — still needed while the sandbox is on; `sudo bin/enable-sandbox --undo` if it is ever turned off (2026-09-29)
- branch `chore/release-0.40.0` in cli-messaging, on GitHub — two PRs under that name, one merged and one closed; ask the lane that closed its PR before deleting (2026-09-30)
