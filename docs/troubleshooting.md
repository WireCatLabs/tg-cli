# Troubleshooting

By symptom: what the screen says, and what to do. In `--json` output every error is one line on
stderr, `{"error":{"code":"…","message":"…"}}`, and the exit code says the same as the `code`. The
numbers are in [commands.md](commands.md#exit-codes).

## By exit code

| Code | Name | What it usually means | Where |
|---|---|---|---|
| `1` | `generic_failure` | a typo in a command name, or a fault in `tg` itself | [unknown command](#error-unknown-command-), [report it](#report-a-problem) |
| `2` | `validation_error` | a value or a combination of options `tg` does not accept; a name that fits several chats | [values](#--limit-takes-a-whole-number-from-1-upwards), [several chats](#-matches-3-chats--name-one-by-its-id) |
| `3` | `configuration_error` | `config.json` is wrong, or the store is newer than this `tg` | [config](#-is-not-a-valid-config), [store](#the-message-store-was-written-by-a-newer-version-) |
| `4` | `authentication_error` | not logged in, the session was ended, or the keyring cannot be reached | [no session](#no-session-for-profile-default--run-tg-setup) |
| `5` | `permission_error` | the profile's `permissions` refused it, or Telegram did | [not allowed](#profile--does-not-let--write-or-profile--denies-), [Telegram refused](#telegram-refused-) |
| `6` | `not_found` | no such chat, message or person; nothing in the store yet | [no chat](#no-chat-matches-), [nothing recorded](#nothing-recorded-for-profile--yet--run-the-command-once-without---offline) |
| `7` | `confirmation_required` | the chat is not on the recipient list, or the change asks first and nobody could answer | [recipient list](#chat--is-not-on-the-recipient-list-of-profile-), [asks first](#-asks-before-it-acts) |
| `8` | `rate_limited` | the hourly limit, or Telegram asks you to wait | [hourly limit](#profile--has-sent-n-messages-in-the-hour-), [FLOOD_WAIT](#telegram-asks-to-wait-n-s-before-the-next-request) |
| `9` | `timeout` | Telegram did not answer in time, or `--timeout` ended the command | [a command hangs](#a-command-hangs) |
| `10` | `network_error` | Telegram cannot be reached from here | [cannot reach](#cannot-reach-telegram-) |
| `11` | `provider_error` | Telegram refused the request | [Telegram refused](#telegram-refused-) |
| `12` | `provider_unavailable` | Telegram failed on its side | [Telegram failed](#telegram-failed-) |
| `13` | `invalid_response` | an answer `tg` cannot read — so far only from my.telegram.org | [my.telegram.org](#mytelegramorg-says-the-app-was-created-but-its-page-shows-none) |
| `14` | `outcome_unknown` | the connection broke after a message left: it may have gone | [outcome unknown](#outcome_unknown-after-a-send) |
| `130` | `cancelled` | you pressed Ctrl-C, or answered no to a question | [Ctrl-C](#ctrl-c) |

## First: `tg doctor`

```sh
tg doctor
```

It connects to nothing and shows what every command depends on: the version and the runtime, the
config file, the session and the app credentials and whether a `TG_*_DIR` variable moved them, the
local store, the journal of sends and the recorded runs. **It answers even when everything else is
broken** — that is when you run it. A profile with no session is a line in the answer, not an error:
the exit code stays `0`. It never prints the session or the app hash, only whether they exist.

```sh
tg doctor --online
```

`--online` also connects once and reads the account. It sends nothing and marks nothing read.

## `tg` is not found after installing

The folder npm installs commands into is not on your `PATH`.

- **Linux and macOS.** It is `$(npm prefix -g)/bin`. Add it to `PATH` in `~/.zshrc` or `~/.bashrc`:
  `export PATH="$(npm prefix -g)/bin:$PATH"`.
- **Windows.** npm puts commands in the folder `npm prefix -g` prints, usually `%APPDATA%\npm`.
  Check that it is in `$env:Path`. A terminal opened before Node was installed does not see the new
  `PATH`: open a new one.
- **PowerShell says "running scripts is disabled on this system".** npm installs `tg.ps1` beside
  `tg.cmd`, and PowerShell blocks scripts by default. Run `tg.cmd`, which always works, or allow
  scripts for your account: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Another `tg` comes first.** Some other program may be called `tg` too. `which -a tg` (or
  `Get-Command tg -All` in PowerShell) lists every one; call ours by its full path, or put its folder
  first.

Without installing, `npx @leemour/tg-cli doctor` works too.

## "error: unknown command '…'"

Exit code `1`, and the help on stderr, not JSON. The first word is the profile whenever it is not a
command, so a typo in a command name becomes a profile name:

```text
tg chat list
error: unknown command 'list'
```

Here `chat` was read as a profile, and `list` is not a command. The command is `chats`, plural.
`tg --help` lists them all.

## "no session for profile "default" — run `tg setup`"

Exit code `4`. This profile has never logged in on this machine, or it logged out. Check which
profile you meant: the first word of the command, or `TG_PROFILE` ([sessions.md](sessions.md#profiles)).

```sh
tg setup                    # guided first run
tg work chats list          # or name the profile you logged in to
```

If you are sure you logged in, check whether `TG_CONFIG_DIR`, `TG_STATE_DIR` or `TG_CACHE_DIR` is set
now but was not then, or the other way round — in another terminal, say. They move the login.
`tg config show` says when one is set; `env | grep TG_` shows them all.

For a first run without app keys, the error names `tg setup` (or `tg work setup` for a work
profile). Read `tg setup --help` for login choices. Agents can read `tg skill show` before login.
An interrupted or expired session still needs `tg session start`, then another setup check.

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

## "my.telegram.org says the app was created, but its page shows none"

Exit code `13`, during `tg session start --app auto`. The site has no API, so `tg` follows its web
form, and the form changed or answered unexpectedly. The other errors from the site are exit code
`11`, with what the site said. Use the default way instead: `tg session start` opens the site in your
browser, and you paste the app id and hash ([sessions.md](sessions.md#the-app-from-mytelegramorg)).

## The answer comes from the wrong profile

`tg config show` names the profile and where it came from. `TG_PROFILE` in your environment picks
one; `TG_PROFILE_LOCK` refuses every other. A typo in a command name is read as a profile
([above](#error-unknown-command-)).

## "… is not a valid config"

Exit code `3`. `config.json` has a setting `tg` does not know, or a value of the wrong type. The error
names the setting and the profile it is under. It is refused on purpose: a setting silently ignored
costs half a day. Fix it by hand, or remove it with `tg config unset <setting>`
([configuration.md](configuration.md#a-typo-is-an-error-not-a-default)).

## "--limit takes a whole number from 1 upwards"

Exit code `2`. The same for `--page`. Without this check, a value that is not a number would quietly
cut the list to nothing.

## "--after-time takes an ISO 8601 time or 30m, 2h, 1d ago"

Exit code `2`. `--since-time` says the same about itself. They take an ISO 8601 time (`2026-09-20T09:00`) or "this long
ago" (`30m`, `2h`, `1d`). A message id goes to `--after-id` or `--before-id` instead.

## "--at-time takes a time like 2026-09-25T09:00 or a delay like 30m, 2h, 1d"

Exit code `2`. `--at-time` is a local time, or a delay from now in minutes, hours or days — not seconds. It
must be at least a minute from now and at most a year.

## "--timeout takes a duration with a unit — 500ms, 30s, 2m, 4h or 1d"

Exit code `2`. `--timeout` and `TG_TIMEOUT` take a number with `ms`, `s`, `m`, `h` or `d`; a bare
number is refused.

## "--all and --page ask for different things; use one or the other"

Exit code `2`. `--all` is every row; `--page` is one page of them. It is a refusal, not a choice of
one: whichever won, you would only find out from a wrong answer.

## "… matches 3 chats — name one by its id"

Exit code `2`. The title you gave fits several chats. The error lists them with their ids, and the
JSON carries them as `candidates`. Repeat the command with the id. `tg` never guesses: a message to
the wrong chat cannot be taken back.

## "no chat matches …"

Exit code `6`. No chat title contains what you typed. Try `tg chats list --search <part of it>`, the
chat's id, its `@username`, or `me` for Saved Messages. A one-to-one chat is titled with the other
person's name as Telegram shows it to you.

## "Telegram does not know that (…)"

Exit code `6`. Telegram answered that the chat, the user, the username or the message does not exist
for this account: `PEER_ID_INVALID`, `USERNAME_NOT_OCCUPIED`, `MSG_ID_INVALID` and the like. The
message may have been deleted, or the id belongs to another chat. `contacts lookup` answers "nobody
Telegram lets you find has this number" when the person hides their number or has no account.

## "Telegram asks to wait N s before the next request"

Exit code `8`. Telegram's own rate limit (FLOOD_WAIT). Wait that long; the JSON carries
`retryAfterMs`. It happens most after many requests in a row, such as `chats list --all` right after
other commands, or a long `store fetch`. For `store fetch` and `messages download --all`, a longer
`--pause` helps.

## "profile … has sent N messages in the hour …"

Exit code `8`. The profile's own hourly limit (`sendsPerHour`, 30 by default). The error says when
the next send is possible. Raise the limit only if you meant to send that many:
`tg config set sendsPerHour <n>`.

## "chat … is not on the recipient list of profile …"

Exit code `7`. The recipient list is on, and this chat is not on it. Add it yourself if you want to
allow it: `tg recipients add <chat>`. An agent should stop here and ask you.

## "profile … does not let … write" or "profile … denies …"

Exit code `5`, before anything is sent to Telegram. The profile's `permissions` refused it: `deny`
stops reading too, `readonly` stops a change. The error says which key, where it was set, and the
command that allows it ([configuration.md](configuration.md#what-a-profile-may-do)). An agent should
stop and ask you, not change the setting.

## "… asks before it acts"

Exit code `7`. The command's level is `ask`, and nobody could answer: there is no terminal, or the
command ran with `--json` or `--jsonl`. The error names the flag that answers yes:
`--allow-dangerous` for a deletion, `--yes` for any other change. Add it only if you meant it. An
agent should stop and ask you.

## "Telegram refused: …"

Telegram turned the request down and named why. Exit code `5` when Telegram answers that this account
is not allowed to do it, `11` for the rest. The name after "refused" is Telegram's own, and the JSON
carries it as `providerError`; the message never repeats what you typed. Some have their own
sentence:

- **"Telegram transcribes only for Premium accounts…"** — exit code `5`. Use a model on this machine:
  `tg models audio download parakeet-v3`, then `tg messages transcribe <chat> <id> --local`.
- **"that message is not a voice or video note"** — exit code `2`: the id points at another message.
- **"Telegram could not transcribe this voice message"** — exit code `11`; try `--local`.

## "Telegram failed: …"

Exit code `12`. A fault on Telegram's side. Nothing was changed by `tg`; try again in a minute. If it
was a send, check the chat before you repeat it.

## "cannot reach Telegram (…)"

Exit code `10`. The connection could not be made or broke: no network, a firewall, a proxy, or DNS.
The code in brackets says which (`ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`). Commands that answer from
the store work without the network: `tg --offline chats list`.

## `outcome_unknown` after a send

Exit code `14`. The connection broke after the message left, so it may have gone. It is neither a
success nor a failure. **Do not send it again as it is.** Repeat with the `--send-id` from the error;
Telegram drops the second copy:

```sh
tg messages send <chat> "<the same text>" --send-id <id from the error>
```

After `--at-time`, look in `tg messages scheduled <chat>` instead: a scheduled send is never repeated.

## A command hangs

Every one-shot command closes its connection and exits. When Telegram does not answer, the command
ends with exit code `9` and `timeout`. To bound it yourself, and to see where it stops:

```sh
tg --timeout 30s --trace chats list
```

`--timeout` covers the whole command, the login included, and ends it with exit code `9` after closing
the connection. In `--trace`, a line `→` with no `←` after it is a request that went out and never
came back: the network or Telegram, not `tg` ([diagnostics.md](diagnostics.md)).

If a command printed its answer and still does not exit, that is a fault. `tg` names what stayed open
five seconds after a command finished (`tg: finished, but … stayed open`) and exits; report it with
that line. `watch`, `serve` and `mcp` are meant to run until stopped.

## Ctrl-C

Exit code `130`. The command stopped where it was and closed its connection. If you pressed it during
a send, the message may have gone: look at the chat (`tg messages list <chat> --limit 3`) before you
send it again. A background `store fetch` keeps running: stop it with `tg store jobs cancel <job>`.

An answer other than `y` to a question before a change ends the same way: nothing was done.

## "the message store was written by a newer version …"

Exit code `3`. Another CLI, or a newer `tg`, upgraded the local store in a way this version cannot
read. Run `tg upgrade`. Nothing in the store is lost ([archive.md](archive.md#the-store-and-other-versions)).

## "nothing recorded for profile … yet — run the command once without --offline"

Exit code `6`. `--offline`, `messages search`, `store status` and `store export` answer only from the
local store, and this profile has not read anything into it yet. Run one command online first, for
example `tg chats list`.

## `messages search` finds nothing

Search reads only what this machine has kept, never Telegram. An empty answer means "not kept", not
"never said". Read the chat (`tg messages list <chat>`), or fetch its history with `tg store fetch`,
then search again ([archive.md](archive.md#search)). `tg store check` says which chats are behind.

## "tg serve is already running for profile …"

Exit code `2`. One `serve` per profile. `tg server status` says which process and since when;
`tg server stop` stops one started by `server start` or the unit.

## The background server does not start

`tg server logs` says why. Under a service, the usual reason is the keyring: a service starts before
the keyring is open, or without `XDG_RUNTIME_DIR`. After moving Node or `tg`, run
`tg server install` again: the unit runs the paths that installed it ([archive.md](archive.md#as-a-service)).

## `npx @leemour/tg-cli` runs an old version

npx keeps what it downloaded. Ask for the newest: `npx @leemour/tg-cli@latest`.

## Report a problem

```sh
tg doctor report           # what a report holds, and what it never holds; writes nothing
tg doctor report create    # write it to a file, and say where to send it
tg doctor report create --run <id>    # about another run; ids from tg runs list
```

`create` writes `tg-report-<time>.json` to the current folder (or `--output`), readable only by you.
It holds the version, the runtime and the system, what `tg doctor` answers, the newest failed run —
each request's operation, duration and error code — and the last 20 send attempts, outcome and length
only. Every chat, message and account id is replaced by a label that means nothing outside the file.
It holds no message text, chat titles, names, phone numbers, session or app credentials. A failed run
is kept by itself, even without `--record` ([diagnostics.md](diagnostics.md#a-problem-report)).

Send it as a new issue at
[github.com/leemour/tg-cli/issues](https://github.com/leemour/tg-cli/issues/new): say what you did
and what happened, and attach the file. Issues are public, the file too: read it before you attach
it.

⚠ Never attach the state folder, the session file or `~/.local/share/cli-messaging/` — they hold your
login and your messages.
