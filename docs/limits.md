# Limits, waits and background jobs

Telegram limits how fast one account may ask it for things. Ask too fast and it answers "wait N
seconds" (FLOOD_WAIT); keep asking during the wait and the waits grow. Write to too many strangers and
it limits the account as spam. `tg` keeps every profile under a pace, waits out what Telegram asks for
when the wait is short, and stops when it is long. This page is all of it in one place.

## The pace: one allowance per profile

Every request `tg` makes for a profile — from a command, `tg mcp`, `tg serve` or a background job —
takes a turn in one pace for that profile:

- a burst of **20 requests** goes at once, so ordinary commands never wait;
- after the burst, **one request a second** (60 a minute), until the allowance refills while idle.

**Two commands at once share the same pace.** The turns are kept in a file under the state folder
(`pace/<profile>.json`), so two terminals, several `store fetch --background` jobs and `serve` line up
behind each other instead of each going at full speed. Running five fetches in parallel is no faster
than running them one after another, and it is no riskier either. Different profiles — different
Telegram accounts — have their own pace each.

A command that has to wait more than 5 seconds for its turn says so on stderr:

```text
waiting 12 s to keep this profile's pace with Telegram
```

Change the pace in the config file, or for one shell with an environment variable:

```json
{ "defaults": { "requestsPerMinute": 30 } }
```

```sh
TG_REQUESTS_PER_MINUTE=30 tg store fetch "Book club"
```

`0` turns the pace off. Do that only for a profile you can afford to have limited.

## When Telegram asks to wait

| How long Telegram asks | What `tg` does |
|---|---|
| up to 10 s, in a one-shot command | waits, at most twice, and says so on stderr |
| up to 2 min, in `serve` and `watch` | waits, at most three times |
| longer | stops with exit code `8` (`rate_limited`) and `retryAfterMs` in the JSON |

`store fetch` and `messages download --all` wait out a wait of up to 5 minutes between pages and go on;
a longer one stops the run, and the next run resumes from what was already saved.

**A wait holds the whole profile.** Until it ends, every process's next request waits past it, and one
that would have to wait more than 5 minutes fails at once with exit code `8` without asking Telegram.
`tg doctor` and `tg server status` list what is held under `flood`. Once the wait is over, nothing needs
to be done; `tg flood clear` lifts it early if you know Telegram no longer limits the account.

## Writes

- **30 sends an hour** per profile by default (`sendsPerHour`), counted across processes; see
  [security.md](security.md#the-send-guard).
- **Spam limit (PEER_FLOOD)** and a frozen account hold every write; reads still work. See
  [troubleshooting.md](troubleshooting.md).
- A send that may or may not have arrived is never repeated by `tg`; see
  [usage.md](usage.md#when-the-outcome-is-unknown).

## Bulk reads

- `store fetch`: pages of up to 100 messages, `--pause` between pages (1 s by default), 1000 messages a
  run unless `--limit` says otherwise. `--estimate` counts the requests first and sends none.
- `messages download --all`: one request per page and per file; files are paced too.
- `chats members list --all`, `chats list --all` and gap repair are paced the same way.

## Background jobs

`store fetch --background` and `store gaps repair --background` start a job that outlives the command:
one job per chat at a time, each in its own process, all on the profile's one pace. `tg store jobs
list` shows them, `tg store jobs cancel <job>` stops one after its current page. See
[archive.md](archive.md#in-the-background).

## Bots

A bot's own Bot API limits are separate from the account's. `tg` respects the `retry_after` Telegram
sends back; a long one ends the run. See [bot.md](bot.md).

## One login, several processes

Each `tg` process opens its own connection with the profile's login. Several at once work, but every
one of them is a request source for the same account — which is why they share the pace.
