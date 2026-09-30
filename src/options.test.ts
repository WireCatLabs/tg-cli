import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { MessageEvent } from "@leemour/cli-messaging"
import { describe, expect, it } from "vitest"
import { chat, dialog, message, scripted, tg } from "./testing/scripted.js"
import { VERSION } from "./version.js"

const json = (stdout: string[]) => JSON.parse(stdout[0] ?? "")
const env = (fields: Record<string, string> = {}) => ({ ...process.env, TG_API_ID: "1", TG_API_HASH: "h", ...fields })

describe("the global options", () => {
  it("--version prints the version on stdout and nothing else", async () => {
    const { code, stdout, stderr } = await tg(["--version"])

    expect(code).toBe(0)
    expect(stdout).toEqual([VERSION])
    expect(stderr).toEqual([])
  })

  it("--jsonl prints one JSON object per message, where --json prints one value", async () => {
    const now = new Date().toISOString()
    const unread = scripted({
      chats: async () => ({ items: [{ ...chat, lastMessageAt: now }], hasMore: false }),
      history: async () => ({
        items: [message("1", { timestamp: now }), message("2", { timestamp: now })],
        hasMore: false,
      }),
    })
    const lines = await tg(["inbox", "--since", "1h", "--jsonl"], { adapter: () => unread })
    const value = await tg(["inbox", "--since", "1h", "--json"], { adapter: () => unread })

    expect(lines.stdout.map((line) => JSON.parse(line).id)).toEqual(["1", "2"])
    expect(value.stdout).toHaveLength(1)
  })

  it("--verbose shows the ids a person does not see by default", async () => {
    const plain = await tg(["messages", "list", "Valencia"], { tty: true })
    const verbose = await tg(["messages", "list", "Valencia", "--verbose"], { tty: true })

    expect(plain.stdout.join("\n")).not.toContain(chat.id)
    expect(verbose.stdout.join("\n")).toContain(chat.id)
  })

  it("--quiet turns the diagnostics off", async () => {
    const said = await tg(["quiet", "runs", "list"])
    const quiet = await tg(["quiet", "runs", "list", "--quiet"])

    expect(said.stderr.join("\n")).toContain("nothing recorded")
    expect(quiet.stderr).toEqual([])
  })

  it("--trace shows each request as it happens, on stderr, and keeps stdout to the data", async () => {
    const { code, stdout, stderr } = await tg(["chats", "list", "--trace", "--json"])

    expect(code).toBe(0)
    expect(json(stdout).items).toHaveLength(1)
    expect(stderr.map((line) => JSON.parse(line).event)).toContain("request")
  })

  it("--timeout ends a watch normally, exit 0", async () => {
    const silent = scripted({
      watch: (_onEvent, signal) => new Promise((resolve) => signal.addEventListener("abort", () => resolve())),
    })
    const { code, stdout } = await tg(["watch", "--jsonl", "--timeout", "20ms"], { adapter: () => silent })

    expect(code).toBe(0)
    expect(stdout).toEqual([])
  })

  it("--no-record keeps no run even of a failure", async () => {
    const failing = scripted({
      me: async () => {
        throw new Error("synthetic failure")
      },
    })
    await tg(["unkept", "account", "show", "--no-record"], { adapter: () => failing })
    await tg(["kept", "account", "show"], { adapter: () => failing })

    const profiles = json((await tg(["runs", "list", "--json"])).stdout).map((run: { profile: string }) => run.profile)
    expect(profiles).toContain("kept")
    expect(profiles).not.toContain("unkept")
  })
})

describe("chats list", () => {
  it("--search, --kind and --unread combine over the newest chats", async () => {
    const chats = scripted({
      chats: async () => ({
        items: [
          chat,
          { ...chat, id: "2", title: "Valeting crew", unreadCount: 0 },
          dialog("3", "Valeria", chat.lastMessageAt ?? ""),
        ],
        hasMore: false,
      }),
    })

    const { code, stdout } = await tg(["chats", "list", "--search", "vale", "--kind", "group", "--unread", "--json"], {
      adapter: () => chats,
    })

    expect(code).toBe(0)
    expect(json(stdout).items.map((one: { id: string }) => one.id)).toEqual([chat.id])
  })
})

