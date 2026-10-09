# Recipes: an agent and your Telegram

Use this page when you want your AI agent (for example Claude Code, Codex, Cursor or Gemini CLI) to
do regular work with your Telegram: a morning summary, a report on a chat, who owes what, what you
have not answered. Each recipe gives you a request to copy, the commands the agent may run, and
whether it writes anything to Telegram. At the end you can run the agent on a schedule, with limits
it cannot get around.

Terms on this page:

- **Agent** — an AI assistant that runs commands on your computer for you.
- **Skill** — a file that tells the agent how to use `tg`. `tg skill install` puts it where the agent
  looks for it.
- **MCP client** — an AI app without a terminal, such as Claude Desktop. It reaches `tg` through the
  MCP server `tg mcp` instead of running commands.
- **Headless mode** — the agent takes one request, does it and exits, with no conversation. Claude
  Code calls it `-p` mode; Codex calls it `codex exec`.
- **cron** — the scheduler built into Linux and macOS. It starts a command at set times.

## What the recipes do

| Recipe | Writes to Telegram | Fits a schedule |
|---|---|---|
| [Morning summary](#morning-summary) | no | yes |
| [Weekly report on a chat](#weekly-report-on-a-chat) | no | yes |
| [Who owes what](#who-owes-what) | no | yes |
| [What you have not answered](#what-you-have-not-answered) | no | yes |
| [Find something that was said](#find-something-that-was-said) | no | yes |
| [Draft a reply](#draft-a-reply) | only after your yes | no |
| [A group you run](#a-group-you-run) | only if the group's rules allow it | yes |

## Once, first

1. Install `tg` and log in: see [installation](installation.md) and
   [login and sessions](sessions.md).
2. Give the agent the skill:

   ```sh
   tg skill install
   ```

   The skill goes to the folders of Claude Code (`~/.claude/skills/tg-cli/`) and of Codex and Gemini
   CLI (`~/.agents/skills/tg-cli/`). `tg skill show` prints the same text, if your agent keeps skills
   somewhere else.
3. Save the requests below in files, for example in `~/tg-recipes/`. The schedule commands read the
   request from a file.

An MCP client needs no skill. Connect the MCP server (`tg mcp config` prints the entry for its
settings) and use its ready prompts: `catch-up`, `review`, `reply`, `find`. See
[the MCP server's prompts](mcp.md#prompts-and-chats-by-).

## What the agent may do

An agent on a schedule works without you, so put the limits into settings, not into the request. An
agent can misread "send nothing". It cannot get around a setting that it is not allowed to change.

**Limit what the agent may run.** This is a setting of the agent. For example, Claude Code in `-p`
mode runs only the commands in `--allowedTools`. With no `tg messages send` in the list, the agent
cannot call it:

```sh
claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
```

Codex has no such list. Its sandbox closes the network and file writes by default, and `tg` needs
both: it connects to Telegram and saves what it reads to its local copy. So Codex runs with
`--sandbox danger-full-access`, and the `tg` settings below limit sending.

**Limit what the profile may do.** This works for every agent:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg config set permissions.$key readonly
done
tg config show                       # check the permissions in force
tg config set sendsPerHour 5         # or: at most five sends an hour
tg recipients add "Book club"        # and only to the chats on this list
```

`readonly` on one resource does not cover the others: `messages` alone still lets the agent react,
vote or change chats. That is why the loop sets each resource. A more precise key, such as
`permissions.messages.send: allow`, wins over its resource: remove such keys if the profile must only
read.

`permissions` limits your own commands too, until you change it back:
`tg config unset permissions.messages`. To limit only the agent, give it a profile of its own. Every
attempt to send, refused ones included, is in `tg sends list`. See
[the send guard](security.md#the-send-guard) and
[what a profile may do](configuration-reference.md#what-a-profile-may-do).

**Reading gives nothing away.** No command in the recipes below marks anything read: nobody sees that
the agent opened a chat.

## Running on a schedule

- **Claude Desktop scheduled tasks.** The task runs on your computer, so it has `tg` and your login. A
  run missed while the computer slept runs once when it wakes. See
  [Claude's scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron and `claude -p`.** No app needed, on any computer that is on at that time:

  ```cron
  30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)" >> ~/tg-recipes/morning.log 2>&1
  ```

  cron starts jobs with an almost empty environment. On Linux this breaks `tg` in two ways:

  - **`node: not found`, exit code 127.** Node from nvm, fnm or Volta is not on the system `PATH`,
    and cron knows only that one.
  - **"no Telegram app credentials found … although it has logged in on this machine", exit code 4.**
    `tg` cannot reach the keyring (the system store for passwords). **Do not log in again**: the
    login is fine, the environment is not.

  Put both lines at the top of `crontab -e`, with your values. The folder is
  `dirname "$(which node)"`, the number is `id -u`:

  ```cron
  PATH=/home/you/.nvm/versions/node/v24.0.0/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

  The keyring is open while you are logged in to the computer. Run the first job by hand and read the
  log. See [Claude's headless mode](https://code.claude.com/docs/en/headless).

- **cron and `codex exec`.** The same for Codex:

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/tg-recipes/morning.md)" >> ~/tg-recipes/morning.log 2>&1
  ```

  See [Codex's non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).
- **Inside an open Claude Code session**: `/loop`, or "remind me at 15:00". It works while the
  session is open. See [Claude Code's scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks).

Claude's cloud routines do not fit: they run on another computer, where there is no `tg` and no login
of yours.

## Morning summary

Writes to Telegram: **no**. Allow: `Bash(tg inbox:*)`.

> Run `tg inbox --new --json`. Group the messages by chat. For each chat, one line: who writes and
> what they want. Put first what needs an answer today. Fold adverts and service notifications into
> one line at the end.

`--new` shows each message once. `tg` remembers where it stopped in each chat, and the next run
starts there. The first run looks back 24 hours.

### Since when is "new"

- `tg inbox` — unread, as Telegram counts it: what you have not opened on any device.
- `tg inbox --new` — since the last `--new` run. Only `tg` knows that point; nobody else sees it.
- `tg inbox --since-time 2d` — the last two days; the saved point stays where it was.

None of them marks anything read. To do that, add `--mark-read`, or turn on `catchUpMarksRead` in the
[settings](configuration.md). The other side then sees that you read it.

### Direct chats, groups and channels apart

`--kind` keeps only chats of that kind: `dialog` (one-to-one), `group`, `channel`. A news summary of
channels and a summary of your conversations can run apart, at different times. Each chat has its own
point, so one run never hides what the other has not shown yet.

```cron
30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
0 19 * * * claude -p "$(cat ~/tg-recipes/news.md)" --allowedTools "Bash(tg inbox:*)"
```

In `morning.md`, `tg inbox --new --kind dialog,group --json`; in `news.md`, `tg inbox --new --kind
channel --json` and a request to pick what matters. Without `--kind`, everything together.

## Weekly report on a chat

Writes to Telegram: **no**. Allow: `Bash(tg messages list:*)`.

> Read the last 7 days of the chat "Book club": `tg messages list "Book club" --after-time 7d --limit 200
> --json`. If the answer says `"hasMore": true`, read on. Write a report: what was decided, who took
> on what and by when, which questions are still open. Give each point its date and author.

## Who owes what

Writes to Telegram: **no**. Allow: `Bash(tg review:*)`, `Bash(tg messages context:*)`,
`Bash(tg search messages:*)`.

> Run `tg review --new --transcribe --json` (the first time, the last 3 days; then from the last
> `--new`, a point per chat). Sort it into three lists: what I owe, what I wait for from others, what
> needs clarifying. Give each point its chat, date and the message ids it rests on; a deadline only if
> one was named. Before you call something overdue, check whether it was done later or in a work
> group. If the answer says `"complete": false`, tell me what is missing. At the end, list the open
> points.

`--transcribe` turns voice messages into text first; it can take minutes. The next review is the same
request plus the open points from the last one: the agent checks them first. A chat not read whole
keeps its point and comes back. In an MCP client it is the `review` prompt.

## What you have not answered

The shortest form is `tg review --since-time 7d --unanswered --json`: questions nobody answered — to
you in one-to-one chats, to you or to the admins in groups. The recipe below is wider: it also catches
requests without a question mark.

Writes to Telegram: **no**. Allow: `Bash(tg chats list:*)`, `Bash(tg messages list:*)`.

> Run `tg chats list --kind dialog --limit 30 --json`. For every chat whose last message is from the
> last 7 days, read `tg messages list <chat id> --limit 5 --json`. Show the chats where the last
> message is not mine and asks a question or makes a request: who, about what, and how many days ago.

## Find something that was said

Writes to Telegram: **no**. Allow: `Bash(tg search messages:*)`, `Bash(tg messages context:*)`.

> Search for "invoice" with `tg search messages invoice --json`. For each hit, read
> `tg messages context <locator> --json` and tell me who said what, and when.

By default, search looks both in the copy on this computer and on Telegram's server. The local copy
holds only what `tg` has saved. To search a chat's whole history locally, fetch it first. That is a
request from your account, so do it yourself: `tg store fetch <chat>`. See
[fetching a chat's history](archive.md#fetch-a-chats-history).

## Draft a reply

Writes to Telegram: **only after your yes**. This one is for a conversation with the agent, not for a
schedule.

> Read the last 20 messages of the chat with @example_user and suggest an answer to their last
> question. Do not send it — show me the text.

Once you agree, the agent sends it: `tg messages send @example_user "…"`. An MCP client connects with
`tg mcp`. Leave `tg_write` unapproved in the client, and it asks you before each send. The profile's
permissions still limit what it may write. See [the MCP server](mcp.md).

## A group you run

Writes to Telegram: **only if the group's rules allow it**. Allow: `Bash(tg review:*)`,
`Bash(tg chats events:*)`, `Bash(tg chats members list:*)`, `Bash(tg chats moderate:*)`.

> Run `tg review --chat "Hiking" --unanswered 4h --json`, `tg chats events "Hiking" --since-time 7d
> --json` and `tg chats moderate "Hiking" --dry-run --json`. Briefly: which questions wait for an
> answer, from whom and since when; who joined or was added this week, and by whom; what the check
> found against the group's rules and what it suggests. Do not answer or remove anyone — list the
> commands that would do it if I agree.

With `--dry-run`, `chats moderate` only plans. Without it, it acts as far as the group's rules allow,
so leave `Bash(tg chats moderate:*)` out of the list if the agent must never act. Every scenario for a
group: [groups you run](groups.md).

## Similar collections

Other people's recipes for Telegram and an agent. Their requests work with `tg` once you replace the
tools with commands:

- [Telegram MCP: the complete guide](https://mcp.directory/blog/telegram-mcp-complete-guide-2026) —
  a morning pass over the inbox, draft replies, a channel digest, a search across several chats.
- [pioh/tg](https://github.com/pioh/tg) — an AI agent with a personal Telegram account: a digest
  every N minutes, "remind me if I have not answered mum in 15 minutes", watching people and chats.
- [Gorgias MCP cookbook](https://github.com/gorgias/mcp-cookbook) — recipes for customer support, but
  well made: each says whether it writes anything, and what to change for yourself.
