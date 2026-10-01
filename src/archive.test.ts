import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Message } from "@leemour/cli-messaging"
import type { ServerSystem } from "@leemour/cli-messaging/cli"
import { describe, expect, it } from "vitest"
import { run } from "./program.js"
import { scripted } from "./testing/scripted.js"

const CHAT = "1234567890"
const message = (id: number, text: string): Message => ({
  id: String(id),
  chatId: CHAT,
  senderId: "777",
  senderName: "Ana",
  timestamp: new Date(Date.UTC(2026, 8, 26, 10) + id * 60_000).toISOString(),
  editedAt: null,
  text,
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
})

const telegram = scripted({
  history: async () => ({
    items: [message(101, "invoice #7 paid"), message(102, "see you at 10"), message(103, "invoice #8 due")],
    hasMore: true,
  }),
})

const ran: string[][] = []
const system: ServerSystem = {
  platform: "linux",
  uid: 1000,
  entry: ["/usr/bin/node", "/opt/tg/dist/bin/tg.js"],
  run: async (argv) => {
    ran.push(argv)
    return { code: 0, stdout: argv[0] === "journalctl" ? "one\ntwo\n" : "", stderr: "" }
  },
  spawn: () => {
    throw new Error("the tests start no serve")
  },
  pause: async () => {},
}

const tg = async (argv: string[], store: string, env: NodeJS.ProcessEnv = {}) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, MESSAGING_STORE: store, TG_API_ID: "1", TG_API_HASH: "h", ...env },
    adapter: () => telegram,
    system,
  })
  const [first] = streams.stdout
  return { code, stdout: streams.stdout, stderr: streams.stderr, answer: first ? tryJson(first) : undefined }
}

const tryJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

const backfilled = async () => {
  const store = join(mkdtempSync(join(tmpdir(), "tg-archive-")), "messages.db")
  await tg(["archive", "store", "fetch", CHAT, "--limit", "100", "--pause", "1ms"], store)
  return store
}

describe("the archive, from the store", () => {
  it("**builds a chat's conversations** from what was fetched, and says why a message is in one", async () => {
    const store = await backfilled()

    const built = await tg(["archive", "conversations", "build", "--chat", CHAT, "--json"], store)
    expect(built.answer).toMatchObject({ chat: CHAT, messages: 3, conversations: 1 })
    const listed = await tg(
      ["archive", "conversations", "list", "--chat", CHAT, "--since-time", "2026-09-01", "--limit", "5", "--json"],
      store,
    )
    const [first] = (listed.answer as { items: { id: string; messageCount: number }[] }).items
    expect(first).toMatchObject({ messageCount: 3 })
    const shown = await tg(["archive", "conversations", "show", String(first?.id), "--json"], store)
    expect((shown.answer as { messages: { id: string }[] }).messages.map(({ id }) => id)).toEqual(["101", "102", "103"])
    const links = await tg(["archive", "messages", "links", CHAT, "103", "--json"], store)
    expect(links.answer).toMatchObject({ chain: ["102", "101"] })
  })

  it("**estimates what a full fetch would still cost** without asking Telegram", async () => {
    const store = await backfilled()
    const { code, answer } = await tg(["archive", "store", "fetch", CHAT, "--estimate", "--json", "--offline"], store)

    expect(code).toBe(0)
    expect(answer).toMatchObject({ chat: CHAT, held: 3, ranges: [{ from: 101, to: 103 }], missing: 100 })
  })

  it("exports a chat as Markdown, and finds messages by a regular expression", async () => {
    const store = await backfilled()

    const transcript = await tg(["archive", "store", "export", CHAT, "--format", "markdown"], store)
    expect(transcript.stdout.join("\n")).toContain("## 2026-09-26")
    expect(transcript.stdout.join("\n")).toContain("invoice #8 due")

    const found = await tg(["archive", "messages", "search", "--regex", "invoice #\\d+ (paid|due)", "--json"], store)
    expect((found.answer as { items: { id: string }[] }).items.map(({ id }) => id)).toEqual(["103", "101"])
  })

  it("exports into a new file only the owner can read, from --since-time on", async () => {
    const store = await backfilled()
    const file = join(mkdtempSync(join(tmpdir(), "tg-export-")), "chat.jsonl")

    const written = await tg(
      ["archive", "store", "export", CHAT, "--output", file, "--since-time", "2000-01-01", "--json"],
      store,
    )

    expect(written.answer).toMatchObject({ path: file, format: "jsonl", count: 3 })
    expect(statSync(file).mode & 0o777).toBe(0o600)
  })
})

describe("doctor report", () => {
  it("**explains itself, then writes a report with no message text in it**", async () => {
    const store = await backfilled()
    const explained = await tg(["archive", "doctor", "report", "--json"], store)
    expect(explained.answer).toMatchObject({ sendTo: "https://github.com/leemour/tg-cli/issues/new" })

    const runs = join(process.env.TG_STATE_DIR ?? "", "runs", "2026-09-29", "20260929T100000Z-chats-list-abc123")
    mkdirSync(runs, { recursive: true })
    writeFileSync(
      join(runs, "run.json"),
      JSON.stringify({
        runId: "20260929T100000Z-chats-list-abc123",
        command: "chats list",
        profile: "archive",
        startedAt: "2026-09-29T10:00:00.000Z",
        status: "failed",
        cliVersion: "0",
      }),
    )
    const output = join(mkdtempSync(join(tmpdir(), "tg-report-")), "report.json")
    const created = await tg(
      [
        "archive",
        "doctor",
        "report",
        "create",
        "--run",
        "20260929T100000Z-chats-list-abc123",
        "--output",
        output,
        "--json",
      ],
      store,
    )

    expect(created.answer).toMatchObject({ path: output, run: "20260929T100000Z-chats-list-abc123" })
    const text = readFileSync(output, "utf8")
    expect(text).not.toContain("invoice")
    expect(text).not.toContain(CHAT)
  })
})

describe("server", () => {
  it("**installs a unit that runs this tg for the profile, and starts nothing**", async () => {
    const store = await backfilled()
    ran.length = 0

    const installed = await tg(["archive", "server", "install", "--json"], store)
    const path = join(process.env.XDG_CONFIG_HOME ?? "", "systemd", "user", "tg-serve-archive.service")
    expect(installed.answer).toMatchObject({ unit: "tg-serve-archive.service", path })
    expect(ran).toEqual([])
    expect(readFileSync(path, "utf8")).toContain('Environment="TG_PROFILE=archive"')

    const logs = await tg(["archive", "server", "logs", "--lines", "2", "--json"], store)
    expect(logs.answer).toMatchObject({ items: ["one", "two"] })
    expect(ran.at(-1)).toEqual(["journalctl", "--user", "-u", "tg-serve-archive.service", "-n", "2", "--no-pager"])

    await tg(["archive", "server", "uninstall"], store)
    expect(existsSync(path)).toBe(false)
  })
})
