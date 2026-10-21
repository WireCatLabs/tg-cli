import { existsSync, rmSync } from "node:fs"
import { CliError } from "@wirecat/cli-base"
import { annotate } from "@wirecat/cli-base/commands"
import { timezoneOf } from "@wirecat/cli-base/query"
import { type Account, atTerminal, loginQr, readSecret } from "@wirecat/cli-core"
import { servingProfiles } from "@wirecat/cli-core/background"
import {
  asFirstWord,
  commandWords,
  logsInOrOut,
  printItem,
  REMOTE_WRITE,
  refuseCommandName,
  rememberAccount,
  rootOf,
} from "@wirecat/cli-core/cli"
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
  command: string,
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
        `The Telegram application step did not finish. Rerun as \`${command} --app browser\` ` +
          "to copy your app keys from the site yourself.",
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

const clockTime = (time: Date): string => {
  const zone = timezoneOf()
  return `${time.toLocaleTimeString("en-GB", { timeZone: zone })} ${zone}`
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
    alreadyLoggedIn,
  }: {
    profile: string
    account: Account
    session: string
    appKeys: keyof typeof KEYS_IN | null
    alreadyLoggedIn: boolean
  },
  env: NodeJS.ProcessEnv,
): string => {
  const who = [account.username ? `@${account.username}` : undefined, `id ${account.id}`].filter(Boolean).join(", ")
  const home = (env.HOME ?? env.USERPROFILE)?.replaceAll("\\", "/")
  const portable = session.replaceAll("\\", "/")
  const shown = home && portable.startsWith(`${home}/`) ? `~${portable.slice(home.length)}` : session
  return [
    alreadyLoggedIn
      ? `Already logged in as ${account.name ?? "you"} (${who}) — profile ${profile}; nothing was asked. ` +
        `\`tg ${asFirstWord(profile)}session end\` first to log in again.`
      : `Logged in as ${account.name ?? "you"} (${who}) — profile ${profile}.`,
    `Session:  ${shown}`,
    `App keys: ${appKeys ? KEYS_IN[appKeys] : "not stored"}`,
    `Next:     tg ${asFirstWord(profile)}chats list · tg ${asFirstWord(profile)}server install to keep the archive current`,
  ].join("\n")
}

export interface StartSessionOptions {
  method: "qr" | "phone"
  app: "browser" | "auto"
  sms?: boolean
  command?: string
  progress?: (step: "app" | "login") => void
  signal?: AbortSignal
  /** How far the questions sit right, to line up under a setup step. */
  indent?: number
}

export const startSession = async (
  context: CommandContext,
  { method, app, sms, command = "tg session start", progress, signal, indent: pad = 0 }: StartSessionOptions,
) => {
  if (sms && method !== "phone") throw new CliError("validation_error", "--sms is for a phone login")
  const input = context.stdin
  const terminal = atTerminal(input)
  const stored = context.credentials.read()
  // A QR login with stored app keys and no 2FA asks nothing, so an agent can run it and pass the code on as text.
  if (!terminal && (method === "phone" || !stored))
    throw new CliError(
      "validation_error",
      `${command} asks questions — run it in a terminal${method === "qr" ? "; without one it needs stored app keys" : ""}`,
    )
  const ask: Ask = (prompt, echo) => {
    signal?.throwIfAborted()
    if (!atTerminal(input)) {
      throw new CliError("validation_error", `\`${command}\` needs a terminal to ask for the ${prompt.trim()}`)
    }
    return readSecret(`${" ".repeat(pad)}${prompt}`, { input, echo, ...(signal === undefined ? {} : { signal }) })
  }
  const qr = loginQr({
    diagnostic: context.streams.diagnostic,
    note: context.renderer.note,
    indent: pad,
    terminal,
    json: context.format !== "pretty",
  })
  let typedPhone: string | undefined
  // Telegram accepts a session that is still logged in without a question; then nothing here is asked.
  let asked = false
  const phone = async () => {
    asked = true
    typedPhone ??= await ask("phone number, international format: ", true)
    return typedPhone
  }

  progress?.("app")
  const typed: ApiCredentials | undefined = stored
    ? undefined
    : await appCredentials(context, app, command, ask, phone, signal)

  progress?.("login")
  const telegram = await context.open(stored ?? typed)
  context.track(telegram)
  try {
    const account = await telegram.login({
      method,
      ...(sms ? { forceSms: true } : {}),
      showQr: (url, expires) => {
        asked = true
        qr.show(
          url,
          `scan in Telegram → Settings → Devices → Link Desktop Device (valid until ${clockTime(expires)})`,
          expires,
        )
      },
      phone,
      code: () => {
        asked = true
        return ask("login code: ", true)
      },
      password: () => {
        asked = true
        return ask("2FA password (not shown): ", false)
      },
      note: context.renderer.note,
    })
    signal?.throwIfAborted()
    // Stored only once Telegram has accepted them: a keyring entry cannot be read back to check it.
    if (typed) context.credentials.write(typed)
    rememberAccount(TG, context.profile, account.id, context.env)
    const appKeys = context.credentials.source() ?? null
    return { profile: context.profile, account, session: context.sessionPath, appKeys, alreadyLoggedIn: !asked }
  } finally {
    await telegram.close()
  }
}

