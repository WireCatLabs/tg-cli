# tg-cli

A local command line interface for a personal Telegram account, built for agents and scripts: one
operation per call, one JSON value on stdout when piped, a typed error and a stable exit code on
failure.

**Status: on npm** — what each version changed is in [CHANGELOG.md](CHANGELOG.md). Reads, sends through a guard, keeps a local searchable archive. The design
is [the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md)
in `cli-messaging`, which holds everything messenger-neutral. Telegram-specific code lives only in
`src/telegram/`, and a lint rule keeps mtcute there.

## Install

```sh
npm install -g @leemour/tg-cli     # or: pnpm add -g @leemour/tg-cli
tg session start
```

Node 22 or newer. SQLite comes from the runtime itself, so there is no native module to build.

## The first login

Every user has their own Telegram app: Telegram allows one per phone number and watches accounts that
use unofficial clients, so an app id is never shared. `tg session start` gets it the first time and
keeps it in the OS keyring, in one of two ways:

- `--app browser` (default) opens [my.telegram.org/apps](https://my.telegram.org/apps) and waits for
  you to paste `App api_id` and `App api_hash`.
- `--app auto` fills the site in for you: it asks your phone number and the code my.telegram.org sends
  in Telegram, reads your app, or creates one if you have none. It drives the site's web form, which
  has no API, so a change on Telegram's side can break it; `--app browser` still works then.

Then the login itself: a QR code in the terminal, or `tg session start phone` for a code and your
2FA password. With `--app auto` and `phone`, the phone number is asked once.

## Commands so far

```sh
tg session start [qr|phone] [--app browser|auto]   # QR by default
tg session start --qr-file login.png   # the QR as a PNG for an agent to pass on; removed after the login
tg session end                   # logs out on Telegram's side and deletes the session here
tg account show
tg chats list [--limit n]
tg chats show <chat>             # one chat and who is in it (up to 200; null for channels)
tg contacts list [--order recent|name] [--search text]   # people you have a one-to-one chat with
tg contacts show <person>        # their bio and the groups you share
tg messages list <chat> [--limit n] [--before id]
tg messages show <chat> <id>     # or: tg messages show msg:telegram/<account>/<chat>/<id>
tg messages context <chat> <id> [--before n] [--after n]   # a message and what came around it
tg messages send <chat> [text] [--send-id id]   # text from stdin when omitted
tg messages send <chat> [text] --silent --no-preview --md   # no notification, no link card, **bold** _italic_ ~~struck~~ `code`
tg messages reply <chat> <id> [text]            # or: tg messages reply msg:telegram/… [text]
tg messages edit <chat> <id> [text]             # your own message; the other side may have read it already
tg messages forward <chat> <id> --to <chat> [--silent]   # checked against the chat it goes to
tg messages download <chat> <id> [--output dir]   # the message's file, into a folder (default: here); never overwrites
tg messages transcribe <chat> <id>   # a voice note as text, by Telegram (Premium, or the weekly free trial)
tg messages search <words…> [--chat c]   # search the local store: every word, as the start of a word
tg messages search --regex '<pattern>' [--chat c] [--limit n]   # a regular expression over the stored text
tg inbox [--new | --since 2h] [--limit n] [--all]   # other people's unread messages; --new: what arrived since the last check;
                                                    # muted and archived chats only when they mention you, or with --all
tg review [--since 3d] [--chat c] [--unanswered [hours]] [--all]   # every message, yours too, in chats that changed —
                                                    # for reviewing who owes what; ends with where the next review starts
tg watch [--jsonl] [--events] [--timeout 60s]   # new messages as they arrive; --events adds edits, deletions, reactions
tg backfill <chat> [--max n] [--pace 1s]   # a chat's history into the local store; run again to continue
tg backfill <chat> --background   # the same as a job that outlives the command: backfill list|status [job]|cancel <job>
tg backfill <chat> --estimate     # what a full backfill would still cost, from the store; asks Telegram nothing
tg serve [--timeout 8h]          # keep the local store current until stopped; `tg serve status`
tg service install|uninstall|start|stop|status|logs   # serve as a systemd user unit or a launchd agent
tg sync status [chat]            # what the local store holds, per chat
tg export <chat> --jsonl > chat.jsonl   # a chat's stored messages, oldest first
tg export <chat> --format markdown > chat.md   # the same as a transcript a person reads
tg recipients list|add|remove|off   # the chats this profile may send to, once the list is on
tg sends list                    # every attempt to send, never the text
tg runs list [--limit n]         # recorded runs, newest first
tg runs show <run-id>            # one run: its outcome and one line per Telegram call
tg runs path <run-id>
tg commands                      # every command as JSON, with the output contract version
tg config show|set|unset         # the settings in force and where each came from
tg complete zsh|bash|fish|powershell   # shell completion: source <(tg complete zsh)
tg doctor [--online]             # the installation's state; --online connects once
tg doctor report create [--run id] [--output file]   # a problem report: no message text, every id a label
tg update [--check]              # update with the package manager that installed tg; never runs by itself
tg mcp [--allow-send [--confirm-send]]   # serve this profile to an agent over MCP — docs/mcp.md
tg mcp config [the same flags]   # the entry for Claude Desktop, Cursor and others
tg skill show > ~/.claude/skills/tg-cli/SKILL.md   # the instructions for an agent that has a terminal
```

Once a day, at a terminal, tg says on stderr when a newer version is on npm. It never says so to
`--json`, a pipe, `--quiet` or CI; `tg config set updateCheck false --defaults` or `TG_NO_UPDATE_CHECK=1` turns it off.

**Every read is kept.** What `chats list`, `messages list` and `messages send` see is saved to a
local store shared with other messenger CLIs (`~/.local/share/cli-messaging/messages.db` on Linux;
`MESSAGING_STORE` points it elsewhere). `--offline` answers `chats list`, `messages list|show|context` and `contacts list` from it, and
`messages search` only ever reads it
without connecting — the same JSON Telegram gave, except that chats come newest first where
Telegram puts pinned chats on top. `tg session end` logs out and leaves the store as it is.

`<chat>` is a title or part of one, an id, `@username`, or `me` for Saved Messages. An ambiguous
title is an error listing the candidates, never a guess.

The first word is the profile whenever it is not a command: `tg work chats list`. `TG_PROFILE` does
the same for a shell session, and `TG_PROFILE_LOCK` pins a process to one profile. Every command
takes `--json`, `--jsonl`, `--quiet`, `-v`/`-vv`, `--trace` (each Telegram call and the library's own
log, on stderr), `--timeout 30s` and `--record`; listings take `--limit`, `--page` and `--all`.
Settings live in `~/.config/tg-cli/config.json`, per profile or under `defaults`.

`--record` keeps the run in the state directory (`~/.local/share/tg-cli/runs/` on Linux) — ids, counts, timings and the error
code, never a chat title or a message. A run that fails is kept without `--record` too, unless
`--no-record`; runs older than `keepRunsForDays` (30) are removed when the next one is recorded.

## Keeping the archive current

`tg serve` listens until stopped and keeps every new message, edit, deletion and reaction, catching up
on what arrived while it was down. One runs per profile. Nothing starts it for you. To run it as a
user service — a systemd user unit on Linux, a launchd agent on macOS:

```sh
tg service install     # writes ~/.config/systemd/user/tg-serve-<profile>.service; starts nothing
tg service start       # starts it now
tg service status      # the unit, and who holds serve's lock
tg service logs -n 50
systemctl --user enable tg-serve-default   # only if it should start at every login
```

The unit runs the `node` and the `tg` that installed it, so reinstall it after moving either. It gets
the profile and the `TG_*_DIR` and `MESSAGING_STORE` variables of the shell that installed it, and
nothing else. **Check it once after `service start`:** `tg service logs`. A user service reads the
app credentials from the keyring; a keyring that stays locked until you log in will probably make it fail —
the logs say why. Not yet checked on a real machine.

## Development

To work on `cli-messaging` at the same time, point the dependency at a checkout for the length of
the change — `pnpm add @leemour/cli-messaging@link:../cli-messaging` — and put the version back
before the pull request.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build
bin/tg session start          # everything under .tg/ in this checkout, never the real profile
bin/tg chats list --limit 5
pnpm probe:random-id          # sends two probe messages to Saved Messages with one random_id
```

## Licence

MIT.
