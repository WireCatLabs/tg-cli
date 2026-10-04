# Installation

`tg` is one command, installed as an ordinary npm package. It builds nothing at install time: SQLite
comes from the runtime itself, so there is no native module to compile. It starts nothing in the
background by itself either. Global npm installation can install the bundled agent instructions
and, on Windows, repair the user PATH. It never logs in or reads chats during installation.

## What it needs

- **Node 22.16+ (22.x) or 24+** with npm. The command also supports **Bun**.
- Linux, macOS or Windows.
- **Your own Telegram app** from [my.telegram.org](https://my.telegram.org/apps). `tg` asks for it at
  the first login and can register it for you ([sessions.md](sessions.md#the-app-from-mytelegramorg)).

## Install

```sh
npm install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
# The global install puts the skill in .agents and .claude. Then: tg setup

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

`tg --help` shows setup and the agent instructions immediately after installation. `tg skill show`
works before login: an agent should read it before connecting Telegram. `tg commands --json`
lists the available commands and flags. These hints work even when the package manager skips
installation scripts.

Run this in a local terminal:

```sh
tg setup --agent codex
tg setup --help              # examples, login choices and Windows instructions
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

### Windows: one install command

Run this in PowerShell with Node.js 22.16+ or 24+ installed:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
```

The installer installs the npm package, preserves existing user PATH entries, adds the npm command
folder once, updates the current PowerShell PATH and installs the bundled skill before login.
It verifies that bare `tg` starts. `-Agent codex|cursor|claude|gemini|all|none` selects where the
skill goes; default `all` installs both supported directories. Repeating installation refreshes
the skill without duplicating PATH. The installer also completes these steps when npm lifecycle
scripts are disabled.

PowerShell's execution policy is unchanged. The installer removes only npm's generated `tg.ps1`
shim for this package, keeping `tg.cmd`, so bare `tg` works under a restricted policy too.
An unrelated script with that name is left untouched and reported as a conflict.

Global npm installation also repairs persistent Windows PATH and installs both skills when its
postinstall script is allowed:

```powershell
npm.cmd install -g --allow-scripts=@leemour/tg-cli --foreground-scripts @leemour/tg-cli
```

Newer npm versions can skip lifecycle scripts unless allowed. `--ignore-scripts` explicitly skips
this package hook too. For agent-led setup, use npm and verify the command, installed skill and
shell PATH before login. The optional PowerShell installer updates the terminal running it as well
as persistent PATH; an npm child process cannot update its parent's environment. Agents launched before installation should refresh their shell PATH
from the user and machine environment themselves, without asking the user to edit PATH.

The global hook runs only for a global npm installation, never for project dependencies or npx.
`TG_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` selects the skill; `none` explicitly opts out.
An agent reads `tg skill show` and verifies its installed skill before guiding account login.
No separate Windows executable is needed.

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

### Upgrade JSON result

`tg upgrade --check --json` reports current and available versions without installing.
The common result contains `current`, `latest`, `newer`, `installer`, `command`, `updated` and
`restarted`, the profiles whose servers restarted after the update. Checks, unchanged versions
and updates with no restart return an empty array; previous fields remain.
Telegram retains its managed-server restart policy; a server that needs a manual restart is named
on stderr. Scripts checking the exact set of JSON keys should allow the `restarted` field on all paths.

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
