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
  it("**offers the bot commands by the profile's levels**: every write by default, none when read-only", () => {
    const all = botServer().offered
    expect(all).toEqual(expect.arrayContaining(["messages send", "messages delete", "chats list"]))
    expect(all.some((command) => /^(api|auth|store|mcp)\b|comments|people/.test(command))).toBe(false)

    const reads = botServer({ bot: "readonly" })
    expect(reads.offered).toEqual(expect.arrayContaining(["messages list", "me"]))
    expect(reads.tools.filter((tool) => tool.writes)).toEqual([])
  })

  it("**is pinned**: a command or an argument agents gain or lose shows up in the contract", async () => {
    const catalogue = Object.fromEntries(botServer().tools.map((tool) => [tool.command, toJsonSchema(tool.input)]))

    await expect(`${JSON.stringify(catalogue, null, 2)}\n`).toMatchFileSnapshot("../contracts/bot-catalogue.snap")
  })
})