describe("chats events", () => {
  it("--since and --event pass the moment on and keep only the events named", async () => {
    let since = 0
    const events = scripted({
      chatEvents: async (_chat, window) => {
        since = window.since
        return {
          chatId: chat.id,
          since: new Date(window.since).toISOString(),
          more: false,
          events: [
            {
              messageId: "1",
              timestamp: chat.lastMessageAt ?? "",
              event: "join",
              by: { id: "7", name: null },
              people: [],
            },
            {
              messageId: "2",
              timestamp: chat.lastMessageAt ?? "",
              event: "pin",
              by: { id: "7", name: null },
              people: [],
            },
          ],
        }
      },
    })

    const { code, stdout } = await tg(
      ["chats", "events", "Valencia", "--since", "2026-09-20T00:00:00Z", "--event", "join", "--json"],
      { adapter: () => events },
    )

    expect(code).toBe(0)
    expect(since).toBe(Date.parse("2026-09-20T00:00:00Z"))
    expect(json(stdout).events.map((one: { event: string }) => one.event)).toEqual(["join"])
  })
})

describe("contacts list", () => {
  const people = scripted({
    chats: async () => ({
      items: [dialog("7", "Zoe", "2026-09-27T10:00:00.000Z"), dialog("8", "Ana", "2026-09-20T10:00:00.000Z"), chat],
      hasMore: false,
    }),
  })
  const names = async (...options: string[]) => {
    const { stdout } = await tg(["contacts", "list", "--json", ...options], { adapter: () => people })
    return json(stdout).items.map((person: { name: string }) => person.name)
  }

  it("lists the people of one-to-one chats, newest first or by name", async () => {
    expect(await names()).toEqual(["Zoe", "Ana"])
    expect(await names("--order", "name")).toEqual(["Ana", "Zoe"])
    expect((await tg(["contacts", "list", "--order", "age"], { adapter: () => people })).code).toBe(2)
  })

  it("finds by part of a name, and pages", async () => {
    expect(await names("--search", "zo")).toEqual(["Zoe"])
    expect(await names("--limit", "1", "--page", "2")).toEqual(["Ana"])
    expect(await names("--limit", "1", "--all")).toEqual(["Zoe", "Ana"])
  })
})

