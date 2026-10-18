# Groups you run

Use this page when you are an admin of a Telegram group and want help keeping it in order. You
will learn how to find questions nobody answered, see who joined and who added them, sum up a week,
remove spam by your own rules and keep a history of the member list. Reading marks nothing read,
so checking on a group does not tell its members you looked.

Everything here works from your personal account, in groups where you are an admin. Some words on
this page:

- **An admin** is a member with rights to manage the group. Some commands count only your answers
  and the admins' answers.
- **The local store** is the copy of messages that `tg` keeps on this computer. Reports and tasks
  use it, so they see only what was downloaded.
- **A task** is something that waits on you, such as a question nobody answered. `tg` opens and
  closes tasks in the local store.
- **Rules** say what `tg personal chats moderate` looks for, such as links or flooding, and what it may do.
- **A member snapshot** is the member list saved on one day. Snapshots over time show who joined
  and who left.

## What you can do

| Task | Command |
| --- | --- |
| Find questions that wait for an answer | `tg personal review --unanswered` |
| See who joined, left, was added or removed | `tg personal chats events` |
| Sum up a week: decisions, promises, open questions | `tg personal review 'date>7d'` |
| Keep a list of what waits on you | `tg personal tasks list` |
| Remove spam by your own rules | `tg personal chats rules set`, `tg personal chats moderate` |
| Replace a leaked invite link | `tg personal chats link reset` |
| Let people in, or turn them away | `tg personal chats requests list\|accept\|decline` |
| See the week's activity and Telegram's own statistics | `tg personal stats chats show`, `tg personal stats chats official` |
| Save the member list every day | `tg personal chats members fetch --track` |
| Find members that look like bots or spammers | `tg personal chats members audit` |

