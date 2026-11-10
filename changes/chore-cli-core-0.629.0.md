### Changed — may break callers

- **Built on cli-core 0.629.0** (was 0.624.0). The store moves to version 62 on first open: each person's kind is kept
  on the person, and saving a chat's members leaves the rows of members who stayed, so memo's `people list` filters,
  counts and pages in SQL. A tool on an older cli-core that saves members clears the kept kinds, so tg, max and memo
  move together. What changed in between is in
  [cli-core's changelog](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
