import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Readable } from "node:stream"
import { stripVTControlCharacters } from "node:util"
import { CliError } from "@wirecat/cli-base"
import { pickChat } from "@wirecat/cli-core"
import type { SendOptions } from "@wirecat/cli-core/cli"
import { describe, expect, it, vi } from "vitest"
import { pathsFor } from "./paths.js"
import { NO_RESTART_ON } from "./program.js"
import { chat, message, scripted, tg } from "./testing/scripted.js"

describe("topic read capability", () => {
  it("refuses topic changes when the adapter has no forum capability", async () => {
    const send = vi.fn()
    const result = await tg(
      [
        "topics",
        "edit",
        chat.id,
        "12",
        "--title",
        "Synthetic title",
        "--closed",
        "on",
        "--pinned",
        "on",
        "--hidden",
        "off",
        "--json",
      ],
      { adapter: () => scripted({ send }) },
    )
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("forum")
    expect(send).not.toHaveBeenCalled()
  })

  it("refuses a topic read rather than marking the whole chat read", async () => {
    const markRead = vi.fn(async () => {})
    const result = await tg(["chats", "mark-read", chat.id, "--topic", "12", "--json"], {
      adapter: () => scripted({ markRead }),
    })
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("mark a forum topic read")
    expect(markRead).not.toHaveBeenCalled()
  })
})

describe("first-run discovery", () => {
  it.each([
    {
      argv: ["--help"],
      phrases: ["What you can do:", "tg personal setup", "tg skill show", "tg commands", "tg guide"],
    },
    {
      argv: ["setup", "--help"],
      phrases: [
        "Examples:",
        "tg work setup --agent claude",
        "about 5 minutes",
        "--json",
        "npm.cmd exec",
        "no 2FA",
        "QR text block",
      ],
    },
    {
      argv: ["session", "start", "--help"],
      phrases: ["First time?", "tg personal setup", "tg personal session start phone", "tg skill show"],
    },
    {
      argv: ["skill", "--help"],
      phrases: ["no session is needed", "tg personal setup --agent codex", "tg skill install --for all"],
    },
  ])("shows useful help before login: $argv", async ({ argv, phrases }) => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(argv, { adapter, env: { ...process.env, TG_API_ID: undefined, TG_API_HASH: undefined } })
    expect(result.code).toBe(0)
    for (const phrase of phrases) expect(result.stdout.join("\n")).toContain(phrase)
    expect(adapter).not.toHaveBeenCalled()
  })

  it("makes the bundled skill readable without credentials or a session", async () => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(["skill", "show"], {
      adapter,
      env: { ...process.env, TG_API_ID: undefined, TG_API_HASH: undefined },
    })
    expect(result.code).toBe(0)
    expect(result.stdout.join("\n")).toContain("## First setup")
    expect(result.stdout.join("\n")).toContain("tg setup --help")
    expect(result.stdout.join("\n")).toContain("Allow about five minutes")
    expect(adapter).not.toHaveBeenCalled()
  })

  it("points a fresh profile without a session to guided setup", async () => {
    const result = await tg(["unconfigured", "chats", "list", "--json"], { adapter: undefined })
    expect(result.code).toBe(4)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join("\n")).toContain("tg unconfigured setup")
    expect(result.stderr.join("\n")).toContain("local terminal")
  })
})

