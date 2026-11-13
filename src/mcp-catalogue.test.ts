import { describeProgram } from "@wirecat/cli-base/commands"
import { toolsFromCommands } from "@wirecat/cli-core/mcp"
import { ownCatalogue } from "@wirecat/cli-core/testing"
import { expect, it } from "vitest"
import { createProgram } from "./whole-program.js"

const PERSONAL = { exclude: [["bot"]], offline: true }

it("**pins tg's own personal catalogue**: cli-core pins the commands it mounts (NEED-1433)", async () => {
  const catalogue = ownCatalogue(createProgram(), PERSONAL)
  await expect(`${JSON.stringify(catalogue, null, 2)}\n`).toMatchFileSnapshot("../contracts/mcp-catalogue.json")
})

it("**pins the bot's own catalogue**: the generated Bot API commands, as read or write", async () => {
  const catalogue = ownCatalogue(createProgram(), { root: ["bot"], includeUnavailable: true, offline: true })
  await expect(`${JSON.stringify(catalogue, null, 2)}\n`).toMatchFileSnapshot("../contracts/bot-mcp-catalogue.json")
})

it("**keeps tg's invariants**: sending is a write, and login, account removal and long runs stay in a terminal", () => {
  const tools = toolsFromCommands(describeProgram(createProgram()), PERSONAL)
  const level = Object.fromEntries(tools.map((tool) => [tool.command, tool.writes ? "write" : "read"]))
  expect(level).toMatchObject({ "messages send": "write", "messages list": "read", "chats list": "read" })
  for (const left of ["setup", "session start", "session end", "account remove", "watch", "serve", "mcp serve"])
    expect(level).not.toHaveProperty([left])
})
