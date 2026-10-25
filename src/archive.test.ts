import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import type { Message } from "@wirecat/cli-core"
import { unitScope } from "@wirecat/cli-core/background"
import type { ServerSystem } from "@wirecat/cli-core/cli"
import { describe, expect, it, vi } from "vitest"
import { TG } from "./app.js"
import { pathsFor } from "./paths.js"
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

const tg = async (argv: string[], store: string, env: NodeJS.ProcessEnv = {}, stdin = "") => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, MESSAGING_STORE: store, TG_API_ID: "1", TG_API_HASH: "h", ...env },
    adapter: () => telegram,
    system,
    stdin: Object.assign(Readable.from([stdin]), { isTTY: false }),
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
  await tg(["archive", "messages", "sync", CHAT, "--limit", "100", "--pause", "1ms"], store)
  return store
}

describe("the archive, from the store", () => {
  it("**rebuilds a chat's conversations** from the store, the agents' refresh", async () => {
    const store = await backfilled()

    const rebuilt = await tg(
      ["archive", "conversations", "rebuild", "--chat", CHAT, "--max-chats", "1", "--max-chunks", "10", "--json"],
      store,
    )

    expect(rebuilt.code).toBe(0)
    expect(JSON.stringify(rebuilt.answer)).toContain(CHAT)
  })

  it("**builds a chat's conversations** from what was fetched, and says why a message is in one", async () => {
    const store = await backfilled()

    const built = await tg(["archive", "conversations", "links", "rebuild", "--chat", CHAT, "--json"], store)
    expect(built.answer).toMatchObject({ item: { chat: CHAT, messages: 3, conversations: 1 } })
    const listed = await tg(
      ["archive", "conversations", "list", CHAT, "started_at>=2026-09-01", "--limit", "5", "--json"],
      store,
    )
    const [first] = (listed.answer as { items: { id: string; messages_count: number }[] }).items
    expect(first).toMatchObject({ messages_count: 3 })
    const shown = await tg(["archive", "conversations", "show", String(first?.id), "--json"], store)
    expect((shown.answer as { item: { messages: { id: string }[] } }).item.messages.map(({ id }) => id)).toEqual([
      "101",
      "102",
      "103",
    ])
    const links = await tg(["archive", "messages", "links", CHAT, "103", "--json"], store)
    expect(links.answer).toMatchObject({ item: { chain: ["102", "101"] } })
  })

  it("**hands a chat to the user's agent in batches**: how much is left, then the next batch", async () => {
    const store = await backfilled()
    await tg(["archive", "conversations", "links", "rebuild", "--chat", CHAT, "--json"], store)

    const status = await tg(
      ["archive", "conversations", "batches", "status", "--chat", CHAT, "--size", "10", "--json"],
      store,
    )
    expect(status.code).toBe(0)
    const next = await tg(
      ["archive", "conversations", "batches", "show", "--chat", CHAT, "--size", "10", "--json"],
      store,
    )
    expect(next.code).toBe(0)
  })

  it("**stores the agent's answer** read from stdin, and drops one model's answers", async () => {
    const store = await backfilled()
    const next = await tg(["archive", "conversations", "batches", "show", "--chat", CHAT, "--json"], store)
    const { batch } = (next.answer as { item: { batch: string } }).item
    const answer = JSON.stringify({ model: "m", answers: [{ message: "103", parent: "101", confidence: 0.9 }] })

    const added = await tg(["archive", "conversations", "links", "add", "--batch", batch, "--json"], store, {}, answer)
    expect(added.answer).toMatchObject({ item: { chat: CHAT, stored: 1 } })
    const cleared = await tg(
      ["archive", "conversations", "links", "clear", "--chat", CHAT, "--answer-model", "m", "--json"],
      store,
    )
    expect(cleared.answer).toMatchObject({ item: { chat: CHAT, cleared: 1 } })
  })

  it("**embeds and searches a chat by meaning** through a model server, and refuses a model not downloaded", async () => {
    const store = await backfilled()
    await tg(["archive", "conversations", "links", "rebuild", "--chat", CHAT, "--json"], store)
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      const { input } = JSON.parse(String(init.body)) as { input: string[] }
      const dims = url.startsWith("https://api.openai.com") ? 1536 : 8
      return new Response(
        JSON.stringify({ data: input.map((_, index) => ({ index, embedding: [1, ...new Array(dims - 1).fill(0)] })) }),
      )
    })
    const env = { TG_OPENAI_API_KEY: "sk-test", WIRECAT_STATE_DIR: mkdtempSync(join(tmpdir(), "models-")) }
    const server = ["--base-url", "http://127.0.0.1:11434/v1", "--model", "m", "--dims", "8"]
    try {
      const embedded = await tg(
        [
          "archive",
          "conversations",
          "embed",
          "--chat",
          CHAT,
          ...server,
          "--concurrency",
          "2",
          "--max-tokens",
          "100000",
          "--json",
        ],
        store,
        env,
      )
      expect(embedded.answer).toMatchObject({ item: { chat: CHAT, embedded: 1 } })
      const status = await tg(
        ["archive", "conversations", "embeddings", "status", "--chat", CHAT, ...server, "--json"],
        store,
        env,
      )
      expect(status.answer).toMatchObject({ item: { embedded: 1, left: 0 } })
      const found = await tg(
        [
          "archive",
          "search",
          "conversations",
          "invoice",
          "--chat",
          CHAT,
          "--since-time",
          "2026-09-01",
          "--limit",
          "5",
          ...server,
          "--json",
        ],
        store,
        env,
      )
      expect((found.answer as { items: unknown[] }).items).toHaveLength(1)

      const fresh = await tg(["archive", "conversations", "status", "--chat", CHAT, ...server, "--json"], store, env)
      const related = await tg(
        ["archive", "conversations", "related", CHAT, "101", "--limit", "3", ...server, "--json"],
        store,
        env,
      )
      expect(fresh.code).toBe(0)
      expect(related.code).toBe(0)

      const openai = ["--embedding-provider", "openai"]
      expect(
        (await tg(["archive", "conversations", "embed", "--chat", CHAT, ...openai, "--json"], store, env)).code,
      ).not.toBe(0)
      expect(
        (
          await tg(
            ["archive", "conversations", "embeddings", "status", "--chat", CHAT, ...openai, "--json"],
            store,
            env,
          )
        ).answer,
      ).toMatchObject({ item: { left: 1 } })
      expect(
        (await tg(["archive", "conversations", "status", "--chat", CHAT, ...openai, "--json"], store, env)).code,
      ).toBe(0)
      expect(
        (await tg(["archive", "conversations", "related", CHAT, "101", ...openai, "--json"], store, env)).code,
      ).not.toBe(0)
      expect((await tg(["archive", "search", "conversations", "invoice", ...openai, "--json"], store, env)).code).toBe(
        0,
      )
      expect(
        (await tg(["archive", "conversations", "embeddings", "clear", "--chat", CHAT, ...openai, "--json"], store, env))
          .code,
      ).toBe(0)
      const cleared = await tg(
        ["archive", "conversations", "embeddings", "clear", "--chat", CHAT, ...server, "--json"],
        store,
        env,
      )
      expect(cleared.answer).toMatchObject({ item: { chat: CHAT, cleared: 1 } })

      const local = await tg(
        ["archive", "conversations", "embed", "--chat", CHAT, "--model", "e5-small", "--threads", "2"],
        store,
        env,
      )
      expect(local.stderr.join("\n")).toContain("models download e5-small")
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it("**exports into a folder and again only what changed**, sealed with a password it never keeps", async () => {
    const store = await backfilled()
    const root = mkdtempSync(join(tmpdir(), "tg-folder-"))

    const first = await tg(["archive", "store", "export", CHAT, "--output-dir", join(root, "one"), "--json"], store)
    const second = await tg(["archive", "store", "export", CHAT, "--output-dir", join(root, "one"), "--json"], store)
    const all = await tg(["archive", "store", "export", "--all", "--output-dir", join(root, "all"), "--json"], store)
    const kind = await tg(
      ["archive", "store", "export", "--include", "group,dialog", "--output-dir", join(root, "k"), "--json"],
      store,
    )
    const sealed = await tg(
      ["archive", "store", "export", CHAT, "--output", join(root, "c.sealed"), "--encrypt", "--json"],
      store,
      {},
      "pw one\n",
    )
    const opened = await tg(
      ["archive", "store", "decrypt", join(root, "c.sealed"), "--output", join(root, "c.jsonl"), "--json"],
      store,
      {},
      "pw one\n",
    )
    const backup = await tg(
      ["archive", "store", "backup", join(root, "s.sealed"), "--encrypt", "--json"],
      store,
      {},
      "pw one\n",
    )

    expect(first.answer).toMatchObject({ item: { chats: [{ id: CHAT, messages: 3 }] } })
    expect(second.answer).toMatchObject({ item: { chats: [{ file: null, messages: 0 }] } })
    expect(all.code).toBe(0)
    expect(kind.code).toBe(0)
    expect(sealed.answer).toMatchObject({ item: { count: 3, encrypted: true } })
    expect(opened.code).toBe(0)
    expect(readFileSync(join(root, "c.jsonl"), "utf8").trim().split("\n")).toHaveLength(3)
    expect(backup.answer).toMatchObject({ item: { encrypted: true } })
  })

  it("**builds every changed chat a bounded number at a time**, and counts what a query matches", async () => {
    const store = await backfilled()

    const built = await tg(["archive", "conversations", "links", "rebuild", "--max-chats", "1", "--json"], store)
    const counted = await tg(
      [
        "archive",
        "stats",
        "messages",
        "show",
        "invoice",
        "--by",
        "day",
        "--chat",
        CHAT,
        "--source",
        "personal",
        "--limit",
        "5",
        "--timezone",
        "Europe/Madrid",
        "--json",
      ],
      store,
    )

    const models = { WIRECAT_STATE_DIR: mkdtempSync(join(tmpdir(), "models-")) }
    const embedded = await tg(
      ["archive", "conversations", "embed", "--max-chats", "1", "--max-chunks", "10", "--json"],
      store,
      models,
    )
    const refreshed = await tg(
      [
        "archive",
        "search",
        "conversations",
        "invoice",
        "--catch-up",
        "--max-chats",
        "1",
        "--max-chunks",
        "10",
        "--json",
      ],
      store,
      models,
    )

    expect(built.code).toBe(0)
    expect(counted.code).toBe(0)
    expect(embedded.code).toBe(6)
    expect(embedded.stderr.join("\n")).toContain("models download e5-small")
    expect(refreshed.code).toBe(0)
    expect((refreshed.answer as { missing: unknown[] }).missing).toContainEqual(
      expect.objectContaining({ field: "by", step: "models.download" }),
    )
  })

  it("installs the agents' guide under the home it is given", async () => {
    const home = mkdtempSync(join(tmpdir(), "home-"))
    const { code } = await tg(["skill", "install", "--for", "claude", "--json"], await backfilled(), { HOME: home })
    expect(code).toBe(0)
    expect(existsSync(join(home, ".claude", "skills", "tg-cli", "SKILL.md"))).toBe(true)
    const shown = await tg(["skill", "show", "--for", "claude", "--json"], await backfilled(), { HOME: home })
    expect(shown.code).toBe(0)
    expect(shown.answer).toMatchObject({ target: "claude", content: expect.stringContaining("name: tg-cli") })
  })

  it("**estimates what a full fetch would still cost** without asking Telegram", async () => {
    const store = await backfilled()
    const { code, answer } = await tg(["archive", "messages", "sync", CHAT, "--dry-run", "--json", "--offline"], store)

    expect(code).toBe(0)
    expect(answer).toMatchObject({ item: { chat: CHAT, held: 3, ranges: [{ from: 101, to: 103 }], missing: 100 } })
  })

  it("exports a chat as Markdown, and finds messages by a regular expression", async () => {
    const store = await backfilled()

    const transcript = await tg(["archive", "store", "export", CHAT, "--format", "markdown"], store)
    const localDay = new Date(Date.UTC(2026, 8, 26, 10) + 101 * 60_000).toLocaleDateString("en-CA")
    expect(transcript.stdout.join("\n")).toContain(`## ${localDay}`)
    expect(transcript.stdout.join("\n")).toContain("invoice #8 due")

    const found = await tg(["archive", "search", "messages", "body:/.*invoice.*/", "--json"], store)
    expect((found.answer as { items: { ref: string }[] }).items.map(({ ref }) => ref)).toEqual([
      `msg:telegram/1/${CHAT}/103`,
      `msg:telegram/1/${CHAT}/101`,
    ])
  })

  it("exports into a new file only the owner can read, from --since-time on", async () => {
    const store = await backfilled()
    const file = join(mkdtempSync(join(tmpdir(), "tg-export-")), "chat.jsonl")

    const written = await tg(
      ["archive", "store", "export", CHAT, "--output", file, "--since-time", "2000-01-01", "--json"],
      store,
    )

    expect(written.answer).toMatchObject({ item: { path: file, format: "jsonl", count: 3 } })
    expect(statSync(file).isFile()).toBe(true)
    if (process.platform !== "win32") expect(statSync(file).mode & 0o777).toBe(0o600)
  })
})

describe("doctor reports show", () => {
  it("**explains itself, then writes a report with no message text in it**", async () => {
    const store = await backfilled()
    const explained = await tg(["archive", "doctor", "reports", "show", "--json"], store)
    expect(explained.answer).toMatchObject({ item: { send_to: "https://github.com/WireCatLabs/tg-cli/issues/new" } })

    const runs = join(pathsFor().state, "runs", "2026-09-29", "20260929T100000Z-chats-list-abc123")
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
        "reports",
        "create",
        "--run",
        "20260929T100000Z-chats-list-abc123",
        "--output",
        output,
        "--json",
      ],
      store,
    )

    expect(created.answer).toMatchObject({ item: { path: output, run: "20260929T100000Z-chats-list-abc123" } })
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
    const unit = `tg-serve-${unitScope(TG, "archive", { ...process.env, MESSAGING_STORE: store })}.service`
    const path = join(process.env.XDG_CONFIG_HOME ?? "", "systemd", "user", unit)
    expect(installed.answer).toMatchObject({ item: { unit, path } })
    expect(ran).toEqual([])
    expect(readFileSync(path, "utf8")).toContain('Environment="TG_PROFILE=archive"')
    expect(readFileSync(path, "utf8")).toContain("RestartPreventExitStatus=4")

    const logs = await tg(["archive", "server", "logs", "--limit", "2", "--json"], store)
    expect(logs.answer).toMatchObject({ items: ["one", "two"] })
    expect(ran.at(-1)).toEqual(["journalctl", "--user", "-u", unit, "-n", "2", "--no-pager"])

    await tg(["archive", "server", "uninstall"], store)
    expect(existsSync(path)).toBe(false)
  })
})