describe("machine output", () => {
  it.each([
    ["messages", "send", "111", "synthetic text"],
    ["messages", "forward", "111", "42", "--to", "222"],
    ["polls", "create", "111", "Synthetic question?", "yes", "no"],
  ])("refuses a blank posting identity before connecting: %j", async (...argv) => {
    const adapter = vi.fn(() => scripted())
    const result = await tg([...argv, "--send-as", " ", "--json"], { adapter })
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("--send-as needs an id")
    expect(adapter).not.toHaveBeenCalled()
  })
  it.each(["--spoiler", "--caption-above"])("refuses %s for a text-only send", async (flag) => {
    const send = vi.fn()
    const result = await tg(["messages", "send", "me", "synthetic text", flag, "--json"], {
      adapter: () => scripted({ send }),
    })
    expect(result.code).toBe(2)
    expect(result.stderr.join()).toContain(`${flag} needs a --photo or --file`)
    expect(send).not.toHaveBeenCalled()
  })

  it.each([
    { argv: ["messages", "send", "me", "synthetic text", "--topic", " ", "--json"] },
    { argv: ["polls", "create", "me", "synthetic question", "one", "two", "--topic", " ", "--json"] },
  ])("refuses an empty forum topic before opening a connection: $argv", async ({ argv }) => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(argv, { adapter })
    expect(result.code).toBe(2)
    expect(result.stdout).toEqual([])
    expect(result.stderr.join()).toContain("the topic id is empty")
    expect(adapter).not.toHaveBeenCalled()
  })
  it("writes one JSON value to stdout and nothing to stderr", async () => {
    const { code, stdout, stderr } = await tg(["chats", "list", "--json"])

    expect(code).toBe(0)
    expect(stdout).toHaveLength(1)
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({
      items: [{ id: chat.id, title: chat.title, kind: chat.kind, unread_count: chat.unreadCount }],
      page: { limit: 20, has_more: false },
    })
    expect(stderr).toEqual([])
  })

  it("--json keeps message text as written, invisible characters included", async () => {
    const text = "synthetic\u202e text"
    const adapter = () => scripted({ history: async () => ({ items: [message("42", { text })], hasMore: false }) })
    const ordinary = await tg(["messages", "list", "Valencia", "--json"], { adapter })
    expect(ordinary.code).toBe(0)
    expect(JSON.parse(ordinary.stdout[0] ?? "").items[0].text).toBe(text)
    expect(ordinary.stderr).toEqual([])
  })

  it("pages chats through the shared flags, and refuses --all with --page", async () => {
    let asked: unknown
    const { code, stdout } = await tg(["chats", "list", "--limit", "5", "--page", "3"], {
      adapter: () =>
        scripted({
          chats: async (window) => {
            asked = window
            return { items: [chat], hasMore: true }
          },
        }),
    })

    expect(code).toBe(0)
    expect(asked).toEqual({ limit: 5, offset: 10 })
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ page: { limit: 5, has_more: true } })
    expect((await tg(["chats", "list", "--all", "--page", "2"])).code).toBe(2)
  })

  it("reads the first word as the profile", async () => {
    let profile = ""
    await tg(["work", "chats", "list"], {
      adapter: (options) => {
        profile = options.sessionPath
        return scripted()
      },
    })
    expect(profile).toMatch(/work\.session$/)
  })

  it("keeps every id a string", async () => {
    const { stdout } = await tg(["messages", "list", "Valencia"])
    const [item] = JSON.parse(stdout[0] ?? "").items

    expect(typeof item.id).toBe("string")
    expect(typeof item.chat_id).toBe("string")
  })

  it("prints the whole phone number, and leaves it out with --hide-phone", async () => {
    const adapter = () =>
      scripted({ me: async () => ({ id: "1", name: "Owner", username: null, phone: "0000001234" }) })

    const whole = await tg(["account", "show", "--json"], { adapter })
    const hidden = await tg(["account", "show", "--hide-phone", "--json"], { adapter })

    expect(JSON.parse(whole.stdout[0] ?? "").item.phone).toBe("0000001234")
    expect(JSON.parse(hidden.stdout[0] ?? "").item).not.toHaveProperty("phone")
  })

  it("answers account update with the whole phone number, and without it for --hide-phone", async () => {
    const adapter = () =>
      scripted({ updateProfile: async () => ({ id: "1", name: "X", username: null, phone: "0000001234" }) })

    const whole = await tg(["account", "update", "--first-name", "X", "--json"], { adapter })
    const hidden = await tg(["account", "update", "--first-name", "X", "--hide-phone", "--json"], { adapter })

    expect(JSON.parse(whole.stdout[0] ?? "").item.account.phone).toBe("0000001234")
    expect(JSON.parse(hidden.stdout[0] ?? "").item.account).not.toHaveProperty("phone")
  })

  it("prints one message per line with --jsonl", async () => {
    const two = [message("42"), message("2")]
    const { stdout } = await tg(["messages", "list", "Valencia", "--jsonl"], {
      adapter: () => scripted({ history: async () => ({ items: two, hasMore: false }) }),
    })

    expect(stdout.slice(0, -1).map((line) => JSON.parse(line).data.id)).toEqual(["42", "2"])
    expect(JSON.parse(stdout.at(-1) ?? "")).toMatchObject({ type: "end", complete: true })
  })

  it("says a failure on stderr as JSON, with the exit code for its kind", async () => {
    const { code, stdout, stderr } = await tg(["account", "show"], { env: { ...process.env }, adapter: undefined })

    expect(code).toBe(4)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.code).toBe("authentication_error")
  })
})

