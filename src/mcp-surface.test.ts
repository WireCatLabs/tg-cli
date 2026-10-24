import { toJsonSchema } from "@valibot/to-json-schema"
import { memoryKeyring } from "@wirecat/cli-base"
import { describeProgram } from "@wirecat/cli-base/commands"
import { changesAuthorityAt } from "@wirecat/cli-core/cli"
import { createBotServer } from "@wirecat/cli-core/mcp"
import { describe, expect, it } from "vitest"
import { resolveSettings } from "./app.js"
import { botMcpRun, TELEGRAM_BOT } from "./commands/bot.js"
import { createProgram, run } from "./program.js"

const botServer = (permissions: Record<string, "deny" | "readonly" | "ask" | "allow"> = {}) => {
  const root = createProgram()
  return createBotServer({
    bot: TELEGRAM_BOT,
    program: { run: botMcpRun(run, { keyring: memoryKeyring() }), commands: describeProgram(root) },
    authority: changesAuthorityAt(root),
    settings: { ...resolveSettings({ profile: "sales" }, { env: {}, kind: "bot" }), permissions, readOtherBots: false },
    env: {},
  })
}

describe("tg's bot MCP surface", () => {
  it("keeps bot commands discoverable and marks unavailable writes", () => {
    const all = botServer()
    expect(all.offered).toEqual(
      expect.arrayContaining(["messages send", "messages delete", "chats list", "config set", "api get-me"]),
    )
    expect(all.offered.some((command) => /^(auth|mcp)\b|^store (?!fetch$)|comments|people/.test(command))).toBe(false)
    expect(all.offered).toContain("store fetch")
    const reads = botServer({ bot: "readonly" })
    expect(reads.offered).toEqual(all.offered)
    expect(reads.tools.find((tool) => tool.command === "messages send")?.availability?.()).toMatchObject({
      available: false,
    })
    expect(reads.tools.filter((tool) => tool.writes && tool.availability?.().available)).toEqual([])
  })

  it("lists raw API calls with their separate permission requirement", () => {
    const variants: Record<string, "allow">[] = [{}, { bot: "allow" }]
    for (const permissions of variants) {
      const tool = botServer(permissions).tools.find((tool) => tool.command === "api get-me")
      expect(tool?.availability?.()).toMatchObject({ available: false, permission: "bot.api" })
    }
    expect(
      botServer({ "bot.api": "allow" })
        .tools.find((tool) => tool.command === "api get-me")
        ?.availability?.(),
    ).toEqual({ available: true })
    expect(
      botServer()
        .tools.find((tool) => tool.command === "config set")
        ?.availability?.(),
    ).toMatchObject({ available: false, permission: "mcp.authority" })
    expect(
      botServer({ "mcp.authority": "allow" })
        .tools.find((tool) => tool.command === "config set")
        ?.availability?.(),
    ).toEqual({ available: true })
  })

  it("**is pinned**: a command or an argument agents gain or lose shows up in the contract", async () => {
    const catalogue = Object.fromEntries(botServer().tools.map((tool) => [tool.command, toJsonSchema(tool.input)]))

    await expect(`${JSON.stringify(catalogue, null, 2)}\n`).toMatchFileSnapshot("../contracts/bot-catalogue.snap")
  })
})
