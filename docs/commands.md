<!-- Generated from the command tree by scripts/commands.ts. Do not edit; run `pnpm generate`. -->

# Commands

Every command, option and exit code. This page is **generated from the program itself**, so it
cannot describe a version that does not exist. For the same list as JSON, run `tg commands --json`.

How a command line is built:

```sh
tg [profile] [options] <resource> <verb> [arguments]
```

**The first word is the profile** when it is not a command: `tg work chats list` lists the chats of
profile `work`, and `tg chats list` those of the default profile. `TG_PROFILE` does the same for a
whole shell session; without either, the profile is `default`.

## Options for every command

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Default: `0`. |
| `--json` | machine-readable output: one JSON value on stdout, nothing else. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off; a failure is still said. |
| `--trace` | the connection's own log lines on stderr — never message content. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run — ids and timings, never message content. |
| `--no-record` | do not keep it, whatever the configuration says. |

## `tg session`

log this profile in to Telegram, or out

### `tg session start`

log in by QR code (default) or by phone number, code and 2FA password

```sh
tg session start [method] [options]
```

| Argument | | What it is |
|---|---|---|
| `method` | optional | how to log in. One of: `qr`, `phone`. Default: `qr`. |

| Option | What it does |
|---|---|
| `--app <how>` | the first time only: how to get this profile's app from my.telegram.org. One of: `browser`, `auto`. Default: `browser`. |
| `--qr-file <png>` | write the QR code to this PNG instead of drawing it, for an agent to pass on. |

### `tg session end`

log this profile out on Telegram's side and forget the session here

**Changes something in Telegram.**

```sh
tg session end
```

## `tg account`

the logged-in account

### `tg account show`

who this profile is logged in as; the phone number shows its last four digits

```sh
tg account show [options]
```

| Option | What it does |
|---|---|
| `--show-phone` | print the whole phone number. |

### `tg account update`

change the name, the description or the photo everyone sees on your profile

**Changes something in Telegram.**

```sh
tg account update [options]
```

