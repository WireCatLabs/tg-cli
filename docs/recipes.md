# Recipes: an agent and your Telegram

How to hand Claude Code or Codex regular work with your Telegram: a morning summary, a report on a
chat, who owes what, what you have not answered. Each recipe gives the request to the agent, what it
is allowed to run, and how to run it on a schedule.

## Once, first

1. `tg` is installed and logged in: [installation.md](installation.md), [sessions.md](sessions.md).
2. The agent knows how to use `tg`. Give it the skill file:

   ```sh
   # Claude Code
   mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md
   # Codex and Gemini CLI
   mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md
   ```

3. Save the requests below in files, for example in `~/tg-recipes/`. The schedule commands read the
   request from a file.

Claude Desktop, Cursor and other clients without a terminal need no skill file. Connect the MCP
server (`tg mcp config` prints the entry for their settings) and use its ready prompts: `catch-up`,
`review`, `reply`, `find` ([mcp.md](mcp.md#prompts-and-chats-by-)).

## What the agent may do

An agent on a schedule works without you, so the limits go into settings, not into the request. An
agent can misread "send nothing"; it cannot get around a setting it is not allowed to change.

**Limit what the agent may run.** Claude Code in `-p` mode runs only the commands in
`--allowedTools`. With no `tg messages send` in the list, the agent cannot call it:

```sh
claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
```

**Limit what the profile may do.** This holds for any agent:

```sh
tg config set permissions.messages readonly    # no sends, edits or deletions
tg config set permissions.messages.send ask    # or: a yes or no before each send
tg config set sendsPerHour 5                   # or: at most five sends an hour
tg recipients add "Book club"                  # and only to the chats on this list
```

`permissions` limits your own commands too, until you change it back:
`tg config unset permissions.messages`. To limit only the agent, give it a profile of its own. Every
attempt to send, refused ones included, is in `tg sends list`. The limits are described in
[security.md](security.md#the-send-guard).

**Reading gives nothing away.** No command in the recipes below marks anything read: nobody sees that
the agent opened a chat.

## Running on a schedule

- **Claude Desktop scheduled tasks** run on your computer, so they have `tg` and your login. See
  [Claude's documentation](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron and `claude -p`**, on any computer that is on at that time:

  ```cron
  30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)" >> ~/tg-recipes/morning.log 2>&1
  ```

  cron starts jobs with an almost empty environment, which breaks `tg` on Linux in two ways:

  - **`node: not found`, exit code 127.** Node from nvm, fnm or Volta is not on the system `PATH`,
    and cron knows only that one.
  - **"no Telegram app credentials found … although it has logged in on this machine", exit code 4.**
    `tg` cannot reach the keyring. **Do not log in again**: the login is fine, the environment is not.

  Put both lines at the top of `crontab -e`, with your values. The folder is `dirname "$(which node)"`,
  the number is `id -u`:

  ```cron
  PATH=/home/you/.nvm/versions/node/v24.0.0/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

  The keyring is open while you are logged in to the computer. Run the first one by hand and read the
  log. About `-p` mode: [Claude's documentation](https://code.claude.com/docs/en/headless).
- **Inside an open Claude Code session**: `/loop`, or "remind me at 15:00". It works while the
  session is open ([Claude's documentation](https://code.claude.com/docs/en/scheduled-tasks)).

Claude's cloud routines do not fit: they run elsewhere, where there is no `tg` and no login of yours.

## Morning summary

Writes to Telegram: **no**. Allow: `Bash(tg inbox:*)`.

> Run `tg inbox --new --json`. Group the messages by chat. For each chat, one line: who writes and
> what they want. Put first what needs an answer today. Fold adverts and service notifications into
> one line at the end.

`--new` shows each message once: `tg` remembers where it stopped, and the next run starts there. The
very first run looks back 24 hours.

## Weekly report on a chat

Writes to Telegram: **no**. Allow: `Bash(tg messages list:*)`.

> Read the last 7 days of the chat "Book club": `tg messages list "Book club" --after 7d --limit 200
> --json`. If the answer says `"hasMore": true`, read on. Write a report: what was decided, who took
> on what and by when, which questions are still open. Give each point its date and author.

## Who owes what

Writes to Telegram: **no**. Allow: `Bash(tg review:*)`, `Bash(tg messages context:*)`,
`Bash(tg messages search:*)`.

> Run `tg review --since <where the last review ended> --json` (without `--since`, the last 3 days).
> Sort it into three lists: what I owe, what I wait for from others, what needs clarifying. Give each
> point its chat, date and the message ids it rests on; a deadline only if one was named. Before you
> call something overdue, check whether it was done later. At the end, say which `--since` the next
> review starts from, and list the open points.

The next review is the same request plus the open points from the last one. In an MCP client it is
the `review` prompt.

## What you have not answered

The shortest form is `tg review --since 7d --unanswered --json`: questions nobody answered — to you
in one-to-one chats, to you or to the admins in groups. The recipe below is wider: it also catches
requests without a question mark.

Writes to Telegram: **no**. Allow: `Bash(tg chats list:*)`, `Bash(tg messages list:*)`.

> Run `tg chats list --kind dialog --limit 30 --json`. For every chat whose last message is from the
> last 7 days, read `tg messages list <chat id> --limit 5 --json`. Show the chats where the last
> message is not mine and asks a question or makes a request: who, about what, and how many days ago.

## Find something that was said

Writes to Telegram: **no**. Allow: `Bash(tg messages search:*)`, `Bash(tg messages context:*)`.

> Search for "invoice" with `tg messages search invoice --json`. For each hit, read
> `tg messages context <locator> --json` and tell me who said what, and when.

Search reads only what this machine has kept. For a chat's whole history, fetch it first — that is a
request from your account, so do it yourself: `tg store fetch <chat>` ([store.md](store.md)).

## Draft a reply

Writes to Telegram: **only after your yes**. This one is for a conversation with the agent, not a
schedule.

> Read the last 20 messages of the chat with @example_user and suggest an answer to their last
> question. Do not send it — show me the text.

Once you agree, the agent sends it: `tg messages send @example_user "…"`. An agent without a terminal
connects with `tg mcp --confirm-send`: before each send you see the chat and the text and answer yes
or no ([mcp.md](mcp.md)).

## A group you run

Writes to Telegram: **no**. Allow: `Bash(tg review:*)`, `Bash(tg chats events:*)`,
`Bash(tg chats members list:*)`.

> Run `tg review --chat "Hiking" --unanswered 4 --json` and `tg chats events "Hiking" --since 7d
> --json`. Briefly: which questions wait for an answer, from whom and since when; who joined or was
> added this week, and by whom. Do not answer anyone — list what I should reply to.

Every scenario for a group: [groups.md](groups.md).

## Similar collections

Other people's recipes for Telegram and an agent. Their requests work with `tg` once the tools are
replaced by commands:

- [Telegram MCP: the complete guide](https://mcp.directory/blog/telegram-mcp-complete-guide-2026) —
  a morning pass over the inbox, draft replies, a channel digest, a search across several chats.
- [pioh/tg](https://github.com/pioh/tg) — Claude Code and Codex with a personal Telegram account: a
  digest every N minutes, "remind me if I have not answered mum in 15 minutes", watching people and
  chats.
- [Gorgias MCP cookbook](https://github.com/gorgias/mcp-cookbook) — recipes for customer support, but
  well made: each says whether it writes anything, and what to change for yourself.
