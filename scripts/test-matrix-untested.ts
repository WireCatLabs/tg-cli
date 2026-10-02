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
  ...["", "--confirm-send", "--allow-dangerous", "--allow-send", "--allow-delete", "--allow-moderate"].map(
    (option) => ({
      command: "bot mcp",
      ...(option ? { option } : {}),
      reason:
        "serves MCP on stdin until the client closes; cli-messaging's src/mcp/bot/server.test.ts drives the server, " +
        "src/bot.test.ts the tools tg offers, and bot mcp config there the flags",
    }),
  ),
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
  ...[
    "--allow-writes",
    "--confirm-send",
    "--allow-dangerous",
    "--allow-send",
    "--allow-mark-read",
    "--allow-delete",
  ].map((option) => ({
    command: "mcp setup",
    option,
    reason:
      "registers an external client's local configuration; cli-core's src/mcp/index.test.ts checks registration and the handshake, and tg setup was checked with an isolated Codex home",
  })),
  ...["--confirm-send", "--allow-dangerous", "--allow-send", "--allow-mark-read", "--allow-delete"].map((option) => ({
    command: "mcp doctor",
    option,
    reason:
      "starts a separate MCP process; cli-core's src/mcp/index.test.ts checks its handshake and tools, and tg doctor was checked without an account",
  })),
  {
    command: "store fetch",
    option: "--background",
    reason:
      "spawns a detached process that outlives the test; cli-messaging's src/cli/messenger/backfill.test.ts " +
      "drives it with a stand-in spawnJob, and lane L5 owns the live check",
  },
  {
    command: "models text download",
    option: "--accept-terms",
    reason:
      "phase 5's shared command; it downloads a model over the network, and cli-messaging's tests drive it offline",
  },
]