describe("a chat named ambiguously", () => {
  it("**lists the candidates with exit 2**, although the error comes from cli-core's copy of cli-base", async () => {
    const twoMatches = () =>
      scripted({
        history: async (reference) => {
          pickChat(reference, [chat, { ...chat, id: "-1009", title: "Valencia housing" }])
          return { items: [], hasMore: false }
        },
      })
    const { code, stdout, stderr } = await tg(["messages", "list", "Valencia"], { adapter: twoMatches })

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.details.candidates).toHaveLength(2)
  })
})

describe("a person at a terminal", () => {
  it("gets the message feed as lines, not one escaped line", async () => {
    const { code, stdout } = await tg(["messages", "list", "Valencia"], { tty: true })
    const printed = stdout.join("\n")

    expect(code).toBe(0)
    expect(printed.split("\n").length).toBeGreaterThan(1)
    expect(printed).not.toContain("\\x0a")
    expect(printed).toContain(message("42").text)
  })

  it("reads the feed in English: the day heading and you", async () => {
    const mine = message("43", { outgoing: true, replyTo: { ...message("42"), outgoing: true } })
    const adapter = () => scripted({ history: async () => ({ items: [mine], hasMore: false }) })
    const printed = stripVTControlCharacters(
      (await tg(["messages", "list", "Valencia"], { tty: true, adapter })).stdout.join("\n"),
    )

    expect(printed).toContain("26 September 2026")
    expect(printed).toMatch(/\d\d:\d\d:\d\d {2}you/)
    expect(printed).toContain("↳ you: ")
    expect(printed).not.toMatch(/вы|сентября/)
  })
})

describe("forum control options", () => {
  it("passes explicit --upgrade and a fixed topic --operation-id through the CLI", async () => {
    let ready = false
    const calls: unknown[] = []
    const state = (id = chat.id, needsUpgrade = true, forum = false) => ({
      chat: { ...chat, id },
      needsUpgrade,
      forum,
      owner: true,
      canCreate: true,
      linkedDiscussion: false,
    })
    const adapter = () =>
      scripted({
        resolve: async (reference) => ({ ...chat, id: reference === "Valencia" ? chat.id : reference }),
        forumState: async (id) => state(id, id === chat.id, ready),
        upgradeForum: async (id) => {
          calls.push(["upgrade", id])
          return state("-100700", false)
        },
        enableForum: async (id) => {
          ready = true
          calls.push(["enable", id])
          return state(id, false, true)
        },
        createTopic: async (id, title, options) => {
          calls.push(["create", id, options])
          return {
            id: "12",
            title,
            closed: false,
            pinned: false,
            unreadCount: 0,
            createdAt: "2026-10-03T00:00:00Z",
            lastMessageAt: null,
          }
        },
      })
    const enabled = await tg(["topics", "enable", "Valencia", "--upgrade", "--yes", "--json"], { adapter })
    const created = await tg(["topics", "create", "-100700", "synthetic topic", "--operation-id", "42", "--json"], {
      adapter,
    })
    expect(enabled.code).toBe(0)
    expect(created.code).toBe(0)
    expect(JSON.parse(enabled.stdout[0] ?? "")).toMatchObject({
      item: { upgraded: true, chat: { id: "-100700" }, forum: true },
    })
    expect(calls).toEqual([
      ["upgrade", chat.id],
      ["enable", "-100700"],
      ["create", "-100700", { sendId: "42" }],
    ])
  })
})

describe("topic options", () => {
  it("passes --topic for message sends and poll creation", async () => {
    const checked: unknown[] = []
    const sent: unknown[] = []
    const adapter = () =>
      scripted({
        validateThread: async (...args) => {
          checked.push(args)
        },
        send: async (chatId, text, options) => {
          sent.push([chatId, text, options])
          return { message: message("43"), sendId: options.sendId }
        },
        createPoll: async (chatId, poll, options) => {
          sent.push([chatId, poll, options])
          return { message: message("44"), sendId: options.sendId }
        },
      })
    expect(
      (
        await tg(["messages", "send", "Valencia", "hi", "--topic", "12", "--reply-to", "14", "--operation-id", "42"], {
          adapter,
        })
      ).code,
    ).toBe(0)
    expect(
      (
        await tg(["polls", "create", "Valencia", "Friday?", "yes", "no", "--topic", "12", "--operation-id", "43"], {
          adapter,
        })
      ).code,
    ).toBe(0)
    expect(checked).toEqual([
      [chat.id, "12", { replyTo: "14" }],
      [chat.id, "12", {}],
    ])
    expect(sent).toMatchObject([
      [chat.id, "hi", { threadId: "12", replyTo: "14", sendId: "42" }],
      [chat.id, { question: "Friday?" }, { threadId: "12", sendId: "43" }],
    ])
  })
})

