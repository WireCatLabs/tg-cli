### Fixed

- **The agent skill says where the sender and the chat go in each search.** `search conversations` takes
  `--filter 'from:me'`; `search messages` takes no `--like`, `--chat` or `--filter`, and `from:me` and `chat:<chat>`
  go in its query. The skill's short description now also names `--like` and `messages context <hit ref>`, for an
  agent that starts from the description without opening the skill.