The full list of group commands is [below](#what-there-is). Details of each command are in
[groups and channels in the usage guide](usage.md#groups-and-channels); every option is in the
[command reference](commands.md).

## With an agent

Your AI agent (for example Claude Code, Codex, Cursor or Gemini CLI) can run these checks for you.
An agent with a terminal needs the [tg skill](recipes.md#once-first); an agent in an app without a
terminal needs the [MCP server](mcp.md). Below: what you say, what the agent runs, and what you get
back.

The names, messages and results below are fictional. Commands are separate from the answer: the agent reads the data and presents it for you.

### An admin's morning: who is waiting for an answer

Start with questions that have been waiting for you or the admins.

**Your request:**

> What in Hiking has been waiting for an answer for more than four hours?

**Command:**

```sh
tg personal review 'chat:Hiking' --unanswered 4h --json
```

**Example agent answer:**

> **3 questions are waiting for an answer.**
>
> | Person | Question | Waiting |
> | --- | --- | --- |
> | Lena | What time do we leave on Saturday? | 6 hours |
> | Sam | Are the tents shared? | 12 hours |
> | Ira | Who will bring the cooking pot? | 15 hours |
>
> Open a question to check the surrounding conversation.

These are `review` rules: a question mark outside a link, or a reply to you/an admin, can open a question. Your or an admin’s reply or next message can close it. The [statistics report](rankings.md) counts linked direct answers and can give a different result. If Telegram does not expose the admin list, only your answers count and the result says so.

### Newcomers this week

Review joining events. A new account is a reason to check, not proof of spam.

**Your request:**

> Who joined Hiking this week? Show anyone worth reviewing.

**Command:**

```sh
tg personal chats events "Hiking" 'time>=7d' --json
```

**Example agent answer:**

> | Newcomer | How they joined |
> | --- | --- |
> | Kate | Added by Lena |
> | Oleg | Joined himself |
>
> Review Oleg’s available profile information before drawing conclusions. Account age alone is not grounds for removal.

Events cover available history only. The current member list can be checked separately.

### A link that leaked

Replace an invite link only when you have asked for that change.

**Your request:**

> The Hiking invite link leaked. Replace it and let only admins add people.

**Replace the link:**

```sh
tg personal chats link reset "Hiking" --json
```

**Restrict member additions:**

```sh
tg personal chats update "Hiking" --only-admins-add on --json
```

**Example agent answer:**

> | Setting | Result |
> | --- | --- |
> | Previous invite link | Replaced |
> | Who can add members | Admins only |
>
> The new private link is in the requested result; share it only with intended recipients.

These commands change the group. The example request authorises both changes; a request to inspect a link would not.

### Spam cleanup with your approval

First see what the rules suggest, without any action.

**Your request:**

> Check Hiking for spam. Do not delete anything yet; show the suggestions.

**Command:**

```sh
tg personal chats moderate "Hiking" --dry-run --json
```

**Example agent answer:**

> **Suggested action:** delete a message with an invite link.
>
> | Found | Suggestion | Status |
> | --- | --- | --- |
> | Invite link | Delete the message | Preview only |
>
> Nothing was deleted. Confirm the exact message if you want the action applied.

Real actions need your request and the profile's permissions. A preview does not give permission to delete.

### A weekly report

Ask for a short recap of decisions, commitments and open questions.

**Your request:**

> Summarise the week in Hiking.

**Command:**

```sh
tg personal review 'chat:Hiking date>7d' --json
```

**Example agent answer:**

> **Decided:** leave at 7:00 from the station.
>
> **Committed:**
>
> - Lena — food.
> - Sam — tents.
>
> **Still open:** who will bring the cooking pot.
>
> I can show the source messages if you want to verify the recap.

### On a schedule

No agent is needed for a list of open questions: it is an ordinary command.

```cron
0 9,21 * * * tg personal review 'chat:Hiking' --unanswered --json >> ~/hiking-open.jsonl 2>> ~/tg-cron.log
```

cron has no terminal and often no `XDG_RUNTIME_DIR`, without which `tg` cannot reach the keyring:
see [running on a schedule](recipes.md#running-on-a-schedule).

## What there is

| Command | What it does |
|---|---|
| `tg personal review 'chat:"<chat>"' --unanswered [duration]` | questions you and the admins have not answered for that long — `4h`, `1d`; 24 hours by default |
| `tg personal chats events <chat>` | who joined, left, was added or removed, and by whom; 7 days by default |
| `tg personal chats members list <chat>` | everyone in the group, with their role and when they were last seen |
| `tg personal topics list <chat>`, `tg personal search topics <chat> <text>` | a forum group's topics; search finds them by title |
| `tg personal topics show <chat> <id>` | one topic: title, closed or pinned, unread count, last activity |
| `tg personal topics enable <chat>` | enable a forum; a basic group requires `--upgrade --yes` and returns a new chat id |
| `tg personal topics create <chat> <title>` | create a topic; after an unknown outcome check `topics list` instead of repeating |
| `tg personal messages send <chat> <text> --topic <id>`, `tg personal polls create <chat> <question> <answers> --topic <id>` | send a message or poll into a forum topic |
| `tg personal messages forward <chat> <message> --to <forum> --topic <id>` | forward a message into a topic of the `--to` forum |
| `tg personal chats inspect <link>` | where an invite or public link leads; joins nothing |
| `tg personal chats create <title> [person...]` | a new group (a supergroup), or a channel with `--channel` |
| `tg personal chats join <link>`, `tg personal chats leave <chat>` | join by a link, leave |
| `tg personal chats update <chat>` | the title, the description, and whether members may pin (`--all-can-pin`) or add people (`--only-admins-add`) |
| `tg personal chats members add\|remove <chat> <person...>` | add people (they are told; who could not be added is named) or remove them (their messages stay) |
| `tg personal chats admins add <chat> <person> --can <rights>` | make a member an admin with these rights: members, admins, info, pin, link, post, edit, delete |
| `tg personal chats admins remove <chat> <person>` | take an admin's rights back; they stay a member |
| `tg personal chats link update <chat> <link> --approval\|--no-approval --expire-time <time> --max-uses <n>` | change only the supplied approval, expiry or usage limit of your extra invite link; supply at least one change |
| `tg personal chats link show\|reset <chat>` | the invite link; `reset` makes a new one and the old one stops working |
| `tg personal chats requests list\|accept\|decline <chat>` | requests to join a group that needs an admin's approval: who asked, let them in, turn them away; `--all` answers every request |
| `tg personal chats rules show\|set\|unset <chat>` | the group's rules |
| `tg personal chats moderate <chat>` | check the group by its rules; does what the rules allow |
| `tg personal messages delete --for-everyone`, `pin`, `unpin` | delete for everyone, pin |

Only the group owner can enable topics. An existing supergroup needs no upgrade. Upgrading a basic
group gives it a new chat id; the local store keeps older messages under the original id and does not
merge the two histories.

In a forum topic, text, photo and file captions and scheduled sends all keep the topic, and an explicit
reply must belong to that topic. A closed or missing topic is refused before anything is sent. When the
outcome of a send is unknown, repeat it with the same `--operation-id`, chat and topic; for a scheduled send,
check `tg personal messages scheduled <chat>` instead of repeating it.

An agent connected over the [MCP server](mcp.md) can run the same commands, as far as the
profile's permissions allow.

`create`, `join`, `leave`, `update`, `link reset`, `members` and `admins` change something the
group's members see: a new group tells the people added, and a join or a leave shows in the chat. Each goes through the profile's permissions and the
send guard, and each person added counts toward the hourly limit
(see [the send guard](security.md#the-send-guard)).

## What waits on you

`review` and `serve` keep a list of tasks in the local store: what you have to do, and what someone owes you.
A task points at its message and never copies it. Where a rule opens one:

- **A one-to-one chat:** a question you did not answer, and a message that mentions you.
- **A group:** only a question that replies to your message, and a mention of you. Other people's questions
  are not your tasks.
- **A channel or Saved Messages:** nothing.

Your answer closes the task. To record every question in a group, whoever it is for, tag the group:

```sh
tg personal tags add --chat <group> watch-tasks
tg personal tags remove --chat <group> watch-tasks
```

In a tagged group, every question you did not answer opens a task — a message with a question mark,
or a reply to yours. Only new messages count; for older ones use `tasks scan`. A request or a promise
without a question mark is not a rule's task: your agent adds it with `tasks add`. Your answer closes
the question, and so does a reply to it from any member other than the one who asked. A later message
that does not reply to the question closes nothing; you or your agent close that task. Tag only groups
where the answers are yours to give.

The first sync of an account opens no tasks from your history; later syncs open tasks from new messages. To
turn a chat's history into tasks, list what would open, then open it:

```sh
tg personal tasks scan <chat>
tg personal tasks scan <chat> --last 300 --yes
```

`config set task_first_pass_per_chat <n>` lets the first sync open up to n tasks per chat.

When someone promises you something, keep it as their task, and list what others owe you:

```sh
tg personal tasks add msg:telegram/<you>/<chat>/<message> --type promise --category other --assignee sender
tg personal tasks list "assignee:any state:open"
```

`--assignee sender` is whoever sent the message; `--assignee person:<id>` names someone else, and
`tasks plan <task> --assignee none` clears it. A task with no assignee is fine: better than a missed one.

See what waits on you, oldest first, then only questions and mentions in one group:

```sh
tg personal tasks list state:open
```

```sh
tg personal tasks list chat:<chat id> "(kind:question OR kind:mention)"
```

Add what the rules cannot see, such as a promise you made, or close a task that needs no answer:

```sh
tg personal tasks add msg:telegram/<you>/<chat>/<message> --type promise --category other
```

`tasks categories` lists the categories a task can take. To change the list, edit the `task_categories`
section of `~/.config/WireCat/config.json`. Every WireCat tool built on cli-core 0.298.0 or newer reads this file
(tg since 0.63.0), so one edit changes the list in all of them. It holds only your changes to the
default list: a name with its meaning and trigger words adds or replaces a category, and `null` drops a default
one:

```json
{
  "task_categories": {
    "garden": "plants | seedling, es:planta",
    "religion": null
  }
}
```

`config set task_categories.garden "plants | seedling"` and `config unset task_categories.garden` write the
same file and keep its other sections; `config unset task_categories` brings back the default list. A store
moved by `MESSAGING_STORE` reads the `config.json` beside it.

If the task may be the same job as an open one, `tasks add` refuses with exit code 2 and lists the
candidates. Repeat with `--into <task>` to link the message to that task, or with `--new` to open it anyway.
If it matches only a task closed in the last 14 days, `tasks add` opens it as a follow-up, linked
`follow-up-of` the closed one. `tasks duplicates` lists the pairs the rules found, and
`tasks merge <task> --into <other>` joins them:

```sh
tg personal tasks add msg:telegram/<you>/<chat>/<message> --type promise --category other --into <task>
```

```sh
tg personal tasks close <task> --as dismissed --reason no-reply-needed
```

An AI agent that closes a task states how sure it is with `--certainty`, from 0 to 1. Below the store's
threshold (`task_agent_close_min`, 0.8 by default) the task stays open with a close suggestion;
`config set task_agent_close off` makes every agent close a suggestion. `tasks list close:suggested` finds
them. Confirm one with `tasks close <task>`, or refuse it with `tasks reject <task>`:

```sh
tg personal tasks list close:suggested
```

```sh
tg personal tasks reject <task>
```

Give a task a title, a due date and a date to look at it again, and link the messages and chats it
belongs to. The next-check date is for you or your agent; tg never reminds anyone:

```sh
tg personal tasks plan <task> --title "Send Anna the contract" --due 2d --remind-time 1d
```

```sh
tg personal tasks link <task> msg:telegram/<you>/<chat>/<message> --chat "Hiking"
```

See what needs a look today: tasks overdue or due soon, chats where someone waits for your answer, and
chats where you wait for theirs. It reads the local store, not the messages' text:

```sh
tg personal tasks agenda
```

`tasks agenda` and `tasks duplicates` take query fields:

- `tag:` and `category:` keep the tasks with that tag or category: `tag:urgent`, `category:money`.
- `claimed:` says whose claim a task is under: `none`, `mine`, `others` or `any`. Without it, the agenda
  shows tasks nobody claimed and your own; `claimed:any` shows all of them.
- `decision:` picks the duplicate pairs: `review`, the default, waits for the reviewing agent, and
  `unsure` waits for you: `decision:unsure`.

```sh
tg personal tasks agenda category:money tag:urgent claimed:any
```

```sh
tg personal tasks duplicates decision:unsure
```

`tg skill show follow-ups` prints a daily routine for an AI agent that drafts replies from this list
and sends nothing.

See open tasks per chat, the oldest one and the median time to close:

```sh
tg personal stats tasks show
```

A closed task stays closed, and a dismissed one never comes back. Only your own answers close a
task — an admin's do not — and a mention by `@username` is not seen. An agent connected over MCP
gets the same commands.

## Rules

A group's rules say what `tg personal chats moderate` looks for and what it may do about it. They live in a
file of this profile, never in Telegram, and nothing watches the group in the background: a rule acts
only when you run `chats moderate`.

Show the rules. Until your first change, they are the defaults, marked as not saved:

```sh
tg personal chats rules show "Hiking"
```

Delete a message that has a link:

```sh
tg personal chats rules set "Hiking" links delete
```

Block these people by id…

```sh
tg personal chats rules set "Hiking" blocked 12345,67890
```

…and remove them when they write or join:

```sh
tg personal chats rules set "Hiking" blockedPeople remove
```

Delete without asking you first:

```sh
tg personal chats rules set "Hiking" consent.delete allow
```

See what the check would do, without doing it:

```sh
tg personal chats moderate "Hiking" --dry-run
```

Check what is new since the last run, and act:

```sh
tg personal chats moderate "Hiking"
```

| Rule | Default | What it looks for |
|---|---|---|
| `links`, `invites`, `forwards` | `report` | a message with a link, an invite link to another group, a forwarded message |
| `blocked`, `blockedNames` | — | people by id, or by part of their name, comma-separated |
| `blockedPeople` | `report` | what to do with a message or a join of a blocked person |
| `flood.messages`, `flood.minutes`, `flood.action` | 5, 1, `report` | more than so many messages from one person within so many minutes |
| `trusted` | — | people never acted on; the group's admins and you never are either |
| `consent.delete`, `consent.remove` | `ask` | how far you allow each action |

Each rule's action is `report`, `delete` or `remove`. Whether a `delete` or a `remove` happens
is the group's level for it, `consent.delete` and `consent.remove`: `deny` never, `readonly` only
reports, `ask` asks you about each one (the default; `--allow-dangerous` says yes to all), `allow`
does it. Every action still goes through the send guard and its hourly limit, and a run stops after
`--max-actions` (10). The next run starts where this one stopped; `--since-time` looks at a moment
of your own and leaves that point where it is.

An agent connected over MCP acts only where a level is `allow`; what asks is listed for you, not
done. `newAccount` is not offered: Telegram does not say how old an account is.

## With a bot

If your bot is an admin of the group, it can run the same check: `tg <bot> bot chats moderate`. A
person the bot removes cannot come back by the link unless you add `--no-block`. The bot judges only
messages it saw or imported on this computer, and it does not judge joins. See
[moderating a group with a bot](bot.md#moderating-a-group-by-its-rules).

## Limits

- **Telegram's history is the record.** `chats events` and `review` see what the chat's history still
  holds; a service message an admin deleted is gone for them too.
- **Admins are known only where Telegram says.** Without them, `review --unanswered` counts only your
  answers, and says so.
- **Nothing watches a group by itself.** A check runs when you, an agent at your request, or your
  schedule runs it.
- **Telegram's rate limits apply.** Reading every member of a large group is many requests; a
  `FLOOD_WAIT` answer says how long to wait
  (see [when Telegram asks to wait](troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).

## Statistics for group admins

See the week’s activity: messages, people who wrote and replies. For more specific questions—who
answers, who needs help and whether newcomers stay—open [Statistics](rankings.md).

**Your request:**

> Show Hiking’s activity this week and point out gaps in the history.

**Command:**

```sh
tg personal stats chats show "Hiking" --since-time 7d --offline --json
```

**Example agent answer:**

> | Metric | In available history |
> | --- | ---: |
> | Messages | 120 |
> | People who wrote | 18 |
> | Replies | 30 |
>
> History is incomplete: these are observed counts, not the group’s full totals.
> This local request did not fetch joining or leaving events.

Without `--offline`, the CLI also fetches joining and leaving events. Saved daily member observations
remain available locally. Recording start dates and gaps matter: the first report cannot reconstruct
past member lists.

### Telegram's own statistics

```sh
tg personal stats chats official <chat> --json
```

Telegram computes statistics for admins of large enough supergroups and channels, the same as the Statistics
screen in its apps. `tg personal stats chats official` asks for them and prints one JSON object. Telegram picks the
period, given as `period`. Each total comes with the value for the period before it.

- A supergroup (`kind: "group"`) has members, messages, viewers and posters, the top posters, admins and
  inviters, and 8 graphs: growth, members, new members by source, languages, messages, actions, hours and
  weekdays.
- A channel (`kind: "channel"`) has followers, views, shares and reactions per post and per story, how many
  followers have notifications on, the recent posts with their counts, and 12 graphs.

Each graph is a list of series over its `x` values: `date` (a day, `YYYY-MM-DD`), `time` (ISO 8601) or
`number`. When Telegram cannot give a graph, it shows as `{ "error": ... }` and the other graphs are still
there. The command only reads: nothing is sent, marked read or changed. `--jsonl` is refused.

Telegram answers this only for a chat where it shows you statistics. In a basic group, in a chat you do not
administer, or in one that is too small, the command fails with a permission or validation error. One run
costs about 10 to 17 requests: the chat card, the statistics, and each graph Telegram sends later. Name the
chat by `@username` or id: a title is first looked up in your chat list, which adds a request for each
100 chats. Telegram keeps statistics on a server of its own, so the first run adds a login key for that server
to the session file; it is never printed.

### Member snapshots and changes

`tg personal chats members fetch` reads members into the local store, recording profiles, changes, the day's
member count and whether the read was complete. `--max-pages` caps pages. Nobody is recorded as having
left after a partial read: that requires reading the whole available list and a known group count
no greater than the number read. A larger budget cannot bypass Telegram's member-list limits.

`--track` adds the group to the tracking list. `chats tracking list` shows all tracked groups;
`show` shows one group's tracking state and daily counts for the last 30 days. `add` starts tracking
without fetching immediately; `remove` stops daily fetching and keeps the history already recorded.
While `tg personal serve` runs, it fetches tracked groups one at a time, starting its first round a minute after
connecting, and skips groups already fetched on the current UTC day. Tracking does not start `serve`;
if it was stopped for several days, the next run records a new snapshot rather than filling missed days.

`tg personal chats members history` shows recorded joins, leaves and profile changes, oldest first;
a query such as `time>=7d` limits the period. It never asks Telegram. A join uses Telegram's join time when known,
otherwise the first time the person was seen. A leave is dated at the first complete snapshot without
them, rather than their exact departure. The first fetch records the initial roster: those people did
not necessarily join that day. `chats members list --offline` reads the last completely saved roster;
partial reads do not replace it. Without a complete snapshot, this list can be empty even though some
profiles and events have already been recorded.
Profiles and history stay in the local store alongside messages.

`tg personal chats members audit` lists members with bot-like signals and reasons; `--max-pages` caps pages and
a query such as `score>=3` sets the threshold (`score>=2` when not given). It removes nobody and excludes admins
and the owner. `meta.truncated` means not every member was read. It is unavailable with `--offline`;
scores need human review. Telegram supplies bot, scam, fake, deleted, photo, join and inviter metadata
where available. “Never wrote” means no messages were found in the local history, not proof that the
person never wrote in the group.

`--deep <n>` also checks the top n members in full, one person a second: their profile, their oldest profile
photo, up to 1,000 stored messages each, and two public spam lists — Combot CAS and lols.bot. Each
member's id is sent to those lists. The full check lands in `check` on each of those members.

### A weekly report for your group

“Hiking Club” below is a fictional example group. Download its messages with `messages sync` first if
they are not already stored, then record the current roster and prepare the report:

```sh
tg personal chats members fetch "Hiking Club" --track --json
```

```sh
tg personal stats chats show "Hiking Club" --since-time 7d --by day --timezone Europe/Madrid --json
```

```sh
tg personal chats members history "Hiking Club" "time>=7d" --offline --json
```

```sh
tg personal chats tracking show "Hiking Club" --offline --json
```

```sh
tg personal chats members audit "Hiking Club" --json
```

Ask your agent to report messages, active senders, unanswered questions, membership changes and days
with member snapshots. Keep `missing` entries, `meta.truncated` and gaps between snapshots visible in the
report. Keep `tg personal serve` running or repeat member fetches for future reports; the first report cannot
show departures that happened before the first recorded roster.
