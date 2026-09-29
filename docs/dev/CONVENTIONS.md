# Conventions

`tg` follows [max-cli's conventions](https://github.com/leemour/max-cli/blob/main/docs/dev/CONVENTIONS.md)
for code and documents. This page lists only where `tg` differs or adds.

## Code

- **Comments are sparse and say why**, never what — the owner's global rule, stricter than anything a
  surrounding file shows.
- **Biome** formats and lints (`pnpm lint`): 2 spaces, double quotes, no semicolons, 120 columns.
- **mtcute stays in `src/telegram/`**, and its objects become domain models in `map.ts` alone
  ([ARCHITECTURE.md](ARCHITECTURE.md#1-most-of-tg-is-not-in-this-repository)).
- **Messenger-neutral code goes to cli-messaging**, not here. If a change would help `max` too, it
  belongs there.
- **Never a message, a token, a phone number or a real chat id** in a log, a fixture, a test or a
  document. Command output is the only place a message may appear.

## Documents

- **English**, in every document of this repository, user pages included.
- **User pages** — `README.md` and the pages directly under `docs/` — state current facts only: no
  correction marks, no struck-out text, no internal ids. `pnpm docs:check` enforces it.
- **Developer pages** (`docs/dev/`, `HANDOFF.md`) correct a wrong sentence in place and mark it.
- **Link, do not copy.** A link to a sibling repository uses its GitHub URL, so it works for a
  reader who has only this one; `pnpm docs:check` checks every link inside this repository.

## The changelog

[`CHANGELOG.md`](../../CHANGELOG.md), newest first:

- `## Unreleased` on top while there is something unreleased; each version as
  `## <version> — DD.MM.YYYY`. When `bin/release` has to take the next free version, it renames the
  prepared version's heading — or, if npm already has that version, dates `## Unreleased` as the new
  one and leaves the published section alone.
- Subheadings, each at most once: `What's new`, `Changed — may break scripts`, `Fixed`, `Security`,
  `Removed`. Anything that changes a command's output, an exit code, an option or a config key goes
  under `Changed — may break scripts`.
- Each entry says what changed as a user sees it, why when that is not obvious, and what to watch
  for — as max-cli's changelog section describes. No internal ids, no file paths.
