# tg-cli

A local command line interface for a personal Telegram account, built for agents and scripts: one
operation per call, one JSON value on stdout when piped, a typed error and a stable exit code on
failure.

**Status: spike, not published.** It proves the transport and measures what was unknown. The design
is [the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md)
in `cli-messaging`, which holds everything messenger-neutral. Telegram-specific code lives only in
`src/telegram/`, and a lint rule keeps mtcute there.

## Before the first login

Register your own app at [my.telegram.org/apps](https://my.telegram.org/apps). `tg session start`
asks for its `api_id` and `api_hash` the first time and keeps them in the OS keyring. Telegram allows
one app per phone number and watches accounts that use unofficial clients, so an app id is never
shared between users.

## Commands so far

```sh
tg session start [qr|phone]      # QR by default; phone asks for the code and the 2FA password
tg session end                   # logs out on Telegram's side and deletes the session here
tg account show
tg chats list [--limit n]
tg messages list <chat> [--limit n] [--before id]
tg messages send <chat> [text] [--send-id id]   # text from stdin when omitted
```

`<chat>` is a title or part of one, an id, `@username`, or `me` for Saved Messages. An ambiguous
title is an error listing the candidates, never a guess.

## Development

`cli-messaging` must be checked out beside this repository and built (`pnpm install && pnpm build`
there).

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
