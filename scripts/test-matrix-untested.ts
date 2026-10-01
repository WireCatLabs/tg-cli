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
    command: "account update",
    option: "--first-name",
    reason:
      "tg's Telegram adapter has no profile editing yet (P2), so the shared command refuses it in tg; " +
      "cli-messaging's admin tests drive it through the port",
  },
  {
    command: "account update",
    option: "--last-name",
    reason:
      "tg's Telegram adapter has no profile editing yet (P2), so the shared command refuses it in tg; " +
      "cli-messaging's admin tests drive it through the port",
  },
  {
    command: "account update",
    option: "--description",
    reason:
      "tg's Telegram adapter has no profile editing yet (P2), so the shared command refuses it in tg; " +
      "cli-messaging's admin tests drive it through the port",
  },
  {
    command: "account update",
    option: "--photo",
    reason:
      "tg's Telegram adapter has no profile editing yet (P2), so the shared command refuses it in tg; " +
      "cli-messaging's admin tests drive it through the port",
  },
  {
    command: "account sessions end",
    option: "--others",
    reason:
      "tg's Telegram adapter has no profile editing yet (P2), so the shared command refuses it in tg; " +
      "cli-messaging's admin tests drive it through the port",
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
]
