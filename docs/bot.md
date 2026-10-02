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
message. So `messages list` and `messages show` answer from what the bot has sent, and what
`bot watch` received, on this computer, and say so:

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

## Admins and members

The bot must be an admin of the chat, with the right to add admins or to remove members. A person is
their user id.

```sh
tg sales bot chats admins list "Team"                                  # who runs it, and what each may do
tg sales bot chats admins add "Team" 4815162342 --can pin,delete --title Mod
tg sales bot chats admins remove "Team" 4815162342                     # they stay in the chat
tg sales bot chats members remove "Team" 4815162342                    # they may come back by the link
tg sales bot chats members remove "Team" 4815162342 --block            # they may not
```

`--can` takes members, admins, info, pin, link, post, edit and delete. Telegram has no right to read:
an admin always reads. Promoting works in supergroups and channels, and the title only in
supergroups. Telegram's Bot API cannot list a chat's members or add people.

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

## What happens in the bot's chats

```sh
tg sales bot watch                       # new messages, until Ctrl-C or --timeout
tg sales bot watch --events --jsonl      # and the rest: edits, buttons pressed, people joining and leaving
tg sales bot watch --types message,callback_query
```

`watch` keeps what arrives before it prints it: messages in the bot's history on this computer,
buttons pressed for `callbacks answer`. The next run starts after the last update it kept. Telegram
keeps a bot's updates for 24 hours, so a bot watched less often than that misses some. With
`--events`, every line names its event: `message`, `edit`, `callback`, `joined`, `left`, `added`,
`removed`, `other`. Telegram tells a bot who joins and leaves only when the bot is an admin of the
chat. `--types` takes Telegram's update names.

## Buttons, the menu, webhooks

```sh
tg sales bot callbacks answer <callback> --notification "Done"   # a note only the person who pressed sees
tg sales bot callbacks answer <callback> --text "Confirmed"      # replaces the message the button was on
tg sales bot commands set start=Begin "report=Today's report"    # the menu people see after /
tg sales bot commands list
tg sales bot commands clear
tg sales bot webhooks set https://bot.example.com/telegram --secret-stdin
tg sales bot webhooks list
tg sales bot webhooks delete https://bot.example.com/telegram
```

`--text` replaces the message of a button `bot watch` saw pressed. A Telegram command needs a
description. A bot holds one webhook; while it is set, `bot watch` gets nothing, and `webhooks set`
refuses a second address until the first is deleted.

The settings for a bot live in the `bot` section of the configuration file:
`tg sales config set --bot sendsPerHour 200` ([configuration.md](configuration.md)).

## The bot for an agent (MCP)

`tg <name> bot mcp` serves the bot to an agent, as `tg mcp` serves your account:

```sh
claude mcp add sales-bot -- tg sales bot mcp
tg sales bot mcp config          # the entry for Claude Desktop, Cursor and others
```

The agent gets what the bot profile's permissions allow, under `bot.`: the chats the bot has seen,
messages, admins, the command menu, the journal and the recipient list — and, unless the profile is
read-only, writing as the bot: send, edit, pin, "typing", answer buttons, delete, remove members.
`bot: readonly` leaves only reading. A deletion is shown to you in a form first; `--allow-dangerous`
skips that form, `--confirm-send` puts every write through one. `tg_bot_status` says which profile
the server speaks for and which writing tools are on.

Each write runs the same command you would type, so the bot's recipient list and journal apply.
The token, the webhooks, the command menu and the recipient list stay yours to change.
