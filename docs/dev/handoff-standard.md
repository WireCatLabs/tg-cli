# The handoff standard

How a piece of work is handed from one agent to the next in tg-cli and cli-messaging. Modelled on
chitchat's `chitdocs/HANDOFF.md` and the owner's global rule; this file is its home here.

A handoff **collects context, it does not describe the task** — the task is already in the plan.
What the next agent lacks is orientation: it opens an empty context, pays for every file it reads
and every search it makes. **The measure is how many files it opens before its first edit, and how
many searches it needs to know where to look.** A handoff after which the agent goes grepping has
failed.

## Two kinds

| Kind | Where | Lifetime |
|---|---|---|
| **The project handoff** | [`HANDOFF.md`](../../HANDOFF.md) | one file, overwritten; never a log |
| **A task handoff** — a lane, a thread of work | [`docs/lanes/<lane>.md`](../lanes/), linked from [the lanes plan](../../../cli-messaging/docs/plans/2026-09-29-parity-lanes.md) | lives as long as the lane; **read instead of** the project handoff |

## Five blocks, in this order

1. **What this is** — three or four sentences and a link to the full description. Not a retelling.
2. **Entry points** — the plan, the backlog, the rulings, the map: where each is, **as links**. If a
   map exists already, the handoff points at it rather than repeating it.
3. **What to read for this task** — files **in reading order**, and against each **the question it
   answers**, not what it contains. Five files is good; twenty means the task is not cut small enough.
4. **What will bite** — what a search will not find: broken assumptions, hidden links, tool traps.
   The most valuable block, and the only one that exists nowhere else. Numbered, so it can be cited.
5. **What not to read or touch** — as a list. It saves more than any block above.

A task handoff adds, after block 3:

- **The work, in order** — one row per PR, each **done when** a stated check passes.
- **Decisions you will make yourself** — named, so they are made knowingly and not assumed to be
  made already.
- **How to check it is done** — the whole command, to copy and run, and how to reach the live
  account (read-only unless the row says otherwise).

## Rules

- **Link, never copy.** Two homes for one fact is the failure all of this exists to prevent. The
  urge to paste a ruling or a plan into a handoff is the signal to link it.
- **A file path answers a question.** "`foo.ts`, `bar()` — here is the rule for X" helps; "`foo.ts`
  — the bar component" does not.
- **No history.** How we got here is in commits and PRs; the handoff names them only when a trap
  needs the evidence.
- **Two halves age differently.** "Where things stand" is a snapshot and goes stale in hours — date
  it. "What will bite" is durable — extend it, never replace it.
- **Correct in place.** A claim that turns out wrong is fixed where it stands, with the date, so the
  next agent does not rediscover it.
- **Ids.** Decisions are `NEED-n` from the one project list (the proposal §11 and HANDOFF.md §5 hold
  the rulings); the next free number is one above the highest there. Never reuse one.

## When a lane ends

Its handoff's "what will bite" items that outlive the lane move into [`HANDOFF.md`](../../HANDOFF.md)
§4; the lane's row in the lanes plan is marked done; the handoff file stays as the record.
