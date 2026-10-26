import { mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { configFilePath, resolvePaths } from "@wirecat/cli-base"
import { botCommand } from "@wirecat/cli-core/cli"
import { describe, expect, it } from "vitest"
import { BOT_WITHOUT_API, needsBotApi } from "./bot-api-need.js"
import { botMcp, TELEGRAM_BOT } from "./commands/bot.js"
import { TG } from "./identity.js"
import { run } from "./program.js"
import { freshHomeEachTest } from "./testing/fresh-home.js"
import { tg } from "./testing/scripted.js"

freshHomeEachTest()

const saveConfig = (config: object) => {
  const path = configFilePath(resolvePaths({ appName: TG.appName, prefix: TG.envPrefix, env: process.env }).config)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(config))
}

describe("building bot api only when a command needs it", () => {
  it.each([
    [["--version"], false],
    [["messages", "list", "chat", "--help"], false],
    [["work", "bot", "messages", "send", "chat", "hi"], false],
    [["bot", "messages", "--help"], false],
    [["messages", "send", "chat", "--", "commands"], false],
    [["bot", "api", "get-me"], true],
    [["work", "--json", "bot", "api", "get-me"], true],
    [["bot", "--help"], true],
    [["bot"], true],
    [["bot", "apu"], true],
    [["bot", "mcp"], true],
    [["help", "bot"], true],
    [["commands", "--json"], true],
    [["complete", "--", "bot", "ap"], true],
    [["mcp"], true],
    [["serve"], true],
    [["config", "set", "--bot", "permissions.bot.api.send-message", "deny"], true],
    [["messages", "list", "chat", "--permission", "bot.api.get-me=deny"], true],
  ])("%j → %s", (argv, needed) => {
    expect(needsBotApi(argv, process.env)).toBe(needed)
  })

  it("skips only the bot commands that exist, so a typo still gets commander's suggestion", () => {
    const names = botCommand({ ...TELEGRAM_BOT, mcp: botMcp(run) }).commands.map((one) => one.name())
    expect([...BOT_WITHOUT_API].filter((name) => !names.includes(name))).toEqual([])
    expect(names.filter((name) => !BOT_WITHOUT_API.has(name)).sort()).toEqual(["commands", "mcp"])
  })

  it("keeps a saved bot.api permission known to a command that does not reach bot api", async () => {
    saveConfig({ profiles: {}, bot: { profiles: { default: { permissions: { "bot.api.send-message": "deny" } } } } })
    expect(needsBotApi(["chats", "list"], process.env)).toBe(true)
    const result = await tg(["chats", "list", "--json"])
    expect(result.stderr.join("")).not.toContain("names no command")
    expect(result.code).toBe(0)
  })
})
