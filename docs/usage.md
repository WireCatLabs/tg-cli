# Using tg

From the first login to sending, in the order you will need it. Every command and option is in
[commands.md](commands.md); this page explains how they fit together.

Each command does one thing, prints its answer and exits. Only `tg watch`, `tg serve` and `tg mcp`
stay running, and each of them says so.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## The first minute

```sh
npm install -g @leemour/tg-cli
tg session start          # the app from my.telegram.org, then a QR code to scan
tg chats list --limit 5   # your newest chats
tg messages list me       # Saved Messages, the latest 20
```

Nothing more is needed to read.

## Log in

```sh
tg session start                        # QR code: Settings → Devices → Link Desktop Device
tg session start phone                  # phone number, the code Telegram sends, your 2FA password
tg session start --qr-file login.png    # the QR code as a picture, for an agent to show you
```

The first login also asks for your own Telegram app from my.telegram.org; `--app auto` fills in the
site for you. Both steps, and what is kept where: [sessions.md](sessions.md).

**No secret is ever an argument.** The app hash and the 2FA password are asked without showing what
you type; the login code and the phone number are asked, or read from stdin. An argument is visible
to every process on the machine in `ps`, and stays in your shell history.

For CI, `TG_API_ID` and `TG_API_HASH` give the app without the keyring; they win over it.

```sh
tg account show                # who this profile is logged in as
tg account sessions list       # every device and app logged in to the account; ends nothing
tg session end                 # log out on Telegram's side, and delete the session here
```

`session end` ends the session on Telegram's side too: the device disappears from the app's list.
To end a session from elsewhere, use the app: Settings → Devices.

## Profiles: the first word

Several accounts live side by side. The profile is the first word, not an option:

```sh
tg chats list             # profile "default"
tg work chats list        # profile "work"
export TG_PROFILE=work    # or for a whole shell session
```

**The first word is the profile whenever it is not a command.** So a profile cannot be called `chats`:
such a name is refused, with the reason. A name is letters, digits, dot, dash and underscore.

