### Added

- **Cancel, edit and send now a scheduled message.** `tg personal messages scheduled cancel "Book club" 12` cancels
  it, `tg personal messages scheduled edit "Book club" 12 "new text"` changes the text (add `--at-time 2h` to move
  it too, or give only `--at-time` to move it), and `tg personal messages scheduled send "Book club" 12` sends it
  right away. Before, `tg` could schedule and list, and the owner cancelled a post in the Telegram app. Telegram
  numbers scheduled messages apart from sent ones: `messages edit` on a scheduled id failed with
  `MESSAGE_ID_INVALID`, and `messages delete` with the same number would have deleted an old group message. The new
  commands take only the ids `messages scheduled <chat>` lists and check each against that list first. Cancelling
  asks as a delete does at an `ask` level (`--allow-dangerous`). On cli-core 0.714.0.
