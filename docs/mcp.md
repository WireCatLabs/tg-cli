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

## What an agent may do

The profile's `permissions` decide which commands an agent can find and run, by the same levels as
the commands ([configuration.md](configuration.md#what-a-profile-may-do)):

| Level | Over MCP |
|---|---|
| `deny` | the command is not offered; `messages: deny` also hides the prompts and the chat resources |
| `readonly` | the reading commands are offered, the writing ones are not |
| `ask` | the command acts without asking: over MCP nobody is at a terminal to answer |
| `allow` | the command acts without asking |

**With the default settings an agent can send, edit, react, forward, pin, vote, mark a chat read
and delete your own messages**, with no flag and no question. An agent never deletes for everyone
and never ends your other sessions, whatever the level.

To keep an agent read-only, give it a profile of its own — `tg agent session start` logs it in, as
another device of the same account — and set each resource there:

```sh
for key in messages reactions polls topics chats contacts account; do
  tg agent config set permissions.$key readonly
done
claude mcp add tg -- tg agent mcp
```

`readOnly: true` in that profile does the same, as an older setting. To see each change before it
happens, leave `tg_write` unapproved in your client: Claude Code, VS Code and Cursor then ask before
every call of it.

A send, an edit or a forward over MCP goes through the same checks as its command: the profile's
`permissions`, the list of allowed recipients, the hourly limit, and the journal of sends
(`tg sends list`). HTTP follows the same permissions as stdin/stdout.

**Marking a chat read** is `chats.mark-read`: the other side sees that you read it. Set it to
`readonly` when an agent reads on your behalf and should not give that away. `chats mark-read`
never counts toward the hourly limit.

**Deleting** is `messages.delete`. `messages delete` removes up to 10 messages from **your** view
only; deleting for everyone is left to the command, typed by you. In a supergroup or a channel
Telegram has no "for me only", so there the tool is refused.

`--allow-send`, `--allow-mark-read`, `--allow-delete`, `--confirm-send`, `--allow-dangerous` and
`--http-confirmation` decide nothing: they are accepted with a warning so an agent set up with them
still starts. Remove them from the client's settings.

## Tools

The server offers three tools:

- `tg_tools_search` — find a command by words; answers its path, whether it writes, and its arguments;
- `tg_read` — run a command that only reads: `{ "command": "messages list", "arguments": { "chat": "…" } }`;
- `tg_write` — run a command that changes something, the same way.

A command is its CLI path; its arguments are its options in `snake_case`:

| Command | CLI | What it does |
|---|---|---|
| `status` | `tg doctor` | which profile the server speaks for, which account it last saw, which writing tools are on; never connects |
| `review` | `tg review`, `--since-time`, `--chat`, `--unanswered`, `--all` | every message, the owner's too, in each chat that changed since a point (three days without one); `unanswered` also considers retained transcripts; `transcribe` hears new voices before filtering and `model` picks the model; unheard voices leave `complete` false, so keep the previous boundary until the review is complete |
| `inbox` | `tg inbox`, `--since-time`, `--all` | what came in: the unread messages, or everything after a moment, in one call; muted and archived chats only when they mention the owner, or with `all`; marks nothing read and never moves `tg inbox --new`'s point; `transcribe` hears voice messages, `model` picks the model |
| `account show` | `tg account show` | who the login is; the phone always as its last four digits |
| `account sessions` | `tg account sessions list` | every device and app logged in; reads only |
| `chats list` | `tg chats list`, `--search`, `--kind`, `--unread` | chats, newest first; filtered over every returned chat; `partial` when the messenger cannot provide the whole inventory |
| `chats members audit` | `tg chats members audit` | members with bot-like signals; removes nobody, `more` and `unknown` expose incomplete evidence |
| `stats chats show` | `tg stats chats show --offline` | stored group/channel activity; membership changes are not requested, so `members` is omitted; incomplete counts are lower bounds |
| `chats events` | `tg chats events`, `--since-time`, `--type` | who joined, left, was added or removed, and by whom, from the chat's service messages; seven days back without `since_time` |
| `chats members` | `tg chats members list` | a group's members, paged, with role and last seen |
| `chats inspect` | `tg chats inspect` | what an invite or public link leads to; joins nothing |
| `topics enable` | `tg topics enable` | enable a forum by `groups`; only the group owner can enable topics; basic-group upgrade must be explicit and returns a new chat id |
| `topics create` | `tg topics create` | create a topic by `groups`; after an unknown outcome check `topics list` instead of repeating, even with the same `send_id` |
| `topics list` | `tg topics list`, `tg topics search` | a forum group's topics with their ids; `search` matches titles |
| `chats show` | `tg chats show` | one chat and who is in it |
| `contacts list` | `tg contacts list` | people with a one-to-one chat |
| `contacts show` | `tg contacts show` | one person and the chats shared with them |
| `contacts profile` | `tg contacts profile` | what Telegram says about one person, and their stored activity per shared chat; the phone always shows its last four digits |
| `contacts lookup` | `tg contacts lookup` | who has a phone number, where their privacy allows; adds no contact |
| `contacts context` | `tg contacts context` | what the store holds about one person in every messenger linked to them: shared chats, last messages each way, recent messages, mentions; never connects; a message read, so `messages: deny` hides it |
| `messages evidence` | `tg messages evidence`, `--limit`, `--before-id` | one local chat evidence packet, newest first, with locators, fingerprints, coverage and `nextBeforeId`; pass the cursor as `before_id`; whole messages within 64 KiB of JSON items, header additional; history coverage unknown; an oversized first message yields an empty byte-truncated packet without a cursor; never connects or marks read; permission `messages.evidence` |
| `messages list` | `tg messages list`, `--before-id`, `--before-time`, `--after-id`, `--after-time` | a chat's messages; `before_id` or `before_time` read back, `after_id` or `after_time` forward — one of them at most; marks nothing read — `chats mark-read` does that, behind its own key; a voice message carries `transcript` once heard, `transcribe` hears the rest, and `model` picks the model |
| `messages context` | `tg messages show`, `context`, `--before-n`, `--after-n` | one message and those either side; `before_n` and `after_n` say how many |
| `messages scheduled` | `tg messages scheduled` | what waits to be sent in a chat, soonest first, each with `scheduledFor` |
| `messages photo` | `tg messages download` | a message's photo as an image to look at, up to 512 KB; `index` selects an attachment; anything else is refused with the `tg messages download` command that saves it |
| `messages transcribe` | `tg messages transcribe` | a voice message as text — by Telegram (Premium or the weekly trial), else by a speech model on this machine; `local: true` skips Telegram; `model` chooses the downloaded speech model; `pending: true` means Telegram was not finished within a minute; a missing model is refused with `tg models audio download`, never downloaded |
| `messages search` | `tg messages search` | search what this machine has kept; local by default; optional `sync_first` fetches new messages with `messages.sync-first: allow` |
| `messages link` | `tg messages link` | a permalink where supported and an account-scoped locator; read-only; a link grants no chat membership |
| `messages send` | `tg messages send`, `--reply-to`, `--topic` | send, by `messages.send`; `reply_to` answers a message and must belong to the chosen topic; `send_id` repeats a send whose outcome was unknown in the same chat and topic; `silent`, `no_preview` and `md` as `--silent`, `--no-preview` and `--md`; `topic` picks a forum topic; `at_time` sends it later — never retried; `file` or `photo` attaches a path from this machine, the text as the caption (`as_file` keeps a video a file), `voice` sends an Ogg Opus file as a voice message — hidden files, `~/.ssh`, tg's own folders and the message store are refused, with no way around it over MCP |
| `messages edit` | `tg messages edit` | the new text of the owner's own message, by `messages.edit`; `md` as `--md`; repeating it changes nothing |
| `chats mark-read` | `tg chats mark-read` | mark a chat read, to its newest message or `until` one, by `chats.mark-read` — the other side sees it |
| `messages delete` | `tg messages delete` | up to 10 messages from the owner's view, by `messages.delete`; never for everyone; each counts toward the hourly limit |
| `reactions add`, `reactions remove` | `tg reactions add`, `remove` | the owner's reaction on one message, by `reactions` |
| `polls show` | `tg polls show` | a poll and its answer ids; a read tool |
| `polls vote`, `polls close`, `polls create` | `tg polls vote`, `close`, `create` | vote by answer id (`polls.vote`), close the owner's own poll (`polls.close`), create one (`polls.create`, with `send_id` for a retry in the same chat and topic, `revote` to let people change their vote, and `topic` to choose an open forum topic) |
| `messages forward` | `tg messages forward` | one message into another chat (`to`), by `messages.forward`; `send_id` repeats a forward whose outcome was unknown |
| `messages pin`, `messages unpin` | `tg messages pin`, `unpin` | pin one message, quietly unless `notify`, by `messages.pin` and `messages.unpin` |
| `chats create`, `chats join`, `chats leave` | `tg chats create`, `join`, `leave` | make a group or channel with these people, join one by its link, leave one — the others see each |
| `chats update` | `tg chats update` | rename a group or channel, change its description or settings; its members see the change |
| `chats link show`, `chats link reset` | `tg chats link show`, `reset` | a group's invite link; a new one, after which the old one stops working |
| `chats members add`, `chats members remove` | `tg chats members add`, `remove` | add people to a group (each is told), or remove them; their messages stay |
| `chats admins add`, `chats admins remove` | `tg chats admins add`, `remove` | make a member an admin with these rights, or take them back |
| `chats folders list`, `_create`, `_update`, `_delete` | `tg chats folders …` | the owner's chat folders; create one, rename it or change its chats, delete it — the chats stay |
| `chats rules show`, `chats moderate` | `tg chats rules show`, `tg chats moderate` | a group's rules; judge its new messages and members by them and act where the rules' levels allow ([groups.md](groups.md)) |
| `account update` | `tg account update` | the name or description everyone sees on the owner's profile |
| `contacts rename` | `tg contacts rename` | a name for a person only the owner sees |
| `stats messages show` | `tg stats messages show` | count local query matches by chat, sender, day or hour |
| `conversations batches status`, `conversations batches next` | `tg conversations batches …` | batch volume and bounded messages; read after owner consent |
| `conversations links add`, `conversations links clear`, `conversations build` | `tg conversations links …`, `build` | store or clear agent links, rebuild; `conversations.links` |
| `attachments list`, `attachments text set` | `tg attachments list`, `text set` | retained paths/text status; save agent text for `content:` |
| `tags list`, `tags add`, `tags remove` | `tg tags list`, `add`, `remove` | the owner's own labels on a chat, a person or one message, kept in the local store and never sent; the writes by `tags.add` and `tags.remove`, refused under `ask` since there is no question to put |
| `searches list`, `searches history` | `tg searches list`, `history` | saved searches by name, and the searches and counts that ran; `saved` on `messages search` and `stats messages show` runs one |
| `tasks list`, `tasks add`, `tasks close`, `stats tasks show` | `tg tasks list`, `add`, `close`, `stats` | what waits on the owner — questions nobody answered, mentions, requests, promises — kept in the local store and never sent, each with the message it points at; `review` and `serve` open and close them; the writes by `tasks.add` and `tasks.close`, refused under `ask` since there is no question to put |
| `searches create`, `searches delete`, `searches clear` | `tg searches create`, `delete`, `clear` | save a search without running it, delete one saved search or history row, empty the history; local store only |
| `conversations status`, `conversations related` | `tg conversations status`, `related` | archive readiness and similar conversations from retained vectors |
| `conversations refresh` | `tg conversations search --refresh` | bounded local rebuild and embedding; writes by `conversations.embed`, never downloads a model |
| `conversations list`, `conversations show` | `tg conversations list`, `show` | the conversations inside a group, from the stored messages; one conversation's messages |

Answers are what the command prints with `--json`: a list is `{ items, page, limit, hasMore }`, a
chat's messages `{ items, limit, hasMore }`, ids are strings. An error is
`{ error: { code, message, … } }` with the CLI's codes; an ambiguous chat name answers with the
`candidates`.

Reads from Telegram are saved to the local store, as a command’s are; evidence reads that archive.
Each call can be kept as a run
(`tg runs list`), named `mcp chats list` and so on.

## Prompts, and chats by `@`

The server offers six ready prompts — in Claude Code they are `/` commands:

| Prompt | Argument | What the agent does |
|---|---|---|
| `catch-up` | `kind`, `mode` — optional | calls `inbox`; `mode` is `unread` (default), `new` or a time; `kind` selects chat kinds; marking read requires a separate approved tool call |
| `reply` | `chat` | reads the chat, writes a draft, and sends it only after your yes to that text |
| `find` | `text` | looks for a person or for words, and shows the messages around each hit; sends nothing |
| `link-conversations` | none | report cost and request consent, then read batches, save links and rebuild |
| `review` | `since`, `groups` — optional | calls `review` once and sorts it into what you owe, what others owe and what needs clarifying; drafts reminders, sends one only after your yes |
| `open-tasks` | `chat` — optional | calls review to refresh tasks, lists pending tasks and suggests drafts; closes a task only after owner approval; sends nothing |

`reply` and `review` send through `messages send`, so where `messages.send` is `readonly` the
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

`messages link` returns `{ locator, url, access, reason }` without message content. It shares
`messages link` account validation and audience limits; a private link grants no membership.

Personal MCP validates arguments against the advertised schema and refuses unknown fields before
connecting or acting. Use `at_time` for scheduling.

MCP `inbox` and `review` accept `kinds` and `new`. MCP keeps its own per-chat checkpoints,
separate from CLI `--new`. `new` cannot be combined with `since_time`, or with `unanswered` on review.
HTTP writes follow the profile's permissions, as over stdin/stdout. Repeat
`--permission key=level` to override permissions for this server process only ([browser setup](remote.md)).

MCP offers `conversations batches status`, `conversations batches next`, `conversations links add`,
`conversations links clear` and `conversations build`, plus the `link-conversations` prompt. Report batch
cost and obtain the owner's consent before reading batches. Stored links require `conversations.links`; rebuild
afterwards, including after clearing links. Remote embedding settings also affect MCP searches and can send query
text.

`attachments list` exposes retained paths and text status; `attachments text set` saves agent text for
`content:`. Extraction is CLI-only. `messages_context` accepts `offline: true` for stored messages.
