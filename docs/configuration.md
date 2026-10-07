# Configuration

You can use `tg` without a configuration file. Set a value when you want a different default
or need to restrict a profile. Every key, default and environment variable is in the
[configuration reference](configuration-reference.md). Output, errors and agent execution
are covered by the [CLI contract](cli-contract.md).

## Inspect effective values

```sh
tg config show
tg work config show --json
```

The result names the profile, file path, effective values and the source of each value.
This reads configuration; `tg doctor --online` checks the login separately. Credentials
are kept outside the configuration file.

## Change a value

```sh
tg config set limit 50
tg work config set record true
tg config set keepRunsForDays 7 --defaults
tg work config unset limit
```

Without `--defaults`, a change belongs to the current profile. `unset` removes that entry,
so the next layer supplies the value. An unknown key or invalid value fails before writing.
The [reference](configuration-reference.md#the-file) describes manual file editing and bot settings.

## Which value wins

Command flag → environment → profile entry → file defaults → built-in default.
Not every setting has every layer. `TG_PROFILE` chooses a profile for the shell; the first
word of the command overrides it. `TG_TIMEOUT` supplies a command budget; `timeoutMs`
in the file is the wait for one request.

Use `config show` to see the source instead of guessing. The complete rules are in the
[reference](configuration-reference.md#which-value-wins).

## Permissions

`permissions` maps command paths to `deny`, `readonly`, `ask` or `allow`. Deny blocks the
operation; readonly permits reads; ask requires confirmation; allow proceeds without it.
Confirmation never overrides deny.

```sh
tg agent config set permissions.messages readonly
tg agent config set permissions.messages.send allow
```

This profile can read and send messages; other message changes remain restricted. Other
resources are configured separately. Bot paths begin with `bot`. JSON output suppresses
confirmation prompts; `--yes` answers ask, and message deletion uses `--allow-dangerous`.
MCP uses the same deny/readonly restrictions; ask and allow permit the requested write without a server form.

Inheritance, defaults and migration are in the
[permissions reference](configuration-reference.md#what-a-profile-may-do).

## Paths and proxy

On Linux the file is `~/.config/tg-cli/config.json`; other platform paths are listed under
[installation](installation.md#where-files-go). Directory overrides also change which login
is found, so use the same environment for login and later commands. `MESSAGING_STORE`
selects the shared message archive separately.

A proxy is configured through `proxy` or `TG_PROXY`. Schemes, examples and credential handling
are in the [proxy reference](configuration-reference.md#through-a-proxy).

## Shared archive settings

`searchStemmers.cyrillic` and `searchStemmers.latin` belong to the store, shared by both CLIs
and every profile. After changing them, run `tg store reindex`; see
[archive maintenance](archive.md#repair-and-index-maintenance).

## Next

- [Configuration reference](configuration-reference.md): every key and variable.
- [CLI contract](cli-contract.md): commands, output, errors and agents.
- [Security](security.md): send limits, credentials and recorded data.
