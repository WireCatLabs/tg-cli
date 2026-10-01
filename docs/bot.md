# A Telegram bot

`tg bot` works with a bot through Telegram's official [Bot API](https://core.telegram.org/bots/api)
and its token. It has nothing to do with your own account: the bot has its own name, its own chats
and its own token, and `tg …` without the word `bot` is still you ([usage.md](usage.md)).

You create a bot with [@BotFather](https://t.me/BotFather) in Telegram; it gives you the token.

Every command and option is in [commands.md](commands.md).

## The first minute

```sh
tg sales bot auth set     # the token, at a hidden prompt
tg sales bot auth show    # which bot it is
```

`auth set` asks Telegram whose token it is before keeping it, so a typo never replaces a token that
works.

## Several bots

A bot is kept under a name you choose, and that name is the **first word** of the command, as a
profile is for your account:

```sh
tg sales bot auth set
tg support bot auth set
tg bot list --check       # every name with a bot token, and which bot each is
```

Without a name it is the `defaultProfile` setting, else `default`. `TG_PROFILE` sets it for the shell.

## The token

The token lives in the system keyring, as `bot:<name>`, apart from your own login. Without a keyring
it goes into a file only you can read.

```sh
tg sales bot auth show    # where the token comes from, and which bot it is
tg sales bot auth remove  # forget it
```

`TG_BOT_TOKEN` wins over the keyring when it is set — that is how CI does it. `auth set` does not
store the variable's token.

Telegram puts the token in the address of every request. `tg` never prints that address: not in an
error, not with `--trace`, not in a run record.

## Chats

Telegram gives a bot no list of its chats, so `chats list` shows **the chats this bot has seen on
this computer**. It is not a full list.

```sh
tg sales bot chats list
```

## Who the bot may write to

Each bot has its own list of chats it may write to. With no list, it may write anywhere.

```sh
tg sales bot recipients add -1001234567890    # a chat id
tg sales bot recipients add user:4815162342   # a person
tg sales bot recipients list
tg sales bot recipients remove -1001234567890
tg sales bot recipients clear                 # any chat again
```

Every write the bot makes goes into its journal — the chat, the kind of action and the outcome,
never the text:

```sh
tg sales bot sends list
```

## Coming next

Sending, editing and deleting messages, pins, admins, button answers, the command menu, webhooks
and `bot watch` come next, as the same commands `max bot` has. A bot cannot read a chat's history
from Telegram — there is no such method — so its history is what `bot watch` keeps on this
computer.

The settings for a bot live in the `bot` section of the configuration file:
`tg sales config set --bot sendsPerHour 200` ([configuration.md](configuration.md)).
