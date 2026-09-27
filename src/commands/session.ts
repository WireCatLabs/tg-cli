import { existsSync, rmSync } from "node:fs"
import { CliError } from "@leemour/cli-core"
import { annotate } from "@leemour/cli-core/commands"
import { readSecret, terminalQr } from "@leemour/cli-messaging"
import { commandWords, refuseCommandName, rememberAccount, rootOf } from "@leemour/cli-messaging/cli"
import { Argument, Command, Option } from "commander"
import { TG } from "../app.js"
import { openInBrowser } from "../browser.js"
import { type ApiCredentials, parseApiHash, parseApiId } from "../telegram/credentials.js"
import { MY_TELEGRAM, registerApp } from "../telegram/registration.js"
import { type CommandContext, forCommand } from "./context.js"

type Ask = (prompt: string, echo: boolean) => Promise<string>

/** The app registration, asked for once per profile: by opening the site, or by filling it in for the owner. */
const appCredentials = async (
  context: CommandContext,
  how: "browser" | "auto",
  ask: Ask,
  phone: () => Promise<string>,
) => {
  if (how === "auto") {
    const app = await registerApp({
      phone,
      code: () => ask("code from Telegram for my.telegram.org: ", true),
      note: context.renderer.note,
    })
    context.renderer.note(
      app.created ? "registered a new app on my.telegram.org" : "found the app already registered on my.telegram.org",
    )
    return { id: app.id, hash: app.hash }
  }

  const url = `${MY_TELEGRAM}/apps`
  const opened = openInBrowser(url)
  context.renderer.note(
    `${opened ? "opened" : "open"} ${url} — log in, create an app if there is none (any title and short name, platform Desktop), ` +
      "and copy App api_id and App api_hash from it. Or rerun with --app auto to have it done for you",
  )
  return {
    id: parseApiId(await ask("App api_id: ", true)),
    hash: parseApiHash(await ask("App api_hash (not shown): ", false)),
  }
}

export const sessionCommand = () => {
  const session = new Command("session").description("log this profile in to Telegram, or out")

  session
    .command("start")
    .description("log in by QR code (default) or by phone number, code and 2FA password")
    .addArgument(new Argument("[method]", "how to log in").choices(["qr", "phone"]).default("qr"))
    .addOption(
      new Option("--app <how>", "the first time only: how to get this profile's app from my.telegram.org")
        .choices(["browser", "auto"])
        .default("browser"),
    )
    .action(async function (this: Command, method: "qr" | "phone") {
      const context = forCommand(this)
      refuseCommandName(context.profile, commandWords(rootOf(this)), "tg")
      const { app } = this.opts<{ app: "browser" | "auto" }>()
      const input = context.stdin
      if (!input.isTTY)
        throw new CliError("validation_error", "`tg session start` asks questions — run it in a terminal")
      const ask: Ask = (prompt, echo) => readSecret(prompt, { input, echo })
      let typedPhone: string | undefined
      const phone = async () => {
        typedPhone ??= await ask("phone number, international format: ", true)
        return typedPhone
      }

      const stored = context.credentials.read()
      const typed: ApiCredentials | undefined = stored ? undefined : await appCredentials(context, app, ask, phone)

      const telegram = await context.open(stored ?? typed)
      try {
        const account = await telegram.login({
          method,
          showQr: (url, expires) => {
            context.renderer.note(
              `scan in Telegram → Settings → Devices → Link Desktop Device (valid until ${expires.toLocaleTimeString()})`,
            )
            context.streams.diagnostic(terminalQr(url).text)
          },
          phone,
          code: () => ask("login code: ", true),
          password: () => ask("2FA password (not shown): ", false),
          note: context.renderer.note,
        })
        // Stored only once Telegram has accepted them: a keyring entry cannot be read back to check it.
        if (typed) context.credentials.write(typed)
        rememberAccount(TG, context.profile, account.id, context.env)
        context.renderer.result({ profile: context.profile, account })
      } finally {
        await telegram.close()
      }
    })

  annotate(session.command("end"), { mutates: true })
    .description("log this profile out on Telegram's side and forget the session here")
    .action(async function (this: Command) {
      const context = forCommand(this)
      if (!existsSync(context.sessionPath)) {
        context.renderer.result({ profile: context.profile, ended: false })
        return
      }
      await context.withTelegram((telegram) => telegram.logout())
      for (const suffix of ["", "-wal", "-shm"]) rmSync(`${context.sessionPath}${suffix}`, { force: true })
      context.renderer.result({ profile: context.profile, ended: true })
    })

  return session
}
