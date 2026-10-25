# Configuration reference

Use this page when you need the exact name, type, default or scope of a setting, or the name of an
environment variable. It lists every setting `tg` reads, every way to override it, and which value
wins. For everyday changes and an example file, start with the [configuration guide](configuration.md).
How commands, output and exit codes behave is in the [CLI contract](cli-contract.md).

Words this page uses:

- **Section**: a part of the settings file. `defaults` applies to every profile, `profiles.<name>`
  to one profile, `personal.*` only to personal-account commands, and `bot.*` only to bot commands.
- **Scope**: the sections where a setting is allowed. A setting outside its scope is an error.
- **Source**: where the value in force came from: an option, an environment variable, a section of
  the file, or the built-in default.

No setting can hold a secret: the file has no field for a session, an app hash, a phone number or a
chat id.

A short example file and a full one with every section, each part explained, are in the
[configuration guide](configuration.md#an-example-settings-file).

## Which value wins

For each setting, the first of these that is set:

1. an option on the command line (`--limit 50`, `--record`, `--timeout 30s`)
2. an environment variable (`TG_PROFILE`, `TG_TIMEOUT`)
3. the profile's own entry in the config file
4. `defaults` in the config file, shared by every profile
5. the built-in default

```sh
tg personal chats list --limit 5  # 5: the option
# "limit": 50 in the profile's entry — when there is no option
# "limit": 30 in "defaults" — when the profile has none either
# 20 — when nothing is set
```

Inside the file, the most specific section wins. For a personal-account command on the profile
`work`: `personal.profiles.work`, then `profiles.work`, then `personal.defaults`, then `defaults`.
For `tg work bot …` the same, with `bot` in place of `personal`.

Not every setting has all five ways. The [table of settings](#the-file) says which ones exist.

## What is in force now

```sh
tg personal config show
tg work config show
tg shop config show --bot
```

It lists the profile, where the profile name came from, the profiles the file names, the path of
the file and whether it exists, and every setting with its value and **where that value came from**:
`flag`, an environment variable, `config file`, `config defaults` or `default`. `--bot` shows the
settings as a bot command of that profile gets them. `--json` gives the same as one object, for a
script.

The list ends with `command_timeout_ms`: the limit on a whole command, from `--timeout` or `TG_TIMEOUT`.
It is not a setting of the file; `timeout_ms` limits one request.

When `TG_CONFIG_DIR`, `TG_STATE_DIR` or `TG_CACHE_DIR` is set, it says so on stderr, since that also
changes which login is found ([where the login parts are kept](sessions.md#where-the-parts-are-kept)).

⚠ **It is not a health check.** It creates the starter configuration if absent, then reads files. It
opens no store, asks no keyring and does not connect. Whether the session still works is a question
for `tg personal doctor --online` ([troubleshooting with tg doctor](troubleshooting.md#first-tg-personal-doctor)).

## The file

`config.json` in the settings directory (`~/.config/tg-cli/config.json` on Linux; other systems are
listed in [where files go](installation.md#where-files-go)). The first command that reads settings
creates it with `limit`, `keep_runs_for_days`, `sends_per_hour`, `update_check` and `skill_hint` under
`defaults`; an existing file is never replaced.

```json
{
  "defaults": {
    "sends_per_hour": 10,
    "update_check": false
  },
  "profiles": {
    "default": { "limit": 50 },
    "work": { "permissions": { "messages": "readonly", "messages.send": "allow" }, "record": true }
  },
  "personal": { "defaults": { "search_catch_up": true } },
  "bot": { "profiles": { "shop": { "sends_per_hour": 200 } } }
}
```

- `defaults`: every profile, personal accounts and bots.
- `profiles.<name>`: one profile, whichever way it is used.
- `personal.defaults`, `personal.profiles.<name>`: only personal-account commands.
- `bot.defaults`, `bot.profiles.<name>`: only `tg <name> bot …` commands.

No setting picks a profile: the first word (`tg work …`) or `TG_PROFILE` names it. Without either, a
command that uses an account stops with exit code `2` and lists the profiles on this computer.

| Setting | Default | What it does | Overridden for one run by |
|---|---|---|---|
| `limit` | `20` | rows per page of a list | `--limit` |
| `timeout_ms` | none | how long **one** request to Telegram may wait, in milliseconds. A command makes several, so for a limit on the whole command use `--timeout` | none (`--timeout` is a different thing) |
| `color` | from the terminal | colour in the table view | none; with no setting, `NO_COLOR` turns it off |
| `sender_colors` | `false` | a colour per sender in the table view of messages | none |
| `search_catch_up` | `false` | `messages sync` and `store gaps repair` also prepare the fetched chat for local search: its graph and, where installed, its vectors. Never downloads models or calls remote providers | `--catch-up`, `--no-catch-up` |
| `picture_search` | `false` | search stored pictures by what they show. `images embed` reads the stored pictures once the model is downloaded, and then `search messages` also returns a `pictures` list ([pictures](search.md#pictures-by-what-they-show)) | none |
| `record` | `false` | keep every run ([diagnostics](diagnostics.md)) | `--record`, `--no-record` |
| `keep_runs_for_days` | `30` | recorded runs older than this are removed when the next one is kept | none |
| `permissions` | everything allowed, except: deleting, ending sessions and a few other changes ask; reply rules may not send | what the profile may do, per command ([below](#what-a-profile-may-do)) | none; `--yes` and `--allow-dangerous` only answer `ask`, they never lift `deny` |
| `sends_per_hour` | `30`; a bot has none until it is set in the `bot` section | the most sends in any hour ([the send guard](security.md#the-send-guard)) | none |
| `requests_per_minute` | unset, which means `60` | requests a minute after a burst of 20, shared by every process of the profile; `0` turns it off ([limits and waits](limits.md)) | `TG_REQUESTS_PER_MINUTE` |
| `transcribe_with` | `auto` | who turns voice into text: `auto` (Telegram, else a local model), `messenger` or `local` | `--local`, or `--model`, which implies it |
| `speech_model` | none | which downloaded model `--local` uses (`tg personal models list kind:audio`) | `--model` |
| `proxy` | none | the SOCKS5, HTTP `CONNECT` or MTProxy server to reach Telegram through ([below](#through-a-proxy)) | `TG_PROXY` |
| `read_other_bots` | `false` | a bot only: whether `tg personal bot` may read what other bots on this machine kept — `true`, or a list of profile names ([bots](bot.md)) | none; `--all-bots` and `--bots` ask, the setting allows |
| `update_check` | `true` | the daily "a newer version exists" line; only under `defaults` | none; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` or `CI` turn it off |
| `skill_hint` | `true` | a line, at most once a day, for an agent whose copy of tg's skill is missing or older than tg; only under `defaults` | none |
| `embedding_provider` | `local` | local model or `openai` | `--embedding-provider` |
| `embedding_model` | provider default | embedding model | `--model` |
| `embedding_base_url` | provider default | embedding API endpoint | `--base-url` |
| `embedding_dims` | model default | integer 1–65,536 | `--dims` |
| `models` | none | external models by purpose ([below](#models-by-purpose)) | `TG_MODELS_*` variables |
| `search_stemmers.cyrillic`, `search_stemmers.latin` | `russian`, `english,spanish` | the word-stem languages for search in the whole store ([below](#search-languages)) | none |
| `phone_countries` | `ru` | country codes, comma-separated, that read a phone number written without `+` (`es,ru`); the first that fits wins ([search](query-language.md)) | none |
| `task_categories.<name>` | the built-in list | one category a task can take: a meaning, then trigger words ([tasks](groups.md#what-waits-on-you)) | none |
| `task_agent_close` | `on` | `off` makes every close by an agent a suggestion | none |
| `task_agent_close_min` | `0.8` | the least `--certainty` at which an agent's close is accepted | none |
| `task_first_pass_per_chat` | `0` | how many tasks the first sync may open per chat | none |
| `account_groups.<name>` | none | a named list of accounts for `--source group:<name>`, for example `tg:work,max:Alice,email:me@x` | none |

The file is written `0600`, readable by you only, in a `0700` folder, and `config set` keeps it so. It holds no
secret. `tg doctor` names the file or its folder when other users can read it ([diagnostics](diagnostics.md#check-the-installation-tg-personal-doctor)).

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
`messages.sync`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. It
starts with a resource — `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`,
`bot`, `conversations`, `tags`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`,
`store` or `metadata` — and must name a known command or checked write. Unknown command keys are
refused by `config set` with exit code 2, including keys inside a whole `permissions` object.
A saved key under a known resource that names no command stops every other command with a configuration error
that gives the `config unset` to remove it; `config show`, `set` and `unset` still run. A saved key that starts with
no known resource makes the whole file invalid, `config` included, until it is removed from the file.

**The most specific key you set wins**: with the example above, `messages.send` is allowed and every
other change to messages is refused. There is no wildcard: `messages: readonly` does not touch
`reactions`, `polls` or `chats`.

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
and deleting asks again, as it does by default.

`inbox`, `review`, `watch`, `serve`, `export` and `search` show messages, so they count as `messages`:
`messages: deny` stops them too, as it stops `messages.sync`. `config`, `session`, `doctor`, `recipients`,
`mcp` and the store's own upkeep are never limited. One key sits outside the command paths:
`mcp.authority` (`deny` by default) decides whether an MCP server may execute commands that change what a later run may
do; those commands remain discoverable with current availability ([permissions](permissions.md#let-an-agent-change-its-own-limits)).

**The defaults allow everything except a few changes that are hard to reverse.** These ask: `messages.delete`,
`bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete` and
`account.sessions.end`. Reply rules may not send until you allow it: `replies.send` is `deny`. A
built-in default only tightens: `messages: readonly` still refuses a deletion, and `messages: allow`
keeps the question before a deletion until you set `messages.delete` itself.

```sh
tg personal config set permissions.messages.delete allow  # delete without the question
tg personal config set permissions.messages.send ask      # ask before every send
tg personal config unset permissions.messages.delete      # back to the default
```

To refuse every change in Telegram from a profile — here the profile `agent` — set each resource:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

Changes kept only on this computer — `tasks`, `store` and `metadata` — have their own keys.

### A question before a change

At level `ask`, `tg` shows what will change and asks `go ahead? [y/N]`. An answer other than `y`
does nothing and ends with exit code `130`. A flag answers yes for you: `--allow-dangerous` for a
deletion that cannot be undone (messages, a chat, its history or a topic), the global `--yes` for
any other change. With no terminal, or under `--json` or `--jsonl`, nobody can answer: the change is
refused with exit code `7`, `confirmation_required`, and the error names the flag.

### Over MCP

MCP has no server confirmation forms. `deny` and `readonly` block writes; `ask` and `allow` permit
the requested write. Repeat `--permission key=level` to tighten permissions for one server
process; it never loosens them ([browser setup](remote.md)). CLI confirmation at `ask` still applies.

`replies.send` defaults to `deny`; enabling a reply rule alone does not allow sending.
`tg personal replies audience` can limit replies to selected people or exclude some.

### Older settings

`permissions` is the only access setting. A file that still holds `read_only` or `allow` is refused as an
unknown setting: replace them with `permissions` keys (`read_only: true` is every resource `readonly`).

## Change it without opening the file

```sh
tg personal config set limit 50               # profile "personal"
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sends_per_hour 10 --defaults      # every profile
tg config set limit 30 --personal --defaults  # every personal account
tg shop config set sends_per_hour 200 --bot     # only the bot "shop"
tg config set update_check false --defaults    # a setting that exists only under defaults
tg personal config unset sends_per_hour         # back to the default
```

`config set` checks the value against the same rules the reader uses, so it never writes a file
that a later command refuses.

### Search languages

`search_stemmers.cyrillic` (`russian` or `none`) and `search_stemmers.latin` (`english`, `spanish`,
both comma-separated — the default — or `none`) are kept in the shared local store, not in the
settings file: one value for every profile and for both CLIs. So `--defaults`, `--personal` and
`--bot` are not accepted with them, and a process under `TG_PROFILE_LOCK` cannot change them. `config unset` restores the built-in value. After a change,
rebuild the search index ([index maintenance](archive.md#repair-and-index-maintenance)).

## A typo is an error, not a default

A setting the file does not know stops every command but `config` and `doctor`, with exit code `3`.
The message names the first problem and the command that removes it:

```text
/home/alice/.config/tg-cli/config.json: setting limt is not a setting of tg — remove it with `tg work config unset limt`
```

A misspelled setting that was silently ignored would run with the default and never say why. The
same holds for a key in `permissions` that names no command, in any section of the file.
`tg personal doctor` lists every problem in the file, each with its `config unset`
([diagnostics](diagnostics.md#check-the-installation-tg-personal-doctor)).

## Through a proxy

Where Telegram is blocked, `tg` can reach it through a proxy: SOCKS5, an HTTP proxy that allows
`CONNECT`, or an MTProxy. One `proxy` setting per profile, or for every profile with `--defaults`.
Set it before `tg personal setup`: the login goes through it too.

```sh
tg personal config set proxy socks5://proxy.example:1080      # no password: on the command line
tg personal config set proxy http://alice@proxy.example:3128  # a user without a password
tg personal config set proxy -                                # with a password or an MTProxy secret
proxy URL, hidden as you type: tg://proxy?server=mt.example&port=443&secret=ee…
tg personal config unset proxy
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
`config show` prints the setting from the file; `tg personal doctor` prints the proxy actually in use.
`ALL_PROXY` and `HTTPS_PROXY` are not read: they are usually set for other tools, and a proxy is
something you choose for this account.

The Bot API (`tg personal bot …`) and the app registration of `session start --app auto` go through the
same SOCKS5 or HTTP proxy. An MTProxy carries only Telegram's own protocol, so with one they connect
directly; `tg personal doctor` says which. `--app browser` opens my.telegram.org in your browser, which
uses its own proxy settings.

## Environment variables

| Variable | What it does |
|---|---|
| `TG_PROFILE` | the profile, when the first word does not name one |
| `TG_PROFILE_LOCK` | pins the process to one profile; any other is refused ([profiles](sessions.md#profiles)) |
| `TG_TIMEOUT` | the same as `--timeout`: `500ms`, `30s` or `2m` for the whole command |
| `TG_REQUESTS_PER_MINUTE` | the same as `requests_per_minute`, and wins over it |
| `TG_API_ID`, `TG_API_HASH` | the app, instead of the keyring — for CI; both or neither |
| `TG_PROXY` | the proxy URL, password or secret included; wins over the `proxy` setting ([above](#through-a-proxy)) |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | move the three directories — and the keyring entry with them |
| `MESSAGING_STORE` | the path of the local store file |
| `WIRECAT_STATE_DIR` | the WireCat folder every CLI shares: the local store and the speech models |
| `TG_NO_UPDATE_CHECK` | `1` turns off the daily "a newer version exists" line |
| `NO_COLOR` | no colour in the table view |
| `XDG_RUNTIME_DIR` | on Linux, how the keyring is reached; cron and ssh often leave it out |
| `TG_EMBEDDING_*`, `TG_ANALYSIS_*`, `TG_MODELS_*` | model settings ([below](#model-environment-variables)) |

## A separate set of settings for a while

Point the three directories somewhere else, and `tg` has a fresh config, login and runs there. It
does not see your usual login, because the keyring entry moves with them:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/wirecat.db
tg personal setup
```

Without `MESSAGING_STORE`, what that login reads still goes into your usual local store.

## Types and scope of every key

“Profile” includes root `defaults`, `profiles.<name>`, `personal.defaults`,
`personal.profiles.<name>`, `bot.defaults` and `bot.profiles.<name>` unless restricted below.
Unknown keys and invalid types are errors. Defaults and effects are listed [above](#the-file).

| Key | Accepted type/value | Scope |
|---|---|---|
| `limit`, `timeout_ms`, `keep_runs_for_days`, `sends_per_hour` | integer ≥ 1 | profile |
| `requests_per_minute` | integer ≥ 0 | profile |
| `color`, `sender_colors`, `search_catch_up`, `record` | boolean | profile |
| `permissions` | object of command paths and `deny`, `readonly`, `ask`, `allow` levels | profile |
| `read_other_bots` | boolean or array of profile names | bot only |
| `update_check`, `skill_hint` | boolean | root `defaults` only |
| `transcribe_with` | `auto`, `messenger`, `local` | profile |
| `speech_model` | downloaded model id as a string | profile |
| `proxy` | supported proxy URL as a string | profile |
| `embedding_provider` | `local`, `openai` | profile |
| `embedding_model` | nonempty string, at most 200 characters | profile |
| `embedding_base_url` | HTTP(S) URL without credentials, query or fragment | profile |
| `embedding_dims` | integer 1–65,536 | profile |
| `models` | purpose objects described below | profile |
| `phone_countries` | country codes, comma-separated | shared store, through `config set` |
| `task_categories.<name>`, `account_groups.<name>` | a string, as above | shared store, through `config set` |
| `task_agent_close` | `on`, `off` | shared store, through `config set` |
| `task_agent_close_min` | number from 0 to 1 | shared store, through `config set` |
| `task_first_pass_per_chat` | whole number from 0 to 1000 | shared store, through `config set` |
| `search_stemmers.cyrillic` | `russian`, `none` | shared store, through `config set` |
| `search_stemmers.latin` | `english`, `spanish`, both comma-separated, `none` | shared store, through `config set` |

### Models by purpose

`models.<purpose>` accepts only `provider`, `model` and `base_url`. Purpose names start
with a lowercase letter and contain lowercase letters, digits and hyphens.
`default` supplies common fields; `analysis` and `replies` override them field by field.
Other valid purpose names can be saved in advance; this does not enable an absent use case.
An absent provider or `off` disables external model calls.

| Field | Accepted value | Default |
|---|---|---|
| `models.<purpose>.provider` | `off`, `openai`, `anthropic` | absent; no external call |
| `models.<purpose>.model` | nonempty string, at most 200 characters | absent; an enabled provider needs an explicit model id |
| `models.<purpose>.base_url` | HTTP(S) URL without credentials, query or fragment | provider endpoint |

For each field, precedence is `TG_MODELS_<PURPOSE>_PROVIDER`, `_MODEL` or `_BASE_URL`,
then the nearest configured purpose field, then environment and configuration fields under
`models.default`. Hyphens in a purpose become underscores in its environment name. Credentials are not part of this object.

Embedding and analysis settings are independent and may differ by profile. Endpoints must be
HTTP/S without embedded credentials, query or fragment. Remote embeddings also receive the query
text of MCP searches. Keys are set with `models keys set openai|anthropic` and stay outside
`config.json`. Ordinary `conversations links rebuild` does not start remote analysis: explicit `--analyze` is required.

### Model environment variables

`TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL` and `TG_EMBEDDING_DIMS`
win over the embedding settings in the file; command options win over them.
`TG_MODELS_DEFAULT_PROVIDER`, `TG_MODELS_DEFAULT_MODEL` and `TG_MODELS_DEFAULT_BASE_URL`
supply common fields of `models`; replace `DEFAULT` with a purpose, such as `ANALYSIS`.
An empty variable does not override a setting. Invalid values return `configuration_error`.

## Next

- [Security](security.md): what `permissions`, the recipient list and `sends_per_hour` protect
- [Diagnostics](diagnostics.md): what `record` keeps and how long `keep_runs_for_days` holds it
