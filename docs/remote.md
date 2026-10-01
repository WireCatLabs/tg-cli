# ChatGPT or Claude in the browser

**Status:** this setup is built from the documentation of each tool. We have not run it end to end.
If a step does not work as written, [open an issue](https://github.com/leemour/tg-cli/issues).

`tg mcp` talks to an AI app over a pipe on your own computer. ChatGPT and Claude in the browser
cannot use a pipe: they connect from their own servers, over the internet, to an address you give
them. This page puts two free tools between them and `tg`:

- **[mcp-auth-proxy](https://github.com/sigbit/mcp-auth-proxy)** runs `tg mcp`, and lets a
  connection in only after someone types your password in a login page.
- **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** gives your computer a public HTTPS
  address, such as `https://laptop.tail1234.ts.net`. You do not need to buy a domain.

```
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ mcp-auth-proxy (password) ──▶ tg mcp ──▶ Telegram
```

## Before you start

- **Anyone who gets past the password can read your Telegram.** Use a long password that you use
  nowhere else. Never set it up without the password, and never with a tunnel that has no login.
- **By default the AI app can send.** With the default settings `tg mcp` lets it send, edit,
  react, forward, pin, vote and mark chats read. Serve a profile set to `readonly` if it should only
  read, or start the server with `--confirm-send` to answer yes or no before each change. The
  recipient list and the hourly limit still apply ([mcp.md](mcp.md#what-an-agent-may-do)).
- **The computer that runs `tg` must be on.** To use it from a phone or a laptop with nothing
  installed, run all of this on a small always-on server instead, and log in to `tg` there
  (`tg session start`). Then only a browser is needed on your side.
- **Who can use it:**

| App | Plans | Docs |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education — in developer mode | [developer mode](https://developers.openai.com/api/docs/guides/developer-mode) |
| Claude | every plan; the free plan allows one custom connector | [custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | only adults in the US, with a personal Google account | [connected apps](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Give the computer a public address

Install [Tailscale](https://tailscale.com/download) and sign in. Funnel needs MagicDNS, HTTPS
certificates and permission for Funnel turned on for your tailnet; the
[Funnel page](https://tailscale.com/kb/1223/funnel) shows how. Then, in a terminal you keep open:

```sh
tailscale funnel 8080
```

It prints your address, `https://<device>.<tailnet>.ts.net`. Ctrl-C closes it again.

## 2. Put the login in front of `tg`

Download `mcp-auth-proxy` from [its releases page](https://github.com/sigbit/mcp-auth-proxy/releases).
In a second terminal, type the password at a hidden prompt, so it stays out of your shell history,
and start the proxy with your address:

```sh
read -rs PASSWORD && export PASSWORD
./mcp-auth-proxy \
  --external-url https://<device>.<tailnet>.ts.net \
  --no-auto-tls \
  --listen 127.0.0.1:8080 \
  -- tg mcp
```

`--no-auto-tls` because Tailscale already provides the certificate; `--listen 127.0.0.1:8080`
so that only Funnel on this computer can reach the proxy. The proxy also accepts a GitHub or Google
login limited to your own account instead of a password — see
[its configuration](https://github.com/sigbit/mcp-auth-proxy/blob/main/docs/docs/configuration.md).

## 3. Add it to the AI app

The address to give the app is your Funnel address with `/mcp` at the end:
`https://<device>.<tailnet>.ts.net/mcp`.

- **ChatGPT:** turn on developer mode and add a connector with that address, as
  [developer mode](https://developers.openai.com/api/docs/guides/developer-mode) describes. By default
  ChatGPT asks you to confirm every action that writes.
- **Claude:** add a custom connector with that address, as
  [custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
  describes. In the connector's settings you can set each tool to always allowed, needs approval,
  or blocked.

The app opens the proxy's login page; type the password once.

## Turning it off

Ctrl-C in both terminals. Nothing stays open once Funnel is closed. To stop one app from coming
back, remove its connector in that app's settings, and change the password before you start the
proxy again.

## Something does not work

- **The app says it cannot connect:** check the address in a browser — it should show the proxy's
  login page. If it does not, Funnel is not running or not enabled for the tailnet.
- **It connects but lists no tools:** run `tg mcp` alone once in a terminal; a login that has
  expired shows there (`tg session start`).
- Everything `tg mcp` does is recorded like any other command: `tg runs list`.
