### Added

- **WireCat Desktop reads what it needs for tg from tg itself.** The manifest (`tg --wcat-describe`) now names the
  MCP server's port (8765), the two ways to sign in (QR code and phone number), the sync Desktop runs
  (`messages sync --all --timeout 120m`) and its timer (every hour by default, from 15 minutes to a day). Desktop's
  own list stays only as a fallback. From cli-base 1.2.0 (was 1.0.0).
