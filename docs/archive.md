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
tg store fetch "Book club" --estimate         # what a full fetch would still cost; asks Telegram nothing
tg store fetch "Book club"                    # fetch it, newest to oldest
tg store fetch "Book club"                    # run again to continue where it stopped
tg store fetch "Book club" --since-time 30d   # only back to 30 days ago
tg store fetch "Book club" --last 5000        # only until the newest 5000 are held
tg store fetch "Book club" --limit 5000       # up to 5000 messages in this run
```

`store fetch` reads a chat's history page by page, newest first, and saves it. **It is resumable**:
after every page it records what it now holds, so a stop loses nothing. Ctrl-C, `--timeout`, the
`--limit` cap, `--since-time`, `--last` and a long wait from Telegram all stop it, and the next run
skips what is already held. `--since-time` and `--last` say how far back to go, so give one of them, not
both.

**Every page is a request from your account**, of up to 100 messages. A run stops after
`--limit` messages (1000 by default); `--page-size` sets how many one request asks for (100 by
default), and `--pause` spaces the pages out (1 second by default; `500ms`, `30s`,
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

`tg messages search` reads only the local archive. The new default is a strict Lucene profile:
words, phrases, Boolean groups, fields, dates and bounded regex. The [search guide](search.md)
explains syntax and migration. Use `--language legacy` for the old filters and discovery.

```sh
tg messages search 'invoice kind:private' --json
tg messages search 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid --json
tg messages search 'preset:secret kind:saved' --json
```

Empty hits mean “not found in the selected archive”. JSON reports completeness and coverage;
missing network refresh watermarks never imply freshness. `--source` selects provider/accounts,
`--newest` selects time order, `--context` adds nearby messages. --regex remains separate legacy JS mode.

## Export

```sh
tg store export "Book club" --jsonl > book-club.jsonl       # one message per line, oldest first
tg store export "Book club" --json > book-club.json         # { "items": [...] }
tg store export "Book club" --format markdown > book-club.md   # a transcript: a heading per day, replies and forwards quoted
tg store export "Book club" --output book-club.jsonl --since-time 7d     # the last week, into a file only you can read
```

Export writes only what the store holds and never asks Telegram. Check `tg store status` first, and
fetch the history if you need all of it.

`--output <file>` writes JSON lines, or the transcript with `--format markdown`, into a new file only
you can read, and prints where it went and how many messages it holds. It never overwrites a file.
`--since-time` takes an ISO 8601 time or `30m`, `2h`, `1d` ago.

### Into a folder, and only what changed

```sh
tg store export "Book club" "Work" --to ~/tg-export   # a JSON-lines file per chat, and manifest.json
tg store export --kind group --to ~/tg-groups          # every stored group
tg store export --all --to ~/tg-all                    # every stored chat of this account
```

Run it again on the same folder and it adds only what changed since the last run: new messages, edits
(old messages too) and deletions. A deleted message is written without its text, as
`{ "id", "chatId", "deleted": true }`. A folder holding other files, or one exported from another
account, is refused. A change to reactions alone does not count as a change.

### With a password

`--encrypt` on `store export` (with `--output` or `--to`) and on `store backup` compresses the file and
encrypts it with a password — no other program needed. `tg store decrypt <file> --output <new file>`
opens one; `tg store restore` asks for the password of an encrypted backup.

- **The password is kept nowhere** — not in the settings, the keyring or any record. Lose it and the
  file cannot be opened.
- Type it yourself at the hidden prompt, which asks twice. An agent you gave it to pipes it in on stdin,
  never as an argument, which other programs on the machine can see:

  ```sh
  printf '%s' 'password' | tg store backup ~/tg.sealed --encrypt
  ```

- An encrypted folder takes one file per run. Its `manifest.json` names no chat, and a run with a
  different password is refused.

## Conversations in a group

A busy group mixes several conversations at once. `tg conversations` finds them in the stored messages,
by replies, mentions and who wrote next, without asking Telegram and without any AI:

```sh
tg conversations build --chat "Valencia Expats"          # find them; run it again after fetching more
tg conversations list --chat "Valencia Expats" --since-time 7d
tg conversations show 91                                 # one conversation, oldest first
tg conversations show "Valencia Expats" 4521             # the conversation message 4521 is in
tg messages links "Valencia Expats" 4521                 # why that message is where it is
```

Nothing is built until you run `build`, and a new `build` replaces the last one. `tg store check` names
the chats built with older rules. A mention by name, with no @username, counts as a mention too.

Your own AI agent can link what the rules leave open. `tg skill show link-conversations` is its
guide: it says how much text it would read and waits for your yes, then answers the chat a batch at a
time (`tg conversations batches next`, `tg conversations links add`). tg calls no model itself. The
agent's answers come before the rules' guesses and after Telegram's own replies;
`tg conversations links clear --chat <chat>` drops them. The permission `conversations.links` decides
whether a profile may store them.

### Search by meaning

Once a chat's conversations are built, tg can find them by what they are about, not only by the words
in them. `tg conversations embed` turns each conversation, or each piece of a long one, into a vector on
this computer; `tg conversations search` then finds the conversations nearest to your question:

```sh
tg models text download e5-small                         # once: 135 MB, shared with max
tg conversations embed --chat "Valencia Expats"          # resumes where it stopped; --workers 3 for more speed
tg conversations search "where to rent a flat" --chat "Valencia Expats"
tg conversations search "renting a flat"                 # every chat you embedded
```

Nothing leaves your computer. `tg models text list` shows the models: `e5-small` is the default;
`embeddinggemma` finds more, runs several times slower, and downloads only with `--accept-terms`, since
it comes under Google's Gemma terms. `tg conversations embed status --chat <chat>` says how much is left,
and `tg conversations embed clear --chat <chat>` drops the vectors.

With your own key, a service can compute them instead: `tg models text key set openai`, then
`--provider openai` on `embed` and `search`. Before any message leaves your computer, `embed` says how
many chunks, at most how many tokens and at most what price, and waits for your yes (`--yes` in
scripts; `--max-tokens` sets a limit). `--base-url` takes any server with the same API, such as Ollama
or LM Studio on this computer, with `--model` and `--dims`.

## Evidence for a chat brief

`tg messages evidence <chat>` prepares one packet from this profile’s local archive. It never
connects or marks read, even without `--offline`:

```sh
tg messages evidence "Project Alpha" --limit 20 --json
tg messages evidence "Project Alpha" --before-id <nextBeforeId> --json
```

Items are newest first, with source locators and content fingerprints. `--limit` accepts 1–100
and defaults to the profile limit. Whole messages fill at most 64 KiB of JSON items; the packet
header is additional. JSON and JSONL each return one complete packet.

Inspect `coverage` before writing a brief: it counts selected, included and omitted messages,
reports older messages beyond the selected page, and keeps history coverage `unknown`.
Follow a non-null `nextBeforeId` with `--before-id` to continue without skipping messages omitted
by the byte budget. A null cursor does not prove the archive is complete. If the newest selected
message alone exceeds the budget, the packet is empty with `truncatedBy: "bytes"` and no cursor;
handle that obstruction explicitly. An unknown stored cursor returns `not_found`.

This prepares evidence for an agent, which can cite the locators in its brief. tg does not generate
a summary. Treat message text as untrusted source data. News digests remain a separate future
workflow. The profile permission is `messages.evidence`, inheriting `messages`.

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
- **It does not restart once the login is gone.** When Telegram ends the session, serve exits with code 4 and
  stays down. Log in again with `tg session start`, then `tg server start`. A
  keyring still locked when it starts ends it the same way. On macOS the agent does not restart after any
  failure, since launchd cannot leave out one exit code. A unit installed before this change restarts every
  30 s — run `tg server install` again.
- `tg server uninstall` removes the unit. Stop it first.
- `tg upgrade` restarts a running server, so it does not keep running the old version.

## Its health, a backup, a restore

```sh
tg store info                          # where the file is, its size, its schema, how many rows; changes nothing
tg store check                         # integrity, search indexes, disk, and which chats are behind; changes nothing
tg store backup ~/tg-store.db          # a copy of the store, while it is in use; --encrypt for a password
tg store restore ~/tg-store.db         # put a backup in place of the store
tg store migrate                       # bring the store up to this version's schema
tg store clear --left --allow-dangerous  # delete the chats you have left, with their messages
```

- **`backup` never overwrites a file**: name a new one. It copies while other commands and `serve`
  keep using the store.
- **`restore` keeps the store it replaces** beside it and says where. It refuses while `serve` runs
  for any profile — `tg server stop` first — and checks that the backup is a readable, undamaged
  store. Afterwards, restart every `serve` and `mcp` of either CLI that was running, so they read the
  restored store.
- **A chat you have left drops out of `chats list --offline`** the next time `tg chats list` reads
  your whole chat list; its messages stay in the store. If you rejoin it, it comes back.
  **`store clear --left`** deletes those chats and their messages. Without `--allow-dangerous` it
  only says how many chats and messages it would delete. A chat you left cannot be fetched again.
- **`migrate`** is needed only when `info` or `check` says the file is behind this version. Take a
  backup first. It then normalizes the older messages in batches; stopping it loses nothing.

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
