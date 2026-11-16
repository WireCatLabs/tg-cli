### Fixed

- **An agent asked a question about the owner's Telegram history now finds the search by meaning.** The installed
  skill's description says it answers any question the owner's chats could answer (who said, advised or sent what; a
  past message, link, price or decision), even when the question does not say Telegram, and names
  `search conversations` as the first step; trap 5 now starts with it. The first screen (`tg --help`,
  `tg <profile> --help`) lists `search conversations "<question>"` next to `search all`; the `TG_READ_ONLY=1` line
  left it, as `schedule agent` and `mcp serve --permission` say the same. In Experiment B round 4 an agent with ten
  calls opened the skill in 1 of 32 sessions and ran `search conversations` in 1
  ([#896](https://github.com/WireCatLabs/tg-cli/issues/896)).
