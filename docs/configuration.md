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
    "work": { "permissions": { "messages": "readonly", "messages.send": "allow" }, "record": true }
  }
}
```

| Setting | Default | What it does | Overridden for one run by |
|---|---|---|---|
| `embeddingProvider` | `local` | local model or `openai` | `--provider` |
| `embeddingModel` | provider default | embedding model | `--model` |
| `embeddingBaseUrl` | provider default | embedding API endpoint | `--base-url` |
| `embeddingDims` | model default | integer 1–65,536 | `--dims` |
| `analysisProvider` | `agent` | `agent`, `openai` or `anthropic` | `build --provider` |
| `analysisModel` | none; required for `--analyze` | analysis model | `build --model` |
| `analysisBaseUrl` | provider default | analysis API endpoint | `build --base-url` |
| `limit` | `20` | rows per page of a list | `--limit` |
| `timeoutMs` | none | how long **one** request to Telegram may wait, in milliseconds. A command makes several, so for a bound on the whole command use `--timeout` | none (`--timeout` is a different thing) |
| `color` | from the terminal | colour in the table view | none; with no setting, `NO_COLOR` turns it off |
| `senderColors` | `false` | a colour per sender in the table view of messages | none |
| `catchUpMarksRead` | `false` | `inbox` and `review` mark each chat they show read, up to the newest message shown. The other side sees it | `--mark-read`, `--no-mark-read` |
| `record` | `false` | keep every run ([diagnostics.md](diagnostics.md)) | `--record`, `--no-record` |
| `keepRunsForDays` | `30` | recorded runs older than this are removed when the next one is kept | none |
| `permissions` | everything allowed except reply rules sending; deleting and ending sessions ask | what the profile may do, per command ([below](#what-a-profile-may-do)) | none; `--yes` and `--allow-dangerous` only answer `ask`, they never lift `deny` |
| `sendsPerHour` | `30` | the most sends in any hour ([security.md](security.md#the-send-guard)) | none |
| `transcribeWith` | `auto` | who turns voice into text: `auto` (Telegram, else a local model), `messenger` or `local` | `--local`, or `--model`, which implies it |
| `speechModel` | none | which downloaded model `--local` uses (`tg models audio list`) | `--model` |
| `updateCheck` | `true` | the daily "a newer version exists" line; only under `defaults` | none; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` or `CI` turn it off |
| `skillHint` | `true` | a line, at most once a day, for an agent whose copy of tg's skill is missing or older than tg; only under `defaults` | none |
| `readOtherBots` | `false` | a bot profile only: whether `tg bot` may read what other bots on this machine kept — `true`, or a list of profile names ([bot.md](bot.md)) | none; `--all-bots` and `--bots` ask, the setting allows |
| `proxy` | none | the SOCKS5, HTTP `CONNECT` or MTProxy server to reach Telegram through ([below](#through-a-proxy)) | `TG_PROXY` |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | `russian`, `spanish` | the word-stem languages of the whole store, both CLIs and every profile: `russian` or `none`; `spanish`, `english` or `none` ([archive.md](archive.md#repair-and-index-maintenance)) | none |

`defaultProfile` at the top names the profile used when neither the first word nor `TG_PROFILE`
names one. The first word (`tg work …`) and `TG_PROFILE` override it.

## What a profile may do

`permissions` is an object: each key is a command path, each value a level.

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.send": "allow" } } } }
```

| Level | What happens |
|---|---|
| `deny` | nothing, not even reading: refused with exit code `5` before connecting |
| `readonly` | reading works; a change is refused with exit code `5` |
| `ask` | a y/N question in the terminal, no by default ([below](#a-question-before-a-change)) |
| `allow` | it goes ahead and never asks |

**A key is a command path**: `messages`, `messages.delete`, `messages.send`, `reactions`,
`polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. It
starts with a resource — `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `conversations`, `tags`, `searches`, `replies`, `attachments`
or `bot`, and must name a known command or checked write. Unknown command keys are refused by
`config set` with exit 2, including keys inside a whole `permissions` object. `config unset` can remove
an old unknown key. Reading an existing file with one warns on stderr and continues. **The most specific key you set wins**: with the example above,
`messages.send` is allowed and every other change to messages is refused. There is no wildcard:
`messages: readonly` does not touch `reactions`, `polls` or `chats`.

Keys from different sections of the file add up, but **the nearest section decides first, then the
longest key**. A key a profile sets hides the same key and every key under it in `personal.defaults`,
`bot.defaults` and `defaults`. Here profile `agent` cannot delete: its `messages` hides
`messages.delete` from `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

It works both ways: a profile's `messages: allow` also hides `messages.delete: deny` from `defaults`,
and deleting asks again, as it does by default. The older `readOnly` and `allow` count in the section
they are written in.

`inbox`, `review`, `watch`, `serve` and `store fetch`, `export` and `search` show messages, so they
count as `messages`: `messages: deny` stops them too. `config`, `session`, `doctor`, `recipients`,
`mcp` and the store's own upkeep are never limited.

**The defaults allow everything except two things that cannot be undone**: `messages.delete` and
`account.sessions.end` are `ask`. Reply rules may not send until you allow it: `replies.send` is `deny`. A built-in default only tightens: `messages: readonly` still
refuses a deletion, and `messages: allow` keeps the question before a deletion until you set
`messages.delete` itself.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

To make a profile read-only — here the profile `agent` — set each resource:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

### A question before a change

At level `ask`, `tg` shows what will change and asks `go ahead? [y/N]`. An answer other than `y`
does nothing and ends with exit code `130`. A flag answers yes for you: `--allow-dangerous` for a
deletion, the global `--yes` for any other change. With no terminal, or under `--json` or
`--jsonl`, nobody can answer: the change is refused with exit code `7`, `confirmation_required`,
and the error names the flag.

### Older settings that still work

`readOnly: true` reads as every resource `readonly`. A list in `allow` (`send`, `forward`,
`reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`,
`sessions`) reads as those actions `allow` and the rest `readonly`; deleting still asks. A key in
`permissions` of the same section wins over both.

## Change it without opening the file

```sh
tg config set limit 50                        # this profile
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sendsPerHour 10 --defaults      # every profile
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset sendsPerHour                  # back to the default
```

`config set` checks the value against the same rules the reader uses, so it never writes a file
that a later command refuses.

## A typo is an error, not a default

A setting the file does not know stops every command, with exit code `3`:

```text
config.json is not a valid config:
  profiles.default.limt: unknown setting — the known ones are limit, timeoutMs, …
```

A misspelled setting that was silently ignored would run with the default and never say why. The
same holds for a key in `permissions` that does not start with a resource.

## Through a proxy

Where Telegram is blocked, `tg` can reach it through a proxy: SOCKS5, an HTTP proxy that allows
`CONNECT`, or an MTProxy. One `proxy` setting per profile, or for every profile with `--defaults`.
Set it before `tg setup`: the login goes through it too.

```sh
tg config set proxy socks5://proxy.example:1080       # no password: on the command line
tg config set proxy http://alice@proxy.example:3128   # a user without a password
tg config set proxy -                                 # with a password or an MTProxy secret
proxy URL, hidden as you type: tg://proxy?server=mt.example&port=443&secret=ee…
tg config unset proxy
```

| Form | Kind |
|---|---|
| `socks5://[user:password@]host[:port]` | SOCKS5; port 1080 when none is given; `socks5h://` is read the same way |
| `http://[user:password@]host[:port]` | an HTTP proxy, by `CONNECT`; `https://` reaches the proxy itself over TLS |
| `tg://proxy?server=…&port=…&secret=…` or `https://t.me/proxy?…` | an MTProxy, as Telegram shares it; FakeTLS (`ee…`) secrets work |
| `tg://socks?server=…&port=…&user=…&pass=…` | Telegram's share link for a SOCKS5 proxy |

**A password or an MTProxy secret never reaches the settings file.** `config set proxy -` reads the
URL without echo, or from a pipe, keeps the secret in the OS keyring — one per profile, and one for
`--defaults` that a profile uses only with the defaults' proxy — and writes the URL without it;
`config show`, `doctor` and the errors print it the same way. A URL with a secret on the command line
is refused, because `ps` and your shell history would keep it.

`TG_PROXY` takes the whole URL, secret included, and wins over the setting — for CI, or for one try.
`config show` prints the setting from the file; `tg doctor` prints the proxy actually in use.
`ALL_PROXY` and `HTTPS_PROXY` are not read: they are usually set for other tools, and a proxy is
something you choose for this account.

The Bot API (`tg bot …`) and the app registration of `session start --app auto` go through the
same SOCKS5 or HTTP proxy. An MTProxy carries only Telegram's own protocol, so with one they connect
directly; `tg doctor` says which. `--app browser` opens my.telegram.org in your browser, which
uses its own proxy settings.

## Environment variables

| Variable | What it does |
|---|---|
| `TG_PROFILE` | the profile, when the first word does not name one |
| `TG_PROFILE_LOCK` | pins the process to one profile; any other is refused ([sessions.md](sessions.md#profiles)) |
| `TG_TIMEOUT` | the same as `--timeout`: `500ms`, `30s` or `2m` for the whole command |
| `TG_API_ID`, `TG_API_HASH` | the app, instead of the keyring — for CI; both or neither |
| `TG_PROXY` | the proxy URL, password or secret included; wins over the `proxy` setting ([above](#through-a-proxy)) |
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
tg setup
```

Without `MESSAGING_STORE`, what that login reads still goes into your usual local store.

## Next

- [security.md](security.md) — what `permissions`, the recipient list and `sendsPerHour` protect
- [diagnostics.md](diagnostics.md) — `record` and `keepRunsForDays`

## Migrating legacy access settings

`tg config migrate --dry-run --json` previews replacement of `readOnly` and `allow` with
canonical `permissions`, preserving the file's effective levels for personal and bot profiles.
It does not write the file or connect to Telegram. `tg config migrate --json` applies that
migration explicitly; a process locked to one profile cannot apply a change affecting all profiles.
Other settings are preserved. Canonical files need no migration. Once canonical `permissions` are present,
`config set` refuses legacy `readOnly` and `allow` changes; change the corresponding permission keys.

Over `tg mcp --http`, every write requires a form by default. Explicit `--http-confirmation permissions`
follows the effective levels; repeat `--permission key=level` to override them for this server process.
`--yes` and `--allow-dangerous` do not bypass forms over HTTP ([browser setup](remote.md)).
The permission levels still decide which tools the profile may use.

`replies.send` defaults to `deny`; enabling a rule alone does not allow sending. The tester list is a separate requirement.

Embedding and analysis settings are independent and may differ by profile. Environment variables
`TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`,
`TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL`, `TG_ANALYSIS_BASE_URL` override configuration; command flags override
resolved settings. Endpoints must be HTTP/S without embedded credentials, query or fragment. Remote embeddings also
send MCP search query text. Keys use `models text key set openai|anthropic` and stay outside `config.json`.
Ordinary `build` does not start remote analysis: explicit `--analyze` is required.
