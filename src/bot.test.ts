import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { botCopy, ChatRegistry, commandLookup, createBotServer } from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { beforeEach, describe, expect, it } from "vitest"
import { TG } from "./app.js"
import { type FetchLike, TelegramBotTransport } from "./bot/transport.js"
import { botMcpRun, TELEGRAM_BOT } from "./commands/bot.js"
import { createProgram, run } from "./program.js"

const TOKEN = "123456789:AAsecretSECRETsecretSECRETsecret0"
const SECRET = "AAsecretSECRET"

type Reply = { status: number; body: unknown } | Error

let keyring: ReturnType<typeof memoryKeyring>
let asked: string[]

/** A stand-in for api.telegram.org: answers each method from `replies`, and remembers what was asked. */
const telegram =
  (replies: Record<string, Reply>): FetchLike =>
  async (url, init) => {
    const method = url.split("/").at(-1) ?? ""
    asked.push(method)
    const reply = replies[method] ?? { status: 404, body: { ok: false, error_code: 404, description: "Not Found" } }
    if (reply instanceof Error) throw reply
    expect(init.method).toBe("POST")
    return new Response(JSON.stringify(reply.body), { status: reply.status })
  }

const ME = {
  status: 200,
  body: { ok: true, result: { id: 7_000_000_001, is_bot: true, first_name: "Sales", username: "sales_bot" } },
}

const tg = async (argv: string[], botFetch: FetchLike, stdin = "") => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring,
    botFetch,
    stdin: Object.assign(Readable.from([stdin]), { isTTY: false }),
  })
  const out = streams.stdout.join("\n")
  const err = streams.stderr.join("\n")
  return { code, answer: out ? JSON.parse(out) : undefined, out, err }
}

beforeEach(() => {
  keyring = memoryKeyring()
  asked = []
})

describe("tg bot auth", () => {
  it("**asks Telegram whose token it is, then keeps it** in the keyring", async () => {
    const set = await tg(["sales", "bot", "auth", "set", "--json"], telegram({ getMe: ME }), `${TOKEN}\n`)

    expect(set.code).toBe(0)
    expect(set.answer).toEqual({
      profile: "sales",
      stored: "keyring",
      bot: "Sales",
      id: "7000000001",
      username: "sales_bot",
    })
    expect([...keyring.entries.values()]).toEqual([TOKEN])
    expect((await tg(["sales", "bot", "auth", "show", "--json"], telegram({ getMe: ME }))).answer).toMatchObject({
      source: "keyring",
      username: "sales_bot",
    })
  })

  it("**keeps nothing Telegram refused**, and says so with exit 4", async () => {
    const refused = { status: 401, body: { ok: false, error_code: 401, description: "Unauthorized" } }
    const set = await tg(["sales", "bot", "auth", "set", "--json"], telegram({ getMe: refused }), TOKEN)

    expect(set.code).toBe(4)
    expect(set.err).toContain("Telegram did not accept this bot token (Unauthorized)")
    expect(keyring.entries.size).toBe(0)
  })
})

describe("the token never leaves the client", () => {
  it("**is in no trace line, answer or run record** of a request that worked", async () => {
    await tg(["sales", "bot", "auth", "set"], telegram({ getMe: ME }), TOKEN)
    const shown = await tg(["sales", "bot", "auth", "show", "--json", "--trace", "--record"], telegram({ getMe: ME }))
    const runs = await tg(["runs", "list", "--json"], telegram({}))

    expect(shown.err).toContain('"operation":"getMe"')
    for (const text of [shown.out, shown.err, runs.out]) expect(text).not.toContain(SECRET)
  })

  it("**is in no error** when the request fails with the address in its own message", async () => {
    await tg(["sales", "bot", "auth", "set"], telegram({ getMe: ME }), TOKEN)
    const leaking = new TypeError(`fetch failed for https://api.telegram.org/bot${TOKEN}/getMe`)
    const failed = await tg(["sales", "bot", "auth", "show", "--json", "--trace"], telegram({ getMe: leaking }))

    expect(failed.code).not.toBe(0)
    expect(failed.err).toContain("network_error")
    expect(failed.err).not.toContain(SECRET)
    expect(failed.out).not.toContain(SECRET)
  })
})

