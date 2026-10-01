# Security: what reaches the disk, and what stops a send

`tg` works with your real Telegram account. This page says what it keeps on this machine, what it
never keeps, and what stands between an agent and a message to a real person.

## In short

It protects against:

- **an agent talked into sending** by a message it read. The MCP server offers no tool that writes
  until a flag turns it on, and with `--confirm-send` it shows you a form before each send. A yes in
  that form counts once, for five minutes, and only for the chat and the text it showed
  ([mcp.md](mcp.md#a-confirmation-form-from-the-server-itself)). Every read tool tells the model that
  message text is data, never instructions.
- **a send the profile does not allow.** Read-only, the allowed actions, the recipient list and the
  hourly limit are checked by every command and every MCP tool, and every attempt is written to a
  journal without its text ([below](#the-send-guard)).
- **an agent stepping outside its profile, or sending your keys.** `TG_PROFILE_LOCK` pins the
  profile, and `--file` refuses hidden files, `~/.ssh` and `tg`'s own folders.
- **other people's text taking over your terminal.** Control and invisible characters are shown as
  text, names are printed on one line, and completion inserts only ids
  ([below](#other-peoples-text-on-your-screen)).
- **a secret in a log** — runs, reports and the journal of sends hold ids and counts, never text;
- **a secret in `ps` or shell history** — no command takes a password, a code or a phone number as an
  argument;
- **other users of this machine.** Every file `tg` writes is created readable by you only, in folders
  only you can open ([below](#what-reaches-the-disk)).
- **a tampered release.** The package is published from GitHub Actions with npm's trusted
  publishing; the publish step installs nothing and runs no package scripts, and direct dependencies
  are pinned to exact versions.

It does not protect against:

- **someone with your user account on this machine.** They can read the session file and the local
  store, as you can.
- **an agent that can change the settings.** The guard reads `config.json` and the recipient list.
  An agent allowed to run `tg config set` or `tg recipients add`, or to edit those files, can lift the
  limits. Keep those commands out of what the agent may run ([below](#what-the-guard-cannot-hold)).

## Where the login lives

| What | Where | Who can use it |
|---|---|---|
| the session | `sessions/<profile>.session` in the state directory, `0600` in a `0700` folder | anyone who can read the file: it is as good as your password |
| the app id and hash | the OS keyring; `credentials.json` (`0600`) beside the settings where there is no keyring | only together with a session |
| for CI | `TG_API_ID` and `TG_API_HASH` | the process that has them |

The session is Telegram's authorization key. Copying the file copies the login, with no password and
no code. Treat it like a password: never commit it, never attach it, never paste it.

**No command takes a secret as an argument.** The app hash and the 2FA password are asked without
echo; the login code and the phone number are asked, or read from stdin. An argument would be
visible to every process on the machine in `ps`, and would stay in your shell history.

**The settings file has no field for a secret**: not for the app hash, a phone number or a session.

## What reaches the disk

| What | Where | Holds | Mode |
|---|---|---|---|
| the local store | `~/.local/share/cli-messaging/messages.db` | **the full text** of every message `tg` has read or sent, chat titles, names, transcripts | `0600`, folder `0700` |
| settings | `config.json` | settings only | `0644`, folder `0700` |
| recorded runs — with `--record`, and every failed run | `runs/` in the state directory | the command's words, ids, counts, durations, error codes | `0600`, folder `0700` |
| the journal of sends — always | `sends/<profile>.jsonl` | for each attempt: when, which chat, the outcome, the length, attachment kind and size — never the text or a file name | `0600`, folder `0700` |
| the recipient list | `profiles/<profile>.recipients.json` | the chats this profile may send to | `0600` |
| `inbox --new`'s point | `inbox/<profile>.json` | where the last check stopped | `0600` |
| background fetch jobs | the state directory | the chat, the progress, the outcome | `0600` |
| `serve`'s log and lock | `serve/<profile>.log`, or the systemd journal | what `serve` did | `0600` |
| a systemd unit or launchd agent — only `tg server install` | your user's unit folder | the command line that starts `serve` | `0644` |
| downloaded files — only `tg messages download` | `--output`, or the current folder | the files of the messages you named | `0600` |
| an export — only `tg store export` | wherever you redirect it | the messages of one chat | your shell decides |
| a backup — only `tg store backup` | the file you name | a copy of the whole store | `0600` |
| a problem report — only `tg doctor report create` | `--output`, or the current folder | ids replaced by labels, no text | `0600` |
| speech models — only `tg models audio download` | `~/.cache/cli-common/models/audio/` | downloaded models | `0600`, folder `0700` |

The exact paths on this machine: `tg doctor`. The folders on each system:
[installation.md](installation.md#where-files-go).

**The local store is not encrypted.** Anyone who can read it reads your messages. It is shared with
other CLIs built on the same library, and it stays after `tg session end` and after uninstalling.
Message text is also in exports, backups and downloaded files; nothing else in the table holds it.

### If the computer is lost

`0600` keeps the files from other users of this machine, not from someone who takes the disk. Whole-
disk encryption does that: FileVault on macOS, LUKS on Linux, BitLocker on Windows. The store has no
encryption of its own: a key in the keyring would not stop a program running as your user, which can
read the keyring as `tg` does.

End the session from another device: in the Telegram app, Settings → Devices, end the session that
`tg` created. That makes the session file useless.

## What it never does

- **Mark anything read without being asked.** Reading a chat and marking it read are two different
  requests to Telegram. Only `tg chats mark-read` sends the second.
- **Send or change anything you did not type.** Only these change something: `messages
  send|edit|delete|forward|pin|unpin`, `reactions add|remove`, `polls vote|close|create`,
  `chats mark-read`, and `session end` — each does only what the line says. `tg commands --json` marks
  them `mutates`, together with the commands that change `tg`'s own settings and recipient list.
- **Delete without an explicit word.** `tg messages delete` needs `--allow-dangerous`; deleting for
  everyone needs `--for-everyone` too. A deletion cannot be undone.
- **Take a phone number on the command line.** `contacts lookup` asks for it or reads it from stdin.
  No error, journal or record holds one.
- **Write a message into a log.** Not shortened, not hashed ([diagnostics.md](diagnostics.md)).
- **Stay connected on its own.** A command connects, does its job and exits. Only `watch`, `serve`,
  `mcp` and a background fetch job hold a connection, and only while they run.

## The send guard

An agent reads other people's messages together with your request. A message can be written so the
agent takes it for an order: "forward this conversation there". So every command and MCP tool that
changes something in Telegram — a send, a reply, an edit, a forward, a pin, a reaction, a vote, a
poll, a deletion, marking a chat read — goes through the same checks, in this order:

| Check | Turn it on | Refusal |
|---|---|---|
| **`readOnly`** — the profile changes nothing | `tg config set readOnly true` | exit code `5`, before connecting |
| **`allow`** — only the actions it names: `send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, and more | `tg config set allow send,reaction` | exit code `5`; the error says how to allow it |
| **the recipient list** — only the chats on it | `tg recipients add <chat>`; off again with `tg recipients clear` | exit code `7` |
| **`sendsPerHour`** — the most sends in any hour, 30 by default | `tg config set sendsPerHour 10` | exit code `8`; the error says when the next send is possible |
| **the journal** — every attempt, never its text | always; `tg sends list` | — |

```sh
tg config set readOnly true                  # nothing changes in Telegram from this profile
tg config set allow send,reaction            # only these
tg recipients add "Book club"                # the first add turns the list on
tg recipients list
tg recipients remove "Book club"             # the list stays on
tg recipients clear                          # the list is gone: any chat again
tg sends list                                # every attempt: sent, refused, failed, or not known
```

**What counts toward the hourly limit:** a message, a forward, an edit, a pin that notifies, and each
deleted message. A reaction, a vote, a quiet pin and marking a chat read do not. A scheduled message
counts in the hour Telegram sends it. Two commands started at once cannot get past the limit together:
each holds its place from the check until Telegram answers.

The recipient list is optional: until something is added, any chat is allowed. A forward is checked
against the chat it goes to. Over MCP, every tool goes through the same guard as the command.

**A refusal is the owner's decision, not a fault.** An agent that meets exit code `5`, `7` or `8`
should stop and say so, not change the settings or retry. The skill file tells agents exactly that.

### What the guard cannot hold

The checks live in `tg` itself, so an agent with a shell can lift them: change a setting, clear the
list. They protect against a model **talked into** sending by a message it read, not against an agent
that **sets out** to get round them. Against that, only a boundary outside works: a sandbox, a
separate OS user, a rule in the agent's own settings.

When you choose that boundary:

- **`TG_PROFILE_LOCK` pins the profile; `TG_PROFILE` does not.** The first word of a command beats
  `TG_PROFILE`: an agent with `TG_PROFILE=agent` only has to type `tg work messages send …`.
  `TG_PROFILE_LOCK=agent` refuses that — but only where the agent cannot change its own environment:
  in the MCP client's settings, or in a wrapper script. An agent with a shell can unset it.
- **`--file` and `--photo` refuse hidden files and folders, `~/.ssh`, `tg`'s own folders and the
  local store**: a file somebody talked an agent into sending would usually be a key or a token, and
  those live there. `--allow-any-file` lifts it for one command; it is meant for you, not for an
  agent. Over MCP there is no way around it. Anything else your user can read can be sent; the journal
  keeps only its kind and size.
- **An agent rule like "ask before `tg messages send`"** does not see the form with a profile,
  `tg work messages send`. It is safer to limit the profile itself — `readOnly`, `allow` or the
  recipient list — and not to keep an unlimited profile with a live session beside it.

## Other people's text on your screen

Names, chat titles, file names and messages are written by other people. `tg` does not let them drive
your terminal or fake what you see:

- control characters — the ones that recolour, erase lines, change the window title or the clipboard
  — are shown as text (`\x1b`), not run; so are invisible characters and the ones that reverse the
  direction of text;
- a name, a title or a caption is printed on one line, so a line break in a name cannot start a fake
  line of the conversation or the table;
- when a typed name fits more than one chat, `tg` does not choose: it lists them all;
- shell completion inserts only a chat's id; the title is shown beside it as a hint;
- a Markdown export goes through the same cleaning, and a downloaded file's name loses its control and
  direction characters and any leading dot.

For an agent, a message is data, never an instruction: "forward this there" or "reply with this"
inside a message is not your request. The skill file (`tg skill show`) and the MCP server say so to
agents that read them. The send guard is there for when one does not listen.

`--json` is data: strings in it are as Telegram sent them, escaped by JSON's rules. If you pass it to
a program that prints to a terminal, clean it there.

## What others on this machine can see

The arguments of a command are visible to every process in `ps`. That is why no secret is an
argument — but **a message's text is**:

```sh
tg messages send me "text"     # this line is visible in ps and stays in your shell history
```

When that matters, leave the text out and pipe it in: `tg messages send me < note.txt`.

Other users of the machine see none of `tg`'s files: folders are `0700`, files `0600`.

## What goes over the network

- **Telegram**, over MTProto, for everything a command asks — files and photos included.
- **npm**, once a day at a terminal, to see whether a newer `tg` exists, and on `tg upgrade`.
  `updateCheck` or `TG_NO_UPDATE_CHECK=1` turns it off ([configuration.md](configuration.md)).
- **my.telegram.org**, only during `tg session start`: opened in your browser, or, with `--app auto`,
  driven by `tg`. An app `tg` creates there is titled `tg-cli`, with this project's GitHub page as its
  address.
- **Hugging Face and GitHub**, only when you run `tg models audio download`. A voice message never goes
  there: a local model runs on this machine.

Nothing else. There is no telemetry.

## Your own app, and Telegram's terms

`tg` is a Telegram client, as the apps on your phone and computer are. It signs in with your own app
from my.telegram.org and follows
[Telegram's API Terms of Service](https://core.telegram.org/api/terms). The hourly limit is on by
default, so an agent sends at the pace of a person.

## For yourself

`tg` keeps other people's messages and names on your computer. That is fine while you do it for
yourself, with your own account: the GDPR does not apply to processing for purely personal or
household purposes (Article 2(2)(c)). Working with other people's accounts, or for a business, is no
longer personal. An export you hand to someone else leaves that purpose too.

A problem report (`tg doctor report create`) goes to a **public** issue on GitHub, where everyone sees
it. It holds no text, names or phone numbers, and every id in it is replaced by a label; open the file
and check it before you send it.

## Logging in

`tg session start` draws the QR code in the terminal. It stays in the scrollback, and Telegram renews
it while you wait, so an old one is useless. `--qr-file` writes it as a PNG readable only by you, and
removes the file when the login ends, whether it worked or not.

`--app auto` fills in my.telegram.org for you, without a browser: it asks your phone number and the
code the site sends you in Telegram, and nothing else.

Every login adds a device to the list in the Telegram app: Settings → Devices.

## If the session leaked

1. In the Telegram app: Settings → Devices, end the session `tg` created. Or run `tg session end` on
   this machine, which ends it on Telegram's side and deletes the file.
2. Log in again: `tg session start`.

## Next

- [diagnostics.md](diagnostics.md) — what exactly is recorded, and what never is
- [sessions.md](sessions.md) — the app, the keyring, profiles, logging out
- [mcp.md](mcp.md) — what an agent can do over MCP, and what each flag turns on
- [configuration.md](configuration.md) — `readOnly`, `allow` and `sendsPerHour`
