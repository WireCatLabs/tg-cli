### Changed — may break callers

- **Built on cli-core 0.630.0** (was 0.624.0). The store moves to version 63 on first open. Each person's kind is
  kept on the person, and saving a chat's members leaves the rows of members who stayed, so memo's `people list`
  filters, counts and pages in SQL. People who wrote in a one-to-one chat or a small group now count as the owner's
  people, no rule joins anyone to the owner's person, and a name is matched across Cyrillic and Latin. A tool on an
  older cli-core that saves members clears the kept kinds, so tg, max and memo move together. What changed in between
  is in [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
