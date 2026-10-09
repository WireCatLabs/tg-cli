# Topic search

You remember that a chat discussed something, but not the words people used. Topic search finds that
discussion by its meaning. Ask "where did we talk about renting a flat?" and it finds a conversation that
says "apartment", "lease" and "deposit", even if nobody wrote "renting a flat". It also works across
languages: an English question finds a discussion in Spanish or Russian.

After reading this page you can prepare a chat for topic search, ask questions in your own words, read
the results, and decide when ordinary word search is the better tool. Topic search uses only the messages
tg has already saved on this computer, so download the history first: `tg store fetch <chat>`
([download a chat's history](archive.md#fetch-a-chats-history)).

Terms used on this page:

- **Conversation**: one discussion inside a chat. In a busy group several conversations run at the same
  time and their messages mix. tg separates them; a conversation is the list of messages that belong
  together, oldest first.
- **Piece**: a short part of a conversation, about 1,200 characters. Long conversations are cut into
  pieces so that each piece is about one thing.
- **Vector**: a list of numbers that stands for what a text means. Texts about the same thing get
  similar vectors, even when the words or the language differ.
- **Model**: the small program that turns text into a vector. It runs on your computer by default.

Topic search is not the `topic:` field of [message search](search.md). `topic:` keeps one forum topic of
a Telegram group. A conversation here is something tg finds by itself, in any chat.

## What you can do

| Task | Command |
|---|---|
| Find a discussion by its subject, in one chat or in every prepared chat | `tg search conversations "<question>"` |
| See the conversations of a chat, newest first | `tg conversations list --chat <chat>` |
| Read one conversation from start to end | `tg conversations show <id>` |
| Open the whole conversation a message belongs to | `tg conversations show <chat> <message>` |
| Find other conversations about the same thing, in every chat | `tg conversations related <chat> <message>` |
| Limit results to a person, a period or a word | `tg search conversations "<question>" --filter '<query>'` |
| See what is out of date and catch up | `tg conversations status`, `tg search conversations "<question>" --refresh` |
| Let your own AI agent improve how messages are grouped | `tg skill show link-conversations` |

## Topic search or word search?

| | [Word search](search.md) (`tg search messages`) | Topic search (`tg search conversations`) |
|---|---|---|
| You know | the exact words, a name, a date, a file | only what it was about |
| It finds | single messages that contain your words | whole conversations about your question |
| Other words for the same thing | no: "flat" does not find "apartment" | yes |
| Other languages | no | yes, about 100 languages with the default model |
| Exact filters (sender, date, file, link) | yes, the full [query language](query-language.md) | yes, through `--filter` |
| Preparation | download the history | download the history, then `build` and `embed` |
| Asks Telegram | yes, by default | no, it reads only this computer |

Use word search when you remember a word, a number, a name or a file. Use topic search when you
remember the subject but not the wording, when a discussion is spread over many short messages, or when
people wrote in another language. If you are not sure, try topic search first: it also matches your
words, so a conversation that uses them still comes near the top.

## Try it

Prepare one chat once, then ask as many questions as you like.

**Your request to your AI agent:**

> In Book club, find where we discussed moving the meetings to another place. Show the conversation.

**What happens, step by step:**

```sh
tg store fetch "Book club"                       # 1. download the history, if it is not saved yet
tg conversations build --chat "Book club"        # 2. separate the chat into conversations
tg models text download e5-small                 # 3. once: download the model, 135 MB, shared with max
tg conversations embed --chat "Book club"        # 4. compute a vector for each piece
tg search conversations "where do we meet" --chat "Book club"   # 5. ask
tg conversations show 91                         # 6. read the conversation that was found
```

Steps 2 to 4 run on your computer and never ask Telegram. `embed` continues where it stopped if you
interrupt it. Later questions need only step 5; [keep it current](#keep-it-current) explains when to
repeat steps 2 and 4.

**Example result** (fictional):

```text
0.874  91  2026-09-14 18:02–18:40  23 messages · 4 people · from message 4180  (messages 4185–4192)  msg:telegram/500/7/4185
0.851  64  2026-08-02 10:15–10:31  9 messages · 3 people · from message 3302  (messages 3302–3310)  msg:telegram/500/7/3302
```

A result is a lead, not an answer: open the conversation and read the messages before you rely on it.

## How it works

Topic search has three stages. The first two prepare a chat once; the third runs for each question.

### 1. Build: separate the chat into conversations

`tg conversations build` reads the saved messages of a chat, oldest first, and decides for each
message which earlier message it continues. It uses no AI and does not ask Telegram. The links come from,
in this order:

1. **Telegram's own replies.** A message sent as a reply belongs to the message it answers.
2. **Your agent's answers**, if you asked your agent to link the chat
   ([below](#let-your-ai-agent-link-messages)).
3. **A mention.** A message that mentions someone belongs with that person's latest message. A mention
   is an `@username`, a mention Telegram marks, or a message that starts with the person's username and a
   colon or comma (`anna: agreed`). tg looks back at most 50 messages, and only in the same forum topic.
4. **The same person writing again.** A person's next message continues their previous one if it comes
   within 5 minutes and within the last 10 messages.

A message with no link starts a new conversation. A conversation can skip the messages in between that
belong to other conversations. The rules guess: they can split one discussion in two or join two
discussions into one. A new build replaces the last one, so take a conversation's number from a fresh
`list` rather than keeping it.

### 2. Embed: turn each piece into a vector

`tg conversations embed` cuts each conversation into pieces of about 1,200 characters, at message
boundaries. Each line of a piece is "sender: text". A message longer than a piece is split into
overlapping parts, so the model reads all of a long message, not only its start. Messages without text
add nothing. The model then turns each piece into a vector and tg saves it. The text of the piece is not
saved again; only its vector and a fingerprint that shows when the text changes.

### 3. Search: by meaning and by words at the same time

`tg search conversations` looks for your question in two ways and joins the results:

- **By meaning.** The question becomes a vector too. tg compares it with the vectors of all pieces and
  ranks each conversation by its closest piece. With the default model `e5-small`, a match by meaning must
  be close enough: its similarity score must be above 0.80, on a scale where 1 means the same meaning.
- **By words.** tg also looks for each word of your question in the saved messages. A word of three or
  more letters also matches longer words that start with it (`meet` finds `meeting`). Typos are not
  corrected.

A conversation found both ways ranks above one found only one way. Each result says how it was found:
`"by": ["meaning"]`, `["words"]` or both. Without a downloaded model, search still runs by words alone
and the answer says `"meaning": "unavailable"`. A chat that was never built is not searched: build it
first.

**Why this finds more than word search:** word search needs the same word in the message. Meaning
search compares what the texts are about, and it reads a piece of the conversation, not one message.
So "where do we meet" can find a discussion where one person asks "library or café?" and another
answers "the café on Main Street is quieter". The word half keeps exact names and rare words from
being missed.

The technical details — the measured rules, the pieces, the vectors and the ranking — are on
[how search works](https://wirecat.dev/en/docs/search-architecture).

## Read the results

In the terminal each result is one line:

- the similarity score, or `—` when only words found it;
- the conversation number, when it started and ended, how many messages and people, its first message;
- `(messages 4185–4192)`: the piece that matched best (or the message, when only words found it), so
  you know where to start reading;
- the message locator (`msg:…`), which `tg messages show` and `tg messages context` accept;
- `stale` when the text changed after its vector was computed: the score is for the old text.

With `--json`, the answer also has `meaning` (`searched` or `unavailable`), the `model` used and
`readiness`: which chats were searched by meaning, which only by words, which are out of date and which
were never built. When something limited the search, stderr names the chats and the command that fixes
it, for example `conversations embed --chat <chat>`.

```sh
tg conversations list --chat "Book club" --since-time 7d
tg conversations show 91                         # one conversation, oldest first
tg conversations show "Book club" 204            # the conversation message 204 is in
tg conversations related "Book club" 204         # other conversations about the same thing, in every chat
tg messages links "Book club" 204                # why that message is where it is
```

`related` uses the vectors `embed` saved and runs no model, so it answers quickly. It is search by
meaning only.

## Worked examples

**You remember the subject, not the words.**

```sh
tg search conversations "who is bringing food to the picnic"
```

This searches every prepared chat. It can find a conversation where people wrote "I'll take sandwiches"
and "Bob has the drinks", which word search would miss.

**The discussion was in another language.**

```sh
tg search conversations "renting a flat" --chat "Valencia expats"
```

With the default model, this can find a discussion written in Spanish about a "piso".

**Narrow by person and period.** `--filter` takes the strict [query language](query-language.md). A
conversation qualifies when at least one of its messages matches the whole filter. Your question is
still matched by meaning.

```sh
tg search conversations "budget for the trip" --filter 'from:"Alice Synthetic" date:30d'
```

```sh
tg search conversations "contract terms" --filter 'has:file' --timezone Europe/Madrid
```

**Start from one message.** You found a message with word search and want everything else on that
subject:

```sh
tg search messages '"deposit back"' --chat "Valencia expats"
tg conversations related "Valencia expats" 5120
```

**Search your bots' chats too.** By default topic search uses the active account. `--source personal`,
`bots`, `all` or a messenger name widens it; each result then says which account it came from.

```sh
tg search conversations "delivery delayed" --source all
```

**Fetch new messages before you ask.** `--sync-first` downloads new messages first, within the chat,
time and message bounds of message search.

```sh
tg search conversations "where do we meet" --chat "Book club" --sync-first
```

## Keep it current

New messages reach a conversation only after the next build, and a vector only after the next embed.

```sh
tg conversations status                          # what is behind, chat by chat
tg conversations build                           # every chat that changed, and groups never built
tg conversations embed                           # every built chat with pieces left
tg search conversations "renting a flat" --refresh   # catch up first, then search
```

`status` counts, for each built chat, the messages the build has not seen (new, edited, deleted), the
pieces whose vector is current, stale or missing, and how many groups were never built. Without `--chat`,
`build`, `embed` and `search --refresh` take at most 20 chats a run (`--max-chats`) and embed at most
2,000 pieces a run (`--max-chunks`); run them again to go on. They never download a model.
`--refresh` cannot be combined with `--filter` or `--source`: build and embed the chats you want first.

When the rules change in a new version, `status` and `tg store check` name the chats built with the
older rules; build them again.

When a message is deleted, its text leaves the vectors too.

`tg store fetch <chat> --catch-up` can also build and embed a chat right after it downloads it
([download a chat's history](archive.md#fetch-a-chats-history)).

## Let your AI agent link messages

The rules miss links that only the meaning shows. Your own AI agent (for example Claude Code, Codex,
Cursor or Gemini CLI) can add them:

```sh
tg skill show link-conversations                 # the agent's instructions
tg conversations batches status --chat "Book club"   # how many messages and batches, how much text
```

The agent reads the instructions, tells you how much text it would read and waits for your yes. Then it
takes the chat a batch at a time (`tg conversations batches next`), decides which earlier message each one
answers and saves its answer (`tg conversations links add`). The next build uses them: Telegram's own
replies come first, then the agent's links, then the rules. `tg conversations links clear --chat "Book club"`
drops the agent's answers; build again afterwards. In this workflow tg itself does not call a model. The
profile permission `conversations.links` decides whether answers may be saved.

tg can also send the batches to a model service itself. Ordinary `build` uses rules and saved links;
`tg conversations build --chat <chat> --analyze` sends bounded batches to a configured OpenAI-compatible
or Anthropic endpoint. An explicit `--chat` is required. Before the first batch it shows the volume, the
endpoint and the token limit, and asks for consent. Consent is remembered for that account, chat and
provider until you revoke it. Defaults are 50 messages per batch (`--size`) and at most 100,000 tokens
reserved per run (`--max-tokens`); `--yes` grants consent in scripts. `tg conversations consents list`
lists consents; `consents revoke --chat <chat>` revokes them. Built-in analysis works only from the
command line, not over MCP, and keys never go into the settings file.

## Privacy and cost

By default nothing leaves your computer. The model runs here, and a model is downloaded only when you
ask:

```sh
tg models text list                              # the models, and which are downloaded
tg models text download embeddinggemma --accept-terms
```

`e5-small` is the default: small and fast, about 100 languages. `embeddinggemma` finds more but runs
about seven times slower, and downloads only with `--accept-terms`, since it comes under Google's Gemma
terms. Vectors of two models are never mixed: search with the model you embedded with. A chat embedded
only with another model is named on stderr.

On a recent laptop `e5-small` embeds about 30 pieces a second; a group of 100,000 messages takes a
little over 20 minutes, once. Later runs embed only what changed.

A service can compute the vectors instead, with your own key:

```sh
tg models text key set openai
tg conversations embed --chat "Book club" --provider openai
tg search conversations "renting a flat" --provider openai
```

Then the text of the chat's conversations goes to that service, and each search sends your question.
Before sending anything, `embed` says how many pieces, at most how many tokens and at most what price,
and waits for your yes (`--yes` in scripts; `--max-tokens` sets a limit). `--base-url` takes any server
with OpenAI's embeddings API, such as Ollama or LM Studio on your own computer, with `--model` and
`--dims`. `tg models text key remove openai` forgets the key. Remote embedding settings also apply to
searches your agent runs over MCP, so its questions go to that service too.

## Next

- [Message search](search.md): exact words, people, dates and files.
- [How search works](https://wirecat.dev/en/docs/search-architecture): the technical side of the rules,
  pieces, vectors and ranking.
