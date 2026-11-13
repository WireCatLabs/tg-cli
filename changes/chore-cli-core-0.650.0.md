### Fixed

- **`TG_READ_ONLY` lets Telegram's search through** (cli-core 0.650.0). The lock promises "can read and sync but never
  send", yet `search messages --backend server` failed with `permission_error` and the default `--backend both`
  dropped the server without a word. Reads that only fetch from Telegram or work locally now pass the lock
  ([#874](https://github.com/WireCatLabs/tg-cli/issues/874)); catch-up for local search too
  ([#872](https://github.com/WireCatLabs/tg-cli/issues/872)).
- **An archive-only search over a partly synced chat suggests Telegram's search** (cli-core 0.650.0): `next` leads
  with the same query and `--backend server` ([#873](https://github.com/WireCatLabs/tg-cli/issues/873)).
