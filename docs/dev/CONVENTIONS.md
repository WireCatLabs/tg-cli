# Conventions

The rules every WireCat CLI follows are in the [CLI standards handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), which ships in
`@wirecat/cli-base`. Where this page and the handbook disagree, the handbook wins. This page lists only what `tg`
adds or holds more strictly.

## Code

- **Comments, formatting and TypeScript habits:** [Style](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/style.md) and [Toolchain](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/toolchain.md).
  The owner's global rule on comments is stricter than anything a surrounding file shows.
- **mtcute stays in `src/telegram/`**, and its objects become domain models in `map.ts` alone
  ([ARCHITECTURE.md](ARCHITECTURE.md#1-most-of-tg-is-not-in-this-repository), [WC-ARCH-3](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md)).
- **Command names, options, output shapes and MCP tools:** [Commands](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/commands.md), [Output](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/output.md)
  and [MCP](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/mcp.md). Every command and option is in cli-core's
  [parity manifest](https://github.com/WireCatLabs/cli-core/blob/main/parity.json), and `pnpm parity:check` fails on
  one that is not ([WC-TEST-16](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/testing.md)).
- **Messenger-neutral code goes to cli-core**, not here ([WC-ARCH-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md)). If a change would help
  another messenger CLI too, it belongs there.
- **Never a message, a token, a phone number or a real chat id** in a log, a fixture, a test or a document
  ([WC-SECR-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md)). Command output is the only place a message may appear.

## Documents

[Documents](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/docs.md) holds the rules: user pages and developer pages, current facts only, one fact in one home,
generated pages. What is `tg`'s own:

- **English**, in every document of this repository, user pages included.
- **Link, do not copy.** A link to a sibling repository uses its GitHub URL, so it works for a reader who has only
  this one; `pnpm docs:check` checks every link inside this repository.
- **Every option a user page names exists**, or the parity manifest plans it for that command (docs come first).
  `pnpm parity:check` checks every `tg <command> --option` on the user pages; a change that drops an option fails
  until its pages stop naming it.

## The changelog

[`CHANGELOG.md`](../../CHANGELOG.md) follows [WC-DOC-14 to WC-DOC-20](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/docs.md): `## Unreleased` on top, one
`## <version> — DD.MM.YYYY` section per version, newest first, and the headings `Added`,
`Changed — may break callers`, `Fixed`, `Removed` and `Security`, each at most once in a section. `pnpm docs:check`
checks the shape. Sections up to 0.69.0 were released with `What's new` and `Changed — may break scripts`; they stay
as they are, because a released section is never edited.

When `bin/release` has to take the next free version, it renames the prepared version's heading — or, if npm already
has that version, dates `## Unreleased` as the new one and leaves the published section alone.

## Documentation authoring

Before documentation work, read the [shared authoring rules](https://github.com/WireCatLabs/cli-docs/blob/main/docs/AUTHORING.md).
Every user guide starts with a brief explanation of when to use it and what result the reader
will get; mention a prerequisite only when it changes the next step. Keep titles short and
task-specific. A new sidebar page needs a relevant icon and a contextual incoming link.
Preserve released command facts and existing URLs/anchors.
