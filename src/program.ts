import { fileURLToPath } from "node:url"
import { exitCodeFor, processStreams } from "@wirecat/cli-base"
import {
  accountCommand,
  attachmentsCommand,
  botCommand,
  chatsCommand,
  commandsCommand,
  completeCommand,
  configCommand,
  contactsCommand,
  conversationsCommand,
  doctorCommand,
  floodCommand,
  guideCommand,
  imagesCommand,
  inboxCommand,
  inSection,
  MEMO_SCENARIOS,
  mcpCommand,
  mentionsCommand,
  messagesCommand,
  metadataCommand,
  modelsCommand,
  overrideSharedContract,
  type ProgramDefinition,
  pollsCommand,
  reactionsCommand,
  recipientsCommand,
  repliesCommand,
  reviewCommand,
  run as runCli,
  runsCommand,
  scheduleCommand,
  searchCommand,
  searchesCommand,
  sendsCommand,
  serveCommand,
  serverCommand,
  skillCommand,
  statsCommand,
  storeCommand,
  tagsCommand,
  tasksCommand,
  topicsCommand,
  watchCommand,
} from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { CONFIG, TG } from "./app.js"
import { needsBotApi } from "./bot-api-need.js"
import { botMcp, TELEGRAM_BOT } from "./commands/bot.js"
import { type Environment, SKILL, TELEGRAM } from "./commands/context.js"
import { withProxySecrets } from "./commands/proxy-config.js"
import { sessionCommand } from "./commands/session.js"
import { setupCommand } from "./commands/setup.js"
import { upgradeCommand } from "./commands/update.js"
import { updateNotice } from "./update.js"

/** A revoked or missing login fails the same on every retry; serve reports a locked keyring with another code. */
export const NO_RESTART_ON = [exitCodeFor("authentication_error")]

// The generated Bot API commands, about 1.5 MB of modules: only a command line that reaches them pays for them.
let botApi: (() => Command) | undefined

/** Builds every later program with `bot api`; the tree walkers' entry (`whole-program.ts`) calls it first. */
export const useBotApi = (group: () => Command): void => {
  botApi = group
}

const bot = (): Command => {
  const command = botCommand({ ...TELEGRAM_BOT, mcp: botMcp(run) })
  return botApi ? command.addCommand(botApi()) : command
}

