import { accessSync, constants, existsSync, mkdirSync } from "node:fs"
import { CliError } from "@leemour/cli-core"
import { annotate } from "@leemour/cli-core/commands"
import { installSkill, type SkillTarget } from "@leemour/cli-core/skill"
import { readSecret } from "@leemour/cli-messaging"
import {
  asFirstWord,
  type Closeable,
  commandWords,
  environmentOf,
  refuseCommandName,
  rootOf,
  runtime,
  withDeadline,
} from "@leemour/cli-messaging/cli"
import { levelFor } from "@leemour/cli-messaging/sends"
import { Command, Option } from "commander"
import { TG } from "../app.js"
import { pathsFor } from "../paths.js"
import { installer } from "../update.js"
import { type CommandContext, type Environment, forCommand, SKILL } from "./context.js"
import { startSession } from "./session.js"

const AGENTS = ["none", "codex", "cursor", "claude", "gemini", "all"] as const
type Agent = (typeof AGENTS)[number]

type Options = {
  agent?: Agent
  app: "auto" | "browser"
  method: "qr" | "phone"
  qrFile?: string
}

const agentFor = async (context: CommandContext, given?: Agent, signal?: AbortSignal): Promise<Agent> => {
  if (given) return given
  if (context.format !== "pretty" || !context.stdin.isTTY) return "none"
  const answer =
    (
      await readSecret("Agent [codex/cursor/claude/gemini/all/none] (none): ", {
        input: context.stdin,
        echo: true,
        ...(signal === undefined ? {} : { signal }),
      })
    )
      .trim()
      .toLowerCase() || "none"
  if (!AGENTS.includes(answer as Agent))
    throw new CliError("validation_error", `unknown agent — choose ${AGENTS.join(", ")} with --agent`)
  return answer as Agent
}

