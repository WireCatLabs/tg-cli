# ChatGPT or Claude in the browser

`tg mcp --http` serves the same tools on `127.0.0.1`, behind your HTTPS tunnel. The HTTP server
has its own OAuth login for one owner; no separate authentication proxy is needed.
The local stdin/stdout connection still works as before. The browser setup has not been tested end to end.

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
[ChatGPT developer mode](https://developers.openai.com/api/docs/guides/custom-mcp-server) or
[Claude custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
The login page asks for the code printed in your terminal. It expires after ten minutes;
a new code is printed after each login. Five wrong codes lock login until the server restarts.

Profile `permissions` still decide which tools are available. Every HTTP write requires a confirmation
form, even with `allow`, `--yes` or `--allow-dangerous`. A client without forms cannot perform that write.
Choose `readonly` or `deny` for resources the connector must not change; see [configuration](configuration.md).

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
