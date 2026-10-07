# Search query language

The reference for queries of `tg messages search`, `tg stats messages show` and saved searches. For
everyday examples start with [message search](search.md).

The language is a strict profile of Apache Lucene's query syntax: words, phrases, AND/OR/NOT,
groups, fields, ranges, bounded wildcards and regular expressions. The
[full reference](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language.md)
(in Russian) has the generated tables of fields, operators, presets and limits, and executable
examples; the
[technical specification](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language-spec.md)
describes the grammar and the compiler.

Words and phrases without a field match word forms. `--exact` selects exact forms for words
without a field; explicit `text:` still matches forms. Archive language settings affect matching.

## Operators

| Operator | Example | Meaning |
|---|---|---|
| words | `invoice paid` | both words |
| phrase | `"invoice paid"` | the words in this order |
| `AND`, `&&` | `alpha AND beta` | both |
| `OR`, `\|\|` | `alpha OR beta` | either |
| `NOT`, `!`, `-` | `alpha NOT beta` | the first without the second |
| `+` | `+alpha OR beta` | alpha required, beta optional |
| group | `(alpha OR beta) gamma` | brackets set the order |
| field group | `from:(alice OR bob)` | the field applies to each value |
| range | `date:[2026-01-01 TO 2026-02-01}` | `[ ]` include, `{ }` exclude, `*` open |
| comparison | `size>10MB`, `date>=7d` | an open range |
| wildcard | `invo*`, `te?t` | `*` any characters, `?` one |
| regex | `text:/pass(port)?/` | a bounded Lucene regular expression |

`alpha OR beta gamma` means `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` means
`alpha OR (beta AND gamma)`. Use brackets for clarity. Lowercase `and`, `or`, `not` are plain words. A
query with only `NOT` finds nothing: give a positive condition, for example `kind:group NOT preset:secret`.
Fuzzy `~`, proximity, boosts and intervals are refused with an error, not ignored.

## Fields

