import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { beforeEach, describe, expect, it } from "vitest"
import { type FetchLike, TelegramBotTransport } from "./bot/transport.js"
import { run } from "./program.js"

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
