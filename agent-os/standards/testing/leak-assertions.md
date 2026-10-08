# Synthetic markers, and a check that they don't leak

- Test data is visibly fake (`synthetic text ${id}`); content that must stay hidden carries a unique marker (`consumerocrneedle`).
- Assert the marker or secret is absent from output and errors: `.not.toContain(needle | token)`.
- Use the marker positively to prove content was found by the expected route.

**Why:** Proves the no-real-data rule actively, not by convention.

**Open:** Should every feature that handles message text, tokens or file contents ship a does-not-leak assertion?

See: `src/testing/scripted.ts:35` · `src/attachment-ocr-adoption.test.ts:82-95` · `src/bot-api.test.ts:102-112`
