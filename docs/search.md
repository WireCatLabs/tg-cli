# Message search

`tg messages search` finds messages in the local archive: the copy of your chats that tg keeps on this
computer. By default it never connects to Telegram and marks nothing read. A message tg has not fetched cannot be
found, so fetch the history first: `tg store fetch <chat>` ([archive](archive.md)).

This page covers everyday searches. Three more pages go further:

- [Topic search](topic-search.md) — find a discussion by what it was about, when you do not remember
  its words.
- [Query language](query-language.md) — every field, operator, limit and the JSON answer.
- [How search works](https://wirecat.dev/en/docs/search-architecture) — the technical page: the word
  index, the conversation graph, vectors and how results are ranked.

Put the query in single quotes, so the shell leaves its quotes and brackets alone. The names below are
examples; use your own chats and people.

## Words and phrases

```sh
tg messages search invoice
tg messages search '"invoice paid"'              # words together
tg messages search 'cafe OR library'
tg messages search '(cafe OR library) NOT loud'
tg messages search 'invoic*'                     # every word that starts with "invoic"
```

Words next to each other must all be in the message. Search includes word forms, according to
the archive's language settings: `piso` can find `pisos`. Quotes keep words together and also allow
word forms. Use `exact:piso` or add `--exact` for words without an explicit field. An explicit
`text:` still matches forms. Case and accents
are ignored. Typos are not corrected automatically.

## People and chats

```sh
tg messages search 'from:"Alice Synthetic" invoice'
tg messages search 'from:("Alice Synthetic" OR "Bob Synthetic") library'
tg messages search 'from:me date:7d'             # what you wrote this week
tg messages search 'chat:"Book club" library'
tg messages search library --chat "Book club"    # the same, as an option
tg messages search 'passport kind:private'       # one-to-one chats only
```

`kind:` takes `private`, `group`, `channel`, `saved` (Saved Messages) and `bot`. `topic:` keeps to one
forum topic of a group; it needs that group in `chat:` or `--chat`.

## Dates

```sh
tg messages search 'date:today'
tg messages search 'library date:yesterday'
tg messages search 'invoice date:7d'             # from 7 days ago until now; also 30m, 2h
tg messages search 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` and calendar dates are days in your computer's time zone; `--timezone` picks
another. In a range, `[` and `]` include that day, `{` and `}` exclude it.

## Files and links

```sh
tg messages search 'has:file'
tg messages search 'filename:*.pdf'
tg messages search 'filename:*contract*'         # part of the name
tg messages search 'size>10MB'
tg messages search 'mime:image'                  # any picture sent as a file
tg messages search 'mime:"application/pdf"'      # quote a full type
tg messages search 'has:photo chat:"Book club"'
tg messages search 'has:link AND "github.com"'   # a link to a site
```

A file is found by its name, size and type even when the message has no text. `filename:` compares the
whole name, ignoring case and accents. Sizes use KB, MB and GB of 1,024. `has:` also takes `attachment`,
`video`, `audio`, `voice`, `sticker`, `contact`, `location` and `poll`. A link counts when it is in the
text or only in its preview card.

## Passwords, codes and cards

```sh
tg messages search 'preset:secret kind:saved'    # something that looks like a password or token
tg messages search 'preset:card'
```

A preset finds messages that *look like* a password, a login code, an API key, a card or IBAN number, a
passport, a phone, an email or a link. It checks the shape only: it does not prove that a password
works or a card is real. The full list is in the [query language](query-language.md#presets).

## Tags

```sh
tg tags add work --chat "Book club"
tg tags add work --contact "Bob Synthetic"
tg tags list --tag work --type chat
tg messages search 'tag:work invoice'
tg messages search 'invoice NOT tag:work'
tg tags remove work --chat "Book club"
```

A tag is your own label on a chat, a person or one message (`--message <id> --chat <chat>`). It is kept
in the local archive only and is never sent to Telegram. `tag:work` finds messages tagged `work`,
messages in a chat tagged `work` and messages from a person tagged `work`. A tag is 1–32 letters a–z,
digits and hyphens.

## Saved searches and history

```sh
tg searches create meetings 'library OR cafe' --chat "Book club"
tg messages search --saved meetings
tg messages search --saved meetings 'date:today'  # extra words are added with AND
tg stats messages show --saved meetings --by day
tg searches list
tg searches history --limit 10
tg messages search --saved 42                    # a row of the history, by its number
```

`searches create` saves a query with its options and runs nothing; an existing name needs `--replace`.
Options you type with `--saved` replace the saved ones. The saved text is read again on every run, so
`date:7d` always means the last 7 days. `searches show` prints one, `searches delete` removes one.

Every search and count that succeeds is written to the history: the query and its options, never the
messages it found. The newest 1,000 runs are kept. `--no-record` keeps one run out of it; in MCP,
`tg mcp --no-record` or `record` set to `false` keeps the server's calls out; `searches clear` empties the history and keeps the saved searches. This
history is separate from the run records of `tg runs`.

Saved searches and the history live in the store that tg and max share: both see the same ones, and
`delete` or `clear` in one changes the other. Tags stay with their account.

## Counting: `stats messages show`

```sh
tg stats messages show invoice                        # how many in each chat
tg stats messages show 'date:7d' --by sender
tg stats messages show 'from:me' --by day --timezone Europe/Madrid
tg stats messages show --by hour                      # every stored message
```

`stats messages show` counts the messages `messages search` would find with the same query, each one once.
`--by chat` (the default) and `--by sender` put the largest first; `--by day` and `--by hour` go in
order. When some chats are not stored in full, the numbers are a lower bound, and stderr says how
many chats that is.

## When nothing is found

An empty answer means "not in the archive you searched", not "never sent". Check what is stored with
`tg store status` and fetch more with `tg store fetch`. With `--json` the answer says which chats were
searched and how complete they are, even when nothing matched. If tg asks for `tg store migrate`, the
word index is still being built; searches without words (`has:file`, `date:today`) already work.

To search every account in the store, add `--source all`. `--newest` orders by time instead of by
relevance, and `--context 2` shows two messages around each one found.

## For scripts and agents

`--json` returns one object with the messages and what was searched; `--jsonl` streams the messages
only. In MCP, `tg_read` (`command: "messages search"`) and `tg_read` (`command: "stats messages show"`) take the same queries, and `tags` and
`searches` commands through `tg_read`/`tg_write` manage tags and saved searches. The answer's fields,
the older `--language legacy` mode and `--regex` are in the [query language](query-language.md).

Search reads the local archive by default. `--sync-first` explicitly fetches new messages before searching and
marks nothing read: at most 5 chats, 500 messages and 30 seconds. Change these bounds with `--max-chats`,
`--max-messages`, `--sync-time`. Failed or incomplete refresh retains local results with stale coverage and refresh
details.

`content:invoice` searches indexed text extracted from attachments or supplied by an agent. Extraction supports
plain text, Word and PDFs with text layers; scans and photos need agent-supplied text. With several attachments,
choose `--attachment`, starting at 1.

The agent normally reads images/scans with its own OCR or vision tools and writes the text into this
index. `attachments list --needs-text` returns the saved path, message locator and attachment number.
Verify write-back with a `content:` search. A path on an MCP server does not transfer the file to a
remote agent; the agent needs access to the file to read it.

```sh
tg attachments extract --chat "Book club" --download --output-dir ./files
tg messages search 'content:invoice'
tg attachments list --chat "Book club" --needs-text
tg attachments text set "Book club" 204 --text-file ./scan.txt
```

`--download` requires `--output-dir`; without them extraction reads retained files. `list` exposes retained paths and text status, not text contents.

For bulk work, explicitly select the standard model gateway API. Configure an available vision model
under `models.ocr` and use the ordinary `models text key set` credential command. Replace
`your-vision-model` in the example with your model's name.

```sh
tg config set models.ocr.provider openai
tg config set models.ocr.model your-vision-model
tg models text key set openai
tg attachments extract --chat "Book club" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` sends images to that API; without it no model is called. Concurrency is1–8, default4;
the file limit is1–500, default100. Pass the returned cursor to continue a bounded scan.
Scanned PDFs need optional `unpdf` and `@napi-rs/canvas`, with at most20pages per document;
text-layer pages stay local. Repeats reuse the file hash and model identity. Agent text and old
indexed text survive failed or cancelled OCR. Inspect failed counts and per-file statuses;
a provider rate limit stops later API calls in that run. `--offline` conflicts with `--ocr`.

`--thread` follows the stored reply graph; in `messages context` it replaces chronological neighbours. Defaults are
8 hops, 50 messages, 65,536 bytes and one day around each hit. Change them with `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Without a graph it falls back to chronological context;
stale links are marked and not traversed.

PDF extraction needs optional `unpdf`; Word needs optional `mammoth`, installed where `tg` is. For a global npm
install: `npm install -g unpdf mammoth`. Missing engines are reported; an agent can supply text instead.

## Files, preparation and archive gaps

`tg attachments extract --chat <chat> --from-dir ./files` reads an explicit directory without
visiting subdirectories. A file needs a unique original name or a complete set of downloader names.
Do not combine `--from-dir` with `--download` or `--output-dir`.
`tg messages download <chat> <id> --extract` extracts only files downloaded by this invocation;
`--all --extract` applies the same rule to the batch. Extraction checks changed bytes by hash and
preserves agent-written text. Bounded MCP extraction returns a continuation `cursor` and metadata,
without file text. Discover `attachments extract` through `tg_tools_search` and run it through `tg_write`.

`tg store fetch <chat> --catch-up` prepares only that chat's graph and installed local vectors after
fetching. Preparation is off by default; profile setting `searchCatchUp: true` enables it, and
`--no-catch-up` overrides it for one run. Bounds are
`--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. It never downloads a model
or calls a remote provider. The separate `prepared` result reports incomplete preparation while
fetched history remains saved.

`tg store gaps plan <chat>` locally inspects gaps between recorded inclusive coverage ranges.
Missing message ids and quiet periods alone do not prove missing history; archive edges stay in
`unknown`. Inspect the plan, then explicitly run `tg store gaps repair <chat> --fingerprint <hash>`.
Defaults are five gaps, 500 messages and 30 seconds; use `--max-gaps`, `--limit`, `--repair-time`,
`--page-size` and `--pause` to set bounds. A repeat repairs remaining gaps without deleting unseen
messages. Ambiguous timestamp pages remain pending. `--background` uses `store jobs show`, `store jobs list` and `store jobs cancel`.
The same commands are available through MCP discovery and `tg_read` or `tg_write`; job metadata is
profile-scoped. Repair requires `store.gaps.repair` write permission and message read access.
Optional catch-up shares the repair's remaining time budget.
