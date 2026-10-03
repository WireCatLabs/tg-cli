# Message search

`tg messages search` reads only the shared local archive, without networking or read receipts.

## Quick start

```sh
tg messages search 'invoice AND (kind:group OR kind:private)' --json
tg messages search 'from:"Alice Synthetic" date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid --json
tg messages search 'preset:secret kind:saved' --json
tg messages search 'text:/pass(port)?/' --json
tg messages search 'chat:"Work" AND body:/.*invoice.*/' --json
tg messages search 'has:file' --json
```

Replace example names with your own. Words and phrases match strictly, with no automatic
correction or substring fallback. `alpha OR beta gamma` means `(alpha OR beta) AND gamma`;
`alpha OR beta AND gamma` means `alpha OR (beta AND gamma)`. Use parentheses for clarity.

## Fields and operators

text/body/from/chat/date/kind/has/topic/in/preset, Boolean and field groups,
inclusive/exclusive ranges, bounded wildcard and Lucene regex are supported. topic requires one mandatory chat.
kind:bot selects a peer; in:bots selects Bot API accounts. filename/mime/size/tag are explicitly unsupported,
as are fuzzy/proximity/boost/interval functions. Unknown fields never become literal text.

## Dates and regex

`--timezone` selects an IANA zone; a date without a time means a calendar day. An inclusive upper
boundary includes the whole day, an exclusive one excludes it; DST days are not always 24 hours.
Quote exact timestamps and include seconds and an offset.

text regex matches a whole normalized term; body regex matches the entire raw, case-sensitive body.
Use `.*` for a body substring. This is a Lucene subset, without JavaScript lookaround, backreferences or flags.
Exceeding row/byte/state/work/time budgets produces an explicit error; narrow the scope.

## Archive and machine response

Empty hits do not prove that a message was never sent. JSON reports the query version,
completeness/coverage, accounts/chat and index readiness even with no hits. lastSyncedAt is currently null;
profile inventory is not considered complete. JSONL contains items only; use --json for coverage.
An unfinished word index requires `tg store migrate`; fetch history with `tg store fetch`.
Candidate presets do not verify credentials.

## Legacy migration

```sh
tg messages search 'from:alice after:7d invoice -draft' --language legacy --json
tg messages search --regex 'invoice\s+\d+' --json
```

Legacy preserves the old filters and discovery. --regex is a separate JavaScript iu full-body mode with
an isolated worker and limits; --regex --language lucene is refused. The programmatic saved-query contract carries a language/version;
the shared migration preview cannot preserve fuzzy discovery results.

## Full reference

The [canonical language guide](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language.md)
contains operator/field tables, Unicode/escaping, presets, limits, errors and ten executable recipes.
The [technical specification](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language-spec.md)
describes the pinned grammar, AST/schema, reference fixtures and compiler.
[Archive](archive.md) covers fetching and completeness; [commands](commands.md) lists current options.
