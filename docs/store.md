# The local store

`tg` keeps what it reads in a local SQLite database: the **local store**. Search, export and
`--offline` answer from it without asking Telegram. This page covers what it keeps, how to fill it,
and how to keep it current.

## What it keeps

- **Every read.** The chats `chats list` saw, the messages `messages list`, `messages context` and
  `inbox` read, and the messages you sent.
- **What `serve` hears**: new messages, edits, deletions and reactions, while it runs
  ([below](#keeping-it-current-serve)). `watch` keeps what it prints, too.
- **What you fetch on purpose**: a chat's history with `tg store fetch`, your contact list with
  `tg contacts sync`.

It keeps the full text of every message it has seen. The file is readable by your user only, and it
is not encrypted ([security.md](security.md#what-reaches-the-disk)).

**It is one file for every account and every messenger CLI** built on the same library, such as
[max-cli](https://github.com/leemour/max-cli):

```text
~/.local/share/cli-messaging/messages.db       # Linux; MESSAGING_STORE moves it
```

`tg session end` logs out and leaves the store as it is.

## How much is kept

```sh
tg store status                  # per chat: messages stored, the oldest and newest, the stretches held completely
tg store status "Book club"      # one chat
```

A stretch "held completely" is a run of messages with no gap. Messages read here and there leave
gaps; `store fetch` closes them.

## Fetch a chat's history

```sh
tg store fetch "Book club" --estimate    # what a full fetch would still cost; asks Telegram nothing
tg store fetch "Book club"               # fetch it, newest to oldest
tg store fetch "Book club"               # run again to continue where it stopped
tg store fetch "Book club" --since 30d   # only back to 30 days ago
tg store fetch "Book club" --max 5000    # up to 5000 messages in this run
```

`store fetch` reads a chat's history page by page, newest first, and saves it. **It is resumable**:
after every page it records what it now holds, so a stop loses nothing. Ctrl-C, `--timeout`, the
`--max` cap, `--since` and a long wait from Telegram all stop it, and the next run skips what is
already held.

**Every page is a request from your account**, of up to 100 messages. A run stops after `--max`
messages (1000 by default), and `--pause` spaces the pages out (1 second by default; `500ms`, `30s`,
`2m`). A short wait asked by Telegram is sat out; one longer than five minutes stops the run, and
you run it again later. Look at `--estimate` first: it counts from what the store already holds and
sends no request.

### In the background

A long fetch can run as a job that outlives the command:

```sh
tg store fetch "Book club" --background     # prints the job id
tg store jobs list                          # background jobs, newest first
tg store jobs show                          # the newest job, and what the store now holds of its chat
tg store jobs show <job>
tg store jobs cancel <job>                  # stops after the current page; a later fetch resumes
```

## Search

```sh
tg messages search "invoice march"                  # every word, as a word or the start of one
tg messages search invoice --chat "Book club" --limit 50
tg messages search --regex 'inv(oice)?\s+\d+'       # a regular expression, case-insensitive
```

**Search reads only the store and never asks Telegram.** An empty answer means "not kept here", not
"never said". Read the chat first (`tg messages list <chat>`), or fetch its history.

Words match the start of a word, so `invoi` finds `invoice`. Every word must appear. Each result
carries a `msg:` locator that `messages show` and `messages context` accept:

```sh
tg messages context msg:telegram/<account>/<chat>/<id>
```

## Export

```sh
tg store export "Book club" --jsonl > book-club.jsonl       # one message per line, oldest first
tg store export "Book club" --json > book-club.json         # { "items": [...] }
tg store export "Book club" --format markdown > book-club.md   # a transcript: a heading per day, replies and forwards quoted
```

Export writes only what the store holds and never asks Telegram. Check `tg store status` first, and
fetch the history if you need all of it.

## Answering without connecting: `--offline`

```sh
tg --offline chats list
tg --offline messages list "Book club" --limit 50
tg --offline messages show "Book club" 4242
tg --offline messages context "Book club" 4242
tg --offline contacts list
```

`--offline` answers from the store and never connects: no login needed, no request made. The JSON is
the same as online, except that chats come newest first where Telegram puts pinned chats on top.

Before the profile has read anything, it fails with exit code `6`: "nothing recorded for profile … yet".
A command that has to talk to Telegram refuses `--offline`, and a send with `--offline` is always
refused.

## Keeping it current: `serve`

`tg serve` listens until stopped and saves every new message, edit, deletion and reaction. When it
starts, it first catches up on what arrived while it was down. One `serve` runs per profile; a
second one is refused. **Nothing starts it for you.**

`tg watch` is different: it prints new messages from now on, and does not catch up on what it missed.

### In the background

```sh
tg server start       # start serve in the background; answers once it listens
tg server status      # whether it runs, since when, who started it
tg server logs -n 50  # its latest log lines
tg server stop
tg server restart
```

### As a service

To keep it running across logins, install it as a user service: a systemd user unit on Linux, a
launchd agent on macOS.

```sh
tg server install      # writes ~/.config/systemd/user/tg-serve-<profile>.service; starts nothing
tg server start        # starts it — through the unit, now that there is one
tg server status
systemctl --user enable tg-serve-default    # only if it should start at every login
```

On macOS the agent goes into `~/Library/LaunchAgents/`.

- The unit runs the `node` and the `tg` that installed it. Install it again after moving either,
  for example after changing Node versions.
- It gets the profile and the `TG_*_DIR` and `MESSAGING_STORE` variables of the shell that ran
  `server install`, and nothing else.
- **Check it once after `server start`:** `tg server logs`. A service reads the app from the keyring.
  A keyring that stays locked until you log in will probably make it fail; the logs say why.
- `tg server uninstall` removes the unit. Stop it first.
- `tg upgrade` restarts a running server, so it does not keep running the old version.

## The store and other versions

The store's layout has a version. A newer `tg` or another CLI may upgrade the file; an older `tg`
keeps working with it as long as the change allows. When it does not, every command that opens the
store says:

```text
the message store was written by a newer version (schema N, needs at least M; this one speaks K) — upgrade this tool
```

Run `tg upgrade`. Nothing in the file is lost.

## Next

- [recipes.md](recipes.md) — search and export in an agent's daily work
- [security.md](security.md) — what the store means for the privacy of your messages
