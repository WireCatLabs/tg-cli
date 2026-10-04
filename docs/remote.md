# ChatGPT or Claude in the browser

**Status:** built and tested against a local client. It has not yet been checked end to end with
ChatGPT and Claude through a real tunnel. If a step does not work as written,
[open an issue](https://github.com/leemour/tg-cli/issues).

`tg mcp` talks to an AI app over a pipe on your own computer. ChatGPT and Claude in the browser
cannot use a pipe: they connect from their own servers, over the internet, to an address you give
them. `tg mcp --http` serves the same tools over HTTP with its own login, and
**[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** gives your computer a public HTTPS
address, such as `https://laptop.tail1234.ts.net`. You do not need to buy a domain.

```text
ChatGPT / Claude ──internet──▶ Tailscale Funnel ──▶ tg mcp --http (login) ──▶ Telegram
```

## Before you start

- **Anyone who logs in can read your Telegram.** A login needs a one-time code that `tg` prints
  in your terminal, so only someone who sees that terminal can add an app. Never put a tunnel in
  front of `tg mcp` without `--http`: that would have no login at all.
- **Every change asks first.** Over `--http`, each send, edit, reaction, forward, pin, vote or
  deletion shows you a form in the app before it happens, whatever the profile's level. An app that
  cannot show such a form can only read. Serve a profile set to `readonly` if it should never
  write. The recipient list and the hourly limit still apply ([mcp.md](mcp.md#what-an-agent-may-do)).
- **The computer that runs `tg` must be on.** To use it from a phone or a laptop with nothing
  installed, run all of this on a small always-on server instead, and log in to `tg` there
  (`tg setup --agent none`). Then only a browser is needed on your side.
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
tailscale funnel 8765
```

It prints your address, `https://<device>.<tailnet>.ts.net`. Ctrl-C closes it again.

## 2. Start `tg` with its login

In a second terminal:

```sh
tg mcp --http --public-url https://<device>.<tailnet>.ts.net
```

It listens on `127.0.0.1:8765` only, so nothing but Funnel on this computer can reach it, and
prints a **login code** such as `K7QP-M2XD`. The code works once and for 10 minutes; after each
login `tg` prints a new one. `--port` picks another port; give Funnel the same number.

## 3. Add it to the AI app

The address to give the app is your Funnel address with `/mcp` at the end:
`https://<device>.<tailnet>.ts.net/mcp`.

- **ChatGPT:** turn on developer mode and add a connector with that address, as
  [developer mode](https://developers.openai.com/api/docs/guides/developer-mode) describes.
- **Claude:** add a custom connector with that address, as
  [custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
  describes. In the connector's settings you can also set each tool to always allowed, needs
  approval, or blocked.

The app opens a `tg` login page. Check the line that says where the login goes — it should be
`chatgpt.com` or `claude.ai` — and type the code from the terminal. The app stays logged in for 30
days and renews itself; after that it asks for a new code.

## Turning it off

Ctrl-C in both terminals. Nothing stays open once Funnel is closed. To make every app log in again:

```sh
tg mcp --revoke
```

## Something does not work

- **The app says it cannot connect:** open
  `https://<device>.<tailnet>.ts.net/.well-known/oauth-protected-resource/mcp` in a browser — it
  should show a short JSON document. If it does not, Funnel is not running, not enabled for the
  tailnet, or pointed at another port.
- **The login page says "Too many wrong codes":** five wrong codes lock it until `tg mcp --http`
  restarts. If you did not type them, someone else found your address: restart, and consider a new
  device name in Tailscale.
- **It connects but lists no tools:** run `tg mcp` alone once in a terminal; a login that has
  expired shows there (`tg session start`).
- **A change fails with "the owner did not confirm this":** the app did not show the form, or it was
  declined. Nothing was sent.
- `tg mcp` keeps a failed call as a run, like any other command: `tg runs list`.
