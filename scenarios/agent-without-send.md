---
title: Give an agent your account, never the send button
goal: Let an agent read and draft from your Telegram while every send is refused.
steps:
  - run: tg mcp setup claude-code --permission messages.send=deny --allow-writes
    why: add this profile to Claude Code; its server refuses messages send whatever the profile allows, and --allow-writes acknowledges the other tools that may write
  - run: 'tg schedule agent morning claude "run the daily follow-up review: tg skill show follow-ups" --at 08:00'
    why: a review every morning by an agent that runs with TG_READ_ONLY=1, so it drafts and never sends
  - run: tg sends list
    why: every attempt to send, refused ones too, so you can see what the agent tried
look:
  - refused lines in sends list, and which command asked
  - the schedule's last run in tg schedule list
---
