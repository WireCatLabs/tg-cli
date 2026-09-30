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

A run is a directory under `runs/` in the state directory (`~/.local/share/tg-cli/runs/` on Linux),
one per day, with two files:

- `run.json` — the command, the profile, the version of `tg`, Node and the system, when it started
  and ended, how many requests it made, the outcome and the error code;
- `events.jsonl` — the same operations `--trace` shows, one per line.

To record every run of a profile: `tg config set record true`.

**A failed run is always kept**, recorded or not, so the failure can still be looked at afterwards.
`--no-record` turns that off for one command. A failure before the command even started, such as a
bad option or a config file that does not load, is kept too, as a run named `tg`.

Runs older than `keepRunsForDays` (30 by default) are removed when the next one is kept.

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
tg doctor --online     # also connects once and reads the account; sends nothing
```

It shows the version, the runtime, the profile, the config file, whether a session and the app
credentials exist (never their values), whether `TG_*_DIR` moved the keyring entry, the local store
(its path, its version, and how many chats and messages it holds), the sends of the last hour, and
the runs kept.

## A problem report

```sh
tg doctor report create                   # about the newest failed run
tg doctor report create --run <run-id>    # about this one
```

It writes a JSON file — what `tg doctor` shows plus the run — and says where to send it: a new issue
at [github.com/leemour/tg-cli/issues](https://github.com/leemour/tg-cli/issues/new). Read it before
you send it. It holds no message text, and ids appear as labels, not as Telegram's numbers.

If no failed run is kept, run the failing command again; its failure is kept by itself.

## What to do with runs

The records are JSON, so `jq` answers questions about them:

```sh
tg runs list --limit 100 --json | jq '[.[] | select(.status == "failed") | {command, errorCode}]'
tg runs list --limit 100 --json | jq '[.[] | .durationMs] | add / length'    # average duration
```

## Next

- [troubleshooting.md](troubleshooting.md) — what an error means and what to do
- [security.md](security.md) — what reaches the disk at all
