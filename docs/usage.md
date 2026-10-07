# Using tg

From the first login to sending, in the order you will need it. Every command and option is in
[commands.md](commands.md); this page explains how they fit together.

Each command does one thing, prints its answer and exits. Only `tg watch`, `tg serve` and `tg mcp`
stay running, and each of them says so.

```sh
tg [profile] [options] <resource> <action> [arguments]
```

## Get started

```sh
npm install -g @leemour/tg-cli
tg setup                  # guided app registration, login and agent skill
tg chats list --limit 5   # your newest chats
tg messages list me       # Saved Messages, the latest 20
```

Allow about five minutes for setup. History downloads are separate: choose a chat and an amount
before `tg store fetch <chat> --last 100`. An agent can read `tg skill show` without logging in;
use `tg setup --agent codex` to select its skill explicitly. `tg setup --help` explains the flags.
Nothing more is needed to read.

To discover the arguments for a task, use `tg commands messages search --json` for one command
or `tg commands messages --json` for a group. Both include global options and exit codes.
Inspect each command path in a separate call; `tg commands --json` returns the whole tree.

## Log in

`tg setup` is the first-run command. It defaults to automatic app registration and QR login;
`--app browser` and `--method phone` choose the alternatives. For login alone, or to finish an
interrupted or expired login, use:

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
tg account show                # who this profile is logged in as; the phone as its last four digits
tg account show --show-phone   # the whole phone number
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

