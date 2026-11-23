### Fixed

- **`search conversations --like` shows the part of a huge conversation that answers the question** (cli-core
  0.734.0; tg now builds on it, was 0.718.0). A conversation of more than 50 chunks holds text near any question, so
  its nearest chunk was often about something else. With a made-up reply, such a hit now shows the chunk that ranks
  best by meaning and by the words that are rare inside that conversation. Without `--like` nothing changes.
- **A usage error says how to fix the call** (cli-core 0.734.0). An unknown flag that a sibling command takes names it
  (`unknown option '--like' — --like is an option of search conversations`), `--filter` on `search messages` says the
  filter goes in the query, and a query that fails after `--` says to put options before `--`.
- **The store moves to version 72** on its first open (cli-core 0.722.0). Like every store migration it only goes
  forward.
