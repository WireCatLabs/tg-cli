# Backlog notes

Long bodies of backlog items, moved here verbatim so [BACKLOG.md](BACKLOG.md) stays short.

## TG-9

**Setup JSON alignment** (WC-OUT-9, WC-OUT-11, WC-OUT-12): rename `setup`'s `item.next` command map
to `item.commands`, reserving envelope `next` for structured continuation steps. Keep login details under
`item.session`, as WhatsApp's standards alignment does; move this answer construction into cli-core when the
whole setup wizard is shared. Source: `src/commands/setup.ts:182`. The shared package currently owns only
screen/prompt helpers, not the answer. No runtime change is included in this backlog entry.