Each profile has its own session, its own app, its own settings and its own list of allowed
recipients. `TG_PROFILE_LOCK` pins a process to one profile, so an agent cannot pick one with fewer
limits ([sessions.md](sessions.md#profiles)).

## Naming a chat

Wherever a command takes `<chat>`, it accepts:

- a title, or part of one: `"Book club"`, `book`
- an id: `-1001234567890`
- a username: `@example_channel`
- `me` for Saved Messages

A title that fits more than one chat is an error that lists the candidates with their ids. `tg`
never guesses: a message sent to the wrong conversation cannot be taken back. Take the id and repeat
the command with it. An id never changes, so once you have it, use it.

`messages show` and `messages context` also take a `msg:` locator in place of the chat and the id,
as `messages search --json` prints it for each hit.

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
```

`--kind` is one of `dialog` (one-to-one), `group`, `channel` or `saved`. The filters look at the
newest 200 chats. Groups and channels have [their own section](#groups-and-channels).

### Messages

```sh
tg messages list "Book club"                    # the latest 20, oldest first
tg messages list "Book club" --limit 50
tg messages show "Book club" 4242               # one message
tg messages context "Book club" 4242            # it, and 5 messages either side
tg messages context "Book club" 4242 --before 2 --after 10
```

In `context`, the message you asked for is marked `◀` in the terminal and `"anchor": true` in JSON.

### What needs an answer

```sh
tg inbox                     # other people's unread messages, in every chat
tg inbox --since 2h          # everything that came in during the last two hours
tg inbox --new               # what arrived since the last --new — for scheduled runs
tg inbox --new --jsonl       # the same for a script: one message per line
```

`inbox` shows other people's messages, never yours, each with its chat. It leaves out muted and
archived chats unless a message mentions you or replies to you; `--all` takes them in. It says on
stderr how many it left out.

**`inbox --new` moves a saved point.** The next `--new` starts from where this one stopped, so each
message is shown once. The very first `--new` looks back 24 hours. `inbox` without `--new`, and
`inbox --since`, leave the point where it is. Plain `inbox` answers the same until the messages are
read in the app, since it marks nothing read.

One run reads at most 20 chats; the rest are named on stderr and in `skipped`, with the command that
reads one. In a chat with more than `--limit` messages waiting, the newest are shown, and stderr says
how to read the rest.

### Who owes what: `review`

```sh
tg review                                  # the last 3 days
tg review --since 2026-09-23T09:00         # from where the last review ended
tg review --chat "Book club" --json
```

Every message — yours and other people's — in every chat where something happened since `--since`.
It is for working out what you promised, what you are waiting for and what is still unclear; sorting
it is your job or an agent's. It marks nothing read.

The command ends with a line on stderr: from when to when it read. **Start the next review from
that `--since`**, and nothing falls between two reviews. When the review is incomplete — too many
chats at once, or a chat cut short to its newest 300 messages — it says so, and it is better not to
move the boundary. It reads at most 20 chats in one run.

#### Unanswered questions

```sh
tg review --unanswered                     # questions nobody answered in 24 hours
tg review --chat "Neighbours" --unanswered 4
```

`--unanswered [hours]` keeps only questions waiting for you or for a group's admins. A question is a
message with `?` in it (a link's `?` does not count), or a reply to you or to an admin. It is
answered when you or an admin replied to it, or were the next to speak after the person who asked.
Questions younger than the hours given (24 by default) are left out: nobody has had time to answer.
When a group's admins are not known, the command says so, and only your answers count.

### Voice messages

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model here
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
tg messages list "Book club" --transcribe        # every voice message shown that has no text yet
tg inbox --transcribe
```

Telegram transcribes for Premium accounts, and a few messages a week on the free trial. Without it,
a model on this machine does the work, and the recording never leaves the computer. A model is
downloaded once, and only when you ask:

```sh
tg models audio list                   # the models, which is downloaded, which is the default
tg models audio download parakeet-v3   # once, checked against the sha256 this version expects
```

| Model | Languages | Size |
|---|---|---|
| `parakeet-v3` — the default | 25: Bulgarian, Czech, Danish, German, Greek, English, Spanish, Estonian, Finnish, French, Croatian, Hungarian, Italian, Lithuanian, Latvian, Maltese, Dutch, Polish, Portuguese, Romanian, Russian, Slovak, Slovenian, Swedish, Ukrainian | 670 MB |
| `gigaam-v3` | Russian — the best of the three for Russian | 232 MB |
| `gigaam-v3-ctc` | Russian — a little faster, rougher with capital letters | 225 MB |

`--model` picks another model for one command; `transcribeWith` and `speechModel` in the settings
choose the defaults ([configuration.md](configuration.md)). A transcript is kept in the local store,
so asking again answers at once. `--transcribe` can take minutes.

### Files

```sh
tg messages download "Book club" 4242 --output ~/Downloads       # one message's files
tg messages download "Book club" --all --output ~/tg-files       # every file of the chat, newest first
```

Photos, files, videos and voice notes are saved; the folder is created if it is missing. A file
keeps its own name; one without a name gets the message id. **A download never overwrites a file.**
With `--all`, a name already taken gets the message's id in front. `--all` remembers where it stopped
in a small file beside the downloads, and the same command continues from there. Saved files are
readable only by you.

### People

```sh
tg contacts list                       # people you have a one-to-one chat with, newest first
tg contacts list --order name --search ann
tg contacts show @example_user         # their bio and the chats you share
tg contacts lookup                     # who has a phone number — asks for it, or reads it from stdin
tg contacts sync                       # your whole Telegram contact list into the local store
```

`contacts list` is the people you have a one-to-one chat with. `contacts sync` brings in the rest of
your Telegram contact list too. `contacts lookup` never takes the number as an argument: pipe it in,
or type it when asked.

### Pages

A list shows `limit` rows (20 by default). `chats list`, `contacts list`, `chats members list` and
`topics` take `--page` and `--all`:

```sh
tg contacts list --limit 5             # five a page
tg contacts list --limit 5 --page 2    # the sixth to the tenth
tg contacts list --all                 # every row, no paging
```

⚠ **A page number over a live list can repeat or skip a row.** The newest is on top, so a message
that arrives between page one and page two moves someone across the border.

**A chat's messages have no pages: they have `--before` and `--after`**, which page exactly:

```sh
tg messages list "Book club" --before 4242      # older than message 4242
tg messages list "Book club" --after 4242       # newer than 4242, oldest first
tg messages list "Book club" --after 2h         # what came in during the last two hours
tg messages list "Book club" --after 2026-09-20T09:00
```

In the terminal, the line that names the next page goes to stderr. A bare number is always a message
id. A time is ISO 8601, or "this long ago": `30m`, `2h`, `1d`. In `messages context`, `--before` and
`--after` are counts of messages instead: there the point is already the message.

### Find a chat, then write to it

```sh
tg chats list --search book --kind group     # groups with "book" in the title
tg contacts list --search ann                # people by name or @username
tg messages search "contract"                # the text of every message this machine has kept
tg messages search "contract" --chat "Book club"
tg messages search "invoice.*(march|april)" --regex
```

A search needs **at least three characters**. `messages search` looks for every word, as a word or
the start of one — `invoic` finds "invoice". It never connects to Telegram: it answers from what was
read, fetched or kept by `serve` ([store.md](store.md#search)). Once you have the chat, use its id.

## Sending

**Nothing sends unless you typed a command that sends**, and it asks no confirmation: the chat and
the text are already in the line you typed. Every send goes through the send guard: a read-only
profile, the profile's `allow` list, the list of allowed recipients and the hourly limit
([security.md](security.md#the-send-guard)). Every attempt is logged, never its text:
`tg sends list`.

```sh
tg messages send me "a note to myself"
tg messages send "Book club" "See you at 7" --silent       # no notification
tg messages send "Book club" "a link, no card" --no-preview
tg messages send "Book club" "**Bold** and _italic_" --md  # bold, italic, struck, code
```

`--md` reads bold (`**`), italic (`_`), struck (two tildes) and code (backticks), nothing else. A mark
counts only at a word's edge, so `file_name` stays as typed; `\` keeps a mark literal. Without it,
the text goes as typed. `messages edit` takes `--md` too.

### Text from stdin

Leave out the text and it is read from stdin. That is the only way to send several lines, and it
keeps the text out of `ps` and your shell history:

```sh
printf 'first line\n\nthird line' | tg messages send me
tg messages send "Book club" < note.txt
```

### Sending later

```sh
tg messages send "Book club" "Tomorrow" --at 2026-10-01T09:00   # local time
tg messages send "Book club" "In two hours" --at 2h             # or 30m, 1d from now
tg messages scheduled "Book club"                               # what waits to be sent there
```

`--at` hands the message to Telegram, which sends it even with this machine off. The time is rounded
down to the minute. Less than a minute from now, or more than a year, is refused. The guard counts a
scheduled message in the hour Telegram sends it. **Cancel or change one in the Telegram app**; `tg`
does not.

### Files and photos

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
```

`--photo` takes a `.jpg`, `.png` or `.webp`. Hidden files and folders, `~/.ssh`, `tg`'s own folders
and the local store are refused unless you add `--allow-any-file` — that is where keys and tokens
live.

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
tg messages forward "Book club" 4242 --to me --send-id <id from the error>
```

A forward and a poll carry one too. A repeat without it is a second message to a person. A message sent with `--at` is never repeated:
look in `tg messages scheduled <chat>` instead.

### Editing, forwarding, pinning, deleting

```sh
tg messages edit "Book club" 4242 "the corrected text"      # your own message; --md as in a send
tg messages forward "Book club" 4242 --to me                # checked against the chat it goes to
tg messages pin "Book club" 4242                            # quiet unless --notify
tg messages unpin "Book club" 4242
tg messages delete me 4242 4243 --allow-dangerous           # at most 10, for you only
tg messages delete me 4242 --allow-dangerous --for-everyone
```

An edit reaches people who may have read the old text already. A forward is a new message: it goes
through the same guard as a send, against the chat it goes to. A deletion cannot be undone, which is
why it needs `--allow-dangerous`. In a supergroup or a channel Telegram deletes only for everyone,
so there only `--for-everyone` works.

**What counts toward the hourly limit:** a message, a forward, an edit, a pin that notifies, and each
deleted message. A reaction and a quiet pin do not.

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

When you read a chat, reactions show under a message — `👍 3  🔥 1  (you: 🔥)`. A vote in a public poll
shows your name to everyone in the chat. Vote by the ids `polls show` prints, never by an answer's
position. `--multiple` lets people pick several answers.

### Marking a chat read

```sh
tg chats mark-read "Book club"               # up to the newest message
tg chats mark-read "Book club" --until 4242  # only up to this one
```

The other side sees that you read it. It goes through the guard as the action `read`, and does not
count toward the hourly limit.

### Not in tg yet

Voice notes and videos as such, several photos in one message, sending into a forum topic; managing
contacts, your profile and folders. They are on the [roadmap](../README.md#roadmap).

## Groups and channels

```sh
tg chats inspect https://t.me/+AbCdEf              # where an invite or public link leads; does not join
tg chats members list "Hiking" --all               # everyone, with their role and when last seen
tg chats events "Hiking"                           # who joined, left, was added or removed — 7 days
tg chats events "Hiking" --event join,leave --since 2026-09-01T00:00
tg topics list "Hiking"                            # a forum group's topics, newest activity first
tg topics search "Hiking" "gear"
tg review --chat "Hiking" --unanswered             # questions nobody answered
```

All of these only read. `events` reads the chat's service messages: who did what, and to whom. The
names are `join`, `leave`, `add`, `remove`, `create`, `title` and `pin`.

Creating a group, joining and leaving, members, admins, invite links and moderation rules are not in
`tg` yet ([roadmap](../README.md#roadmap)).

## For scripts and agents

**At a terminal `tg` prints a table; into a pipe, or with `--json`, it prints one JSON value on
stdout and nothing else** — no spinner, no tick, no warning. Notes, warnings and errors go to stderr
in every mode.

```sh
tg chats list --json | jq -r '.items[].id'
tg messages list me --jsonl | jq -r .text     # one message per line
```

- `--json`: one JSON value. **Every list is one object**, always the same shape:
  `{ "items": [...], "page": 1, "limit": 20, "hasMore": true }`. `--all` and `--offline` answer with
  the same object.
- A chat's messages have no page number: `{ "items": [...], "limit": 20, "hasMore": true }`.
- `--jsonl`: one object per line, no wrapper; whether there is more is said on stderr only.
- An error is `{ "error": { "code": "...", "message": "..." } }` on stderr, and stdout is empty, so a
  refusal can never be taken for an empty result.
- **Branch on the exit code, not on the text.** The text changes; the code does not. `0` worked, `2`
  bad input, `4` not logged in, `5` the profile may not do this, `6` not found, `7` not on the list of
  allowed recipients, `8` a limit (the hourly limit, or Telegram's own), `9` Telegram did not answer
  in time, `14` unknown whether a message went. The full table is in
  [commands.md](commands.md#exit-codes).
- **Ids are strings.** Never turn one into a number.
- `--quiet` turns notes off; a failure is still said. `-v` and `-vv` add detail to the table view.
- `--timeout 30s` bounds the whole command (`500ms`, `30s` or `2m`).
- `tg commands --json` is the whole command tree, with `mutates: true` on every command that changes
  something in Telegram.

```sh
if ! tg messages send "Book club" "See you at 7" --json > /dev/null; then
  case $? in
    14) echo "it may have gone — repeat only with the same --send-id" ;;
    4)  echo "run tg session start" ;;
  esac
fi
```

An agent with a terminal reads the skill file for the traps the help cannot explain:

```sh
mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # Claude Code
mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md   # Codex, Gemini CLI
```

An agent without one (Claude Desktop, Cursor) connects over MCP: [mcp.md](mcp.md).

## What a conversation looks like

`tg messages list` and `tg messages search` print a transcript at a terminal, not a table:

```text
10:05:12  Anna
          Shall we call on Thursday?

10:09:03  Boris
          ↳ Anna: Shall we call on Thursday?
          Thursday works.
          📎 photo
          edited 10:09:30
```

Times are local, and a line marks each new day. `↳` is what a message answers, `↪` whose message was
forwarded, `📎` an attachment. Control characters in a message or a name are shown as text, never run
by the terminal. `-v` adds the ids of the message, the sender and the chat; `-vv` everything known
about the message.

## New messages as they arrive

```sh
tg watch                           # new messages, until Ctrl-C or --timeout
tg watch --jsonl                   # one message per line, as messages list --jsonl
tg watch --jsonl | ./on-message.sh
tg watch --events --jsonl          # edits, deletions and reactions too
tg watch --jsonl --timeout 2m      # a timeout ends it normally, with exit code 0
```

With `--events` every line names its event: `message`, `edit`, `delete` or `reaction`. Without it,
the lines are bare messages. Telegram does not say in which chat a message was deleted in a private
chat or a small group, so such a line has no chat.

**`watch` starts from now.** What arrived while nothing was listening is not shown. To keep the local
store current, including what came in while this machine was off, use `serve`, in the background or
as a system service ([store.md](store.md#keeping-it-current-serve)):

```sh
tg server start           # serve in the background; answers once it listens
tg server status
tg server install         # a systemd user unit or a launchd agent; starts nothing
```

## What a command did

```sh
tg --trace chats list          # show each request on stderr, keep nothing
tg --record chats list         # keep it, show nothing
tg runs list                   # what was kept, newest first
```

A failed run is always kept. A record holds operations, ids, counts and durations — never a message,
a name, a chat title, a phone number or a key. In full: [diagnostics.md](diagnostics.md).

## The local store

Everything `tg` reads is kept on this machine, so that it can answer without the network:

```sh
tg chats list --offline                           # only from the store, never connect
tg store fetch "Project Alpha" --since 2026-01-01 --estimate   # how much a fetch would take
tg store fetch "Project Alpha" --background       # a chat's history, as a job
tg store export "Project Alpha" --format markdown > alpha.md
tg store backup ~/tg-store.db                     # a copy of the store, while it is in use
```

An ordinary command still asks Telegram. `--offline` is for when there is no network, or when
connecting is not wanted; a send with `--offline` is refused. Fetching, export, search, backup and
the service: [store.md](store.md).

## Settings, and what a profile may do

Settings live in an optional `config.json`, and every value is decided in one order: **option →
environment variable → the profile in the file → the file's defaults → built in**.

```sh
tg config show                                 # every setting, and where it came from
tg config set limit 50
tg work config set allow send,reaction         # profile "work" may only send and react
tg config set readOnly true                    # nothing changes in Telegram from this profile
tg config set sendsPerHour 10
```

`allow` names what a profile may do: `send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`,
and more. Leaving it out allows everything; a refusal is exit code `5`, before connecting, and the
error names the command that allows it. **The file has no field for a secret.** Every setting and
variable: [configuration.md](configuration.md).

## Next

- [store.md](store.md) — the local store: search, fetch a chat's history, export, backup
- [configuration.md](configuration.md) — settings, and what a profile may do
- [security.md](security.md) — what reaches the disk, and the send guard
- [recipes.md](recipes.md) — daily work for an agent
