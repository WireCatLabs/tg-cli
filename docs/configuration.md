# Configuration

Every setting, every variable, and which one wins. No setting can hold a secret: the file has no
field for a session, an app hash, a phone number or a chat id.

## Which value wins

For each setting, the first of these that is set:

1. an option on the command line (`--limit 50`, `--record`, `--timeout 30s`)
2. an environment variable (`TG_PROFILE`, `TG_TIMEOUT`)
3. the profile's own entry in the config file
4. `defaults` in the config file, shared by every profile
5. the built-in default

```sh
tg chats list --limit 5     # 5: the option
# "limit": 50 in the profile's entry — when there is no option
# "limit": 30 in "defaults" — when the profile has none either
# 20 — when nothing is set
```

Not every setting has all five. The table below says which ones exist.

## What is in force now

```sh
tg config show
tg work config show
```

It lists the profile, where the profile name came from, the profiles the file names, the path of
the file and whether it exists, and every setting with its value and **where that value came from**:
`flag`, an environment variable, `config file`, `config defaults` or `default`. `--json` gives the
same as one object, for a script.

The list ends with `commandTimeoutMs`: the bound on a whole command from `--timeout` or `TG_TIMEOUT`.
It is not a setting of the file.

When `TG_CONFIG_DIR`, `TG_STATE_DIR` or `TG_CACHE_DIR` is set, it says so on stderr, since that also
changes which login is found ([sessions.md](sessions.md#where-the-parts-are-kept)).

⚠ **It is not a health check.** It reads files: it opens no store, asks no keyring and does not
connect. Whether the session still works is a question for `tg doctor --online`
([troubleshooting.md](troubleshooting.md#first-tg-doctor)).

## The file

`config.json` in the settings directory (`~/.config/tg-cli/config.json` on Linux; the other systems
are in [installation.md](installation.md#where-files-go)).

```json
{
  "defaultProfile": "default",
  "defaults": {
    "sendsPerHour": 10,
    "updateCheck": false
  },
  "profiles": {
    "default": { "limit": 50 },
    "work": { "allow": ["send", "reaction"], "record": true }
  }
}
```

| Setting | Default | What it does |
|---|---|---|
| `limit` | `20` | rows per page of a list; `--limit` overrides it |
| `timeoutMs` | none | how long **one** request to Telegram may wait, in milliseconds. A command makes several, so for a bound on the whole command use `--timeout` |
| `color` | from the terminal | colour in the table view; `NO_COLOR` also turns it off |
| `senderColors` | `false` | a colour per sender in the table view of messages |
| `record` | `false` | keep every run ([diagnostics.md](diagnostics.md)); `--record` and `--no-record` override it |
| `keepRunsForDays` | `30` | recorded runs older than this are removed when the next one is kept |
| `readOnly` | `false` | the profile sends nothing and changes nothing in Telegram |
| `allow` | everything | only these actions: `send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions` |
| `sendsPerHour` | `30` | the most sends in any hour ([security.md](security.md#the-send-guard)) |
| `transcribeWith` | `auto` | who turns voice into text: `auto` (Telegram, else a local model), `messenger` or `local` |
| `speechModel` | none | which downloaded model `--local` uses (`tg models audio list`) |
| `updateCheck` | `true` | the daily "a newer version exists" line; only under `defaults` |

`defaultProfile` at the top names the profile used when neither the first word nor `TG_PROFILE`
names one.

`allow` has no "everything" value: leaving it out allows every action, and a list allows only what it
names. `read` is marking a chat read; reading itself is never limited.

## Change it without opening the file

```sh
tg config set limit 50                        # this profile
tg work config set allow send,reaction        # profile "work"; a list is comma-separated
tg config set sendsPerHour 10 --defaults      # every profile
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset readOnly                      # back to the default
```

`config set` checks the value against the same rules the reader uses, so it never writes a file
that a later command refuses.

## A typo is an error, not a default

A setting the file does not know stops every command, with exit code `3`:

```text
config.json is not a valid config:
  profiles.default.limt: unknown setting — the known ones are limit, timeoutMs, …
```

A misspelled setting that was silently ignored would run with the default and never say why.

## Environment variables

| Variable | What it does |
|---|---|
| `TG_PROFILE` | the profile, when the first word does not name one |
| `TG_PROFILE_LOCK` | pins the process to one profile; any other is refused ([sessions.md](sessions.md#profiles)) |
| `TG_TIMEOUT` | the same as `--timeout`: `500ms`, `30s` or `2m` for the whole command |
| `TG_API_ID`, `TG_API_HASH` | the app, instead of the keyring — for CI; both or neither |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | move the three directories — and the keyring entry with them |
| `MESSAGING_STORE` | the path of the local store file |
| `CLI_COMMON_CACHE_DIR` | where speech models are kept |
| `TG_NO_UPDATE_CHECK` | `1` turns off the daily "a newer version exists" line |
| `NO_COLOR` | no colour in the table view |
| `XDG_RUNTIME_DIR` | on Linux, how the keyring is reached; cron and ssh often leave it out |

## A separate set of settings for a while

Point the three directories somewhere else, and `tg` has a fresh config, login and runs there. It
does not see your usual login, because the keyring entry moves with them:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/messages.db
tg session start
```

Without `MESSAGING_STORE`, what that login reads still goes into your usual local store.

## Next

- [security.md](security.md) — what `readOnly`, `allow`, the recipient list and `sendsPerHour` protect
- [diagnostics.md](diagnostics.md) — `record` and `keepRunsForDays`
