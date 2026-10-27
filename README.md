<p align="center">
  <img src="https://raw.githubusercontent.com/WireCatLabs/tg-cli/main/docs/images/social-preview.png" alt="Telegram CLI for AI agents" width="100%">
</p>

# tg — Telegram CLI for AI agents

<p align="center">
  Your whole Telegram account in the terminal, searchable on your computer, and ready for Claude Code,
  Codex, Cursor or any agent — within limits you set.
</p>

<p align="center">
  <a href="https://wirecat.dev/en/docs/tg">Docs</a> ·
  <a href="https://github.com/WireCatLabs/tg-cli/blob/main/docs/recipes.md">Examples</a> ·
  <a href="https://wirecat.dev">WireCat</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wirecat/tg-cli"><img src="https://img.shields.io/npm/v/@wirecat/tg-cli" alt="npm"></a>
  <a href="https://github.com/WireCatLabs/tg-cli/actions/workflows/ci.yml"><img src="https://github.com/WireCatLabs/tg-cli/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/node/v/@wirecat/tg-cli" alt="Node"></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/bun-tested-f9f1e1" alt="Bun"></a>
  <a href="https://www.npmjs.com/package/@wirecat/tg-cli"><img src="https://img.shields.io/npm/dm/@wirecat/tg-cli" alt="npm downloads"></a>
  <a href="https://github.com/WireCatLabs/tg-cli/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="License: Apache 2.0"></a>
</p>

An example conversation (invented people, illustrative output):

```text
You:    Use tg CLI. What did I promise anyone in the last three days?
Agent:  (runs tg personal review 'date>3d': 12 chats)
        I owe
        · Alice Example — the invoice by Friday. "Alice Example", 24.09
        Waiting on others
        · Bob Sample — the mock-up by 25.09. Not in "Design" yet
You:    Remind Bob about the mock-up.
Agent:  Draft: "Hi Bob, how is the mock-up going?" Send it?
You:    Yes.
```

## Quick start

```sh
npm install -g @wirecat/tg-cli    # or: bun add -g @wirecat/tg-cli; pnpm: see docs/installation.md
tg skill install --for all        # the agent skill, for Claude Code, Codex and Gemini CLI
tg personal setup                 # app registration and login
tg personal inbox                 # other people's unread messages, in every chat; nothing is marked read
```

