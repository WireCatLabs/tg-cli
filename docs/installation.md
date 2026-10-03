# Installation

`tg` is one command, installed as an ordinary npm package. It builds nothing at install time: SQLite
comes from the runtime itself, so there is no native module to compile. It starts nothing in the
background by itself either.

## What it needs

- **Node 22.16 or newer.** CI runs on Node 24; 22.16 is the floor written in `package.json`. CI also runs
  the built command under Bun.
- Linux, macOS or Windows.
- **Your own Telegram app** from [my.telegram.org](https://my.telegram.org/apps). `tg` asks for it at
  the first login and can register it for you ([sessions.md](sessions.md#the-app-from-mytelegramorg)).

## Install

```sh
npm install -g @leemour/tg-cli
pnpm add -g @leemour/tg-cli
bun add -g @leemour/tg-cli
```

The package is **`@leemour/tg-cli`**; the command it installs is **`tg`**.

To try it without installing:

```sh
npx @leemour/tg-cli --help
```

Check that it works:

```sh
tg --version
tg --help
tg doctor        # where its files are, and whether a login exists; connects to nothing
```

## First run

Run this in a local terminal:

```sh
tg setup --agent codex
```

Choose `codex`, `cursor`, `claude`, `gemini`, `all` or `none`. Without `--agent`, the command asks
at a terminal; `--json` and non-terminal runs default to `none`. Allow about five minutes for
app registration, login, a check of the first five chats and skill installation. Downloading chat
history is separate and can take longer: choose a chat and the amount before running the suggested
`store fetch` command. Setup starts no background service.

`tg setup --app browser` opens the manual app registration instructions; `--method phone` uses
a phone login instead of QR. The app-registration code from my.telegram.org and the account-login
code are separate steps. Repeating setup checks your existing session without another login.
If a login was interrupted or Telegram ended the session, finish `tg session start` first and
then rerun setup. See [sessions.md](sessions.md).

Without a global installation, use `npm exec --yes --package=@leemour/tg-cli -- tg setup --agent codex`.
Setup suggests subsequent commands in the same form.

### Windows terminal

Install a supported Node.js release, then open a new PowerShell window. If PowerShell blocks
`npm.ps1` or `tg.ps1`, use their command wrappers:

```powershell
npm.cmd install -g @leemour/tg-cli
tg.cmd setup --agent codex
```

If `tg.cmd` is not found, run `npm.cmd prefix -g` and add the printed directory to your user PATH,
then open a new terminal. To continue immediately without changing PATH:

```powershell
npm.cmd exec --yes --package=@leemour/tg-cli -- tg setup --agent codex
```

The CLI is an npm package; no separate Windows executable is needed.

The first reading commands are in [usage.md](usage.md#log-in).

## From source

For working on the code, or for a version before it is released:

```sh
git clone https://github.com/leemour/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

In a checkout, `bin/tg` keeps its config, login and store under `.tg/` in the checkout, never in your
real profile. `node dist/bin/tg.js` uses the real directories below.

## Where files go

Three directories per the conventions of the operating system, plus two shared ones:

| What | Linux | macOS | Windows |
|---|---|---|---|
| settings | `~/.config/tg-cli/` | `~/Library/Preferences/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| state | `~/.local/share/tg-cli/` | `~/Library/Application Support/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| cache | `~/.cache/tg-cli/` | `~/Library/Caches/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| the local store | `~/.local/share/cli-messaging/messages.db` | under `~/Library/Application Support/cli-messaging/` | under `%LOCALAPPDATA%\cli-messaging\Data\` |
| speech models | `~/.cache/cli-common/models/audio/` | under `~/Library/Caches/cli-common/` | under `%LOCALAPPDATA%\cli-common\Cache\` |

- **settings** hold `config.json`, and `credentials.json` only on a machine with no keyring.
- **state** holds the login (`sessions/<profile>.session`), recorded runs (`runs/`), the journal of
  sends (`sends/`), the list of allowed recipients (`profiles/`), `inbox --new`'s saved point
  (`inbox/`), background fetch jobs, and `serve`'s log and lock.
- **the local store** is shared with other messenger CLIs built on the same library, such as
  [max-cli](https://github.com/leemour/max-cli). It is described in [archive.md](archive.md).
- **speech models** are downloaded only when you ask (`tg models audio download`), for
  `messages transcribe --local`.

`tg doctor` prints the exact paths on this machine.

Each directory can be moved with a variable: `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR`,
`MESSAGING_STORE` (the store file itself) and `CLI_COMMON_CACHE_DIR` (the models).

> ⚠ **`TG_CONFIG_DIR`, `TG_STATE_DIR` and `TG_CACHE_DIR` also move the keyring entry.** A login made
> with one of them set is invisible without it, and the other way round: the command answers "no
> session" although you are logged in. Set them always, or never. `tg config show` says when one is
> set.

## Shell completion

Tab completes commands, options and their values. Where a chat is expected, it offers chats from the
local store. One line in your shell's startup file:

```sh
echo 'source <(tg complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(tg complete bash)' >> ~/.bashrc    # bash
tg complete fish | source                         # fish, in config.fish
```

PowerShell: `tg complete powershell | Out-String | Invoke-Expression` in your profile.

A Tab **never connects to Telegram**. With no local store yet, only commands and options complete.

## Upgrade

```sh
tg upgrade            # with the package manager that installed tg: npm, pnpm or bun
tg upgrade --check    # only say whether a newer version exists; installs nothing
```

`tg upgrade` also restarts a background `serve` it finds running, so the server does not keep running
the old code. It never runs by itself.

Once a day, at a terminal, `tg` says on stderr that a newer version is on npm. It never says so with
`--json`, into a pipe, with `--quiet` or in CI. To turn it off: `tg config set updateCheck false
--defaults`, or `TG_NO_UPDATE_CHECK=1`.

From source: `git pull && pnpm install && pnpm build`. From npx: `npx @leemour/tg-cli@latest`.

## Uninstall

Removing the command leaves your data. Log out first, while `tg` is still there:

```sh
tg server uninstall                  # if you installed the background unit; stop it first
tg session end                       # logs out on Telegram's side and deletes the session file
npm uninstall -g @leemour/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
```

`tg session end` does not remove the app id and hash from the keyring. They sit under the service
`tg-cli`; remove that entry with your system's keyring tool if you want them gone.

The local store is shared with other tools. Delete `~/.local/share/cli-messaging/` only if nothing
else uses it: it holds the messages every one of them has read.

## Next

[usage.md](usage.md) — log in, and the first commands.
