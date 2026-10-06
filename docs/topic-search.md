# Topic search

`tg conversations` finds a discussion by what it was about. Use it when you remember the subject but
not the words: "where did we talk about renting a flat?" finds a conversation that says "apartment",
"lease" and "deposit". For exact words, people, dates and files, use [message search](search.md).

It is not the `topic:` search field, which keeps to one forum topic of a Telegram group. Here a
conversation is something tg finds itself, in any chat.

Search uses messages tg has already stored. Graphs and vectors run locally by default; remote providers are selected explicitly. Fetch the
history first: `tg store fetch <chat>` ([archive](archive.md)).

## What a conversation is

In a busy group several conversations run at once, and their messages interleave. tg untangles them
from the stored messages, without asking Telegram and without any AI:

- a reply belongs to the message it answers;
- a message that mentions someone, by @username or by name, belongs with that person's recent message;
- a person's next message, within a few minutes, continues their previous one.

Each conversation is a list of messages, oldest first. It can skip the messages in between that belong
to other conversations. The rules guess; they can split one discussion in two or join two. Your own AI
agent can link what the rules leave open ([below](#let-your-ai-agent-link-messages)).

## Build, embed, search

```sh
tg conversations build --chat "Book club"        # find the conversations; again after fetching more
tg models text download e5-small                 # once: 135 MB, shared with max
tg conversations embed --chat "Book club"        # resumes where it stopped
tg conversations search "where do we meet" --chat "Book club"
tg conversations search "renting a flat"         # every chat you built
```

1. **Build** finds the conversations of a chat. A new build replaces the last one, so take a
   conversation's number from a fresh `list` rather than keeping it.
2. **Embed** turns each conversation, or each piece of a long one, into a *vector*: a list of numbers
   that stands for what the text means. Texts about the same thing get similar vectors, even in other
   words or another language.
3. **Search** turns your question into a vector too and finds the nearest conversations. It also looks
   for the question's words, and puts conversations found both ways first. Each result says how it was
   found: `"by": ["meaning"]`, `["words"]` or both.

Without a downloaded model, search still runs and finds conversations by their words; the answer says
`"meaning": "unavailable"`. A chat that was never built is not searched: build it first.

The meaning query remains free text. `--filter 'from:me date:7d'` limits conversations before ranking: a single
message must match the whole strict Lucene filter. The default scope is the active account; `--source
personal|bots|all|<provider>` widens it explicitly. Hits carry source and locator; `--timezone` selects the
calendar zone. Filter/source cannot accompany `--refresh`: build and index the desired chats first. With local
`e5-small`, meaning results require cosine similarity greater than 0.80; exact word matches can still appear below
that threshold. `--sync-first` fetches messages; `--refresh` builds and embeds locally.

## Read what was found

```sh
tg conversations list --chat "Book club" --since-time 7d
tg conversations show 91                         # one conversation, oldest first
tg conversations show "Book club" 204            # the conversation message 204 is in
tg conversations related "Book club" 204         # other conversations about the same thing, in every chat
tg messages links "Book club" 204                # why that message is where it is
```

`related` uses the vectors `embed` stored and runs no model, so it answers quickly. A search result
is a lead, not an answer: open the conversation and read the messages before relying on it.

## Keeping it current

New messages reach a conversation only after the next build, and a vector only after the next embed.

```sh
tg conversations status                          # what is behind, chat by chat
tg conversations build                           # every chat that changed, and groups never built
tg conversations embed                           # every built chat with pieces left
tg conversations search "renting a flat" --refresh   # catch up first, then search
```

`status` counts, for each built chat, the messages the build has not seen (new, edited, deleted) and
the pieces whose vector is current, stale or missing, and how many groups were never built. Without
`--chat`, `build`, `embed` and `search --refresh` take at most 20 chats a run (`--max-chats`) and embed
at most 2,000 pieces a run (`--max-chunks`); run them again to go on. They never download a model.

When the rules change in a new version, `status` and `tg store check` name the chats built with the
older ones; build them again.

A result marked `"stale": true` comes from text that was edited after it was embedded: its score is
for the old text. When a message is deleted, its text leaves the vectors too.

## Let your AI agent link messages

The rules miss links that only the meaning shows. Your own AI agent, the one you already use with
tg, can add them:

```sh
tg skill show link-conversations                 # the agent's instructions
tg conversations batches status --chat "Book club"   # how many messages and batches, how much text
```

The agent reads the instructions, tells you how much text it would read and waits for your yes. Then
it takes the chat a batch at a time (`tg conversations batches next`), decides which earlier message
each one answers and stores its answer (`tg conversations links add`). The next build uses them.
Telegram's own replies come first, then the agent's links, then the rules.
`tg conversations links clear --chat "Book club"` drops the agent's answers. In this agent-driven workflow, tg does
not itself call a model. The profile permission `conversations.links` decides whether answers may be stored.

Ordinary `build` uses rules and retained links. `tg conversations build --chat <chat> --analyze` sends bounded
batches to configured OpenAI-compatible or Anthropic endpoints. An explicit `--chat` is required. It reports
volume, endpoint and token limit, then requests consent; consent is remembered for that account/chat/provider
identity until revoked. Defaults are 50 messages per batch and a maximum token reservation of 100,000 per run;
`--yes` grants consent in scripts. `tg conversations consents list` lists consent; `consents revoke --chat <chat>`
revokes it. Built-in analysis is CLI-only; keys stay outside config.

## Privacy and cost

By default nothing leaves your computer. The model runs here, and a model is downloaded only when you
ask:

```sh
tg models text list                              # the models, and which are downloaded
tg models text download embeddinggemma --accept-terms
```

`e5-small` is the default: small and fast, about 100 languages. `embeddinggemma` finds more but runs
about seven times slower, and downloads only with `--accept-terms`, since it comes under Google's
Gemma terms. Vectors of two models are never mixed: search with the model you embedded with.

On a recent laptop `e5-small` embeds about 30 pieces a second; a group of 100,000 messages takes
a little over 20 minutes, once. Later runs embed only what changed.

A service can compute the vectors instead, with your own key:

```sh
tg models text key set openai
tg conversations embed --chat "Book club" --provider openai
tg conversations search "renting a flat" --provider openai
```

Then the text of the chat's conversations goes to that service, and each search sends your question.
Before sending anything, `embed` says how many pieces, at most how many tokens and at most what price,
and waits for your yes (`--yes` in scripts; `--max-tokens` sets a limit). `--base-url` takes any server
with OpenAI's embeddings API, such as Ollama or LM Studio on your own computer, with `--model` and
`--dims`. `tg models text key remove openai` forgets the key.

## For agents

In MCP, `conversations list`, `conversations show`, `conversations search`,
`conversations related` and `conversations status` read what is built; `conversations refresh`
catches up on this computer. MCP offers `conversations batches status`, `conversations batches next`,
`conversations links add`, `conversations links clear` and `conversations build`, plus the
`link-conversations` prompt. Report batch cost and obtain the owner's consent before reading batches. Stored links
require `conversations.links`; rebuild afterwards, including after clearing links. Remote embedding settings also
affect MCP searches and can send query text.
The technical side — the rules, pieces, vectors and ranking — is on
[how search works](https://wirecat.dev/en/docs/search-architecture).
