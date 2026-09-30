# Documentation

`tg` is a command line interface for a personal Telegram account, built for agents and scripts
first. Each page below answers one question. Open the one you need; they are not meant to be read in
order.

## Using it

| Page | Answers |
|---|---|
| [installation.md](installation.md) | How do I install it, what does it need, where do its files go, how do I upgrade or remove it? |
| [usage.md](usage.md) | How do I log in, read, page, send, and use it from a script — in that order? |
| [sessions.md](sessions.md) | How does login work: QR or phone, the app from my.telegram.org, the keyring, profiles, logout? |
| [configuration.md](configuration.md) | What can I set, with which variable, and which value wins? |
| [store.md](store.md) | What does the local store keep, how do I fill it, search it, export it and keep it current? |
| [mcp.md](mcp.md) | How do I connect Claude Desktop, Cursor or another client without a terminal? |
| [remote.md](remote.md) | ChatGPT or Claude in the browser, through a login proxy and a tunnel |
| [recipes.md](recipes.md) | What can an agent do for me every day, and how do I run it on a schedule? |
| [diagnostics.md](diagnostics.md) | What did a command do, and what is never recorded? |
| [security.md](security.md) | What reaches the disk, what never does, and what stops a send going to the wrong place? |
| [troubleshooting.md](troubleshooting.md) | Something does not work: what the screen says, and what to do |
| [commands.md](commands.md) | Every command, option and exit code — **generated** from the program |

What changed between versions: [CHANGELOG.md](../CHANGELOG.md).

## The reference is generated

[commands.md](commands.md) is written by `pnpm generate` from the command tree, and CI fails when the
committed page differs from what the program says. The same list, as JSON, is `tg commands --json`.

## Building it

- [dev/ARCHITECTURE.md](dev/ARCHITECTURE.md) — how tg is built, and which seams you may not cross
- [dev/CONVENTIONS.md](dev/CONVENTIONS.md) — how code and documents are written here
- [dev/TESTING.md](dev/TESTING.md) — how to check a change, and what each check is for
- [the platform proposal](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-09-26-platform-proposal.md)
  — the design shared with [cli-messaging](https://github.com/leemour/cli-messaging), which holds
  everything that is not specific to Telegram
