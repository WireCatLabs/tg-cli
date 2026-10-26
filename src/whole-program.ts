import { createProgram as create } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { telegramBotApiCommand } from "./commands/bot-api.js"
import { definition, useBotApi } from "./program.js"

useBotApi(telegramBotApiCommand)

/** The whole command tree, `bot api` included, for whatever walks it: docs, the test matrix, contract tests. */
export const createProgram = (): Command => create(definition)
export { run } from "./program.js"
