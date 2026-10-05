# Diagnostics: what a command did

When a command fails or takes too long, `tg` can show what it did, keep a record of it, and turn the
record into a report you can attach to an issue. None of it holds message text.

## Show it: `--trace`

```sh
tg --trace messages list "Book club" --limit 5
```

`--trace` prints each operation on stderr as it happens: `→` what was asked, `←` what came back,
with ids, counts, duration and an error code if there was one.

```text
→ messages.list    chat -1001234567890
← messages.list    chat -1001234567890  118ms  5 messages
```

It also passes on the log lines of the Telegram library underneath. stdout is unchanged, so a pipe
still gets only data.

## Keep it: `--record`

```sh
tg --record chats list
tg runs list                 # recorded runs, newest first
tg runs show <run-id>        # one run: its outcome, and one line per operation
tg runs path <run-id>        # the directory that holds it
```

A run is a directory under `runs/<day>/` in the state directory (`~/.local/share/tg-cli/runs/` on
Linux), named by its time and its command, with two files:

- `run.json` — the command, the profile, the version of `tg`, Node and the system, when it started
  and ended, how many requests it made, the outcome and the error code;
- `events.jsonl` — the same operations `--trace` shows, one per line.

## A failed run is always kept

When a command ends in an error, its run is kept even without `--record`, marked
`"keptBecauseFailed": true` in `run.json`. That holds for every command and every error: a bad
option, an unknown command, a check before any work, commands that never connect (`models`,
`server`, `upgrade`). A failure before the command even started, such as a config file that does not
load, is kept as a run named `tg`. The record holds only the command's words, such as
`messages list`, never what followed them.

A successful run leaves no diagnostic record unless requested; successful search/statistics queries have separate history. So a problem report always has a failure to
attach, while query history has its own controls. `--no-record`, or `"record": false` in the
settings, turns this off too.

## When to record every run

```sh
tg config set record true          # this profile
tg --no-record chats list          # but not this one
```

Then every run is kept. The default is the other way round on purpose: a run that worked is not
written until you ask. A messenger that keeps a folder of whom you read and when would be a diary
of your life nobody asked for.

## How long it lives

**30 days**, or `keepRunsForDays` in the settings. Old runs are removed only when a new one is kept:
a tool that writes nothing has no reason to walk the folder. They are removed a whole day at a time,
by the folder's name, so nothing has to be opened to decide.

## What is never in a record

A recorded run and `--trace` carry an operation's name, ids, counts, durations and error codes. They
never carry:

- the text of a message, or a caption;
- a chat title, a person's name or a username;
- **what you typed as `<chat>`**, because a typed chat is often a title;
- a phone number, a login code, a 2FA password, the session or the app hash.

The same goes for a report made from a run.

## Check the installation: `tg doctor`

```sh
tg doctor              # connects to nothing
tg doctor --online     # also connects once and reads the account; sends nothing to Telegram
```

It shows the version, the runtime, the profile, the config file, whether a session and the app
credentials exist (never their values), whether `TG_*_DIR` moved the keyring entry, the local store
(its path, its version, and how many chats and messages it holds), the sends of the last hour, and
the runs kept.

- **`login`** is `not checked` without `--online`. A session file on disk does not mean Telegram
  still accepts it. With `--online` it is `ok` or `failed`, with a hint.
- **`files`** and **`telegram.session.files`** name each private file or folder that other users of
  this machine can read: the session, the store, their SQLite `-wal` and `-shm` files, the send
  journal and the runs folder. Each has the `chmod` command that fixes it. `doctor` never changes a
  mode itself. Windows is not checked.
- **`online.clock`** (with `--online`) compares this computer's clock with Telegram's.
  `skewMs` is positive when this computer is ahead. It warns (`ok: false`) at 10 seconds. Telegram
  refuses a request stamped more than 30 seconds ahead of its own clock.
- **`online.standing`** (with `--online`) is `active`, `frozen`, `banned`, `deactivated` or
  `revoked`, or `unknown` when Telegram's answer could not tell. A frozen account can read but not write. It comes with the date it was frozen, the date
  Telegram will delete it, and the appeal link, where Telegram gives them. Logging in again does not
  reopen an account Telegram closed.
- **`flood`** lists the waits Telegram asked this profile to keep (`deadlines`) and a hold on its
  sends (`sendBlock`). `doctor` reads only, with one
  exception: **`doctor --online` writes the frozen hold.** When it reads the account frozen, it holds
  sends until Telegram's date; when it reads it active, it lifts that hold. It never lifts a hold for
  a spam limit — `tg flood clear` does that.

## A problem report

```sh
tg doctor report create                   # about the newest failed run
tg doctor report create --run <run-id>    # about this one
```

It writes a JSON file — what `tg doctor` shows plus the run — and says where to send it: a new issue
at [github.com/leemour/tg-cli/issues](https://github.com/leemour/tg-cli/issues/new). Read it before
you send it. It holds no message text, and every id appears as a label, not as Telegram's number.

If no failed run is kept, run the failing command again; its failure is kept by itself.

## What to do with runs

The records are JSON, so `jq` answers questions about them. `tg runs list --json` answers
`{ items, page, limit, hasMore }`, and `items` are the runs' `run.json`, newest first:

```sh
tg runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, errorCode}]'
tg runs list --limit 100 --json | jq '[.items[] | .durationMs] | add / length'    # average duration
tg runs list --limit 100 --json | jq '[.items[] | select(.requests > 10) | {command, requests}]'
```

`tg runs show <run-id>` prints the same events as a table, without the fields every line repeats.
The whole file is in the folder `tg runs path <run-id>` prints.

## Next

- [troubleshooting.md](troubleshooting.md) — what an error means and what to do
- [security.md](security.md) — what reaches the disk at all

## Command discovery for scripts

`tg commands --json` lists commands, global options and exit codes without connecting to an
account. `cli` names the tool, `version` is the installed package version, and `contract` is the
shared JSON contract version (`0`). It changes for incompatible response field changes; a package
upgrade alone does not change `contract`. Scripts can read individual fields instead of comparing
the whole JSON output with a saved string.

Search/statistics query history is separate from run records; see [query history and --no-record](search.md).
