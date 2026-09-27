# tg-cli

A local command line interface for a personal Telegram account, built for agents and scripts: one
operation per call, one JSON value on stdout when piped, a typed error and a stable exit code on
failure.

**Status: spike, not published.** It proves the transport and measures what was unknown. The design
is [the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md)
in `cli-messaging`, which holds everything messenger-neutral. Telegram-specific code lives only in
`src/telegram/`, and a lint rule keeps mtcute there.

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
tg messages reply <chat> <id> [text]            # or: tg messages reply msg:telegram/… [text]
tg recipients list|add|remove|off   # the chats this profile may send to, once the list is on
tg sends list                    # every attempt to send, never the text
tg runs list [--limit n]         # recorded runs, newest first
tg runs show <run-id>            # one run: its outcome and one line per Telegram call
tg runs path <run-id>
tg commands                      # every command as JSON, with the output contract version
tg config show|set|unset         # the settings in force and where each came from
tg complete zsh|bash|fish|powershell   # shell completion: source <(tg complete zsh)
tg doctor [--online]             # the installation's state; --online connects once
```

**Every read is kept.** What `chats list`, `messages list` and `messages send` see is saved to a
local store shared with other messenger CLIs (`~/.local/share/cli-messaging/messages.db` on Linux;
`MESSAGING_STORE` points it elsewhere). `--offline` answers `chats list`, `messages list|show|context` and `contacts list` from it
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
