import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { checkGuide } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { describe, expect, it } from "vitest"
import { createProgram, run } from "./whole-program.js"

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
  const all = groups(createProgram())

  it("covers every group", () => {
    expect(all.length).toBeGreaterThan(20)
  })

  it.each(all.map((group) => [group.path.join(" "), group] as const))(
    "`%s` shows its own help, naming each subcommand",
    async (_name, { path, subcommands }) => {
      const { code, stdout, help } = await atTerminal(path)

      expect(code).toBe(2)
      expect(stdout).toEqual([])
      expect(help).not.toContain("(outputHelp)")
      expect(help).toMatch(new RegExp(`Usage: tg (<profile> )?${path.join(" ")} `))
      for (const subcommand of subcommands) expect(help).toMatch(new RegExp(`^\\s+${subcommand}\\b`, "m"))
    },
  )
})

const leaves = (command: Command, path: string[] = []): string[][] =>
  command.commands.flatMap((child) => {
    const here = [...path, child.name()]
    return child.commands.length === 0 ? [here] : leaves(child, here)
  })

describe("--help on a command", () => {
  it.each(
    leaves(createProgram())
      .filter(([top]) => top !== "help")
      .map((path) => ({ path, label: path.join(" ") })),
  )("$label prints help and exits 0", async ({ path }) => {
    const streams = captureStreams()
    const code = await run([...path, "--help"], { streams, tty: false, keyring: memoryKeyring() })
    expect(code, streams.stderr.join(" ")).toBe(0)
  })

  it("`setup --help` keeps its Global Options block under the profile usage line", async () => {
    const streams = captureStreams()
    const code = await run(["personal", "setup", "--help"], { streams, tty: false, keyring: memoryKeyring() })
    const text = streams.stdout.join("\n")

    expect(code).toBe(0)
    expect(text).toContain("Usage: tg <profile> setup")
    expect(text).toContain("Global Options:")
  })
})

describe("the root help", () => {
  it("a bare `tg` shows the first screen: what tg can do and where to go next", async () => {
    const { code, stdout, help } = await atTerminal([])

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(help).toContain("What you can do:")
    expect(help).toContain("tasks agenda")
    expect(help).toContain("tg guide")
    expect(help).not.toContain("Getting started")
  })

  it("`help options` lists the options every command takes", async () => {
    const { code, stdout } = await atTerminal(["help", "options"])
    const text = stdout.join("\n")

    expect(code).toBe(0)
    expect(text).toContain("--offline")
    expect(text).toContain("--dry-run")
  })

  it("`--help-all` names every top-level command", async () => {
    const { code, stdout } = await atTerminal(["--help-all"])
    const text = stdout.join("\n")

    expect(code).toBe(0)
    for (const command of createProgram().commands.filter((one) => one.name() !== "help"))
      expect(text).toMatch(new RegExp(`^\\s+${command.name()}\\b`, "m"))
  })
})

describe("tg guide", () => {
  it("every scenario step is a tg command whose options and arguments parse, and the scenarios ship", async () => {
    expect(await checkGuide(createProgram, { packageRoot: process.cwd() })).toEqual([])
  })

  it("lists the scenarios and memo's person-brief", async () => {
    const { code, stdout } = await atTerminal(["guide"])
    const text = stdout.join("\n")

    expect(code).toBe(0)
    expect(text).toContain("catch-up")
    expect(text).toContain("memo guide person-brief")
  })
})
