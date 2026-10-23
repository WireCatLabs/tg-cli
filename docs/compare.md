# Compared with other tools

Several open tools already connect a personal Telegram account to a terminal or an AI agent. This
page puts `tg` next to five of them, so you can see at a glance which tool does what and pick the
one that fits your job. The marks come from each project's own documentation and source, checked on
23 October 2026; a tool may do more than its documentation says.

The tools:

- **tg** — this tool: a command line and an MCP server for your account, with a local archive.
- **[tgcli](https://github.com/dapi/tgcli)** — a command line with background sync, a local archive and an MCP
  server (the actively developed fork of [kfastov/tgcli](https://github.com/kfastov/tgcli)).
- **[tlgr](https://github.com/tlgrcli/tlgr)** — a command line and a background service that do almost everything
  on Telegram's server, with a skill for agents.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)** — the most used Telegram MCP server, with a large set
  of actions.
- **[mcp-telegram](https://github.com/mcp-telegram/mcp-telegram)** — an MCP server with about 180 tools, started with
  `npx`.
- **[tdl](https://github.com/iyear/tdl)** — a fast downloader and uploader for files and media.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation

## Features

| Feature | tg | [tgcli](https://github.com/dapi/tgcli) | [tlgr](https://github.com/tlgrcli/tlgr) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [mcp-telegram](https://github.com/mcp-telegram/mcp-telegram) | [tdl](https://github.com/iyear/tdl) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Your personal account | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| A bot through the Bot API | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ |
| Read chats and history | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 |
| Unread chats, without marking them read | ✅ | ❌ | ✅ | 🟡 | 🟡 | ❌ |
| Send messages | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit, delete, forward and pin messages | ✅ | ❌ | ✅ | ✅ | ✅ | 🟡 |
| Files and media | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |
| Several photos as one album | ❌ | ❌ | ✅ | ✅ | ✅ | ➖ |
| Drafts | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Archive, pin, mute or mark a chat unread | ❌ | ❌ | ✅ | 🟡 | ✅ | ❌ |
| Press a bot's buttons | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Download many files, resumable | 🟡 | 🟡 | ✅ | 🟡 | 🟡 | ✅ |
| A local archive kept current | ✅ | ✅ | 🟡 | ❌ | ❌ | 🟡 |
| Search the archive without connecting | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Search on Telegram's server | ✅ | 🟡 | 🟡 | ✅ | ✅ | ❌ |
| Search by meaning, in file text and voice notes | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Voice notes as text | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| MCP server | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Remote MCP with its own login | ✅ | ➖ | ❌ | ➖ | ➖ | ❌ |
| Skill for agents with a terminal | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ |
| JSON output | ✅ | ✅ | ✅ | 🟡 | ➖ | 🟡 |
| Several accounts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Limits for an agent: read-only, allowed chats, hourly cap | ✅ | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| Session kept in the system keyring | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Run a group or channel | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Scheduled messages | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Forum topics | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Background service | ✅ | ✅ | ✅ | 🟡 | 🟡 | ❌ |
| Export chats | ✅ | ❌ | 🟡 | 🟡 | ❌ | ✅ |

On limits for an agent: telegram-mcp can expose only its reading tools and only listed chats; tlgr can allow only
listed commands; mcp-telegram limits its request rate. tg has a read-only profile, a list of allowed recipients and an
hourly cap on sends.

## Install and licence

| | tg | [tgcli](https://github.com/dapi/tgcli) | [tlgr](https://github.com/tlgrcli/tlgr) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [mcp-telegram](https://github.com/mcp-telegram/mcp-telegram) | [tdl](https://github.com/iyear/tdl) |
|---|---|---|---|---|---|---|
| Install | npm, pnpm, Bun | npm | pipx | git and uv, Docker, Claude Desktop extension | npx, binaries | one binary, Homebrew, Scoop, AUR, Nix, Docker |
| Written in | TypeScript | JavaScript | Python | Python | TypeScript | Go |
| Licence | Apache-2.0 | MIT | MIT | Apache-2.0 | MIT | AGPL-3.0 |

## When another tool fits better

- **tdl** — you mostly move files: bulk downloads, uploads and forwarding at full speed, from one
  binary that most package managers can install.
- **tlgr** — you want the most chat housekeeping from a command line today: drafts, albums, archive, mute and bot
  buttons, with parallel downloads that resume, and you do not need a local archive.
- **telegram-mcp** — you want the widest set of agent actions in Claude Desktop, installed in one
  step, with a large community behind it.
- **mcp-telegram** — you want a large MCP tool set started with one `npx` command, without Python.
- **tgcli** — you want the MCP server inside the sync service, or keep notes on chats.

If `tg` fits, start with [installation](installation.md); to connect an agent without a terminal,
see [the MCP server](mcp.md).
