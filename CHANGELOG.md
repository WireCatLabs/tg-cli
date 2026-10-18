# Changelog

Notable changes to `@wirecat/tg-cli`. One section per version, newest first; versions follow
[semantic versioning](https://semver.org), so before `1.0.0` the command interface may still change.

## 0.73.1 — 18.10.2026

### Fixed

- **tg starts a little faster.** Built on cli-core 0.342.0 and cli-base 0.45.0: a command no longer parses the
  rule tables that only development checks use, which saved about 7–12 ms per start in the
  [measurement](https://github.com/WireCatLabs/cli-testing/tree/main/performance/startup/standards-split-before/README.md).

## 0.73.0 — 18.10.2026

### Added

- **Agents get every command the profile's levels allow over `tg mcp`** (cli-core 0.341.0). The server offered
  hand-written tools; it now builds them from the commands themselves and runs them in this process, 188 commands in
  all, `messages sync`, `contacts sync`, `mentions confirm`, `conversations embed` and `images embed` among the new
  ones. What an agent may not do is decided by the profile's levels: set the area to `readonly` or `deny`. The full
  list is pinned in `contracts/mcp-catalogue.json`.
- **`tg conversations rebuild`** builds again the conversations of chats that changed and embeds them with the model on
  this machine; it never asks Telegram, downloads no model and sends no text anywhere. It replaces the agent-only
  `conversations_refresh` tool.

### Changed — may break callers

- **`tg mcp` tool arguments are the command's options in snake_case**: `chat`, `limit`, `query`, `sync_first` and so
  on. An agent that remembered the old names asks `tg_tools_search` again.
- **An agent's `search messages` takes the query as text only**; the structured `ast` input is gone.
- **An agent cannot mark read or act as the owner**: `--mark-read` on `messages list`, `inbox` and `review` and
  `--as-owner` are not offered, the `catch_up_marks_read` setting does not apply to its runs, and its `--new`
  checkpoints are its own.
- **Under `TG_READ_ONLY`, local writes that delete or overwrite what you saved are refused** (cli-core 0.336.0,
  0.337.0): `searches create`, `searches delete`, `searches clear`, `contacts alias set|rm`, `contacts notes
  add|edit|remove`, `contacts link|unlink`, `tags add|auto|remove`, `mentions confirm|reject`, `attachments text set`,
  `chats tracking add|remove`, `conversations links add|clear`, `conversations consents revoke` and `tasks reject`,
  and their agent tools, exit 5. What the store rebuilds itself, syncs, `serve` and task bookkeeping still run.
- **While Telegram holds the account, no write goes out** (cli-core 0.334.0): reactions, marking read, quiet pins,
  title and profile changes are refused too; reads work. A ban with no end holds writes until `tg flood clear` or
  `tg doctor --online` finds the account well (`until: null` in JSON).
- **A send blocked on another process's lock exits 9 (`timeout`), not 1** (cli-core 0.338.0); nothing was sent, so it
  is safe to retry. `flood clear` too.
- **`tg upgrade --offline` exits 2** (cli-core 0.338.0) instead of asking npm anyway.
- **`conversations build`, `conversations embed` and `search conversations` say they can send text out**
  (cli-core 0.334.0, 0.336.0): with `--analyze`, `--provider` or a remote embedding model. Under `TG_READ_ONLY` they
  refuse before sending; a local model still works. They never run through `serve`.

### Fixed

- **`tg mcp` answers every call it received before stdin closed** instead of exiting with one still running.
  `tg bot mcp` does not yet.
- **An agent is not offered `offline` on a command that refuses it** (cli-core 0.335.0): `topics`, `chats events`,
  `chats inspect`, `chats members audit`, `chats members fetch` and the `chats folders` commands.
- **A held lock no longer stalls `tg serve`** (cli-core 0.340.0) for up to 5 seconds.
- **Two changes to the recipient list at once no longer undo each other** (cli-core 0.338.0).
- **`tg store gaps repair --background` runs its job** instead of failing at once (cli-core 0.339.0).
- **Hints from `server` and store maintenance commands name the profile** (cli-core 0.339.0).
- **`tg upgrade --check` runs under `TG_READ_ONLY`** (cli-core 0.338.0).
- **Model downloads never go through `tg serve`** (cli-core 0.336.0).
- **A store that failed to open is closed** (cli-core 0.332.0), so its folder can be deleted on Windows.

## 0.72.0 — 18.10.2026

### Added

- **`tg tasks agenda` lists what others owe you** (cli-core 0.328.0): open tasks someone else does, oldest first, with
  their assignees, in an "assigned" section and in `assigned` in JSON.

### Changed — may break callers

- **A command path given as one argument fails** (cli-core 0.328.0): `tg 'chats list' --help` printed the root help and
  exited 0; it now fails with the command line to run.
- **An interactive command without a terminal waits 5 minutes by default, not 30 seconds** (cli-core 0.328.0), so an
  agent's `tg session start --qr-file` is not cut off before the code is scanned. `--timeout` and `TG_TIMEOUT` still
  decide when given.
- **Under `TG_READ_ONLY`, a write that asks first stops with exit 5 before asking, not exit 7** (cli-core 0.329.0):
  `messages delete`, `topics delete`, `account sessions end`, `chats delete` and `chats clear` said "asks before it
  acts", as if `--allow-dangerous` would let them through. They now say "this process is read-only", as every other
  write does. Without the lock they ask as before.

### Fixed

- **Fewer false duplicate suggestions from reply chains** (cli-core 0.331.0): a reply that asks for something new no
  longer marks two tasks as maybe the same.
- **`tg chats list --json | head` ends quietly** (cli-core 0.328.0), through a running `serve` too, instead of printing
  a stack trace when the reader stops.

### Security

- **`tg session end` no longer logs out a running `tg serve`** (cli-core 0.328.0): with `serve` running for the
  profile, `session end` was handed to `serve` to run. It logged out the connection `serve` was using and deleted the
  session file `serve` still had open. Now `session start`, `session end` and `setup` never run through `serve`, and
  `session end` stops with exit 2 and says to run `tg <profile> server stop` first. Under `TG_READ_ONLY` all three still
  stop with exit 5, now with "it cannot log in or out".

## 0.71.0 — 17.10.2026

### Changed — may break callers

- **In a group tagged `watch-tasks`, any member's reply closes a question** (cli-core 0.325.0): a direct reply from
  someone other than the asker settles it; a later message that does not reply closes nothing.
- **`tg <bot> bot mcp` tools are the bot commands themselves** (cli-core 0.325.0): an agent's arguments are the
  command's own, in snake_case — `messages send` and `messages edit` take `md` or `html` in place of `format`,
  `messages delete` takes `messages` (a list), `search messages` takes `query`, `chats members remove` takes
  `person`. New: `chats rules show`, and `offline` on every read. Sending files, `--allow-dangerous` and
  `chats moderate --max-actions` stay with the owner. The catalogue is pinned in `contracts/bot-catalogue.snap`.

## 0.70.0 — 17.10.2026

### Added

- **`tg <profile> contacts link <person> me`** (cli-core 0.323.0): say that a contact is you — for an account of
  yours the store cannot match by itself, such as `zoom:<id>`.

### Fixed

- **Mentions find fewer wrong names** (cli-core 0.323.0). A word of a contact's name counts on its own only as a first
  name or a surname; a contact named like a company («Smart Agents») is found only by the whole name, and the polite
  «Ваш», «Вам», «Вас» never count. A saint's name in a place («Saint Michael's Bridge») and a city after «в»/«во»
  («во Владимире») are not names either.
- **Your own accounts are you** (cli-core 0.323.0): an account's own identity is linked to you on its next sync, so your
  name in your messages is no longer someone else's.
- **An address keeps its city** (cli-core 0.323.0): the same street in two cities is two places; an address written
  without a city still matches its place on that street.

After updating, read old messages again once: `tg <profile> mentions rebuild person-name place`.

### Security

- **`TG_READ_ONLY` now stops logging in and out, and changes to the message store**: `session start`, `session end`
  and `setup` refuse with `permission_error` before they connect, and so do `store reset`, `restore`, `clear`,
  `migrate`, `repair`, `copies delete` and `decrypt`. `session end` used to log out and delete the session under the
  lock.

## 0.69.0 — 17.10.2026

### Changed — may break scripts

- **An agent can no longer delete for everyone** (cli-core 0.321.0). The MCP `messages delete` takes no
  `for_everyone`, and passing it is refused as an unknown argument; the owner still has
  `tg <profile> messages delete --for-everyone`.
- **`mcp --permission` only tightens** (cli-core 0.321.0). An override that would loosen the profile's level, such as
  `messages.send=allow` on a read-only profile, is refused at startup with the key it names; to allow more, change the
  profile's permissions. `--permission messages.send=deny` and other narrowing overrides work as before.

### Fixed

- **An agent's deny on `chats send-as` and `chats members list` now applies** (cli-core 0.321.0). Over MCP these
  commands read their levels from other keys, so `chats.send-as` and `chats.members.list` did not reach them.

## 0.68.0 — 17.10.2026

### Changed — may break scripts

- **Tasks open only where something is asked of you** (cli-core 0.318.0). In a one-to-one chat every question
  you did not answer opens one, as before; in a group only a question in reply to your message and a mention of
  you; in a channel or Saved Messages nothing. On the owner's store, 300 posts of one channel would have opened 85.
- **`tasks apply` is now `tasks scan`** (cli-core 0.320.0); MCP `tasks_scan`, permission key `tasks.scan`.
- **No setting picks a profile any more** (cli-core 0.319.0). A command names its profile with the first word or
  `TG_PROFILE`. A config file that still has `default_profile` stops a command that names no profile, with the profile
  to type and `tg config unset default_profile`; `tg config set default_profile` is refused. A profile called `default`
  is an ordinary name: `tg default mcp config` names its server `tg-default`, not `tg`.

### What's new

- **Tasks have assignees** (cli-core 0.320.0): `tasks add` and `tasks plan` take `--assignee sender` (whoever sent
  the message) or `--assignee person:<id>`; `none` clears it. `tasks list "assignee:any state:open"` is what others
  owe you.
- **`tg <profile> tags add --chat <group> watch-tasks`** records every question in that group as a task, whoever it
  is for.

### Fixed

- **`tg upgrade`'s "held back" hint names the package and keeps pnpm's release-age exemption** (cli-core 0.320.0).

## 0.67.0 — 17.10.2026

### Security

- Internal attachment references stay out of JSON, JSON lines, MCP and live-event output (Core0.315.0); provider media keys and credentials remain inside the client.

- WhatsApp state files cannot be uploaded as attachments (Core 0.314.0), including configured state paths and symbolic links. Ordinary neighbouring files remain allowed.

## 0.66.0 — 17.10.2026

### Changed — may break scripts

- **The first sync opens no task from history** (cli-core 0.309.0). After an account's first sync, the task rules
  open at most `task_first_pass_per_chat` tasks per chat, and the default is 0. The sync answer's `tasks` counts
  what it held back (`held`, `held_chats`), and a note names `tasks apply`. Later syncs still open tasks from new
  messages. `tg <profile> config set task_first_pass_per_chat 50` brings back the old behaviour.

### What's new

- **`tg <profile> tasks apply <chat...>`** (cli-core 0.309.0): the task rules over a chat's newest stored messages
  (`--last`, 50 by default), for a chat whose history you want as tasks. It lists what would open and changes
  nothing unless `--yes`. Local store only. MCP: `tasks_apply`.

- **Mentions find street addresses, and names of people the store does not know yet** (cli-core 0.308.0).
  `tg <profile> mentions places` lists confirmed addresses across every account. The store moves to version 18,
  with a `places` table, the first time a command opens it.

### Fixed

- **`tg upgrade` through pnpm installs the newest version** (cli-base 0.40.2). pnpm 11 installs only versions a day
  old, so the upgrade could install an older `tg` than the one you had. It now exempts `@wirecat/*` from that wait;
  every other package keeps it.
- `mentions` help summaries fit the shared 80-character limit (cli-core 0.311.0).
- **The duplicate check compares tasks by when their messages were sent** (cli-core 0.310.0), not by when a task
  was written. Tasks written from history in one go no longer all look alike.
- **Old messages fetched into a quiet chat open no tasks** (cli-core 0.309.0): a sync pass skips a chat with
  nothing sent since the last one.
- **No `[client] cannot reach Telegram` lines while tg cannot connect.** 0.64.0 began printing each of mtcute's
  background errors as one line; while the network is down, that is one line per connection attempt. They show only
  with `--verbose` now. A request that fails still reports its own error.

## 0.65.0 — 17.10.2026

### What's new

- **A closed task's card shows the task that follows it up** (cli-core 0.305.0). `tasks show` prints
  `task:<id> follow-up-of this task`, and `--json` and MCP return `linked_from`. Before, only the new task named the
  closed one.

### Changed — may break scripts

- **The daily "a newer version exists" line also stays quiet for `--json=…`, `--timeout=…` and the other quiet options
  written with `=`** (cli-core 0.307.0). Before, only the bare option silenced it. tg now takes this notice from
  cli-core, shared with max and memo.

### Fixed

- **`tg setup --app auto` reads the app keys from the redesigned my.telegram.org.** The site now shows the
  api_hash as dots and keeps its value in the page's copy and show buttons, so 0.64.0 stopped with "could not read
  its keys". The keys are read from there now (checked on the real page), a create counts as done when the site
  answers OK, and the site's own error text is shown instead of its JSON.

- **A broken config file is named in a short error** (cli-core 0.304.0): the first bad key, never its value.

## 0.64.0 — 16.10.2026

### What's new

- **Imported Drive documents retain their Google URL and edit time in shared search** (cli-core 0.301.0). `--source drive:<profile>` selects a registered Drive profile; chat document lists can show the imported title after Drive sync links the stored messages.

- **The MCP server loads only when MCP is served** (cli-core 0.300.0), so other commands start with about a tenth
  fewer files to load.

### Fixed

- **`tg setup --app auto` no longer tries to create a second app when the account already has one.** It read the
  app's keys only from one exact page layout; when my.telegram.org showed the app's page in another shape, it took
  the account for one with no app and asked the site to create another (Telegram allows one per number). Keys are
  now read from the page's text, and an app page whose keys cannot be read stops with "use `--app browser`". An
  error from the site no longer quotes a whole page — which could hold the app's `api_hash` — only its title. The
  hint after a failed app step names the command that was run (`tg <profile> setup --app browser`), and too many
  tries at the site's code is `rate_limited`.

- **A login with a 2FA password no longer prints mtcute's "unhandled error: ConnectionClosedError" stack.** When a
  login succeeds, mtcute replaces its connections on purpose. The old connection then reported itself closed, and with no
  listener mtcute printed that as a red stack trace, with the account id, right after the hidden password prompt.
  tg now listens for these background errors: the expected close shows only with `--verbose`, and any other appears
  as one line in tg's own words.

- **`bin/release` restarts itself once when the release brings a newer `bin/release`**: folding the changelog and
  raising the version both fast-forward `main`, and the shell went on reading the old script from the byte it had
  reached, so the rest of the run was a mix of old and new text. It now starts the new script over with the same
  arguments; a second change during that run stops it with `run it again`. The restart also works when
  `bin/release` was started from another folder by a relative path. Only the repository's own release is affected;
  the published package does not change.

## 0.63.0 — 16.10.2026

### What's new

- **`messages delete` takes message ids separated by commas as well as spaces** (cli-core 0.299.0).
- **tg starts about a fifth faster after its first run.** It keeps Node's compiled code in a cache, in the
  system's temporary folder (`NODE_COMPILE_CACHE` moves it): `tg --help` went from about 0.60 to 0.49 seconds.
- **The task category list lives in one file tg, MAX and memo share** (cli-core 0.298.0):
  `~/.config/WireCat/config.json`, section `task_categories`. It holds only your changes to the default list:
  `"garden": "plants | seedling, es:planta"` adds or replaces a category, `"religion": null` drops a default one,
  and categories a later release adds still arrive. `tasks categories` (MCP `tasks_categories`) names the file in
  `file`, and `config show` marks the categories that come from it. A file that is not valid JSON or names a bad
  category is refused with its path. A store moved by `MESSAGING_STORE` reads the `config.json` beside it;
  `WIRECAT_CONFIG_DIR` moves the file.

### Changed — may break scripts

- **`config set task_categories.<name>` and `config unset task_categories.<name>` now write
  `~/.config/WireCat/config.json` instead of the store**, keeping the file's other sections;
  `config unset task_categories` drops the section. A list that an older tg saved in the store moves into the file
  on the next `config set` or `unset` of a category; until then the store's list still applies. Older tg builds do
  not read the file.

## 0.62.0 — 16.10.2026

### What's new

- **An agent's close can wait for you** (cli-core 0.295.0): `tasks close` run by an AI agent (`AI_AGENT` or
  `CLAUDECODE` set) states its certainty with `--certainty <0..1>`. Below the store's threshold
  (`config set task_agent_close_min`, 0.8 by default), or with `config set task_agent_close off`, the task stays open
  with a close suggestion; `tasks list close:suggested` and `tasks agenda` show it. Confirm it with
  `tasks close <task>` or refuse it with the new `tasks reject <task>`. `--as-owner` closes as you.
