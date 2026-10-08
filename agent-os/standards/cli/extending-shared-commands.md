# tg-only behaviour wraps shared commands, never forks them

- Wrap a shared command with `withX(command)` that adds `preAction` / `postAction` hooks.
- Stage side effects in a `pending` closure during `preAction`; run them in `postAction`, only after the shared action succeeded.
- Change wording in `program.ts`'s `configure` by finding the command or option and rewriting its description or help.

**Why:** The shared command stays one implementation for tg and max.

**Open:** When is patching shared wording in tg right, rather than changing it upstream in cli-messaging?

See: `src/commands/proxy-config.ts:276-325` · `src/program.ts:279-320` · `src/commands/update.ts:234-246`
