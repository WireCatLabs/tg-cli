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
    command: "contacts context",
    option: "--limit",
    reason:
      "cli-messaging src/cli/messenger/messenger.test.ts and src/store/contacts.test.ts cover local identity context and archive gaps; this consumer mounts the shared command",
  },
  {
    command: "contacts context",
    option: "--since-time",
    reason:
      "cli-messaging src/cli/messenger/messenger.test.ts and src/store/contacts.test.ts cover local identity context and stored-message filtering; shared option parsing",
  },
  {
    command: "messages stats",
    option: "--saved",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts covers saved query execution and src/services/searches.test.ts validates shared query parameters",
  },
  {
    command: "store repair",
    option: "--dry-run",
    reason:
      "cli-messaging src/cli/messenger/store-maintenance.test.ts and src/store/repair.test.ts cover preview rollback and retained data",
  },
  {
    command: "replies test",
    option: "--since-time",
    reason:
      "cli-messaging src/cli/messenger/replies-command.test.ts and src/replies/decide.test.ts cover stored simulation and time selection; shared command",
  },
  {
    command: "tags add",
    option: "--contact",
    reason:
      "cli-messaging src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags add",
    option: "--message",
    reason:
      "cli-messaging src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags remove",
    option: "--contact",
    reason:
      "cli-messaging src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags remove",
    option: "--message",
    reason:
      "cli-messaging src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "searches create",
    option: "--source",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--limit",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--newest",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--context",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--language",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--timezone",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--regex",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--by",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--replace",
    reason:
      "cli-messaging src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches history",
    option: "--limit",
    reason:
      "cli-messaging src/services/searches.test.ts covers bounded newest history and pruning; consumer integration tests cover no-record and named-query preservation",
  },
  ...["--budget", "--min-score"].map((option) => ({
    command: "chats members audit",
    ...(option ? { option } : {}),
    reason:
      "shared member audit; cli-messaging src/cli/messenger/messenger.test.ts drives the command and src/services/members-audit.test.ts covers page budgets, thresholds and unavailable signals with synthetic members",
  })),
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
