# Compared with other tools

Several open tools already connect a personal Telegram account to a terminal or an AI agent. This
page puts `tg` next to three of them, so you can see at a glance which tool does what and pick the
one that fits your job. The marks come from each project's own documentation; a tool may do more
than its documentation says.

The tools:

- **tg** — this tool: a command line and an MCP server for your account, with a local archive.
- **[tgcli](https://github.com/kfastov/tgcli)** — a command line with background sync and an MCP
  server.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)** — an MCP server that gives an agent a
  large set of Telegram actions.
- **[tdl](https://github.com/iyear/tdl)** — a fast downloader and uploader for files and media.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

## Features

| Feature | tg | [tgcli](https://github.com/kfastov/tgcli) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [tdl](https://github.com/iyear/tdl) |
|---|:-:|:-:|:-:|:-:|
| Your personal account | ✅ | ✅ | ✅ | ✅ |
| A bot through the Bot API | ✅ | ❌ | ➖ | ➖ |
| Read chats and history | ✅ | ✅ | ✅ | 🟡 |
| Send messages | ✅ | ✅ | ✅ | 🟡 |
| Files and media | ✅ | ✅ | ✅ | ✅ |
| A local archive kept current | ✅ | ✅ | ➖ | ➖ |
| Search the archive without connecting | ✅ | ✅ | ➖ | ➖ |
| Search on Telegram's server | ✅ | ✅ | ✅ | ➖ |
| Search by meaning | ✅ | ➖ | ➖ | ➖ |
| MCP server | ✅ | ✅ | ✅ | ➖ |
| Remote MCP with its own login | ✅ | 🟡 | 🟡 | ➖ |
| Skill for agents with a terminal | ✅ | ✅ | 🟡 | ➖ |
| JSON output | ✅ | ✅ | 🟡 | ✅ |
| Several accounts | ✅ | ➖ | ✅ | ✅ |
| Limits for an agent: read-only, allowed chats, hourly cap | ✅ | ➖ | 🟡 | ➖ |
| Run a group or channel | ✅ | 🟡 | ✅ | 🟡 |
| Scheduled messages | ✅ | ✅ | ✅ | ➖ |
| Forum topics | ✅ | ✅ | ✅ | 🟡 |
| Contacts with private names and notes | ✅ | ✅ | ✅ | ➖ |
| Background service | ✅ | ✅ | 🟡 | ➖ |
| Export chats | ✅ | ➖ | 🟡 | ✅ |

## Install and licence

| | tg | [tgcli](https://github.com/kfastov/tgcli) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [tdl](https://github.com/iyear/tdl) |
|---|---|---|---|---|
| Install | npm, pnpm, Bun | npm, Homebrew | git and uv, Docker, Claude Desktop extension | one binary, Homebrew, Scoop, AUR, Nix, Docker |
| Written in | TypeScript | JavaScript | Python | Go |
| Licence | MIT | MIT | Apache-2.0 | AGPL-3.0 |

## When another tool fits better

- **tdl** — you mostly move files: bulk downloads, uploads and forwarding at full speed, from one
  binary that most package managers can install.
- **telegram-mcp** — you want the widest set of agent actions in Claude Desktop, installed in one
  step, with a large community behind it.
- **tgcli** — you install with Homebrew, want the MCP server inside the sync service, send
  individual messages with protected content, or keep notes on chats.

If `tg` fits, start with [installation](installation.md); to connect an agent without a terminal,
see [the MCP server](mcp.md).
