# Helper modules take a Pick<TelegramClient, …>

- Telegram logic outside `adapter.ts` is exported `async` functions whose first argument is `client: Pick<TelegramClient, "a" | "b">` (aliased `type Client`).
- Raw TL calls are fine there; rebuild objects with `PeersIndex.from(answer)` and `new TgMessage(raw, peers)`.
- Ids come in as `Number(chatId)` and go out as `String(getMarkedPeerId(...))`.
- Test seams (`wait`, `fetch`) are parameters with real defaults.

**Why:** A narrow client type documents what the helper touches and makes a fake client small.

**Open:** `map.ts` says it is the only file that knows mtcute's shapes, yet helpers read raw TL — is "map.ts only" about conversion to domain models?

See: `src/telegram/send-as.ts:5` · `src/telegram/comments.ts:396-419` · `src/telegram/upload.ts:342-346`
