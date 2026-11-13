### Fixed

- **`TG_READ_ONLY` lets Telegram's search through** (cli-core 0.650.0). The lock promises "can read and sync but never
  send", yet `search messages --backend server` failed with `permission_error` and the default `--backend both`
  dropped the server without a word. Reads that only fetch from Telegram or work locally now pass the lock
  ([#874](https://github.com/WireCatLabs/tg-cli/issues/874)); catch-up for local search too
  ([#872](https://github.com/WireCatLabs/tg-cli/issues/872)).
- **An archive-only search over a partly synced chat suggests Telegram's search** (cli-core 0.650.0): `next` leads
  with the same query and `--backend server` ([#873](https://github.com/WireCatLabs/tg-cli/issues/873)).

### Changed — may break callers

- **`contacts context` and `contacts prepare` answer `meetings[]`** (cli-core 0.650.0): the recorded calls of that
  person, from a meetings CLI that shares the store. A caller that checks the answer against a pinned schema updates
  it.

### Security

- **The update check and model calls reach only their own host** (cli-core 0.650.0). A redirect to another host is
  refused, and each exchange has a deadline.
- **A run with moved folders removes nothing in the owner's folders** (cli-core 0.650.0). With only `TG_CONFIG_DIR`
  moved, `account remove` deleted files in the owner's real state folder, and `--delete-data` purged the account from
  the owner's store. Now each is kept, with its reason under `kept`.
