# Configuration

Use this page when you type the same option again and again, or when you want `tg` to behave
differently for one account. By the end you will know where the settings file is, what the common
settings do, how to change one, and how to check which value is in force. You do not need a
settings file to start: without one, every setting has a built-in value.

A few words this page uses:

- **Settings file** (`config.json`): a text file where `tg` keeps your saved choices.
- **Profile**: a named set of settings for one Telegram account or one bot, such as `work`. You
  put its name before the command: `tg work chats list`. See [profiles and bots](profiles.md).
- **Option** (or flag): a word added to one command, such as `--limit 5`. It changes only that run.
- **Environment variable**: a named value that your terminal or your agent's process gives to
  `tg`, such as `TG_PROFILE=work`.
- **Default**: the value `tg` uses when nothing else sets one.

## What you can set

These are the settings most people change. Each one has an exact entry, with its type and every
way to override it, in the [settings reference](configuration-reference.md#the-file).

| Setting | What it does | Built-in value |
|---|---|---|
| `limit` | how many rows a list shows when you do not add `--limit` | `20` |
| `sendsPerHour` | the most messages this profile may send in one hour; stops a send loop | `30`; a bot has no limit until one is set in the `bot` section |
| `requestsPerMinute` | how fast `tg` asks Telegram for things after a short burst; `0` turns the pace off ([limits and waits](limits.md)) | `60` |
| `permissions` | what this profile may do: read only, ask first, or go ahead ([permissions](permissions.md)) | everything allowed, except: deleting and a few other changes that cannot be undone ask first; reply rules may not send |
| `record` | keep a record of every run, to look at later ([diagnostics](diagnostics.md)) | `false` |
| `keepRunsForDays` | how many days run records are kept | `30` |
| `color` | colour in tables | decided by your terminal |
| `senderColors` | a different colour for each sender in a message list | `false` |
| `timeoutMs` | how long **one** request to Telegram may wait, in milliseconds. To limit a whole command, use `--timeout` instead | the connection's own wait |
| `catchUpMarksRead` | `inbox` and `review` mark the chats they show as read. The other person sees it | `false` |
| `proxy` | a proxy server to reach Telegram through, where it is blocked ([proxy setup](configuration-reference.md#through-a-proxy)) | none |
| `transcribeWith` | who turns voice messages into text: `auto`, `messenger` or `local` | `auto` |
| `updateCheck` | once a day, say when a newer `tg` exists | `true` |
| `defaultProfile` | which profile a command uses when you do not name one | `default` |

The file never holds a secret. It has no place for your session, the app hash, a phone number or a
proxy password. The session is a file of its own, and the app hash and a proxy password go to your
system's keyring, or, where there is none, to a file only you can read ([where the login lives](security.md#where-the-login-lives)).

## An example settings file

The first command that reads settings creates a starter file. It looks like this, with one profile
added:

```json
{
  "defaults": { "limit": 20, "keepRunsForDays": 30, "sendsPerHour": 30, "updateCheck": true, "skillHint": true },
  "profiles": {
    "work": { "limit": 50 }
  }
}
```

- `defaults` applies to every profile.
- `profiles.work` applies only to the profile `work` and wins over `defaults`.

So `tg work chats list` shows 50 rows, and `tg chats list` shows 20. Add `--limit 5` to get five
for one command. Remove the profile's `limit` and the value from `defaults` applies again.

<details>
<summary>A full example with every section</summary>

```json
{
  "defaultProfile": "personal",
  "defaults": {
    "limit": 20,
    "keepRunsForDays": 14,
    "sendsPerHour": 30,
    "requestsPerMinute": 60,
    "updateCheck": true,
    "skillHint": true
  },
  "profiles": {
    "personal": {
      "limit": 50,
      "color": true,
      "senderColors": true,
      "record": true
    },
    "work": {
      "permissions": { "messages": "readonly", "messages.send": "allow" },
      "sendsPerHour": 10,
      "proxy": "socks5://proxy.example:1080",
      "transcribeWith": "local"
    }
  },
  "personal": {
    "defaults": { "catchUpMarksRead": false, "searchCatchUp": true }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": {
      "shop": { "sendsPerHour": 200, "readOtherBots": false }
    }
  }
}
```

What each part does:

- `defaultProfile`: `tg chats list` with no profile name uses `personal`.
- `defaults`: every profile gets these values unless it sets its own. `updateCheck` and `skillHint`
  are allowed only here, because there is one copy of `tg` for all profiles.
- `profiles.personal`: more rows, colours, and a record of every run, only for `personal`.
- `profiles.work`: reading messages is allowed, sending is allowed, every other change to
  messages is refused. At most 10 sends an hour. Telegram is reached through a SOCKS5 proxy. Voice
  messages are turned into text on this computer.
- `personal.defaults`: applies only to commands for personal accounts, never to `tg … bot`.
  Here, `store fetch` also prepares fetched chats for search.
- `bot.defaults`: applies only to bot commands (`tg shop bot …`). Bots may read and send, and
  nothing else.
- `bot.profiles.shop`: the bot `shop` may send 200 messages an hour and may not read what other
  bots on this computer saved. `readOtherBots` is allowed only in the `bot` section.

</details>

## Where the file is

| System | Path |
|---|---|
| Linux | `~/.config/tg-cli/config.json` |
| macOS | `~/Library/Application Support/tg-cli/config.json` |
| Windows | `%APPDATA%\tg-cli\config.json` |

`tg config show` prints the path this computer actually uses, and every setting with its value. In
PowerShell, type `tg.cmd` instead of `tg`. An existing file is never replaced by the starter file.

## Three ways to set a value

- **In the file:** the value stays for later commands. `tg config set limit 50` saves it.
- **With an environment variable:** the value holds for one terminal or one agent process.
  For example, `TG_PROFILE` chooses a profile and `TG_TIMEOUT` limits how long a command may run.
  Only some settings have a variable.
- **With an option:** `--limit 5` changes only this one command.

## Which value wins?

An option wins over an environment variable. Then comes the profile's own value in the file, then
`defaults` in the file, then the built-in value. A setting takes part only in the ways it supports;
the [settings reference](configuration-reference.md#which-value-wins) lists them for each setting.

## Change a value

You can edit the file in any text editor, or let `tg` do it. `config set` checks the value before
it writes, so it never saves a file that a later command refuses.

```sh
tg config set limit 50                 # the profile you use now
tg work config set limit 50            # the profile "work"
tg config set sendsPerHour 10 --defaults   # every profile
tg config unset limit                  # back to the default
tg config show                         # check what is in force, and where each value came from
```

A misspelled setting in the file is an error, not a silent default: every command stops and names
the wrong key ([typos in the file](configuration-reference.md#a-typo-is-an-error-not-a-default)).

## Profiles and bots

A profile keeps settings for one account or one bot. Put its name before the command, such as
`tg work config show`. Add `bot` after the name to work as a bot rather than as your personal
account. [Profiles and bots](profiles.md) explains how to create and switch them.

<a id="what-a-profile-may-do" />

<a id="a-question-before-a-change" />

## Next

- [Permissions](permissions.md): choose what a profile, and the agent that uses it, may do.
- [Settings reference](configuration-reference.md): every setting, its type, where it may appear,
  and every environment variable.
