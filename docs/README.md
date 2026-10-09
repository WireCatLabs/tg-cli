# Documentation

`tg` is a command line interface for a personal Telegram account, built for agents and scripts
first. Each page below answers one question. Open the one you need; they are not meant to be read in
order.

## Using it

| Page | Answers |
|---|---|
| [index.md](index.md) | The docs site's start page: what `tg` is, the first minute, where to go next |
| [installation.md](installation.md) | How do I install it, what does it need, where do its files go, how do I upgrade or remove it? |
| [usage.md](usage.md) | How do I log in, read, page, send, and use it from a script — in that order? |
| [sessions.md](sessions.md) | How does login work: QR or phone, the app from my.telegram.org, the keyring, profiles, logout? |
| [configuration.md](configuration.md) | How do I configure common behavior? |
| [configuration-reference.md](configuration-reference.md) | Every key, type, default, scope and variable |
| [cli-contract.md](cli-contract.md) | Invocation, output, errors, headless runs, bounds and previews |
| [archive.md](archive.md) | What does the local store keep, how do I fill it, search it, export it, keep it current and back it up? |
| [search.md](search.md) | How do I find a message by its words, sender, chat, date, file, link or tag, save a search and count? |
| [topic-search.md](topic-search.md) | How do I find a discussion by what it was about, keep that current, and what leaves my computer? |
| [query-language.md](query-language.md) | Every search field, operator, preset, limit and the JSON answer |
| [mcp.md](mcp.md) | How do I connect Claude Desktop, Cursor or another client without a terminal? |
| [remote.md](remote.md) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes.md](recipes.md) | What can an agent do for me every day, and how do I run it on a schedule? |
| [groups.md](groups.md) | How do I keep up with a group I run — open questions, newcomers, a weekly report? |
| [diagnostics.md](diagnostics.md) | What did a command do, and what is never recorded? |
| [security.md](security.md) | What reaches the disk, what never does, and what stops a send going to the wrong place? |
| [troubleshooting.md](troubleshooting.md) | Something does not work: what the screen says, and what to do |
| [commands.md](commands.md) | Every command, option and exit code — **generated** from the program |
| [roadmap.md](roadmap.md) | What is coming next? |

What changed between versions: [CHANGELOG.md](../CHANGELOG.md).

[meta.json](meta.json) is the sidebar of the docs portal: every page above, in order. It follows
[the shared page structure](https://github.com/leemour/cli-docs/blob/main/docs/STRUCTURE.md); a new
page goes into it too. This index is for contributors and stays out of the portal.

## The reference is generated

[commands.md](commands.md) is written by `pnpm generate` from the command tree, and CI fails when the
committed page differs from what the program says. The same list, as JSON, is `tg commands --json`.

## Building it

- [dev/ARCHITECTURE.md](dev/ARCHITECTURE.md) — how tg is built, and which seams you may not cross
- [dev/CONVENTIONS.md](dev/CONVENTIONS.md) — how code and documents are written here
- [dev/TESTING.md](dev/TESTING.md) — how to check a change, and what each check is for
- [dev/BACKLOG.md](dev/BACKLOG.md) — open work; the shared package
  [cli-messaging](https://github.com/leemour/cli-messaging) holds everything that is not specific to
  Telegram
