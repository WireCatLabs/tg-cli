### Changed — may break callers

- **The agent skill is a short core plus reference files, so an agent that opens it carries about 2,200 tokens, not
  12,000.** `skills/tg-cli/SKILL.md` went from 50,048 to under 9,000 bytes. It now holds the profile rule, the path for
  answering a question from the chats, reading and sending, the boundaries, output and exit codes, and one line per
  reference saying when to read it. Everything else, with no rule dropped, moved to `skills/tg-cli/references/`
  (`search`, `messages`, `history`, `tasks`, `people`, `stats`, `files`, `setup`, `mcp-and-bots`). The full skill
  rode in every later turn of an agent's session: in a timed agent test the median input per turn rose from about
  31,000 to 47,000 tokens, and half the sessions ran out of time. `tg skill install` now copies the whole folder,
  `tg skill show <name>` prints one reference (`tg skill show search`), and the MCP server serves each one at
  `tg://skill/references/<name>.md` (cli-base 0.106.0, cli-core 0.681.0). A script that read only SKILL.md for
  a rule should read the reference its index names.
