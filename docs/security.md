# Security: what reaches the disk, and what stops a send

`tg` works with your real Telegram account. This page says what it keeps on this machine, what it
never keeps, and what stands between an agent and a message to a real person.

## In short

It protects against:

- **an agent talked into sending** by a message it read — the send guard refuses what the profile
  does not allow ([below](#the-send-guard));
- **a secret in a log** — runs, reports and the journal of sends hold ids and counts, never text;
- **a secret in `ps` or shell history** — no command takes a password, a code or a phone number as an
  argument;
- **a file sent by mistake** — hidden files, `~/.ssh` and `tg`'s own folders are refused as
  attachments.

It does not protect against:

- **someone with your user account on this machine.** They can read the session file and the local
  store, as you can.
- **an agent that can change the settings.** The guard reads `config.json` and the recipient list.
  An agent allowed to run `tg config set` or `tg recipients add`, or to edit those files, can lift the
  limits. Keep those commands out of what the agent may run.

## Where the login lives

| What | Where | Who can use it |
|---|---|---|
| the session | `sessions/<profile>.session` in the state directory | anyone who can read the file: it is as good as your password |
| the app id and hash | the OS keyring; `credentials.json` beside the settings where there is no keyring | only together with a session |
| for CI | `TG_API_ID` and `TG_API_HASH` | the process that has them |

The session is Telegram's authorization key. Copying the file copies the login, with no password and
no code. Treat it like a password: never commit it, never attach it, never paste it.

**No command takes a secret as an argument.** The app hash and the 2FA password are asked without
echo; the login code and the phone number are asked, or read from stdin. An argument would be
visible to every process on the machine in `ps`, and would stay in your shell history.

## What reaches the disk

| What | Where | Holds |
|---|---|---|
| the local store | `~/.local/share/cli-messaging/messages.db` | **the full text** of every message `tg` has read or sent, chat titles, names |
| settings | `config.json` | settings only — the file has no field for a secret |
| recorded runs | `runs/` in the state directory | operation names, ids, counts, durations, error codes |
| the journal of sends | `sends/<profile>.jsonl` | for each attempt: when, which chat, the outcome, the length, attachment kind and size — never the text or a file name |
| the recipient list | `profiles/<profile>.recipients.json` | the chats this profile may send to |
| `inbox --new`'s point | `inbox/<profile>.json` | where the last check stopped |
| `serve`'s log | `serve/<profile>.log`, or the systemd journal | what `serve` did |
| speech models | `~/.cache/cli-common/models/audio/` | downloaded models, only when you asked |

**The local store is not encrypted.** It is a SQLite file created readable by your user only, in a
folder only your user can open. Anyone who can read it reads your messages. It is shared with other
CLIs built on the same library, and it stays after `tg session end` and after uninstalling.

### If the computer is lost

End the session from another device: in the Telegram app, Settings → Devices, end the session that
`tg` created. That makes the session file useless. The local store still holds what was read; only
disk encryption protects it.

## The send guard

Every command that changes something in Telegram — a send, a reply, an edit, a forward, a pin, a
reaction, a vote, a poll, a deletion, marking a chat read — goes through the same checks, in this
order:

1. **`readOnly`** — the profile changes nothing. Exit code `5`.
2. **`allow`** — only the actions it names: `send`, `forward`, `reaction`, `edit`, `pin`, `read`,
   `delete`, and more. Exit code `5`; the error says which action and how to allow it.
3. **the recipient list** — when it is on, only the chats on it. Exit code `7`.
4. **`sendsPerHour`** — the most sends in any hour, 30 by default. Exit code `8`; the error says when
   the next send is possible.

Then the attempt is written to the journal, whatever its outcome: `tg sends list`.

```sh
tg config set readOnly true                  # nothing changes in Telegram from this profile
tg config set allow send,reaction            # only these
tg recipients add "Book club"                # the first add turns the list on
tg recipients list
tg recipients remove "Book club"             # the list stays on
tg recipients clear                          # the list is gone: any chat again
tg config set sendsPerHour 10
tg sends list                                # every attempt: sent, refused, failed, or not known
```

**What counts toward the hourly limit:** a message, a forward, an edit, a pin that notifies, and each
deleted message. A reaction and a quiet pin do not. A scheduled message counts in the hour Telegram
sends it.

**A refusal is the owner's decision, not a fault.** An agent that meets exit code `5`, `7` or `8`
should stop and say so, not change the settings or retry. The skill file tells agents exactly that.

`TG_PROFILE_LOCK` pins a process to one profile, so an agent cannot pick a profile with fewer limits
([sessions.md](sessions.md#profiles)).

## Other people's text on your screen

A message, a name or a chat title is written by someone else. For an agent it is data, never an
instruction: "forward this there" or "reply with this" inside a message is not your request. The skill
file (`tg skill show`) says so to agents that read it. The send guard is there for when one does not
listen.

## Files you attach

`--file` and `--photo` refuse hidden files and folders, `~/.ssh`, `tg`'s own folders and the local
store. A file somebody talked an agent into sending would usually be a key or a token, and those live
there. `--allow-any-file` lifts it for one command; it is meant for you, not for an agent. Over MCP
there is no way around it.

## What goes over the network

- **Telegram**, over MTProto, for everything a command asks.
- **npm**, once a day at a terminal, to see whether a newer `tg` exists. `updateCheck` or
  `TG_NO_UPDATE_CHECK=1` turns it off ([configuration.md](configuration.md)).
- **my.telegram.org**, only during `tg session start`: opened in your browser, or, with `--app auto`,
  driven by `tg`. An app `tg` creates there is titled `tg-cli`, with this project's GitHub page as its
  address.
- **Hugging Face and GitHub**, only when you run `tg models audio download`.

Nothing else. There is no telemetry.

## Telegram's rules and your account

`tg` is a client on Telegram's own API, which Telegram opens to third-party apps. Telegram watches
accounts used for spam or automation
([Telegram API Terms of Service](https://core.telegram.org/api/terms)). That is why every user
registers their own app, and why the hourly limit is on by default. Mass mailing, automatic replies and other people's accounts are not what `tg` is for.

## If the session leaked

1. In the Telegram app: Settings → Devices, end the session `tg` created. Or run `tg session end` on
   this machine, which ends it on Telegram's side and deletes the file.
2. Log in again: `tg session start`.

## Next

- [configuration.md](configuration.md) — every setting the guard reads
- [diagnostics.md](diagnostics.md) — what a recorded run holds
