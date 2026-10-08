# The bot token stays inside the transport

- The token lives only in `#token`; the `/bot<token>/` address is built in one place and never reaches an error, a trace or a rethrown fetch error.
- Telegram's description has the token, per-call secrets and anything matching `\d+:[A-Za-z0-9_-]{20,}` replaced with `[redacted]`.
- Attachments carry `providerRef.fileId` only — never a download URL, which contains the token.
- Proxy credentials go to undici as options, never in the proxy URI.

**Why:** The token is the bot; anything that prints it hands the bot away.

**Open:** Is the regex catch-all a deliberate second layer for tokens that aren't ours, or a stopgap?

See: `src/bot/transport.ts:29-35` · `src/bot/map.ts:71-74` · `src/bot/proxy.ts:5-9`