- **A new task about a task closed in the last 14 days opens as its follow-up**, linked `follow-up-of` the closed
  one, instead of being refused as a duplicate. It is still refused while an open task may be the same job.
- **`tasks categories` names categories that left the list** while tasks still carry them, with open and total
  counts (`unlisted`); `tasks agenda` lists the ones open tasks carry (`unlisted_categories`).

### Changed — may break scripts

- **An agent's `tasks close` must pass `--certainty`** (MCP `tasks_close`: the required `certainty`), or it fails
  with `task.certainty-required`. Below the threshold the answer has `state: open` and `close_suggestion` set
  instead of a closed task. A script run from an agent's terminal that closes tasks needs `--certainty`, or
  `--as-owner` when the owner asked for the close.
- **`tasks add` may now refuse a task whose message shares words with an open task's message** (exit code 2,
  `task.duplicate-candidates`): the duplicate check also reads a task's source message and its newest linked
  messages, so a rule's task with an empty title is compared by its message. Repeat with `--into <task>` or `--new`.
- **59 default task categories instead of 7**, such as `bills`, `health`, `travel`, `fitness` and `subscriptions`;
  `tasks categories` prints each with its meaning and trigger words. The old seven keep their names, so stored
  tasks stay valid, but a rule now picks the narrower name: a utility bill is `bills`, not `money`. A filter such as
  `category:personal` therefore catches fewer new tasks. A store that saved its own list keeps it;
  `config unset task_categories` takes the new default. A list holds up to 80 categories.

### Fixed

- **Spanish task text is read better**: a rule's category matches other forms of a Spanish trigger word
  (`pagues` hits `pagar`), and the duplicate check reads Spanish due dates such as `mañana` or `el viernes`.

## 0.61.0 — 16.10.2026

### Changed — may break scripts

- **`tg mcp` and `tg bot mcp` no longer take the retired access flags** `--allow-send`, `--allow-mark-read`,
  `--allow-delete`, `--allow-moderate`, `--confirm-send`, `--allow-dangerous` and `--http-confirmation` (cli-core
  0.292.0). An app entry that still passes one stops starting with "unknown option": remove the flag; the profile's
  permissions decide, as they already did.

### Fixed

- **Release scripts report observed lock holders separately from stale release labels.** Shared
  diagnostics no longer attribute a live lock to a previous run; wait for the holders to finish, then
  retry.

- **A login that fails while opening no longer leaves the Telegram client open**: when loading the logged-in user
  fails, the adapter closes the client and the session file before the error reaches the command.

## 0.60.0 — 15.10.2026

### Changed — may break scripts

- **Task and server commands take the shared vocabulary's names**, with no alias (next cli-core, cli-base 0.33.0):
  `tasks similar` → `tasks related`; `tasks duplicates unsure` → `tasks duplicates defer` (permission key
  `tasks.duplicates.defer`; the stored decision is still `unsure`); `tasks add --attach` → `--into`; `tasks claim
  --for` → `--lease`; `tasks agenda --due` → `--due-within`; `server logs --lines` → `--limit` (`-n` stays). The MCP
  tools follow: `tasks_related`, `tasks_duplicates_defer`, `into`, `lease`, `due_within`.
- **`tasks agenda` and `tasks duplicates` filter with query fields, not flags**: `tasks agenda --tag <name>` →
  `tag:<name>`, `--category <name>` → `category:<name>`, `--claimed` → `claimed:any`; `tasks duplicates --unsure` →
  `decision:unsure`. Over MCP, `tasks_agenda` and `tasks_duplicates` take `query` instead.

## 0.59.0 — 15.10.2026

### Changed — may break scripts

- **Flags take the shared vocabulary's names**, with no alias (next cli-core): `chats members audit|fetch --budget` →
  `--max-pages`; `messages sync --estimate` → `--dry-run`; `contacts context --refresh`, `bot contacts show
  --refresh` and `tags auto --refresh-metadata` → `--sync-first`; `search conversations --refresh` → `--catch-up`;
  `attachments show --if-sha256` → `--expected-fingerprint`; `replies edit --chats|--not-chats|--people|--not-people`
  → `--allow-chats|--deny-chats|--allow-people|--deny-people`; `schedule agent|command --once` → `--at-time`;
  `bot chats moderate --no-ban` → `--no-block`; `chats mark-read --until` → `--until-id`; `tasks add|plan --check` →
  `--remind-time`; `store export --to` → `--output-dir` and `--kind` → `--include`; `bot store fetch --from` →
  `--until-id`. The MCP tools' inputs follow: `max_pages`, `until_id`, `expected_fingerprint`, `sync_first`,
  `remind_time`.

## 0.58.0 — 15.10.2026

### What's new

- **Tasks that may be one job** (cli-core 0.285.0): `tasks similar <task>` scores the tasks that may be the same
  job; `tasks duplicates [--unsure]` lists the pairs the rules found, `tasks merge <task> --into <other>` joins them
  and `tasks unmerge` undoes it; `tasks duplicates reject|unsure` decides a pair. `tasks agenda` takes `--category`
  and `--tag`, and `config set task_categories.<name>` edits the category list for the whole store.
- **Mentions** (cli-core 0.285.0): `mentions domains` lists the sites links point to; `mentions list --new` shows
  what was found since the last look; `mentions confirm|reject <id> --all-in-chat` decides a name in the whole chat;
  a `t.me` link names its chat or person. `config set phone_countries es,ru` reads numbers written without `+`.
- **Store version 16**: the mention rules also read the text of notes and stored documents, and one `mentions rebuild`
  reads the ones stored before; `mentions list` still lists mentions in messages only. The upgrade adds triggers
  only, so an older tg still opens the store.

### Changed — may break scripts

- **`tasks add` refuses a task that may be the same job** as an open task, or one closed in the last 14 days
  (cli-core 0.285.0): exit 2, reason `task.duplicate-candidates`, with the candidates in `details.candidates`.
  Repeat with `--attach <task>` to link the message to that task, or `--new` to open it anyway; the same holds
  for `tasks add` over MCP.
- **`phone:` and `value:` also match a stored number that ends with the typed number's national digits** (8 or
  more; cli-core 0.285.0), so a number saved before `phone_countries` is found either way. A Russian landline
  written in groups, `(812) 000-00-01`, is now stored as `+78120000001`, not the bare digits.
