# Changelog

Notable changes to `@leemour/tg-cli`. One section per version, newest first; versions follow
[semantic versioning](https://semver.org), so before `1.0.0` the command interface may still change.

## Unreleased

### What's new

- **`tg service install|uninstall|start|stop|status|logs`** runs `tg serve` as a systemd user unit
  (Linux) or a launchd agent (macOS), one per profile. `install` only writes the file; nothing starts
  until `tg service start`.
- **`tg backfill <chat> --background`** runs a backfill as a job that outlives the command;
  `tg backfill list`, `status [job]` and `cancel <job>` follow it. Ctrl-C or `cancel` stop a backfill
  after the page in hand, and it keeps that page.
- **`tg backfill <chat> --estimate`** — how many messages, requests and seconds a full backfill would
  still take, from the store; it asks Telegram nothing.
- **`tg export <chat> --format markdown`** — a chat as a transcript a person reads.
- **`tg messages search --regex '<pattern>'`** — a regular expression over the stored text.
- **`tg doctor report create`** writes a problem report — versions, paths, the failed run, the recent
  send attempts — with no message text, and every chat, message and account id replaced by a label.
- **`tg session start --qr-file login.png`** writes the login QR code as a PNG instead of drawing it,
  so an agent can pass it on, and removes it after the login. With the app already stored it needs
  no terminal.
- **`tg messages download <chat> <id> [--output dir]`** saves a message's photo, file, video or
  voice note into a folder — the current one unless `--output` names another — and answers its path
  and size. A name the sender chose cannot leave the folder or hide the file, and a file already
  there is never overwritten. The message is fetched again each time, so an old one still downloads.

## 0.4.0 — 29.09.2026

### What's new

- **`tg inbox`** — other people's unread messages in every chat; `--new` shows only what arrived
  since the last check, each message once. The MCP server offers it as the `tg_inbox` tool and the
  `catch-up` prompt.
- **`tg skill show`** prints the instructions an agent is given for this tool.
- **MCP prompts and a chat resource:** the `reply` and `find` prompts, and `tg://chat/{id}`.

## 0.3.0 — 28.09.2026

### What's new

- **`tg mcp`** serves a profile to an agent over MCP, on stdin and stdout. Read-only by default;
  `--allow-send` offers the send tool, and `--confirm-send` shows the owner every send first.
  `tg mcp config` prints the entry for an MCP client's settings.

### Changed — may break scripts

- **A failure before a command runs is kept as a run** — a usage error, a configuration that will
  not load. `tg runs list` shows it; `--no-record` turns it off.

## 0.2.0 — 28.09.2026

### What's new

- **`tg update`** updates tg with the package manager that installed it; `--check` only looks.
- **A daily line on stderr when a newer version is on npm**, at a terminal only and after the
  command. `TG_NO_UPDATE_CHECK=1` turns it off.

## 0.1.0 — 27.09.2026

The first release on npm.

### What's new

- **Log in** by QR code or phone number (`tg session start`); the app credentials from
  my.telegram.org are fetched by opening the site or by filling it in for you (`--app auto`), and
  kept in the OS keyring.
- **Read:** `account show`, `chats list|show`, `contacts list|show`, `messages list|show|context`.
- **Send** with `messages send` and `messages reply`, through a send guard: a recipient list,
  read-only profiles, a journal of every attempt (`tg sends`), and `--send-id` to repeat a send
  whose outcome is unknown without sending it twice.
- **A local archive:** every read is kept in a store shared by the messenger CLIs; `--offline`
  answers from it, `messages search` searches it, `backfill` fills it, `watch` and `serve` keep it
  current, `sync status` and `export` read it.
- **Run records** (`tg runs`), `config`, `doctor`, `commands` and shell completion (`complete`).