| Option | What it does |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` | a new profile photo — an image file. |

### `tg account sessions`

where else this account is logged in — not `tg session`, which is this tool's own login

#### `tg account sessions list`

every device and app logged in to this account; nothing is ended

```sh
tg account sessions list
```

#### `tg account sessions end`

log out every other device, your phone included; this one stays

**Changes something in Telegram.**

```sh
tg account sessions end [options]
```

| Option | What it does |
|---|---|
| `--others` | every session but this one. |

## `tg chats`

the account's chats

### `tg chats list`

chats, newest first, archived ones included

```sh
tg chats list [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--search <text>` | only chats whose name contains this; at least 3 characters. |
| `--kind <kind>` | only chats of this kind: dialog, group, channel, saved. |
| `--unread` | only chats with unread messages. |

### `tg chats events`

who joined, left, was added or removed, and by whom — from the chat's service messages

```sh
tg chats events <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--type <names>` | only these, comma-separated: join, leave, add, remove, create, title, pin. |

### `tg chats inspect`

what an invite or public link leads to, without joining it

```sh
tg chats inspect <link>
```

| Argument | | What it is |
|---|---|---|
| `link` | required | an invite link or a public one. |

### `tg chats show`

one chat: its kind, unread count, last message time and who is in it

```sh
tg chats show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg chats members`

who is in a group

#### `tg chats members list`

everyone in a group, a page at a time, with their role and when they were last seen

```sh
tg chats members list <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

#### `tg chats members add`

add people; they are told

**Changes something in Telegram.**

```sh
tg chats members add <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `person` | required | an id, or part of a name. |

#### `tg chats members remove`

remove people; their messages stay

**Changes something in Telegram.**

```sh
tg chats members remove <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `person` | required | an id, or part of a name. |

### `tg chats mark-read`

mark a chat read; the other side sees that you read it

**Changes something in Telegram.**

```sh
tg chats mark-read <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--until <message>` | only up to this message id; the newest by default. |

### `tg chats create`

create a group or a channel; the people added are told

**Changes something in Telegram.**

```sh
tg chats create <title> [person] [options]
```

| Argument | | What it is |
|---|---|---|
| `title` | required | the group's name. |
| `person` | optional | people to add: an id, or part of a name. |

| Option | What it does |
|---|---|
| `--channel` | a private channel instead of a group; people join it by its link. |

### `tg chats join`

join a group or channel by its link; the others in it see that you joined

**Changes something in Telegram.**

```sh
tg chats join <link>
```

| Argument | | What it is |
|---|---|---|
| `link` | required | an invite link, or a public one. |

### `tg chats leave`

leave a group or channel; the others in it see that you left

**Changes something in Telegram.**

```sh
tg chats leave <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg chats update`

rename a group or channel, change its description, or turn one of its settings on or off

**Changes something in Telegram.**

```sh
tg chats update <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--title <title>` | the new name. |
| `--description <text>` | the new description. |
| `--all-can-pin <on\|off>` | every member may pin messages. |
| `--only-admins-add <on\|off>` | only admins may add members. |

### `tg chats link`

a group's invite link

#### `tg chats link show`

the invite link, if you may see it

```sh
tg chats link show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

#### `tg chats link reset`

replace the invite link; the old one stops working

**Changes something in Telegram.**

```sh
tg chats link reset <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg chats admins`

give or take back a member's admin rights

#### `tg chats admins add`

make a member an admin with these rights

**Changes something in Telegram.**

```sh
tg chats admins add <chat> <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `person` | required | an id, or part of a name. |

| Option | What it does |
|---|---|
| `--can <rights>` | what they may do, comma-separated: members, admins, info, pin, link, post, edit, delete. |

#### `tg chats admins remove`

take an admin's rights back; they stay a member

**Changes something in Telegram.**

```sh
tg chats admins remove <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `person` | required | an id, or part of a name. |

### `tg chats folders`

your chat folders

#### `tg chats folders list`

your chat folders, in the order the app shows them

```sh
tg chats folders list
```

#### `tg chats folders create`

create a chat folder

**Changes something in Telegram.**

```sh
tg chats folders create <title> [options]
```

| Argument | | What it is |
|---|---|---|
| `title` | required | the folder's name; the app may refuse a long one. |

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat to put in it, by id or name; repeat it for more. |

#### `tg chats folders update`

rename a folder, or change which chats are in it

**Changes something in Telegram.**

```sh
tg chats folders update <folder> [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | folder id, or its title exactly. |

| Option | What it does |
|---|---|
| `--title <title>` | a new name. |
| `--add <chat>` | put a chat in it; repeat it for more. |
| `--remove <chat>` | take a chat out of it; repeat it for more. |

#### `tg chats folders delete`

delete a folder; the chats in it stay

**Changes something in Telegram.**

```sh
tg chats folders delete <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | folder id, or its title exactly. |

### `tg chats rules`

what `chats moderate` judges a group by, kept in a file of this profile

#### `tg chats rules show`

the group's rules; the defaults, marked not saved, if it has none yet

```sh
tg chats rules show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

#### `tg chats rules set`

change one rule; the group's first change writes every rule with its default

**Changes something on this computer only.**

```sh
tg chats rules set <chat> <key> <value>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | required | the new value; a list is comma-separated. |

#### `tg chats rules unset`

put one rule back to its default

**Changes something on this computer only.**

```sh
tg chats rules unset <chat> <key>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `tg chats moderate`

judge a group's new messages and members by its rules, and act as they allow

**Changes something in Telegram.**

```sh
tg chats moderate <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

## `tg contacts`

people this account has a one-to-one chat with

### `tg contacts list`

people you have a one-to-one chat with

```sh
tg contacts list [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--order <recent\|name>` | newest conversation first, or alphabetical. Default: `recent`. |
| `--search <text>` | only people whose name or @username contains this. |

### `tg contacts show`

one person and the chats you share with them

```sh
tg contacts show <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

### `tg contacts lookup`

who has this phone number — asks for it, or reads it from stdin; never an argument

```sh
tg contacts lookup
```

### `tg contacts sync`

take the whole contact list from the messenger into the local store

```sh
tg contacts sync
```

### `tg contacts add`

add a person to your contacts — `contacts list` still shows only people you have a dialog with

**Changes something in Telegram.**

```sh
tg contacts add <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `tg contacts remove`

remove a person from your contacts; the chat stays, a name you gave them may not

**Changes something in Telegram.**

```sh
tg contacts remove <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `tg contacts block`

stop a person from writing to you — they need not be a contact

**Changes something in Telegram.**

```sh
tg contacts block <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `tg contacts unblock`

let a blocked person write to you again

**Changes something in Telegram.**

```sh
tg contacts unblock <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `tg contacts rename`

give a person a name of your own — they do not see it

**Changes something in Telegram.**

```sh
tg contacts rename <person> <first-name> [last-name]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |
| `first-name` | required | the name you want to see for them. |
| `last-name` | optional |  |

### `tg contacts import`

upload phone numbers and add the people the messenger has under them

**Changes something in Telegram.**

```sh
tg contacts import <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | one person per line: number, then a comma, a tab or a semicolon, then the name. |

## `tg messages`

read and send messages

### `tg messages list`

a chat's messages, oldest to newest

```sh
tg messages list <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many. |
| `--before-id <id>` | only messages older than this message id. |
| `--before-time <time>` | only messages older than this ISO 8601 time, or 2h / 1d ago. |
| `--after-id <id>` | only messages newer than this message id. |
| `--after-time <time>` | only messages newer than this ISO 8601 time, or 2h / 1d ago. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |
| `--mark-read` | also mark the chat read up to the newest message shown; the other person sees it. |

### `tg messages search`

search the local store — what was read, fetched or kept by serve; never asks the messenger

```sh
tg messages search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | every word must appear, best match first; "a phrase", -word, a OR b, and the filters from: chat: after: before: has: in: — a typo is corrected, and a word that matches nothing falls back to any word, then to a piece of a word. |

| Option | What it does |
|---|---|
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--source <messenger>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--context <n>` | messages before and after each hit; 2 in the terminal, 0 otherwise. |
| `--regex` | the words are one regular expression, case-insensitive, tested against every stored text. |

### `tg messages send`

send a text message; without [text], the text is read from stdin

**Changes something in Telegram.**

```sh
tg messages send <chat> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `text` | optional | the message. |

| Option | What it does |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--send-id <id>` | repeat a send whose outcome was unknown, without risking a second copy. |
| `--silent` | deliver without a notification. |
| `--no-preview` | no preview card for a link in the text. |
| `--md` | read **bold**, _italic_, \~\~struck\~\~ and `code` in the text; \ keeps a mark literal. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from a hidden folder, \~/.ssh or this CLI's own folders. |
| `--at-time <time>` | let the messenger send it later, even with this machine off: 2026-09-25T09:00 (local time), or 30m, 2h, 1d from now. |

### `tg messages show`

one message, by its chat and id or by its msg: locator

```sh
tg messages show <chat> [message]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages; or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

### `tg messages context`

a message and what came either side of it, oldest first

```sh
tg messages context <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages; or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

| Option | What it does |
|---|---|
| `--before-n <n>` | how many before it. Default: `5`. |
| `--after-n <n>` | how many after it. Default: `5`. |

### `tg messages download`

save a message's photos, files, videos and voice notes to a folder — or a whole chat's with --all

```sh
tg messages download <chat> [message] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | optional | the message id; left out with --all. |

| Option | What it does |
|---|---|
| `--output-dir <dir>` | where to save them; created if missing. Default: `.`. |
| `--all` | every file of the chat, newest first; run it again to continue where it stopped. |
| `--pause <duration>` | with --all, a pause between pages, to stay under the provider's limits. Default: `1s`. |

### `tg messages transcribe`

a voice message as text — by Telegram where it can, else by a model on this machine

```sh
tg messages transcribe <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the id of a voice message. |

| Option | What it does |
|---|---|
| `--local` | use the model on this machine, never the messenger. |
| `--model <id>` | which downloaded model; implies --local (`models audio list`). |

### `tg messages edit`

change the text of your own message; the other side may have read it already

**Changes something in Telegram.**

```sh
tg messages edit <chat> <message> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the id of your own message. |
| `text` | optional | the new text; without it, read from stdin. |

| Option | What it does |
|---|---|
| `--md` | read **bold**, _italic_, \~\~struck\~\~ and `code` in the text; \ keeps a mark literal. |

### `tg messages delete`

delete messages for you only; with --for-everyone, for everyone in the chat

**Changes something in Telegram.**

```sh
tg messages delete <chat> <messages> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `messages` | required | the message ids, at most 10. |

| Option | What it does |
|---|---|
| `--for-everyone` | delete for everyone in the chat, not only for you — they cannot get it back. |
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `tg messages forward`

forward one message to another chat

**Changes something in Telegram.**

```sh
tg messages forward <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | the chat the message is in: a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |

| Option | What it does |
|---|---|
| `--to <chat>` | where it goes: a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--silent` | deliver it without a notification. |
| `--send-id <id>` | repeat a forward whose outcome was unknown, without risking a second copy. |

### `tg messages pin`

pin a message in a chat, quietly unless --notify

**Changes something in Telegram.**

```sh
tg messages pin <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |

| Option | What it does |
|---|---|
| `--notify` | tell the chat's members about the pin. |

### `tg messages unpin`

unpin a message in a chat

**Changes something in Telegram.**

```sh
tg messages unpin <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |

### `tg messages scheduled`

messages waiting to be sent later in a chat, soonest first; cancel one in the app

```sh
tg messages scheduled <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg messages links`

why a message is in its conversation: each link it has, and the chain of answers back to the start

```sh
tg messages links <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |

## `tg reactions`

react to messages

### `tg reactions add`

put your reaction on a message; it replaces the one you had

**Changes something in Telegram.**

```sh
tg reactions add <chat> <message> <emoji>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |
| `emoji` | required | one emoji, for example 👍. |

### `tg reactions remove`

take your reaction off a message

**Changes something in Telegram.**

```sh
tg reactions remove <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the message id. |

## `tg polls`

read a poll, vote in it, close your own, create one

### `tg polls show`

a poll and its answer ids, as the message carries it now

```sh
tg polls show <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the id of the message that carries the poll. |

### `tg polls vote`

vote in a poll, or take your vote back; the others see it unless the poll is anonymous

**Changes something in Telegram.**

```sh
tg polls vote <chat> <message> [answers] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the id of the message that carries the poll. |
| `answers` | optional | answer ids, as `polls show` prints them. |

| Option | What it does |
|---|---|
| `--retract` | take your vote back. |

### `tg polls close`

close your own poll; nobody can vote after that, and it cannot be reopened

**Changes something in Telegram.**

```sh
tg polls close <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `message` | required | the id of your own message that carries the poll. |

### `tg polls create`

send a poll to a chat, as a message of its own; public unless --anonymous

**Changes something in Telegram.**

```sh
tg polls create <chat> <question> <answers> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `question` | required | the question. |
| `answers` | required | two answers or more. |

| Option | What it does |
|---|---|
| `--multiple` | people may pick several answers. |
| `--anonymous` | nobody sees who voted for what. |
| `--revote` | people may change their vote. |
| `--silent` | send without a notification. |
| `--send-id <id>` | repeat a create whose outcome was unknown, without risking a second poll. |

## `tg models`

models that run on this machine

### `tg models audio`

speech models for transcribing voice messages

#### `tg models audio list`

the speech models, most suitable first, which are downloaded, and which one is the default

```sh
tg models audio list
```

#### `tg models audio download`

download a speech model once, checked against the sha256 this version expects

```sh
tg models audio download <model>
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from `models audio list`. |

### `tg models text`

embedding models for searching conversations by meaning

#### `tg models text list`

the embedding models, most suitable first, which are downloaded, and which one is the default

```sh
tg models text list
```

#### `tg models text download`

download an embedding model once, checked against the sha256 this version expects

```sh
tg models text download <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from `models text list`. |

| Option | What it does |
|---|---|
| `--accept-terms` | accept the model's licence terms, for a model that has its own. |

#### `tg models text key`

the API key of an embedding service, for `conversations embed --provider`

#### `tg models text key set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

```sh
tg models text key set <provider>
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, or the host of a --base-url server that wants a key. |

#### `tg models text key remove`

forget a stored key

```sh
tg models text key remove <provider>
```

| Argument | | What it is |
|---|---|---|
| `provider` | required | openai, or a server's host. |

## `tg inbox`

other people's unread messages in every chat; --new for what arrived since the last check

```sh
tg inbox [options]
```

| Option | What it does |
|---|---|
| `--new` | what arrived since the last check, each message once — for scheduled runs. |
| `--since-time <time>` | what arrived after this ISO 8601 time, or 2h / 1d ago; the saved point stays put. |
| `--limit <n>` | at most this many per chat, the newest. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |

## `tg review`

every message, yours too, in chats that changed since a point — for reviewing who owes what

```sh
tg review [options]
```

| Option | What it does |
|---|---|
| `--since-time <time>` | where the last review ended — ISO 8601, or 2h / 1d ago; 3 days ago if not given. |
| `--chat <chat>` | only this chat: a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--unanswered [duration]` | only questions to you or a group's admins that nobody answered, asked at least this long ago — 4h, 1d; 24h if not given. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger, or a model on this machine; can take minutes. |
| `--model <id>` | which downloaded speech model hears them, with --transcribe; `models audio list` shows them. |

## `tg topics`

the topics of a forum group

### `tg topics list`

a forum group's topics, newest activity first

```sh
tg topics list <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

### `tg topics search`

a forum group's topics whose title matches

```sh
tg topics search <chat> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `text` | required | words from the topic's title. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

## `tg watch`

print new messages as they arrive, until Ctrl-C or --timeout (either ends it normally)

```sh
tg watch [options]
```

| Option | What it does |
|---|---|
| `--events` | also edits, deletions and reactions; every line then names its event. |

## `tg serve`

keep the local store current until stopped — what a systemd or launchd unit runs

```sh
tg serve
```

## `tg server`

`tg serve` in the background: start, stop, restart, status, logs; install adds a systemd or launchd unit

### `tg server start`

start serve in the background — through the unit if one is installed — and answer once it connects

```sh
tg server start
```

### `tg server stop`

stop this profile's serve — through the unit if it runs under one

```sh
tg server stop
```

### `tg server restart`

stop it and start it again

```sh
tg server restart
```

### `tg server status`

whether serve runs for this profile, since when, who started it, and the unit if there is one

```sh
tg server status
```

### `tg server logs`

serve's latest log lines — from the journal under systemd, else its log file

```sh
tg server logs [options]
```

| Option | What it does |
|---|---|
| `-n, --lines <n>` | how many lines. Default: `50`. |

### `tg server install`

write a systemd user unit or a launchd agent for this profile; starts nothing

```sh
tg server install
```

### `tg server uninstall`

remove this profile's unit; stop it first

```sh
tg server uninstall
```

## `tg store`

the local store of messages

### `tg store status`

per chat: messages stored, the oldest and newest, and the stretches held completely

```sh
tg store status [chat]
```

| Argument | | What it is |
|---|---|---|
| `chat` | optional | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg store fetch`

fetch a chat's history into the local store, newest first; run it again to continue

```sh
tg store fetch <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--limit <n>` | at most this many messages in this run; 1000 if not given. |
| `--page-size <n>` | how many messages one request asks for; 100 if not given. |
| `--pause <duration>` | pause between pages, to stay under the provider's limits. Default: `1s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |
| `--background` | run as a job that outlives this command; `store jobs show` follows it. |
| `--estimate` | only estimate how many messages, requests and minutes a full fetch would still take — from the store, no request. |

### `tg store jobs`

background fetch jobs

#### `tg store jobs list`

background fetch jobs, newest first

```sh
tg store jobs list
```

#### `tg store jobs show`

one background job — the newest when none is named — and what the store now holds of its chat

```sh
tg store jobs show [job]
```

| Argument | | What it is |
|---|---|---|
| `job` | optional | the job id `store fetch --background` printed. |

#### `tg store jobs cancel`

stop a running background job after its current page; a later fetch resumes where it stopped

```sh
tg store jobs cancel <job>
```

| Argument | | What it is |
|---|---|---|
| `job` | required | the job id. |

### `tg store export`

a chat's stored messages as JSON lines, oldest first; never asks the messenger

```sh
tg store export <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

| Option | What it does |
|---|---|
| `--format <format>` | jsonl (the default): one message per line; markdown: a transcript with a heading per day, replies and forwards quoted. |
| `--since-time <time>` | only from this ISO 8601 time, or 30m / 2h / 1d ago, on. |
| `--output <file>` | write JSON lines, or the transcript, to this new file, readable only by you. |

### `tg store clear`

delete from the store the chats this account has left, with their messages

```sh
tg store clear [options]
```

| Option | What it does |
|---|---|
| `--left` | the chats this account has left — the only thing this clears. |
| `--allow-dangerous` | yes, delete — it cannot be undone, and a chat you left cannot be fetched again. |

### `tg store info`

the store file: where it is, its size, its schema and how many rows it holds; changes nothing

```sh
tg store info
```

### `tg store check`

whether the store is healthy — integrity, search indexes, disk, and which chats are behind

```sh
tg store check
```

### `tg store migrate`

bring the store up to this build's schema, then normalize the messages stored before it

```sh
tg store migrate
```

### `tg store reindex`

rebuild the word index and its typo vocabulary from the stored messages; loses no message

```sh
tg store reindex
```

### `tg store backup`

copy the store into a new file, while it is in use; never overwrites a file

```sh
tg store backup <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

### `tg store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted

```sh
tg store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote. |

## `tg conversations`

the conversations inside a chat, found in the stored messages by replies, mentions and who wrote next

### `tg conversations build`

find a chat's conversations in what the store holds, replacing the last build; never asks the messenger

```sh
tg conversations build [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg conversations list`

a chat's conversations, the newest first: when, how many messages, how many people

```sh
tg conversations list [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--since-time <time>` | only those that started at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--limit <n>` | how many. |

### `tg conversations show`

one conversation's messages, oldest first — by its id, or the one a message is in

```sh
tg conversations show <conversation> [message]
```

| Argument | | What it is |
|---|---|---|
| `conversation` | required | a conversation id from `conversations list`; or a chat: its title or part of it, its id, @username, or `me` for Saved Messages, with a message. |
| `message` | optional | a message id in that chat: show the conversation it is in. |

### `tg conversations search`

the conversations nearest to a query in meaning and in words, best first, in one chat or every one — meaning after `conversations embed`; runs on this machine

```sh
tg conversations search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | what to look for, in your own words, in any language the model reads. |

| Option | What it does |
|---|---|
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embed through a service with your key instead of on this machine: openai. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--chat <chat>` | only this chat: a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--since-time <time>` | only those still going at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--limit <n>` | how many. |

### `tg conversations batches`

windows of a chat for your own AI agent to link: which earlier message each one answers

#### `tg conversations batches status`

how many messages still wait for an answer, in how many batches, and how much text

```sh
tg conversations batches status [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

#### `tg conversations batches next`

the next window to answer, with the messages before it; message text goes to stdout only

```sh
tg conversations batches next [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

### `tg conversations links`

your agent's answers: which earlier message each message of a batch answers

#### `tg conversations links add`

store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; all or nothing

```sh
tg conversations links add [options]
```

| Option | What it does |
|---|---|
| `--batch <id>` | the batch id `conversations batches next` printed. |

#### `tg conversations links clear`

drop your agent's answers for a chat, or only one model's; messages are never touched

```sh
tg conversations links clear [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--model <model>` | only the answers this model gave. |

### `tg conversations embed`

compute a vector for each chunk of a chat's conversations for search by meaning — on this machine, or with --provider through a service and your key; resumes where it stopped

```sh
tg conversations embed [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embed through a service with your key instead of on this machine: openai. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--workers <n>` | local: sessions in parallel, each with its own copy of the model (\~0.7 GB each). |
| `--threads <n>` | local: threads in all (default: min(8, cores)). |
| `--concurrency <n>` | remote: requests at once (default: 4). |
| `--max-tokens <n>` | remote: stop before a run that could send more tokens than this. |

#### `tg conversations embed status`

how many chunks of a chat have a vector of the model, how many are left, and what is left costs

```sh
tg conversations embed status [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embed through a service with your key instead of on this machine: openai. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

#### `tg conversations embed clear`

drop a chat's vectors, or only one model's; messages and conversations are never touched

```sh
tg conversations embed clear [options]
```

| Option | What it does |
|---|---|
| `--chat <chat>` | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |
| `--model <model>` | local: a model id from `models text list` (default: e5-small); remote: the provider's model. |
| `--provider <provider>` | embed through a service with your key instead of on this machine: openai. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

## `tg recipients`

the chats this profile may send to, when the list is on

### `tg recipients list`

the chats on the list; empty and off until the first add

```sh
tg recipients list
```

### `tg recipients add`

allow sending to this chat; the first add turns the list on

**Changes something on this computer only.**

```sh
tg recipients add <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat: its title or part of it, its id, @username, or `me` for Saved Messages. |

### `tg recipients remove`

stop allowing this chat; the list stays on

**Changes something on this computer only.**

```sh
tg recipients remove <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | chat id, or the title as the list shows it. |

### `tg recipients clear`

delete the list, which turns it off: this profile may send to any chat again

**Changes something on this computer only.**

```sh
tg recipients clear
```

## `tg sends`

every attempt to send from this profile — never the text

### `tg sends list`

attempts to send, newest first: sent, refused, failed, or not known

```sh
tg sends list [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |

## `tg runs`

recorded runs — what this tool did, and when

### `tg runs list`

recorded runs, newest first

```sh
tg runs list [options]
```

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |

### `tg runs show`

one run: what it was, and one line per operation

```sh
tg runs show <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `tg runs list`. |

### `tg runs path`

the directory holding one run

```sh
tg runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `tg runs list`. |

## `tg config`

the settings in force, and where each one came from

### `tg config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
tg config show [options]
```

| Option | What it does |
|---|---|
| `--bot` | the settings a bot command on this profile gets, rather than the personal account's. |

### `tg config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
tg config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeoutMs, color, senderColors, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, transcribeWith, speechModel, readOtherBots, updateCheck, skillHint. |
| `value` | required | a number, true or false, or for allow a list like send,reaction. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

### `tg config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
tg config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeoutMs, color, senderColors, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, transcribeWith, speechModel, readOtherBots, updateCheck, skillHint. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

## `tg doctor`

the state this installation is in, without connecting unless --online

```sh
tg doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

### `tg doctor report`

what a problem report holds; writes nothing

#### `tg doctor report create`

write a problem report to a file, and say where to send it

```sh
tg doctor report create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

## `tg commands`

every command, option and exit code as JSON — what an agent reads instead of --help

```sh
tg commands
```

## `tg complete`

shell completion: `tg complete zsh` prints the script to source

```sh
tg complete [words]
```

| Argument | | What it is |
|---|---|---|
| `words` | optional |  |

## `tg upgrade`

upgrade tg with the package manager that installed it; --check only looks

```sh
tg upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

## `tg mcp`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add tg -- tg mcp`

```sh
tg mcp [options]
```

| Option | What it does |
|---|---|
| `--confirm-send` | show the owner every write in a form from the server first. |
| `--allow-dangerous` | no form before a deletion whose permission level is ask. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-mark-read` | no longer used — the profile's permissions decide. |
| `--allow-delete` | no longer used — the profile's permissions decide. |

### `tg mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
tg mcp config [options]
```

| Option | What it does |
|---|---|
| `--confirm-send` | show the owner every write in a form from the server first. |
| `--allow-dangerous` | no form before a deletion whose permission level is ask. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-mark-read` | no longer used — the profile's permissions decide. |
| `--allow-delete` | no longer used — the profile's permissions decide. |

## `tg bot`

a Telegram bot, through the official Bot API and a bot token — not your personal account

### `tg bot auth`

the bot token this profile uses

#### `tg bot auth set`

check a bot token with Telegram, then keep it — typed at a hidden prompt or piped on stdin

**Changes something on this computer only.**

```sh
tg bot auth set
```

#### `tg bot auth show`

where this profile's bot token comes from, and which bot it is

```sh
tg bot auth show
```

#### `tg bot auth remove`

forget this profile's bot token

**Changes something on this computer only.**

```sh
tg bot auth remove
```

### `tg bot list`

every name on this machine that has a bot token; --check asks Telegram which bot each is

```sh
tg bot list [options]
```

| Option | What it does |
|---|---|
| `--check` | ask the messenger who each bot is, with its token. |

### `tg bot chats`

the chats this bot is in — Telegram gives a bot no list of them, so `list` shows the ones it has seen

#### `tg bot chats list`

chats this bot has seen on this machine — not a complete list from Telegram

```sh
tg bot chats list
```

#### `tg bot chats show`

one chat from Telegram, and remember it

```sh
tg bot chats show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |

#### `tg bot chats leave`

take the bot out of a chat; only an admin of the chat can bring it back

**Changes something in Telegram.**

```sh
tg bot chats leave <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |

#### `tg bot chats action`

show what the bot is doing in a chat — typing, sending a photo — for a few seconds

**Changes something in Telegram.**

```sh
tg bot chats action <chat> <action>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `action` | required | what the chat sees. One of: `typing`, `photo`, `video`, `voice`, `file`. |

#### `tg bot chats admins`

the admins of a chat the bot is an admin in

#### `tg bot chats admins list`

the chat's admins and what each may do

```sh
tg bot chats admins list <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |

#### `tg bot chats admins add`

make a member an admin with these rights

**Changes something in Telegram.**

```sh
tg bot chats admins add <chat> <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

| Option | What it does |
|---|---|
| `--can <rights>` | what they may do, comma-separated: members, admins, info, pin, link, post, edit, delete. |
| `--title <title>` | the title shown beside their name. |

#### `tg bot chats admins remove`

take an admin's rights back; they stay a member

**Changes something in Telegram.**

```sh
tg bot chats admins remove <chat> <person>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

#### `tg bot chats members`

the people in a chat the bot is an admin in

#### `tg bot chats members remove`

take a person out of a chat; their messages stay

**Changes something in Telegram.**

```sh
tg bot chats members remove <chat> <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

| Option | What it does |
|---|---|
| `--block` | also keep them from coming back by the chat's link. |

#### `tg bot chats rules`

a chat's moderation rules for this bot, kept on this machine

#### `tg bot chats rules show`

the chat's rules; the defaults, marked not saved, if it has none yet

```sh
tg bot chats rules show <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |

#### `tg bot chats rules set`

change one rule — trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Changes something on this computer only.**

```sh
tg bot chats rules set <chat> <key> <value>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |
| `key` | required | the rule. |
| `value` | required | its new value. |

#### `tg bot chats rules unset`

put one rule back to its default

**Changes something on this computer only.**

```sh
tg bot chats rules unset <chat> <key>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |
| `key` | required | the rule. |

#### `tg bot chats moderate`

judge a group's new messages and joins by its rules, and act as they allow — as the bot

**Changes something in Telegram.**

```sh
tg bot chats moderate <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |

| Option | What it does |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--no-ban` | remove without banning; by default a removed person cannot come back by the link. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

### `tg bot messages`

the messages in the chats this bot is in

#### `tg bot messages send`

send a message as the bot; without [text], the text is read from stdin

**Changes something in Telegram.**

```sh
tg bot messages send <chat> [text] [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `text` | optional | the message. |

| Option | What it does |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--silent` | deliver without a notification. |
| `--md` | read **bold**, _italic_, \~\~struck\~\~ and `code` in the text; \ keeps a mark literal. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from a hidden folder, \~/.ssh or this CLI's own folders. |

#### `tg bot messages list`

the latest messages in a chat; where Telegram gives a bot no history, and with --offline, the ones this bot has seen on this machine

```sh
tg bot messages list <chat> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many, the newest. |

#### `tg bot messages show`

one message by its id in a chat

```sh
tg bot messages show <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

#### `tg bot messages edit`

replace the text of a message the bot sent

**Changes something in Telegram.**

```sh
tg bot messages edit <chat> <message> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |
| `text` | required | the new text. |

| Option | What it does |
|---|---|
| `--md` | read **bold**, _italic_, \~\~struck\~\~ and `code` in the text; \ keeps a mark literal. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |

#### `tg bot messages delete`

delete messages in a chat the bot can delete in; it cannot be undone

**Changes something in Telegram.**

```sh
tg bot messages delete <chat> <messages> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `messages` | required | message ids. |

| Option | What it does |
|---|---|
| `--allow-dangerous` | delete without asking. |

#### `tg bot messages pin`

pin a message in a chat; quietly unless --notify

**Changes something in Telegram.**

```sh
tg bot messages pin <chat> <message> [options]
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

| Option | What it does |
|---|---|
| `--notify` | tell the chat's members. |

#### `tg bot messages unpin`

unpin a message in a chat

**Changes something in Telegram.**

```sh
tg bot messages unpin <chat> <message>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

### `tg bot recipients`

the chats this bot may write to; with no list, every chat — `clear` removes the list

#### `tg bot recipients list`

the chats on the list, or nothing when there is no list

```sh
tg bot recipients list
```

#### `tg bot recipients add`

allow a chat: its id, `user:<id>`, or the title of a chat this bot has seen

**Changes something on this computer only.**

```sh
tg bot recipients add <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required |  |

#### `tg bot recipients remove`

take a chat off the list

**Changes something on this computer only.**

```sh
tg bot recipients remove <chat>
```

| Argument | | What it is |
|---|---|---|
| `chat` | required |  |

#### `tg bot recipients clear`

remove the list: the bot may write to any chat again

**Changes something on this computer only.**

```sh
tg bot recipients clear
```

### `tg bot sends`

what this bot sent, edited and deleted from this machine — ids and outcomes, never text

#### `tg bot sends list`



```sh
tg bot sends list
```

### `tg bot watch`

print new messages as they arrive and keep them, until Ctrl-C or --timeout (either ends it normally)

```sh
tg bot watch [options]
```

| Option | What it does |
|---|---|
| `--events` | also edits, deletions, buttons pressed and people coming and going; every line names its event. |
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |

### `tg bot callbacks`

answers to the buttons people press under the bot's messages

#### `tg bot callbacks answer`

answer a pressed button by its callback id: --notification shows the person a one-time note, --text replaces the message the button was on

**Changes something in Telegram.**

```sh
tg bot callbacks answer <callback> [options]
```

| Argument | | What it is |
|---|---|---|
| `callback` | required | the callback id `bot watch` printed. |

| Option | What it does |
|---|---|
| `--text <text>` | the message's new text. |
| `--notification <text>` | a note only the person who pressed sees. |

### `tg bot commands`

the bot's command menu — what people see after /

#### `tg bot commands list`

the commands in the menu now

```sh
tg bot commands list
```

#### `tg bot commands set`

replace the whole menu: each command as name=description, e.g. start=Begin

**Changes something in Telegram.**

```sh
tg bot commands set <commands>
```

| Argument | | What it is |
|---|---|---|
| `commands` | required | name=description, one per command. |

#### `tg bot commands clear`

empty the menu

**Changes something in Telegram.**

```sh
tg bot commands clear
```

### `tg bot webhooks`

where the messenger pushes this bot's updates — while one is set, `bot watch` gets nothing

#### `tg bot webhooks list`

the webhooks this bot has

```sh
tg bot webhooks list
```

#### `tg bot webhooks set`

send this bot's updates to an HTTPS address; refused while another is set

**Changes something in Telegram.**

```sh
tg bot webhooks set <url> [options]
```

| Argument | | What it is |
|---|---|---|
| `url` | required | the HTTPS address. |

| Option | What it does |
|---|---|
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |
| `--secret-stdin` | a secret the messenger sends back with each update — asked for, or read from a pipe. |

#### `tg bot webhooks delete`

stop sending updates to this address; with none left, `bot watch` works again

**Changes something in Telegram.**

```sh
tg bot webhooks delete <url>
```

| Argument | | What it is |
|---|---|---|
| `url` | required | the address. |

### `tg bot mcp`

serve this bot to an agent over MCP, on stdin and stdout — `claude mcp add sales-bot -- tg sales bot mcp`

```sh
tg bot mcp [options]
```

| Option | What it does |
|---|---|
| `--confirm-send` | show the owner every write in a form from the server first. |
| `--allow-dangerous` | no form before a deletion whose permission level is ask. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-delete` | no longer used — the profile's permissions decide. |
| `--allow-moderate` | no longer used — the profile's permissions decide. |

#### `tg bot mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
tg bot mcp config [options]
```

| Option | What it does |
|---|---|
| `--confirm-send` | show the owner every write in a form from the server first. |
| `--allow-dangerous` | no form before a deletion whose permission level is ask. |
| `--allow-send` | no longer used — the profile's permissions decide; kept so an old setup still starts. |
| `--allow-delete` | no longer used — the profile's permissions decide. |
| `--allow-moderate` | no longer used — the profile's permissions decide. |

## `tg skill`

the instructions an agent is given for this tool

### `tg skill show`

print SKILL.md — `tg skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
tg skill show [name]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | one of the skills shipped for a task: link-conversations. |

### `tg skill install`

write SKILL.md to \~/.claude/skills/tg-cli/ (Claude Code) and \~/.agents/skills/tg-cli/ (Codex, Gemini CLI)

```sh
tg skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `all`. Default: `all`. |

## Exit codes

Branch on the code, not on the text: the text can change, the code does not.

| Code | When |
|---|---|
| `0` | it worked |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `130` | `cancelled` |
| `1` | anything else |

`0` and only `0` means the operation was done. `14` (`outcome_unknown`) means a message **may**
have gone: repeat it only with the same `--send-id`, which Telegram uses to drop a second copy.