export const definition: ProgramDefinition = {
  app: TG,
  configuration: CONFIG,
  firstScreen: {
    pitch:
      "your Telegram account for agents and scripts. What it reads stays on your computer; " +
      "search, review and tasks work offline.",
    can: [
      { command: "review 'date>1d'", does: "what changed in every chat since yesterday" },
      { command: "tasks agenda", does: "tasks due, replies you owe, replies you wait for" },
      { command: "inbox --transcribe", does: "unread in every chat, voice as text; marks nothing read by default" },
      { command: "search all invoice", does: "messages and notes, from the local store and Telegram's server" },
      { command: "attachments extract", does: "text of PDFs and documents, ready for search" },
      { command: "schedule agent …", does: "an agent on a timer; it runs read-only and can never send" },
      { command: "mcp serve --permission …", does: "your account in any agent, with messages.send=deny" },
      { command: "TG_READ_ONLY=1 tg …", does: "a run that can read and sync but never send, edit or delete" },
    ],
  },
  configure: (program) => {
    program.commands
      .find((command) => command.name() === "skill")
      ?.addHelpText(
        "after",
        "\nBefore the first login, an agent can read `tg skill show`; no session is needed.\n" +
          "Run `tg personal setup --agent codex` for guided login and skill installation.\n" +
          "To install instructions separately: `tg skill install --for all`.\n",
      )
    const contacts = program.commands.find((command) => command.name() === "contacts")
    const check = contacts?.commands.find((command) => command.name() === "check")
    const registries = check?.options.find((option) => option.long === "--no-registries")
    if (registries && check)
      overrideSharedContract(
        check,
        "Telegram can query its profile and photos independently of the public ban registries.",
        () => {
          registries.description =
            "skip public ban lists; still ask Telegram for the profile and photos unless --offline"
        },
      )
    const contactContext = contacts?.commands.find((command) => command.name() === "context")
    if (contactContext)
      overrideSharedContract(
        contactContext,
        "Telegram's contact context stays local unless the caller explicitly asks to sync.",
        (command) => {
          command.description(
            "what the local store holds about a person; --chat --sync-first explicitly asks Telegram first",
          )
        },
      )
    const membersCheck = program.commands
      .find((command) => command.name() === "chats")
      ?.commands.find((command) => command.name() === "members")
      ?.commands.find((command) => command.name() === "check")
    if (membersCheck)
      overrideSharedContract(
        membersCheck,
        "Telegram supports an explicit deep member check with bounded profile and history reads.",
        (command) => {
          command.description(
            "members that look like bots, each with its reasons, from the member list and local store; --deep checks selected people individually; removes nobody",
          )
        },
      )
    const deep = membersCheck?.options.find((option) => option.long === "--deep")
    if (deep && membersCheck)
      overrideSharedContract(
        membersCheck,
        "Telegram's deep check describes its provider-specific disclosure and request pace.",
        () => {
          deep.description =
            "also check the top n profiles, oldest photos, up to 1,000 stored messages each and public ban lists, which are sent their ids — one person a second"
        },
      )
  },
  commands: () => [
    inSection(sessionCommand(), "setup"),
    inSection(setupCommand(), "setup"),
    accountCommand(TELEGRAM),
    chatsCommand(TELEGRAM),
    contactsCommand(TELEGRAM),
    messagesCommand(TELEGRAM),
    reactionsCommand(TELEGRAM),
    pollsCommand(TELEGRAM),
    modelsCommand(TELEGRAM),
    inboxCommand(TELEGRAM),
    reviewCommand(TELEGRAM),
    topicsCommand(TELEGRAM),
    watchCommand(TELEGRAM),
    serveCommand(TELEGRAM),
    serverCommand(TELEGRAM, { unit: { noRestartOn: NO_RESTART_ON } }),
    scheduleCommand(TELEGRAM),
    storeCommand(TELEGRAM),
    conversationsCommand(TELEGRAM),
    attachmentsCommand(TELEGRAM),
    tagsCommand(TELEGRAM),
    mentionsCommand(TELEGRAM),
    imagesCommand(TELEGRAM),
    metadataCommand(TELEGRAM),
    statsCommand(TELEGRAM),
    tasksCommand(TELEGRAM),
    searchCommand(TELEGRAM, { topics: true }),
    searchesCommand(TELEGRAM),
    floodCommand(TELEGRAM),
    repliesCommand(TELEGRAM),
    recipientsCommand(TELEGRAM),
    sendsCommand(TELEGRAM),
    runsCommand(TG),
    withProxySecrets(configCommand(TG, CONFIG)),
    doctorCommand(TELEGRAM),
    commandsCommand(TG),
    completeCommand(TELEGRAM, CONFIG),
    upgradeCommand(),
    mcpCommand(TELEGRAM),
    bot(),
    skillCommand(TG, SKILL),
    guideCommand(TG, {
      directory: fileURLToPath(new URL("../scenarios", import.meta.url)),
      worksWith: [MEMO_SCENARIOS.personBrief],
    }),
  ],
}

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = async (argv: string[], environment: Environment = {}): Promise<number> => {
  if (!botApi && needsBotApi(argv, environment.env ?? process.env))
    useBotApi((await import("./commands/bot-api.js")).telegramBotApiCommand)
  const notice = updateNotice(argv, {
    ...(environment.tty === undefined ? {} : { tty: environment.tty }),
    ...(environment.update ? { environment: environment.update } : {}),
    ...(environment.env ? { env: environment.env } : {}),
  })
  const code = await runCli(argv, definition, environment as Record<string, unknown>)
  const line = await notice
  if (line && code === 0) (environment.streams ?? processStreams).diagnostic(line)
  return code
}
