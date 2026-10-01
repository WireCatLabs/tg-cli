# Login, sessions and profiles

A login has two parts:

- **the app**: an `api_id` and `api_hash` from [my.telegram.org](https://my.telegram.org/apps). They
  identify the program to Telegram. `tg` keeps them in the OS keyring.
- **the session**: what Telegram hands out once you log in. It is a file in the state directory, and
  it is as good as your password.

`tg session start` gets both. It asks questions, so run it in a terminal.

## The app from my.telegram.org

Every user registers their own app. Telegram allows one app per phone number and watches accounts
used for spam or automation, so an app id is never shared or built into `tg`. You need it once per
profile; `tg session start` asks only when the profile has none.

Two ways to get it:

- **`--app browser`** (the default) opens [my.telegram.org/apps](https://my.telegram.org/apps). Log
  in there, create an app if you have none (any title and short name, platform Desktop), and paste
  `App api_id` and `App api_hash` when `tg` asks. The hash is not shown as you type.
- **`--app auto`** fills in the site for you. It asks your phone number and the code my.telegram.org
  sends you as a message in Telegram, then reads your app, or creates one if you have none. The site
  has no API, so `tg` follows its web form; a change on Telegram's side can break this. `--app
  browser` still works then.

The app is stored only after Telegram has accepted the login.

## Logging in

```sh
tg session start           # a QR code in the terminal
tg session start phone     # a phone number, the code Telegram sends, and your 2FA password
```

**QR:** scan the code in the Telegram app: Settings → Devices → Link Desktop Device. The code is
renewed while you wait.

**Phone:** type the number in international format, then the login code. If the account has a
cloud password (2FA), `tg` asks for it without showing what you type. With `--app auto`, the phone
number is asked only once.

After either, Telegram lists a new device in the app's list of sessions.

```text
Logged in as <your name> (@<username>, id <id>) — profile default.
Session:  ~/.local/share/tg-cli/sessions/default.session
App keys: in the keyring
Next:     tg chats list · tg server install to keep the archive current
```

### When an agent runs the login

An agent has no terminal to draw the QR code in. `--qr-file` writes it as a PNG instead, for the
agent to show you:

```sh
tg session start --qr-file login.png
```

The file is replaced when Telegram renews the code, and removed when the login ends, whether it
worked or not. Without a terminal this works only when the profile already has its app and the
account has no 2FA password: anything else has to be typed.

## Check and log out

```sh
tg account show              # who this profile is logged in as
tg account sessions list     # every device and app logged in to the account; ends nothing
tg session end               # log out on Telegram's side, and delete the session file here
```

`tg session end` ends the session **on Telegram's side too**: the device disappears from the list in
the app. It does not delete the app id and hash from the keyring, and it leaves the local store as
it is.

## Profiles

A profile is a separate login: its own session, app, settings, recipients and runs. It is named by
**the first word**, not by an option:

```sh
tg chats list              # profile "default"
tg work chats list         # profile "work"
export TG_PROFILE=work     # the same for the whole shell session
```

**The first word is the profile when it is not a command.** A profile therefore cannot be called
`chats`, `messages` or any other command word; `tg session start` refuses such a name. Names are
letters, digits, dot, dash and underscore, starting with a letter or a digit.

The order, first match wins: the first word, `TG_PROFILE`, `defaultProfile` in the config file, then
`default`.

A word that is not a command and has no command after it is an error that says so:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
```

**`TG_PROFILE_LOCK` pins a process to one profile.** Set it where an agent runs, and a first word or
`TG_PROFILE` naming any other profile is refused (exit code `5`). Without it, an agent could pick a
profile with fewer limits.

## Where the parts are kept

| What | Where |
|---|---|
| the session | `sessions/<profile>.session` in the state directory |
| the app id and hash | the OS keyring, service `tg-cli`, entry `<profile>:api` |
| the app id and hash, with no keyring | `credentials.json` in the settings directory |
| the app id and hash, for CI | `TG_API_ID` and `TG_API_HASH`; they win over the keyring |

The directories are listed in [installation.md](installation.md#where-files-go).

On a machine with no keyring (a container, often), the app goes into `credentials.json` beside the
settings, and `tg` says so once on stderr.

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` and `TG_CACHE_DIR` move the keyring entry too.** With any of
> them set, the service name includes the settings directory. A login made without them is invisible
> with them, and the other way round. Set them always, or never.

> ⚠ **On Linux the keyring is reached through `XDG_RUNTIME_DIR`.** cron, ssh and some MCP clients
> start `tg` without it, and every command then says the app credentials were not found "although it
> has logged in on this machine". **Do not log in again**: that adds another device and does not fix
> the environment. Set `XDG_RUNTIME_DIR` ([troubleshooting.md](troubleshooting.md#no-telegram-app-credentials-found--although-it-has-logged-in-on-this-machine)).

## Next

- [usage.md](usage.md) — the first commands
- [configuration.md](configuration.md) — settings and the order they resolve in
- [security.md](security.md) — what reaches the disk and what never does
