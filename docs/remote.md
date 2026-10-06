# ChatGPT, Codex or Claude in the browser

`tg mcp --http` serves the same tools on `127.0.0.1`, behind your HTTPS tunnel. The HTTP server
has its own OAuth login for one owner; no separate authentication proxy is needed.
The local stdin/stdout connection still works as before. Claude.ai reading has been confirmed by the owner. Writes with the compatibility mode and
OpenAI web clients still need an end-to-end browser check.

## Start the tunnel and server

Set up Telegram first with `tg setup --agent none`. Keep the computer running while using the connector.
For example, install [Tailscale](https://tailscale.com/download), enable
[Funnel](https://tailscale.com/kb/1223/funnel), and run:

```sh
tailscale funnel 8765
```

In another terminal, use the HTTPS address Funnel printed, without a path:

```sh
tg mcp --http --public-url https://<device>.<network>.ts.net --port 8765
```

Put a profile first if needed: `tg work mcp --http --public-url https://<device>.<network>.ts.net`.
The default local port is `8765`. The server prints a one-time owner code in the terminal.

## Connect the app

Add the tunnel address with `/mcp`, for example `https://<device>.<network>.ts.net/mcp`, as your
remote MCP connector. See the app's instructions:
[OpenAI custom MCP servers](https://developers.openai.com/plugins/quickstart) or
[Claude custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
The login page asks for the code printed in your terminal. It expires after ten minutes;
a new code is printed after each login. Five wrong codes lock login until the server restarts.

Profile `permissions` decide which tools are available. By default, every HTTP write requires a
server confirmation form, even at level `allow`. A client without elicitation forms can only read.
`--yes` and `--allow-dangerous` do not bypass server forms over HTTP.

## Writes from web clients without forms

Add `--http-confirmation permissions` to your server startup command. Tools at effective level
`allow` can then execute without a server form; `ask` still requires one, while `deny` and `readonly`
restrict access. The app's own tool approval is separate: the server cannot verify it, and an app
set to always allow a tool may run it without another prompt.

Repeat `--permission key=level` to override permissions only for this server process.
For example, append `--permission messages.send=allow` to enable sending from a read-only profile.
`--permission messages=allow` overrides saved permissions for the messages resource; built-in
confirmation defaults still apply, so deletion needs its own `--permission messages.delete=allow`
to execute without a form. The saved configuration, recipient restrictions and hourly limits
are unchanged. To override a read refusal, name its resource or command with level `allow`.
See [configuration](configuration.md) for permission keys.

For OpenAI web, add a custom MCP server as a plugin using the `/mcp` address and OAuth.
Use dynamic client registration (DCR) when offered; this server advertises DCR and the S256 code challenge.
The same tools work without MCP prompts, resources or elicitation when their level is `allow`.
Follow the [OpenAI connection guide](https://developers.openai.com/plugins/quickstart) and
[OAuth requirements](https://developers.openai.com/plugins/build/auth).

## Stop or revoke access

Press Ctrl-C in both terminals to stop the server and the tunnel. Existing browser logins survive a normal server restart.
To forget all browser logins for a profile:

```sh
tg mcp --revoke --json
```

Those apps must log in again. This does not end your Telegram session.

## Check a connection

`tg mcp doctor` checks the local MCP handshake and tool list; it does not verify Telegram login or the tunnel.
An explicit network command such as `tg account show` checks the account connection.
Run records are available through `tg runs list`: successful calls require recording to be enabled;
failed calls are retained by default, unless recording was explicitly disabled.