describe("sending", () => {
  it("reads the text from stdin when none is given", async () => {
    const { code, stdout } = await tg(["messages", "send", "me", "--operation-id", "-9001"], {
      stdin: Readable.from(["from a pipe"]),
    })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "").item).toMatchObject({ operation_id: "-9001", message: { text: "from a pipe" } })
  })

  it("hands back the send id when the outcome is unknown, so a repeat cannot make a second copy", async () => {
    const unknown = () =>
      scripted({
        send: async () => {
          throw new CliError("outcome_unknown", "no answer", { operation_id: "-9001" })
        },
      })
    const { code, stderr } = await tg(["messages", "send", "me", "hi", "--operation-id", "-9001"], { adapter: unknown })

    expect(code).toBe(14)
    expect(JSON.parse(stderr[0] ?? "").error.details.operation_id).toBe("-9001")
  })

  it("hands --silent, --no-preview and --md to the adapter, the marks taken out of the text", async () => {
    const asked: unknown[] = []
    const { code } = await tg(["messages", "send", "me", "**hola**", "--silent", "--no-preview", "--md"], {
      adapter: () =>
        scripted({
          send: async (_chat, text, options) => {
            asked.push({ text, ...options })
            return { message: message("43", { text, outgoing: true }), sendId: options.sendId }
          },
        }),
    })

    expect(code).toBe(0)
    expect(asked[0]).toMatchObject({
      text: "hola",
      silent: true,
      noPreview: true,
      formatting: [{ type: "bold", from: 0, length: 4 }],
    })
  })

  it("schedules with --at-time and lists what waits in the chat", async () => {
    const adapter = () =>
      scripted({
        send: async (_chat, text, options) => ({
          message: message("43", { text, outgoing: true, scheduledFor: options.at }),
          sendId: options.sendId,
        }),
        scheduled: async () => [message("43", { scheduledFor: "2030-01-01T09:00:00.000Z" })],
      })

    const sent = await tg(["messages", "send", "me", "later", "--at-time", "2h", "--json"], { adapter })
    const queued = await tg(["messages", "scheduled", "me", "--json"], { adapter })

    expect(sent.code).toBe(0)
    const scheduled = JSON.parse(sent.stdout[0] ?? "")
    expect(scheduled.item.scheduled_for).toMatch(/^\d{4}-/)
    expect(scheduled.next).toMatchObject([{ step: "messages.scheduled" }])
    expect(JSON.parse(queued.stdout[0] ?? "").items[0].scheduled_for).toBe("2030-01-01T09:00:00.000Z")
  })

  it("attaches a --photo or a --file, and sends a protected one only with --allow-any-file", async () => {
    const root = mkdtempSync(join(tmpdir(), "tg-upload-"))
    writeFileSync(join(root, "cat.png"), "png")
    mkdirSync(join(root, ".ssh"))
    writeFileSync(join(root, ".ssh", "notes.txt"), "n")
    const asked: SendOptions[] = []
    const adapter = () =>
      scripted({
        send: async (_chat, text, options) => {
          asked.push(options)
          return { message: message("43", { text, outgoing: true }), sendId: options.sendId }
        },
      })
    const hidden = join(root, ".ssh", "notes.txt")

    const photo = await tg(["messages", "send", "me", "look", "--photo", join(root, "cat.png")], { adapter })
    const refused = await tg(["messages", "send", "me", "--file", hidden], { adapter })
    const allowed = await tg(["messages", "send", "me", "--file", hidden, "--allow-any-file"], { adapter })

    expect([photo.code, refused.code, allowed.code]).toEqual([0, 2, 0])
    expect(asked.map((one) => one.attachments?.map(({ kind, name }) => [kind, name]))).toEqual([
      [["photo", "cat.png"]],
      [["file", "notes.txt"]],
    ])
  })

  it("sends a --voice alone, and a --file video as a file with --as-file", async () => {
    const root = mkdtempSync(join(tmpdir(), "tg-upload-"))
    writeFileSync(join(root, "note.ogg"), "ogg")
    writeFileSync(join(root, "trip.mp4"), "mp4")
    const asked: SendOptions[] = []
    const adapter = () =>
      scripted({
        send: async (_chat, text, options) => {
          asked.push(options)
          return { message: message("44", { text, outgoing: true }), sendId: options.sendId }
        },
      })

    const voice = await tg(["messages", "send", "me", "--voice", join(root, "note.ogg")], { adapter })
    const file = await tg(["messages", "send", "me", "--file", join(root, "trip.mp4"), "--as-file"], { adapter })
    const talking = await tg(["messages", "send", "me", "hi", "--voice", join(root, "note.ogg")], { adapter })

    expect([voice.code, file.code, talking.code]).toEqual([0, 0, 2])
    expect(asked.map((one) => one.attachments)).toMatchObject([
      [{ kind: "voice", name: "note.ogg" }],
      [{ kind: "file", name: "trip.mp4", asFile: true }],
    ])
  })

  it("refuses an empty message before connecting", async () => {
    let opened = false
    const { code } = await tg(["messages", "send", "me"], {
      stdin: Readable.from([""]),
      adapter: () => {
        opened = true
        return scripted()
      },
    })

    expect(code).toBe(2)
    expect(opened).toBe(false)
  })
})

