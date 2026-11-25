### Changed — may break callers

- **The MCP server no longer offers `schedule exec`, and it runs only a file in tg's own schedules folder** (cli-core
  0.736.0). An agent runs a saved schedule with `schedule run <name>`. Installed timers keep running.

### Fixed

- **`messages sync <chat> --full-history --background` reads the chat in full** (cli-core 0.752.0; tg now builds on
  0.753.0, was 0.734.0). The background job was started without `--full-history`, so a big group ended at once with
  `fetched: 0` and `limited: "group_too_large"`. The job now gets the flag, and `store jobs retry` keeps it
  ([#916](https://github.com/WireCatLabs/tg-cli/issues/916)).
- **A long sync stays fast as the chat grows** (cli-core 0.753.0). Each saved message looked through the whole chat
  for replies waiting for their thread's root, so a page of 100 took 78 ms at 10,000 stored messages and 919 ms at
  90,000. That search now runs once per page: 32 to 42 ms up to 60,000
  ([#917](https://github.com/WireCatLabs/tg-cli/issues/917),
  [benchmark](https://github.com/WireCatLabs/cli-testing/tree/main/performance/store/sync-growth)).
- **`messages download --output-dir` refuses credential folders, tg's own folders and the message store** (cli-core
  0.736.0), for one message, `--all` and `--offline`.
