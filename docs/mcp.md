# The MCP server

`tg mcp` hands a profile to an agent over [MCP](https://modelcontextprotocol.io), on stdin and
stdout, with no network port. The server comes with `tg`; there is nothing else to install.

**When you need it.** In Claude Code, Codex and other agents with a terminal, `tg` itself is enough
— it costs the same tokens and can do the same things. MCP is for clients without a terminal, such
as Claude Desktop or Cursor's chat, and for anyone who wants the client to ask before each send.

This server is copied from max-cli's (`max mcp`) and behaves the same way.

## Connecting

Log in in a terminal first, as usual (`tg session start`). The server never logs in.

**Claude Code:**

```sh
claude mcp add tg -- tg mcp
```

With a profile — it goes first, as in any command:

```sh
claude mcp add tg-work -- tg work mcp
```

**Claude Desktop, Cursor and others:** `tg` prints the entry for their settings file:

```sh
tg mcp config
tg work mcp config
```

```json
{
  "mcpServers": {
    "tg": {
      "type": "stdio",
      "command": "/usr/bin/node",
      "args": ["/usr/lib/node_modules/@leemour/tg-cli/dist/bin/tg.js", "mcp"],
      "env": { "XDG_RUNTIME_DIR": "/run/user/1000" }
    }
  }
}
```

Paste the entry under `mcpServers` in the client's settings file: for Claude Desktop that is
`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS and
`%APPDATA%\Claude\claude_desktop_config.json` on Windows; for Cursor, `~/.cursor/mcp.json`. The
command writes nothing itself.

The paths are full because a client started from the desktop does not see the terminal's `PATH`,
and on Windows `tg` is a `tg.cmd` file that a client without a shell cannot start. The entry copies
`TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` and `XDG_RUNTIME_DIR` when they
are set; never `TG_API_ID`, `TG_API_HASH` or the session.

If Node came from nvm, fnm or Volta, its path belongs to one Node version — run `tg mcp config`
again after changing it. From `npx` the command refuses: npx's cache is cleared, and the path would
stop existing.

⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` and `TG_CACHE_DIR` change where the login is looked for.** If
they are set in the terminal and not for the MCP client, or the other way round, the server answers
"no session" although `tg` works in the terminal. Set them the same in both, or in neither.

⚠ **On Linux the app credentials are in the keyring, which is reached through `XDG_RUNTIME_DIR`.**
A client that starts servers with a trimmed environment leaves it out, and every tool then answers
that the keyring is probably out of reach. The entry from `tg mcp config` includes it.

## Reading only, for now

The server **only reads**: there is no send tool in the list at all. Sending with `--allow-send`,
through the same checks as `tg messages send`, and a confirmation form with `--confirm-send`, come
next — as in max-cli.

## Tools

| Tool | Command | What it does |
|---|---|---|
| `tg_status` | `tg doctor` | which profile the server speaks for, which account it last saw, which writing tools are on; never connects |
| `tg_account_show` | `tg account show` | who the login is |
| `tg_chats_list` | `tg chats list` | chats, newest first |
| `tg_chats_show` | `tg chats show` | one chat and who is in it |
| `tg_contacts_list` | `tg contacts list` | people with a one-to-one chat |
| `tg_contacts_show` | `tg contacts show` | one person and the chats shared with them |
| `tg_messages_list` | `tg messages list` | a chat's messages; marks nothing read |
| `tg_messages_context` | `tg messages show`, `context` | one message and those either side |
| `tg_messages_search` | `tg messages search` | search what this machine has kept; never asks Telegram |

Answers are what the command prints with `--json`: a list is `{ items, page, limit, hasMore }`, a
chat's messages `{ items, limit, hasMore }`, ids are strings. An error is
`{ error: { code, message, … } }` with the CLI's codes; an ambiguous chat name answers with the
`candidates`.

Every read is saved to the local store, as a command's is, and each call can be kept as a run
(`tg runs list`), named `mcp chats list` and so on.

## How it holds the connection

The first call connects to Telegram, and the next ones reuse the connection. It closes after 2
minutes without a call, and in any case 5 minutes after it opened, so a long agent session never
reads a stale snapshot. The next call connects again. Calls run one at a time, even when the client
sends them together.

The server exits as soon as the client closes stdin, and closes its connection to Telegram.