| Field | Finds | Example |
|---|---|---|
| `text` | words of the message (the default field) | `text:invoice` |
| `exact` | the exact word or phrase form | `exact:piso`, `exact:"invoice paid"` |
| `body` | the whole original text, case-sensitive | `body:/.*invoice.*/` |
| `from` | the sender, by name, @username or id; `me` is you | `from:"Alice Synthetic"` |
| `chat` | the chat, by title, @username or id | `chat:"Book club"` |
| `date` | when it was sent | `date:today`, `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| `kind` | the kind of chat: `private`, `group`, `channel`, `saved`, `bot`, `service`, `unknown` | `kind:private` |
| `has` | `attachment`, `link`, `file`, `photo`, `image`, `video`, `audio`, `voice`, `sticker`, `contact`, `location`, `poll` | `has:file` |
| `topic` | one forum topic; needs one chat | `chat:"Book club" AND topic:42` |
| `in` | which accounts: a provider or `bots` | `in:bots` |
| `preset` | text shaped like a secret or a contact detail | `preset:secret` |
| `content` | indexed attachment text | `content:invoice` |
| `filename` | an attached file's whole name | `filename:*.pdf` |
| `mime` | an attached file's type; a value without `/` matches the first part | `mime:image` |
| `size` | an attached file's size, in bytes or KB/MB/GB of 1,024 | `size>10MB` |
| `tag` | your own local tag on the message, its chat or its sender | `tag:work` |

Field names are case-sensitive. An unknown field, value or combination is an error, never an empty
answer and never plain text. A name that the archive does not know is not looked up on Telegram.

`kind:bot` selects a chat with a bot; `in:bots` selects the archives of `tg bot` accounts. `topic:`
needs exactly one chat in `chat:` or `--chat`, since topic numbers repeat across groups. `filename`,
`mime` and `size` match a message when at least one of its files matches. `/` starts a regular
expression, so quote a full type: `mime:"application/pdf"`.

## Presets

| Preset | A candidate is |
|---|---|
| `password` | a password label followed by a value |
| `code` | a verification-code label and 4–8 digits |
| `api-key` | an API-key label and a value |
| `secret` | a password, secret, token or API-key label and a value |
| `card` | 13–19 digits with optional spaces or hyphens |
| `bank` | an IBAN-shaped value |
| `passport` | a labelled passport value or a Russian 4+6 digit shape |
| `phone` | a plus-prefixed international phone shape |
| `email` | an email-address shape |
| `telegram-link` | a t.me or telegram.me link |
| `url` | an HTTP(S) link |
| `contact` | a contact attachment, or an email or phone |
| `location` | a location attachment or a geo: link |

A preset reports a candidate by its shape. It does not verify a password, a card or a document, and
it can match something harmless. Do not delete or forward messages automatically on its word.

## Dates

`--timezone` takes an IANA zone such as `Europe/Madrid`; without it, the computer's zone is used and
returned in the answer. A date without a time is a whole calendar day. An inclusive upper day includes
that whole day, an exclusive one excludes it; a day when clocks change can last 23 or 25 hours.

`date:today` and `date:yesterday` are calendar days. `date:7d` means from 7 days ago until now (also
`30m`, `2h`); `date>=7d` and `date:[30d TO 7d}` work in comparisons and ranges, counted from the
moment the query runs. An exact time is quoted, with seconds and an offset:
`date>="2026-01-01T10:00:00+02:00"`.

## Words, wildcards and regular expressions

Text is folded before it is indexed and searched: lower case, without accents. A side effect: some
different words become the same, such as `año` and `ano`. `text:` regular expressions and wildcards
are folded the same way.

`text:/pay/` matches the whole word pay, not payment. `body:/pay/` matches only a message
whose entire text is pay, case-sensitive; to find it anywhere use `body:/.*pay.*/`. This is
Lucene's regular-expression syntax, without JavaScript lookaround, backreferences, anchors or flags.

On a large archive a short prefix such as `a*` can expand to more than 10,000 words and is refused;
lengthen it. Long
queries, deep nesting, large patterns and slow scans are refused with `query_limit`, not cut short:
narrow the chat, the dates or the pattern.

## The answer

`--json` returns `{ items, page, limit, hasMore, corrections, completeness, wordsReady, query, coverage }`,
even when nothing matched. `--jsonl` streams the items only.

- `query` — the language version, the time zone and the order used.
- `coverage` — which accounts and chats were searched. `lastSyncedAt` is the oldest time a chat in scope
  was fetched by `store fetch`, `null` if any chat never was. `inventoryComplete` means every account in
  scope has once listed all its chats; it does not promise a complete history.
- `completeness` — per chat: whether its stored history reaches the start and has gaps.
- `wordsReady` — whether the word index is complete. When it is `false`, a query with words fails with
  `index_not_ready` and the command that finishes it, `tg store migrate`; a query without words runs.
- `hasMore` is about the page, not about whether Telegram holds more.

An error carries the position of the problem in the query and a hint.

## In MCP

`tg_read` (`command: "messages search"`) takes the query as `text`, or as a versioned syntax tree in `ast` (not both);
`language` chooses `lucene` or `legacy`, `timezone` the calendar zone. `chat` takes an id or a stored
name; `source`, `newest`, `context` and `limit` work as the command options do; `saved` runs a saved search.
The query history follows the server: `tg mcp --no-record`, or `record` set to `false`, keeps its calls out. The answer has the same fields as `--json`. `tg_read` (`command: "stats messages show"`) counts
the same queries.

## The older modes

```sh
tg messages search 'from:alice after:7d invoice -draft' --language legacy --json
tg messages search --regex 'invoice\s+\d+' --json
```

`--language legacy` keeps the earlier filters and its correction of typos. `--regex` is a separate
mode: a JavaScript regular expression, case-insensitive, over the full text, in an isolated worker with
time and size limits. `--regex` cannot be combined with `--language lucene`.

| Legacy | Strict |
|---|---|
| `after:2026-01-01` | `date:[2026-01-01 TO *]` |
| `before:2026-02-01` | `date:[* TO 2026-02-01}` |
| `after:7d` | `date:7d` |
| automatic prefix and typo correction | `invo*` explicitly; typos only in `--language legacy` |

`--thread` follows the stored reply graph; in `messages context` it replaces chronological neighbours. Defaults are
8 hops, 50 messages, 65,536 bytes and one day around each hit. Change them with `--thread-hops`,
`--thread-messages`, `--thread-bytes`, `--thread-within`. Without a graph it falls back to chronological context;
stale links are marked and not traversed.

Search reads the local archive by default. `--sync-first` explicitly fetches new messages before searching and
marks nothing read: at most 5 chats, 500 messages and 30 seconds. Change these bounds with `--max-chats`,
`--max-messages`, `--sync-time`. Failed or incomplete refresh retains local results with stale coverage and refresh
details.

MCP uses `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` and `sync_first`. `sync_first`
is exposed only with `messages.sync-first: allow`. Ordinary `messages_context` with `offline: true` reads stored
messages.
