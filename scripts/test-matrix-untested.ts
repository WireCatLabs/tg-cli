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
    command: "mcp",
    option: "--allow-send",
    reason:
      "starts serving MCP on the process's own stdin until the client closes; cli-messaging's src/mcp/mcp.test.ts " +
      "drives the server with allowSend, and HANDOFF.md §3b names the live check with a scratch MCP client",
  },
]
