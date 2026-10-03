# Telegram Bot API specification

`api.json` is the MIT-licensed JSON specification from
[PaulSonOfLars/telegram-bot-api-spec](https://github.com/PaulSonOfLars/telegram-bot-api-spec),
pinned at the revision in `source.json`. The [official API](https://core.telegram.org/bots/api)
is the protocol reference. Keep the upstream licence with the snapshot.

`effects.json` explicitly classifies every method; generation stops for a new or removed method.
getUpdates is destructive because offsets acknowledge or forget updates. Credential-return
methods are marked sensitive and must never print their token. Financial mutations and irreversible
removals are guarded as destructive. No method is classified from its name during generation.

Generate and check offline with `pnpm bot:generate` and `pnpm bot:generate:check`.
Only the source adapter lives here; all generators come from cli-core.

The npm package includes `spec/bot/LICENSE` because generated artifacts derive from this snapshot.
