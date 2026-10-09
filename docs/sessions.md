# Login, sessions and profiles

Read this page when you connect `tg` to your Telegram account for the first time, when you add a
second account, or when `tg` says you are not logged in. At the end you know how to log in, how to
check who you are logged in as, how to log out, and where `tg` keeps what it needs to stay logged in.

First, the words this page uses:

- **Session**: the login of `tg` on this computer. Telegram issues it when you log in, and lists it in
  the Telegram app as one more device. `tg` keeps it in a file. Whoever has that file can read your
  chats, so treat it like your password.
- **App** (`api_id` and `api_hash`): two values from [my.telegram.org](https://my.telegram.org/apps)
  that identify the program to Telegram. Each user registers their own app once; `tg` can do it for
  you.
- **Keyring**: the password store of your operating system. `tg` keeps the app values there.
- **Profile**: a name for one login on this computer, with its own session, app and settings. Without
  a name, `tg` uses the profile `default`. You need a second profile only for a second account or for
  separate limits ([profiles](#profiles)).

Do not confuse `tg session` with `tg account sessions`. `tg session` is the login of `tg` itself;
`tg account sessions` lists every other device and app logged in to your account.

## First run

`tg setup` guides a first run through the app and the session, checks five chats and offers an agent
skill. Allow about five minutes; history downloads are a separate step. Run it in a terminal. Use
`tg setup --app browser` for manual app registration or `--method phone` for a phone login.
`tg session start` remains the command for login alone, including resuming an interrupted login.
Setup checks an existing session and does not silently log in again if it is rejected.

## The app from my.telegram.org

Every user registers their own app. Telegram gives one app per phone number, so an app id is never
shared or built into `tg`. You need it once per profile; `tg session start` asks only when the profile
has none.

Two ways to get it:

- **`--app browser`** opens [my.telegram.org/apps](https://my.telegram.org/apps). Log in there,
  create an app if you have none (any title and short name, platform Desktop), and paste
  `App api_id` and `App api_hash` when `tg` asks. The hash is not shown as you type. This is the
  default for `tg session start`.
- **`--app auto`** fills in the site for you. It asks your phone number and the code my.telegram.org
  sends you as a message in Telegram, then reads your app, or creates one if you have none. The site
  has no API, so `tg` follows its web form; a change on Telegram's side can break this. `--app
  browser` still works then. This is the default for `tg setup`.

The app is stored only after Telegram has accepted the login.

## Logging in

```sh
tg session start           # a QR code in the terminal
tg session start phone     # a phone number, the code Telegram sends, and your 2FA password
tg session start phone --sms   # the same, asking Telegram for the code by SMS
```

**QR:** scan the code in the Telegram app: Settings → Devices → Link Desktop Device. The code is
renewed while you wait.

**Phone:** type the number in international format, then the login code. If the account has a
cloud password (2FA), `tg` asks for it without showing what you type. With `--app auto`, the phone
number is asked only once. The code usually arrives in the Telegram app; `--sms` asks for an SMS
instead, but Telegram chooses, and `tg` says which way it was sent. When Telegram has no SMS for the
account, `tg` says so and asks for the code from the app.

After either, Telegram lists a new device in the app's list of sessions.

```text
Logged in as <your name> (@<username>, id <id>) — profile default.
Session:  ~/.local/share/tg-cli/sessions/default.session
App keys: in the keyring
Next:     tg chats list · tg server install to keep the archive current
```

### When an agent runs the login

Your AI agent can start the login for you, but it has no terminal to draw the QR code in.
`--qr-file` writes the code as a picture (PNG) instead, and the agent shows it to you to scan:

```sh
tg session start --qr-file login.png
```

The file is replaced when Telegram renews the code, and removed when the login ends, whether it
worked or not. Without a terminal this works only when the profile already has its app and the
account has no 2FA password: anything else you have to type yourself. `tg setup` takes the same
`--qr-file` option.

## Check and log out

```sh
tg account show              # who this profile is logged in as
tg account list              # every profile on this computer, and the account each is logged in as
tg account sessions list     # every device and app logged in to the account; ends nothing
tg session end               # log out on Telegram's side, and delete the session file here
```

`tg session end` ends the session **on Telegram's side too**: the device disappears from the list in
the app. It does not delete the app id and hash from the keyring, and it leaves the local store as
it is.

## How long a session lives

Until it is ended: by `tg session end`, from the list of devices in a Telegram app, or by Telegram
itself once the session has gone unused for longer than the account's limit for inactive sessions
(`authorization_ttl_days` in
[Telegram's API](https://core.telegram.org/method/account.setAuthorizationTTL)), which the apps let
you set in the list of devices. A profile that runs every day never reaches it. When a session has
ended, every command answers "not logged in, or the session was ended" with exit code `4`; log in
again with `tg session start`
([what to do when the session was ended](troubleshooting.md#not-logged-in-or-the-session-was-ended--run-tg-session-start)).

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

What each profile is for, and how a profile works with a bot: [profiles and bots](profiles.md).

## Where the parts are kept

| What | Where |
|---|---|
| the session | `sessions/<profile>.session` in the state directory |
| the app id and hash | the OS keyring, service `tg-cli`, entry `<profile>:api` |
| the app id and hash, with no keyring | `credentials.json` in the settings directory |
| the app id and hash, for CI | `TG_API_ID` and `TG_API_HASH`; they win over the keyring |

The directories are listed in [where files go](installation.md#where-files-go).

On a machine with no keyring (a container, often), the app goes into `credentials.json` beside the
settings, and `tg` says so once on stderr.

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` and `TG_CACHE_DIR` move the keyring entry too.** With any of
> them set, the service name includes the settings directory. A login made without them is invisible
> with them, and the other way round. Set them always, or never.

> ⚠ **On Linux the keyring is reached through `XDG_RUNTIME_DIR`.** cron, ssh and some MCP clients
> start `tg` without it, and every command then says the app credentials were not found "although it
> has logged in on this machine". **Do not log in again**: that adds another device and does not fix
> the environment. Set `XDG_RUNTIME_DIR`
> ([app credentials not found after a login](troubleshooting.md#no-telegram-app-credentials-found--although-it-has-logged-in-on-this-machine)).

## Next

- [Read your first chats](usage.md)
- [Settings, and the order they resolve in](configuration.md)
- [What reaches the disk, and what never does](security.md)
