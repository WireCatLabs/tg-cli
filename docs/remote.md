# ChatGPT, Codex or Claude in the browser

`tg mcp --http` serves the same tools on `127.0.0.1`, behind your HTTPS tunnel. The HTTP server
has its own OAuth login for one owner; no separate authentication proxy is needed.
The local stdin/stdout connection still works as before. The owner confirmed reading and sending through Claude web on 7 October 2026 using the
permissions mode. OpenAI web clients and these platform-specific setup instructions still need
an end-to-end check on each platform.

## Start the tunnel and server

Install the CLI and log into your messenger first ([installation](installation.md)). Use the same
OS user and profile for setup and the MCP server. Put a profile before the command when needed:
`tg work mcp`. Tailscale is a separate installation; both `tg` and `max` support this setup.

Install [Tailscale](https://tailscale.com/download), sign in, and enable
[Funnel](https://tailscale.com/docs/features/tailscale-funnel): MagicDNS, HTTPS certificates and
Funnel permission must be enabled in your tailnet. The first Funnel command can print an approval
link. Keep two terminal windows open. Copy the HTTPS origin it prints, without `/mcp` or another
path, into the second window when asked. Keep an explicit public port such as `:8443` in that origin.
The server listens on `127.0.0.1:8765` and prints a one-time login code; it never needs administrator
rights. Only the tunnel may need elevation. These commands enable sending for this server process
using `--http-confirmation permissions --permission messages.send=allow`; see the permissions below.

### Windows (PowerShell)

Install the Tailscale Windows app and sign in from its tray menu. Open a new PowerShell window
after installing Node.js, the CLI and Tailscale so it sees the updated PATH. Use `.cmd` for npm
CLI shims to avoid PowerShell execution-policy errors. If setup is not done yet, run
`tg.cmd setup --agent none` in a normal PowerShell window.

First window: run PowerShell as Administrator for Funnel. The call operator `&` handles the space
in the default installation path; adjust the path if you installed Tailscale elsewhere.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Second window: normal PowerShell, under the user who logged into Telegram:

```powershell
$mcpPublicUrl = Read-Host 'Paste the HTTPS origin printed by Funnel (no /mcp)'
tg.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --http-confirmation permissions --permission messages.send=allow
```

Use native Windows for both processes. WSL is a separate environment: a Windows tunnel pointing
at Windows loopback cannot be assumed to reach a server inside WSL.

### macOS (Terminal)

Install and sign into the Tailscale app. Its CLI is bundled with the app; use this path when
`tailscale` is not on PATH ([CLI guide](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)).
First Terminal window:

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

Second Terminal window, using the same user who ran `tg setup --agent none`. This works in both
zsh and bash:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow
```

### Linux (Terminal)

Install Tailscale using the [Linux instructions](https://tailscale.com/download/linux), then sign
in with `sudo tailscale up`. First terminal window:

```sh
sudo tailscale funnel 8765
```

Second terminal window: use your normal user, without `sudo`, so `tg` finds the session created
by `tg setup --agent none`:

```sh
printf 'Paste the HTTPS origin printed by Funnel (no /mcp): '
IFS= read -r mcpPublicUrl
tg mcp --http --port 8765 --public-url "$mcpPublicUrl" --http-confirmation permissions --permission messages.send=allow
```

## Run MAX and Telegram together

Each server needs its own local port and public HTTPS endpoint. For example, keep Telegram on
local `8765` and public `443`; run a second Funnel command with `--https=8443 8766` and MAX with
`--port 8766`. Use the second Funnel origin, including `:8443`, for MAX's `--public-url` and its
connector URL ending in `/mcp`. Use your platform's Tailscale invocation above for the second
Funnel command. Funnel supports public ports `443`, `8443` and `10000`
([reference](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

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

For ChatGPT / Codex web, open **Plugins**, choose **+ Add custom MCP server**, and create a
plugin with the `/mcp` address and OAuth. Connect with the terminal code, install the plugin,
and enable it in your Work chat (or mention it with `@`). Local Codex `config.toml` does not
configure this web connection. Availability can depend on your account or workspace.
Use dynamic client registration (DCR) when offered; this server advertises DCR and the S256 code challenge.
The same tools work without MCP prompts, resources or elicitation when their level is `allow`.
Follow the [OpenAI connection guide](https://developers.openai.com/plugins/quickstart) and
[OAuth requirements](https://developers.openai.com/plugins/build/auth).

## Stop or revoke access

Press Ctrl-C in both foreground terminals to stop the server and this tunnel. Start them again
with the same commands; existing browser logins survive a normal server restart. If you used
Funnel with `--bg`, Ctrl-C does not stop that background route: check `tailscale funnel status`
and disable only its public port, for example `tailscale funnel --https=443 off`. Use your
platform's invocation above (and elevation where needed). Avoid `funnel reset` when another
server is using Funnel: it clears all routes. Stopping only MCP leaves the route configured but
the tools unavailable. Revoking browser access is separate from stopping a process.
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
