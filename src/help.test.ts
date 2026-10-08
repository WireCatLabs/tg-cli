import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Command } from "commander"
import { describe, expect, it } from "vitest"
import { createProgram, run } from "./program.js"

// Commander keeps whether a command has its own action private; a group without one only routes.
const routesOnly = (command: Command) => (command as unknown as { _actionHandler: unknown })._actionHandler === null

const groups = (command: Command, path: string[] = []): { path: string[]; subcommands: string[] }[] =>
  command.commands.flatMap((child) => {
    const here = [...path, child.name()]
    const own =
      child.commands.length > 0 && routesOnly(child)
        ? [{ path: here, subcommands: child.commands.map((one) => one.name()) }]
        : []
    return [...own, ...groups(child, here)]
  })

const atTerminal = async (argv: string[]) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: true,
    keyring: memoryKeyring(),
    adapter: () => {
      throw new Error("help must not open Telegram")
    },
  })
  return { code, stdout: streams.stdout, help: streams.stderr.join("\n") }
}

describe("a command group given no subcommand, at a terminal", () => {
  const all = [{ path: [], subcommands: createProgram().commands.map((one) => one.name()) }, ...groups(createProgram())]

  it("covers every group", () => {
    expect(all.length).toBeGreaterThan(20)
  })

  it.each(all.map((group) => [group.path.join(" ") || "tg", group] as const))(
    "`%s` shows its own help, naming each subcommand",
    async (_name, { path, subcommands }) => {
      const { code, stdout, help } = await atTerminal(path)

      expect(code).toBe(2)
      expect(stdout).toEqual([])
      expect(help).not.toContain("(outputHelp)")
      expect(help).toContain(`Usage: tg ${path.join(" ")}`.trimEnd())
      for (const subcommand of subcommands) expect(help).toMatch(new RegExp(`^\\s+${subcommand}\\b`, "m"))
    },
  )
})