- **tg no longer searches mail** (cli-core 0.285.0, cli-core#1121): `tg search mail` and the MCP `search_mail` are
  gone, and `search all` reads messages and notes but never mail; `--only mail` is refused. `tg search mail …`
  answers ``mail is memo's: install @wirecat/cli-memo, then `memo search mail …` ``. `search notes`, tasks, notes
  and tags stay.

### Fixed

- A title with Cyrillic capitals is found by a lowercase query (cli-core 0.285.0).
- **A hostile HTML attachment no longer stalls the reader** (cli-core 0.285.0): a page of unclosed tags or comments
  is read in time linear in its size.

## 0.57.0 — 15.10.2026

### Changed — may break scripts

- **`bot api --allow-any-file` sits on `bot api` itself**, not on each operation that takes files: put it once,
  before or after the method name, and every `@path` field of the call may come from a protected place. Without it,
  `@path` files from credential places, `tg`'s own folders and the local store are still refused before connecting.
- **`tasks add` needs `--category <name>`** (cli-core 0.282.0): money, documents, meeting, delivery, access,
  personal or other; `tasks categories` lists them. Tasks get readable keys such as `Q-15`, and `tasks claim` /
  `tasks release` hold a task for one agent session.
- **`permissions` is the only access setting** (cli-core 0.282.0): a config file that still holds `read_only` or
  `allow` is refused as an unknown setting, and `config migrate` is gone. Settings are read only under their
  snake_case names; `config set` no longer accepts camelCase names.
- **One search language** (cli-core 0.281.0): `--language` and `--regex` are gone from `search messages` and
  `searches create`; write a Lucene regex such as `body:/.*invoice.*/` instead. `conversations embed --workers` is
  gone. A search saved in the old language is refused when replayed: save it again.
- **No folder move at start**: folders left in `~/Library` by a release before the WireCat folder are no longer
  moved.

### What's new

- **`messages sync` opens tasks from what it stored** (cli-core 0.282.0): a question nobody answered, a mention of
  you; closed once you answer.
- **A title match comes first in `search notes` and `search all`** (cli-core 0.281.0).

### Fixed

- **The update notice names `tg upgrade` and stays quiet only while `upgrade` runs** (cli-base 0.29.0), so
  `tasks update` no longer silences it.
- **Nested `--json` field paths work through lists** (cli-base 0.31.1, cli-core 0.283.0).

## 0.56.0 — 14.10.2026

### Changed — may break scripts

- **`store export` writes files in the shape it prints** (cli-core 0.276.0): `--output` files and `--to` folders hold
  the same items as the screen (`chat_id`, `sender_name`, `ref`…). A folder from an earlier version is refused with
  "export into a new folder".
- **`bot api` refuses `@path` files from protected places**: known credential files and folders, `tg`'s own
  folders and the local store are refused before connecting, as `bot messages send --file` does; `--allow-any-file`
  on an operation that takes files sends one anyway. A file over 256 MiB is refused instead of read into memory.

### What's new

- **`config set` and `config unset` accept camelCase setting names** (cli-core 0.279.0): `tg <profile> config set senderColors false`
  is saved as `sender_colors`, the same as the snake_case spelling.
- **Resumable syncs** (cli-core 0.276.0): a sync that is killed keeps what it saved, and the next run continues from
  there.

### Fixed

- **A send Telegram refused for flooding says it may be repeated**: when `messages send`, `messages forward` or
  `polls create` get FLOOD_WAIT before Telegram took the message, the error's `retry.safe` is `true` with
  `after_ms`. Once Telegram took it — a lookup after the send hit the limit — `retry.safe` stays `false`.

## 0.55.0 — 14.10.2026

### What's new

- **Files go up from disk as they upload** (cli-core 0.272.0). `messages send --file`, `--photo`, `--voice`, the
  profile photo and `tg bot` no longer read the whole file into memory first, and the refusal for files of 2 GiB or
  more is gone: Telegram's own limit applies.

### Changed — may break scripts

- **An unheard voice message is named in `missing`** (cli-core 0.274.0): `review`, `inbox` and `messages list` add
  `{field: "transcript", step: "messages.transcribe"}` for each voice message with no kept transcript, so an answer
  whose only content is a voice message no longer reads as complete.
- **`tasks link <task> task:<id>` records a relation between two tasks** (cli-core 0.274.0), with `--kind
  blocked-by`, `follow-up-of` or `related-to`.
- **A next step to a command that only changes this machine is never run unasked** (cli-core 0.273.0):
  `server restart` and `store reindex` steps carry `safe_to_auto_execute: false`.
- **`mentions rebuild` takes its kind as an argument**: `tg <profile> mentions rebuild person-name`, not `--kind`
  (cli-core 0.272.0).

## 0.54.0 — 14.10.2026

### What's new

- **`tg images embed`: find pictures by what they show** (cli-core 0.268.0). Off until
  `tg <profile> config set picture_search true`; download the model once with
  `tg <profile> models image download clip-b32` (about 155 MB), then `tg <profile> images embed [--chat] [--limit]`.
  `search messages` then returns a `pictures` list beside its hits. Picture queries must be English.

- **`tg mentions`: phones, e-mail, links and Google documents found in stored messages** (cli-core 0.264.0, store
  version 7). `mentions list kind:phone`, `mentions list domain:google.com`; a bare word is a value written any way,
  so `89001234567` finds `+79001234567`. `mentions show <id>` gives the text around one. Messages stored before this
  version need one `tg <profile> mentions rebuild`; new ones are read as they are stored.

- **Mentions in a message's files and voice notes** (cli-core 0.269.0, store version 10). The text `attachments
  extract` read and a voice note's transcript yield mentions too, with `field` `file_text` or `transcript`.
  Attachments with text from before version 10 need one `tg <profile> mentions rebuild`, which now also counts
  `attachments`.
- **`tg mentions confirm <id> [person:<uid>|organization:<id>]` and `mentions reject <id>`** decide who owns a phone
  or an address, or dismiss it for good. An organization can own a phone or address apart from any person (store
  version 11; older builds keep working).
- **`phone:`, `email:`, `url:` and `domain:` in a message search** find messages by what their text mentions:
  `phone:"8 900 000-00-01"`, `email:"ana@example.com"`, `domain:docs.google.com`. Mail has no mentions yet.
- **A failing schedule is said before every other command** with one stderr line, until the next run succeeds;
  `schedule list` shows the streak.

### Changed — may break scripts

- **`contacts timeline` pages like every other list:** a list cut at `--limit` answers `page.has_more: true`,
  `page.cursor` and a `page.next` step (`--cursor` continues); `meta.truncated` stays for changes still queued.
  The stderr "cut at --limit" note is gone.
- **Built on `@wirecat/cli-core` 0.269.0 and `@wirecat/cli-base` 0.27.2.**
- **Every answer is an envelope with snake_case keys.** A list is `{items, page: {limit, has_more, cursor?}, next?,
  missing?, meta}`, one thing `{item, next?, missing?, meta}`; `meta.run_id` names the run. This covers every
  command: messages, chats, contacts, writes (`{item: {operation_id, send_id, message}}`), inbox, review, search,
  stats, store, account, doctor, config, runs, `upgrade`, `bot *`, and tg's own `session start|end` and `setup`
  (`app_keys`, `already_logged_in`, `chats.has_more`). What to run next is a `next` step in place of fields such as
  `nextBeforeId`, `nextOffset`, `nextCursor` and `hasMore`. MCP answers are the same envelopes, and MCP tools refuse
  arguments they do not take.
- **Lists take a query, not filter flags.** `chats list kind:group unread_count>0`, `chats events "Hiking" time>=7d`,
  `messages list "Book club" id<4242`, `contacts list notes:<text>`, `attachments list chat:<id> is:needs_text`,
  `store jobs list state:failed`, `inbox date>2h`, `review date>3d chat:<id>`, `search messages 'chat:"Book club"
  lease'`. `--search`, `--kind`, `--unread`, `--type`, `--since-time`, `--before-id`, `--after-id`,
  `--before-time`, `--after-time`, `--topic`, `--search-notes`, `--min-score`, `--revoked`, `--link`, `--answer`,
  `--needs-text`, `--state`, review's `--chat` and search's `--chat` are gone from those commands. `messages
  evidence` and `chats media` continue with `--cursor` from `page.next`. `contacts list name:` needs stored contacts.
- **`doctor`'s Telegram block is snake_case:** `app_credentials`, `keyring_moved_by_environment`, `proxy.bot_api`.
- **Error details are snake_case:** `provider_error` (was `providerError`), a group that became a supergroup says
  `migrated_chat_id` in the Bot API refusal, a forum upgrade that may have happened says `previous_chat_id` and
  `chat_id`.
- **Config file settings are snake_case** (`keep_runs_for_days`, `sends_per_hour`, `read_only`, `default_profile`,
  …). An existing file moves by itself on its first read.
- **Run logs are snake_case** (`duration_ms`, `error_code`, `error_class`, `provider_error`); runs written before
  are still read.
- **Statistics reports refuse `--jsonl`**: a report is one object. `stats chats show` names its chat as a `chat:`
  reference; `stats tasks show` answers one item with `open` and `rows`.
- **`--json=<fields>` replaces `--fields` and `--agent-json`, which are gone.** `--json=id,text` keeps those fields
  of each item. CLI JSON keeps message text as written; MCP answers still show invisible characters.
- **`tags list`, `tasks list` and `conversations list` take a query instead of filter flags.**
  `tags list tag:work type:chat`, `tags list sources:auto`; `tasks list state:open kind:promise chat:<id>`;
  `conversations list <chat> started_at>=7d`. `--tag`, `--type`, `--source`, `--state`, `--chat`, `--before-time`
  and `--since-time` on these lists are gone. Items are the shared entities: a tag names what it is on as `target`,
  a conversation says `messages_count`, `started_at`, `first_message`.
- **Run records keep only listed attribute keys.** A message id under `ids.message` is dropped for now, so
  `runs search <message id>` does not find it (reported to cli-core).

### Fixed

- **MCP prompts name only arguments the tools take.** `review` passes its window as `query` (`date>"…"`).
- **`tg <profile> bot messages delete` takes more than 100 messages.** It sent every id in one call, and Telegram
  takes at most 100, so a longer list failed. It now sends them 100 at a time; if a later call fails, the error says
  how many were already deleted.

## 0.53.0 — 14.10.2026

### Changed — may break scripts

- **Built on `@wirecat/cli-core` 0.262.0 and `@wirecat/cli-base` 0.26.0.** `@wirecat/cli-core` is the new name of
  `@wirecat/cli-messaging`; its 0.262.0 follows 0.261.0. The parity command is `cli-core-parity`. Machine output keys
  are snake_case: `error.details` says `operation_id`, `send_id`, `retry_after_ms`; `commands --json` says
  `global_options`, `inherited_options`, `exit_codes`, `takes_value` and `contract: 1`. A query tree in the MCP `ast`
  argument has `lower_inclusive`, `upper_inclusive` and `must_not`.
- **HTML files are read as their main text** (cli-core 0.262.0): menus, footers and banners are dropped, headings,
  lists, tables and links kept. HTML attachment text already stored is read again on the next `attachments extract`,
  and it changes. `title:`, `site:`, `lang:`, `author:` and `keyword:` search notes and files.

### Fixed

- **`tg config set defaultProfile <name>` and `config unset defaultProfile` work without naming a profile.** They
  asked for one first and failed when several existed (cli-core 0.262.0).
- **`tg default mcp config` and `mcp install` name the profile.** The entry left out a profile named `default`, so
  its MCP server stopped on its first call, since tg no longer assumes a profile (cli-messaging 0.260.0).

## 0.52.0 — 13.10.2026

### What's new

- **Built on cli-messaging 0.259.0 and cli-base 0.24.0.** `store fetch` is now `messages sync` (same arguments,
  options and JSON). `store fetch` still runs as a hidden, deprecated name; the docs and the skill use
  `messages sync`. `bot store fetch` keeps its name.
- **`--debug`:** on a failure, the whole record — cause and stack — follows the error: after the `✗` line in a
  terminal, as a second JSON line otherwise.
- **`runs list` and `runs search` read a per-day index**, so they answer in milliseconds on thousands of runs.

### Fixed

- **The skill warns about three mistakes an agent made while testing.** It compared a plain word in one tool with
  `content:` in another, read `ref` where a search answers `locator` (or `items` where notes answer `hits`), and
  reported a bug fixed in a newer version; a zsh loop over `$c` passed a command path as one argument.

### Changed — may break scripts

- **The local store and the speech models move once into the WireCat folder**, `~/.local/share/WireCat/`
  (Windows: `%LOCALAPPDATA%\WireCat\Data\`), on the first start, from `~/.local/share/cli-messaging/` and
  `~/.cache/cli-common/models/`. The move never overwrites: if both places hold a different store, `tg` stops
  with exit code `3` and names both files. `WIRECAT_STATE_DIR` replaces `CLI_COMMON_CACHE_DIR` and moves the whole
  folder. Upgrade `max` and `memo` together with `tg`: an older one would create a new store in the old place.
  [Where tg keeps its files](docs/installation.md).
- **One error object:** `{"error":{"code","reason","message","details"}}`. What used to sit at the top of
  `error` — `candidates`, `sendId`, `operationId`, `permission`, `retryAfterMs` — is now in `error.details`.
  `reason` is a dotted id (`output_limit` → `output.too-large`, `input_limit` → `input.too-large`);
  `retryable` appears only where the failure sets it, and `actions` only on the failed items of a partial
  result. Exit code `1` is `internal_error` (was `generic_failure`), and its message no longer carries the
  fault's own text; `--debug` shows it.
- **`runs show` lists only what went wrong** (failed responses, warnings, the crash) and adds `eventCount`;
  `-v` shows every event, as before.
- **`tg` never picks a profile for you.** A command that uses an account and names no profile (no first
  word, no `TG_PROFILE`, no `defaultProfile` in the config file) stops with exit code `2` instead of using
  `default`, also when `default` is the only profile. **This breaks every existing one-profile setup**:
  `tg chats list` now fails. The error lists the profiles here, so the fix is in the message:
  `tg default chats list`, `export TG_PROFILE=default`, or `"defaultProfile": "default"` in the config file.
  On a new computer the first login is `tg personal setup` (any name). `--help`, `--version`, `commands`,
  `skill show`, `account list` and `config show` still run without a profile. MCP clients and scheduled
  jobs that start `tg mcp` or `tg serve` without a profile need one added. A bot's `store fetch` uses only
  its own profile's app credentials and personal session, never `default`'s.

## 0.51.0 — 12.10.2026

### What's new

- **`--brief` and `--full` on every command.** `--brief` keeps a found message's reference, chat, time,
  sender, excerpt and score; `--full` keeps everything.
- **`tg search all` names who wrote each hit** and how it was found (by words or by meaning).

- **`tg schedule`: run a command or an agent on a timer**, through systemd (Linux), launchd (macOS) or Task
  Scheduler (Windows). `tg schedule command <name> --every 2h -- messages list <chat>` runs a tg command; a read
  saves what it reads. `tg schedule agent <name> claude "<prompt>" --at 08:30` starts an agent (claude or codex), at
  most hourly. The agent runs with `TG_READ_ONLY=1` and cannot send; its answer is kept as `latest.md` beside the
  schedule and a desktop notification says it is ready. `--once 2h` runs once and then removes the schedule.
  `tg schedule list`, `run` and `remove`.
- **`tg server install` suggests the command for a daily follow-up review**, and turns nothing on.
- **`TG_READ_ONLY=1` refuses every write of the process**, above the config file and `--permission`.

### Changed — may break scripts

- **`tg search messages` answers an excerpt, not the whole text.** Each hit carries `excerpt`, about 240
  characters around the first query word, instead of `text`; `--full` or `tg messages show <ref>` gives the
  whole message. Null `editedAt`, `replyTo`, `forwardedFrom` and `reactions` are left out of machine output. A
  script that read `text` from search hits reads `excerpt` or adds `--full`.


## 0.50.0 — 11.10.2026

### What's new

- **Tasks get a plan, links and a daily agenda** (shared store 0.247.0, version 4). `tg tasks add` takes
  `--title`, `--description`, `--due` and `--check`; `tg tasks plan <task>` changes them later, `none` clearing a
  date. The next check is when an agent should look at the task again, not a reminder: nothing reaches the owner.
  `tg tasks link` links a task to messages, chats, people, documents and URLs; `tg tasks show` prints the plan with
  its links. `tg tasks agenda` lists, without one message's text, the tasks overdue or due soon, the chats owed an
  answer (`owed`), those waiting on others (`waiting`) and those whose newest message is not stored (`unsynced`).
  `tg skill show follow-ups` is the daily routine for an agent: drafts only, it never sends.

### Changed — may break scripts

- Shared store 0.247.0: a meeting context records facts with `fact.add`; `memory.add` no longer takes the kind `fact`.

### Fixed

- Pin shared package 0.248.0, which includes the task follow-up parity entries. Release checks
  now recognize task plans, links, cards, agenda and their options.

## 0.49.0 — 11.10.2026

### What's new

- **Search takes the colon spelling of a comparison.** `date:>=2026-01-01` (and `:>`, `:<`, `:<=`) is the
  same as `date>=2026-01-01`; before, it failed with `invalid_syntax`. A refused `after:` or `before:` now
  names its replacement: `after:2026-09-01` says to use `date>=2026-09-01`.

### Changed — may break scripts

- Shared store 0.246.0 checks new labels against canonical names and aliases before creation.
  Similar names require owner review; reuse an existing label or its explicit alias. Existing
  labels and data remain, and canonical/alias automatic matches share one claim.

## 0.48.1 — 11.10.2026

### What's new

- **Shared store 0.242.0**: existing project and task ids stay; new projects get short keys, and the store can
  check which tasks depend on which.

### Fixed

- **npm installs the packages side by side again.** Built on `@wirecat/cli-messaging` 0.241.0, whose
  `@wirecat/cli-meetings` 0.4.2 accepts cli-core 0.20.0. With 0.240.0, npm put cli-messaging in a nested folder
  with a second copy of cli-core.

## 0.48.0 — 11.10.2026

### What's new

- **`--source` takes a list of accounts and groups** in `search messages`, `search mail` and
  `search conversations`: `--source group:work,tg:mila,email:me@work.example` searches exactly those. An entry is a
  group, `app:account` (a profile of any app — `max:default` works from tg — the account's id or its name) or a
  bare `--source` word. `config set accountGroups.<name> <list>` saves a group for every app.
- **The shared store upgrades to version 2 the first time tg opens it.** Facts — what was said, asked, decided or
  promised — get their own table beside memories; memories saved as kind `fact` move there, and task assignments
  are copied into their own table. An older tg, max or memo still opens the upgraded store.

### Changed — may break scripts

- **On macOS tg keeps its files where it does on Linux**: `~/.config/tg-cli`, `~/.local/share/tg-cli` and
  `~/.cache/tg-cli` instead of `~/Library/…`. The first run moves the old folders there, with the shared store and
  the speech models, and points an installed `tg server` agent at its new log. While a `tg serve` or MCP server is
  running it prints one warning, keeps using the old folders for that run and tries again next time. Linux and
  Windows are unchanged.
- **Purging an account also removes the people only that account had seen.** A person stays while another
  account, a tag, a note or any other record points at them.
- **Mail is searched by meaning thread by thread.** The first index pass after the upgrade cuts every thread again
  and embeds the mail once more; search by words is unchanged.

### Fixed

- **Purging an account that held meetings no longer fails**, and a purge drops the vectors only it used.
- On `@wirecat/cli-messaging` 0.238.0.

## 0.47.0 — 11.10.2026

### What's new

- **`messages list --limit` returns as many messages as asked for.** Telegram hands out at most 100 a request, and
  `--limit 500` used to stop at 100 with `hasMore: true`; it now reads on page by page (cli-messaging 0.235.0).
- **A poll in `messages list` carries its question, answers and total votes** under
  `providerMetadata.poll`, so a channel's polls read without one `polls show` per message.

### Fixed

- **`messages comments --limit 100` (or more) says when older comments remain.** It asked Telegram for one comment
  more than the limit to find out, but Telegram returns at most 100, so a thread of 1,600 comments answered 100 with
  `hasMore: false`. It now asks for at most 100 and reads a full page as more to come.
- **`polls show` gives a poll's total votes before you vote.** Telegram sends the total either way; only each
  answer's count waits for your vote. The total used to be `null` too.
- On `@wirecat/cli-messaging` 0.235.0.

## 0.46.3 — 11.10.2026

### Changed — may break scripts

- **Joining a chat and importing contacts count toward `sendsPerHour`.** A join counts as one, an import as one per
  number; `tg contacts import` sends 10 numbers a request. When the limit stops an import part way, the error says
  how many numbers went and that importing again is safe.

### What's new

- **`tg bot watch` prints and keeps an update once**, even when Telegram delivers it again after a restart: each
  update is recorded by its `update_id` and skipped once handled. With `--events --jsonl`, each line carries
  `update: { id, kind }`.
- `tg search all --backend archive|server|both` and `--server-time`, as on `search messages`; they apply to messages
  only, mail and notes are always searched locally. The default is `both`.
- `tg search mail --account <address>` searches one mailbox; without it, every mailbox. Mail is also searched by
  recipient, folder and subject (`to:`, `cc:`, `bcc:`, `mailbox:`, `subject:`), and attachments by meaning.

### Fixed

- **`tg store fetch --all` waits out a short FLOOD_WAIT on the chat list** (up to 5 minutes, as message pages
  already did) instead of failing at once with `rate_limited`; a 21 s wait ended every fetch of an empty store.
  Shipped in 0.46.2, not listed there.
- Paging through the chats (`store fetch --all` lists them 100 at a time) reads each dialog from Telegram once.
  Each page used to walk every dialog from the top again, so about 1,400 chats cost over 100 requests back to back
  instead of about 15.
- `chats members list --all` waits 1 s between pages of 200 members. It used to ask for up to 50 pages back
  to back, although the limits page said it was paced.

### Security

- **Search no longer answers another account's messages.** `search messages --backend server` with `--source all`
  or `in:all` could return another account's message with the same chat and message ids, and a chat id without its
  account matched that chat in every account; both are fixed.
- On `@wirecat/cli-messaging` 0.233.0.

## 0.46.2 — 11.10.2026

### Fixed

- Archive discovery now handles permission questions such as “Can contractors access production?”
  without treating the final question mark as a wildcard. Strict search and filters keep their behavior.
- Mail searches and linked-person context also read dedicated mail storage, alongside older imports.
  Mail supports sender and thread filters; search results list each email locator once.
- Background history fetches no longer stop at the default 30-second deadline; an explicit
  `--timeout` still applies.

### Changed — may break scripts

- A permanent history-fetch failure before the first saved page now exits with an error instead
  of exit code `0` with an `issue`. Bot history without a starting message exits with code `2`
  and requests `--from`. Failures after progress still report partial results.

## 0.46.1 — 11.10.2026

### Fixed

- Package references, documentation and fixtures use the WireCat namespace throughout.

### Changed — may break scripts

- Independent file or history-page failures retain successful work and return `complete: false`, `batch` or `issue` with exit code `0`. Scripts must check completeness; partial download JSONL adds `batch_summary`. Errors include recovery `actions`. Resuming downloads retries failed checkpoint IDs.
- Batches stop new requests after ten attempts when failures exceed 50%; `MESSAGING_BATCH_MAX_ERROR_PERCENT` adjusts the percentage, with 100 disabling that percentage stop. Throttling and authentication failures stop earlier; writes with unknown outcomes are never automatically replayed.
### What's new

- Set extraction and retained-file transfer size through `MESSAGING_ATTACHMENT_MAX_MIB` (default 50). PDF previews now allow 4000 pixels per side and 8 MiB per page; `MESSAGING_PDF_PREVIEW_MAX_PIXELS` and `MESSAGING_PDF_PREVIEW_MAX_MIB` adjust those budgets. Larger values need more memory; external OCR and decompression budgets remain separate.
- `tg runs search`, also the `runs search` command in MCP `tg_read`, searches safe diagnostic records by text, status, error code and time without connecting to Telegram.

## 0.46.0 — 11.10.2026

### Changed — may break scripts

- **The store prunes its growing logs on open**, at most once a day: agent tool calls older than 90 days are
  deleted, and a handled bot update older than 30 days keeps its row but loses its payload. Upgrade max-cli and
  cli-memo at the same time, as they share the store.

### What's new

- `tg store reset` for a store this build cannot migrate: it backs the store up beside itself, deletes it and
  starts an empty one. It asks first; `--yes` skips the question and `--no-backup` skips the copy.
- `tg search all --meetings [provider:account]` also searches one meeting account's transcripts, chat and
  summaries; `--max-meetings <n|all>` sets how many meetings it looks through (100 by default).

### Security

- **The old `messages.db` is deleted** when the store opens at its default path: the unencrypted file used
  before `wirecat.db`, with its `-wal` and `-shm`. One line on stderr names it. It is kept when
  `MESSAGING_STORE` is set, and while another process still has it open. From `@wirecat/cli-messaging` 0.222.0.

## 0.45.0 — 10.10.2026

### Changed — may break scripts

- **The local store is a new file, `wirecat.db`, and starts empty.** It sits beside the old
  `messages.db`, which `tg` leaves as it is: not read, not converted, not deleted. Run
  `tg store fetch --all` to bring messages back from Telegram. What exists only on this computer —
  for example notes, aliases, tags, tasks and transcriptions — stays in `messages.db`. The login
  stays. Upgrade max-cli at the same time, or the two see different archives.

### What's new

- `tg contacts timeline <person>`, also over MCP as the `contacts timeline` command of `tg_read`:
  everything one person took part in, in every messenger linked to them, newest first, from the local
  store. `--scope personal|work`, `--since-time`, `--until-time` and `--limit` narrow it.

## 0.44.1 — 10.10.2026

### Fixed

- Local PDF text extraction and page previews accept documents beyond 20 pages; extraction follows command cancellation rather than a separate 30-second cutoff. File and image budgets remain.
- Local transcription accepts complete mono or stereo Ogg Opus recordings beyond ten minutes. Long recordings need more memory and processing time.
- Attachments from ordinary hidden working folders are allowed. Known credentials, CLI folders and the message store remain protected.
- Markdown exports preserve message formatting. MCP write arguments preserve original Unicode while returned text still exposes invisible controls; configured model gateways support normal redirects.
- Windows update and MCP setup support ordinary relative PATH entries and custom command-processor environments. This patch keeps the existing message-store schema.
- Search troubleshooting distinguishes archive-only discovery/offline requests from ordinary
  server-backed word search, so an empty local archive does not imply Telegram was searched.

## 0.44.0 — 10.10.2026

### What's new

- Message search can discover partial word matches and eligible direct replies with `--discover`
  or MCP `discover: true`, using the local archive without model downloads. Strict search remains
  the default; matched/missing terms help agents check evidence before answering.

## 0.43.1 — 10.10.2026

### Changed — may break scripts

- **The project is now licensed under Apache License 2.0.** See `LICENSE` for the terms.

## 0.43.0 — 10.10.2026

### Changed — may break scripts

- **The package is `@wirecat/tg-cli` and its repository belongs to WireCatLabs.** Use this package for installations and updates.

- Local transcription accepts complete mono or stereo Ogg Opus recordings up to 10 minutes.
  Split longer recordings first. PDF text extraction supports at most 20 pages and 30 seconds.
- MCP text results and write arguments expose invisible controls, including decoded formatting.
  Subdivision flag emoji stay intact; ordinary CLI machine JSON preserves original strings.

### Fixed

- After an upgrade, server restarts invoke Node directly with separate arguments and preserve the
  selected environment, including installation paths with spaces on Windows. Invalid profile names
  in lock files are skipped.

### Security

- Attachment directory extraction and retained-file transfer refuse hidden paths, CLI-owned folders
  and the message store, including symlink targets. MCP extraction downloads also refuse those locations.
- DOCX extraction applies the bounded office archive reader before loading document content.

## 0.42.0 — 09.10.2026

### Changed — may break scripts

- **Auto-replies answer everyone your rules match, unless you limit the audience; the separate `testers`
  list is gone.** `tg replies audience --reply listed --allow-people <ids>` answers only selected people;
  `--deny-people` and `--deny-chats` leave some out. Nothing is sent until `permissions.replies.send` is
  `allow`, and a new rule is off until you turn it on. A rules file that still has `testers` keeps
  answering exactly the same people: they become the allowed people (only those the audience also allowed,
  if it was already `listed`). Allowed chats in such a file are dropped, because they would open replies to
  everyone in those chats; deny lists stay. The file is rewritten without `testers` on your next
  `tg replies` edit.
- **`tg replies status --json` no longer has `testers`**; the `audience` counts say who may be answered. In `tg replies test` and `serve`, a sender outside the audience is skipped with
  "not on the allow list" instead of "not a test account".

## 0.41.0 — 09.10.2026

### Changed — may break scripts

- **The message store drops the copies kept for older versions** (store version 28, cli-messaging 0.212.0).
  Notes, contact notes, relations and entities written before the notes refactor are copied into their new
  tables once, during the upgrade. After it, an older tg, max or memo refuses the store with "upgrade this
  tool" — update all three together.

## 0.40.1 — 09.10.2026

### Fixed

- **`tg search all` found nothing on a fresh store.** It searched only accounts already in the store, so
  before the first save it looked nowhere; it now always includes this profile's account and asks the
  server the way `tg search messages` does.
- **`tg search mail` with no mail imported answers an empty result** with a note on stderr, instead of
  failing.
- **Notes found only by a weak match in meaning are dropped**, so a rare word no longer returns every note.

## 0.40.0 — 09.10.2026

### What's new

- **`tg topics show <chat> <topic>` shows one forum topic**: its title, whether it is closed or pinned, unread
  messages and last activity.
- **`tg messages forward --topic <id>` forwards into a forum topic** of the `--to` group. The topic is checked
  first, as with `messages send --topic`; topic 1 is General.
- **`tg attachments show --page 1` returns a retained PDF page as PNG.** Remote agents whose clients
  cannot open an embedded PDF can read it page by page as images; rendering needs the optional
  `unpdf` and `@napi-rs/canvas` packages.

### Changed — may break scripts

- **Statistics `--answerer` accepts stored names, aliases and @usernames.** Resolution stays local
  to the selected history’s accounts; ambiguous names return scoped candidates. Unknown names now
  fail instead of producing a fabricated zero-answer identity. Use `person:provider/account/id`
  to explicitly select an unseen opaque ID. Response rows add `identityKnown`; an ID without
  observations has `identityKnown: false` and `status: unknown`. Zero observed answers do not
  prove inactivity ([statistics](docs/rankings.md)).

- **Every search moved under `tg search`.** The old commands are gone:

  | Before | Now |
  |---|---|
  | `tg messages search` | `tg search messages` |
  | `tg messages search --source email` | `tg search mail` |
  | `tg conversations search` | `tg search conversations` |
  | `tg topics search <chat> <text>` | `tg search topics <chat> <text>` |
  | `tg bot messages search` | `tg bot search messages` |

  For agents the tools moved the same way: `search messages`, `search conversations`, `search topics`, and the new
  `search all` to start with.
- **`tg search messages` never returns mail.** A saved search that names `in:email` now asks for `tg search mail`.
- **Permissions named after the old paths** (`messages.search`, `conversations.search`, `topics.search`) stop
  `tg search` until `tg config migrate` renames them, keeping their levels.

## 0.39.1 — 08.10.2026

### Fixed

- Pin the shared messaging library to 0.205.0, matching Memo and MAX for coordinated installation.

## 0.39.0 — 08.10.2026

### What's new

- **`tg polls create --close-time 5m` closes the poll by itself** that long after sending, from 5 seconds to 10
  minutes.
- **`tg polls voters <chat> <message> [--answer <id>]` lists who voted for what** in a poll that is not anonymous.
  When Telegram answers that you must vote first, or that a channel hides its voters, the error says so.
- **`tg chats link update --expire-time never` takes a link's expiry away.** The group's own link can be changed
  too; the help no longer says otherwise.
- **`tg store jobs list --state <state>`** lists only the background jobs that are running, done, failed,
  cancelled or died.

### Changed — may break scripts

- **`tg chats link create` and `update` refuse `--approval` with `--max-uses`.** Telegram dropped a use limit
  when approval was turned on, without saying so; now you choose one.
- **Latin words are searched by their English and Spanish stems at once.** Before, only Spanish, so English
  word forms ("budgets" → "budget") matched worse.
  Watch for: after the update the stem index rebuilds by itself — a small store on open, a large one bit by
  bit: `tg serve` finishes it in the background, `tg store migrate` at once. Until it is ready a search
  matches exact word forms, says so on stderr, and `query.stemming.applied` is `false` in JSON. The stem
  index of Latin text is about twice as large. A `searchStemmers.latin` you set yourself stays, and
  `tg store reindex` still applies it. Update `max` too: an older one, opening the rebuilt store, answers
  a stemmed search with "upgrade this tool" ([archive](docs/archive.md#repair-and-index-maintenance)).
- **Notes about a person (`tg contacts notes`) show in every profile that sees them.** Before, only in the
  profile where they were written.
  Why: notes are yours, not one account's; the shared store now keeps them apart from messages, together with
  notes from `memo`.
  Watch for: with several Telegram profiles, a person's notes from all of them now show together. Aliases
  (`contacts alias`) still apply only in their own profile.

### Fixed

- **`tg polls voters --answer <id>` names the answer** of each vote; it listed them with no answer. Without
  `--answer`, it no longer says more voters remain when it has shown them all.

## 0.38.0 — 08.10.2026

### What's new

- **`tg account list` shows every profile** on this computer, the account each is logged in as and its name.
  It asks Telegram nothing.

### Fixed

- **`tg session start` says "Already logged in"** when the profile's session still works and nothing was asked,
  with `session end` to log in again; it used to look like a login without a code. `--json` gains
  `alreadyLoggedIn`.
- **`tg session start phone --sms` no longer aborts the login when Telegram has no SMS to send**
  (`SEND_CODE_UNAVAILABLE`): it says so and asks for the code Telegram already sent to the app.
- **`tg` or a command group with no subcommand (`tg account`, `tg chats`) shows its help again** at a terminal,
  instead of `✗ (outputHelp)`. A script or `--json` gets a `validation_error` saying to give a command.

## 0.37.0 — 08.10.2026

### What's new

- **Agents can read one folder's chats by name over MCP**, as `tg chats folders show` does (`tg_read`, command: `chats folders show`).
- **`tg chats link update <chat> <link> [--approval | --no-approval] [--expire-time] [--max-uses]` changes one of
  your extra invite links**; only what you give changes.

- **Retained files for remote agents:** `attachments show` transfers bounded chunks with whole-file SHA256.
  MCP returns complete images or binary resources, with a JSON/base64 fallback. Transfer performs no OCR
  or index write; the agent reads the file and saves literal text ([attachments](docs/attachments.md)).

- The shared dependency also adds observed retention cohorts and counter observations with
  per-field freshness; unknown values remain explicit.

### Changed — may break scripts

- Ranking and evidence JSON includes per-field counter observations and freshness; evidence also accepts
  retention-cohort selections. Inspect each field and selection kind before interpreting the result;
  unknown values and incomplete archives do not mean zero.

## 0.36.0 — 08.10.2026

### What's new

- **`tg polls create --quiz --correct <n> [--solution <text>]` sends a quiz**: one right answer, by its position from
  1, and a vote that is final.
- **Stored administrator reports** find questions without observed answers, selected responder latency, known-join newcomer help and viewed posts with little discussion. Reports provide coverage/evidence; saved runs retain parameters and selections.
- **`tg chats folders show <folder>` lists one folder's chats by name**, with its pinned and excluded chats. Names
  come from the local archive; Telegram is asked only for chats the archive does not hold.
- **`tg metadata refresh --only-missing`** reads descriptions only for groups and channels that have none stored yet;
  without `--chat` it takes every stored group and channel, up to `--limit`.
- **`tg store jobs retry <job>`** starts a failed or died background fetch again with the same options;
  `--failed` retries every chat whose newest job failed or died. **`tg store jobs clear`** forgets finished jobs and
  their logs.
- **`tg session start phone --sms` asks Telegram to send the login code by SMS** when it would go to the app.
  Telegram decides: the note after the request says how the code was really sent.
- **`tg topics delete <chat> <topic>` deletes a forum topic and every message in it**, for everyone. It asks first by default;
  `--allow-dangerous` skips the question.
- **Attachment text can be read locally:** ODT, ODS, XLSX, PPTX, EPUB, BOM-marked UTF-16 and
  high-confidence legacy encodings. No model is called; formulas are not calculated and images
  remain for the agent. [Search](docs/search.md) explains the limits.

- **`tg chats folders create|update` take rules**: `--include` contacts, non-contacts, groups, channels or bots,
  `--skip` muted, read or archived chats, `--exclude-chat`, `--pin` and `--emoji`. `folders list` shows them.
### Changed — may break scripts

- `tg chats folders join` says plainly when a link is invalid or expired (exit 6), and `folders order` answers
  only each folder's id and title.
- `tg chats folders create|update` answer with the folder as Telegram stored it: an `--emoji` that is not one of
  its folder icons is dropped by Telegram, and tg used to report it as set.

## 0.35.0 — 08.10.2026

### What's new

- **`tg chats requests list --search <name>` or `--link <link>` narrows the requests** — by name, or to those
  that came by one link; Telegram cannot do both at once.
- **`tg polls show` says whether a poll is a quiz (`quiz`), whether a vote may change (`revote`), and whether you
  made it (`creator`)** — only its maker can close it.
- **`tg polls vote` and `tg polls close` refuse what Telegram would refuse, before sending**: a closed poll, two
  answers in a one-answer poll, a changed or retracted vote where the vote is final, `--retract` with no vote, and
  closing someone else's poll. Telegram's poll refusals now say what to do instead of "Telegram refused: X", and a
  timeout while reading the poll no longer says the vote may have gone.
- **`tg chats requests accept|decline <chat> --all [--link <link>]` answers every pending request at once, and
  `tg chats link list` / `tg chats link revoke` show and stop your invite links.** An `--all` accept is counted
  against the hourly limit before anyone is let in.
- **Rankings retain Telegram reply links and linked channel discussions**, so conversation measures use those
  links when available; ambiguous forum-topic links remain unknown.
- [The ranking guide](docs/rankings.md) explains measures, scores, coverage, saved selections and evidence.
  Replaying a saved selection now preserves exclusive date boundaries.
- **`tg store fetch --all` downloads every chat** — the last 90 days of each, most recently active first;
  `--background` runs it as a job. Search needs it: [prepare your archive](docs/search.md#prepare-your-archive-first).
- **Your own names and notes for people: `tg contacts alias` and `tg contacts notes`**, kept on this computer
  only; `contacts show --with-notes` and `contacts list --search-notes` show and search them
  ([people](docs/people.md#your-own-names-and-notes-contacts-alias-contacts-notes)).
- **Automatic tags for groups and channels: `tg metadata refresh` and `tg tags auto`**, from title and
  description, never touching your own tags ([search](docs/search.md#tags)).

### Changed — may break scripts

- **Every search says what it searched.** One line in the terminal — messages and chats searched, chats never
  fetched or behind, and the command that fixes it; `coverage.next` in JSON tells an agent what to run.

- **Word search now asks Telegram as well as the local archive by default (`--backend both`).**
  Previously it searched only the archive unless a backend was chosen. Search can now connect to Telegram;
  use `--backend archive` for local-only searches. Counting with `stats`, topic search and queries the server
  cannot answer still read only the archive.

- **`tg chats join` to a group whose admins approve who joins answers `requested: true` and exits `0`**, instead
  of exit `11`: the request was sent all along. A script that treated exit 11 as "request sent" now reads
  `requested`.

## 0.34.0 — 07.10.2026

### What's new

- **`tg stats messages top` and `tg stats contacts top` rank stored messages and their authors**, and
  `evidence` under each shows the messages behind a place in the ranking. They read only the local store and
  ask Telegram nothing; `searches create --selection` saves such a ranking as a search.
- **Every profile now has one request pace, shared by all `tg` processes using it.** Two commands at once,
  background `store fetch` jobs, `mcp` and `serve` used to pace themselves separately, so running several
  multiplied the request rate; now they share one allowance — a burst of 20, then one request a second. A
  wait Telegram asks for holds the whole profile, and a request that would wait more than 5 minutes fails at
  once with exit code `8`. Bulk work run in parallel takes longer. `requestsPerMinute` or
  `TG_REQUESTS_PER_MINUTE` changes the pace; [the limits page](docs/limits.md) explains all of it.
- **`tg messages send --html` and `tg messages edit --html` read Telegram's HTML** — `<b>`, `<i>`, `<u>`, `<s>`,
  `<a href>`, `<code>`, `<pre>`, `<blockquote>`, `<tg-spoiler>` — with line breaks kept as typed
  ([usage](docs/usage.md#sending)).
- **`tg messages send --file … --filename <name>`** sends the file under the name others see.
- **`tg messages list <chat> --topic <id>` reads one forum topic**, back from its newest message or `--before-id`.
- **`tg chats folders order` puts folders in the order you name**, and **`tg chats folders join <link>`** adds a
  folder someone shared by a `t.me/addlist/` link, joining every chat in it.
- **`tg chats link create <chat>` makes another invite link — `--approval` to make whoever joins by it ask first,
  `--expire-time` and `--max-uses` to limit it — and `tg chats update --join-approval on|off` makes everyone ask
  first.** Both work in a private group as well as a public one.
- **`tg chats requests list <chat>` shows who asked to join a group that needs approval, and `tg chats requests
  accept|decline <chat> <person>` answers one.** Only admins see the requests; an accepted one counts toward the
  hourly limit like an added member.

- **`tg messages search --backend both` asks Telegram as well as the archive.** Telegram's results are saved
  and checked by the same query, so `exact:`, `-word` and the ranking keep their meaning; each message says
  whether it came from the archive, Telegram or both. `--backend server` shows Telegram's results alone;
  `--server-time` bounds the wait (5 s). The default stays the archive ([search](docs/search.md)).

- **`tg chats mark-read <chat> --topic <id>` marks one forum topic read**, up to `--until` or its newest
  message, and leaves the rest of the chat as it is.

- **`tg topics edit <chat> <topic>` renames (`--title`), closes or reopens (`--closed on|off`) and pins or unpins
  (`--pinned on|off`) a forum topic, and hides or shows the General topic (`--hidden on|off`); `tg topics order
  <chat> <topic...>` puts the pinned topics in order.** Repeating either is safe.

- **`tg messages send --spoiler` blurs a photo or video until tapped, and `--caption-above` puts the text above
  it.** A spoiler on a document or voice message is refused.

- **`tg chats send-as <chat>` lists who you may post as in a group, and `--send-as <id>` posts as one of
  them** — on `tg messages send` (files included), `tg messages forward` and `tg polls create`. The list always
  includes you and marks the group's saved choice; reading it changes nothing. An id not in the list is refused.

### Changed — may break scripts

- **A send, forward or poll with no `--send-as` to a group that posts as a channel by default is refused** (exit
  `2`), instead of going out as that channel. The error names `--send-as <your id>` to post as yourself and
  `--send-as <channel id>` to post as the channel.

## 0.33.0 — 07.10.2026

- **`tg contacts profile` and `tg contacts check` estimate the age of accounts made up to August 2026.** The
  table that guesses a sign-up month from an account id ended at November 2025, so the newest accounts got no
  estimate. Late-2025 ids now read up to four months later than before, closer to when they were really made.
  Estimates for 2026 are off by about three months; `source: "estimate"` still marks every guess.
- **Attachment OCR through the shared gateway.** Agents normally read images/scans themselves and
  write text through `attachments text set`. Explicit bulk processing uses `attachments extract --ocr`,
  `models.ocr` and bounded `--concurrency`; complete text enters the existing `content:` index.
  Hash/model caching avoids repeated calls, and failures preserve agent text and old indexed text.

## 0.32.0 — 07.10.2026

### What's new

- **`tg messages comments <channel> <post>` reads the comments under a channel post, and `tg messages send
  --comment-to <post>` writes one.** Comments live in the channel's discussion group; a post without one is exit `6`.
- **`tg contacts profile` lists earlier names and usernames** under `aliases`, oldest first, with a `t.me`
  link for an old username. The local store now keeps a name or username when it changes. See
  [People](docs/people.md).

## 0.31.0 — 07.10.2026

### What's new

- File extraction through MCP, explicit directories and `messages download --extract`; changed files
  are checked by content hash. Optional bounded local preparation follows history fetches, off by
  default. `store gaps plan` and `store gaps repair` inspect recorded interior gaps and explicitly
  repair them with bounds and resumable jobs; unknown edges and ambiguous pages remain pending.

- **`tg stats chats official <chat>`**: Telegram's own statistics for a supergroup or channel you administer, as
  its apps show them — totals against the previous period, top posters, admins and inviters (supergroups), recent
  posts and notification share (channels), and every graph as JSON series. Read only. Works where Telegram shows
  you statistics; elsewhere it fails with a permission or validation error. See [Groups you run](docs/groups.md).
- cli-messaging 0.162.0 also brings `store gaps repair`, the catch-up options of `store fetch`,
  `messages download --extract` and `attachments extract --from-dir` / `--cursor`.

- **Configuration, permissions and profiles have separate guides.** Setup starts with file locations and common tasks; the full settings reference remains available.

### Changed — may break scripts

- Configuration is split into a short guide and full key/type/default/scope/environment reference.
  The public CLI contract describes headless execution, schemas, bounds, previews and retry rules.
- Validate portable skill metadata, installed version, command paths and configuration-key coverage in CI.
  Native login and optional setup questions respect the shared no-input policy.

- **First settings resolution creates config.json.** Existing files are preserved; environment and flag overrides are not saved. config show may now create the file, and common values report file defaults as their source.
- **Word and phrase searches include word forms.** Scripted queries may return more messages. Use exact: or --exact for the previous exact-form behavior; explicit text: still matches forms. Archive language settings affect matching.

### Fixed

- Search catch-up honors readonly or denied `conversations.links` before fetching or queueing
  preparation, including gap repair. Explicit `--no-catch-up` still permits authorized history reads.

- Person context finds private dialogs without recorded members when the dialog ID is the person's
  ID, restoring direct messages and the last message each way in existing Telegram stores.
- Interrupted writes preserve their unknown outcome, operation ID and retry information; check the
  result before retrying a Bot API write that timed out.

## 0.30.0 — 07.10.2026

### Changed — may break scripts

- **`tg mcp` offers an agent three tools instead of one per command: `tg_tools_search`, `tg_read` and
  `tg_write`.** The agent finds a command by words and runs it as
  `{ "command": "messages list", "arguments": { … } }`, with the same arguments and the same answer its
  old tool had. `tg bot mcp` works the same way: `tg_bot_tools_search`, `tg_bot_read`, `tg_bot_write`.
  Why: an agent read about 80 tools' descriptions before its first question.
  What to watch for: the old names (`tg_messages_send`, `tg_status` and the rest) no longer work, and
  neither do client rules that name them; allow `tg_read`, and `tg_write` if you want, in your client
  ([MCP](docs/mcp.md)).

- **Writes over MCP show no confirmation form: the profile's permissions decide alone.** A level of
  `ask` acts like `allow` over MCP, over stdin/stdout and `--http` alike.
  Why: forms broke in many clients and got in the way.
  What to watch for: with the default permissions an agent may now delete your own messages; set
  `tg config set permissions.messages.delete readonly` to stop it. Actions a group's rules want
  confirmed are left for you. `--confirm-send`, `--allow-dangerous` and `--http-confirmation` (from
  0.30.0) are accepted with a warning and change nothing; `tg mcp config` no longer writes them.

- **Statistics use `stats messages show`, `stats chats show` and `stats tasks show`.**
  Legacy `messages stats`, `chats stats` and `tasks stats` paths are removed. Update commands
  and exact permissions to `stats.messages.show`, `stats.chats.show`, `stats.tasks.show`.
  MCP: use `tg_read` with the same command path.
- **Parser errors return exit 2 with a structured validation_error.** Scripts expecting
  prose or exit 1 must update their error handling.

### What's new

- **`tg setup` is easier to follow.** Each step is a heading, `[1/5] This computer`, with what happened
  indented under it; the questions and the QR code sit under their step, with a blank line around the code.
  The closing summary lines its labels up, the command to try first on top. `--json` output and its keys
  are unchanged; `--quiet` still hides the steps.

- **A list of what waits on you.** Since 0.29.0, `review` and `serve` keep a task in the local store for a
  question nobody answered and a message that mentions you by name, and close it once you answer; now you
  can see them. `tg tasks list` shows each with the message it points at; `tg tasks add <message> --type
  promise` adds what the rules cannot see; `tg tasks close <task> --as done|dismissed` closes one for good;
  `tg stats tasks show` counts them per chat. Nothing is sent by these commands. MCP: use `tg_read` or `tg_write` with the same command path.

- **Reply rules can be edited from the CLI and use Liquid templates with optional ai blocks.**
  `replies add|edit|on|off` changes rules and `replies audience` changes profile allow/deny lists.
  `models.replies` selects the provider; `replies consents` grants profile/endpoint consent with
  native-chat opt-outs. Ordinary `replies test` previews instructions/fallback without calls;
  `--ai` explicitly submits stored data. Legacy templates retain their literal fallback with warnings.
  Sending remains limited to testers and replies.send; see [archive](docs/archive.md#reply-rules).

- **MCP writes can run from web clients without server forms.** The profile's permission levels
  apply to HTTP and stdio alike; `ask` and `allow` permit the requested MCP write. Repeat
  `--permission key=level` to override permissions for this server process without editing config.
  App approval is separate and cannot be verified by the server. [Browser setup](docs/remote.md).

- **Charts can be saved as PNG.** `tg stats charts <chat> --output activity.png` writes a dark-theme
  chart to a new file; SVG stays available. MCP `tg_read` with `command: "stats charts"` and `format: "png"`
  returns an image and JSON without connecting to Telegram or writing a file.
- **The open-tasks MCP prompt lists pending tasks.** It calls review to refresh tasks,
  then lists them with an optional `chat` filter; closes tasks only after approval and sends nothing.
- **Browser setup covers Windows, macOS and Linux.** The guide separates PowerShell and
  terminal commands, temporary send permissions, Codex web login, two simultaneous servers
  and stopping individual tunnels. [Browser setup](docs/remote.md).

### Fixed

- **Estimated registration dates are closer for accounts made in 2022–2025.** When Telegram does not give the
  month, `contacts profile` estimates it from the id; the estimate now rests on 212 real sign-up dates. Accounts
  from 2022 no longer look about nine months younger than they are: estimates are off by one to two months in
  the middle case. Ids up to November 2025 now get an estimate; newer ones still get none.

- **`tg serve` and `tg watch` stopped with SIGTERM or Ctrl-C end cleanly.** They exited 1 with
  `database is not open`, and the updates and contacts that were still arriving were lost: the Telegram
  library closed the login file on the signal, before the command had finished with it. Now the command
  closes it, once, after saving what arrived.

- `chats show` gives a supergroup's real member count, which Telegram's chat list showed as missing or
  out of date, and a group's card or invite link gives a basic group's count instead of 0. The member
  list now carries the group's count too, so `chats members fetch` can tell who left a supergroup once
  tg moves to the next shared library.

## 0.29.0 — 06.10.2026

### What's new

- **Long messages are searched by meaning in full.** A message longer than about 1200 characters is split
  into overlapping pieces before it is embedded, so `messages search` by meaning reads all of it, not only its
  start. Chats built before read as outdated, and `conversations build` or `search --refresh` rebuilds them
  (cli-messaging 0.153.0; the store moves to version 21, which older builds still write).

- **A person's profile.** `tg contacts profile <person>` shows what Telegram says about someone — every
  username, bio, birthday, Telegram's own marks (bot, verified, premium, scam, fake, restricted, deleted),
  when they were last seen (`recently`, `week` and `month` are no longer shown as hidden), whether you are each
  other's contacts, when the account was made (Telegram's own month, or an estimate from the id, always
  labelled), whether they have a photo of their own — and, for each chat you share, how many of their
  messages are stored, the first and the last. The phone shows its last four digits unless `--show-phone`. It
  asks Telegram nothing more than `contacts show` does. MCP: `tg_contacts_profile`.
- **Record group membership over time.** `tg chats members fetch <chat>` saves profiles, membership changes
  and a daily count; `--budget` limits pages, and nobody is recorded as having left after a partial read.
  `--track` starts daily fetching while `tg serve` runs. `chats tracking list|show|add|remove` manages the
  tracked groups; stopping tracking keeps recorded history. `chats members history --since-time` reads
  recorded joins, leaves and profile changes without contacting Telegram. The first snapshot records a
  baseline, not proof that every person joined that day; missed days are not reconstructed.
  `chats members list --offline` reads the last complete saved roster. Uses cli-messaging 0.152.0.
- `tg contacts context <person> --chat <chat>` (repeat it for more) gives their newest messages in each chat,
  as time and text only, for an agent to summarise; `-v` adds ids and links, `--limit` is per chat, and `--refresh`
  asks Telegram first with one search by sender per chat.
- **Is this account a bot?** `tg contacts check <person>` scores one person from Telegram's own marks, their
  profile and oldest photo, what the store holds that they wrote, and the public spam lists Combot CAS and
  lols.bot, which are sent their id; `--no-registries` skips the lists. `tg chats members audit --deep <n>` runs
  the same check on the top n members, one a second. Every reason says where it came from; a hint, never a
  verdict.

### Fixed

- **Help explains what member checks read and where they connect.** `--no-registries` skips public ban
  lists but still requests the person's profile and photos from Telegram; `--offline` is the local-only
  mode. Deep checks inspect at most 1,000 stored messages per person and make individual requests for
  selected members. `contacts context --chat --refresh` explicitly connects before reading the store.
- **`contacts profile` no longer guesses a registration date for the newest accounts.** The id table ends at
  December 2024 and cannot tell a newer id from 2025 from one from 2026; such ids now get no estimate rather
  than a date that may be years too early.
- **`tg mcp --http`: Claude and ChatGPT can finish logging in.** The login page made the browser send its form
  as coming from nowhere, and `tg` refused it with "Origin not allowed". Now the login works (cli-messaging 0.152.0).
## 0.28.0 — 06.10.2026

### What's new

- **Search the text inside files.** `attachments extract` indexes retained plain text, Word and PDF text
  layers for `content:` queries. Word/PDF need optional `mammoth`/`unpdf`; an agent reads scans and photos
  and saves their text with `attachments text set`. `--download --output-dir` explicitly fetches missing files.
- **Refresh before searching and follow replies.** `--sync-first` fetches within defaults of five chats,
  500 messages and 30 seconds; incomplete refresh keeps local results and reports stale coverage.
  `--thread` follows a bounded stored reply graph with link provenance, falling back to time context when absent.
- **Filter conversations and choose account scope.** `--filter` is strict Lucene and applies before ranking;
  one message must match the entire filter. `--source` widens scope explicitly. MCP now offers agent-linking
  batches, link write-back, rebuilding and the `link-conversations` prompt.
- **Configure embeddings and analysis separately by profile.** Local embeddings and the owner's agent remain
  defaults. Remote providers receive text only when chosen; `build --analyze --chat` requests and remembers
  account/chat/provider consent until revoked. A remote embedding setting also sends MCP search query text.

- **`tg` connects through a proxy: SOCKS5, HTTP `CONNECT` or MTProxy.** Set it per profile with
  `tg config set proxy <url>` — or `tg config set proxy -` to paste one with a password or an MTProxy secret, which
  is kept in the OS keyring, never in the settings file — or for one run with `TG_PROXY`. Bot API commands use the
  same SOCKS5 or HTTP proxy; with an MTProxy they go direct, and `tg doctor` says so. A proxy that refuses or cannot
  be reached fails at once with `configuration_error` (exit 3), so it never reads as Telegram being down.
- **`tg doctor` says what it really checked.** The login shows as `not checked` until you add `--online`, and each
  private file or folder other users can read is named with the `chmod` that fixes it; `doctor` never changes a
  mode itself. `tg doctor --online` also reports this computer's clock against Telegram's (a warning past 10
  seconds), and whether the account is active, frozen (with its dates and the appeal link), banned, deleted or
  logged out. `tg doctor` and `tg server status` show the waits Telegram asked this profile to keep, and any hold on
  its writes, as `flood`.
- **`tg flood clear`** forgets those waits and lifts the hold on writes, once Telegram no longer limits the
  account. It never connects. Agents get no MCP tool for it, on purpose.
- **Tags: your own labels on a chat, a person or one message**, kept in the local store and never sent.
  `tg tags add <tag…> --chat <chat> | --contact <person> | --message <message>`, `tags remove` with the same target,
  and `tags list`. `tag:<tag>` in a search finds what is tagged. MCP: `tags_list`, `tags_add`, `tags_remove`.
- **Saved searches and a search history.** `tg searches create <name> [query]` saves a search without running it;
  `tg messages search --saved <name>` and `tg messages stats --saved <name>` run it — more words are added with
  AND, and options you type replace the saved ones. `searches list`, `show`, `history`, `delete` and `clear` manage
  them. Every search and count that succeeds is kept in the history: its query and options, never a message or a
  result, the newest 1,000. `--no-record` keeps a run out of it; for MCP, `tg mcp --no-record` or `record` set to
  `false`. Saved searches and the history are shared with max-cli, which uses the same store.
- **`tg contacts context <person>`**: what the store holds about one person — shared chats, the last message each
  way, their recent messages, where others mentioned them — across every messenger linked to them. It never
  connects, and `permissions.messages: deny` blocks it like other message reads. `tg contacts link <person>
  max:<person>` records that a Telegram and a MAX account are one person; `contacts unlink` undoes it.
- **Reply rules can answer test accounts.** `tg serve` answers with the rules in `config/<profile>.replies.json`
  only to the accounts in its `testers` list, and only when `permissions.replies.send` is `allow` — it is `deny`
  by default, and an empty list answers nobody. `tg replies test` shows what the rules would have answered in the
  stored messages and sends nothing; `replies pause` stops every rule at once, a running `serve` too; `replies
  resume` undoes it; `replies status` says whether the rules may send and to whom.
- **`tg store repair [--dry-run]`** brings every table of the store to this build's shape, deleting nothing: a
  table of the wrong shape is kept as a copy beside the new one, and `tg store copies delete <name>` removes a copy
  once you have looked. It repairs a store where reading a message failed on `messages.mentions`.
- The store gains tables for tags, saved searches, member history and word stems the first time this version opens
  it; older `tg` builds still open the file. `tg store migrate` and `tg store reindex` also build the word-stem index
  (on a large store, run `tg store migrate` once), and `tg config set searchStemmers.cyrillic` (`russian` or `none`)
  and `searchStemmers.latin` (`spanish`, `english` or `none`) choose the stemmers for the whole store. Searches do
  not use the stems yet.
- **`chats members audit` judges with everything Telegram's member list carries.** Each member now brings when
  they joined, who invited them, and whether the account is a bot, deleted, marked scam or fake, or has no photo —
  so bursts of joins, mass invites and marked accounts show up, with no extra request per person.
- **`chats stats` counts comments on channel posts**, beside views and forwards.
- **A file whose upload drops is tried again, up to three times, before anything is sent.** If it still fails, the
  error says nothing was sent, instead of exit `14` "it may have gone". The message itself still goes once, with
  its send id.
- **Search has three guides.** [Message search](docs/search.md) is everyday searching by words, people, dates,
  files, links and tags; [topic search](docs/topic-search.md) explains conversations, vectors, freshness and what
  a remote model sends; [query language](docs/query-language.md) is the reference.
- `tg mcp doctor` shows the last lines of the server's error output when it fails to start, with your home folder,
  long numbers and anything like a token hidden.

### Changed — may break scripts

- **Local e5-small meaning results require cosine similarity above 0.80 before combining with words.**
  Exact word matches remain eligible. Results may be shorter and a combined hit may become words-only.
- **The shared archive gains attachment text and analysis consent tables.** Opening it migrates local schema
  while retaining existing messages; back up a large archive before upgrading.

- **A wait Telegram asked for is remembered.** After a `FLOOD_WAIT` (exit 8, `rate_limited`, with
  `retryAfterMs`), the same call — and, when it named a chat, the same call in that chat — fails at once with exit 8
  and `details.remembered: true` until the wait has passed, without asking Telegram. A script that retried at once
  after exit 8 now gets exit 8 again, sooner. `tg flood clear` forgets the waits.
- **A frozen or spam-limited account's writes are held.** After Telegram refuses a write because the account is
  frozen or limited as spam (`PEER_FLOOD`), every send-type write fails with exit 5 (`permission_error`) that says
  until when; reads, reactions and marking read still work. A spam limit holds for an hour, set again by each new
  refusal; a frozen account until Telegram's end date, or a day. `tg doctor --online` sets a frozen hold and lifts
  it once the account is active again; it never lifts a spam hold — `tg flood clear` does, once you know the limit
  is gone.
- **`PEER_FLOOD` exits with code 5 (`permission_error`), not 11**, and points to @SpamBot: retrying makes it
  worse. A frozen account's refusal is also a `permission_error` pointing to `tg doctor --online`, not a rate limit
  to wait out. A banned or deleted account no longer tells you to log in again.
- **A one-shot command waits out a FLOOD_WAIT of up to 10 seconds twice at most, not five times**, and says so on
  stderr; the next one ends it with code 8 (`rate_limited`) and `retryAfterMs`. `serve` and `watch` wait up to
  2 minutes, three times.
- **`tg serve` and `tg watch` exit when Telegram ends the login while they listen**, with code 4, within about 15
  minutes; the service does not restart on it. If the updates stop for another reason, or Telegram does not answer
  within 30 seconds when asked, they exit with code 12, which systemd restarts. Before, they stayed up and received
  nothing.
- **Telegram's `AUTH_KEY_DUPLICATED`** (a login ended because two connections used it at once) is now
  `authentication_error`, exit 4, not `provider_error`. The message says to log in again and names overlapping
  `tg` processes as the cause.
- **Pin, unpin, react, mark read, delete, vote, poll close, folder and contact changes end in exit `14`
  (`outcome_unknown`) when Telegram does not answer**, instead of a timeout or network error that the send
  journal recorded as failed. The message says whether a repeat is safe; for a folder creation it is not —
  check `tg chats folders list` first.
- **`tg inbox`, `inbox --new`, `review` and `chats list --unread` (also with `--search` and `--kind`) look at every
  chat**, not only the newest 100 or 200, so an unread chat further down the list is no longer left out. This costs
  one request per 100 chats. `partial` now means only that Telegram could not list every chat; chats past the
  20-per-run cap are named in a `skipped N chats` note.
- **`tg messages list --after-id`, `--after-time` and `--before-time` no longer stop at a page shorter than
  `--limit`.** Telegram leaves deleted messages out of a page, so a short page in the middle of a chat answered
  `hasMore: false` and dropped the hint for the next page. They now say there is more until Telegram returns an
  empty page, as plain `messages list` already does: the last page may say there is more, and following its hint
  returns an empty page.
- `tg messages search` takes its query as optional, since `--saved` can stand alone; with neither it still refuses.

### Fixed

- **Account-qualified context locators reject another account before reading.** MCP also accepts
  `offline: true` for ordinary stored context.
- **Stopping `tg serve` with Ctrl-C or a signal exits 0.** The session database closes once, avoiding the
  previous "database is not open" error on shutdown.

- **`messages delete` checks the ids belong to the chat first.** In a private chat or a basic group Telegram
  numbers messages per account and deletes by number alone, so an id from another chat — or the other side's
  number for the same message — deleted a message there. Now any id that is not in the named chat stops the
  whole delete with exit 2, and nothing is deleted.
- `text:/…/` in a strict search folds letters as the word index does, so `text:/Квартир.*/` and `text:/счёт/`
  find the words they missed. A search error says what to do instead: `~` points to `--language legacy`, a prefix
  too short to expand names a longer one, and an index still building gives the exact `tg store migrate`.
- Two `tg serve`s started in the same instant for one profile can no longer both run.
## 0.27.0 — 04.10.2026

### What's new

- `tg mcp --http --public-url https://<name>.ts.net` serves behind your HTTPS tunnel with its own owner-code
  OAuth login. Every HTTP write needs a form; `tg mcp --revoke` forgets browser logins for the profile.
- `tg chats stats <chat>` counts stored group/channel activity and asks Telegram for joins and leaves.
  Offline and MCP results omit membership; incomplete counts are lower bounds.
- `tg chats members audit` lists suspicious member signals without removing anyone; unavailable signals
  are reported in `unknown`. MCP inbox/review accept `kinds` and `new` with their own checkpoints.

- Personal MCP uses the matching shared catalogue adopted by MAX. Photo previews accept `index`,
  and direct transcription accepts `model`. The SDK also adds archive statistics, conversation
  readiness and bounded local refresh; models are never downloaded automatically.

### Changed — may break scripts

- Search/statistics coverage uses actual inventory and fetch timestamps; each completeness entry adds
  `fetchedAt`. Old stores gain these facts after the next whole chat list and history fetch.
  The `/catch-up` prompt takes `kind` and `mode` instead of `since`.
- `config set permissions` refuses unknown command keys, including keys inside a whole object, with exit 2.
  Existing files warn and continue; `config unset` can remove an old unknown key.
- `store fetch --page-size` above 100 is refused before connecting. Run `store fetch <chat>` again to repair
  an incorrect history-start mark when older messages exist.

- **`tg serve` exits with code 12 (`provider_unavailable`) when a saved session exists but the app credentials are unavailable**,
  for example while the login keyring is locked. Systemd retries after 30 seconds; macOS needs `tg server start`.
  Other commands and profiles without a saved session still exit 4.
- **`tg serve` and `tg watch` refuse to start with code 4 (`authentication_error`) if the session was already revoked.**
  They check the login before reporting readiness. A session revoked after startup still needs a separate check.
- **The background service no longer restarts on that code.** On systemd, exit 4 prevents a restart. On macOS,
  launchd cannot exclude one exit code, so the agent no longer restarts after any failure. Run `tg server install`
  again to update the unit; after `tg session start`, run `tg server start`.

- Unknown personal MCP arguments now fail before execution. Use the advertised schema, including
  `at_time` for scheduling. Approved schedules execute at the absolute time displayed in the form.

- **`tg messages list` can answer `hasMore: true`, with the `older messages: --before-id` hint, on a page shorter
  than `--limit`.** Telegram leaves deleted messages out of a page, so a short page is no proof of a chat's first
  message. Even the last nonempty page may say there is more; following its hint can return an empty page.

### Fixed

- Legacy, regex and filters-only search report the actual word-index readiness. `server status` reports
  the last normal unit exit and a stopped-login hint when the unit deliberately stays down.

- **`tg store fetch` no longer stops early and counts a chat as complete when a page comes back short.**
  Telegram leaves deleted messages out of a page, so a page can be short in the middle of a chat; the
  fetch now goes on until Telegram has nothing older. For a chat already counted as complete with older
  messages missing, run `tg store fetch <chat>` again: it reads below what is held.

## 0.26.0 — 04.10.2026

### What's new

- **The bundled agent instructions explain how to find agreements, prepare meetings and recommend contacts.**
  Agents check archive coverage, compare group and personal chats, distinguish people with the same name,
  and retain a draft when sending is refused.

- **`tg messages link` and read-only MCP `tg_messages_link` return a message permalink and locator.**
  Channels and supergroups preserve thread context; private links require access and grant no
  membership. Dialogs, basic groups and Saved Messages return a locator. Offline validates the
  stored message without connecting; locators for another account are refused.
  Singular `link` differs from conversation-graph `links`.

### Changed — may break scripts

- **Unpin uses its own permission, `messages.unpin`, in CLI and MCP.** Previously the shared
  guard checked `messages.pin`. Profiles with explicit canonical permissions should review their
  unpin rule; legacy `allow: ["pin"]` continues to cover both actions.

- **`tg commands [path...] --json` can describe one command or group.** For example,
  `tg commands messages search --json` includes global options and exit codes alongside that command.
  Without a path the full tree is unchanged; scoped responses add `scope` and `inheritedOptions`.
  Inspect different command paths in separate calls.

### Fixed

- **Unanswered reviews consider retained voice transcripts and requested new transcripts before
  filtering.** Add `--transcribe` to recognize voices that have no retained text. Unrecognized
  voices leave `complete` false: keep the previous review boundary rather than treating an empty
  result as proof that nothing needs an answer.

- Commands opening the local archive together wait briefly for initialization instead of failing
  immediately when another process holds its write lock. Persistent locks still fail normally.

- Voice transcription downloads use the history connection and close it before local recognition,
  avoiding a second connection for `messages list --transcribe`, `inbox` and `review`.

## 0.25.0 — 03.10.2026

### Fixed

- `chats show` explains that differing listed-member and participant counts may reflect self
  omission or a partial list, rather than claiming incomplete loading. JSON data stays unchanged.

### What's new

- The README and bot guide make the complete native Bot API surface explicit: all 185 methods
  of the pinned Telegram Bot API 10.3, alongside the convenient bot commands and use-case MCP tools.

- `config migrate --dry-run` previews legacy access settings as canonical permissions without
  writing or connecting; `config migrate` applies it explicitly while preserving effective levels.
  Other configuration values stay unchanged.

- `tg <bot> bot api <method>` covers the pinned Telegram Bot API schema using cli-core generators
  and the common MAX/TG command builder. Native field flags, JSON/stdin bodies and nested multipart
  uploads share validation and write guards. Destructive methods ask by default; unanswered writes
  are never retried. Managed bot credentials require an explicit `--store-token <profile>` destination
  and stay only in the OS keyring; stdout contains a storage receipt.

## 0.24.0 — 03.10.2026

### Changed — may break scripts

- `--md` uses Telegram's own formatter for personal and bot send/edit/captions. Nested styles, underline, spoilers, links, code fences and quotes are supported. `__text__` means underline; a single `*text*` now means bold. MAX has different syntax. Invalid nesting and unsafe links are refused before writing.

## 0.23.0 — 03.10.2026

### Changed — may break scripts

- **Local message search defaults to a strict Lucene profile:** groups, typed fields/date ranges, `--timezone`, bounded wildcard/regex and coverage on empty results. Write prefixes explicitly as `word*`; use `--language legacy` for previous discovery behavior. The search guide and agent skill explain migration. JavaScript `--regex` runs in an isolated worker with size and time limits.

- **`tg upgrade --json` always includes `restarted`**, including checks and no-op updates.
  Previous fields remain; successful upgrades retain the managed-server restart policy. Scripts
  validating the exact key set should accept the empty array when no server restarted.

### What's new

- **`tg mcp` lets go of the search model after 10 minutes without a search**: an agent's
  `conversations_search` no longer keeps about 1 GB in memory for the whole session. The next search
  loads the model again, in about a second.
- **`tg <bot> bot me` and MCP `tg_bot_me`** show the bot profile's id, name and username.
  This read uses the bot token, refuses offline mode, and sends no message.

- Global npm installation installs the agent skill before login when its lifecycle hook is allowed.
  On Windows it saves the npm command folder to user PATH and keeps the `.cmd` launcher usable
  under restricted PowerShell policies. The one-call Windows installer also updates its current
  shell, installs skills when scripts are skipped and verifies bare `tg` without account access.

- **Setup is discoverable immediately after installation**: root help and first-run errors point
  to `tg setup`; setup and session help include examples, agent instructions and Windows advice.
  Quick-start, installation, MCP and security pages consistently explain the guided first run.
  `tg skill show` works before login and setup completion points agents to it.

- **`tg topics enable` enables forum topics, and `tg topics create` creates a named topic.** Basic groups require explicit `--upgrade --yes`; their chat id changes and the result returns the new address. CLI and MCP check rights and report a partial result if upgrade succeeds before enable fails. Topic creation uses `--send-id` as an attempt identity; its journal refuses reuse after a sent or unknown outcome. Never retry an unknown topic creation. Existing archive rows keep their original chat ids.

- **`tg messages send --topic` and `tg polls create --topic` send to a named forum topic.** Text, media captions, replies and scheduled messages preserve the topic; missing or closed topics and replies from another topic are refused before sending. MCP accepts the same address as `topic`.
- **`tg setup` guides the first run**: local checks, automatic or browser app registration, QR
  or phone login, a check of five chats and an optional agent skill. It reuses existing sessions,
  explains the five-minute wait and leaves history downloads as a separate choice. Windows
  instructions include `.cmd` wrappers and an npm exec fallback when PATH is missing.

- **`tg mcp setup codex|claude-code` and `tg mcp doctor`** add the local server to a client and
  check its handshake and tools. Setup requires `--allow-writes` when the profile offers writing
  tools; doctor does not check the Telegram login.
- **`tg <bot> bot store fetch <chat>` imports older channel and supergroup messages** into the bot's
  local copy, without sending or marking read. Use `--from <message link>` for a first run without
  a known message number; later runs continue backwards. Private chats and basic groups are refused.
  See [the bot page](docs/bot.md#fetching-older-messages).

### Fixed

- **A truncated `tg runs list --limit` suggests increasing `--limit`**, instead of the unsupported
  `--page` option. JSON still reports `hasMore`; reading recorded runs creates no new record.
- Early bot command failures use bot recording settings, and an unknown subcommand no longer
  blames a valid leading profile. The shared runner now applies these rules consistently.

- Login completion shortens Windows home paths correctly. Release documentation checks recognize
  Windows path separators. File-mode tests apply Unix permissions only on Unix; Windows access
  follows inherited ACLs, now stated in the security page.

## 0.22.0 — 03.10.2026

### What's new

- **`tg messages evidence <chat>` and `tg_messages_evidence` over MCP** prepare a bounded packet
  from the local archive for an agent’s chat brief, without connecting or marking read. Source
  locators, fingerprints, explicit coverage and an older-page cursor keep citations and paging
  precise. Whole messages fit within 64 KiB of JSON items; `--limit` accepts 1–100.

- **`tg <name> bot contacts show --refresh`** says the same as in `max`: its help no longer names the
  messenger (cli-messaging 0.109.0).
- **The bot page is complete** ([the bot guide](docs/bot.md)): how to find a chat's id, sending files and
  their limits, and the exit codes a script sees.
- **`tg <name> bot contacts show`, `bot messages search` and `bot messages between`** read what the bot
  kept on this computer. See [the bot page](docs/bot.md#what-the-bot-kept).
- **`tg <name> bot chats moderate` and `bot chats rules`**: a bot judges a group's new messages by its
  rules and acts as they allow. It judges what `bot watch` kept, since Telegram gives a bot no history.
  See [the bot page](docs/bot.md#moderating-a-group-by-its-rules).
- **`tg <name> bot mcp`: the bot for an agent**, over MCP. It offers the tools the bot profile's
  permissions allow; a deletion asks in a form first. See [the bot page](docs/bot.md#the-bot-for-an-agent-mcp).
- **`tg messages search` takes a query language**: `"a phrase"`, `-word`, `a OR b`, and the filters
  `from:`, `chat:`, `after:`/`before:` and `has:`. A typo is corrected, and stderr says so.
  `--context <n>` shows the messages around each hit (2 in the terminal). `in:max`, `in:all` or
  `--source` also search the other accounts kept in the same store, MAX ones included. See
  [the archive](docs/archive.md#search).
- **Search a group's conversations by meaning**: `tg conversations embed --chat <chat>` computes a
  vector for each conversation on this computer, and `tg conversations search "<question>"` finds the
  nearest ones, in one chat or every one you embedded. `tg models text list|download` fetches the model
  once into the folder the speech models share. With your own key, `--provider openai` (or
  `--base-url` for Ollama, LM Studio and the like) computes them instead, after telling you what goes
  out and what it may cost. See [topic search](docs/topic-search.md).
- **`tg store fetch` no longer runs for ever** when Telegram keeps answering with messages it already
  gave.
- **`tg bot watch`**: what happens in the bot's chats as it arrives, kept in the bot's history on this
  computer before it is printed; `--events` for edits, buttons and people joining and leaving.
  **`tg bot callbacks answer`**, **`tg bot commands list|set|clear`** and **`tg bot webhooks
  list|set|delete`**, the same commands `max bot` has. See [the bot page](docs/bot.md).
- **`tg bot chats admins list|add|remove`** and **`tg bot chats members remove [--block]`**: the bot's
  admins with their rights and title, making one with `--can` and `--title`, taking the rights back,
  and taking a person out of a chat, for good with `--block`. See [the bot page](docs/bot.md).
- **`tg bot messages send|list|show|edit|delete|pin|unpin`** and **`tg bot chats show|leave|action`**
  — the bot writes to a chat by id or title, or to a person as `user:<id>`, with `--md`, `--html`, a
  file or a photo. Telegram gives a bot no history, so `list` and `show` answer from what this bot
  sent and received on this computer. A delete asks first; `--allow-dangerous` answers.
- **Your own AI agent can link a group's conversations**, when you ask it to: `tg skill show
  link-conversations` is its guide. It says how much text it would read and waits for your yes, then
  answers the chat a batch at a time (`tg conversations batches next`, `tg conversations links add`);
  `tg conversations links clear` drops its answers. tg calls no model itself. See
  [the archive](docs/archive.md).
- **`tg mcp` serves this tool's guide as the resource `tg://skill`**, and names it in what it tells
  the agent on connecting, so an agent can read it without running `tg skill show`.

### Changed — may break scripts

- **`tg messages search` puts the best match first**, not the newest; `--newest` gives the old order.
  When no message has every word, it now takes any of them, then a piece of a word. The JSON keeps
  `items`, `limit` and `hasMore`, and adds `match` and `score` to each hit, plus `corrections`,
  `completeness` (per chat: held in full or not) and `wordsReady`. A query of one or two letters is
  searched instead of refused.
- **tg needs Node 22.16 or newer** (or Bun, as before). When a Linux Node uses a system SQLite too old
  for the message store, `tg` restarts itself on its own SQLite from `@wirecat/cli-messaging-sqlite`,
  before it reads or sends anything. Official Node and Bun builds notice nothing.

### Fixed

- **A refused bot write names a working config command** with `--bot` and the permission key
  (cli-messaging 0.111.0). The former hint placed `config` under `bot`, where it does not exist.

- **Commands that change only this computer no longer say they change Telegram.** `config set` and
  `unset`, `chats rules set` and `unset`, `recipients add`, `remove` and `clear`, and the bot's
  `auth set`, `auth remove` and `recipients add`, `remove` and `clear` write the config file, the
  group-rules file, the recipient lists or the keyring. The [command reference](docs/commands.md) now
  says "Changes something on this computer only." under them. They are still listed as writes in
  `tg commands`. `chats moderate` and `session end` still say they change Telegram.
- **`tg contacts show` lists the one-to-one chat with the person** among the chats you share, newest
  first. Before, it listed only the groups, because Telegram's list of common chats holds groups only.

## 0.21.0 — 01.10.2026

### What's new

- **`tg bot`** — a Telegram bot, through the official Bot API and its token: `bot auth set|show|remove`,
  `bot list [--check]`, `bot chats list`, `bot recipients list|add|remove|clear` and `bot sends list`,
  the same commands `max bot` has. Several bots, each under its own name; the token lives in the
  keyring as `bot:<name>`, or in `TG_BOT_TOKEN`. See [the bot page](docs/bot.md).
- **`tg conversations batches status|next --chat <chat> [--size <n>]`**: a group chat in batches for
  your own AI agent to link into conversations. `status` says how many messages and batches are left
  before you start; `next` prints the next batch. tg itself calls no model.
- **`tg skill install [--for claude|agents|all]`** writes tg's guide for AI agents where Claude Code
  and other agents look for it. When an agent runs tg and no copy is installed, tg says so once a day
  on stderr; `tg config set skillHint false --defaults` turns that off.
- **`tg store clear --left`** deletes the chats you have left from the local store, with their
  messages. It asks for `--allow-dangerous` and otherwise says how much it would delete.
- **`tg conversations build|list|show`** and **`tg messages links`**, with the MCP tools
  `tg_conversations_list` and `tg_conversations_show`: the conversations inside a group, found in the
  stored messages by replies, mentions and who wrote next — no Telegram request, no AI. Nothing is built
  until you run `build`. See [the store](docs/archive.md#conversations-in-a-group).
- **A mention by name is kept**: when someone is mentioned by name rather than by @username, the stored
  message remembers whom, so conversations follow it.
- **`tg chats rules show|set|unset` and `tg chats moderate`**, with the MCP tools
  `tg_chats_rules_show` and `tg_chats_moderate`: a group's rules say what to look for — links, invite
  links, forwards, floods, blocked people — and how far a run may go: deny, report only, ask (the
  default), or act. Nothing runs in the background. See [groups](docs/groups.md#rules).
- **`tg messages list --before-time`** reads back from a moment: ISO 8601, or `2h` / `1d` ago.
- **`tg contacts add|remove|block|unblock|rename|import`** and **`tg account update`**,
  **`tg account sessions end --others`**, with the MCP tools `tg_contacts_add|remove|block|unblock|rename`
  and `tg_account_update`. `contacts import` reads `number, name` lines from a file and prints only
  counts and who Telegram knew. Ending other sessions logs your phone out too: it asks first, and no
  agent is ever offered it.
- **`tg chats folders list|create|update|delete`**, with the MCP tools
  `tg_chats_folders_list|create|update|delete`. Changing a folder's chats keeps the others in it;
  "All chats" is not listed, since nobody can change it.
- **`tg chats members add|remove`** and **`tg chats admins add|remove`**, with the MCP tools
  `tg_chats_members_add|remove` and `tg_chats_admins_add|remove`. `--can` takes members, admins,
  info, pin, link, post, edit and delete; Telegram has no separate right to read. Adding answers who
  could not be added; each person added counts toward the hourly limit.
- **`tg chats update <chat>`** — `--title`, `--description`, `--all-can-pin on|off`,
  `--only-admins-add on|off` — and **`tg chats link show|reset`**, with the MCP tools
  `tg_chats_update`, `tg_chats_link_show`, `tg_chats_link_reset`. `tg chats show` adds a group's
  description, invite link and settings.
- **`tg chats create <title> [person...]`, `tg chats join <link>`, `tg chats leave <chat>`**, and
  the MCP tools `tg_chats_create`, `tg_chats_join`, `tg_chats_leave`. A new group is always a
  supergroup (`--channel` makes a channel); people who cannot be added are listed in the answer.
  See [usage](docs/usage.md#groups-and-channels).
- **Permissions: one level per command, for you and for an AI agent alike.** A profile's
  `permissions` setting gives each command path a level: `deny` (not even reading), `readonly`, `ask`
  or `allow`; the most specific key wins — `tg config set permissions.messages.delete allow`. By
  default everything is allowed except deleting messages and ending other sessions, which ask. `ask`
  asks y/N in the terminal; `--allow-dangerous` (deleting) or the new `--yes` (any other write) says
  yes in a script. `readOnly` and `allow` still work. See [security](docs/security.md).
- **`tg messages send --voice <file>`** sends an Ogg Opus file as a voice message, and a `.mp4` or
  `.mov` given with `--file` now plays in the chat as a video; `--as-file` keeps it a file to download.
- **`tg messages list --mark-read`** marks the chat read up to the newest message shown. Nothing else
  that reads marks anything read.
- **`--model` beside `--transcribe`** on `tg messages list` and `tg inbox`, and **`tg review
  --transcribe`**: voice messages in a review come with their text.
- **`tg store fetch --last <n>`** stops once the newest n messages of the chat are held, so a later
  run with the same `--last` asks Telegram for one page and stops.
- **`tg polls create --revote`** lets people change their vote.
- **`tg store export --output <file> --since-time <time>`.** The export goes into a new file only you can
  read, never over one, and can start from a time.
- **`tg account show` prints the phone's last four digits**, and the whole number with
  `--show-phone`. The MCP tool `tg_account_show` always prints only the last four.
- **`tg messages forward --send-id`.** A forward that got no answer is repeated with the send id from
  the error, and Telegram keeps one copy, as with a send. The `--json` answer carries `sendId`; MCP's
  `tg_messages_forward` takes `send_id`.
- **`tg messages edit --md`** formats the new text as `messages send --md` does; MCP's
  `tg_messages_edit` takes `markdown`.
- **Looking after the message store: `tg store info`, `check`, `migrate`, `backup`, `restore`.**
  `info` says where `messages.db` is, its size, its schema and how many rows it holds. `check`
  reports whether it is healthy — integrity, foreign keys, the search indexes, free disk — and names
  every chat whose stored history stops before the chat's newest message; it repairs nothing.
  `migrate` brings the file up to this version and normalizes the messages stored before it.
  `backup <file>` copies the store while it is in use, readable by you alone, never over a file.
  `restore <file>` puts a backup in place and keeps the store it replaces beside it; it refuses while
  `tg serve` runs or any process has the store open. The same file serves max-cli, so restart any
  running `serve` or `mcp` of either CLI afterwards.
- **Every write has its own id, `operationId`.** A send, edit, forward, deletion, pin, reaction,
  mark-read and poll vote prints it in its `--json` answer and MCP result, and the send journal and
  `--trace` name it, so one write can be followed from the answer to the log. A send's
  `operationId` is its `sendId`.
- **About 16 MB less to install**: cli-messaging 0.60.0 bundles its database layer instead of
  depending on it.

### Changed — may break scripts

- **`tg server status --json` answers the fields both tools share**: `since` is `startedAt`,
  `listening` is `connected`, `listeningSince` is `connectedAt`; new are `cliVersion`, `log`, and
  `stale` when a `serve` that is gone left its lock behind. `tg server start` answers `startedAt`
  and `connectedAt` the same way, and `tg server stop` says who had started it (`by`). The lines say
  "connected" where they said "listening".
- **`tg messages send --at` is now `--at-time`**, as every option that takes a time names it.
- **The MCP tools' arguments carry their option's name**: `tg_messages_list` takes `before_id`,
  `before_time`, `after_id`, `after_time`; `tg_messages_context` `before_n`, `after_n`; `since` is
  `since_time` in `tg_inbox`, `tg_review` and `tg_chats_events`, whose `event` is `type`;
  `tg_messages_send` takes `md` and `at_time`.
- **Options name the kind of value they take.** The old names are refused as unknown options; there
  are no aliases. The MCP tools' arguments do not change.
  - `tg messages list --before` is now `--before-id`; `--after` is `--after-id` for a message id and
    `--after-time` for a time, so an id is never read as a time.
  - `tg messages context --before` and `--after` are now `--before-n` and `--after-n`.
  - `--since` is now `--since-time` in `tg inbox`, `tg review`, `tg chats events` and
    `tg store fetch`.
  - `tg messages download --output` is now `--output-dir`.
  - `tg chats events --event` is now `--type`.
- **`tg review --unanswered` takes a duration** — `4h`, `1d` — not bare hours; `--unanswered 4` is
  refused. Without a value it is 24 hours, as before. MCP's `tg_review` still takes hours.
- **`tg chats events --json` prints `{ items, page, limit, hasMore, chatId, since }`**: `events` moved
  to `items` and `more` to `hasMore`. **`tg server logs --json`** moved `lines` to `items`. `--jsonl`
  is unchanged.
- **A `.mp4` or `.mov` sent with `--file` plays in the chat as a video**; it arrived as a file
  before. Add `--as-file` to keep it a file to download.
- **`tg mcp` offers tools by the profile's permissions, not by flags.** With the default settings an
  agent can now send, edit, forward, react, vote and mark read without `--allow-send`, and without a
  form; deleting shows you a form first (`tg mcp --allow-dangerous` skips it). To keep an agent
  read-only, give it a profile with `readOnly` — [mcp](docs/mcp.md) shows how. `--allow-send`, `--allow-mark-read` and `--allow-delete` decide nothing
  now and print a warning; `--confirm-send` still shows every write in a form.
- **`tg messages delete` asks** in the terminal when `--allow-dangerous` is missing, instead of
  refusing; with no terminal it is refused as before.
- **`tg store fetch --max <n>` is gone; `--limit <n>` caps a run instead**, in messages (1000 by
  default, as before), and `--page-size <n>` sets how many one request asks for (100 by default). The
  same names as max-cli's. `--max` is not kept as an alias.
- **A poll made without `--revote` no longer lets people change their vote**, as in max-cli; Telegram
  allowed it by default. Add `--revote` to keep the old behaviour.
- **`tg polls vote` and `tg polls close --json` print `{ operationId, poll }`** instead of the poll
  alone; read the poll from `.poll`. The MCP tools `tg_polls_vote` and `tg_polls_close` answer the same.
- **`tg runs list`, `tg sends list` and `tg recipients list --json` print `{ items, page, limit, hasMore }`**
  instead of a bare array, as every other list does; read the rows from `.items`. `--jsonl` is unchanged.

### Fixed

- **`tg chats list` no longer lists a pinned chat twice.** With archived chats included, Telegram's
  pages brought the pinned chats again further down; on one account 8 of 1361 chats appeared twice.
  A pinned chat's title also matched itself as two chats, so typing it could be refused as
  ambiguous.

- **`tg server stop` and Ctrl-C end `serve` and `watch` cleanly.** The serve went down before it could
  clean up, so `tg server status` reported a leftover lock (`stale`) after every stop.
- **`tg server` in a development checkout leaves the installed tg's systemd unit alone.** A checkout
  with its own `TG_STATE_DIR` or store gets a unit of its own name; the installed tg keeps
  `tg-serve-<profile>.service`.
- **A chat you have left no longer shows in `chats list --offline`.** It drops out the next time
  `tg chats list` reads your whole chat list; its messages stay until `tg store clear --left`, and a
  chat you rejoin comes back.

- **Two refusals say what to do.** Adding back someone who left or was removed, when you are not
  each other's contacts, now says to send them the invite link (`tg chats link show <chat>`);
  naming a person by an id this account has never seen now says to use an @username, or to read a
  chat they are in first.

- **An argument Telegram's library refused no longer repeats what you typed.** The error said the
  library's own words, which could quote a chat's title or a link. It now says what kind of input
  was wrong where tg can tell — a chat you have not joined, a message or invite link, a phone
  number, a login code or password — and otherwise that Telegram refused an argument.
- **A conversation reads in English.** Your own messages are `you`, and day headings read
  `26 September 2026`; they were Russian.
- **A chat or message tg cannot find is `not_found`**, and a chat of the wrong kind for the command
  is `validation_error`. They were an unknown failure with exit code 1 and the library's own words,
  which could repeat a chat's title.
- **The "not logged in" error names your profile**: `tg <profile> session start`, as the other login
  hints already did.
- **Downloads and exports get your usual file permissions again.** Since the first release, opening a
  session made every file tg wrote afterwards readable only by you. The session file and its
  companions stay owner-only.

## 0.20.0 — 30.09.2026

### What's new

- **A message's sender keeps their @username in the local store**, so `--from @name` and the coming
  conversation view can match a mention to the person. Takes effect with cli-messaging 0.57.0 or later;
  history already downloaded gains it the next time it is fetched.
- **`tg store fetch <chat> --since <time>`** stops once it reaches messages older than the time:
  `2026-09-01`, or `2h` / `1d` ago.

### Changed — may break scripts

Commands follow one naming standard: a noun, then a verb. The old names are gone, with no aliases —
a script that uses one now fails with "unknown command" or "unknown option".

- **`tg export <chat>` is `tg store export <chat>`**, **`tg sync status [chat]` is
  `tg store status [chat]`**, **`tg backfill <chat>` is `tg store fetch <chat>`**, and
  **`tg backfill list|status|cancel` is `tg store jobs list|show|cancel`**. `store fetch` fetches by
  default; `--estimate` only estimates. `--pace` is **`--pause`** there and in
  `tg messages download --all`. `--max` keeps its name: it counts messages.
- **`tg messages reply` is gone**: `tg messages send <chat> [text] --reply-to <id>` answers a message,
  and every send option (`--file`, `--photo`, `--silent`, `--at`, …) now works with it. The
  `msg:telegram/…` form has no replacement; give the chat and the message id.
- **`tg chats read` is `tg chats mark-read`**; the MCP tool `tg_chats_read` is `tg_chats_mark_read`.
- **`tg recipients off` is `tg recipients clear`.**
- **`tg update [--check]` is `tg upgrade [--check]`**, and the daily line about a newer version names
  `tg upgrade`.
- **`tg messages search <words…>` names its argument `<text…>`**; the search is unchanged.

## 0.19.0 — 30.09.2026

### Fixed

- **tg always exits once a command has finished.** Once, a download printed its answer and then stayed
  running for half an hour, `--timeout` or not. If anything is still open five seconds after a command
  is done, tg now names it on stderr and exits with the command's own exit code. Output still being
  written is waited for.

## 0.18.0 — 30.09.2026

### Fixed

- **A supergroup or channel first seen through one of its messages no longer loses messages to a deletion
  in a private chat** (cli-messaging 0.54.0). 0.16.0 left such a chat exposed because the store did not know
  its kind yet; its `-100…` id now says enough.
- **Messages a deletion elsewhere marked deleted by mistake come back** the next time their chat is read
  (`messages list`, `messages context`, or an edit arriving live). A deletion newer than the read stays.

## 0.17.0 — 30.09.2026

### What's new

- **`tg messages download <chat> --all`** saves every file of a chat — photos, documents, videos,
  voice notes — into `--output`, newest first. Cut short by `--timeout` or Ctrl-C, it continues where
  it stopped the next time, and picks up newer messages too; where it got to is kept in a
  `.download-<chat>.json` beside the files. Telegram's "wait N seconds" is sat out up to five minutes,
  and `--pace` (1 s) spaces the pages. A file name another message already took gets the message id in
  front; nothing is overwritten. (cli-messaging 0.53.0)

## 0.16.0 — 30.09.2026

### Fixed

- **A message deleted in a private chat or a basic group no longer marks other chats' messages deleted**
  (cli-messaging 0.52.0). Telegram reports such a deletion without the chat, and the local store marked
  every stored message with that number deleted — channel and supergroup messages included. Messages
  already marked that way stay marked; their text is kept.

## 0.15.0 — 30.09.2026

### Fixed

- **A speech model on this machine no longer drops quietly spoken words.** A quiet stretch in the
  middle of a voice message was taken for silence and left out of the text; now it is heard, by
  Parakeet and GigaAM alike. Voice messages a local model heard before are heard again the next time
  `--transcribe` asks for them; Telegram's transcripts stay. (cli-messaging 0.51.0)

## 0.14.0 — 30.09.2026

### What's new

Changing messages other people see — each through the send guard, as `messages send` is: a
read-only profile refuses, `allow` must name the permission, the recipient list and the hourly limit
apply where they count, and `tg sends list` records it without the text.

- **`tg messages edit <chat> <id> [text]`**: the new text of your own message. Repeating the same edit
  changes nothing. `tg_messages_edit` with `mcp --allow-send`.
- **`tg messages forward <chat> <id> --to <chat> [--silent]`**, checked against the chat it goes to.
  After an unknown outcome, look in that chat before forwarding again. `tg_messages_forward`.
- **`tg messages pin|unpin <chat> <id>`**, quiet unless `--notify`; in a one-to-one chat the pin is on
  your side only. `tg_messages_pin` and `tg_messages_unpin`.
- **`tg reactions add <chat> <id> <emoji>`** and **`tg reactions remove <chat> <id>`**; a reaction
  never counts toward the hourly limit. `tg_reactions_add` and `tg_reactions_remove`.
- **`tg chats read <chat> [--until id]`** marks a chat read — the other side sees it. Its tool,
  `tg_chats_read`, comes only with the new **`tg mcp --allow-mark-read`**, which `--allow-send` does not
  turn on.
- **`tg messages delete <chat> <id…> --allow-dangerous [--for-everyone]`**: at most 10, for you only
  unless `--for-everyone`, and nothing without `--allow-dangerous`. In a supergroup or a channel
  Telegram has no "for me only", so there it needs `--for-everyone`. The new **`tg mcp --allow-delete`**
  offers `tg_messages_delete`, which only ever deletes your own copy.
- **`tg polls show|vote|close|create`**: a poll with its answer ids, a vote by those ids (never by
  position) or `--retract`, closing your own poll, and a new one — public unless `--anonymous`, with
  `--send-id` for a safe retry. `tg_polls_show` reads; `tg_polls_vote`, `_close` and `_create` come with
  `--allow-send`.

## 0.13.0 — 30.09.2026

### Changed — may break scripts

- **The shared message store moves to version 6** (cli-messaging 0.49.0). The first `tg` run upgrades
  `messages.db`; a `max` older than the one released the same day then refuses it and asks to be
  upgraded — `npm install -g @wirecat/max-cli@latest`. Nothing in `tg`'s own commands changes.

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