**Reading marks nothing read.** No command below shows the other side that you looked. Only
`tg chats mark-read` and `tg messages list --mark-read` do ([below](#marking-a-chat-read)).

### Chats

```sh
tg chats list                              # newest first, archived chats included
tg chats list --unread --kind group        # only groups with unread messages
tg chats list --search book                # titles containing "book"; at least 3 characters
tg chats show "Book club"                  # kind, unread count, last message, who is in it
```

`--kind` is one of `dialog` (one-to-one), `group`, `channel` or `saved`. The filters look at
every returned chat. Groups and channels have [their own section](#groups-and-channels).

### Message links

`tg messages link <chat> <message>` or `tg messages link <msg:locator>` returns
`{ locator, url, access, reason }`. Channel and supergroup permalinks can be public or restricted;
a link grants no membership. Dialogs, basic groups and Saved Messages return a locator. Offline
validates the stored target and returns no permalink. A locator for another account is refused.
This singular command differs from `messages links`, which explains conversation relationships.

### Messages

```sh
tg messages list "Book club"                    # the latest 20, oldest first
tg messages list "Book club" --limit 50
tg messages show "Book club" 4242               # one message
tg messages context "Book club" 4242            # it, and 5 messages either side
tg messages context "Book club" 4242 --before-n 2 --after-n 10
```

In `context`, the message you asked for is marked `◀` in the terminal and `"anchor": true` in JSON.

### What needs an answer

```sh
tg inbox                     # other people's unread messages, in every chat
tg inbox --since-time 2h     # everything that came in during the last two hours
tg inbox --new               # what arrived since the last --new — for scheduled runs
tg inbox --new --jsonl       # the same for a script: one message per line
```

`inbox` shows other people's messages, never yours, each with its chat. It leaves out muted and
archived chats unless a message mentions you or replies to you; `--all` takes them in. It says on
stderr how many it left out.

**`inbox --new` moves a saved point.** The next `--new` starts from where this one stopped, so each
message is shown once. The first `--new` looks back 24 hours. `inbox` without `--new`, and
`inbox --since-time`, leave the point where it is. Plain `inbox` answers the same until the messages are
read in the app, since it marks nothing read.

One run reads at most 20 chats; the rest are named on stderr and in `skipped`, with the command that
reads one. In a chat with more than `--limit` messages waiting, the newest are shown, and stderr says
how to read the rest.

### Who owes what: `review`

```sh
tg review                                  # the last 3 days
tg review --since-time 2026-09-23T09:00    # from where the last review ended
tg review --chat "Book club" --json
```

Every message — yours and other people's — in every chat where something happened since `--since-time`.
It is for working out what you promised, what you are waiting for and what is still unclear; sorting
it is your job or an agent's. It marks nothing read.

The command ends with a line on stderr: from when to when it read. **Start the next review from
that `--since-time`**, and nothing falls between two reviews. When the review is incomplete — too many
chats at once, or a chat cut short to its newest 300 messages — it says so, and it is better not to
move the boundary. It reads at most 20 chats in one run.

#### Unanswered questions

```sh
tg review --unanswered                     # questions nobody answered in 24 hours
tg review --chat "Neighbours" --unanswered 4h
```

`--unanswered [hours]` keeps only questions waiting for you or for a group's admins. A question is a
message with `?` in it (a link's `?` does not count), or a reply to you or to an admin. It is
answered when you or an admin replied to it, or were the next to speak after the person who asked.
Questions younger than the hours given (24 by default) are left out: nobody has had time to answer.
When a group's admins are not known, the command says so, and only your answers count.

Retained voice transcripts participate in this filtering too. Add `--transcribe` to hear voices
without a retained transcript before selecting unanswered questions. Unrecognized voices keep the
review incomplete: an empty result does not prove there are no unanswered questions. Keep the
previous boundary until `complete` is true.

### Voice messages

```sh
tg messages transcribe "Book club" 4242          # by Telegram where it can, else a model here
tg messages transcribe "Book club" 4242 --local  # only the model on this machine
tg messages list "Book club" --transcribe        # every voice message shown that has no text yet
tg inbox --transcribe
tg review --transcribe
tg messages list "Book club" --transcribe --model gigaam-v3
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

`--model` picks another model for one command, beside `--transcribe` or in `messages transcribe`; `transcribeWith` and `speechModel` in the settings
choose the defaults ([configuration.md](configuration.md)). A transcript is kept in the local store
and reused by message lists, inboxes and reviews. Calling `messages transcribe` again can request
a new transcript or run recognition again. `--transcribe` can take minutes.

### Files

```sh
tg messages download "Book club" 4242 --output-dir ~/Downloads   # one message's files
tg messages download "Book club" --all --output-dir ~/tg-files   # every file of the chat, newest first
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
tg contacts profile @example_user      # flags, last seen, registered, messages per shared chat
tg contacts context @example_user --chat "Book club"   # their latest messages there
tg contacts check @example_user        # does the account look like a bot or a spammer
```

More about one person, and what `contacts check` sends where: [people.md](people.md).

`contacts list` is the people you have a one-to-one chat with. `contacts sync` brings in the rest of
your Telegram contact list too. `contacts lookup` never takes the number as an argument: pipe it in,
or type it when asked.

Changing the address book and your profile:

```sh
tg contacts add @example_user          # under the name they show
tg contacts rename @example_user Ann "from work"   # a name only you see
tg contacts remove @example_user       # the chat stays
tg contacts block @example_user        # they need not be a contact
tg contacts unblock @example_user
tg contacts import people.txt          # one "number, name" per line; never numbers as arguments
tg account update --first-name Ann --description "about me" --photo me.jpg
tg account sessions end --others       # logs out every other device, your phone too; asks first
```

`contacts import` answers how many it sent and who Telegram knew, never a number. `account sessions
end` asks before it goes; `--yes` answers in a script.

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

**A chat's messages have no pages: they have `--before-id`, `--after-id` and `--after-time`**, which page exactly:

```sh
tg messages list "Book club" --before-id 4242   # older than message 4242
tg messages list "Book club" --after-id 4242    # newer than 4242, oldest first
tg messages list "Book club" --after-time 2h    # what came in during the last two hours
tg messages list "Book club" --after-time 2026-09-20T09:00
tg messages list "Book club" --before-time 1d   # what came before this time yesterday
```

In the terminal, the line that names the next page goes to stderr. `--before-id` and `--after-id` take
a message id. `--after-time` takes ISO 8601, or "this long ago": `30m`, `2h`, `1d`. In
`messages context`, `--before-n` and `--after-n` are counts of messages: there the point is already
the message.

### Find a chat, then write to it

```sh
tg chats list --search book --kind group     # groups with "book" in the title
tg contacts list --search ann                # people by name or @username
tg messages search "contract"                # the text of every message this machine has kept
tg messages search "contract" --chat "Book club"
tg messages search "invoice.*(march|april)" --regex
```

Chat and contact searches need **at least three characters**. Local `messages search` uses the
[strict Lucene profile](search.md): `invoic*` matches prefixes; `invoic` is an exact term.
It never connects to Telegram: it reads what was fetched or kept by `serve`. Use `--language legacy`
for the previous discovery behavior. Once you have the chat, use its id.

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
tg messages send "Book club" "**Bold** and _italic_" --md  # Telegram Markdown
```

`--md` uses Telegram's formatter: `**bold**` or `*bold*`, `_italic_`, `__underline__`,
`~~struck~~` or `~struck~`, `||spoiler||`, inline code, fenced code with a language,
`[label](https://example.com)` and quote lines starting with `> `. Styles may nest; code/pre
cannot nest with other entities, links cannot nest, and quotes cannot nest. Without the flag text stays as typed.
Backslash escapes a mark; word-internal `_` and `*` stay literal. Unclosed inline marks stay
literal; an unclosed fence is refused. Links support absolute http, https and mailto URLs.
`messages edit` and media captions use the same formatter. Telegram `__text__` is underline;
MAX `__text__` is bold. A single `*text*` is now bold in Telegram.

### Text from stdin

Leave out the text and it is read from stdin. That is the only way to send several lines, and it
keeps the text out of `ps` and your shell history:

```sh
printf 'first line\n\nthird line' | tg messages send me
tg messages send "Book club" < note.txt
```

### Sending later

```sh
tg messages send "Book club" "Tomorrow" --at-time 2026-10-01T09:00   # local time
tg messages send "Book club" "In two hours" --at-time 2h        # or 30m, 1d from now
tg messages scheduled "Book club"                               # what waits to be sent there
```

`--at-time` hands the message to Telegram, which sends it even with this machine off. The time is rounded
down to the minute. Less than a minute from now, or more than a year, is refused. The guard counts a
scheduled message in the hour Telegram sends it. **Cancel or change one in the Telegram app**; `tg`
does not.

### Files, photos and voice messages

```sh
tg messages send "Book club" "The agenda" --file agenda.pdf   # byte for byte; the text is the caption
tg messages send "Book club" --photo picture.jpg              # recompressed by Telegram
tg messages send "Book club" --file trip.mp4                  # a video plays in the chat
tg messages send "Book club" --file trip.mp4 --as-file        # the same video as a file to download
tg messages send "Book club" --voice note.ogg                 # a voice message, alone, with no text
```

`--photo` takes a `.jpg`, `.png` or `.webp`. A `.mp4` or `.mov` given with `--file` goes as a video
unless you add `--as-file`. `--voice` takes an Ogg Opus file (`.ogg`, `.oga`, `.opus`) and goes alone:
no text, no other file. Hidden files and folders, `~/.ssh`, `tg`'s own folders
and the local store are refused unless you add `--allow-any-file` — that is where keys and tokens
live.

### Replying

```sh
tg messages send "Book club" "Agreed" --reply-to 4242
```

A reply is a send, so every send option works with it.

### Channel comments

```sh
tg messages comments "Rozetked" 27644              # the comments under post 27644, oldest first
tg messages comments "Rozetked" 27644 --before-id 3732413
tg messages send "My channel" "Thanks!" --comment-to 120
```

Comments live in the channel's discussion group: the answer names it as `discussion`, and a comment is a
reply there, so the recipient list and the hourly limit count it against that group. A post whose channel
has no discussion group, or that is closed to comments, ends in exit `6`.

### When the outcome is unknown

Exit code `14` means the connection broke after the message left: **it may have gone**. The error
carries a `--send-id`. Repeat with it, and Telegram drops the second copy:

```sh
tg messages send "Book club" "See you at 7" --send-id <id from the error>
tg messages forward "Book club" 4242 --to me --send-id <id from the error>
```

A forward and a poll carry one too. A repeat without it is a second message to a person.
A file is uploaded before the message is sent: tg tries a dropped upload three times, and if it still
fails the error says nothing was sent — that one you can simply run again.
Other writes — pin, react, mark read, delete, vote, folders, contacts — end in exit `14` the same way
when Telegram does not answer; the message says whether repeating is safe. A folder creation is not:
look in `tg chats folders list` first, or you may get two. A message sent with `--at-time` is never repeated:
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
why it asks first: answer `y`, or add `--allow-dangerous` to skip the question. In a supergroup or a
channel Telegram deletes only for everyone, so there only `--for-everyone` works.

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
position. `--multiple` lets people pick several answers. People can change their vote only in a poll
made with `--revote`.

### Marking a chat read

```sh
tg chats mark-read "Book club"               # up to the newest message
tg chats mark-read "Book club" --until 4242  # only up to this one
tg messages list "Book club" --mark-read     # read it, and mark it read up to the newest shown
```

The other side sees that you read it. It goes through the guard as the action `read`, and does not
count toward the hourly limit.

### Folders

```sh
tg chats folders list                              # your folders, in the order the app shows them
tg chats folders create "Trips" --chat "Hiking" --chat @kate
tg chats folders update "Trips" --title "Travel" --add "Climbing" --remove @kate
tg chats folders delete "Travel"                   # the chats stay
```

A folder is named by its id or its title exactly. Only you see your folders; each change still goes
through the guard, as an `account` change.

### Not in tg yet

Several photos in one message remain on the [roadmap](roadmap.md).

## Groups and channels

```sh
tg chats inspect https://t.me/+AbCdEf              # where an invite or public link leads; does not join
tg chats members list "Hiking" --all               # everyone, with their role and when last seen
tg chats events "Hiking"                           # who joined, left, was added or removed — 7 days
tg chats events "Hiking" --type join,leave --since-time 2026-09-01T00:00
tg topics list "Hiking"                            # a forum group's topics, newest activity first
tg topics search "Hiking" "gear"
tg review --chat "Hiking" --unanswered             # questions nobody answered
```

All of these only read. `events` reads the chat's service messages: who did what, and to whom. The
names are `join`, `leave`, `add`, `remove`, `create`, `title` and `pin`.

These change something, and the people in the chat see it:

For a forum, use `tg topics enable <chat>` and `tg topics create <chat> <title>`. A basic group
requires `--upgrade --yes`; keep the new chat id returned by the upgrade. Read `topics list`
after an unknown creation outcome instead of repeating the creation. Send to its id with
`tg messages send <chat> <text> --topic <id>` or `tg polls create <chat> <question> <answers> --topic <id>`.

```sh
tg chats create "Hiking 2027" @olga 12345          # a supergroup; the people added are told
tg chats create "Trail news" --channel             # a channel; people join it by its link
tg chats join https://t.me/+AbCdEf                 # by an invite link, or a public one
tg chats leave "Hiking 2027"
tg chats update "Hiking 2027" --title "Hiking 2028" --description "routes and dates"
tg chats update "Hiking 2027" --all-can-pin off --only-admins-add on
tg chats link show "Hiking 2027"                   # the invite link, if you may see it
tg chats link reset "Hiking 2027"                  # a new one; the old one stops working
tg chats members add "Hiking 2027" @kate 67890     # they are told
tg chats members remove "Hiking 2027" @kate        # their messages stay
tg chats admins add "Hiking 2027" @kate --can pin,delete
tg chats admins remove "Hiking 2027" @kate
```

A new group is always a supergroup. Someone whose privacy settings stop them being added is named
in the answer under `providerMetadata.notAdded`; the group is made anyway. A group whose admins
approve who joins answers that the request was sent. Each goes through the guard as a `chat` change,
and each person added counts toward the hourly limit.

`chats update` changes the title, the description and the two settings Telegram has, in one go; the
answer is the group as it stands, and `chats show` shows the same settings. Moderation rules —
`chats rules` and `chats moderate` — are in [groups.md](groups.md#rules), with everything else there
is for a group you run.

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
as a system service ([archive.md](archive.md#keeping-it-current-serve)):

```sh
tg server start           # serve in the background; answers once it is connected
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
tg store fetch "Project Alpha" --estimate      # how much a fetch would take
tg store fetch "Project Alpha" --background       # a chat's history, as a job
tg store export "Project Alpha" --format markdown --output alpha.md
tg store backup ~/tg-store.db                     # a copy of the store, while it is in use
```

An ordinary command still asks Telegram. `--offline` is for when there is no network, or when
connecting is not wanted; a send with `--offline` is refused. Fetching, export, search, backup and
the service: [archive.md](archive.md).

## Settings, and what a profile may do

Settings live in an optional `config.json`, and every value is decided in one order: **option →
environment variable → the profile in the file → the file's defaults → built in**.

```sh
tg config show                                 # every setting, and where it came from
tg config set limit 50
tg work config set permissions.messages readonly   # profile "work" changes no messages
tg config set permissions.messages.send ask        # a yes or no before each send
tg config set sendsPerHour 10
```

`permissions` says what a profile may do, per command: `deny`, `readonly`, `ask` or `allow`. By
default everything is allowed, and deleting messages and ending sessions ask first. A refusal is
exit code `5`, and the error names the command that allows it. **The file has no field for a
secret.** Every setting and variable: [configuration.md](configuration.md).

## Next

- [archive.md](archive.md) — the local store: search, fetch a chat's history, export, backup
- [configuration.md](configuration.md) — settings, and what a profile may do
- [security.md](security.md) — what reaches the disk, and the send guard
- [recipes.md](recipes.md) — daily work for an agent

## A person's profile

`tg contacts profile <person>` shows what Telegram says about one person and how active they are in the
chats you share:

- every username, the bio, the birthday where they show it, and the phone number where Telegram shows it to
  you — its last four digits unless you add `--show-phone`;
- Telegram's own marks: `bot`, `verified`, `premium`, `scam`, `fake`, `restricted`, `deleted`, `support`;
- `seen`: `online`, a time, or `recently`, `week`, `month` when their privacy hides the time, and `hidden`
  when Telegram says nothing;
- `contact` and `mutualContact`, and how many groups you share (`commonChatsCount`);
- `registered`: when the account was made, always with where that comes from — `telegram` (the month
  Telegram tells you when they first write to you) or `estimate` (guessed from the account id with a
  community table; past December 2024 there is no estimate);
- `hasPhoto`: a photo of their own — one you set for them does not count;
- for each shared chat, how many of their messages your local store holds, the first and the last.
  `complete: false` means the store does not hold the whole chat, so the count is a minimum.

It asks Telegram exactly what `contacts show` asks, and tells the person nothing. With `--offline` it answers
from the store.

## Is this account a bot

`tg contacts check <person>` scores one person as a possible bot, fake or spammer and lists every reason with
where it came from:

- Telegram's own marks: bot, scam, fake, deleted;
- the profile: no photo, no username, no bio, an odd name, a young account, a first photo from the last 30 days;
- up to 1,000 stored messages: nothing found, a link in the oldest stored message when all stored messages
  fit the limit, the same text in several chats;
- two public spam lists, Combot CAS and lols.bot, which are sent the person's id.

`--no-registries` skips the public lists; Telegram is still asked for the profile and photos.
`--offline` asks nothing online and judges only stored evidence. A list that is down or refuses shows as
`unknown`, and the rest still answer. If you have a Combot API
key, keep it in `TG_CAS_API_KEY` or the keyring account `registries:cas`; CAS answers without one for now. The
score is a hint, never a verdict.

## Local person context

`tg contacts context <person>` reads linked identities' stored messages and shared chats without connecting
or marking read. `complete:false` and `notRead` expose archive gaps. `contacts link <person> max:<id>` and
`contacts unlink` maintain local identity links; they do not change Telegram's address book.

`tg contacts context <person> --chat <chat> --chat <chat>` gives their newest messages in each chat named,
oldest first, as time and text only — short enough for an AI agent to summarise. `--limit` is per chat (20 by
default); `-v` adds ids, links to each message, the sender and what it answers; `-vv` gives everything.
`--refresh` asks Telegram first: one search by sender per chat. Nothing is marked read.

`contacts context` returns message bodies and therefore follows `messages` permissions; identity-link writes remain controlled by `contacts`.
