### Fixed

- **The skill no longer keeps agents on the local copy.** For an agreement or a document it said "search the local
  archive", and agents added `--backend archive`, so a message older than the synced history came back "not found"
  although Telegram's own search had it. The skill now searches the archive and Telegram together, keeps
  `--backend archive` for an owner who asked that nothing leaves the machine, and, when a search finds nothing in a
  partly synced chat, tries the server before a sync ([#873](https://github.com/WireCatLabs/tg-cli/issues/873)).
