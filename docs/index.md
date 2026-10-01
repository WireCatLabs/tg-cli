# tg

`tg` is a Telegram client for the command line and for AI agents. It works with your own Telegram
account: read your chats, find what was said, and answer — yourself, or through Claude, Codex,
Cursor and other agents, within limits you set. In the groups you run, see which questions nobody
answered and who joined.

It is built for scripts and agents first: one operation per call, the same shape of answer every
time, and a fixed exit code for each kind of failure.

## The first minute

```sh
npm install -g @leemour/tg-cli
tg session start          # your app from my.telegram.org, then a QR code to scan
tg inbox                  # other people's unread messages, in every chat; nothing is marked read
tg messages list me       # Saved Messages, the latest 20
```

It needs Node 22 or newer, or Bun ([installation.md](installation.md)). The first login asks for your
own Telegram app; `tg` can register it for you ([sessions.md](sessions.md)).

## How it works

`tg` works in your name, as one more of your devices. It is not a bot: it talks to Telegram over
MTProto, Telegram's own API for client apps, with an app you register yourself. From then on `tg`
sees your chats, their history, groups, channels and contacts.

An agent connects to `tg` in one of two ways:

- **An agent with a terminal** — Claude Code, Codex, Gemini CLI. It runs `tg` commands itself. Give
  it the [skill](../skills/tg-cli/SKILL.md): instructions for working with `tg`, installed with one
  command ([recipes.md](recipes.md#once-first)).
- **An agent without a terminal** — Claude Desktop, Cursor and other MCP clients. Connect `tg mcp`;
  `tg mcp config` prints the entry for their settings. It comes with ready prompts: `/catch-up`
  (what is new), `/review` (who owes what), `/reply` (a draft answer) and `/find` (search). The
  profile's `permissions` decide what the agent may do ([mcp.md](mcp.md#what-an-agent-may-do)).

## What an agent does with it

- **A check on a schedule.** Morning and evening, the agent looks at what came in and sends you a
  short summary: who is waiting for an answer, what is urgent, what you can skip.
- **Reports.** A week of a work chat: what was decided, who took what on, which questions are still
  open.
- **Who owes what.** `tg review` hands over everything said since the last review in one call, your
  own messages too. The agent sorts it into "I owe", "waiting on others" and "needs clarifying".
- **Reminders.** Whom you promised an answer and did not give one; whose question has waited three
  days.
- **Draft replies.** The agent proposes the text, and you send it — or it sends, if you allowed it
  to write to that chat.
- **Search.** "When did we agree to meet Anna?" — an answer with the date and the message itself.
- **A group you run.** Which questions nobody answered, who joined this week
  ([groups.md](groups.md)).

What that looks like:

```text
You:    What did I promise anyone in the last three days?
Agent:  (calls tg review: 12 chats)
        I owe
        · Anna — send the invoice by Friday. "Anna", 24.09
        Waiting on others
        · Boris — the mock-up by 25.09. Not in "Design" yet
        Needs clarifying
        · "Project Alpha": who brings the samples — "we'll decide later", 25.09
        Next review — from 26.09, 14:05.
You:    Remind Boris about the mock-up.
Agent:  Draft: "Boris, hi! How is the mock-up going?" Send it?
You:    Yes.
```

Set sending to `ask` in the profile's `permissions`, and each message waits for your yes. Reading
marks nothing read. Ready requests, a schedule and limits for each job: [recipes.md](recipes.md).

## What it can do

- **Read.** Chats, history, one message with its neighbours, other people's unread messages in every
  chat at once (`tg inbox`), everything since the last review (`tg review`), new messages as they
  arrive (`tg watch`), a message's files or a whole chat's, voice messages as text.
- **Search.** Messages by their text, across everything this machine has kept, without connecting to
  Telegram; with `--regex` for a pattern. Chats by part of their title, contacts by part of a name,
  a person by phone number.
- **Write.** Text with Markdown, replies, files, photos, videos and voice messages, silent messages,
  scheduled messages that go out even with this computer off, edits, forwards, pins, reactions,
  polls, deletion — for you or for everyone.
- **Keep an archive.** Fetch a chat's history into the local store, in the background if it is long;
  keep the store current with `tg serve`, as a systemd or launchd service; export a chat as JSON
  lines or Markdown; back the store up and restore it while it is in use ([archive.md](archive.md)).
- **Groups and channels.** Create a group or a channel, join by a link, leave; rename it, add and
  remove members and admins, reset its invite link; who joined and left, forum topics, where an
  invite link leads; moderation rules for links, forwards and floods, applied when you run them
  ([groups.md](groups.md)).
- **Contacts and the account.** Add, rename, block and import contacts; who you are logged in as,
  and every device and app logged in to the account.

## Why it is good

- **It reads without a trace.** Reading marks nothing read: the other side does not see that you
  opened the chat. Mark it read when you want to: `tg chats mark-read`.
- **An agent cannot write more than you allowed.** A profile can be read-only, allow only some
  actions, send only to the chats on its list, and send at most 30 messages an hour. When a name
  fits two chats, `tg` does not pick one: it shows both ([security.md](security.md#the-send-guard)).
- **A message is never sent twice.** If the connection breaks while a message is sent, `tg` says
  plainly that it does not know whether it went, and gives the command to repeat it. Telegram
  recognises the repeat and does not create a second message
  ([usage.md](usage.md#when-the-outcome-is-unknown)).
- **Your own copy of your messages.** Everything read is kept on your computer. Search over it is
  fast, and `--offline` answers from it without connecting at all.
- **Voice messages as text, on your computer.** Telegram transcribes for Premium accounts; `tg` can
  also run a speech model on this machine, downloaded only when you ask
  ([usage.md](usage.md#voice-messages)).
- **Other people's text does not control your terminal.** Control characters in names, titles and
  messages are shown as text, and a name is printed on one line
  ([security.md](security.md#other-peoples-text-on-your-screen)).
- **No secret on the command line.** No command takes a password, a login code or a phone number as
  an argument. The app keys are in the system keyring.
- **Easy to read for a script and an agent.** With `--json`, a command prints data and nothing else,
  always in the same shape. An error comes separately, with its own exit code
  ([usage.md](usage.md#for-scripts-and-agents)).
- **Problems can be looked at without your messages.** `--trace` shows each request to Telegram and
  holds no text, names, phone numbers or keys, so it can go into a bug report
  ([diagnostics.md](diagnostics.md)).

## How it differs

There are good tools for a Telegram account already. Choose what fits the job.

| | tg-cli | [tgcli](https://github.com/kfastov/tgcli) |
|---|:-:|:-:|
| what it is | a terminal tool and an MCP server | a terminal tool, an archiver and an MCP server |
| MCP server | ✅ over stdin and stdout, started by the client | ✅ over HTTP, from its background service |
| a skill for agents with a terminal | ✅ | ✅ |
| limits for an agent: read-only, allowed actions, allowed chats, an hourly cap, confirming each send | ✅ | — |
| a message never sent twice after a broken connection | ✅ | — (retries a failed send) |
| unread in every chat; "who owes what"; unanswered questions | ✅ | — |
| voice messages as text | ✅ Telegram or a model on this machine | — |
| a local archive, searched without connecting | ✅ | ✅ |
| keeping the archive current as a system service | ✅ systemd, launchd | ✅ |
| fetching history in the background | ✅ | ✅ |
| export as JSON lines or Markdown | ✅ | — |
| new messages as they arrive | ✅ `tg watch` | ✅ `sync --follow`, into the archive |
| reading, sending text, photos and files | ✅ | ✅ |
| sending videos and voice messages | ✅ | — |
| scheduled sending | ✅ | ✅ |
| edit, forward, pin, reactions, polls | ✅ | — |
| deleting messages — for you or for everyone | ✅ | — |
| marking a chat read on request | ✅ | ✅ |
| sending into a forum topic; spoilers; protected content; HTML | — | ✅ |
| forum topics: list and search | ✅ | ✅ |
| groups: create | ✅ | — |
| groups: join, leave | ✅ | ✅ |
| groups: rename, add and remove members, invite links | ✅ | ✅ |
| folders | ✅ | ✅ |
| your own tags, aliases and notes on chats and contacts | — | ✅ |
| install with Homebrew or Docker | — | ✅ |

**Telegram's own apps** are made for a person. `tg` is made for a script and an agent: one operation
per call, the same shape of answer every time, a limit on what an agent may send, your messages
searchable offline, and nothing marked read by reading.

**Bots.** A Telegram bot, through the [Bot API](https://core.telegram.org/bots/api), sees only the
chats it was added to and speaks as the bot. `tg` is you: your chats, in your name. It has no bot
mode.

## Where to go next

| Page | Answers |
|---|---|
| [installation.md](installation.md) | What does it need, where do its files go, how do I upgrade or remove it? |
| [usage.md](usage.md) | How do I read, page, send, and use it from a script? |
| [sessions.md](sessions.md) | How does login work, where are the keys, how do profiles work? |
| [archive.md](archive.md) | What does the local store keep, and how do I fill, search, export and back it up? |
| [groups.md](groups.md) | How do I keep up with a group I run? |
| [mcp.md](mcp.md) | How do I connect Claude Desktop, Cursor or another client without a terminal? |
| [remote.md](remote.md) | How do I reach it from ChatGPT or Claude in the browser? |
| [recipes.md](recipes.md) | What can an agent do for me every day, and how do I run it on a schedule? |
| [commands.md](commands.md) | Every command, option and exit code |
| [configuration.md](configuration.md) | What can I set, and which value wins? |
| [diagnostics.md](diagnostics.md) | What did a command do, and what is never recorded? |
| [troubleshooting.md](troubleshooting.md) | Something does not work: what the screen says, and what to do |
| [security.md](security.md) | What reaches the disk and the network, and what stops a send going to the wrong place? |
| [roadmap.md](roadmap.md) | What is coming next? |
