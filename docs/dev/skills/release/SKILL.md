---
name: release
description: Prepare, check and publish a tg-cli release — run release:check, draft the changelog in the fixed headings, audit the docs against what changed, review the change against the rules in CLAUDE.md, run the live smoke with the owner's yes, raise the version and run bin/release. Use when asked to release, prepare a release, cut a version, «выпуск», «выпустить версию».
---

# Release tg-cli

The steps tg and max share are in cli-messaging's
[RELEASING.md](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/RELEASING.md). Read it
first. This skill orders them for tg and adds what is tg's.

**tg releases without asking**: no signed report, no sign-off. You merge and publish yourself once
every step below holds. The one exception is the live smoke, which sends real messages and needs the
owner's yes each time: a release that changes a write waits for that yes and the run.

## 0. What changed

The commands in RELEASING.md, "What changed". Work in a worktree off `origin/main`, never in the
main checkout:

```sh
git fetch origin && git worktree add --no-track -b chore/release-<version> .worktrees/release origin/main
```

A dependency release (cli-messaging) can add or change commands without any code here. The
`docs/commands.md` diff shows it.

## 1. The automatic checks

```sh
pnpm release:check
```

On the release branch, before the version is raised, only "version not on npm" and "changelog" may
fail. Anything else: report it, then fix it in the release pull request. Fix nothing on your own
judgement.

## 2. The changelog

Draft `## Unreleased` from the merged pull requests (RELEASING.md, "The changelog") under tg's
headings, each at most once: `What's new`, `Changed — may break scripts`, `Fixed`, `Security`,
`Removed` ([CONVENTIONS.md](../../CONVENTIONS.md#the-changelog)). A new cli-messaging
version gets the entries a tg user notices, said in tg's words. No internal ids, no file paths.

## 3. The docs against the diff

RELEASING.md, "The docs against the diff": `README.md`, `docs/*.md` and `skills/tg-cli/SKILL.md`,
which `tg skill show` prints. `docs/commands.md` and `docs/dev/test-matrix.md` are generated:
`pnpm generate`, `pnpm test:matrix`.

## 4. The rules

RELEASING.md, "Reviewing against the rules", against the five rules in
[CLAUDE.md](../../../../CLAUDE.md). Rule 1 (nothing sends unless asked; live checks only in Saved
Messages and only through `bin/tg`), rule 3 (every command closes its connection in a `finally`) and
rule 5 (no session or app credential in a log, a fixture or a document) are read in the changed
code. Each one gets **holds** or **broken**, with `path:line`.

## 5. Live

- **The change touches a write** (an adapter write in `src/telegram/adapter.ts`, a write command, a
  cli-messaging release that changes one): ask the owner for a yes to `pnpm smoke:live`, then run it.
  **The release waits for that answer** — the one thing in a tg release that does; run it
  in the release worktree. Seed the worktree first, never with `session start`:

  ```sh
  node --experimental-strip-types scripts/seed-worktree.ts <main checkout> "$PWD"
  pnpm smoke:live
  ```

  Inside this repository's sandbox a script gets no network for the `bin/tg` it starts: ask the
  owner to run it from a terminal and paste the `ok` / `FAIL` lines. Any `FAIL` stops the release
  until the owner rules on it.
- **A command only a live run checks** (the ⛔ rows of `docs/dev/test-matrix.md`) changed: the
  `test-live` skill, with the owner's yes.
- **Neither**: say so in the release pull request. No live run.

## 6. Raise the version and publish

```sh
npm view @wirecat/tg-cli version                 # what is really published
# package.json: the next version; then
pnpm version:sync                                # src/version.ts follows package.json
# CHANGELOG.md: "## Unreleased" becomes "## <version> — DD.MM.YYYY"
pnpm release:check                               # now every check passes
```

Commit `chore: release <version>`, open the pull request, and merge it once CI is green. Then, in
the main checkout on a clean `main`:

```sh
gh run list --workflow release.yml --limit 1     # nothing in progress — two releases at once race
bin/release
```

`bin/release` runs `release:check` again, takes the next free version if another session published
first, starts `release.yml` and waits for npm and the tag. Report the version, the run and what the
live step did.
