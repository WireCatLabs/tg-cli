# Optional fields are spread in, never set to undefined

- Pass an optional value as `...(x === undefined ? {} : { x })`; never `{ x: undefined }`.
- Use `=== undefined` when a falsy value is valid (`signal`, `qrFile`); a truthiness check for objects (`keyring`, `fetch`).
- A small helper returning the optional object is fine (`proxyOption(through)`).

**Why:** Open — the compiler does not require it: `exactOptionalPropertyTypes` is off in cli-core's base tsconfig.

**Open:** Why this pattern (about 200 places) — style, a downstream library that checks `in`, or a plan to turn `exactOptionalPropertyTypes` on?

See: `src/commands/context.ts:60` · `src/commands/session.ts:125` · `src/program.ts:367-369`
