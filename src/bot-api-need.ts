import { readFileSync } from "node:fs"
import { configFilePath, resolvePaths } from "@wirecat/cli-base"
import { TG } from "./identity.js"

/**
 * Commands that read the whole command tree, or run further commands in this process (serve's relay, the MCP
 * servers) without passing through `run` again.
 */
const WHOLE_TREE = new Set(["commands", "complete", "help", "mcp", "doctor", "config", "serve", "server", "schedule"])

/** `bot` subcommands that never reach `bot api`; any other word may be a typo that commander answers with "api". */
export const BOT_WITHOUT_API = new Set([
  "auth",
  "list",
  "chats",
  "messages",
  "search",
  "recipients",
  "sends",
  "watch",
  "callbacks",
  "webhooks",
  "contacts",
  "me",
])

/** A saved `bot.api.<operation>` permission is checked against the tree on every command, personal ones included. */
const savedBotApiKey = (env: NodeJS.ProcessEnv): boolean => {
  try {
    const path = configFilePath(resolvePaths({ appName: TG.appName, prefix: TG.envPrefix, env }).config)
    return readFileSync(path, "utf8").includes("bot.api")
  } catch {
    return false
  }
}

/** Whether this command line needs the `bot api` group built; a wrong yes costs time, a wrong no breaks a command. */
export const needsBotApi = (argv: readonly string[], env: NodeJS.ProcessEnv): boolean => {
  const end = argv.indexOf("--")
  const words = end < 0 ? argv : argv.slice(0, end)
  if (words.some((word) => word.includes("bot.api"))) return true
  if (words.some((word) => WHOLE_TREE.has(word))) return true
  const bot = words.indexOf("bot")
  if (bot >= 0) {
    const next = words.slice(bot + 1).find((word) => !word.startsWith("-"))
    if (next === undefined || !BOT_WITHOUT_API.has(next)) return true
  }
  return savedBotApiKey(env)
}