describe("Telegram's refusals", () => {
  it("**turns a flood wait into rate_limited with its wait**", async () => {
    await tg(["sales", "bot", "auth", "set"], telegram({ getMe: ME }), TOKEN)
    const flood = {
      status: 429,
      body: {
        ok: false,
        error_code: 429,
        description: "Too Many Requests: retry after 5",
        parameters: { retry_after: 5 },
      },
    }
    const limited = await tg(["sales", "bot", "auth", "show", "--json"], telegram({ getMe: flood }))

    expect(JSON.parse(limited.err).error).toMatchObject({ code: "rate_limited", retryAfterMs: 5000 })
  })
})

describe("the long poll", () => {
  it("**waits past the transport's timeout when the call gives its own**, and times out without one", async () => {
    const slow: FetchLike = async (_url, init) => {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 150)
        init.signal?.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(Object.assign(new Error("aborted"), { name: "TimeoutError" }))
        })
      })
      return new Response(JSON.stringify({ ok: true, result: [] }))
    }
    const transport = new TelegramBotTransport({ token: TOKEN, fetch: slow, timeoutMs: 50 })

    expect(await transport.call("getUpdates", { timeout: 1 }, { timeoutMs: 1_000 })).toEqual([])
    await expect(transport.call("getUpdates", { timeout: 1 })).rejects.toMatchObject({ code: "timeout" })
  })
})

describe("tg bot list", () => {
  it("**names every bot with a token, and with --check asks Telegram who each is**", async () => {
    await tg(["sales", "bot", "auth", "set"], telegram({ getMe: ME }), TOKEN)

    expect((await tg(["bot", "list", "--check", "--json"], telegram({ getMe: ME }))).answer.items).toEqual([
      { name: "sales", token: "keyring", bot: "sales_bot", id: "7000000001" },
    ])
  })
})

describe("tg bot mcp", () => {
  const offered = async (permissions: Record<string, "deny" | "readonly" | "ask" | "allow">) => {
    const group = createProgram().commands.find((one) => one.name() === "bot") as Command
    const { offered: names } = createBotServer({
      bot: TELEGRAM_BOT,
      commandAt: commandLookup(group),
      settings: { profile: "sales", permissions, readOtherBots: false },
      env: {},
      run: await botMcpRun({ keyring }),
    })
    return names
  }

  it("**offers the shared bot tools by the profile's levels**: every write by default, none when read-only", async () => {
    const all = await offered({})
    expect(all).toEqual(expect.arrayContaining(["tg_bot_messages_send", "tg_bot_messages_delete", "tg_bot_chats_list"]))
    expect(all.some((name) => /comments|people|_me$/.test(name))).toBe(false)

    const reads = await offered({ bot: "readonly" })
    expect(reads).toContain("tg_bot_messages_list")
    expect(reads.some((name) => /_(send|edit|delete|pin|unpin|remove|action|answer)$/.test(name))).toBe(false)
  })
})

describe("tg bot mcp config", () => {
  it("**prints the bot's server entry with --confirm-send and --allow-dangerous**, and drops the retired flags", async () => {
    const streams = captureStreams()
    const flags = ["--allow-send", "--allow-delete", "--allow-moderate", "--confirm-send", "--allow-dangerous"]
    const code = await run(["sales", "bot", "mcp", "config", ...flags, "--json"], {
      streams,
      tty: false,
      keyring,
      mcp: { execPath: "/usr/bin/node", scriptPath: "/opt/tg/tg.js" },
    } as never)

    expect(code).toBe(0)
    const servers = JSON.parse(streams.stdout.join("")).mcpServers
    expect(Object.keys(servers)).toEqual(["tg-bot-sales"])
    expect(servers["tg-bot-sales"].args).toEqual([
      "/opt/tg/tg.js",
      "sales",
      "bot",
      "mcp",
      "--confirm-send",
      "--allow-dangerous",
    ])
    expect(streams.stderr.join("\n")).toContain("no longer decide anything")
  })
})

