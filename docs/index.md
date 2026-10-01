# tg

`tg` is a Telegram client for the command line and for AI agents. It works with your own Telegram
account: read your chats, find what was said, and answer — yourself, or through Claude, Codex,
Cursor and other agents, within limits you set. In the groups you run, see which questions nobody
answered and who joined.

It is built for scripts and agents first: one operation per call, the same shape of answer every
time, and a fixed exit code for each kind of failure.

## The first minute

```sh
npm install -g @leemour/tg-cli
tg session start          # your app from my.telegram.org, then a QR code to scan
tg inbox                  # other people's unread messages, in every chat; nothing is marked read
tg messages list me       # Saved Messages, the latest 20
```

It needs Node 22.16 or newer, or Bun ([installation.md](installation.md)). The first login asks for your
own Telegram app; `tg` can register it for you ([sessions.md](sessions.md)).

What it can do, how agents use it and how it differs from other tools: the
[README](https://github.com/leemour/tg-cli#readme).

## Where to go next

| Page | Answers |
|---|---|
| [installation.md](installation.md) | What does it need, where do its files go, how do I upgrade or remove it? |
| [usage.md](usage.md) | How do I read, page, send, and use it from a script? |
| [sessions.md](sessions.md) | How does login work, where are the keys, how do profiles work? |
| [archive.md](archive.md) | What does the local store keep, and how do I fill, search, export and back it up? |
| [groups.md](groups.md) | How do I keep up with a group I run? |
| [bot.md](bot.md) | How do I run a Telegram bot from the command line? |
| [mcp.md](mcp.md) | How do I connect Claude Desktop, Cursor or another client without a terminal? |
| [remote.md](remote.md) | How do I reach it from ChatGPT or Claude in the browser? |
| [recipes.md](recipes.md) | What can an agent do for me every day, and how do I run it on a schedule? |
| [commands.md](commands.md) | Every command, option and exit code |
| [configuration.md](configuration.md) | What can I set, and which value wins? |
| [diagnostics.md](diagnostics.md) | What did a command do, and what is never recorded? |
| [troubleshooting.md](troubleshooting.md) | Something does not work: what the screen says, and what to do |
| [security.md](security.md) | What reaches the disk and the network, and what stops a send going to the wrong place? |
| [roadmap.md](roadmap.md) | What is coming next? |
