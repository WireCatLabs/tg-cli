---
title: Catch up after a day away
goal: Know what changed, who waits on you and what you promised, without opening every chat.
steps:
  - run: tg review 'date>1d' --transcribe
    why: every message since yesterday in the chats that changed, yours too, with voice notes as text
  - run: tg review --unanswered 4h
    why: questions to you that nobody answered for four hours or more
  - run: tg tasks agenda
    why: tasks due today, replies you owe and replies you are waiting for
look:
  - who asked first and how long ago
  - promises in your own messages that no task holds yet
---

`review` reads the local store and the chats that changed; by default nothing is marked read; `--mark-read` asks for it.
