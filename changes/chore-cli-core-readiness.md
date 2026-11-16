### Changed — may break callers

- **`projects evidence` and `projects status` take `--purposes`** for the list of purposes to read (cli-core 0.674.0;
  tg now builds on 0.675.0, was 0.672.0). `--purpose` still works but is hidden and goes away in a later version.
- **The store moves to version 67** on its first open (cli-core 0.674.0): a log of removed facts that keeps no fact
  text, and a phone call's fields on a meeting. Like every store migration it only goes forward.

### Fixed

- **`search conversations` answers in seconds on a large store** (cli-core 0.675.0). Working out which chats changed
  since their last build read every chunk of the store once per chat. On a store with about 950,000 messages a warm
  search went from about 12 s to about 3 s. `conversations status` and `conversations embed` are faster too.
- **`--from` on a search names the sender, not a date** (cli-core 0.675.0). `search messages`, `search all` and
  `search conversations` answer `--from`, `--sender` and `--author` with `from:<sender>` in the query (in `--filter`
  for conversations); `from:me` finds what you wrote.
