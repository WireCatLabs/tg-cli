# Error text never repeats what was typed

- `toCliError` puts only the RPC error's name (`error.text`) in a message, never a parameter the caller passed.
- mtcute `MtArgumentError` messages are matched by their start (`ARGUMENT_KINDS`) and replaced with fixed wording; the original is dropped.
- A refusal whose name tells a person nothing goes in `EXPLAINED` as `[ErrorCode, sentence]`, naming the next `tg …` command where one exists.
- Proxy errors go through `hidden()`; site errors through `siteSays()` (one line, at most 200 characters).

**Why:** The text can quote a chat title or other people's words, and errors reach logs and run records (`errors.ts:131-134`, `:173-174`).

**Open:** Is it privacy only, or also keeping error text stable for scripts that branch on it?

See: `src/telegram/errors.ts:29-73` · `src/telegram/proxy.ts:300` · `src/telegram/registration.ts:190-192`
