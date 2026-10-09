# Profiles and bots

A **profile** is a name for one login of `tg` on this computer: a Telegram account or a bot, with its
own session and its own settings. Without a name, `tg` uses the profile `default`, so with one
account you never need to think about profiles.

Read this page when you want a second account, want your AI agent to have fewer rights than you, or
want to run a bot. At the end you know how to pick a profile for a command, how to give it its own
settings, and how to switch to a bot.

## What profiles let you do

| You want to | How |
|---|---|
| Use two Telegram accounts on one computer | Log in once per profile: `tg work session start` |
| Give your agent fewer rights than you have | A profile with its own [permissions](permissions.md) |
| Keep an agent on that one profile | `TG_PROFILE_LOCK` ([profiles in login and sessions](sessions.md#profiles)) |
| Run a Telegram bot next to your account | A bot profile: `tg support bot api get-me` |
| See every profile on this computer | `tg account list` |

## Choose a profile

Put the profile name before the command:

```sh
tg work config show
```

`tg account list` shows every profile on this computer and the account each is logged in as;
`tg work session end` logs the profile `work` out.

A setting under `profiles.work` in the config file applies to that profile; values under `defaults`
apply when it has no value of its own. The rules for profile names, and the order in which `tg`
picks a profile, are in [profiles in login and sessions](sessions.md#profiles).

Profiles are not separate operating-system users: an agent with unrestricted file access can still
reach other data on that computer.

## Switch to a bot

Put `bot` after the profile name:

```sh
tg support bot api get-me --json
```

These commands need a bot profile that is already connected. The bot's account and rights come
from Telegram, not from your personal account. [A Telegram bot](bot.md) explains how to connect a
bot, with examples.

## Settings and access

- [Configuration](configuration.md) explains saved values, environment variables and options.
- [Permissions](permissions.md) controls what each profile may do.
- [Login, sessions and profiles](sessions.md) explains how to log a profile in.
