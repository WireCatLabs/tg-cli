# One profile name per test

- The sandbox gives each test file one temporary folder; config, the send journal and the store carry over between tests.
- So each test passes its own profile first (`g-comment`, `g-open`) or a file-level constant.
- A test that needs its own store makes a fresh temp folder and passes `MESSAGING_STORE`.

**Why:** Open.

**Open:** Unique profiles over a fresh sandbox per test — for speed, or to keep shared state visible? Is the `g-` prefix a rule?

See: `src/send-guard.test.ts:111-192` · `src/sdk148-adoption.test.ts:10-25`
