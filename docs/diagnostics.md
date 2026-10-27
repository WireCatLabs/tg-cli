# Diagnostics: what a command did

Use this page when a command fails, hangs or takes too long, and you want to see why. By the end you
can watch a command's requests as they happen, keep a record of a run, check your installation and
send a problem report that holds no message text.

A few words this page uses:

- A **run** is one call of `tg`, from start to exit.
- A **run record** is a folder that keeps what one run did: its command line, its outcome and one line
  per request to Telegram. Those lines never hold message text, names or titles. What it keeps of the
  command line you typed is under [What you typed](#what-you-typed).
- **`tg personal doctor`** checks the installation: the version, the login, the settings and the local store.
- A **problem report** is one JSON file made from `tg personal doctor` and a failed run. You attach it to an
  issue.

## What you can do

| Task | Command | Keeps anything? |
|---|---|---|
| See each request as it happens | `tg personal --trace …` | no, prints to stderr only |
| Find a run later | `tg personal runs list` | every run is kept by itself |
| Keep one run out | `tg personal --no-record …` | nothing |
| Keep only failed runs | `tg personal config set record false` | failed runs |
| Check the installation | `tg personal doctor`, `tg personal doctor --online` | no |
| Make a problem report | `tg personal doctor reports create` | yes, one file you send |

## Show it: `--trace`

```sh
tg personal --trace messages list "Book club" --limit 5
```

`--trace` prints each operation on stderr as it happens: `→` what was asked, `←` what came back,
with ids, counts, duration and an error code if there was one.

```text
→ messages.list    chat -1001234567890
← messages.list    chat -1001234567890  118ms  5 messages
```

It also passes on the log lines of the Telegram library underneath. stdout does not change, so a pipe
still gets only data.

## Keep it: `--record`

Every run is kept by itself. `--record` matters only for a command that runs until you stop it (`watch`, `serve`,
`mcp serve`) and for a command WireCat Desktop runs for itself: they keep a run that worked only with `--record`.

```sh
tg personal runs list        # recorded runs, newest first
tg personal runs show <run-id>  # one run: its outcome, and one line per request
tg personal runs path <run-id>  # the folder that holds it
```

`runs show` lists each request to Telegram: its method (`messages.getHistory`, or the Bot API's `sendMessage`), how
long it took and how it ended. When Telegram asks to wait (`FLOOD_WAIT`, or a Bot API `429`) and `tg` waits and tries
again, the refused request is followed by the retry as attempt 2, with the time waited. A run keeps at most 2,000 lines or 1 MB of them, then
counts the rest.

A run record is a folder under `runs/<day>/` in the state folder (`~/.local/share/tg-cli/runs/` on
Linux). Its name is the time and the command. It holds two files:

- `run.json` — the command, the profile, the version of `tg`, Node and the system, when it started
  and ended, how many requests it made, the outcome and the error code;
- `events.jsonl` — the same operations `--trace` shows, and each request under them, one per line.

A run that worked and logged no requests leaves no folder: it is one line in the day's index, and `runs show` still
finds it.

## A failed run is always kept

When a command ends in an error, its run is kept, even with `record` set to `false`; `run.json` then has
`"kept_because_failed": true`. This is true for every command and every error: a bad option, an
unknown command, a check before any work, and commands that never connect (`models`, `server`,
`upgrade`). A failure before the command started, such as a config file that does not load, is kept
as a run named `tg`. What the record keeps of the command line is under [What you typed](#what-you-typed);
a run whose settings did not load hides every typed value that may be text.

So a problem report always has a failure to attach. Only `--no-record` keeps a failed run out.

Successful searches and statistics queries keep their own history, apart from run records. It has its
own controls: see [saved searches and history](search.md#saved-searches-and-history).

## When to keep only failed runs

```sh
tg personal config set record false         # profile "personal": failed runs only
tg personal --no-record chats list          # this run: nothing at all
```

A run that worked holds the ids of the chats you read and, with `record_input` on, what you typed (a message you
sent, a chat named by its title). It is kept only on this computer, readable only by you, for 7 days. Set `record`
to `false` if you would rather not keep it at all.

## How long it lives

A run that worked lives **7 days** (`keep_successful_runs_for_days`), a failed one **30 days** (`keep_runs_for_days`).
The runs folder also stays under **200 MB** (`runs_size_limit_mb`): past it, the oldest runs that worked go first.
Old runs are removed only when a new one is kept, checked once a day, a whole day at a time, by the folder's name,
so nothing has to be opened to decide.

## What is never in a record

A run's events and `--trace` carry an operation's name, ids, counts, durations and error codes. They
never carry:

- the text of a message, or a caption;
- a chat title, a person's name or a username;
- a phone number, a login code, a 2FA password, the session or the app hash.

### What you typed

`run.json` also keeps the command line. What it keeps depends on your version of `tg`:

- **A version that lists `record_input` in `tg personal config show`** keeps the command line as you
  typed it — a chat's title, a search, message text — so you can read back what you ran. A secret is
  always `[redacted]`: the value of an option named for a token, password, passphrase, secret,
  credential, cookie, authorization or API key; a value `tg` marks secret, such as `bot api --body`; a
  password inside a URL; a long string that looks like a token. To hide every typed value that may be
  text again:

  ```sh
  tg personal config set record_input false     # everywhere
  tg personal config set record_input failed    # kept only in a run that failed
  ```

- **An older version** keeps the command's words and option names, such as `messages list --limit`.
  Every value that may be text, such as what you typed as `<chat>`, is `[redacted]`.

A problem report made from a run hides those typed values in every version.

## Check the installation: `tg personal doctor`

```sh
tg personal doctor     # connects to nothing
tg personal doctor --online  # also connects once and reads the account; sends nothing to Telegram
```

It shows the version, the runtime, the profile, the config file, whether a session and the app
credentials exist (never their values), whether `TG_*_DIR` moved the keyring entry, the local store
(its path, its version, and how many chats and messages it holds), the sends of the last hour, and
the runs kept.

- **`config.issues`** lists every problem in the config file: invalid JSON (with the line and
  column where reading stopped), a setting or a permission key `tg` does not know, a value of the wrong
  type. Each problem says what the value has to be, never the value itself. All but invalid JSON
  come with the `config unset` command that removes them (`fix`). `doctor` still answers, with exit code `0`.
- **`login`** is `not checked` without `--online`. A session file on disk does not mean Telegram
  still accepts it. With `--online` it is `ok` or `failed`, with a hint.
- **`files`** and **`telegram.session.files`** name each private file or folder that other users of
  this machine can read: the config file (it wants `0600`) and its folder (`0700`), the session, the
  store, their SQLite `-wal` and `-shm` files, the send journal and the runs folder. Each problem is
  `{ path, mode, want }`, and stderr prints the `chmod` that fixes it: `to make it private: chmod 600
  '<path>'`. With no profile named, or when the settings are refused, `files` checks the config file and
  its folder only. `doctor` never changes a file mode itself. Windows is not checked.
- **`online.clock`** (with `--online`) compares this computer's clock with Telegram's.
  `skew_ms` is positive when this computer is ahead. It warns (`ok: false`) at 10 seconds. Telegram
  refuses a request stamped more than 30 seconds ahead of its own clock.
- **`online.standing`** (with `--online`) is `active`, `frozen`, `banned`, `deactivated` or
  `revoked`, or `unknown` when Telegram's answer could not tell. A frozen account can read but not
  write. Where Telegram gives them, it comes with the date the account was frozen, the date Telegram
  will delete it, and the appeal link. Logging in again does not reopen an account Telegram closed.
- **`flood`** lists the waits Telegram asked this profile to keep (`deadlines`) and a hold on its
  sends (`send_block`). `doctor` only reads, with one exception: **`doctor --online` writes the frozen
  hold.** When it reads the account as frozen, it holds sends until Telegram's date. When it reads it
  as active, it lifts that hold. It never lifts a hold for a spam limit — `tg personal flood clear` does that.

## A problem report

```sh
tg personal doctor reports create          # about the newest failed run
tg personal doctor reports create --run <run-id>  # about this one
```

It writes a JSON file — what `tg personal doctor` shows plus the run — and says where to send it: a new issue
at [github.com/WireCatLabs/tg-cli/issues](https://github.com/WireCatLabs/tg-cli/issues/new). Read it before
you send it. It holds no message text, and every id appears as a label, not as Telegram's number.
[How to report a problem](troubleshooting.md#report-a-problem) lists everything the file holds.

If no failed run is kept, run the failing command again; its failure is kept by itself.

## What to do with runs

The records are JSON, so `jq` answers questions about them. `tg personal runs list --json` answers
`{ items, page: { limit, has_more }, meta }`, and `items` are the runs' `run.json`, newest first:

```sh
tg personal runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, error_code}]'
tg personal runs list --limit 100 --json | jq '[.items[] | .duration_ms] | add / length'  # average duration
tg personal runs list --limit 100 --json | jq '[.items[] | select(.requests > 10) | {command, requests}]'
```

`tg personal runs show <run-id>` prints the same events as a table, without the fields every line repeats.
The whole file is in the folder `tg personal runs path <run-id>` prints.

## Next

- [What an error means and what to do](troubleshooting.md)
- [What reaches the disk at all](security.md)

## Search errors and partial runs

```sh
tg personal search runs error_code:rate_limited --json
tg personal search runs status:partial 'started_at>=2026-10-01' --json
```

`search runs` matches literal diagnostic text in metadata and safe events. Narrow it with the terms `status:`,
`error_code:`, `operation:`, `profile:` and `started_at:` comparisons/ranges, with `--limit` and `--page`. Each page allows up to 100 runs and
each run returns at most 100 matched events, with `events_truncated` for additional events.
A failed batch item or history page creates `status: "partial"` with failed IDs, stages and
codes; message contents and provider error payloads are not copied into that record. Partial
records are kept by default unless recording was explicitly disabled. Search does not record itself.

MCP `tg_read` with `command: "search runs"` accepts these `arguments`: `query` (including time predicates), `limit` and `page`.
It reads only the active profile's diagnostic runs, does not connect to Telegram and does not open
raw background-job logs. The original partial result contains recovery actions; diagnostic records
keep only safe identifiers and codes.