describe("messages", () => {
  it("pin --notify tells the chat, a pin without it is quiet", async () => {
    const asked: boolean[] = []
    const adapter = scripted({
      pin: async (_chat, _message, { notify }) => {
        asked.push(notify)
      },
    })

    for (const argv of [["--notify"], []]) {
      expect((await tg(["messages", "pin", "Valencia", "42", ...argv], { adapter: () => adapter })).code).toBe(0)
    }
    expect(asked).toEqual([true, false])
  })

  it("list asks Telegram for that many, older than a message", async () => {
    let asked: unknown
    const adapter = scripted({
      history: async (_chat, window) => {
        asked = window
        return { items: [message("39")], hasMore: true }
      },
    })
    const { code } = await tg(["messages", "list", "Valencia", "--limit", "5", "--before", "40"], {
      adapter: () => adapter,
    })

    expect(code).toBe(0)
    expect(asked).toEqual({ limit: 5, before: "40" })
  })

  it("list --after reads forward from a message id", async () => {
    let asked: unknown
    const forward = scripted({
      historyAfter: async (_chat, window) => {
        asked = window
        return { items: [message("51")], hasMore: false }
      },
    })

    const { code, stdout } = await tg(["messages", "list", "Valencia", "--after", "50", "--json"], {
      adapter: () => forward,
    })

    expect(code).toBe(0)
    expect(asked).toMatchObject({ after: { id: "50" } })
    expect(json(stdout).items.map((one: { id: string }) => one.id)).toEqual(["51"])
  })

  it("context asks for that many either side of the message", async () => {
    let asked: unknown
    const adapter = scripted({
      around: async (_chat, id, window) => {
        asked = { id, ...window }
        return [message(id, { anchor: true } as never)]
      },
    })
    await tg(["messages", "context", "Valencia", "42", "--before", "2", "--after", "3"], { adapter: () => adapter })

    expect(asked).toEqual({ id: "42", before: 2, after: 3 })
  })

  it("download saves the message's file into --output and answers its path", async () => {
    const into = join(mkdtempSync(join(tmpdir(), "tg-download-")), "out")
    const adapter = scripted({
      download: async () => ({
        files: [
          {
            kind: "voice",
            mime: "audio/ogg",
            async *bytes() {
              yield new TextEncoder().encode("opus")
            },
          },
        ],
        skipped: [],
      }),
    })
    const { code, stdout } = await tg(["messages", "download", "Valencia", "42", "--output", into, "--json"], {
      adapter: () => adapter,
    })

    expect(code).toBe(0)
    expect(json(stdout).items).toEqual([{ kind: "voice", path: join(into, "42-1.ogg"), bytes: 4 }])
    expect(readFileSync(join(into, "42-1.ogg"), "utf8")).toBe("opus")
  })

  it("list --transcribe hears the chat's voice messages, and a later list shows them without asking", async () => {
    let asked = 0
    const voiced = scripted({
      history: async () => ({ items: [message("74", { attachments: [{ kind: "voice" }] })], hasMore: false }),
      transcribe: async () => {
        asked++
        return { text: "adiós", pending: false }
      },
    })
    const heard = json(
      (await tg(["messages", "list", "Valencia", "--transcribe", "--json"], { adapter: () => voiced })).stdout,
    )
    const later = json((await tg(["messages", "list", "Valencia", "--json"], { adapter: () => voiced })).stdout)

    expect(heard.items[0].transcript).toBe("adiós")
    expect(later.items[0].transcript).toBe("adiós")
    expect(asked).toBe(1)
  })

  it("transcribe answers a voice message's text", async () => {
    const adapter = scripted({ transcribe: async () => ({ text: "hola", pending: false }) })
    const { code, stdout } = await tg(["messages", "transcribe", "Valencia", "42", "--json"], {
      adapter: () => adapter,
    })

    expect(code).toBe(0)
    expect(json(stdout)).toEqual({ messageId: "42", text: "hola", pending: false, via: "telegram" })
  })

  it("**models audio list puts Parakeet first**, and transcribe --local or --model names the download instead of connecting", async () => {
    const cache = mkdtempSync(join(tmpdir(), "tg-models-"))
    const environment = {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h", CLI_COMMON_CACHE_DIR: cache },
      adapter: () => {
        throw new Error("a missing model must not cost a connection")
      },
    }
    const listed = await tg(["models", "audio", "list", "--json"], environment)
    const local = await tg(["messages", "transcribe", "Valencia", "42", "--local"], environment)
    const model = await tg(["messages", "transcribe", "Valencia", "42", "--model", "gigaam-v3"], environment)
    const unknown = await tg(["models", "audio", "download", "whisper"], environment)

    expect(json(listed.stdout).items[0]).toMatchObject({ id: "parakeet-v3", default: true, downloaded: false })
    expect(local.stderr.join("")).toContain("tg models audio download parakeet-v3")
    expect(model.stderr.join("")).toContain("tg models audio download gigaam-v3")
    expect(unknown.stderr.join("")).toContain("whisper")
  })

  it("reply repeats a send with the --send-id it is given, and answers the message", async () => {
    let asked: unknown
    const adapter = scripted({
      send: async (chatId, text, options) => {
        asked = { chatId, text, ...options }
        return { message: message("43", { text, outgoing: true }), sendId: options.sendId }
      },
    })
    const { code, stdout } = await tg(
      ["messages", "reply", "Valencia", "42", "hola", "--send-id", "987654321", "--json"],
      {
        adapter: () => adapter,
      },
    )

    expect(code).toBe(0)
    expect(asked).toEqual({ chatId: chat.id, text: "hola", sendId: "987654321", replyTo: "42" })
    expect(json(stdout).sendId).toBe("987654321")
  })

  it("send carries --silent, --no-preview and --markdown to the adapter", async () => {
    let asked: unknown
    const adapter = scripted({
      send: async (_chatId, text, options) => {
        asked = options
        return { message: message("44", { text, outgoing: true }), sendId: options.sendId }
      },
    })
    const argv = ["messages", "send", "Valencia", "**hola**", "--silent", "--no-preview", "--markdown", "--json"]
    const { code } = await tg(argv, { adapter: () => adapter })

    expect(code).toBe(0)
    expect(asked).toMatchObject({ silent: true, noPreview: true, markup: [expect.anything()] })
  })

  it("search finds what an earlier read kept, within one chat and up to --limit", async () => {
    const reads = scripted({
      history: async () => ({
        items: [message("61", { text: "piso en Ruzafa" }), message("62", { text: "otro piso" })],
        hasMore: false,
      }),
    })
    await tg(["searching", "messages", "list", "Valencia"], { adapter: () => reads })

    const { code, stdout } = await tg(
      ["searching", "messages", "search", "piso", "--chat", "Valencia", "--limit", "1", "--json"],
      { adapter: () => reads },
    )

    expect(code).toBe(0)
    expect(json(stdout).items).toHaveLength(1)
    expect(json(stdout).items[0].text).toContain("piso")
  })
})

