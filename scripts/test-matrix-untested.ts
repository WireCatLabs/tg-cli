/**
 * What `tg` cannot test offline, each with the reason and where it is checked instead. An entry
 * that names a command or option the program no longer has fails `pnpm test:matrix`.
 * `command` ending in ` *` covers every subcommand under it.
 */
export interface Untested {
  command: string
  option?: string
  reason: string
}

const BOT_UNTIL_206 =
  'tg\'s bot adapter does not do this until tg-cli #206, which adds it and its test in src/bot-messages.test.ts; until then the shared command refuses with "a Telegram bot cannot …". #206 removes this entry'

export const UNTESTED: Untested[] = [
  {
    command: "chats moderate",
    option: "--since-time",
    reason:
      "P2's shared command; cli-messaging's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--dry-run",
    reason:
      "P2's shared command; cli-messaging's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--allow-dangerous",
    reason:
      "P2's shared command; cli-messaging's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--max-actions",
    reason:
      "P2's shared command; cli-messaging's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "mcp",
    reason:
      "serves MCP on the process's own stdin until the client closes; cli-messaging's src/mcp/mcp.test.ts drives " +
      "the server — tools offered by the profile's permissions — and HANDOFF.md §3b names the live check",
  },
  {
    command: "mcp",
    option: "--confirm-send",
    reason:
      "serves MCP on stdin, as mcp does; cli-messaging's src/mcp/mcp.test.ts drives the server with confirmSend, " +
      "and mcp config below shows the flag reaching the server's arguments",
  },
  {
    command: "mcp",
    option: "--allow-dangerous",
    reason:
      "serves MCP on stdin, as mcp does; cli-messaging's src/mcp/mcp.test.ts drives the server with allowDangerous, " +
      "and mcp config below shows the flag reaching the server's arguments",
  },
  {
    command: "mcp",
    option: "--allow-send",
    reason:
      "decides nothing since the profile's permissions do, and is accepted with a warning so an old setup starts; " +
      "mcp config below shows the warning",
  },
  {
    command: "mcp",
    option: "--allow-mark-read",
    reason: "decides nothing, as --allow-send; mcp config below shows the warning",
  },
  {
    command: "mcp",
    option: "--allow-delete",
    reason: "decides nothing, as --allow-send; mcp config below shows the warning",
  },
  {
    command: "store fetch",
    option: "--background",
    reason:
      "spawns a detached process that outlives the test; cli-messaging's src/cli/messenger/backfill.test.ts " +
      "drives it with a stand-in spawnJob, and lane L5 owns the live check",
  },
  {
    command: "bot chats action",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--reply-to",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--silent",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--md",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--html",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--file",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--photo",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--as-file",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--voice",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages send",
    option: "--allow-any-file",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages edit",
    option: "--md",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages edit",
    option: "--html",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages delete",
    option: "--allow-dangerous",
    reason: BOT_UNTIL_206,
  },
  {
    command: "bot messages pin",
    option: "--notify",
    reason: BOT_UNTIL_206,
  },
]
