import { chmodSync, existsSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { CliError, indent } from "@leemour/cli-core"
import { annotate } from "@leemour/cli-core/commands"
import { type Account, qrPng, readSecret, terminalQr } from "@leemour/cli-messaging"
import {
  asFirstWord,
  commandWords,
  inputPolicy,
  refuseCommandName,
  rememberAccount,
  rootOf,
} from "@leemour/cli-messaging/cli"
import { Argument, Command, Option } from "commander"
import { TG } from "../app.js"
import { proxiedFetch } from "../bot/proxy.js"
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
  signal?: AbortSignal,
) => {
  if (how === "auto") {
    let app: Awaited<ReturnType<typeof registerApp>>
    const through = context.proxy()
    const fetch = through ? proxiedFetch(through.proxy) : undefined
    try {
      app = await registerApp(
        {
          phone,
          code: () => ask("code from Telegram for my.telegram.org (app registration): ", true),
          note: context.renderer.note,
        },
        { ...(signal === undefined ? {} : { signal }), ...(fetch ? { fetch } : {}) },
      )
    } catch (error) {
      context.renderer.note(
        `The Telegram application step did not finish. Get your app keys in the browser with ` +
          `\`tg ${asFirstWord(context.profile)}session start --app browser\`, then rerun setup.`,
      )
      throw error
    }
    context.renderer.note(
      app.created ? "registered a new app on my.telegram.org" : "found the app already registered on my.telegram.org",
    )
    return { id: app.id, hash: app.hash }
  }

  const url = `${MY_TELEGRAM}/apps`
  const opened = openInBrowser(url)
  context.renderer.note(
    `${opened ? "opened" : "open"} ${url}\n` +
      "1. Log in with your phone number; the site sends its code in the Telegram app.\n" +
      "2. Open API development tools. If no app exists, fill App title and Short name, choose Desktop, and create it.\n" +
      "3. Copy App api_id and App api_hash into this terminal. The hash is hidden as you type.\n" +
      "Or rerun with --app auto to have the application step done for you.",
  )
  return {
    id: parseApiId(await ask("App api_id: ", true)),
    hash: parseApiHash(await ask("App api_hash (not shown): ", false)),
  }
}

const KEYS_IN = {
  environment: "from TG_API_ID and TG_API_HASH",
  keyring: "in the keyring",
  file: "in a file beside the config, where there is no keyring",
} as const

const loggedIn = (
  {
    profile,
    account,
    session,
    appKeys,
  }: { profile: string; account: Account; session: string; appKeys: keyof typeof KEYS_IN | null },
  env: NodeJS.ProcessEnv,
): string => {
  const who = [account.username ? `@${account.username}` : undefined, `id ${account.id}`].filter(Boolean).join(", ")
  const home = (env.HOME ?? env.USERPROFILE)?.replaceAll("\\", "/")
  const portable = session.replaceAll("\\", "/")
  const shown = home && portable.startsWith(`${home}/`) ? `~${portable.slice(home.length)}` : session
  return [
    `Logged in as ${account.name ?? "you"} (${who}) — profile ${profile}.`,
    `Session:  ${shown}`,
    `App keys: ${appKeys ? KEYS_IN[appKeys] : "not stored"}`,
    `Next:     tg chats list · tg server install to keep the archive current`,
  ].join("\n")
}

export interface StartSessionOptions {
  method: "qr" | "phone"
  app: "browser" | "auto"
  qrFile?: string
  command?: string
  progress?: (step: "app" | "login") => void
  signal?: AbortSignal
  /** How far the questions sit right, to line up under a setup step. */
  indent?: number
}

