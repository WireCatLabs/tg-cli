<p align="center">
  <img src="https://raw.githubusercontent.com/leemour/tg-cli/main/docs/design/logo_text.png" alt="Tg CLI" width="480">
</p>

# tg-cli

A Telegram client for the terminal and for AI agents. `tg` is a command line tool and an MCP server
for your own Telegram account: read your chats, find what was said, and answer — yourself, or
through Claude, Codex, Cursor and other agents, within limits you set. In the groups you run, see
which questions nobody answered and who joined.

It runs on Windows, macOS and Linux.

```sh
tg inbox                                          # other people's unread messages, in every chat
tg messages send "Book club" "Running 15 minutes late"
```

[![npm](https://img.shields.io/npm/v/@leemour/tg-cli)](https://www.npmjs.com/package/@leemour/tg-cli)
[![CI](https://github.com/leemour/tg-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/leemour/tg-cli/actions/workflows/ci.yml)
[![Node](https://img.shields.io/node/v/@leemour/tg-cli)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/bun-tested-f9f1e1)](https://bun.sh/)
[![npm downloads](https://img.shields.io/npm/dm/@leemour/tg-cli)](https://www.npmjs.com/package/@leemour/tg-cli)
[![License: MIT](https://img.shields.io/npm/l/@leemour/tg-cli)](LICENSE)

## Install

```sh
npm install -g @leemour/tg-cli     # or: pnpm add -g @leemour/tg-cli, bun add -g @leemour/tg-cli
tg --version
```

It needs Node 22 or newer, or Bun. The package is `@leemour/tg-cli`; the command is `tg`. Details:
[installation](docs/installation.md).

## Log in

```sh
tg session start          # your app from my.telegram.org, then a QR code to scan
tg account show           # who you are logged in as
```

`tg session start phone` logs in by phone number instead. More: [sessions](docs/sessions.md).

## A taste

```sh
tg chats list --limit 5
tg messages list "Book club" --limit 20
tg messages send me "Call mum" --at-time 2h       # a reminder in Saved Messages in two hours
tg review --since-time 1d                         # a day of messages: who promised what
tg messages search "contract"                     # everything kept, without connecting
tg chats list --json | jq -r '.items[].id'        # one JSON value on stdout, nothing else
```

For agents: a [skill](docs/recipes.md#once-first) for Claude Code, Codex and Gemini CLI, and an
[MCP server](docs/mcp.md) for Claude Desktop, Cursor and other clients.

## Documentation

Start with [the overview](docs/index.md): what `tg` can do, how agents use it, and how it differs
from other tools.

| Page | Answers |
|---|---|
| [installation](docs/installation.md) | requirements, where files go, shell completion, upgrade, removal |
| [usage](docs/usage.md) | profiles, reading, paging, sending, scripts |
| [sessions](docs/sessions.md) | QR and phone login, the app from my.telegram.org, the keyring, profiles, logout |
| [archive](docs/archive.md) | the local store: fetch, search, export, `--offline`, `serve` as a service, backup |
| [groups](docs/groups.md) | groups you run: unanswered questions, newcomers, a weekly report |
| [mcp](docs/mcp.md) | Claude Desktop, Cursor and other clients without a terminal |
| [remote](docs/remote.md) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes](docs/recipes.md) | an agent's daily work: summary, who owes what, unanswered, on a schedule |
| [commands](docs/commands.md) | every command, option and exit code, generated from the program |
| [configuration](docs/configuration.md) | every setting and variable, and which one wins |
| [diagnostics](docs/diagnostics.md) | `--trace`, `--record`, `runs`, `doctor report`, and what is never recorded |
| [troubleshooting](docs/troubleshooting.md) | by symptom: what the screen says, and what to do |
| [security](docs/security.md) | what reaches the disk and the network; the send guard |
| [roadmap](docs/roadmap.md) | what is coming |

What each version changed: [CHANGELOG.md](CHANGELOG.md).

## Development

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build && pnpm smoke:bun  # the built command under the second runtime
pnpm generate                 # rewrites docs/commands.md from the command tree
bin/tg session start          # everything under .tg/ in this checkout, never the real profile
bin/tg chats list --limit 5
```

Everything that is not specific to Telegram — the commands, the store, the send guard, the MCP
server — lives in [cli-messaging](https://github.com/leemour/cli-messaging), shared with
[max-cli](https://github.com/leemour/max-cli). Telegram-specific code lives only in `src/telegram/`,
and a lint rule keeps [mtcute](https://mtcute.dev), the Telegram library underneath, there.

To work on `cli-messaging` at the same time, point the dependency at a checkout for the length of
the change — `pnpm add @leemour/cli-messaging@link:../cli-messaging` — and put the version back
before the pull request.

## Licence

MIT — see [LICENSE](LICENSE).

## Contributing

Pull requests, bug reports and ideas are welcome —
[issues](https://github.com/leemour/tg-cli/issues). How the code is built and how to test it:
[docs/dev/ARCHITECTURE.md](docs/dev/ARCHITECTURE.md) and [docs/dev/TESTING.md](docs/dev/TESTING.md).
