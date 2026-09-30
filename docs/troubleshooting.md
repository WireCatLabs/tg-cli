# Troubleshooting

By symptom: what the screen says, and what to do. Every error names its exit code in `--json`
output (`"code": "..."`); the numbers are in [commands.md](commands.md#exit-codes).

## First: `tg doctor`

```sh
tg doctor
```

It connects to nothing and shows where `tg` looks for everything: the config file, the session, the
app credentials, the local store, the runs. Most problems below show up there. `tg doctor --online`
also connects once and reads the account.

## `tg` is not found after installing

The folder npm installs commands into is not on your `PATH`. `npm prefix -g` prints its parent; add
its `bin` folder to `PATH` in your shell's startup file. With pnpm, `pnpm setup` does it.

## "no session for profile "default" — run `tg session start`"

Exit code `4`. This profile has never logged in on this machine, or it logged out. Check which
profile you meant: the first word of the command, or `TG_PROFILE` ([sessions.md](sessions.md#profiles)).

If you are sure you logged in, check whether `TG_CONFIG_DIR`, `TG_STATE_DIR` or `TG_CACHE_DIR` is set
now but was not then, or the other way round. They move the login. `tg config show` says when one is
set.

## "no Telegram app credentials found … although it has logged in on this machine"

Exit code `4`. The session is here, but the keyring cannot be reached. It happens under cron, over
ssh, in a service, and in MCP clients that start `tg` with a trimmed environment.

**Do not log in again.** That adds another device and fixes nothing. On Linux, set
`XDG_RUNTIME_DIR` (usually `/run/user/` followed by the number `id -u` prints):

```sh
XDG_RUNTIME_DIR=/run/user/$(id -u) tg chats list
```

For cron, see [recipes.md](recipes.md#running-on-a-schedule). The keyring may also be locked until
you log in to the computer.

## "not logged in, or the session was ended — run `tg session start`"

Exit code `4`. Telegram no longer accepts the session: it was ended from another device (Settings →
Devices in the app), or by `tg session end`. Log in again with `tg session start`.

## "`tg session start` asks questions — run it in a terminal"

Exit code `2`. The login needs a person to scan a code or type one. Run it in a terminal. For an agent,
`--qr-file login.png` writes the QR code to a file instead ([sessions.md](sessions.md#when-an-agent-runs-the-login)).

## The answer comes from the wrong profile

The first word is the profile whenever it is not a command, so a typo in a command name is read as a
profile. `tg config show` names the profile and where it came from. `TG_PROFILE` in your environment
also picks one; `TG_PROFILE_LOCK` refuses every other.

## "… is not a valid config"

Exit code `3`. `config.json` has a setting `tg` does not know, or a value of the wrong type. The error
names the setting and the profile it is under. Fix it by hand, or remove the setting with
`tg config unset <setting>` ([configuration.md](configuration.md#a-typo-is-an-error-not-a-default)).

## "--timeout takes a duration with a unit — 30s, 2m or 500ms"

Exit code `2`. `--timeout` and `TG_TIMEOUT` take `ms`, `s` or `m`. There is no `h`: write `120m` for
two hours. `--since` and `--after`, on the other hand, take `30m`, `2h`, `1d` or an ISO 8601 time.

## "--all and --page ask for different things; use one or the other"

Exit code `2`. `--all` is every row; `--page` is one page of them. Pick one.

## "… matches 3 chats — name one by its id"

Exit code `2`. The title you gave fits several chats. The error lists them with their ids, and the
JSON carries them as `candidates`. Repeat the command with the id. `tg` never guesses: a message to
the wrong chat cannot be taken back.

## "no chat matches …"

Exit code `6`. No chat title contains what you typed. Try `tg chats list --search <part of it>`, the
chat's id, its `@username`, or `me` for Saved Messages.

## "Telegram asks to wait N s before the next request"

Exit code `8`. Telegram's own rate limit (FLOOD_WAIT). Wait that long; the JSON carries
`retryAfterMs`. It happens most after many requests in a row, such as `chats list --all` right after
other commands, or a long `store fetch`. For `store fetch`, a longer `--pause` helps.

## "profile … has sent N messages in the hour …"

Exit code `8`. The profile's own hourly limit (`sendsPerHour`, 30 by default). The error says when
the next send is possible. Raise the limit only if you meant to send that many:
`tg config set sendsPerHour <n>`.

## "chat … is not on the recipient list of profile …"

Exit code `7`. The recipient list is on, and this chat is not on it. Add it yourself if you want to
allow it: `tg recipients add <chat>`. An agent should stop here and ask you.

## "profile … is read-only" or "profile … does not allow …"

Exit code `5`. `readOnly` or `allow` in the settings refused it. The error says which setting, and
where it was set ([configuration.md](configuration.md)).

## `outcome_unknown` after a send

Exit code `14`. The connection broke after the message left, so it may have gone. **Do not send it
again as it is.** Repeat with the `--send-id` from the error; Telegram drops the second copy:

```sh
tg messages send <chat> "<the same text>" --send-id <id from the error>
```

After `--at`, look in `tg messages scheduled <chat>` instead: a scheduled send is never repeated.

## "the message store was written by a newer version …"

Exit code `3`. Another CLI, or a newer `tg`, upgraded the local store in a way this version cannot
read. Run `tg upgrade`. Nothing in the store is lost ([store.md](store.md#the-store-and-other-versions)).

## "nothing recorded for profile … yet — run the command once without --offline"

Exit code `6`. `--offline`, `messages search`, `store status` and `store export` answer only from the
local store, and this profile has not read anything into it yet. Run one command online first, for
example `tg chats list`.

## `messages search` finds nothing

Search reads only what this machine has kept, never Telegram. An empty answer means "not kept", not
"never said". Read the chat (`tg messages list <chat>`), or fetch its history with `tg store fetch`,
then search again ([store.md](store.md#search)).

## "tg serve is already running for profile …"

Exit code `2`. One `serve` per profile. `tg server status` says which process and since when;
`tg server stop` stops one started by `server start` or the unit.

## The background server does not start

`tg server logs` says why. Under a service, the usual reason is the keyring: a service starts before
the keyring is open, or without `XDG_RUNTIME_DIR`. After moving Node or `tg`, run
`tg server install` again: the unit runs the paths that installed it ([store.md](store.md#as-a-service)).

## A command hangs

Every one-shot command closes its connection and exits. If one waits too long, bound it with
`--timeout 30s` and look at what it did with `--trace` ([diagnostics.md](diagnostics.md)). `watch` and
`serve` are meant to run until stopped.

## `npx @leemour/tg-cli` runs an old version

npx keeps what it downloaded. Ask for the newest: `npx @leemour/tg-cli@latest`.

## Report a problem

```sh
tg doctor report create
```

It writes a file with what `tg doctor` shows and the last failed run — no message text — and says
where to send it: a new issue at [github.com/leemour/tg-cli/issues](https://github.com/leemour/tg-cli/issues/new).
Read it before you attach it ([diagnostics.md](diagnostics.md#a-problem-report)).