export const sessionCommand = () => {
  const session = annotate(new Command("session"), { mcp: false }).description(
    "log this profile in to Telegram, or out",
  )

  logsInOrOut(annotate(session.command("start"), { effects: REMOTE_WRITE, lifetime: "interactive" }))
    .description("log in by QR code (default) or by phone number, code and 2FA password")
    .addArgument(new Argument("[method]", "how to log in").choices(["qr", "phone"]).default("qr"))
    .addOption(
      new Option("--app <how>", "the first time only: how to get this profile's app from my.telegram.org")
        .choices(["browser", "auto"])
        .default("browser"),
    )
    .option("--sms", "phone login: ask Telegram to send the code by SMS, not to the app; Telegram may still refuse")
    .addHelpText(
      "after",
      "\nFirst time? Use `tg personal setup` for login, a check of five chats and an agent skill.\n" +
        "\nExamples:\n" +
        "  tg personal session start             QR login; app registration opens in your browser\n" +
        "  tg personal session start --app auto  Obtain app ID/hash automatically\n" +
        "  tg personal session start phone       Phone number, login code and optional 2FA password\n" +
        "  tg personal session start phone --sms The same, with the code by SMS if Telegram agrees\n" +
        "  tg work session start            Log in to the work profile\n" +
        "\nScan in Telegram: Settings > Devices > Link Desktop Device.\n" +
        "For an interrupted or expired session, finish this login, then rerun `tg <profile> setup`.\n" +
        "Agents: read `tg skill show`. Run `tg <profile> session start qr` in the background (it waits for\n" +
        "the scan, and a shell tool shows nothing until it exits), read its output and paste the QR text block\n" +
        "into the chat as a code block, exactly as printed. When a new block is printed, paste it and say the old one expired. With\n" +
        '--json each code is also a stderr line {"event":"qr","qr":{"text","expires_at","scan"}}. Without a\n' +
        "terminal this needs stored app keys and no 2FA; phone login needs a terminal. Login is not an MCP tool.\n",
    )
    .action(async function (this: Command, method: "qr" | "phone") {
      const context = forCommand(this)
      refuseCommandName(context.profile, commandWords(rootOf(this)), "tg")
      const { app, sms } = this.opts<{ app: "browser" | "auto"; sms?: boolean }>()
      const answer = await startSession(context, {
        command: `tg ${asFirstWord(context.profile)}session start`,
        method,
        app,
        ...(sms ? { sms } : {}),
      })
      if (context.format === "pretty") context.streams.data(loggedIn(answer, context.env))
      else {
        const { appKeys, alreadyLoggedIn, account, ...rest } = answer
        printItem(context, {
          ...rest,
          account: { id: account.id, name: account.name, username: account.username },
          app_keys: appKeys,
          already_logged_in: alreadyLoggedIn,
        })
      }
    })

  logsInOrOut(annotate(session.command("end"), { effects: REMOTE_WRITE }))
    .description("log this profile out on Telegram's side and forget the session here")
    .action(async function (this: Command) {
      const context = forCommand(this)
      // Logging out here ends the login serve still holds and deletes the session file under it.
      if (servingProfiles(TG, context.env).includes(context.profile))
        throw new CliError(
          "validation_error",
          `tg serve is running for ${context.profile} — \`tg ${asFirstWord(context.profile)}server stop\` first`,
        )
      if (!existsSync(context.sessionPath)) {
        printItem(context, { profile: context.profile, ended: false })
        return
      }
      await context.withTelegram((telegram) => telegram.logout())
      for (const suffix of ["", "-wal", "-shm"]) rmSync(`${context.sessionPath}${suffix}`, { force: true })
      printItem(context, { profile: context.profile, ended: true })
    })

  return session
}
