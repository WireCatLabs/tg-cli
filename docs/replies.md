# Auto-replies

This page is about answering Telegram messages automatically when you cannot answer yourself — for
example, a short "I will answer in the morning" to people who write after working hours. By the end
you have a working auto-reply: a rule with your reply text, sent only to the people you allow, and a
way to check what it would answer before it sends anything. Ready-made texts, and how a reply template
differs from a draft, are on [Drafts and reply templates](https://wirecat.dev/en/docs/drafts-and-templates).

A few words used below:

- A **rule** says which incoming messages to answer and what to do: reply, open a task, or both.
- A **template** is the reply text. It can include the sender's name and the time.
- The **audience** is the list of people and chats that may get a reply at all, whatever a rule says.
- `tg serve` is the background process that receives new messages and applies the rules.

Two things keep it from writing to people you did not mean:

- **Replies go only to people and chats you allow.** A new rules file allows nobody, so nobody gets
  a reply until you add someone with `tg replies audience --reply listed --allow-people …`.
- **Sending is off until you turn it on.** `permissions.replies.send` must be `allow`. `ask` counts as
  no, because a background server has nobody to ask.

The full option lists are in [commands.md](commands.md#tg-replies).

## Create and enable a rule

```sh
tg replies add away
tg replies edit away --template 'Thanks, {{ sender.firstName | default: "there" }}! I will answer in the morning.'
tg replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
tg replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` creates a rule that is off, with every setting written out. The rules live in
`<profile>.replies.json`, in the same folder as the `configFile` that `tg config show --json` names.
Allow the people who may get replies, by their Telegram ids, comma-separated. `tg contacts show <name>
--json` prints a person's id as `id`:

```sh
tg replies audience --reply listed --allow-people 1000001
```

The file then holds:

```json
{
  "audience": {
    "reply": "listed",
    "allow": { "people": ["1000001"], "chats": [] },
    "deny": { "people": [], "chats": [] }
  },
  "rules": [ … ]
}
```

Rule ids are lower-case letters, digits and `-`, and each is unique. A rule that replies cannot be
turned on with an empty template.

Then look at what it would have answered, turn it on, and start the server:

```sh
tg replies test --since-time 7d
tg replies on away
tg config set permissions.replies.send allow
tg serve
```

`replies test` reads only messages already in your local store. It sends nothing, changes nothing
and never connects. `tg replies off away` turns one rule off.

## Conditions and audience

`replies edit` changes only the fields you name. A comma-separated list replaces the whole list; an
empty string clears it.

| What | Options |
|---|---|
| Action | `--do reply,task` — a reply, a task, or both |
| Chats | `--kinds dialog,group`, `--chats`, `--not-chats` |
| Conditions | `--words`, `--question` / `--no-question`, `--mentions-me` / `--no-mentions-me` |
| Senders | `--people`, `--not-people`, `--contacts-only` / `--no-contacts-only` |
| Reply | `--template`, `--as-reply` / `--no-as-reply` |
| Limits | `--per-chat`, `--per-person`, such as `1/12h` |
| Working hours | `--outside`, `--days`, `--timezone`, `--no-hours` |

The first time you set working hours, give the window, the days and the time zone together; after
that you can change one. A wrong edit does not overwrite the file, and the other rules, the audience and
the record of what was answered stay as they were.

`tg replies audience` shows who the whole file may answer. A new file is `--reply listed` with empty
lists, so it answers nobody. `--reply listed` answers only the allowed people and chats; `--reply all`
answers anyone a rule matches. `--allow-people`, `--allow-chats`, `--deny-people` and `--deny-chats`
replace those lists, and a denial wins over an allowance. A `task` action opens a task on this computer
and is not limited by the audience.

## Templates and a model

Examples of reply texts for common cases, and when to keep a draft instead, are on
[Drafts and reply templates](https://wirecat.dev/en/docs/drafts-and-templates).

A template can use `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` and `now` (in the
rule's time zone, or UTC without working hours), with filters such as `{{ now | date: "%H:%M" }}`. The
incoming message's text is not a template variable. Unknown variables and filters are refused.

A model may write only the `ai` block; everything outside it is your text:

```liquid
Thanks, {{ sender.firstName | default: "there" }}!
{% ai %}Briefly confirm you got the message; I will answer tomorrow.{% else %}I will answer tomorrow.{% endai %}
```

The block's body is an instruction to the model. The incoming text goes to the model separately, as
data. When no model is set up, there is no consent, or the call fails, the `else` text is sent; without
an `else`, the message gets no reply and the reason is recorded.

Choose the model with `models.replies.provider` (`openai` or `anthropic`), `models.replies.model` and,
for your own server, `models.replies.baseUrl`; `models.default` fills what is not set. Keep the key with
`tg models text key set`.

Using a model needs its own consent, separate from the right to send:

```sh
tg replies consents show
tg replies consents grant
tg replies consents revoke
tg replies consents deny -1002000002
tg replies consents allow -1002000002
```

`grant` lets incoming message data go to the chosen provider for the whole profile. `deny` keeps one
chat's messages away from the model; `allow` removes that, without granting consent. A new provider
or endpoint needs consent again. `tg replies test --ai` sends stored messages to the model so you can
see its text; it still sends nothing to Telegram.

## What a rule never answers

- Anyone the audience does not allow.
- Your own messages, channels, bots, and messages sent on behalf of a chat.
- An edited message, a message already handled, and anything that arrived before `serve` started.
- In a group, a message that neither mentions you nor replies to you, unless the rule names that group
  in `chats`.

`perChat` and `perPerson` limits are required on every rule, so two auto-repliers that answer each
other stop at the first limit.

## Stop and look

```sh
tg replies pause
tg replies resume
tg replies status
tg sends list
```

`pause` stops every rule at once, a running `serve` included, without a restart; `resume` undoes it.
`status` says whether sending is allowed, which rules are on and who they may answer. `sends list`
shows each reply with the rule that sent it.
