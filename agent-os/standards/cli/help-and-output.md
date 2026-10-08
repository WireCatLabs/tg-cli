# --help layout, and separate pretty and machine paths

- Every user-facing command adds `addHelpText("after", …)` in this order: Examples (aligned, with a `tg work …` profile example), setup or time notes, an "Agents: read `tg skill show`" paragraph, Windows notes.
- The action ends with `if (context.format !== "pretty") context.renderer.result(obj) else context.streams.data(text)`.
- The JSON object holds the facts; the pretty text is built from it.

**Why:** Machine output stays one stable value; the human view can change freely.

**Open:** Is the "Agents:" paragraph required on every command an agent may call? Should pretty output always go through `renderPretty`?

See: `src/commands/setup.ts:84-104` · `src/commands/session.ts:187-206` · `src/program.ts:280-298`
