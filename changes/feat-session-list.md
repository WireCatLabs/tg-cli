### Changed — may break callers

- **`tg session list` lists the profiles on this computer, and `tg account list` is gone** (WC-ACCT-12, WC-CMD-8).
  It answers the same rows, takes the same query (`profile:`, `current:`) and needs no profile. There is no alias:
  a script that runs `tg account list` must say `tg session list`. `account show`, `account update`,
  `account sessions` and the rest of `account` stay.

### Added

- **`tg <profile> session status` says whether the profile is logged in, and as whom**, from this computer alone.
  `--check` asks the messenger whether the session still works, and leaves the phone number out (`account show`
  has it). From cli-core 0.751.0 (was 0.734.0).
