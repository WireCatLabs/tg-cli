# Permissions

Use this page before you let an AI agent, a script or another person work with your Telegram
account through `tg`. It shows how to decide, for each profile, what may only be read, what asks
you first, and what may go ahead without a question. By the end you can make a profile read-only,
allow one action such as sending, and know which other checks still apply.

Words this page uses:

- **Profile**: a named set of settings for one account or bot, such as `work`
  ([profiles and bots](profiles.md)).
- **Permission key**: the name of a command or a group of commands, such as `messages` or
  `messages.send`. A longer key is more specific.
- **Access level**: what happens when that command runs: `deny`, `readonly`, `ask` or `allow`.

Start with reading, and allow changes only when you need them.

## Choose an access level

| Level | What happens |
|---|---|
| `deny` | The action is refused, including reading. |
| `readonly` | Reading works; changes are refused. |
| `ask` | A change asks in the terminal. |
| `allow` | The action can run without another question. |

A refusal tells you to check the requested action and settings. It does not mean your account
connection is broken. Do not ask an assistant to remove a restriction just to finish a task.

## Allow one action

```sh
tg work config set permissions.messages.send ask
```

Replace `work` with your profile. For a default that allows reading messages and refuses changes:

```sh
tg work config set permissions.messages readonly
```

More specific keys win: `permissions.messages.send ask` still permits sending, with a question
in the terminal and without a server form over MCP. Set that key to `readonly` to refuse sends.
Check other exceptions with `config show`.

This controls messages. Other actions, such as reactions or chat administration, have their own
permission keys. A complete read-only profile and every key are in
[what a profile may do](configuration-reference.md#what-a-profile-may-do).

## Permissions for a bot

Bot permissions and limits belong to the bot section. To ask before sends in the terminal:

```sh
tg support config set permissions.bot.messages.send ask --bot
tg support config set sends_per_hour 30 --bot
```

## Restrict recipients and repeated sends

A recipient list limits which chats the profile may send to. An hourly send limit helps stop a
loop. These checks remain active when a particular command is allowed.
The commands to manage them are in [the send guard](security.md#the-send-guard).

## A temporary change for an MCP server

Add `--permission messages.send=deny` to the server startup command to refuse sending for that
process. Saved settings stay the same. The flag only tightens: an override that would loosen the
profile's level is refused at startup. Over MCP, `ask` does not require a server form: the app controls
its own approvals and may allow a call without asking again. Use `deny` or `readonly` to refuse changes. [Browser setup](remote.md) explains the full connection.

## Let an agent change its own limits

Over MCP, commands that change what a later run may do are hidden by default: `config set|unset`, recipient lists,
chat rules, reply rules and consents, schedules, `server install`, `skill install`, model keys, media archive timers
and `flood clear`. One key opens them:

```sh
tg work config set permissions.mcp.authority allow
```

For a bot's server add `--bot`: `tg support config set permissions.mcp.authority allow --bot`.
`deny` is the default; `allow` and `ask` both offer them. Leave it at `deny` for a profile you give to an agent:
with it open, the agent can loosen its own permissions. An agent cannot set the key through `config set`, since
that command is behind the key. See [the MCP server](mcp.md#commands-that-change-what-a-later-run-may-do).

## Limits and detailed rules

An assistant that can edit configuration files or run unrestricted terminal commands may be able
to change these settings. Read [security](security.md) before giving that access.
For nested permissions and exact command keys, see
[what a profile may do](configuration-reference.md#what-a-profile-may-do).
