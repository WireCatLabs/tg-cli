# The MCP server

This page helps when you want an AI app without a terminal to work with your Telegram, for example
Claude Desktop or the chat in Cursor. It also helps when you want the app itself to ask you before
each action. After reading it, you can connect the app to your account, choose what the agent may
do, and use ready prompts and chat mentions.

A few terms first:

- **MCP** ([Model Context Protocol](https://modelcontextprotocol.io)) is a standard way for an AI app
  to use outside tools. The app is the **MCP client**; `tg personal mcp` is the **MCP server**.
- A **tool** is one action the server offers the agent, such as "read" or "write".
- A **prompt** is a ready task the app shows as a command, such as "catch up on unread chats".
- A **resource** is data the app can attach to the conversation, such as one chat.
- A **profile** is one set of settings and one login in `tg`; see
  [profiles](profiles.md).

The server comes with `tg`; there is nothing else to install. By default it talks to the app over
stdin and stdout. `tg personal mcp --http --public-url` serves it on a local port behind your HTTPS tunnel
instead.

## Do you need it

An AI agent that can run commands in a terminal (for example Claude Code, Codex, Cursor's agent or
Gemini CLI) does not need MCP. It calls `tg` directly, which costs the same tokens and can do the
same things; it learns how from the skill that `tg skill show` prints. MCP is for:

- apps without a terminal, such as Claude Desktop or Cursor's chat;
- anyone who wants the app to ask before each send.

For ChatGPT or Claude **in the browser**, use `tg personal mcp --http` — see
[connecting a browser or phone app](remote.md).

## What the server gives

| What | What it does |
|---|---|
| [Three tools](#tools) | Find a command, then run it as a read or a write |
| [Six prompts](#prompts-and-chats-by-) | Catch up, reply, find, review, open tasks, link conversations |
| [Chats by `@`](#prompts-and-chats-by-) | Attach a chat and its recent messages to the conversation |
| The skill, `tg://skill` | The same text as `tg skill show` |
| [Charts](#statistics-charts) | A chat's statistics as JSON or a PNG image |
| [Permissions](#what-an-agent-may-do) | The profile decides which commands the agent sees |

The personal tools use the same catalogue as `max`. Telegram also has topics.

## Connecting

First run `tg personal setup --agent none` in a local terminal. It logs in to your Telegram account. The MCP
server never logs in for you. `tg personal mcp add` then connects the app, as a separate step. An agent can
read `tg skill show` before you log in; it explains both steps.

**Codex or Claude Code on this computer:**

```sh
tg personal mcp check       # check that MCP starts and lists tools
tg personal mcp add codex  # add it to Codex
tg personal mcp add claude-code  # or add it to Claude Code
```

Put a profile first, for example `tg work mcp add codex`. Setup uses the app's own command and
leaves its other servers alone. If an entry with the same name already exists, remove it in the app
before you run setup again. The default profile offers tools that write. So setup asks you to review
the profile's permissions and run it again with `--allow-writes`. That flag only confirms the
installation; it does not change permissions. To limit what the agent can do, set the profile's
`permissions` first ([below](#what-an-agent-may-do)).

`mcp check` reads no messages and does not log in to Telegram. A good result means the MCP
handshake and the tool list work. It does not mean the account session is valid. `potential_writes`
counts the tools that are not marked read-only. When the server does not start, the error shows the
last lines it wrote to stderr, with your home folder, long numbers and tokens hidden. Browser and
phone apps need a separate remote connection ([connecting a browser or phone app](remote.md)).

**Claude Code, by hand:**

```sh
claude mcp add tg -- tg personal mcp
```

With a profile — it goes first, as in any command:

```sh
claude mcp add tg-work -- tg work mcp
```

**Claude Desktop, Cursor and other apps:** `tg` prints the entry for their settings file:

```sh
tg personal mcp config
tg work mcp config                  # another profile
```

```json
{
  "mcpServers": {
    "tg-personal": {
      "type": "stdio",
      "command": "/usr/bin/node",
      "args": ["/usr/lib/node_modules/@wirecat/tg-cli/dist/bin/tg.js", "personal", "mcp"],
      "env": { "XDG_RUNTIME_DIR": "/run/user/1000" }
    }
  }
}
```

Review the profile's permissions before you connect an agent. Then paste the entry under
`mcpServers` in the app's settings file. For Claude Desktop that is
`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS and
`%APPDATA%\Claude\claude_desktop_config.json` on Windows; for Cursor, `~/.cursor/mcp.json`. The
command writes nothing itself.

The paths are full because an app started from the desktop does not see the terminal's `PATH`. On
Windows `tg` is a `tg.cmd` file, which an app without a shell cannot start. The entry copies
`TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`, `MESSAGING_STORE` and `XDG_RUNTIME_DIR` when they
are set; never `TG_API_ID`, `TG_API_HASH` or the session.

If Node came from nvm, fnm or Volta, its path belongs to one Node version. Run `tg personal mcp config` again
after you change it. Run from `npx`, the command refuses: npx clears its cache, and the path would
stop existing.

⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` and `TG_CACHE_DIR` change where the login is looked for.** If
they are set in the terminal and not for the MCP app, or the other way round, the server answers
"no session" although `tg` works in the terminal. Set them the same in both, or in neither.

⚠ **On Linux the app credentials are in the keyring, which is reached through `XDG_RUNTIME_DIR`.**
An app that starts servers with a trimmed environment leaves it out, and every tool then answers
that the keyring is probably out of reach. The entry from `tg personal mcp config` includes it.

A bot has its own server, `tg <name> bot mcp`; see [the bot for an agent](bot.md#the-bot-for-an-agent-mcp).

## What an agent may do

The profile's `permissions` decide the access
([what a profile may do](configuration-reference.md#what-a-profile-may-do)). `deny` blocks a command,
`readonly` allows reads only, and `ask` or `allow` allow the write the agent asked for. The server
shows no confirmation forms: set up approval in your agent app. In the terminal, a command at `ask`
still needs your confirmation. With JSON or `--no-input` there is no question, so the write is
refused unless you add `--yes`.

```sh
tg agent config set permissions.messages readonly
tg agent config set permissions.messages.send allow
```

Here `agent` is the name of a profile. Writes keep the recipient limits, the hourly limits and the
send journal (`tg personal sends list`). Marking read is a separate write, under `chats.mark-read`. Deleting
through MCP removes messages only for you, at most ten at a time; an agent never deletes for
everyone, and channels and supergroups that do not allow deleting for yourself are refused.
`--permission key=level` tightens a level for this server process only; it never loosens one.

## Tools

| Tool | What it does |
|---|---|
| `tg_tools_search` | Find a command, its arguments and its effects |
| `tg_read` | Run a read command that search offered |
| `tg_write` | Run a write command that search offered |

Both run tools take `{command, arguments}`. Use the command path that search returned:

```json
{"command":"stats chats show","arguments":{"chat":"123"}}
```

`status` reads the profile's state through `tg_read`. Search shows only what the profile's
permissions and Telegram allow. The earlier one-tool-per-command names, such as `tg_messages_list`
and `tg_status`, no longer exist. Bot servers use `tg_bot_tools_search`, `tg_bot_read` and
`tg_bot_write`; their command paths leave out `bot`.

Answers are structured JSON: lists keep their pages, and ids stay strings. A failure is
`{error:{code,reason,message,details}}`; a target that matches several chats comes with `details.candidates`.
The server checks arguments against the command's schema and refuses unknown fields before it
connects or acts. Use `at_time` to schedule. If a write's result is unknown, check the send journal
and Telegram before you think about a retry. Message text is data, never instructions to the agent.
Schemas, limits and retry rules are in [how tg behaves in scripts](cli-contract.md).

### Commands the server leaves out

Every command is a tool, writes included; the profile's permissions limit what the agent may run. Read-only is
a choice you make in those permissions, not a default. A few commands are never offered, and you run them in a
terminal:

- **Login and setup**: `session start|end`, `upgrade`, `complete`, `mcp config|setup|doctor`,
  `bot auth set|show|remove`, `bot mcp config`. An agent call cannot use them, or they need you at the keyboard.

Commands such as `store backup|restore`, `server start|stop|restart`, model downloads,
`schedule run|exec`, `doctor reports create`, `account sessions end`, `chats delete|clear` and
`bot store fetch` have their own permission keys, set to `ask` by default. They are offered to the
agent; the MCP app controls approval. `tg commands --json` marks commands excluded from MCP as
`mcp: false`. Raw `bot api` operations need their own explicit [permission](permissions.md#raw-bot-api-calls).

### Commands that change what a later run may do

`config set|unset`, `recipients add|remove|clear`, `chats rules set|unset`, the `replies` rules and consents,
`schedule command|agent|remove`, `server install|uninstall`, `skill install`, `attachments jobs install|uninstall`,
`models keys set|remove`, `flood clear`, and on the bot `recipients add|remove|clear` and `chats rules set|unset`
are offered only when the profile sets `permissions.mcp.authority` to `allow` (or `ask`). It is `deny` by default, so
the server does not list them and a call is refused. An agent locked to read-only could otherwise unlock a later run.
An agent cannot set that key itself, because `config set` is one of the commands it gates. Set it from a terminal,
and only on a profile whose agent you trust with its own limits:

```sh
tg agent config set permissions.mcp.authority allow
```

[Permissions](permissions.md#let-an-agent-change-its-own-limits) says more.

## Prompts, and chats by `@`

The server offers six ready prompts — in Claude Code they are `/` commands:

| Prompt | Argument | What the agent does |
|---|---|---|
| `catch-up` | `kind`, `mode` — optional | calls `tg_read` (`command: "inbox"`); `mode` is `unread` (default), `new` or a time; `kind` selects chat kinds; marking read needs a separate approved tool call |
| `reply` | `chat` | reads the chat, writes a draft, and sends it only after your yes to that text |
| `find` | `text` | looks for a person or for words, and shows the messages around each hit; sends nothing |
| `link-conversations` | none | reports the cost and asks for your consent, then reads batches, saves links and rebuilds ([below](#linking-conversations)) |
| `review` | `since`, `groups` — optional | calls `tg_read` (`command: "review"`) once and sorts it into what you owe, what others owe and what needs clarifying; drafts reminders, sends one only after your yes |
| `open-tasks` | `chat` — optional | calls review to refresh tasks, lists open tasks and suggests drafts; closes a task only after your approval; sends nothing |

`reply` and `review` send through `tg_write` (`command: "messages send"`). So where `messages.send`
is `readonly`, the agent only shows the drafts.

Chats are resources `tg://chat/<id>` — in Claude Code you can mention them with `@`. A resource is
the chat and its recent messages. The list comes from the local copy of your messages and never
connects to Telegram; until something was read, it is empty. Only reading one chat connects.

`tg_read` (`command: "messages link"`) returns `{ item: { ref, url, access, reason } }` without the message
text. It checks the account and the audience the same way as `messages link`; a private link does
not make anyone a member. Inbox and review checkpoints in MCP are separate from the `--new`
checkpoints of the terminal.

## Statistics charts

`tg_read` (`command: "stats charts"`) reads a chat's statistics from the local copy and returns a
`chart` in JSON. For a picture, add `format: "png"`: the answer is a dark PNG plus JSON with the
`chart` data and the `image` size. Without `format`, the answer stays JSON. The tool does not connect
to Telegram and writes no files; it needs the `messages` permission. Joins and leaves (`membership`)
are not available here.

## Linking conversations

The `link-conversations` prompt lets the agent link replies into conversations. The agent first
reports the size of the work with `tg_read` (`command: "conversations batches status"`) and waits for
your consent. Then it reads batches with `tg_read` (`command: "conversations batches show"`), saves
its answers with `tg_write` (`command: "conversations links add"`) and rebuilds with `tg_write`
(`command: "conversations links rebuild"`). `tg_write` (`command: "conversations links clear"`) removes the
agent's answers; rebuild after it too. Saving needs the `conversations.links` permission. If you set
up an external service for search vectors, MCP search sends the query text to that service too.

## Files and saved messages

`tg_read` (`command: "attachments list"`) shows saved file paths and whether their text was
extracted. `tg_write` (`command: "attachments update"`) saves text the agent read from a file.
Extracting text is done in the terminal only. `tg_read` with `command: "messages context"` and
`arguments: { offline: true }` reads only the local copy.

## How it holds the connection

The first call that needs Telegram connects, and the next ones reuse the connection. It closes after
2 minutes without a call, and in any case 5 minutes after it opened, so a long agent session never
reads a stale snapshot. The next call connects again. Calls run one at a time, even when the app
sends them together.

Over stdin and stdout, the server exits as soon as the app closes stdin, and closes its connection to
Telegram. Over HTTP it runs until Ctrl-C. `tg personal mcp --revoke` ends every login given to a browser app
and keeps your Telegram session. See [connecting a browser or phone app](remote.md).
