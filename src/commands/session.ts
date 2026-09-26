import { existsSync, rmSync } from "node:fs"
import { CliError } from "@leemour/cli-core"
import { readSecret, terminalQr } from "@leemour/cli-messaging"
import { Argument, Command } from "commander"
import { type ApiCredentials, parseApiHash, parseApiId } from "../telegram/credentials.js"
import { forCommand } from "./context.js"

export const sessionCommand = () => {
  const session = new Command("session").description("log this profile in to Telegram, or out")

  session
    .command("start")
    .description("log in by QR code (default) or by phone number, code and 2FA password")
    .addArgument(new Argument("[method]", "how to log in").choices(["qr", "phone"]).default("qr"))
    .action(async function (this: Command, method: "qr" | "phone") {
      const context = forCommand(this)
      const input = context.stdin
      if (!input.isTTY)
        throw new CliError("validation_error", "`tg session start` asks questions — run it in a terminal")
      const ask = (prompt: string, echo: boolean) => readSecret(prompt, { input, echo })

      const stored = context.credentials.read()
      const typed: ApiCredentials | undefined = stored
        ? undefined
        : {
            id: parseApiId(await ask("api_id from my.telegram.org/apps: ", true)),
            hash: parseApiHash(await ask("api_hash (not shown): ", false)),
          }

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
          phone: () => ask("phone number, international format: ", true),
          code: () => ask("login code: ", true),
          password: () => ask("2FA password (not shown): ", false),
          note: context.renderer.note,
        })
        // Stored only once Telegram has accepted them: a keyring entry cannot be read back to check it.
        if (typed) context.credentials.write(typed)
        context.renderer.result({ profile: context.profile, account })
      } finally {
        await telegram.close()
      }
    })

  session
    .command("end")
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
