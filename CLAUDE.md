# tg-cli — working rules

**Start with `HANDOFF.md`** — it lives on disk in the checkout, not in git — what this is, what to read for your task, and what will
bite. A lane agent starts with its own handoff instead ([`docs/dev/agents.md`](docs/dev/agents.md)). Open work is
[`docs/dev/BACKLOG.md`](docs/dev/BACKLOG.md).

Security audits of this repository follow the shared
[security method](https://github.com/WireCatLabs/cli-testing/tree/main/docs/security) in cli-testing;
vulnerabilities are reported as the [security policy](SECURITY.md) says.

1. **This is the owner's real Telegram account.** Nothing sends unless the command typed asked for
   it; live checks send only to Saved Messages, and go through `bin/tg`, never `node dist/bin/tg.js`.
2. **In machine mode, stdout carries data and nothing else.** Diagnostics go to stderr.
3. **One-shot means the process exits.** Every command closes its Telegram connection in a `finally`.
4. **No mtcute type crosses `src/telegram/`.** A lint rule enforces it.
5. **The session and the app credentials never reach a log, a fixture or a document.**

Conventional commits, a branch and a PR per change. The pre-commit hook checks staged lint and secrets. Comments sparse, only *why*.

## Development check budget

Local commits check only staged lint and secrets. There is no pre-push check.
Config integrity, repository lint, Markdown, and secret detection run in PR CI.
The bounded `ci:quick` step adds typechecking, a build and the command lint for CLI packages or synthetic unit tests for the docs site.
Full validation (`ci.yml`: tests with the coverage floor, contracts, docs, builds, parity, a secret scan) runs on
every pull request (`pr.yml`) and again on each merge to `main`, Linux only, no publishing (`WC-CI-5`, `WC-CI-7`,
`WC-TEST-11`). `ci:quick` stays the two-minute early check (`WC-CI-4`).
Browser and platform suites run for releases, explicit manual validation, and monthly nonpublishing validation. See the
[shared policy](https://github.com/WireCatLabs/community/blob/main/standards/README.md#ci-and-hooks).
