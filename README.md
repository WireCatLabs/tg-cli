<p align="center">
  <img src="https://raw.githubusercontent.com/leemour/tg-cli/main/docs/design/logo_text.png" alt="Tg CLI" width="480">
</p>

# tg-cli

Your personal Telegram account in the terminal and in AI agents. `tg` is a command line tool and an
MCP server: read your chats, find what was said, and answer — yourself, or through Claude, Codex,
Cursor and other agents, within limits you set. In the groups you run, see which questions nobody
answered and who joined.

```sh
tg inbox                                          # other people's unread messages, in every chat
tg messages send "Book club" "Running 15 minutes late"
```

[![npm](https://img.shields.io/npm/v/@leemour/tg-cli)](https://www.npmjs.com/package/@leemour/tg-cli)
[![CI](https://github.com/leemour/tg-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/leemour/tg-cli/actions/workflows/ci.yml)
[![Node](https://img.shields.io/node/v/@leemour/tg-cli)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/bun-tested-f9f1e1)](https://bun.sh/)
[![npm downloads](https://img.shields.io/npm/dm/@leemour/tg-cli)](https://www.npmjs.com/package/@leemour/tg-cli)
[![License: MIT](https://img.shields.io/npm/l/@leemour/tg-cli)](LICENSE)

## The personal account

`tg` works with your own account, as one more of your devices: every chat, its history, groups,
channels and contacts. It is not a bot.

> ⚠️ **tg-cli is an unofficial Telegram client.** It talks to Telegram over MTProto, the API
> Telegram publishes for third-party clients, with an app you register yourself. Telegram allows
> such clients, but watches accounts that use them for spam or automation, and can limit or ban
> them ([Telegram API Terms of Service](https://core.telegram.org/api/terms)). You use tg-cli at your
> own risk; the authors and contributors are not responsible for banned accounts, lost data or any
> other consequence.

```sh
tg chats list --limit 5
tg messages list "Book club"
tg messages send "Book club" "Running 15 minutes late"
```

In full: [docs/usage.md](docs/usage.md).

## How to use it

The most useful thing is to hand your messages to an agent: Claude, Codex or another. It reads
your chats through `tg` and does what you asked for in words.

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
  ([below](#groups-you-run)).

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

The agent can send only if you allowed it, and with `--confirm-send` each message waits for your
yes. Reading marks nothing read. How to set an agent up for each job — ready requests, a schedule
and limits: [docs/recipes.md](docs/recipes.md).

## Groups you run

```sh
tg review --chat "Hiking" --unanswered            # questions nobody answered in 24 hours
tg chats events "Hiking" --since 7d               # who joined, left, was added or removed, and by whom
tg chats members list "Hiking" --all              # everyone, with their role and when they were last seen
tg topics list "Hiking"                           # a forum group's topics, newest activity first
tg chats inspect https://t.me/+AbCdEf             # where an invite link leads, without joining
```

These read. Creating a group, changing members and admins, invite links and moderation rules are
not in `tg` yet ([Roadmap](#roadmap)).

## How it works

`tg` works in your name, as one more of your devices, not as a bot. You register your own Telegram
app once, log in by QR code or phone number, and from then on `tg` sees what the app sees.

An agent connects to `tg` in one of two ways:

- **An agent with a terminal** — Claude Code, Codex, Gemini CLI. It runs `tg` commands itself. Give
  it the skill — instructions for working with `tg` — with one command
  ([below](#for-scripts-and-agents)).
- **An agent without a terminal** — Claude Desktop, Cursor and other MCP clients. Connect `tg mcp`;
  `tg mcp config` prints the entry for their settings. It comes with ready prompts: `/catch-up`
  (what is new), `/review` (who owes what), `/reply` (a draft answer) and `/find` (search). By
  default the agent only reads. Sending, marking read and deleting are each turned on by their own
  flag.

## What it can do

- **Read.** Chats, history, one message with its neighbours, other people's unread messages in every
  chat at once (`tg inbox`), everything since the last review for "who owes what" (`tg review`), new
  messages as they arrive (`tg watch`), downloading a message's files or a whole chat's, voice
  messages as text, export of a chat as JSON lines or Markdown.
- **Search.** Messages by their text, across everything this machine has kept, without connecting to
  Telegram; with `--regex` for a pattern. Chats by part of their title, contacts by part of a name,
  a person by phone number.
- **Write.** Text with Markdown, replies, files and photos, silent messages, scheduled messages
  that go out even with this computer off, edits, forwards, pins, reactions, polls, deletion — for
  you or for everyone.
- **Keep an archive.** Fetch a chat's history into the local store, in the background if it is long;
  keep the store current with `tg serve`, as a systemd or launchd service; back it up and restore it
  while it is in use.
- **Groups and channels.** Members with their role, who joined and left, forum topics, where an
  invite link leads.
- **The account.** Who you are logged in as, and every device and app logged in to the account.

## Why it is good

- **It reads without a trace.** Reading marks nothing read: the other side does not see that you
  opened the chat. Mark it read when you want to: `tg chats mark-read`.
- **An agent cannot write more than you allowed.** A profile can be read-only, allow only some
  actions, send only to the chats on its list, and send at most 30 messages an hour. The MCP server
  can show you every send in a form before it goes. When a name fits two chats, `tg` does not pick
  one: it shows both.
- **A message is never sent twice.** If the connection breaks while a message is sent, `tg` says
  plainly that it does not know whether it went, and gives the command to repeat it. Telegram
  recognises the repeat and does not create a second message.
- **Your own copy of your messages.** Everything read is kept on your computer. Search over it is
  fast, and `--offline` answers from it without connecting at all.
- **Voice messages as text, on your computer.** Telegram transcribes for Premium accounts; `tg` can
  also run a speech model on this machine, downloaded only when you ask.
- **Other people's text does not control your terminal.** Names, chat titles and messages are written
  by others. Control characters in them are shown as text, and a name is printed on one line, so a
  message cannot fake a line of the conversation or rewrite what is already on screen.
- **No secret on the command line.** No command takes a password, a login code or a phone number as
  an argument, so none of them lands in your shell history. The app keys are in the system keyring.
- **Easy to read for a script and an agent.** With `--json`, a command prints data and nothing else,
  always in the same shape. An error comes separately, with a number, so a script knows at once what
  happened: not logged in, chat not found, or Telegram did not answer in time.
- **Problems can be looked at without your messages.** `--trace` shows each request to Telegram, so
  you can see why a command failed. It holds no text, names, phone numbers or keys, so it can go into
  a bug report. A failed run is always kept, also without text.

## How it differs

There are good tools for a personal Telegram account already. Choose what fits the job.

| | tg-cli | [tgcli](https://github.com/kfastov/tgcli) |
|---|:-:|:-:|
| what it is | a terminal tool and an MCP server | a terminal tool, an archiver and an MCP server |
| MCP server | ✅ over stdin and stdout, started by the client | ✅ over HTTP, from its background service |
| a skill for agents with a terminal | ✅ | ✅ |
| limits for an agent: read-only, allowed actions, allowed chats, an hourly cap, confirming each send | ✅ | — |
| sending and deleting over MCP only when turned on | ✅ | — |
| a message never sent twice after a broken connection | ✅ | — (retries a failed send) |
| unread in every chat; "who owes what"; unanswered questions | ✅ | — |
| voice messages as text | ✅ Telegram or a model on this machine | — |
| a local archive, searched without connecting | ✅ | ✅ |
| keeping the archive current as a system service | ✅ systemd, launchd | ✅ |
| fetching history in the background | ✅ | ✅ |
| export as JSON lines or Markdown | ✅ | — |
| new messages as they arrive | ✅ `tg watch` | ✅ `sync --follow`, into the archive |
| reading, sending text, photos and files | ✅ | ✅ |
| scheduled sending | ✅ | ✅ |
| edit, forward, pin, reactions, polls | ✅ | — |
| deleting messages — for you or for everyone | ✅ | — |
| marking a chat read on request | ✅ | ✅ |
| sending into a forum topic; spoilers; protected content; HTML | — | ✅ |
| forum topics: list and search | ✅ | ✅ |
| groups: rename, add and remove members, invite links, join, leave | — | ✅ |
| folders | — | ✅ |
| your own tags, aliases and notes on chats and contacts | — | ✅ |
| install with Homebrew or Docker | — | ✅ |

**Telegram's own apps** are made for a person. `tg` is made for a script and an agent: one operation
per call, the same shape of answer every time, a limit on what an agent may send, your messages
searchable offline, and nothing marked read by reading.

**Bots.** A Telegram bot, through the [Bot API](https://core.telegram.org/bots/api), sees only the
chats it was added to and speaks as the bot. `tg` is you: your chats, in your name. It has no bot
mode.

## Contents

- [The personal account](#the-personal-account)
- [Groups you run](#groups-you-run)
- [Install](#install)
- [Log in](#log-in)
- [Use](#use)
- [For scripts and agents](#for-scripts-and-agents)
- [Security](#security)
- [Documentation](#documentation)
- [Development](#development)
- [Roadmap](#roadmap)
- [Licence](#licence)
- [Contributing](#contributing)

## Install

The package is **`@leemour/tg-cli`**; the command it installs is **`tg`**.

Try it without installing:

```sh
npx @leemour/tg-cli --help
```

Install it:

```sh
npm install -g @leemour/tg-cli     # or: pnpm add -g @leemour/tg-cli, bun add -g @leemour/tg-cli
tg --version
```

It needs **Node 22 or newer**, or **Bun** — CI runs the built command under both — on macOS, Linux
or Windows. SQLite comes from the
runtime itself, so there is nothing to compile. `tg doctor` says where its files are and whether a
login exists, without connecting. Details, variables and where the files go:
[docs/installation.md](docs/installation.md).

## Log in

Every user registers their own Telegram app at [my.telegram.org](https://my.telegram.org/apps).
`tg session start` asks for it the first time; `--app auto` fills in the site for you.

```sh
tg session start                        # a QR code in the terminal: Settings → Devices → Link Desktop Device
tg session start phone                  # or a phone number, the code, and your 2FA password
tg session start --qr-file login.png    # the QR code as a picture, for an agent to show you
tg account show                         # who you are logged in as
```

Several accounts are several profiles, and the profile is **the first word**, not an option:

```sh
tg chats list              # profile "default"
tg work chats list         # profile "work"
export TG_PROFILE=work     # or for the whole shell session
```

The app, the session and profiles: [docs/sessions.md](docs/sessions.md).

## Use

**A conversation in your name:**

```sh
tg inbox                                          # unread in every chat, nothing marked read
tg messages list "Book club" --limit 20
tg messages send "Book club" "Call at 3?" --reply-to <id>
tg reactions add "Book club" <id> 👍
tg messages send me "Call mum" --at 2h            # a reminder in Saved Messages in two hours
tg review --since 1d                              # a day of messages: who promised what
```

**Files and voice:**

```sh
tg messages send "Book club" "The minutes" --file minutes.pdf
tg messages download "Book club" <id> --output ~/Downloads
tg messages transcribe "Book club" <id>           # a voice message as text
```

**Find and keep:**

```sh
tg messages search "contract"                     # everything kept, without connecting
tg store fetch "Project Alpha" --max 5000 --background
tg store export "Project Alpha" --format markdown > alpha.md
tg server install                                 # keep the store current as a service
```

Every command answers in JSON with `--json`, and every send goes into a journal — without its text.

In full: [docs/usage.md](docs/usage.md). Every command and option:
[docs/commands.md](docs/commands.md) — generated from the program itself, so it cannot describe a
version that does not exist.

## For scripts and agents

### A skill for agents with a terminal

A skill is a file of instructions an agent reads before it works. `tg`'s skill says which commands
exist, what the agent does only when you ask, and how to repeat a send safely. **Claude Code**,
**Codex** and **Gemini CLI** read it. It is installed with one command and is always the same
version as `tg`:

```sh
# Claude Code
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md
# Codex and Gemini CLI share ~/.agents/skills
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md
```

How these agents find skills: [Codex](https://learn.chatgpt.com/docs/build-skills),
[Gemini CLI](https://geminicli.com/docs/cli/skills/).

### An MCP server for agents without a terminal

Claude Desktop, Cursor and other MCP clients connect to `tg mcp` and work with the same account.
Without `--allow-send` the agent only reads. With `--confirm-send` you see the chat and the text
before each send, and answer yes or no. `--allow-mark-read` and `--allow-delete` turn on their own
tools. In full: [docs/mcp.md](docs/mcp.md).

```sh
claude mcp add tg -- tg mcp         # Claude Code
tg mcp config                       # the entry for Claude Desktop, Cursor and others, with full paths
```

The server's prompts — `/catch-up`, `/review`, `/reply`, `/find` — are ready requests: the agent
knows which tools to call and what not to do. ChatGPT or Claude in the browser can reach it too,
through a login proxy and a tunnel: [docs/remote.md](docs/remote.md).

### Answers in JSON

```sh
tg chats list --json
```

With `--json` a command prints only data, as one JSON value — no tables, colour or hints. It does
the same when another program reads its output, as in `tg … | jq`. `--jsonl` prints one object per
line. Every list comes in one shape:

```json
{ "items": [ … ], "page": 1, "limit": 20, "hasMore": true }
```

An error comes apart from the data — one line on stderr, while stdout stays empty, so it cannot be
taken for an empty result:

```json
{"error":{"code":"authentication_error","message":"…"}}
```

Every error has a number — the exit code. A script decides what to do next by it: `4` log in, `5`
the profile may not do this, `6` chat or message not found, `8` a limit, `9` Telegram did not answer
in time, `14` unknown whether a message went. `tg commands --json` is the whole command tree, with
every exit code. All codes: [docs/commands.md](docs/commands.md#exit-codes).

## Security

- The session is a file readable only by your user, and it is as good as your password: copying it
  copies the login. The app keys are in the system keyring.
- The local store is readable only by your user. It holds the full text of what was read,
  unencrypted; only whole-disk encryption protects it from a stolen disk. It stays after logging out.
- Before each send, from a command or over MCP, `tg` checks the profile's limits and writes a line to
  the journal — without the message's text.
- The MCP server with `--confirm-send` shows you every send before it goes. `--file` refuses keys and
  hidden files unless you add `--allow-any-file`, and over MCP there is no way around it.
- The limits protect against an agent talked into sending by a message it read, not against one
  that sets out to get round them: against that you need a boundary outside — a sandbox or a
  separate user.

In full — what reaches the disk, what goes over the network and what the tool never does:
[docs/security.md](docs/security.md).

## Documentation

| Page | Answers |
|---|---|
| [installation.md](docs/installation.md) | install, requirements, where files go, upgrade, uninstall |
| [usage.md](docs/usage.md) | login, profiles, reading, paging, sending, scripts — in order |
| [sessions.md](docs/sessions.md) | QR and phone login, the app from my.telegram.org, the keyring, profiles, logout |
| [configuration.md](docs/configuration.md) | every setting and variable, and which one wins |
| [store.md](docs/store.md) | the local store: fetch, status, export, search, `--offline`, `serve` as a service, backup |
| [mcp.md](docs/mcp.md) | Claude Desktop, Cursor and other clients without a terminal |
| [remote.md](docs/remote.md) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes.md](docs/recipes.md) | an agent's daily work: summary, who owes what, unanswered, on a schedule |
| [diagnostics.md](docs/diagnostics.md) | `--trace`, `--record`, `runs`, `doctor report` — and what is never recorded |
| [security.md](docs/security.md) | what reaches the disk and what never does; the send guard |
| [troubleshooting.md](docs/troubleshooting.md) | by symptom: what the screen says, and what to do |
| [commands.md](docs/commands.md) | every command, option and exit code — **generated** from the program |
| [dev/ARCHITECTURE.md](docs/dev/ARCHITECTURE.md) | how it is built, and which seams not to cross |

The whole table of contents: [docs/README.md](docs/README.md). What each version changed:
[CHANGELOG.md](CHANGELOG.md).

## Development

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build && pnpm smoke:bun  # the built command under the second runtime
pnpm generate                 # rewrites docs/commands.md from the command tree
bin/tg session start          # everything under .tg/ in this checkout, never the real profile
bin/tg chats list --limit 5
```

Everything that is not specific to Telegram — the commands, the store, the send guard, the MCP
server — lives in [cli-messaging](https://github.com/leemour/cli-messaging), shared with
[max-cli](https://github.com/leemour/max-cli). Telegram-specific code lives only in `src/telegram/`,
and a lint rule keeps [mtcute](https://mtcute.dev), the Telegram library underneath, there.

To work on `cli-messaging` at the same time, point the dependency at a checkout for the length of
the change — `pnpm add @leemour/cli-messaging@link:../cli-messaging` — and put the version back
before the pull request.

## Roadmap

What is coming, in the order it is likely to arrive:

- **Richer sending** — voice notes and videos, several photos in one message, sending into a forum
  topic.
- **Running groups** — creating a group, joining and leaving, members and admins, invite links,
  folders, contacts, your profile, and moderation rules checked on your say-so.

## Licence

MIT — see [LICENSE](LICENSE).

## Contributing

Pull requests, bug reports and ideas are welcome —
[issues](https://github.com/leemour/tg-cli/issues). How the code is built and how to test it:
[docs/dev/ARCHITECTURE.md](docs/dev/ARCHITECTURE.md) and [docs/dev/TESTING.md](docs/dev/TESTING.md).
