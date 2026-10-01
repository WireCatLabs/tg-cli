# Live scenarios

What a person checks on the real Telegram before a change ships. The suite never contacts Telegram
([TESTING.md](TESTING.md)), so these are the other half, run by hand. The `test-live` skill picks
the ones a change touches; the `release` skill runs `pnpm smoke:live`. The rules for running them
are shared with max-cli: cli-messaging's
[RELEASING.md, "Live checks"](https://github.com/leemour/cli-messaging/blob/main/docs/dev/RELEASING.md#live-checks).

**Nothing on this page names a real chat, person or id.** This repository is public. The scenarios
name roles. The cast (which group, which account, their ids, the profile names) and the dated
results live in `docs_ai/live-cast.md` of the main checkout, which git ignores.

## Running them from a worktree

`bin/tg-live` runs the worktree's own build with the main checkout's logins — `default` for the
owner, `tgtest` for B — so an agent in any worktree runs a scenario without logging in:

```sh
pnpm build
bin/tg-live tgtest account show --json        # B
bin/tg-live chats show <Group id> --json      # the owner
```

The message store stays the worktree's own; a branch build never migrates the main checkout's.

## The cast, by role

| Role | What it is | May a scenario write there? |
|---|---|---|
| **Saved** | Saved Messages of the owner's account, `me` | yes: messages it sends itself, deleted after |
| **Group** | a test group with the owner and the second account in it, and nobody else | yes, with the owner's yes |
| **Dialog** | the private chat between the owner and the second account | yes, with the owner's yes |
| **B** | the second account, which agreed to be acted on; it reads back what the owner's account wrote | through its own profile only |

Only these. Never a real person's chat, not even to read it for a check.

## Scenarios

Every command runs with `--json` and a timeout. Every check records the exit code, one JSON value on
stdout, stderr empty or one diagnostic, and the keys and item counts. Never the content.

### S — Saved Messages (no cast needed)

| Id | What | Commands | Puts back |
|---|---|---|---|
| S1 | reads answer and exit | `account show`, `account sessions list`, `chats list --limit 3`, `messages list me --limit 2`, `messages search` | nothing changed |
| S2 | every write once | `pnpm smoke:live` | deletes all it sent |
| S3 | a scheduled send fires under a new id | `messages send me --at 1m`, `messages scheduled me`, `messages list me` | deleted after it fires |
| S4 | download and transcribe | `messages download`, `messages transcribe` on a voice note the scenario sends | the note and the files deleted |
| S5 | `watch` and `serve` end, and see a write | `watch --events` and `serve` in the background, a send to `me`, stop by PID | the message deleted |
| S6 | the store from live reads | `store fetch me --max 50`, `store fetch me --background` (the ⛔ row), `contacts sync`, `store status`, `store info`, `store check`, `--offline` reads | the worktree's own store only |

### G — the test group

| Id | What | Commands | Puts back |
|---|---|---|---|
| G1 | members and topics | `chats members list`, `topics list`, `topics search` | nothing changed |
| G2 | a write seen by B | owner `messages send`; B `messages list` finds it by id | deleted for everyone |
| G3 | pin, react and a poll in a group | `messages pin`/`unpin`, `reactions add`/`remove`, `polls create`/`vote`/`close` | unpinned, the poll deleted |
| G4 | mark read is the owner's only | `chats mark-read`; the unread count before and after | cannot be unread: run only with the yes |

### D — the dialog with B

| Id | What | Commands | Puts back |
|---|---|---|---|
| D1 | edit and delete for everyone, seen by B | owner `messages edit`, `messages delete --for-everyone`; B reads both | gone on both sides |
| D2 | forward to the dialog | `messages forward me <id> --to <dialog>`; B reads it | deleted for everyone |
| D3 | `inbox` and `review` list the dialog | B sends one message; owner `inbox`, `review` | B's message deleted |

### X — agents

| Id | What | Commands | Puts back |
|---|---|---|---|
| X1 | the MCP tools per permission level | `tg mcp` on a profile with the default `permissions`, then with `permissions.messages` set to `readonly` and to `deny`: the count and names of the tools, prompts and resources through a scratch MCP client (**Correction 2026-10-01:** was per `--allow-*` flag, which decide nothing since cli-messaging 0.77.0) | the profile's `permissions` restored |
| X2 | an agent's send is guarded | `tg_messages_send` to `me` through MCP, and a refusal on a read-only profile | deleted after |

## Not run, and why

| What | Why |
|---|---|
| `session start`, `session end` | a new device login, or logging the owner out of the account |
| anything in a chat outside the cast | a real person's chat |