describe("chats members", () => {
  it("list pages with --limit and --page, and --all asks for everyone", async () => {
    const asked: unknown[] = []
    const adapter = scripted({
      members: async (_chat, window) => {
        asked.push(window)
        return { items: [{ id: "7", name: "Ana", username: null }], hasMore: false, chatId: chat.id }
      },
    })

    const paged = await tg(["chats", "members", "list", "Valencia", "--limit", "5", "--page", "2", "--json"], {
      adapter: () => adapter,
    })
    const all = await tg(["chats", "members", "list", "Valencia", "--all", "--json"], { adapter: () => adapter })

    expect([paged.code, all.code]).toEqual([0, 0])
    expect(asked).toEqual([{ limit: 5, offset: 5 }, { offset: 0 }])
  })
})

describe("inbox", () => {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString()
  const [earlier, latest] = [ago(120_000), ago(60_000)]
  const unread = scripted({
    chats: async () => ({ items: [{ ...chat, lastMessageAt: latest }], hasMore: false }),
    history: async (_chat, { limit }) => ({
      items: [message("70", { timestamp: earlier }), message("71", { timestamp: latest })].slice(-limit),
      hasMore: false,
    }),
  })

  it("--since shows what arrived after that time, at most --limit per chat", async () => {
    const { code, stdout } = await tg(["inbox", "--since", "1h", "--limit", "1", "--json"], { adapter: () => unread })

    expect(code).toBe(0)
    const answer = json(stdout)
    expect(answer.chats.flatMap((one: { messages: unknown[] }) => one.messages)).toHaveLength(1)
  })

  it("--transcribe hears the voice messages it shows", async () => {
    const voiced = scripted({
      chats: async () => ({ items: [{ ...chat, lastMessageAt: latest }], hasMore: false }),
      history: async () => ({
        items: [message("73", { timestamp: latest, attachments: [{ kind: "voice", mime: "audio/ogg" }] })],
        hasMore: false,
      }),
      transcribe: async () => ({ text: "hola", pending: false }),
    })
    const answer = json(
      (await tg(["inbox", "--since", "1h", "--transcribe", "--json"], { adapter: () => voiced })).stdout,
    )

    expect(answer.chats[0].messages[0].transcript).toBe("hola")
    expect(answer.unheard).toEqual([])
  })

  it("--all takes in the muted chats it otherwise leaves out", async () => {
    const muted = scripted({
      chats: async () => ({ items: [{ ...chat, lastMessageAt: latest, muted: true }], hasMore: false }),
      history: async () => ({ items: [message("72", { timestamp: latest })], hasMore: false }),
    })
    const quiet = json((await tg(["inbox", "--since", "1h", "--json"], { adapter: () => muted })).stdout)
    const all = json((await tg(["inbox", "--since", "1h", "--all", "--json"], { adapter: () => muted })).stdout)

    expect([quiet.chats, quiet.quiet]).toEqual([[], 1])
    expect(all.chats).toHaveLength(1)
  })

  it("--new starts the next check where this one ended", async () => {
    const first = json((await tg(["checking", "inbox", "--new", "--json"], { adapter: () => unread })).stdout)
    const second = json((await tg(["checking", "inbox", "--new", "--json"], { adapter: () => unread })).stdout)

    expect(first.until).toBeDefined()
    expect(second.since).toBe(first.until)
  })
})