describe("tg bot chats moderate", () => {
  it("**judges what the local copy kept**, since Telegram gives a bot no history, and says so", async () => {
    const fetch = telegram({
      getMe: ME,
      getChatAdministrators: { status: 200, body: { ok: true, result: [] } },
    })
    await tg(["sales", "bot", "auth", "set"], fetch, TOKEN)

    const done = await tg(
      [
        "sales",
        "bot",
        "chats",
        "moderate",
        "-100",
        "--since-time",
        "2h",
        "--dry-run",
        "--allow-dangerous",
        "--no-ban",
        "--max-actions",
        "3",
        "--json",
      ],
      fetch,
    )

    expect(done.code).toBe(0)
    expect(done.answer).toEqual({ chatId: "-100", rows: [] })
    expect(done.err).toContain("Telegram gives a bot no history")
    expect(asked).toContain("getChatAdministrators")
  })
})

describe("tg bot contacts show and the bot's copy reads", () => {
  const said = (chatId: string, id: string, senderId: string, senderName: string, text: string, at: number) => ({
    id,
    chatId,
    senderId,
    senderName,
    timestamp: new Date(at).toISOString(),
    editedAt: null,
    text,
    outgoing: false,
    attachments: [],
    replyTo: null,
    forwardedFrom: null,
    reactions: null,
  })

  it("**reads what the bot kept**: a person, a word search, what two people wrote; --refresh is refused", async () => {
    const fetch = telegram({ getMe: ME })
    await tg(["sales", "bot", "auth", "set"], fetch, TOKEN)
    new ChatRegistry(TG, "sales").rememberBot("7000000001")
    const at = Date.parse("2026-10-01T10:00:00Z")
    await botCopy("telegram-bot").keep(
      "7000000001",
      [
        said("-100", "1", "42", "Ann", "ann in team", at),
        said("-100", "2", "43", "Bob", "bob in team", at + 1),
        said("42", "3", "42", "Ann", "hi bot", at + 2),
      ],
      "watch",
      () => {},
      [
        { id: "42", name: "Ann", username: "ann" },
        { id: "43", name: "Bob" },
      ],
    )

    const card = await tg(["sales", "bot", "contacts", "show", "@ann", "--limit", "5", "--json"], fetch)
    const found = await tg(
      ["sales", "bot", "messages", "search", "team", "--from", "@ann", "--newest", "--limit", "5", "--json"],
      fetch,
    )
    const between = await tg(["sales", "bot", "messages", "between", "@ann", "Bob", "--limit", "5", "--json"], fetch)
    const refresh = await tg(["sales", "bot", "contacts", "show", "@ann", "--refresh"], fetch)
    const across = await tg(["sales", "bot", "contacts", "show", "@ann", "--all-bots", "--bots", "other"], fetch)

    expect(card.answer).toMatchObject({ id: "42", messages: [{ text: "hi bot" }] })
    expect(found.answer.items.map((message: { id: string }) => message.id)).toEqual(["1"])
    expect(between.answer.chats.map((chat: { id: string }) => chat.id)).toEqual(["-100"])
    expect(refresh.code).toBe(2)
    expect(across.err).toContain("readOtherBots")
    for (const read of [
      ["messages", "search", "team", "--all-bots", "--bots", "other"],
      ["messages", "between", "@ann", "Bob", "--all-bots", "--bots", "other"],
    ]) {
      expect((await tg(["sales", "bot", ...read], fetch)).err).toContain("readOtherBots")
    }
  })
})