export const setupCommand = () =>
  annotate(new Command("setup"), { mutates: true })
    .description("set up Telegram and connect your agent")
    .configureHelp({ showGlobalOptions: true })
    .addHelpText(
      "after",
      "\nExamples:\n" +
        "  tg setup                         Guided setup in your local terminal\n" +
        "  tg setup --agent codex           Install the skill for Codex\n" +
        "  tg work setup --agent claude     Set up a separate work profile\n" +
        "  tg setup --app browser           Get app ID/hash through my.telegram.org\n" +
        "  tg setup --method phone          Use a phone login instead of QR\n" +
        "\nAllow about 5 minutes. App registration and account login are separate steps.\n" +
        "Scan the QR in Telegram: Settings > Devices > Link Desktop Device.\n" +
        "Enter codes, app hashes and passwords only in the terminal.\n" +
        "\nAgents: read `tg skill show` first. First login needs a local terminal.\n" +
        "With stored app keys and no 2FA input, an agent can use:\n" +
        "  tg setup --qr-file login.png --agent codex --json\n" +
        "The QR image is removed when login ends. Machine mode skips agent installation\n" +
        "unless --agent is given. Existing sessions are checked without another login.\n" +
        "\nSetup checks five chats. Choose a chat and an amount of history before:\n" +
        "  tg store fetch <chat> --last 100\n" +
        "\nWindows: use tg.cmd or npm.cmd if PowerShell blocks scripts. Without PATH:\n" +
        "  npm.cmd exec --yes --package=@leemour/tg-cli -- tg setup\n",
    )
    .addOption(
      new Option("--agent <agent>", "install the skill for this agent; asks at a terminal, otherwise none").choices(
        AGENTS,
      ),
    )
    .addOption(
      new Option("--app <how>", "how to get your Telegram app credentials the first time")
        .choices(["auto", "browser"])
        .default("auto"),
    )
    .addOption(
      new Option("--method <method>", "how to log in when there is no session").choices(["qr", "phone"]).default("qr"),
    )
    .option(
      "--qr-file <png>",
      "write a temporary login QR image for an agent; needs stored app credentials without a terminal",
    )
    .action(async function (this: Command) {
      const context = forCommand(this)
      refuseCommandName(context.profile, commandWords(rootOf(this)), "tg")
      const options = this.opts<Options>()
      if (context.settings.offline)
        throw new CliError("validation_error", "tg setup verifies Telegram — remove --offline")
      if (options.qrFile && options.method !== "qr")
        throw new CliError("validation_error", "--qr-file is for a QR login")
      for (const permission of ["account.show", "chats.list"] as const) {
        if (levelFor(context.settings.permissions, permission).level === "deny")
          throw new CliError(
            "permission_error",
            `profile ${context.profile} denies ${permission} — setup cannot verify it`,
            { permission },
          )
      }
      const reused = existsSync(context.sessionPath)
      if (!reused && !context.stdin.isTTY && !options.qrFile)
        throw new CliError(
          "validation_error",
          "tg setup needs a terminal for the first login — run it locally; use --qr-file only with stored app credentials",
        )
      const prefix = `tg ${asFirstWord(context.profile)}`
      const command =
        installer(environmentOf<Environment>(this).update) === "npx"
          ? `npm${process.platform === "win32" ? ".cmd" : ""} exec --yes --package=@leemour/tg-cli -- ${prefix}`
          : prefix
      const cancellation = new AbortController()
      const closeables: Closeable[] = [
        {
          close: async () => {
            cancellation.abort()
          },
        },
      ]
      const loginContext: CommandContext = {
        ...context,
        open: async (credentials) => {
          cancellation.signal.throwIfAborted()
          const telegram = await context.open(credentials)
          if (cancellation.signal.aborted) {
            await telegram.close()
            cancellation.signal.throwIfAborted()
          }
          closeables.push(telegram)
          return telegram
        },
      }
      const answer = await withDeadline(context.settings.commandTimeoutMs, closeables, async () => {
        context.renderer.note(
          "Allow about 5 minutes for setup. Downloading chat history is a separate step and can take longer.",
        )
        context.renderer.note("1/5 — checking this computer and the local directories")
        const paths = pathsFor(context.env)
        for (const path of [paths.config, paths.state, paths.cache]) {
          mkdirSync(path, { recursive: true })
          accessSync(path, constants.W_OK)
        }
        if (process.platform === "win32")
          context.renderer.note(
            "Windows: use tg.cmd or npm.cmd if PowerShell blocks scripts. Open a new terminal after installing Node.js.",
          )

        if (reused) {
          context.renderer.note("2/5 — using the stored Telegram app credentials")
          context.renderer.note("3/5 — checking your existing session; no new login")
        } else {
          await context.run(async () => {
            await startSession(loginContext, {
              signal: cancellation.signal,
              method: options.method,
              app: options.app,
              ...(options.qrFile === undefined ? {} : { qrFile: options.qrFile }),
              command: `${prefix}setup`,
              progress: (step) =>
                context.renderer.note(
                  step === "app"
                    ? "2/5 — Telegram application: obtaining your app ID and hash"
                    : "3/5 — Telegram account: confirm the QR login or enter the login code",
                ),
            })
          })
        }

        context.renderer.note("4/5 — verifying the account and reading the first 5 chats")
        const { account, chats } = await context.withTelegram(async (telegram) => {
          closeables.push(telegram)
          cancellation.signal.throwIfAborted()
          if (!telegram.chats) throw new CliError("provider_error", "Telegram connection cannot list chats")
          return { account: await telegram.me(), chats: await telegram.chats({ limit: 5, offset: 0 }) }
        })
        context.renderer.note("5/5 — connecting your agent")
        const agent = await agentFor(context, options.agent, cancellation.signal)
        const targets: readonly SkillTarget[] =
          agent === "all" ? ["claude", "agents"] : [agent === "claude" ? "claude" : "agents"]
        cancellation.signal.throwIfAborted()
        const written = agent === "none" ? [] : installSkill(TG, SKILL, { targets, env: context.env })
        const next = {
          instructions: `${command}skill show`,
          inbox: `${command}inbox --limit 5`,
          chats: `${command}chats list --limit 5`,
          history: `${command}store fetch <chat> --last 100`,
          historyStatus: `${command}store status`,
          ...(agent === "none" ? { skill: `${command}skill install`, mcp: `${command}mcp config` } : {}),
        }
        const answer = {
          profile: context.profile,
          runtime: runtime(),
          paths,
          session: { path: context.sessionPath, reused },
          account: { id: account.id, name: account.name, username: account.username },
          chats: { checked: chats.items.length, hasMore: chats.hasMore },
          agent: { name: agent, written },
          next,
        }
        context.renderer.note(
          "Choose a chat and how much history to fetch before running store fetch. Setup starts no background service.",
        )
        return answer
      })
      const { agent, next, chats } = answer
      if (context.format !== "pretty") context.renderer.result(answer)
      else
        context.streams.data(
          [
            `Telegram is ready — profile ${context.profile}, ${chats.checked} chats checked.`,
            agent.name === "none"
              ? `Agent skill: skipped. Install later: ${next.skill}`
              : `Agent skill: installed for ${agent.name}. Start a new agent session if it is not found.`,
            `For your agent: ${next.instructions}`,
            `Next: ${next.inbox}`,
            `History: ${next.history}`,
          ].join("\n"),
        )
    })
