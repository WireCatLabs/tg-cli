### Changed — may break callers

- **`tg messages sync --all` leaves out the chats you muted.** An account with many muted groups no longer downloads
  them all. The answer counts them in `limited.muted`, and a note says how to read them. Messages already stored stay,
  and a chat you name (`tg messages sync <chat>`) or keep with `--full-history` is read as before. To read muted chats
  again, pass `--with-muted` for one run, or set `tg config set history_muted true`. From cli-core 0.619.0 (was
  0.618.0).
- **EmbeddingGemma is the default text model for search by meaning**, not e5-small. A computer that already has
  e5-small and not EmbeddingGemma keeps e5-small. `tg models download` no longer asks to accept its terms;
  `--accept-terms` is ignored.
- **`tg contacts link` run by an agent proposes the link instead of making it, and needs `--reason`.** Only the
  owner decides; an agent's `tg contacts unlink` is refused.
