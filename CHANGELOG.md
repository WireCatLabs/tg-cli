# Changelog

Notable changes to `@leemour/tg-cli`. One section per version, newest first; versions follow
[semantic versioning](https://semver.org), so before `1.0.0` the command interface may still change.

## Unreleased

## 0.12.0 — 30.09.2026

### What's new

- **`tg chats inspect <link>`** and `tg_chats_inspect`: what an invite or public link leads to — title,
  members, description, whether you are in it and whether joining needs approval — without joining.
- **`tg topics list <chat>` and `tg topics search <chat> <text>`**, and `tg_topics_list`: a forum
  group's topics, paged, with the id each message in a topic carries as `threadId`.

## 0.11.0 — 30.09.2026

### What's new

- **Voice messages carry their text in `tg messages list` and `tg inbox`.** A transcript heard once
  is kept per profile in tg's cache and shows on every later read — `transcript` in `--json`,
  `🎤 …` under the text for a person. `--transcribe` hears the rest, by Telegram or the model on
  this machine, within two minutes for the whole list; what is left is in `unheard`. The same as
  `transcribe` on `tg_messages_list` and `tg_inbox`.
- **`tg chats members list <chat>`** and `tg_chats_members`: a group's members, paged, each with a role
  and when Telegram last saw them — up to Telegram's own 10 000.
- **`tg contacts lookup`**: who has a phone number, where their privacy lets you find them. The number is
  piped in or typed when asked, never an argument. Also `tg_contacts_lookup`.
- **`tg contacts sync`**: your Telegram contacts into the local store, answering how many were new or
  changed.
- **`tg account sessions list`** and `tg_account_sessions`: every device and app logged in to the account,
  without their IP addresses. It ends nothing.

## 0.10.0 — 29.09.2026

### What's new

- **Voice to text on this machine.** `tg models audio list` and `tg models audio download <id>`
  fetch a speech model once — Parakeet v3 (25 languages, the default), GigaAM v3 or GigaAM v3 CTC
  (Russian) — into `~/.cache/cli-common/models/audio`, a folder every CLI of the family shares. `tg messages transcribe` asks Telegram first
  and falls back to the local model when the account has no Premium; `--local` or `--model <id>`
  skip Telegram. The profile's `transcribeWith` (`auto`, `messenger`, `local`) and `speechModel`
  set the defaults. Nothing downloads a model by itself.
- **`tg messages send --photo <path>` or `--file <path>`**, the text as the caption, and `photo` and
  `file` on `tg_messages_send`. Hidden files and folders, `~/.ssh`, tg's own folders and the message
  store are refused unless the owner adds `--allow-any-file`; over MCP there is no way around it. The
  send journal records the attachment's kind and size, never its name. A retry with the same
  `--send-id` sends one message (measured on a photo).

- **`tg update` restarts a running server with the new tg**, so it stops running the old code; a
  serve started by hand is named, for you to restart. **`tg server status` says when the running serve
  is older than tg**, as max-cli's does.

- **`tg chats events <chat> [--since] [--event]`** and `tg_chats_events`: who joined, left, was added
  or removed, and by whom — plus a chat created, renamed or a message pinned — from the chat's service
  messages, seven days back by default. At most ten pages of history a run; `more` says there was more.

## 0.9.0 — 29.09.2026

### What's new

- **`tg session start` says who logged in, where the session file is, where the app keys are read
  from and what to run next**, in sentences; `--json` gains `session` and `appKeys` (`environment`,
  `keyring` or `file` — never the keys).
- **`tg chats list --search <text> --kind <kind> --unread`**, and the same on `tg_chats_list`. The
  filters combine over the newest 200 chats; `--search` takes at least 3 characters.
- **`tg messages list --after <id-or-time>`** reads a chat forward: the oldest messages newer than a
  message id, or than a time (`2h`, `1d`, ISO 8601). `after` on `tg_messages_list`.
- **`tg messages send --silent --no-preview --md`** — without a notification, without a link's preview
  card, and with `**bold**`, `_italic_`, `~~struck~~` and `` `code` `` as Telegram formatting. The MCP
  send tool takes `silent`, `no_preview` and `markdown`. The send journal still holds only the length.
- **`tg messages send --at <time>`** hands the message to Telegram to send later — `2h`, `1d`, or
  `2026-10-01T09:00` in local time — and `tg messages scheduled <chat>` (MCP `tg_messages_scheduled`)
  lists what waits. A scheduled send is never repeated: `--send-id` is refused with it.

### Changed — may break scripts

- **`tg service …` is now `tg server …`** — `start|stop|restart|status|logs|install|uninstall`, as in
  max-cli — and `tg serve status` is gone: `tg server status` answers. `tg server start` without a unit
  runs serve in the background. A unit written by `tg service install` is still found. From
  cli-messaging 0.40.0.

## 0.8.0 — 29.09.2026

### What's new

- **`tg review`**: every message, yours too, in each chat that changed since `--since` (three days
  without it) — for sorting out who owes what. It ends by saying where the next review starts.
  `--chat` reads one chat, `--unanswered [hours]` keeps the questions nobody answered — a group's
  admins answer for it too — and `--all` takes in muted and archived chats. The MCP tool `tg_review`
  and the `review` prompt do the same.

## 0.7.0 — 29.09.2026

### What's new

- **`tg messages transcribe <chat> <id>`** and the MCP tool `tg_messages_transcribe` turn a voice
  or video note into text with Telegram's own recognition — on a Premium account, or within
  Telegram's weekly free trial. Telegram usually needs a few seconds; tg asks again for up to a
  minute, then answers `"pending": true`. Refusals say why in plain words: not a voice message, too
  long, no Premium.
- **The MCP tool `tg_messages_photo`** hands an agent a message's photo as an image to look at, up
  to 512 KB. A larger photo, a file, a video or a voice note is refused with the
  `tg messages download` command that saves it.

## 0.6.0 — 29.09.2026

### What's new

- **`tg inbox` leaves out muted and archived chats** unless they mention you or reply to you; `--all`
  (and `all` on `tg_inbox`) shows them too. On a busy account most unread chats are muted, and they took
  the 20 chats `inbox` reads at once. The JSON's `quiet` counts what was left out.
- **A chat carries `muted`, `archived` and `unreadMentions`** in `--json`. `archived` moved out of
  `providerMetadata`; `muted` is absent when the chat follows the account's default.

### Fixed

- **`tg messages send --silent`, `--no-preview` and `--markdown` refuse the send** instead of sending
  without them: they came with cli-messaging 0.32, and tg does not carry them to Telegram yet.

## 0.5.0 — 29.09.2026

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

### Fixed

- **`tg messages list --jsonl` and `tg messages search --jsonl` print one message per line**, as their
  `--help` says. They printed the whole page as one JSON line; a script that read `.items` from it must
  now read each line as a message.

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