export const startSession = async (
  context: CommandContext,
  { method, app, qrFile, command = "tg session start", progress, signal, indent: pad = 0 }: StartSessionOptions,
) => {
  if (qrFile !== undefined && method !== "qr") throw new CliError("validation_error", "--qr-file is for a QR login")
  const input = context.stdin
  // With the QR in a file, a login with a stored app and no 2FA asks nothing, so an agent can run it.
  if ((!input.isTTY || inputPolicy(input).noInput) && qrFile === undefined)
    throw new CliError("validation_error", `${command} asks questions — run it in a terminal`)
  const ask: Ask = (prompt, echo) => {
    signal?.throwIfAborted()
    if (!input.isTTY || inputPolicy(input).noInput) {
      throw new CliError("validation_error", `\`${command}\` needs a terminal to ask for the ${prompt.trim()}`)
    }
    return readSecret(`${" ".repeat(pad)}${prompt}`, { input, echo, ...(signal === undefined ? {} : { signal }) })
  }
  const qrPath = qrFile === undefined ? undefined : resolve(qrFile)
  let typedPhone: string | undefined
  const phone = async () => {
    typedPhone ??= await ask("phone number, international format: ", true)
    return typedPhone
  }

  const stored = context.credentials.read()
  progress?.("app")
  const typed: ApiCredentials | undefined = stored ? undefined : await appCredentials(context, app, ask, phone, signal)

  progress?.("login")
  const telegram = await context.open(stored ?? typed)
  context.track(telegram)
  try {
    const account = await telegram.login({
      method,
      showQr: (url, expires) => {
        context.renderer.note(
          `scan in Telegram → Settings → Devices → Link Desktop Device (valid until ${expires.toLocaleTimeString()})`,
        )
        if (!qrPath) {
          context.streams.diagnostic(`\n${indent(terminalQr(url).text, pad + 2)}`)
          return
        }
        writeFileSync(qrPath, qrPng(url), { mode: 0o600 })
        chmodSync(qrPath, 0o600)
        context.renderer.note(`the QR code is in ${qrPath} — it is replaced when Telegram renews it`)
      },
      phone,
      code: () => ask("login code: ", true),
      password: () => ask("2FA password (not shown): ", false),
      note: context.renderer.note,
    })
    signal?.throwIfAborted()
    // Stored only once Telegram has accepted them: a keyring entry cannot be read back to check it.
    if (typed) context.credentials.write(typed)
    rememberAccount(TG, context.profile, account.id, context.env)
    const appKeys = context.credentials.source() ?? null
    return { profile: context.profile, account, session: context.sessionPath, appKeys }
  } finally {
    // The image is a login token for as long as it is valid; it does not outlive the login.
    if (qrPath) rmSync(qrPath, { force: true })
    await telegram.close()
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
    .option("--qr-file <png>", "write the QR code to this PNG instead of drawing it, for an agent to pass on")
    .addHelpText(
      "after",
      "\nFirst time? Use `tg setup` for login, a check of five chats and an agent skill.\n" +
        "\nExamples:\n" +
        "  tg session start                 QR login; app registration opens in your browser\n" +
        "  tg session start --app auto      Obtain app ID/hash automatically\n" +
        "  tg session start phone           Phone number, login code and optional 2FA password\n" +
        "  tg work session start            Log in to the work profile\n" +
        "\nScan in Telegram: Settings > Devices > Link Desktop Device.\n" +
        "For an interrupted or expired session, finish this login, then rerun `tg setup`.\n" +
        "Agents: read `tg skill show`; --qr-file needs stored app keys and no 2FA input\n" +
        "when running without a terminal. The temporary image is removed after login.\n",
    )
    .action(async function (this: Command, method: "qr" | "phone") {
      const context = forCommand(this)
      refuseCommandName(context.profile, commandWords(rootOf(this)), "tg")
      const { app, qrFile } = this.opts<{ app: "browser" | "auto"; qrFile?: string }>()
      const answer = await startSession(context, { method, app, ...(qrFile === undefined ? {} : { qrFile }) })
      if (context.format !== "pretty") context.renderer.result(answer)
      else context.streams.data(loggedIn(answer, context.env))
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
