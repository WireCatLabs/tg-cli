### Added

- **The first screen and first run list `pbx`** (cli-core 0.651.0), WireCat's Asterisk tool, under "Works with" and
  among the tools first run offers to install.
- **`doctor reports create` gives a pre-filled issue link** (cli-core 0.651.0) in `issue_url` and in its note. The
  title and body hold only the version, the platform and the failed run's error code; the report file stays on the
  computer until you attach it.

### Fixed

- **A mistyped profile in `TG_PROFILE` lists the profiles here** (cli-core 0.651.0), as a mistyped first word does.
- **`session start` and `setup` keep Telegram's refusal** (cli-core 0.651.0). A failed sign-in for a new profile was
  reported as "no profile named …", which hid the reason.
- **`schedule command` saves PATH without its relative folders** (cli-core 0.651.0). Under pnpm, `schedule exec`
  refused such a schedule; save it again and it runs.
- **A model at an IPv6 address such as `https://[fd00::1]` is reached again** (cli-core 0.651.0).

### Security

- **`account remove` with only the config folder moved no longer signs the owner's session out** (cli-core 0.651.0).
  The state folder there is the owner's, so the sign-in is now listed under `kept`.
