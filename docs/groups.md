# Groups you run

`tg` helps the admin of a group: it shows the questions nobody answered, who joined and who added
them, and what a week in the group came to. It reads without marking anything read, so checking on a
group does not tell its members you looked.

Everything here works from your personal account. The commands in full:
[usage.md](usage.md#groups-and-channels); every option: [commands.md](commands.md).

## With an agent

An agent with a terminal (Claude Code, Codex) needs the [skill](recipes.md#once-first);
one without (Claude Desktop, Cursor) needs the [MCP server](mcp.md). Below: what you say, what the
agent calls, and what you get back.

### An admin's morning: who is waiting for an answer

```text
You:    What is still unanswered in "Hiking"?
Agent:  (tg review --chat "Hiking" --unanswered 4h --json)
        Unanswered for more than 4 hours — 3 questions:
        · Lena, 08:12 — "What time do we leave on Saturday?"
        · Artem, yesterday 22:40 — a reply to your post about the route: "Are the tents shared?"
        · Ira, yesterday 19:05 — "Who brings the pot?"
        You or the admins answered the rest.
```

A question is a message with `?` in it, or a reply to you or to an admin; a `?` inside a link does not
count. It is answered when you or an admin replied to it, or were the next to speak after the person
who asked. When Telegram does not say who the group's admins are, only your answers count, and the
command says so.

### Newcomers this week

```text
You:    Who joined "Hiking" this week?
Agent:  (tg chats events "Hiking" --type join,add --json)
        Five people:
        · Kate — added by Lena, Tuesday
        · Oleg — joined by the link, Wednesday
        · …
```

`chats events` reads the group's service messages, so it sees what Telegram kept in the chat's
history: who joined, left, was added or removed, and by whom. `tg chats members list` gives everyone
in the group with their role and when they were last seen.

### A link that leaked

```text
You:    The invite link to "Hiking" ended up in a public chat. Replace it, and stop members adding people.
Agent:  (tg chats link reset "Hiking" --json)
        (tg chats update "Hiking" --only-admins-add on --json)
        Done: the old link no longer works, the new one is https://t.me/+…, and only admins can add
        people now.
```

`link reset` answers the group as it now stands, new link included; `chats update` answers the same,
so the agent can say what changed without reading the group again.

### A weekly report

```text
You:    Sum up the week in "Hiking".
Agent:  (tg review --chat "Hiking" --since-time 2026-09-20T00:00 --json)
        Decided: we leave on 4 October, at 7:00 from the station.
        Taken on: Lena — food, Artem — tents.
        Open: who brings the pot — asked three times, no answer.
```

### On a schedule

No agent is needed for a list of open questions: it is an ordinary command.

```cron
0 9,21 * * * tg review --chat "Hiking" --unanswered --json >> ~/hiking-open.jsonl 2>> ~/tg-cron.log
```

cron has no terminal and often no `XDG_RUNTIME_DIR`, without which `tg` cannot reach the keyring:
[recipes.md](recipes.md#running-on-a-schedule).

## What there is

| Command | What it does |
|---|---|
| `tg review --chat <chat> --unanswered [duration]` | questions you and the admins have not answered for that long — `4h`, `1d`; 24 hours by default |
| `tg chats events <chat>` | who joined, left, was added or removed, and by whom; 7 days by default |
| `tg chats members list <chat>` | everyone in the group, with their role and when they were last seen |
| `tg topics list\|search <chat>` | a forum group's topics |
| `tg topics enable <chat>` | enable a forum; a basic group requires `--upgrade --yes` and returns a new chat id |
| `tg topics create <chat> <title>` | create a topic; after an unknown outcome check `topics list` instead of repeating |
| `tg messages send <chat> <text> --topic <id>`, `tg polls create <chat> <question> <answers> --topic <id>` | send a message or poll into a forum topic |
| `tg chats inspect <link>` | where an invite or public link leads; joins nothing |
| `tg chats create <title> [person...]` | a new group (a supergroup), or a channel with `--channel` |
| `tg chats join <link>`, `tg chats leave <chat>` | join by a link, leave |
| `tg chats update <chat>` | the title, the description, and whether members may pin (`--all-can-pin`) or add people (`--only-admins-add`) |
| `tg chats members add\|remove <chat> <person...>` | add people (they are told; who could not be added is named) or remove them (their messages stay) |
| `tg chats admins add <chat> <person> --can <rights>` | make a member an admin with these rights: members, admins, info, pin, link, post, edit, delete |
| `tg chats admins remove <chat> <person>` | take an admin's rights back; they stay a member |
| `tg chats link show\|reset <chat>` | the invite link; `reset` makes a new one and the old one stops working |
| `tg messages delete --for-everyone`, `pin`, `unpin` | delete for everyone, pin |

An agent without a terminal gets the reading half as MCP tools: `tg_review` with `unanswered`,
`tg_chats_events`, `tg_chats_members`, `tg_chats_inspect` ([mcp.md](mcp.md)).

`create`, `join`, `leave`, `update`, `link reset`, `members` and `admins` change something the
group's members see: a new group tells the people added, and a join or a leave shows in the chat. Each goes through the profile's permissions and the
send guard, and each person added counts toward the hourly limit
([security.md](security.md#the-send-guard)).

## What waits on you

`review` and `serve` keep a list of tasks in the local store. A question nobody answered, and a message
that mentions you by name, opens a task; your answer closes it. A task points at its message and never
copies it.

```sh
tg tasks list --state open                                # what waits on you, oldest first
tg tasks list --chat "Hiking" --type question,mention
tg tasks add msg:telegram/<you>/<chat>/<message> --type promise   # what the rules cannot see
tg tasks close <task> --as dismissed --reason no-reply-needed
tg stats tasks show                                            # open per chat, the oldest, the median time to close
```

A closed task stays closed, and a dismissed one never comes back. Only your own answers close a
task — an admin's do not — and a mention by `@username` is not seen. An agent gets the same as
MCP tools: `tg_tasks_list`, `tg_tasks_add`, `tg_tasks_close`, `tg_stats_tasks_show` ([mcp.md](mcp.md)).

## Rules

A group's rules say what `tg chats moderate` looks for and what it may do about it. They live in a
file of this profile, never in Telegram, and nothing watches the group in the background: a rule acts
only when you run `chats moderate`.

```sh
tg chats rules show "Hiking"                       # the defaults, marked not saved, until the first change
tg chats rules set "Hiking" links delete           # a message with a link is deleted
tg chats rules set "Hiking" blocked 12345,67890    # these people…
tg chats rules set "Hiking" blockedPeople remove   # …are removed when they write or join
tg chats rules set "Hiking" consent.delete allow   # delete without asking
tg chats moderate "Hiking" --dry-run               # what it would do, doing nothing
tg chats moderate "Hiking"                         # judge what is new since the last run, and act
```

| Rule | What it looks for |
|---|---|
| `links`, `invites`, `forwards` | a message with a link, an invite link to another group, a forwarded message |
| `blocked`, `blockedNames`, `blockedPeople` | people by id or by part of their name, and what to do with them |
| `flood.messages`, `flood.minutes`, `flood.action` | more than so many messages from one person within so many minutes |
| `trusted` | people never acted on; the group's admins and you never are either |

Each rule's action is `report`, `delete` or `remove`. Whether a `delete` or a `remove` happens
is the group's level for it, `consent.delete` and `consent.remove`: `deny` never, `readonly` only
reports, `ask` asks you about each one (the default; `--allow-dangerous` says yes to all), `allow`
does it. Every action still goes through the send guard and its hourly limit, and a run stops after
`--max-actions` (10). The next run starts where this one stopped; `--since-time` looks at a moment
of your own and leaves that point where it is.

Over MCP, `tg_chats_moderate` acts only where a level is `allow`; what asks is listed for you, not
done. `newAccount` is not offered: Telegram does not say how old an account is.

## Limits

- **Telegram's history is the record.** `chats events` and `review` see what the chat's history still
  holds; a service message an admin deleted is gone for them too.
- **Admins are known only where Telegram says.** Without them, `review --unanswered` counts only your
  answers, and says so.
- **Nothing watches a group by itself.** A check runs when you, an agent at your request, or your
  schedule runs it.
- **Telegram's rate limits apply.** Reading every member of a large group is many requests; a
  `FLOOD_WAIT` answer says how long to wait
  ([troubleshooting.md](troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).

## Statistics for group admins

```sh
tg stats chats show <chat> --since-time 7d --by day --timezone Europe/Madrid --json
tg stats chats show <chat> --offline --json
```

`tg stats chats show` counts messages, active senders, replies, threads, reactions and questions answered for
a period from the local store. `--by day` or `--by week` adds calendar rows; weeks start on Monday and
`--timezone` sets their timezone. Views, forwards and comments appear only where Telegram supplied the
counts and they were stored with the posts. A missing count does not mean zero. Reactions use stored
counts, without refreshing every post. Questions follow the same rules as `review --unanswered`.
These are locally computed figures; the command does not request Telegram's official admin statistics.

The online command also asks Telegram for join and leave events. `--offline` and MCP `tg_stats_chats_show`
omit `members`, the summary of those events. This differs from `memberCounts`: recorded daily snapshots
of the group's size, which remain available offline.

When `complete` is false, the available history is incomplete: totals cover only what was read, while
medians and proportions may differ from those for the whole group. The `fetch` field suggests a command
to download missing messages. Incomplete event history also limits join and leave counts. Even a full
message history cannot reconstruct past member profiles or daily rosters from before recording began.

### Member snapshots and changes

`tg chats members fetch` reads members into the local store, recording profiles, changes, the day's
member count and whether the read was complete. `--budget` caps pages. Nobody is recorded as having
left after a partial read: that requires reading the whole available list and a known group count
no greater than the number read. A larger budget cannot bypass Telegram's member-list limits.

`--track` adds the group to the tracking list. `chats tracking list` shows all tracked groups;
`show` shows one group's tracking state and daily counts for the last 30 days. `add` starts tracking
without fetching immediately; `remove` stops daily fetching and keeps the history already recorded.
While `tg serve` runs, it fetches tracked groups one at a time, starting its first round a minute after
connecting, and skips groups already fetched on the current UTC day. Tracking does not start `serve`;
if it was stopped for several days, the next run records a new snapshot rather than filling missed days.

`tg chats members history` shows recorded joins, leaves and profile changes, oldest first;
`--since-time` limits the period. It never asks Telegram. A join uses Telegram's join time when known,
otherwise the first time the person was seen. A leave is dated at the first complete snapshot without
them, rather than their exact departure. The first fetch records the initial roster: those people did
not necessarily join that day. `chats members list --offline` reads the last completely saved roster;
partial reads do not replace it. Without a complete snapshot, this list can be empty even though some
profiles and events have already been recorded.
Profiles and history stay in the local store alongside messages.

`tg chats members audit` lists members with bot-like signals and reasons; `--budget` caps pages and
`--min-score` sets the threshold. It removes nobody and excludes admins and the owner. `more` means
the list is partial, and `unknown` names unavailable signals. It is unavailable with `--offline`;
scores need human review. Telegram supplies bot, scam, fake, deleted, photo, join and inviter metadata
where available. “Never wrote” means no messages were found in the local history, not proof that the
person never wrote in the group.

`--deep <n>` also checks the top n members in full, one person a second: their profile, their oldest profile
photo, up to 1,000 stored messages each, and two public spam lists — Combot CAS and lols.bot. Each
member's id is sent to those lists. The full check lands in `check` on each of those members.

### A weekly report for your group

“Hiking Club” below is a fictional example group. Download its messages with `store fetch` first if
they are not already stored, then record the current roster and prepare the report:

```sh
tg chats members fetch "Hiking Club" --track --json
tg stats chats show "Hiking Club" --since-time 7d --by day --timezone Europe/Madrid --json
tg chats members history "Hiking Club" --since-time 7d --offline --json
tg chats tracking show "Hiking Club" --offline --json
tg chats members audit "Hiking Club" --json
```

Ask your agent to report messages, active senders, unanswered questions, membership changes and days
with member snapshots. Keep `complete`, `more`, `unknown` and gaps between snapshots visible in the
report. Keep `tg serve` running or repeat member fetches for future reports; the first report cannot
show departures that happened before the first recorded roster.