describe("review", () => {
  const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString()
  const [asked, latest] = [ago(30), ago(1)]
  const reviewed = scripted({
    chats: async () => ({ items: [{ ...chat, lastMessageAt: latest, muted: true }], hasMore: false }),
    history: async () => ({
      items: [message("80", { timestamp: asked, text: "¿mañana?" }), message("81", { timestamp: latest })],
      hasMore: false,
    }),
    admins: async () => ["5"],
  })

  it("--since and --all read every message of a muted chat since then, both sides", async () => {
    const quiet = json((await tg(["review", "--since", "2d", "--json"], { adapter: () => reviewed })).stdout)
    const all = json((await tg(["review", "--since", "2d", "--all", "--json"], { adapter: () => reviewed })).stdout)

    expect([quiet.chats, quiet.quiet]).toEqual([[], 1])
    expect(all.chats[0].messages.map((one: { id: string }) => one.id)).toEqual(["80", "81"])
  })

  it("--chat and --unanswered keep one chat's questions that its admins left open", async () => {
    const { code, stdout } = await tg(["review", "--chat", "Valencia", "--unanswered", "12", "--json"], {
      adapter: () => reviewed,
    })

    expect(code).toBe(0)
    expect(json(stdout).chats[0]).toMatchObject({ answeredBy: "owner-and-admins", messages: [{ id: "80" }] })
  })
})

describe("listening", () => {
  const events: MessageEvent[] = [
    { event: "message", message: { ...message("80"), chatTitle: chat.title } },
    { event: "edit", message: { ...message("80"), chatTitle: chat.title } },
    { event: "delete", chatId: chat.id, chatTitle: null, messageId: "80" },
  ]
  const live = scripted({
    watch: async (onEvent, _signal, onReady) => {
      onReady?.()
      for (const event of events) onEvent(event)
    },
  })

  it("watch --events names each line's event, and without it prints messages only", async () => {
    const all = await tg(["watch", "--jsonl", "--events"], { adapter: () => live })
    const plain = await tg(["watch", "--jsonl"], { adapter: () => live })

    expect(all.stdout.map((line) => JSON.parse(line).event)).toEqual(["message", "edit", "delete"])
    expect(plain.stdout.map((line) => JSON.parse(line).id)).toEqual(["80"])
  })

  it("serve keeps what arrives, and says how much when it stops", async () => {
    const { code, stdout } = await tg(["serving", "serve", "--json"], { adapter: () => live })

    expect(code).toBe(0)
    expect(json(stdout).kept).toMatchObject({ message: 1, edit: 1, delete: 1 })
  })
})

describe("backfill", () => {
  it("walks back a page at a time until --max, pausing --pace between pages", async () => {
    const asked: unknown[] = []
    const pages = scripted({
      history: async (_chat, window) => {
        asked.push(window.before)
        const top = window.before === undefined ? 100 : Number(window.before) - 1
        return { items: [message(String(top - 1)), message(String(top))], hasMore: true }
      },
    })
    const { code, stdout } = await tg(["backfill", "Valencia", "--max", "3", "--pace", "1ms", "--json"], {
      adapter: () => pages,
    })

    expect(code).toBe(0)
    expect(json(stdout)).toMatchObject({ chat: chat.id, fetched: 4, complete: false })
    expect(asked).toEqual([undefined, "99"])
  })
})

