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
tg mcp config                   # reading only
tg work mcp config --allow-send
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

## Sending is off until it is turned on

Without a flag the server **only reads**: there is no send tool in the list at all. To turn it on:

```sh
claude mcp add tg -- tg mcp --allow-send
```

A send, an edit or a forward over MCP goes through the same checks as its command: a read-only profile, the
profile's `allow` list, the list of allowed recipients, the hourly limit, and the journal of sends
(`tg sends list`). On top of that the tool is marked as dangerous: VS Code and Cursor ask before
every call, and Claude Code, by its documentation, shows an approval dialog even where everything
else is allowed in advance.

A profile's `allow` list decides which tools an agent sees at all: `tg mcp --allow-send` for a
profile whose `allow` does not name `send` shows no send tool. The read tools are always there.

**Marking a chat read is a flag of its own**, `--allow-mark-read`, which `--allow-send` does not
turn on: the other side sees that you read it, and an agent reading on your behalf should not give
that away. `tg_chats_read` goes through the same guard as a send, and never counts toward the
hourly limit.

**Deleting is a flag of its own too**, `--allow-delete`. `tg_messages_delete` removes up to 10
messages from **your** view only; deleting for everyone is left to the command, typed by you. In a
supergroup or a channel Telegram has no "for me only", so there the tool is refused.

### A confirmation form from the server itself

```sh
claude mcp add tg -- tg mcp --allow-send --confirm-send
```

With `--confirm-send`, before every send the server shows a form: **which chat** — the title and id
the agent's name resolved to — and **the whole text**. The message goes only after Accept; the form
has no fields, just the one button. The client's own window shows the arguments as the model wrote
them (`chat: "Anna"`); the form shows what you are actually agreeing to ("Anna Petrova (123456)").

- Decline, or closing the form: nothing is sent, and the agent gets `confirmation_required` and
  must not try again.
- A client that cannot show forms gets an error — **nothing is sent**. Claude Code shows forms.
- The yes is bound to what the form showed: if the agent changes the chat, the text or the tool
  after confirming, nothing is sent.
- A yes works once, for 5 minutes. Replaying the same answer sends nothing.
- Without `--allow-send`, `--allow-mark-read` or `--allow-delete` the flag is a startup error.

## Tools

