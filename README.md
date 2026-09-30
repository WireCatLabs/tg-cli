# tg-cli

A local command line interface for a personal Telegram account, built for agents and scripts: one
operation per call, one JSON value on stdout when piped, a typed error and a stable exit code on
failure.

It reads, searches and sends through a guard, and keeps what it reads in a local store that search,
export and `--offline` answer from. What each version changed is in [CHANGELOG.md](CHANGELOG.md).

## Install and log in

```sh
npm install -g @leemour/tg-cli     # or: pnpm add -g @leemour/tg-cli
tg session start                   # your app from my.telegram.org, then a QR code to scan
```

Node 22 or newer. SQLite comes from the runtime itself, so there is no native module to build. Every
user registers their own Telegram app; `tg session start` walks you through it
([docs/sessions.md](docs/sessions.md)).

## A first look

```sh
tg chats list --limit 5                     # your newest chats
tg messages list "Book club" --limit 20     # a chat's latest messages, oldest first
tg inbox                                    # other people's unread messages, in every chat
tg messages search "invoice march"          # search what this machine has kept
tg messages send me "a note to myself"      # Saved Messages
tg chats list --json | jq -r '.items[].id'  # piped or --json: data on stdout, nothing else
```

Reading marks nothing read. Nothing sends unless the command you typed sends, and every send goes
through the profile's limits: read-only, allowed actions, allowed recipients and an hourly cap.

## Documentation

| Page | Answers |
|---|---|
| [installation.md](docs/installation.md) | install, requirements, where files go, upgrade, uninstall |
| [usage.md](docs/usage.md) | login, profiles, reading, paging, sending, scripts — in order |
| [sessions.md](docs/sessions.md) | QR and phone login, the app from my.telegram.org, the keyring, profiles, logout |
| [configuration.md](docs/configuration.md) | every setting and variable, and which one wins |
| [store.md](docs/store.md) | the local store: fetch, status, export, search, `--offline`, `serve` as a service |
| [mcp.md](docs/mcp.md) | Claude Desktop, Cursor and other clients without a terminal |
| [remote.md](docs/remote.md) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes.md](docs/recipes.md) | an agent's daily work: summary, who owes what, unanswered, on a schedule |
| [diagnostics.md](docs/diagnostics.md) | `--trace`, `--record`, `runs`, `doctor report` — and what is never recorded |
| [security.md](docs/security.md) | what reaches the disk and what never does; the send guard |
| [troubleshooting.md](docs/troubleshooting.md) | by symptom: what the screen says, and what to do |
| [commands.md](docs/commands.md) | every command, option and exit code — generated |

For an agent with a terminal: `tg skill show` prints the instructions it needs
([usage.md](docs/usage.md#for-scripts-and-agents)).

## How it is built

Everything that is not specific to Telegram — the commands, the store, the send guard, the MCP
server — lives in [cli-messaging](https://github.com/leemour/cli-messaging), shared with
[max-cli](https://github.com/leemour/max-cli). Telegram-specific code lives only in `src/telegram/`,
and a lint rule keeps [mtcute](https://mtcute.dev) there. The design is
[the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md).

## Development

To work on `cli-messaging` at the same time, point the dependency at a checkout for the length of
the change — `pnpm add @leemour/cli-messaging@link:../cli-messaging` — and put the version back
before the pull request.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build
pnpm generate                 # rewrites docs/commands.md from the command tree
bin/tg session start          # everything under .tg/ in this checkout, never the real profile
bin/tg chats list --limit 5
pnpm probe:random-id          # sends two probe messages to Saved Messages with one random_id
```

More in [docs/README.md](docs/README.md).

## Licence

MIT.
