---
title: Find what someone said
goal: Find a message you half remember, read it in context and share a link to it.
steps:
  - run: tg search all invoice
    why: messages and notes in one search, best match first; add --offline to stay on this computer
  - run: tg messages context Team 1234
    why: the message and what came either side of it, from the hit's chat and id
  - run: tg messages link Team 1234
    why: a link to the message to paste into a note or a task
look:
  - the chat and the time of each hit
  - the ref of the hit you want, which the next commands take
---
