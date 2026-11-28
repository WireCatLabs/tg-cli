### Fixed

- **A bot that writes to you is saved as a bot.** Synced messages now say when their sender is a Telegram bot, so
  the store files the bot under Bots, not People. It takes effect with the cli-core release that reads the flag
  ([#932](https://github.com/WireCatLabs/tg-cli/issues/932)).
