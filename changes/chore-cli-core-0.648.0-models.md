### Changed — may break callers

- **Local only keeps every model call on this computer** (cli-core 0.648.0). With the switch on
  (`memo models local-only set on`), tg's model calls, remote embeddings and OpenAI transcription refuse any address
  that is not this computer before anything is sent (`local-only.refused`).
- **Plain http goes only to this computer, for every model call.** Enrichment, search harder, linking, reply drafts,
  attachment OCR and remote embeddings refuse an `http://` address on another machine (`model.address-refused`); use
  https, or run the model on this computer.
- **Voice messages are heard by the downloaded model first.** `auto` uses the local speech model when it is downloaded
  and asks Telegram only when it is not, and never under local only.
