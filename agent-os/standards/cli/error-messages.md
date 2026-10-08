# Error messages carry the next command

- Every `CliError` names the exact command that fixes the problem, in backticks, built with `` `tg ${asFirstWord(profile)}…` `` so it works for any profile.
- Where agents may hit it, add "agents: read `tg skill show`".
- Lower case, `—` before the fix, no final period; interactive needs say "run it in a local terminal".

**Why:** A person or an agent can copy the fix and run it as is.

**Open:** Is this tg-only, or should it move to the cli-messaging standard for both CLIs?

See: `src/commands/context.ts:64-80` · `src/commands/proxy-config.ts:303-311` · `src/commands/setup.ts:127`
