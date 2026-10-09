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
| S1 | reads answer and exit | `account show`, `account sessions list`, `chats list --limit 3`, `messages list me --limit 2`, `search messages` | nothing changed |
| S2 | every write once | `pnpm smoke:live` | deletes all it sent |
| S3 | a scheduled send fires under a new id | `messages send me --at 1m`, `messages scheduled me`, `messages list me` | deleted after it fires |
| S4 | download and transcribe | `messages download`, `messages transcribe` on a voice note the scenario sends | the note and the files deleted |
| S5 | `watch` and `serve` end, and see a write | `watch --events` and `serve` in the background, a send to `me`, stop by PID | the message deleted |
| S6 | the store from live reads | `store fetch me --max 50`, `store fetch me --background` (the ⛔ row), `contacts sync`, `store status`, `store info`, `store check`, `--offline` reads | the worktree's own store only |

### G — the test group

| Id | What | Commands | Puts back |
|---|---|---|---|
| G1 | members and topics | `chats members list`, `topics list`, `search topics` | nothing changed |
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
| X1 | the MCP tools per permission level | `tg mcp` on a profile with the default `permissions`, then with `permissions.messages` set to `readonly` and to `deny`: the count and names of the tools, prompts and resources through a scratch MCP client | the profile's `permissions` restored |
| X2 | an agent's send is guarded | `tg_messages_send` to `me` through MCP, and a refusal on a read-only profile | deleted after |

## Not run, and why

| What | Why |
|---|---|
| `session start`, `session end` | a new device login, or logging the owner out of the account |
| anything in a chat outside the cast | a real person's chat |

## Forum topic addressing

Not yet checked live. Each write type requires the owner's separate permission and a test Group
that already has forum topics; Saved Messages cannot cover topic addressing. Do not convert a group
into a forum for this check.

- Read `topics list` for the approved Group and select an open topic plus General.
- Send text, photo/file caption and a poll with `--topic`; B reads back each thread id.
- Reply inside the topic and schedule a message there; verify the scheduled address and eventual thread.
- Refuse a closed/missing topic and a reply from a different topic without sending or uploading.
- Simulate lost acknowledgement offline; a retry retains the same send id, chat and topic.
  Scheduled unknown outcomes are checked in the queue and never repeated.

## Explicit forum setup

Owner-requested setup is a separate operation from send tests. Use an exact id, since titles may
match several groups. From the owner profile, `topics enable --upgrade --yes` upgrades the selected
basic group, then enables topics; record only the returned shape and use the new id afterwards.
Read back owner/member roles and forum state, create one test topic with `topics create`, then run
the approved forum send checks. A migration is retained and not rolled back to a basic group.
If stage two fails, inspect the new peer before continuing; do not migrate again blindly.
Topic creation is not a retryable send: after an unknown outcome inspect the topic list and never
repeat it, even with the same attempt id. The profile journal blocks reserved, sent and unknown
creation ids; a different profile or lost journal does not provide this protection.
