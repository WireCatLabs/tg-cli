# Measured Telegram behaviour is a dated comment

- Code that relies on live behaviour that differs from mtcute or the docs gets `// Measured YYYY-MM-DD: <what was observed>` right above it.
- Behaviour taken from other clients is credited by name and marked unmeasured until the first real run.
- Protocol facts cite `core.telegram.org/api/...` inline.
- These are why-comments, so they stay even though comments are otherwise sparse.

**Why:** The next reader can tell an observed fact from a guess, and when it was true.

**Open:** When the behaviour changes, update the line in place or add a new dated line?

See: `src/telegram/errors.ts:175` · `src/telegram/send-as.ts:23` · `src/telegram/registration.ts:76-81`
