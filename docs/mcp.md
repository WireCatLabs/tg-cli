# The MCP server

`tg mcp` hands a profile to an agent over [MCP](https://modelcontextprotocol.io), on stdin and
stdout by default; `--http --public-url` serves it on a local port behind your HTTPS tunnel. The server comes with
`tg`; there is nothing else to install.

**When you need it.** In Claude Code, Codex and other agents with a terminal, `tg` itself is enough
— it costs the same tokens and can do the same things. MCP is for clients without a terminal, such
as Claude Desktop or Cursor's chat, and for anyone who wants the client to ask before each send.
For ChatGPT or Claude **in the browser**, use `tg mcp --http` — see [remote.md](remote.md).

The personal tools use the shared messenger catalogue. Telegram also supports topics.

## Connecting

Run `tg setup --agent none` in a local terminal first. It configures the Telegram account;
`tg mcp setup` separately connects the client. `tg skill show` explains both before login.
The MCP server never logs in for you.

**Codex or Claude Code on this computer:**

```sh
tg mcp doctor                # check that MCP starts and lists tools
tg mcp setup codex          # add it to Codex
tg mcp setup claude-code    # or add it to Claude Code
```

Put a profile first, for example `tg work mcp setup codex`. Setup uses the client's own command
and leaves its other servers alone. If the same name already exists, remove that entry in the
client before running setup again. The default tg profile offers writing tools. Setup therefore
asks you to review its permissions and repeat with `--allow-writes`; that flag acknowledges the
installation and does not change permissions. To restrict what the agent can do, set the profile's
`permissions` first ([below](#what-an-agent-may-do)).

`mcp doctor` reads no messages and does not log in to Telegram. A healthy result means the MCP
handshake and tool list work, not that the account session is valid. `potentialWrites` counts tools
without a read-only declaration. When the server does not start, the error shows the last lines it
wrote to stderr, with your home folder, long numbers and tokens hidden. Browser and mobile chats need a separate remote connection
([remote.md](remote.md)).

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
tg work mcp config                  # another profile
```

Review profile permissions before connecting an agent.

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

## What an agent may do

The profile's `permissions` control access ([reference](configuration-reference.md#what-a-profile-may-do)).
`deny` blocks a command, `readonly` permits reads, and `ask` or `allow` permits the requested
MCP write. The server has no confirmation forms. Configure approval in your agent application.
CLI commands at `ask` still require confirmation; JSON and `--no-input` suppress prompts.

```sh
tg agent config set permissions.messages readonly
tg agent config set permissions.messages.send allow
```

Writes retain recipient restrictions, hourly limits and the send journal (`tg sends list`).
Marking read is a separate write under `chats.mark-read`. MCP deletion affects only the owner's
view, at most ten messages; channels and supergroups without that operation are refused.
Old `--confirm-send`, `--allow-send`, `--allow-mark-read`, `--allow-delete`, `--allow-dangerous`
and `--http-confirmation` flags are accepted with a warning and do not change MCP policy.
Remove them from saved client entries. Temporary `--permission key=level` overrides remain available.

## Tools

| Tool | Purpose |
|---|---|
| `tg_tools_search` | Find a command and discover its argument schema and effects |
| `tg_read` | Execute an offered read command |
| `tg_write` | Execute an offered write command |

Both execution tools take `{command, arguments}`. Use the command path returned by search:

```json
{"command":"stats chats show","arguments":{"chat":"123"}}
```

Former per-command tools such as `tg_messages_list` and `tg_status` are removed. Read `status`
through `tg_read`. Bot servers use `tg_bot_tools_search`, `tg_bot_read`, `tg_bot_write`; their
command paths omit `bot`. Search results reflect the profile's permissions and provider support.

Answers use structured JSON content: lists retain pagination and ids remain strings. Failures
carry `{error:{code,message,retryable,...}}`; ambiguous targets include candidates. After an
unknown write outcome, inspect the send journal and provider state before considering a retry.
See the [CLI contract](cli-contract.md) for schemas, bounds and retry rules.

## Prompts, and chats by `@`

The server offers six ready prompts — in Claude Code they are `/` commands:

| Prompt | Argument | What the agent does |
|---|---|---|
| `catch-up` | `kind`, `mode` — optional | calls `tg_read` (`command: "inbox"`); `mode` is `unread` (default), `new` or a time; `kind` selects chat kinds; marking read requires a separate approved tool call |
| `reply` | `chat` | reads the chat, writes a draft, and sends it only after your yes to that text |
| `find` | `text` | looks for a person or for words, and shows the messages around each hit; sends nothing |
| `link-conversations` | none | report cost and request consent, then read batches, save links and rebuild |
| `review` | `since`, `groups` — optional | calls `tg_read` (`command: "review"`) once and sorts it into what you owe, what others owe and what needs clarifying; drafts reminders, sends one only after your yes |
| `open-tasks` | `chat` — optional | calls review to refresh tasks, lists pending tasks and suggests drafts; closes a task only after owner approval; sends nothing |

`reply` and `review` send through `tg_write` (`command: "messages send"`), so where `messages.send` is `readonly` the
agent only shows the drafts.

Chats are resources `tg://chat/<id>` — in Claude Code you can mention them with `@`. A resource is
the chat and its recent messages. The list comes from the local store and never connects to
Telegram; until something was read, it is empty. Only reading one chat connects.

## How it holds the connection

The first call connects to Telegram, and the next ones reuse the connection. It closes after 2
minutes without a call, and in any case 5 minutes after it opened, so a long agent session never
reads a stale snapshot. The next call connects again. Calls run one at a time, even when the client
sends them together.

The server exits as soon as the client closes stdin, and closes its connection to Telegram.

`tg_read` (`command: "messages link"`) returns `{ locator, url, access, reason }` without message content. It shares
`messages link` account validation and audience limits; a private link grants no membership.

Personal MCP validates arguments against the discovered command schema and refuses unknown fields
before connecting or acting. Use `at_time` for scheduling. An unknown outcome must be inspected
before retrying. MCP inbox/review checkpoints are separate from CLI `--new` checkpoints.

Conversation linking uses the `link-conversations` prompt. Report batch cost and obtain the
owner's consent before reading batches; saved links require `conversations.links`, followed
by a rebuild. Remote embedding settings can send query text to the configured service.
Attachment commands expose retained paths and text status; text extraction is CLI-only.
