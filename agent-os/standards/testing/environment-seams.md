# Every side effect comes in through Environment and run()

- Anything outside the process (adapter, keyring, systemctl, fetch, npm, clock, spawn, stdin, TTY) is an optional field on `Environment` / `UpdateEnvironment` with a `/** Tests hand in … */` doc.
- Production code uses `environment.x ?? realThing`; commands read it with `environmentOf<Environment>(command)`, never `process.*`.
- A new side effect gets a new field, not a module mock; command tests use `vi.mock` only for the browser and registration modules.
- CLI-wide rules are one `it.each` over `describeProgram(createProgram())` with `PLACEHOLDER` / `CONFINED` tables.

**Why:** Tests never touch the real machine, and the seam list shows every effect a command has.

**Open:** Must a new command add its `PLACEHOLDER` / `CONFINED` entry rather than be skipped?

See: `src/commands/context.ts:27-39` · `src/update.ts:386-406` · `src/contract.test.ts:16-66`