describe("the journals", () => {
  it("sends list --limit shows only the newest attempts", async () => {
    for (const text of ["uno", "dos"]) await tg(["journal", "messages", "send", "Valencia", text])
    const all = json((await tg(["journal", "sends", "list", "--json"])).stdout)
    const newest = json((await tg(["journal", "sends", "list", "--limit", "1", "--json"])).stdout)

    expect(all).toHaveLength(2)
    expect(newest).toEqual([all[0]])
  })

  it("runs list --limit shows only the newest runs", async () => {
    for (const _ of [1, 2]) await tg(["limited", "chats", "list", "--record"])
    const { stdout } = await tg(["limited", "runs", "list", "--limit", "1", "--json"])

    expect(json(stdout)).toHaveLength(1)
  })
})

describe("config", () => {
  it("set --defaults changes every profile, and unset --defaults takes it back", async () => {
    const limit = async (profile: string) =>
      json((await tg([profile, "config", "show", "--json"])).stdout).settings.find(
        (one: { setting: string }) => one.setting === "limit",
      )

    expect((await tg(["config", "set", "--defaults", "limit", "7"])).code).toBe(0)
    expect(await limit("anyone")).toMatchObject({ value: 7, from: "config defaults" })

    expect((await tg(["config", "unset", "--defaults", "limit"])).code).toBe(0)
    expect(await limit("anyone")).not.toMatchObject({ value: 7 })
  })

  it("--defaults is refused in a process locked to one profile", async () => {
    const { code } = await tg(["config", "set", "--defaults", "limit", "7"], { env: env({ TG_PROFILE_LOCK: "1" }) })
    expect(code).toBe(5)
  })
})

describe("doctor --online", () => {
  it("connects once and reads the account, sending nothing", async () => {
    let sent = false
    const adapter = scripted({
      send: async () => {
        sent = true
        throw new Error("no sends")
      },
    })
    const { code, stdout } = await tg(["doctor", "--online", "--json"], { adapter: () => adapter })

    expect(code).toBe(0)
    expect(json(stdout).online).toMatchObject({ ok: true })
    expect(sent).toBe(false)
  })
})

describe("mcp", () => {
  it("refuses --confirm-send without --allow-send before it serves anything", async () => {
    const { code, stderr } = await tg(["mcp", "--confirm-send"])

    expect(code).toBe(2)
    expect(JSON.parse(stderr[0] ?? "").error.message).toContain("--allow-send")
  })

  it("config carries --allow-send and --confirm-send into the server's arguments", async () => {
    const { code, stdout } = await tg(["mcp", "config", "--allow-send", "--confirm-send", "--json"], {
      mcp: { execPath: "/usr/bin/node", scriptPath: "/opt/tg/dist/bin/tg.js" },
    } as never)

    expect(code).toBe(0)
    expect(JSON.stringify(json(stdout))).toContain('"mcp","--allow-send","--confirm-send"')
  })

  it("config carries --allow-mark-read on its own, without --allow-send", async () => {
    const { code, stdout } = await tg(["mcp", "config", "--allow-mark-read", "--json"], {
      mcp: { execPath: "/usr/bin/node", scriptPath: "/opt/tg/dist/bin/tg.js" },
    } as never)

    expect(code).toBe(0)
    expect(JSON.stringify(json(stdout))).toContain('"mcp","--allow-mark-read"]')
  })

  it("config carries --allow-delete on its own, without --allow-send", async () => {
    const { code, stdout } = await tg(["mcp", "config", "--allow-delete", "--json"], {
      mcp: { execPath: "/usr/bin/node", scriptPath: "/opt/tg/dist/bin/tg.js" },
    } as never)

    expect(code).toBe(0)
    expect(JSON.stringify(json(stdout))).toContain('"mcp","--allow-delete"]')
  })
})
