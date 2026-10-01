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

## Messages

A chat is its id, `user:<id>` for a person, or the title of a chat the bot has seen. A message is
always named with its chat: Telegram numbers messages inside each chat.

```sh
tg sales bot messages send "Team" "Build is ready"
tg sales bot messages send user:4815162342 "Hello"
tg sales bot messages send "Team" "**Weekly** report" --md       # or --html
tg sales bot messages send "Team" "Report" --file report.pdf     # the text becomes the caption
echo "From a pipe" | tg sales bot messages send "Team"
tg sales bot messages edit "Team" 512 "Fixed text"
tg sales bot messages delete "Team" 512 513 --allow-dangerous
tg sales bot messages pin "Team" 512 --notify
tg sales bot messages unpin "Team" 512
```

`--photo` sends a picture as a photo, `--voice` an Ogg Opus file as a voice message, `--as-file` a
video as a file. A file from a hidden folder or from `tg`'s own folders is refused unless you add
`--allow-any-file`. A bot sends one file per message. Telegram deletes only messages under 48 hours
old.

If the connection breaks while a message is going, `tg` does not send it again: it says it does not
know whether the message arrived (exit code 14). Check the chat before you send it again.

**Telegram gives a bot no history.** A bot cannot ask Telegram for a chat's messages, or for one
message. So `messages list` and `messages show` answer from what the bot has sent and received on
this computer, and say so:

```sh
tg sales bot messages list "Team"
tg sales bot messages show "Team" 512
```

## A chat

```sh
tg sales bot chats show -1001234567890    # from Telegram; the bot remembers its title
tg sales bot chats action "Team" typing   # typing, photo, video, voice, file — a few seconds
tg sales bot chats leave "Team"           # only an admin can bring the bot back
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

Admins and members, button answers, the command menu, webhooks and `bot watch` come next, as the
same commands `max bot` has. `bot watch` is what fills the bot's history with what other people
write.

The settings for a bot live in the `bot` section of the configuration file:
`tg sales config set --bot sendsPerHour 200` ([configuration.md](configuration.md)).