A global install does not install the agent skill: `tg personal setup` offers it, or run `tg skill install --for all`. npm may warn that install scripts are blocked or "not yet covered by allowScripts" (`@wirecat/tg-cli`,
`better-sqlite3`); that is harmless, and you need not allow them — [why](https://github.com/WireCatLabs/tg-cli/blob/main/docs/installation.md#install).
On Windows, if `tg` is not found, open a new terminal, or use the PowerShell installer in
[the installation guide](https://github.com/WireCatLabs/tg-cli/blob/main/docs/installation.md#windows-one-install-command).

Allow about five minutes. `tg personal setup` registers your own Telegram app at
[my.telegram.org](https://my.telegram.org/apps), logs in by QR code, checks your first chats and installs
the agent skill. Downloading older history is a separate step.

It needs **Node 22.19+ or 24+**, or **Bun**, on macOS, Linux or Windows. Try it without installing:
`npx @wirecat/tg-cli --help`.

More: [installation guide](https://github.com/WireCatLabs/tg-cli/blob/main/docs/installation.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/installation)

## What can you do?

**Catch up.** *"Use tg CLI. What came in since this morning, and who is waiting for my answer?"*

```sh
tg personal inbox
tg personal review 'date>1d'
```

**Find anything.** *"Use tg CLI. When did we agree on the venue with Alice?"* — an answer with the date
and the message itself.

```sh
tg personal search all "venue"                # messages and notes on this computer, and Telegram's own search
```

By default the words also go to Telegram's server search; add `--offline` to keep the query on this computer.

**Keep your promises.** *"Use tg CLI. What did I promise, and what am I still waiting on?"* `tg personal review`
hands over everything said since the last review in one call, your own messages too.

```sh
tg personal review --new                      # what changed since the last review --new
```

**Run your groups.** *"Use tg CLI. Which questions in Hiking has nobody answered?"*

```sh
tg personal review chat:Hiking --unanswered
tg personal chats events "Hiking" "time>=7d"  # who joined, left, was added or removed
```

More: [recipes, with a schedule and limits for each](https://github.com/WireCatLabs/tg-cli/blob/main/docs/recipes.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/recipes)

## Built for AI agents

Your agent. Your Telegram. Your rules.

- **Agents with a terminal** (for example Claude Code, Codex, Gemini CLI) run `tg` commands
  themselves. The bundled [skill](https://github.com/WireCatLabs/tg-cli/blob/main/skills/wirecat-tg/SKILL.md)
  tells them how: `tg personal setup --agent …` or `tg skill install` puts it in place, and `tg skill show`
  prints it before login.
- **Apps without a terminal** (for example Claude Desktop, Cursor and other MCP clients) connect to
  `tg personal mcp`. It comes with ready prompts: `/catch-up`, `/review`, `/reply`, `/find`, `/open-tasks` and `/link-conversations`.

```sh
tg personal mcp add claude-code  # or: tg personal mcp add codex
tg personal mcp config      # the entry for Claude Desktop, Cursor and others
```

The profile can send by default, so `mcp add` stops first. Check the profile's permissions, then run
it again with `--allow-writes`.

More: [the MCP server](https://github.com/WireCatLabs/tg-cli/blob/main/docs/mcp.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/mcp)

## Why tg?

- **Your whole account, not only bots.** Every chat, group, channel and contact, with its history —
  `tg` is one more of your devices.
- **Local-first search.** Everything read is kept on your computer. Search reads that copy and, by default,
  asks Telegram's own search too; `--offline` keeps the query on your computer.
- **Made for agents.** One operation per call, the same JSON shape every time with `--json`, a fixed
  exit code for each kind of failure, an MCP server and a skill.
- **Safe by default.** Reading marks nothing read. A profile decides which actions an agent may take,
  which chats it may send to, and how many messages an hour (30 by default). When a send's outcome is
  unknown, `tg` says so and gives a repeat command that Telegram does not deliver twice.
- **The full Bot API too.** All 185 methods, next to the convenient bot commands.

More: [compared with other tools](https://github.com/WireCatLabs/tg-cli/blob/main/docs/compare.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/compare)

## Your account

`tg` works in your name, as one more of your devices. It is not a bot: it talks to Telegram over
MTProto, Telegram's own API for client apps, with an app you register yourself. It sees your chats,
their history, groups, channels and contacts.

```sh
tg personal chats list --limit 5
tg personal messages list "Book club" --limit 20
tg personal messages send "Book club" "Call at 3?" --reply-to <id>
tg personal reactions add "Book club" <id> 👍
tg personal messages send me "Call mum" --at-time 2h  # a reminder in Saved Messages in two hours
tg personal messages send "Book club" "The minutes" --file minutes.pdf
tg personal messages download "Book club" <id> --output-dir ~/Downloads
tg personal messages transcribe "Book club" <id>  # a voice message as text
```

- **Read.** Chats, history, one message with its neighbours, other people's unread messages in every
  chat (`tg personal inbox`), everything since the last review (`tg personal review`), new messages as they arrive
  (`tg personal watch`), a message's files, voice messages as text.
- **Write.** Markdown, replies, files, photos, videos and voice messages, silent and scheduled messages
  (they go out even with this computer off), edits, forwards, pins, reactions, polls, deletion — for
  you or for everyone.
- **Voice on your computer.** Telegram transcribes for Premium accounts; `tg` can also run a speech
  model on this machine, downloaded only when you ask.
- **Contacts and the account.** Add, rename, block and import contacts; your own aliases and notes
  for people; who you are logged in as, and every device logged in to the account.
- **One person.** Their profile, when they were last seen, their messages per shared chat, and whether
  the account looks like a bot or a spammer.

More: [using tg](https://github.com/WireCatLabs/tg-cli/blob/main/docs/usage.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/usage) · [one person](https://github.com/WireCatLabs/tg-cli/blob/main/docs/people.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/people)

## Log in and profiles

Every user registers their own Telegram app; `tg personal setup` or `tg personal session start` does it for you. The
app keys go to the system keyring, and the session is a file only your user can read.

```sh
tg personal session start               # a QR code: Settings → Devices → Link Desktop Device
tg personal session start phone         # or a phone number, the code and your 2FA password
tg personal session start qr            # without a terminal (an agent): the QR code as text to paste into the chat
tg personal account show                # who you are logged in as
tg account list                         # every profile here, and who each is logged in as
```

Several accounts are several profiles, and the profile is **the first word**, not an option:

```sh
tg personal chats list     # profile "personal"
tg work chats list         # profile "work"
export TG_PROFILE=work     # or for the whole shell session
```

`tg` never picks a profile for you, not even the only one: a command that uses an account and has no
profile named stops and lists the profiles on this computer. Name one, or set `TG_PROFILE` for a
whole shell session.

More: [login and sessions](https://github.com/WireCatLabs/tg-cli/blob/main/docs/sessions.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/sessions) · [profiles](https://github.com/WireCatLabs/tg-cli/blob/main/docs/profiles.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/profiles)

## The local store and search

Everything `tg` reads is kept in a local store on your computer. Search runs over it and over
Telegram by default; `--offline` answers from the store without connecting.

```sh
tg personal search messages 'contract chat:"Project Alpha"'
tg personal search messages "contract" --backend archive  # local only
tg personal messages sync "Project Alpha" --last 5000 --background
tg personal store export "Project Alpha" --format markdown --output alpha.md
tg personal messages evidence "Project Alpha" --json  # bounded evidence for a chat brief
tg personal server install                         # keep the store current as a systemd or launchd service
tg personal store backup ~/tg-backup.db            # a copy, safe while the store is in use
```

Search by words, people, dates, files, links and tags; save searches; find discussions by topic.

More: [search](https://github.com/WireCatLabs/tg-cli/blob/main/docs/search.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/search) · [the local store](https://github.com/WireCatLabs/tg-cli/blob/main/docs/archive.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/archive)

## Groups you run

```sh
tg personal review chat:Hiking --unanswered   # questions nobody answered in 24 hours
tg personal chats events "Hiking" "time>=7d"  # who joined, left, was added or removed, and by whom
tg personal chats members list "Hiking" --all     # everyone, with their role and when they were last seen
tg personal topics list "Hiking"                  # a forum group's topics, newest activity first
tg personal chats inspect https://t.me/+AbCdEf    # where an invite link leads, without joining
tg personal chats create "Hiking 2027" @alice_example  # a new group, with the people you name
tg personal stats chats show "Hiking"             # group activity
```

Renaming a group, adding and removing members and admins, join requests, invite links, forum topics
and moderation rules for links, forwards and floods are commands too.

More: [groups you run](https://github.com/WireCatLabs/tg-cli/blob/main/docs/groups.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/groups)

## A bot

`tg personal bot` works with a bot through Telegram's official [Bot API](https://core.telegram.org/bots/api) and
its token from [@BotFather](https://t.me/BotFather). You can keep several bots; each has a name you
choose, and that name is the first word of the command.

```sh
tg sales bot auth set                    # the token, at a hidden prompt; Telegram checks it first
tg sales bot auth show                   # which bot it is
tg sales bot recipients add user:<id>    # the bot may write only here
tg sales bot messages send "Team" "Build is ready" --file report.pdf
tg sales bot api --help                  # every Bot API method, each with its fields
tg personal bot list --check             # every bot on this computer
```

- **Every Bot API method.** `tg <bot> bot api <method>` takes native field flags or a JSON body.
- **One token per name, in the keyring**, apart from your own login; `TG_BOT_TOKEN` for CI. The token
  is never printed — not in an error, not with `--trace`, not in a run record.
- **Recipients and a journal.** Each bot has its own list of chats it may write to, and a journal of
  what it did, without the text.
- **Messages, admins, members, buttons, the menu, webhooks** — send, edit, delete and pin; `bot chats
  admins`, `bot callbacks answer`, `bot commands`, `bot webhooks`.
- **History.** `bot watch` prints and keeps what happens in the bot's chats; `bot messages sync` imports
  older channel and supergroup messages.

More: [a Telegram bot](https://github.com/WireCatLabs/tg-cli/blob/main/docs/bot.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/bot)

## Agent setup in detail

**The skill.** Claude Code reads `~/.claude/skills/tg-cli/`; Codex, Gemini CLI and local Cursor read
`~/.agents/skills/tg-cli/`. Start a new agent session if it does not see the skill.

```sh
tg skill install --for all        # both folders, without logging in
tg skill show                     # the complete instructions, without installing them
```

**The MCP server.** Commands stay discoverable with their arguments and current availability. The
profile's `permissions` decide which may run. `readonly` stops writes; at `ask` the server shows no
form, so set up approval in your agent app.

```sh
claude mcp add tg -- tg personal mcp  # Claude Code, by hand
tg personal mcp check            # check the local MCP server
```

**From the browser.** ChatGPT or Claude in the browser reach `tg personal mcp --http --public-url <url>` behind
your tunnel, after a login with a one-time access code from your terminal.

More: [the MCP server](https://github.com/WireCatLabs/tg-cli/blob/main/docs/mcp.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/mcp) · [remote access](https://github.com/WireCatLabs/tg-cli/blob/main/docs/remote.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/remote)

## Output for scripts and agents

With `--json` a command prints only data, as one JSON value — no tables, colour or hints; it does the
same when another program reads its output. `--jsonl` prints one object per line. Every list has one
shape:

```json
{ "items": [ … ], "page": { "limit": 20, "has_more": true }, "meta": { … } }
```

An error goes to stderr as one line, with stdout empty, and the command exits with a fixed code: `4`
log in, `5` the profile may not do this, `6` chat or message not found, `8` a limit, `9` Telegram did
not answer in time, `14` unknown whether a message went. `tg commands --json` is the whole command
tree. A partial read or download can exit `0`: check `complete` in the JSON.

More: [CLI contract](https://github.com/WireCatLabs/tg-cli/blob/main/docs/cli-contract.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/cli-contract) · [every command and exit code](https://github.com/WireCatLabs/tg-cli/blob/main/docs/commands.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/commands)

## Settings and permissions

```sh
tg personal config set permissions.messages readonly  # no change to messages from this profile
tg personal config set permissions.messages.send ask  # a question in the terminal before each send
tg personal config set sends_per_hour 10              # at most 10 sends an hour (30 by default)
tg personal recipients add "Book club"                # the first add turns the recipient list on
tg personal sends list                                # every attempt: sent, refused, failed or not known
tg personal config show                               # what is set, and where it came from
```

More: [permissions](https://github.com/WireCatLabs/tg-cli/blob/main/docs/permissions.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/permissions) · [configuration](https://github.com/WireCatLabs/tg-cli/blob/main/docs/configuration.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/configuration)

## Limits

Each profile has one request pace, shared by every command, background job and server at once, so
bulk work stays under Telegram's limits. Short waits from Telegram are waited out; a long wait stops
the run instead of being repeated.

More: [limits and waits](https://github.com/WireCatLabs/tg-cli/blob/main/docs/limits.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/limits)

## Security

- The session file is as good as your password, readable only by your user; the app keys are in the
  system keyring. No command takes a password, a login code or a phone number as an argument.
- The local store holds the full text of what was read, unencrypted and readable only by your user.
  It stays after logout; only whole-disk encryption protects it from a stolen disk.
- Every send, from a command or over MCP, passes the profile's limits and is written to a journal —
  without its text. `--file` refuses credential files, CLI folders and the local store.
- Control characters in names, titles and messages are shown as text, so other people's text cannot
  control your terminal.
- The limits stop an agent talked into sending by a message it read, not one that sets out to get
  round them: for that, run the agent in a sandbox or as a separate user.

To report a vulnerability: [SECURITY.md](https://github.com/WireCatLabs/tg-cli/blob/main/SECURITY.md).

More: [security](https://github.com/WireCatLabs/tg-cli/blob/main/docs/security.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/security)

## When something goes wrong

```sh
tg personal doctor         # where the files are and whether a session is saved, without connecting
tg personal doctor --online  # check that the login works
tg personal chats list --trace  # each request to Telegram, with no text, names, phone numbers or keys
tg personal runs list      # recorded runs
```

More: [troubleshooting by symptom](https://github.com/WireCatLabs/tg-cli/blob/main/docs/troubleshooting.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/troubleshooting) · [diagnostics](https://github.com/WireCatLabs/tg-cli/blob/main/docs/diagnostics.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/diagnostics)

## How it differs

Telegram's own apps are made for a person; `tg` is made for a script and an agent. A Telegram bot sees
only the chats it was added to and speaks as the bot; `tg` is you, in your chats. Other open tools
connect a Telegram account to an agent too: tgcli, telegram-mcp and tdl.

More: [compared with other tools](https://github.com/WireCatLabs/tg-cli/blob/main/docs/compare.md) · [on wirecat.dev](https://wirecat.dev/en/docs/tg/compare)

## Part of WireCat

[WireCat](https://wirecat.dev) is an open-source, local-first context layer for AI agents. `tg` is
where it starts; [max-cli](https://github.com/WireCatLabs/max-cli) brings the MAX messenger into the
same local store. Start with Telegram. Add more context when you need it. Your context. Any agent.

## Technical docs

Every page is on [wirecat.dev/en/docs/tg](https://wirecat.dev/en/docs/tg) and in
[`docs/`](https://github.com/WireCatLabs/tg-cli/tree/main/docs):

| Page | Answers |
|---|---|
| [index](https://github.com/WireCatLabs/tg-cli/blob/main/docs/index.md) · [web](https://wirecat.dev/en/docs/tg) | The docs site's start page: what `tg` is, the first minute, where to go next |
| [installation](https://github.com/WireCatLabs/tg-cli/blob/main/docs/installation.md) · [web](https://wirecat.dev/en/docs/tg/installation) | How do I install it, what does it need, where do its files go, how do I upgrade or remove it? |
| [usage](https://github.com/WireCatLabs/tg-cli/blob/main/docs/usage.md) · [web](https://wirecat.dev/en/docs/tg/usage) | How do I log in, read, page, send, and use it from a script — in that order? |
| [sessions](https://github.com/WireCatLabs/tg-cli/blob/main/docs/sessions.md) · [web](https://wirecat.dev/en/docs/tg/sessions) | How does login work: QR or phone, the app from my.telegram.org, the keyring, profiles, logout? |
| [archive](https://github.com/WireCatLabs/tg-cli/blob/main/docs/archive.md) · [web](https://wirecat.dev/en/docs/tg/archive) | What does the local store keep, how do I fill it, search it, export it, keep it current and back it up? |
| [search](https://github.com/WireCatLabs/tg-cli/blob/main/docs/search.md) · [web](https://wirecat.dev/en/docs/tg/search) | How do I find a message by its words, sender, chat, date, file, link or tag, save a search and count? |
| [attachments](https://github.com/WireCatLabs/tg-cli/blob/main/docs/attachments.md) · [web](https://wirecat.dev/en/docs/tg/attachments) | Sending, downloading and reading files; text from documents and images, and searching it |
| [rankings](https://github.com/WireCatLabs/tg-cli/blob/main/docs/rankings.md) · [web](https://wirecat.dev/en/docs/tg/rankings) | Message and author rankings: metrics, scores, saved queries and evidence |
| [topic-search](https://github.com/WireCatLabs/tg-cli/blob/main/docs/topic-search.md) · [web](https://wirecat.dev/en/docs/tg/topic-search) | How do I find a discussion by what it was about, keep that current, and what leaves my computer? |
| [query-language](https://github.com/WireCatLabs/tg-cli/blob/main/docs/query-language.md) · [web](https://wirecat.dev/en/docs/tg/query-language) | Every search field, operator, preset, limit and the JSON answer |
| [groups](https://github.com/WireCatLabs/tg-cli/blob/main/docs/groups.md) · [web](https://wirecat.dev/en/docs/tg/groups) | How do I keep up with a group I run — open questions, newcomers, a weekly report? |
| [people](https://github.com/WireCatLabs/tg-cli/blob/main/docs/people.md) · [web](https://wirecat.dev/en/docs/tg/people) | One person: profile, what they said in each chat, does the account look like a bot |
| [bot](https://github.com/WireCatLabs/tg-cli/blob/main/docs/bot.md) · [web](https://wirecat.dev/en/docs/tg/bot) | A bot through the Bot API: token, recipients, messages, admins and every Bot API method |
| [replies](https://github.com/WireCatLabs/tg-cli/blob/main/docs/replies.md) · [web](https://wirecat.dev/en/docs/tg/replies) | Answer messages by your rules, to everyone or only the people you choose |
| [mcp](https://github.com/WireCatLabs/tg-cli/blob/main/docs/mcp.md) · [web](https://wirecat.dev/en/docs/tg/mcp) | How do I connect Claude Desktop, Cursor or another client without a terminal? |
| [remote](https://github.com/WireCatLabs/tg-cli/blob/main/docs/remote.md) · [web](https://wirecat.dev/en/docs/tg/remote) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes](https://github.com/WireCatLabs/tg-cli/blob/main/docs/recipes.md) · [web](https://wirecat.dev/en/docs/tg/recipes) | What can an agent do for me every day, and how do I run it on a schedule? |
| [compare](https://github.com/WireCatLabs/tg-cli/blob/main/docs/compare.md) · [web](https://wirecat.dev/en/docs/tg/compare) | How does tg compare with tgcli, telegram-mcp and tdl, and when does another tool fit better? |
| [commands](https://github.com/WireCatLabs/tg-cli/blob/main/docs/commands.md) · [web](https://wirecat.dev/en/docs/tg/commands) | Every command, option and exit code — **generated** from the program |
| [configuration](https://github.com/WireCatLabs/tg-cli/blob/main/docs/configuration.md) · [web](https://wirecat.dev/en/docs/tg/configuration) | How do I configure common behavior? |
| [permissions](https://github.com/WireCatLabs/tg-cli/blob/main/docs/permissions.md) · [web](https://wirecat.dev/en/docs/tg/permissions) | What a profile may read, what asks first, and what may go ahead |
| [profiles](https://github.com/WireCatLabs/tg-cli/blob/main/docs/profiles.md) · [web](https://wirecat.dev/en/docs/tg/profiles) | Several accounts and bots on one computer, and how a command picks one |
| [configuration-reference](https://github.com/WireCatLabs/tg-cli/blob/main/docs/configuration-reference.md) · [web](https://wirecat.dev/en/docs/tg/configuration-reference) | Every key, type, default, scope and variable |
| [cli-contract](https://github.com/WireCatLabs/tg-cli/blob/main/docs/cli-contract.md) · [web](https://wirecat.dev/en/docs/tg/cli-contract) | Invocation, output, errors, headless runs, bounds and previews |
| [limits](https://github.com/WireCatLabs/tg-cli/blob/main/docs/limits.md) · [web](https://wirecat.dev/en/docs/tg/limits) | Limits, waits and background jobs |
| [diagnostics](https://github.com/WireCatLabs/tg-cli/blob/main/docs/diagnostics.md) · [web](https://wirecat.dev/en/docs/tg/diagnostics) | What did a command do, and what is never recorded? |
| [troubleshooting](https://github.com/WireCatLabs/tg-cli/blob/main/docs/troubleshooting.md) · [web](https://wirecat.dev/en/docs/tg/troubleshooting) | Something does not work: what the screen says, and what to do |
| [security](https://github.com/WireCatLabs/tg-cli/blob/main/docs/security.md) · [web](https://wirecat.dev/en/docs/tg/security) | What reaches the disk, what never does, and what stops a send going to the wrong place? |
| [roadmap](https://github.com/WireCatLabs/tg-cli/blob/main/docs/roadmap.md) · [web](https://wirecat.dev/en/docs/tg/roadmap) | What is coming next? |

What each version changed: [CHANGELOG.md](https://github.com/WireCatLabs/tg-cli/blob/main/CHANGELOG.md).

## Development

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build && pnpm smoke:bun  # the built command under Bun
pnpm generate                 # rewrites docs/commands.md from the command tree
bin/tg session start          # everything under .tg/ in this checkout, never the real profile
```

Everything that is not specific to Telegram — the commands, the store, the send guard, the MCP
server — lives in [cli-core](https://github.com/WireCatLabs/cli-core), shared with
[max-cli](https://github.com/WireCatLabs/max-cli). Telegram-specific code lives only in `src/telegram/`.

More: [ARCHITECTURE](https://github.com/WireCatLabs/tg-cli/blob/main/docs/dev/ARCHITECTURE.md) ·
[TESTING](https://github.com/WireCatLabs/tg-cli/blob/main/docs/dev/TESTING.md)

## Contributing

Pull requests, bug reports and ideas are welcome in
[issues](https://github.com/WireCatLabs/tg-cli/issues).

Custom automation with Telegram, other messengers and AI agents: [info@neirox.ai](mailto:info@neirox.ai).

## License

Apache License 2.0 — see [LICENSE](https://github.com/WireCatLabs/tg-cli/blob/main/LICENSE).