describe("app credentials out of reach", () => {
  it("says the keyring is probably out of reach when this profile has logged in here, rather than to log in", async () => {
    const env = { ...process.env, TG_API_ID: undefined, TG_API_HASH: undefined }
    const sessions = join(pathsFor().state, "sessions")
    mkdirSync(sessions, { recursive: true })
    writeFileSync(join(sessions, "reach.session"), "")

    const loggedIn = await tg(["reach", "chats", "list", "--json"], { env })
    const never = await tg(["never", "chats", "list", "--json"], { env })

    expect(loggedIn.code).toBe(4)
    expect(loggedIn.stderr.join("\n")).toContain("XDG_RUNTIME_DIR")
    expect(never.stderr.join("\n")).toContain("tg never setup")
    expect(never.stderr.join("\n")).toContain("tg skill show")
    expect(never.stderr.join("\n")).not.toContain("XDG_RUNTIME_DIR")
  })

  it("**serve treats an unreachable keyring as temporary**, so its unit retries; a missing login still exits 4", async () => {
    const env = { ...process.env, TG_API_ID: undefined, TG_API_HASH: undefined }
    const sessions = join(pathsFor().state, "sessions")
    mkdirSync(sessions, { recursive: true })
    writeFileSync(join(sessions, "locked.session"), "")

    const locked = await tg(["locked", "serve"], { env })
    const never = await tg(["never", "serve"], { env })

    expect(locked.code).toBe(12)
    expect(NO_RESTART_ON).not.toContain(locked.code)
    expect(locked.stderr.join("\n")).toContain("XDG_RUNTIME_DIR")
    expect(never.code).toBe(4)
    expect(NO_RESTART_ON).toContain(never.code)
  })
})

describe("MCP startup overrides", () => {
  it("preserves temporary permissions in the generated client configuration without connecting", async () => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(["mcp", "config", "--permission", "messages.send=deny", "--json"], { adapter })
    expect(result.code).toBe(0)
    const entry = JSON.parse(result.stdout.join(""))
    expect(entry.item.config.mcpServers["tg-default"].args).toEqual(
      expect.arrayContaining(["--permission", "messages.send=deny"]),
    )
    expect(adapter).not.toHaveBeenCalled()
  })
  it("rejects malformed startup permissions before requiring a tunnel or connection", async () => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(["mcp", "serve", "--http", "--permission", "messages.send=yes", "--json"], { adapter })
    expect(result.code).toBe(2)
    expect(result.stderr.join("")).toContain("--permission takes")
    expect(adapter).not.toHaveBeenCalled()
  })
  it("validates the HTTP public URL before connecting", async () => {
    const adapter = vi.fn(() => scripted())
    const result = await tg(["mcp", "serve", "--http", "--json"], {
      adapter,
    })
    expect(result.code).toBe(3)
    expect(result.stderr.join("")).toContain("--public-url")
    expect(adapter).not.toHaveBeenCalled()
  })
})

