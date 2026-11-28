### Changed — may break callers

- **`tg <profile> account sessions` is now `tg <profile> account devices`, with no alias.** It lists the devices and
  apps signed in to your Telegram account, the word Telegram uses too. `account sessions list` is now
  `account devices list`, and `account sessions end --others` is now `account devices end --others`. The permission
  key `account.sessions.end` is now `account.devices.end`: a profile that saved the old key is refused with a message
  that names the new one.

### Fixed

- tg-cli's package is smaller: it no longer carries its own copy of cli-core. Built on @wirecat/cli-core 3.0.0 and
  @wirecat/cli-base 2.1.0. Needed for the WireCat store version 79 (memo became wcat).
