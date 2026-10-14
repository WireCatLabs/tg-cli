import { memoryKeyring } from "@wirecat/cli-base"
import { BOT_TOOLS, botToolName, commandLookup, createBotServer } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { describe, expect, it } from "vitest"
import { botMcpRun, TELEGRAM_BOT } from "./commands/bot.js"
import { createProgram } from "./program.js"

describe("tg's MCP surface", () => {
  it("**offers only cli-core's tools**, so the router's envelope check covers every one; `bot api` is not a tool", async () => {
    const program = createProgram()
    const group = program.commands.find((one) => one.name() === "bot") as Command
    const { offered } = createBotServer({
      bot: TELEGRAM_BOT,
      commandAt: commandLookup(group),
      settings: { profile: "sales", permissions: {}, readOtherBots: false },
      env: {},
      run: await botMcpRun({ keyring: memoryKeyring() }),
      ...(TELEGRAM_BOT.mcp?.tools ? { tools: TELEGRAM_BOT.mcp.tools } : {}),
    })
    const shared = new Set(BOT_TOOLS.map((tool) => botToolName("tg", tool.words)))

    expect(TELEGRAM_BOT.mcp?.tools).toBeUndefined()
    expect(offered.length).toBeGreaterThan(0)
    expect(offered.filter((name) => !shared.has(name))).toEqual([])
    expect(offered).not.toContain("tg_bot_api")
  })
})
