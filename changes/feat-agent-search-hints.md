### Fixed

- **An agent asked a question about the owner's Telegram history now finds the search by meaning.** The installed
  skill's description says it answers any question the owner's chats could answer (who said, advised or sent what; a
  past message, link, price or decision), even when the question does not say Telegram, and names
  `search conversations` as the first step; trap 5 now starts with it. The first screen (`tg --help`,
  `tg <profile> --help`) lists `search conversations "<question>"` next to `search all`; the `TG_READ_ONLY=1` line
  left it, as `schedule agent` and `mcp serve --permission` say the same. In a test where an agent had ten
  calls opened the skill in 1 of 32 sessions and ran `search conversations` in 1
  ([#896](https://github.com/WireCatLabs/tg-cli/issues/896)).
- **An option an agent guesses fails with the form that runs** (cli-core 0.672.0). `--chat`, `--around`, `--since`,
  `--after`, `--until`, `--before` and `--only` on `search all`, `search messages`, `search notes`,
  `search conversations` and `messages list`, `show` and `context` now say in one line what to type instead
  (`chat:<chat>` in the query, `messages context <hit ref>`, `date>=…` or `--since-time`, `--after-n`). Before, the
  error was a bare "unknown option", or named an unrelated option (`--since` → `--source`).
