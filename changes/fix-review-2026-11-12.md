### Added

- **From `@wirecat/cli-core` 0.647.0** (was 0.633.0): `images read <ref>` has your coding agent read the text of one
  picture and keeps it for search; `schedule agent` starts gemini, cursor, opencode, openclaw, hermes, grok and kimi
  as well as claude and codex, and `schedule agents list` says which are on PATH; `contacts unlink --from <person>`.

### Changed — may break callers

- **Every agent schedule must be saved again** (cli-core 0.647.0). A schedule saved before is refused with
  `agent.refused` and a hint to save it again; a codex schedule needs `--allow-dangerous`.

### Security

- **`tg session end` in a run with moved folders keeps the owner's login.** With only `TG_CONFIG_DIR` or
  `TG_CACHE_DIR` moved, the state folder is still the owner's, and `session end` logged that login out on Telegram
  and deleted its file. It now answers `ended: false` with `kept: "owners-sign-in"` and changes nothing.
  `account remove` in such a run keeps the owner's session file and bots folder too.

### Fixed

- **The archive and search pages say that `messages sync --all` leaves out muted chats**, and show `--with-muted`.
