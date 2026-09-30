# Using tg

From the first login to sending, in the order you will need it. Every command and option is in
[commands.md](commands.md); this page explains how they fit together.

## The first minute

```sh
npm install -g @leemour/tg-cli
tg session start          # the app from my.telegram.org, then a QR code to scan
tg chats list --limit 5   # your newest chats
tg messages list me       # Saved Messages, the latest 20
```

## Log in

```sh
tg session start          # QR code
tg session start phone    # phone number, code, 2FA password
```

The first login also asks for your own Telegram app. Both steps, and what is kept where:
[sessions.md](sessions.md).

## Profiles: the first word

```sh
tg chats list             # profile "default"
tg work chats list        # profile "work"
```

The first word is the profile whenever it is not a command. There is no `--profile` option;
`TG_PROFILE` does the same for a shell session ([sessions.md](sessions.md#profiles)).

## Naming a chat

Wherever a command takes `<chat>`, it accepts:

- a title, or part of one: `"Book club"`, `book`
- an id: `-1001234567890`
- a username: `@example_channel`
- `me` for Saved Messages

A title that fits more than one chat is an error that lists the candidates with their ids. `tg`
never guesses. Take the id and repeat the command with it.

A person (`<person>`, in `contacts show`) is an id, an `@username` or part of their name.

## Reading

**Reading marks nothing read.** No command below shows the other side that you looked. The one
command that does is `tg chats mark-read` ([below](#marking-a-chat-read)).

### Chats

```sh
tg chats list                              # newest first, archived chats included
tg chats list --unread --kind group        # only groups with unread messages
tg chats list --search book                # titles containing "book"; at least 3 characters
tg chats show "Book club"                  # kind, unread count, last message, who is in it
tg chats members list "Book club" --all    # everyone, with role and last seen
tg chats events "Book club" --since 7d     # who joined, left, was added or removed
tg chats inspect https://t.me/+AbCdEf      # where an invite link leads, without joining
tg topics list "Book club"                 # a forum group's topics
```

`--kind` is one of `dialog` (one-to-one), `group`, `channel` or `saved`. The filters look at the
newest 200 chats.

### Messages

```sh
tg messages list "Book club"                    # the latest 20, oldest first
tg messages list "Book club" --limit 50
tg messages list "Book club" --before 4242      # older than message 4242
tg messages list "Book club" --after 4242       # newer than 4242, oldest first
tg messages list "Book club" --after 2h         # what came in during the last two hours
tg messages show "Book club" 4242               # one message
tg messages context "Book club" 4242            # it, and 5 messages either side
```

A message's id is a string: pass it back unchanged. `messages search` answers with a `msg:` locator,
`msg:telegram/<account>/<chat>/<id>`, which `messages show` and `messages context` take in place of
the chat and the id.

### What needs an answer

```sh
tg inbox                     # other people's unread messages, in every chat
tg inbox --since 2h          # everything that came in during the last two hours
tg inbox --new               # what arrived since the last --new — for scheduled runs
tg review --since 3d         # every message, yours too, in chats that changed — who owes what
tg review --unanswered       # questions to you, or to a group's admins, nobody answered in 24 hours
```

`inbox` leaves out muted and archived chats unless a message mentions you or replies to you; `--all`
takes them in. It says on stderr how many it left out.

**`inbox --new` moves a saved point.** The next `--new` starts from where this one stopped, so each
message is shown once. The very first `--new` looks back 24 hours. `inbox` without `--new`, and
`inbox --since`, leave the point where it is.

`review` ends with where the next review should start; pass that to the next `--since`.

### Voice messages

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model on this machine
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
tg messages list "Book club" --transcribe        # hear every voice message not heard yet
tg models audio list                             # the speech models, and which is downloaded
tg models audio download <model>                 # once, before --local works
```

Telegram transcribes for Premium accounts, and a few messages a week on the free trial. A model on
this machine is downloaded only when you ask. `transcribeWith` and `speechModel` in the settings
choose the default ([configuration.md](configuration.md)).

### Files

```sh
tg messages download "Book club" 4242 --output ~/Downloads       # one message's file
tg messages download "Book club" --all --output ~/tg-files       # every file of the chat, newest first
```

A download never overwrites a file. `--all` resumes where it stopped when you run it again.

### People

```sh
tg contacts list                       # people you have a one-to-one chat with, newest first
tg contacts list --order name --search ann
tg contacts show @example_user         # their bio and the groups you share
tg contacts lookup                     # who has a phone number — asks for it, or reads it from stdin
tg contacts sync                       # your whole Telegram contact list into the local store
```

`contacts lookup` never takes the number as an argument: an argument shows up in `ps` and in your
shell history. Pipe it in, or type it when asked.

### Pages

A list shows `limit` rows (20 by default). The answer says whether there is more:

```json
{ "items": [], "page": 1, "limit": 20, "hasMore": true }
```

```sh
tg chats list --page 2        # the next 20
tg chats list --all           # every row, no paging
```

A chat's messages page by id instead: `--before <id>` for older, `--after <id>` for newer. Their answer
has no `page`: `{ "items": [], "limit": 20, "hasMore": true }`. A page number over a list that changes
while you read can repeat or skip a row; `--before` cannot.

## Sending

**Nothing sends unless you typed a command that sends.** Every send goes through the send guard:
a read-only profile, the profile's `allow` list, the list of allowed recipients and the hourly limit
([security.md](security.md#the-send-guard)). Every attempt is logged, never its text: `tg sends list`.

```sh
tg messages send me "a note to myself"
tg messages send "Book club" "See you at 7" --silent       # no notification
tg messages send "Book club" "**Bold** and _italic_" --md  # bold, italic, struck, code
tg messages send "Book club" "Tomorrow" --at 2026-10-01T09:00   # Telegram sends it then
tg messages send "Book club" --at 2h < note.txt            # two hours from now, text from a file
tg messages scheduled "Book club"                          # what waits to be sent there
```

`--md` reads bold (`**`), italic (`_`), struck (two tildes) and code (backticks), nothing else. A mark
counts only at a word's edge, so `file_name` stays as typed; `\` keeps a mark literal.

`--at` hands the message to Telegram, which sends it even with this machine off. Cancel a scheduled
message in the Telegram app.

### Text from stdin

Leave out the text and it is read from stdin. That is the only way to send several lines:

```sh
printf 'first line\n\nthird line' | tg messages send me
```

### Files and photos

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
```

Hidden files and folders, `~/.ssh`, `tg`'s own folders and the local store are refused unless you add
`--allow-any-file`.

### Replying

```sh
tg messages send "Book club" "Agreed" --reply-to 4242
```

A reply is a send, so every send option works with it.

### When the outcome is unknown

Exit code `14` means the connection broke after the message left: **it may have gone**. The error
carries a `--send-id`. Repeat with it, and Telegram drops the second copy:

```sh
tg messages send "Book club" "See you at 7" --send-id <id from the error>
```

A repeat without it is a second message to a person. A message sent with `--at` is never repeated:
look in `tg messages scheduled <chat>` instead.

### Editing, forwarding, pinning, deleting

```sh
tg messages edit "Book club" 4242 "the corrected text"      # your own message
tg messages forward "Book club" 4242 --to me                # checked against the chat it goes to
tg messages pin "Book club" 4242                            # quiet unless --notify
tg messages unpin "Book club" 4242
tg messages delete me 4242 4243 --allow-dangerous           # at most 10, for you only
tg messages delete me 4242 --allow-dangerous --for-everyone
```

An edit reaches people who may have read the old text already. A deletion cannot be undone, which
is why it needs `--allow-dangerous`. In a supergroup or a channel Telegram deletes only for everyone,
so there only `--for-everyone` works.

### Reactions and polls

```sh
tg reactions add "Book club" 4242 👍       # replaces the reaction you had
tg reactions remove "Book club" 4242
tg polls show "Book club" 4250             # the poll and its answer ids
tg polls vote "Book club" 4250 <answer id>
tg polls vote "Book club" 4250 --retract
tg polls create "Book club" "Which day?" Monday Tuesday --anonymous
tg polls close "Book club" 4250            # your own poll; it cannot be reopened
```

A vote in a public poll shows your name to everyone in the chat. Vote by the ids `polls show`
prints, never by an answer's position.

### Marking a chat read

```sh
tg chats mark-read "Book club"               # up to the newest message
tg chats mark-read "Book club" --until 4242  # only up to this one
```

The other side sees that you read it.

## For scripts and agents

**At a terminal `tg` prints a table; into a pipe, or with `--json`, it prints one JSON value on
stdout and nothing else.** Notes, warnings and errors go to stderr in every mode.

```sh
tg chats list --json | jq -r '.items[].id'
tg messages list me --jsonl | jq -r .text     # one message per line
```

- `--json`: one JSON value. A list is `{ "items": [...], "page": 1, "limit": 20, "hasMore": true }`.
- `--jsonl`: one object per line; whether there is more is said on stderr only.
- An error is `{ "error": { "code": "...", "message": "..." } }` on stderr, and stdout is empty.
- **Branch on the exit code, not on the text.** `0` worked, `2` bad input, `4` not logged in, `5` the
  profile may not do this, `6` not found, `7` not on the list of allowed recipients, `8` a limit
  (the hourly limit, or Telegram's own), `14` unknown whether a message went. The full table is in
  [commands.md](commands.md#exit-codes).
- **Ids are strings.** Never turn one into a number.
- `--quiet` turns notes off; a failure is still said. `-v` and `-vv` add detail to the table view.
- `--timeout 30s` bounds the whole command (`500ms`, `30s` or `2m`).
- `tg commands --json` is the whole command tree, with `mutates: true` on every command that changes
  something in Telegram.

An agent with a terminal reads the skill file for the traps the help cannot explain:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

An agent without one (Claude Desktop, Cursor) connects over MCP: [mcp.md](mcp.md).

## New messages as they arrive

```sh
tg watch                 # new messages, until Ctrl-C or --timeout
tg watch --events        # edits, deletions and reactions too
tg watch --jsonl --timeout 2m
```

`watch` starts from now. To keep the local store current, including what arrived while nothing was
listening, use `serve` ([store.md](store.md#keeping-it-current-serve)).

## Next

- [store.md](store.md) — the local store: search, fetch a chat's history, export
- [configuration.md](configuration.md) — settings, and what a profile may do
- [recipes.md](recipes.md) — daily work for an agent