describe("what tgcli users look for", () => {
  it("sends and edits Telegram HTML, and sends a file under the name given", async () => {
    const send = vi.fn(async (_chat: string, text: string, options: SendOptions) => ({
      message: { ...message("43"), text, outgoing: true },
      sendId: options.sendId,
    }))
    const edit = vi.fn(async (_chat: string, id: string, text: string) => message(id, { text, outgoing: true }))
    const adapter = () => scripted({ send, edit })
    const file = join(mkdtempSync(join(tmpdir(), "tg-file-")), "3f9a.pdf")
    writeFileSync(file, "synthetic")

    const html = await tg(["messages", "send", "me", "<b>bold</b>\nnext", "--html", "--json"], { adapter })
    const named = await tg(["messages", "send", "me", "--file", file, "--filename", "Report.pdf", "--json"], {
      adapter,
    })
    const edited = await tg(["messages", "edit", "me", "42", "<i>fixed</i>", "--html", "--json"], { adapter })
    const both = await tg(["messages", "send", "me", "<b>x</b>", "--html", "--md", "--json"], { adapter })

    expect([html.code, named.code, edited.code, both.code]).toEqual([0, 0, 0, 2])
    expect(send.mock.calls[0]?.[1]).toBe("bold\nnext")
    expect(send.mock.calls[0]?.[2]).toMatchObject({ formatting: [{ type: "bold", from: 0, length: 4 }] })
    expect(send.mock.calls[1]?.[2].attachments?.[0]?.name).toBe("Report.pdf")
    expect(edit.mock.calls[0]?.[2]).toBe("fixed")
    expect(send).toHaveBeenCalledTimes(2)
  })

  it("makes a folder by rules, and narrows join requests by name or link", async () => {
    const createFolder = vi.fn(async (title: string, chatIds: string[], _rules?: unknown) => ({
      id: "9",
      title,
      chatIds,
    }))
    const updateFolder = vi.fn(async (id: string, _change: unknown) => ({ id, title: "Inbox", chatIds: [] }))
    const joinRequests = vi.fn(async () => ({ items: [], hasMore: false }))
    const adapter = () =>
      scripted({
        createFolder,
        updateFolder,
        joinRequests,
        folders: async () => [{ id: "9", title: "Inbox", chatIds: [] }],
      })

    const made = await tg(
      [
        "chats",
        "folders",
        "create",
        "Inbox",
        "--include",
        "contacts,bots",
        "--skip",
        "muted",
        "--exclude-chat",
        "Valencia",
        "--pin",
        "Valencia",
        "--emoji",
        "📥",
        "--json",
      ],
      { adapter },
    )
    const cleared = await tg(["chats", "folders", "update", "Inbox", "--include", "none", "--json"], { adapter })
    const moved = await tg(
      [
        "chats",
        "folders",
        "update",
        "Inbox",
        "--skip",
        "read",
        "--exclude-chat",
        "Valencia",
        "--pin",
        "Valencia",
        "--emoji",
        "🗂",
        "--json",
      ],
      { adapter },
    )
    const named = await tg(["chats", "requests", "list", "Valencia", "name:ana", "--json"], { adapter })
    const linked = await tg(["chats", "requests", "list", "Valencia", 'link:"https://t.me/+x"', "--json"], {
      adapter,
    })

    expect([made.code, cleared.code, moved.code, named.code, linked.code]).toEqual([0, 0, 0, 0, 0])
    expect(createFolder.mock.calls[0]?.[2]).toEqual({
      include: ["contacts", "bots"],
      skip: ["muted"],
      exclude: [chat.id],
      pin: [chat.id],
      emoji: "📥",
    })
    expect(updateFolder.mock.calls.map((call) => call[1])).toEqual([
      { include: [] },
      { skip: ["read"], exclude: [chat.id], pin: [chat.id], emoji: "🗂" },
    ])
    expect(joinRequests.mock.calls.map((call) => (call as unknown[])[1])).toEqual([
      { limit: 20, search: "ana" },
      { limit: 20, link: "https://t.me/+x" },
    ])
  })

  it("reads one forum topic, and refuses the General topic", async () => {
    const topicHistory = vi.fn(async () => ({ items: [message("50", { threadId: "12" })], hasMore: false }))
    const adapter = () => scripted({ topicHistory })

    const topic = await tg(["messages", "list", "Valencia", "topic:12", "--json"], { adapter })
    const general = await tg(["messages", "list", "Valencia", "topic:1", "--json"], { adapter })

    expect(JSON.parse(topic.stdout[0] ?? "").items.map((one: { id: string }) => one.id)).toEqual(["50"])
    expect(topicHistory).toHaveBeenCalledWith("Valencia", "12", { limit: 20 })
    expect(general.code).toBe(2)
  })
})
