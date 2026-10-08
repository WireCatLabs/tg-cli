# Coming from tgcli

[tgcli](https://github.com/dapi/tgcli) is another command line client for a personal Telegram account.
This page lists each tgcli command and what does the same in `tg`. Where `tg` has no equivalent, the
row says so and why.

`tg` names a chat as an argument, not with `--chat` or `--to`: `tg messages send "Book club" "hi"`.
Every command takes `--json` ([cli-contract.md](cli-contract.md)).

## Login, profiles and the background service

| tgcli | tg |
|---|---|
| `auth`, `auth --qr` | `tg session start` (QR by default), `tg session start phone` |
| `auth --force-sms` | `tg session start phone --sms` |
| `auth status` | `tg account show`, `tg doctor --online` |
| `auth logout` | `tg session end` |
| `accounts add`, `--account <id>` | a profile: `tg work chats list`, or `TG_PROFILE=work` ([profiles.md](profiles.md)) |
| `config get/set/unset` | `tg config show/set/unset` ([configuration.md](configuration.md)) |
| `proxy` setting, `TELEGRAM_PROXY` | the `proxy` setting, `TG_PROXY` ([configuration-reference.md](configuration-reference.md#through-a-proxy)) |
| `server`, `service install/start/stop/status/logs` | `tg serve`, `tg server start/stop/status/logs/install` |
| MCP over HTTP (`mcp.enabled`) | `tg mcp --http` ([mcp.md](mcp.md), [remote.md](remote.md)) |
| `sync --once`, `sync --follow` | `tg store fetch`, `tg serve` ([archive.md](archive.md)) |
| `sync jobs list/add/retry/cancel` | `tg store fetch --background`, `tg store jobs list/show/retry/cancel/clear` |
| `owner request <id>` | `tg sends list`, and `--send-id` to repeat a send whose outcome was unknown |
| `doctor` | `tg doctor` |

## Reading and searching

| tgcli | tg |
|---|---|
| `channels list`, `groups list` | `tg chats list --kind channel`, `--kind group` |
| `channels show`, `groups info`, `metadata get` | `tg chats show <chat>` |
| `topics list/search` | `tg topics list/search <chat>` |
| `messages list --chat … --topic …` | `tg messages list <chat> --topic <id>` |
| `messages list --after/--before` | `--after-time`, `--before-time`, `--after-id`, `--before-id` |
| `messages show`, `messages context` | `tg messages show`, `tg messages context` |
| `messages search --after --before --tag --topic --regex` | the query: `date:7d tag:work topic:12`, `--regex` ([query-language.md](query-language.md)) |
| `messages search --source live/both` | `tg messages search --backend server/both` ([search.md](search.md)) |
| `media download` | `tg messages download <chat> <id>`, or a whole chat with `--all` |
| `contacts search`, `contacts show` | `tg contacts list --search`, `tg contacts show`, `tg contacts profile` |

## Sending

| tgcli | tg |
|---|---|
| `send text`, `send photo`, `send file` | `tg messages send <chat> [text]`, with `--photo` or `--file` |
| `--parse-mode markdown` | `--md` ([usage.md](usage.md#sending)) |
| `--parse-mode html` | `--html` |
| `--reply-to`, `--topic`, `--silent`, `--no-preview` | the same flags |
| `--schedule <iso>` | `--at-time <time>` |
| `--spoiler`, `--caption-above` | the same flags |
| `--force-document` | `--as-file` |
| `--filename` | `--filename` |
| `--retries`, `--retry-backoff` | not needed: a dropped upload is retried by itself, and never sent twice |
| `--no-forwards` | not possible: Telegram lets only bots protect one message. Turn on the chat's own content protection in Telegram. |

## Groups and folders

| tgcli | tg |
|---|---|
| `groups rename` | `tg chats update <chat> --title` |
| `groups members add/remove` | `tg chats members add/remove` |
| `groups invite get`, `groups invite revoke` | `tg chats link show`, `tg chats link reset` |
| `groups invite edit --request-needed` | `tg chats link create <chat> --approval`, or `tg chats update <chat> --join-approval on` |
| `groups requests list/approve/decline` | `tg chats requests list`, `tg chats requests accept/decline <chat> <person>` |
| `groups requests list --query`, `--link` | `tg chats requests list --search`, `--link` |
| `groups join`, `groups leave` | `tg chats join <link>`, `tg chats leave <chat>` |
| `folders list/create/edit/delete` | `tg chats folders list/create/update/delete` |
| `folders show` | `tg chats folders show <folder>` |
| `folders create/edit --include-contacts … --include-bots` | `--include contacts,non-contacts,groups,channels,bots` |
| `folders create/edit --exclude-muted`, `--exclude-read`, `--exclude-archived` | `--skip muted,read,archived` |
| `folders create/edit --exclude-chat`, `--pin-chat`, `--emoji` | `--exclude-chat`, `--pin`, `--emoji` |
| `folders reorder` | `tg chats folders order` |
| `folders chats add/remove` | `tg chats folders update --add/--remove` |
| `folders chats join` (a shared folder link) | `tg chats folders join <link>` |

## Your own notes on chats and people

| tgcli | tg |
|---|---|
| `tags set/list/search` on a channel | `tg tags add/remove/list --chat`, and `tag:` in a search |
| `contacts tags add/rm` | `tg tags add/remove --contact` |
| `contacts alias set/rm` | `tg contacts alias set/rm`: a private name on this computer only; `tg contacts rename` changes your Telegram contacts |
| `contacts notes set` | `tg contacts notes add/edit/remove`, several notes per person, on this computer only |
| `tags auto`, `metadata refresh` | `tg tags auto`, `tg metadata refresh` |
| `metadata refresh --only-missing` | `tg metadata refresh --only-missing` |
