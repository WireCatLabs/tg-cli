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
  createProgram as create,
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
import { botMcp, TELEGRAM_BOT } from "./commands/bot.js"
import { telegramBotApiCommand } from "./commands/bot-api.js"
import { type Environment, SKILL, TELEGRAM } from "./commands/context.js"
import { withProxySecrets } from "./commands/proxy-config.js"
import { sessionCommand } from "./commands/session.js"
import { setupCommand } from "./commands/setup.js"
import { upgradeCommand } from "./commands/update.js"
import { updateNotice } from "./update.js"

/** A revoked or missing login fails the same on every retry; serve reports a locked keyring with another code. */
export const NO_RESTART_ON = [exitCodeFor("authentication_error")]

const definition: ProgramDefinition = {
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
      { command: "mcp --permission …", does: "your account in any agent, with messages.send=deny" },
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
    if (registries)
      registries.description = "skip public ban lists; still ask Telegram for the profile and photos unless --offline"
    contacts?.commands
      .find((command) => command.name() === "context")
      ?.description("what the local store holds about a person; --chat --sync-first explicitly asks Telegram first")
    const audit = program.commands
      .find((command) => command.name() === "chats")
      ?.commands.find((command) => command.name() === "members")
      ?.commands.find((command) => command.name() === "audit")
    audit?.description(
      "members that look like bots, each with its reasons, from the member list and local store; " +
        "--deep checks selected people individually; removes nobody",
    )
    const deep = audit?.options.find((option) => option.long === "--deep")
    if (deep)
      deep.description =
        "also check the top n profiles, oldest photos, up to 1,000 stored messages each and public ban lists, " +
        "which are sent their ids — one person a second"
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
    botCommand({ ...TELEGRAM_BOT, mcp: botMcp(run) }).addCommand(telegramBotApiCommand()),
    skillCommand(TG, SKILL),
    guideCommand(TG, {
      directory: fileURLToPath(new URL("../scenarios", import.meta.url)),
      worksWith: [MEMO_SCENARIOS.personBrief],
    }),
  ],
}

export const createProgram = (): Command => create(definition)

/** Never throws: every outcome is an exit code, and a failure is said once, on stderr. */
export const run = async (argv: string[], environment: Environment = {}): Promise<number> => {
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
