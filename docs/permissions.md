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
tg support config set sendsPerHour 30 --bot
```

## Restrict recipients and repeated sends

A recipient list limits which chats the profile may send to. An hourly send limit helps stop a
loop. These checks remain active when a particular command is allowed.
The commands to manage them are in [the send guard](security.md#the-send-guard).

## A temporary change for an MCP server

Add `--permission messages.send=allow` to the server startup command to allow sending for that
process. Saved settings stay the same. Over MCP, `ask` does not require a server form: the app controls
its own approvals and may allow a call without asking again. Use `deny` or `readonly` to refuse changes. [Browser setup](remote.md) explains the full connection.

## Limits and detailed rules

An assistant that can edit configuration files or run unrestricted terminal commands may be able
to change these settings. Read [security](security.md) before giving that access.
For nested permissions and exact command keys, see
[what a profile may do](configuration-reference.md#what-a-profile-may-do).