| Tool | Command | What it does |
|---|---|---|
| `tg_status` | `tg doctor` | which profile the server speaks for, which account it last saw, which writing tools are on; never connects |
| `tg_review` | `tg review`, `--since`, `--chat`, `--unanswered`, `--all` | every message, the owner's too, in each chat that changed since a point (three days without one); `complete` and `until` say where the next review starts; `unanswered` keeps the questions nobody answered |
| `tg_inbox` | `tg inbox`, `--since`, `--all` | what came in: the unread messages, or everything after a moment, in one call; muted and archived chats only when they mention the owner, or with `all`; marks nothing read and never moves `tg inbox --new`'s point; `transcribe` hears voice messages |
| `tg_account_show` | `tg account show` | who the login is |
| `tg_account_sessions` | `tg account sessions list` | every device and app logged in; reads only |
| `tg_chats_list` | `tg chats list`, `--search`, `--kind`, `--unread` | chats, newest first; filtered over the newest 200, `partial` when older ones exist |
| `tg_chats_events` | `tg chats events`, `--since`, `--event` | who joined, left, was added or removed, and by whom, from the chat's service messages; seven days back without `since` |
| `tg_chats_members` | `tg chats members list` | a group's members, paged, with role and last seen |
| `tg_chats_inspect` | `tg chats inspect` | what an invite or public link leads to; joins nothing |
| `tg_topics_list` | `tg topics list`, `tg topics search` | a forum group's topics with their ids; `search` matches titles |
| `tg_chats_show` | `tg chats show` | one chat and who is in it |
| `tg_contacts_list` | `tg contacts list` | people with a one-to-one chat |
| `tg_contacts_show` | `tg contacts show` | one person and the chats shared with them |
| `tg_contacts_lookup` | `tg contacts lookup` | who has a phone number, where their privacy allows; adds no contact |
| `tg_messages_list` | `tg messages list`, `--before`, `--after` | a chat's messages; `after` reads forward from a message id or a time; marks nothing read; a voice message carries `transcript` once heard, and `transcribe` hears the rest |
| `tg_messages_context` | `tg messages show`, `context` | one message and those either side |
| `tg_messages_scheduled` | `tg messages scheduled` | what waits to be sent in a chat, soonest first, each with `scheduledFor` |
| `tg_messages_photo` | `tg messages download` | a message's photo as an image to look at, up to 512 KB; anything else is refused with the `tg messages download` command that saves it |
| `tg_messages_transcribe` | `tg messages transcribe` | a voice message as text — by Telegram (Premium or the weekly trial), else by a speech model on this machine; `local: true` skips Telegram; `pending: true` means Telegram was not finished within a minute; a missing model is refused with `tg models audio download`, never downloaded |
| `tg_messages_search` | `tg messages search` | search what this machine has kept; never asks Telegram |
| `tg_messages_send` | `tg messages send`, `reply` | send, only with `--allow-send`; `reply_to` answers a message; `send_id` repeats a send whose outcome was unknown; `silent`, `no_preview` and `markdown` as `--silent`, `--no-preview` and `--md`; `at` sends it later — never retried, the confirmation form shows the clock time; `file` or `photo` attaches a path from this machine, the text as the caption — hidden files, `~/.ssh`, tg's own folders and the message store are refused, with no way around it over MCP |
| `tg_messages_edit` | `tg messages edit` | the new text of the owner's own message, only with `--allow-send` and permission `edit`; repeating it changes nothing |
| `tg_chats_read` | `tg chats read` | mark a chat read, to its newest message or `until` one; only with `--allow-mark-read` and permission `read` — the other side sees it |
| `tg_messages_delete` | `tg messages delete` | up to 10 messages from the owner's view; only with `--allow-delete` and permission `delete`; never for everyone; each counts toward the hourly limit |
| `tg_reactions_add`, `tg_reactions_remove` | `tg reactions add`, `remove` | the owner's reaction on one message; only with `--allow-send` and permission `reaction`; the confirmation form shows the emoji |
| `tg_messages_forward` | `tg messages forward` | one message into another chat (`to`), only with `--allow-send` and permission `forward`; on an unknown outcome look in that chat before repeating |
| `tg_messages_pin`, `tg_messages_unpin` | `tg messages pin`, `unpin` | pin one message, quietly unless `notify`; only with `--allow-send` and permission `pin` |

Answers are what the command prints with `--json`: a list is `{ items, page, limit, hasMore }`, a
chat's messages `{ items, limit, hasMore }`, ids are strings. An error is
`{ error: { code, message, … } }` with the CLI's codes; an ambiguous chat name answers with the
`candidates`.

Every read is saved to the local store, as a command's is, and each call can be kept as a run
(`tg runs list`), named `mcp chats list` and so on.

## Prompts, and chats by `@`

The server offers three ready prompts — in Claude Code they are `/` commands:

| Prompt | Argument | What the agent does |
|---|---|---|
| `catch-up` | `since` — optional | calls `tg_inbox` once and summarises per chat; sends nothing |
| `reply` | `chat` | reads the chat, writes a draft, and sends it only after your yes to that text |
| `find` | `text` | looks for a person or for words, and shows the messages around each hit; sends nothing |
| `review` | `since`, `groups` — optional | calls `tg_review` once and sorts it into what you owe, what others owe and what needs clarifying; drafts reminders, sends one only after your yes |

`reply` and `review` send through `tg_messages_send`, so without `--allow-send` the agent only shows the drafts.

Chats are resources `tg://chat/<id>` — in Claude Code you can mention them with `@`. A resource is
the chat and its recent messages. The list comes from the local store and never connects to
Telegram; until something was read, it is empty. Only reading one chat connects.

## How it holds the connection

The first call connects to Telegram, and the next ones reuse the connection. It closes after 2
minutes without a call, and in any case 5 minutes after it opened, so a long agent session never
reads a stale snapshot. The next call connects again. Calls run one at a time, even when the client
sends them together.

The server exits as soon as the client closes stdin, and closes its connection to Telegram.
