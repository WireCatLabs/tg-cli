import { CliError } from "@wirecat/cli-base"
import { describe, expect, it } from "vitest"
import { type FetchLike, TelegramBotTransport } from "./transport.js"

const TOKEN = "123456789:AAsecretSECRETsecretSECRETsecret0"

type Reply = Response | Error | (() => Response | Error)

const telegram = (reply: Reply) => {
  const calls: string[] = []
  const fetch: FetchLike = async (url) => {
    calls.push(url.split("/").at(-1) ?? "")
    const answer = typeof reply === "function" ? reply() : reply
    if (answer instanceof Error) throw answer
    return answer
  }
  return { fetch, calls }
}

const failureOf = async (promise: Promise<unknown>): Promise<CliError> => {
  try {
    await promise
  } catch (error) {
    if (error instanceof CliError) return error
    throw error
  }
  throw new Error("expected a failure")
}

const leaks = (error: CliError) => JSON.stringify({ message: error.message, details: error.details }).includes(TOKEN)

const html = (status: number) => new Response("<html>bad gateway</html>", { status })
const failed = (status: number) =>
  new Response(JSON.stringify({ ok: false, error_code: status, description: "Internal Server Error" }), { status })

describe("a Bot API write whose outcome is not known", () => {
  it("**a write that got no answer is outcome_unknown, sent once, with no token in the error**", async () => {
    const api = telegram(new TypeError(`fetch failed for https://api.telegram.org/bot${TOKEN}/sendMessage`))
    const error = await failureOf(
      new TelegramBotTransport({ token: TOKEN, fetch: api.fetch }).call("sendMessage", {}, { reads: false }),
    )

    expect(error.code).toBe("outcome_unknown")
    expect(error.details.retryable).toBe(false)
    expect(api.calls).toEqual(["sendMessage"])
    expect(leaks(error)).toBe(false)
  })

  it("**a write answered 502 or 504 is outcome_unknown, a read's is provider_unavailable**", async () => {
    for (const reply of [failed(502), html(504)]) {
      const api = telegram(() => reply.clone())
      const transport = new TelegramBotTransport({ token: TOKEN, fetch: api.fetch })

      expect((await failureOf(transport.call("sendMessage", {}, { reads: false }))).code).toBe("outcome_unknown")
      expect((await failureOf(transport.call("getChat"))).code).toBe("provider_unavailable")
      expect(api.calls).toEqual(["sendMessage", "getChat"])
    }
  })

  it("**a write a cancel cuts is outcome_unknown, never cancelled**", async () => {
    const stop = new AbortController()
    const api = telegram(() => {
      stop.abort()
      return new DOMException("aborted", "AbortError")
    })
    const transport = new TelegramBotTransport({ token: TOKEN, fetch: api.fetch, signal: stop.signal })

    expect((await failureOf(transport.call("sendMessage", {}, { reads: false }))).code).toBe("outcome_unknown")
    expect(api.calls).toEqual(["sendMessage"])
  })

  it("**a read a cancel cuts is cancelled**", async () => {
    const stop = new AbortController()
    stop.abort()
    const api = telegram(new DOMException("aborted", "AbortError"))
    const transport = new TelegramBotTransport({ token: TOKEN, fetch: api.fetch, signal: stop.signal })

    expect((await failureOf(transport.call("getChat"))).code).toBe("cancelled")
  })
})

const refusal = (body: Record<string, unknown>, status = 400) =>
  new Response(JSON.stringify({ ok: false, ...body }), { status })
const TITLE = "Synthetic Family Chat"

describe("a Bot API refusal", () => {
  it.each([
    [400, "validation_error"],
    [401, "authentication_error"],
    [403, "permission_error"],
    [404, "authentication_error"],
    [409, "provider_error"],
  ])("**a %i is %s, with none of Telegram's description**", async (status, code) => {
    const api = telegram(refusal({ error_code: status, description: `Bad Request: chat not found: ${TITLE}` }, status))
    const error = await failureOf(new TelegramBotTransport({ token: TOKEN, fetch: api.fetch }).call("getChat"))

    expect(error.code).toBe(code)
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toMatch(/Synthetic|not found/)
  })

  it("**the code comes from Telegram's error_code, not the words**", async () => {
    const api = telegram(refusal({ error_code: 403, description: "Not Found" }, 200))
    const error = await failureOf(new TelegramBotTransport({ token: TOKEN, fetch: api.fetch }).call("sendMessage"))

    expect(error.code).toBe("permission_error")
  })

  it("**a migrated group names the new id from parameters, not from the description**", async () => {
    const api = telegram(
      refusal({ error_code: 400, description: `${TITLE} upgraded`, parameters: { migrate_to_chat_id: -1001234 } }),
    )
    const error = await failureOf(new TelegramBotTransport({ token: TOKEN, fetch: api.fetch }).call("sendMessage"))

    expect(error).toMatchObject({ code: "not_found", details: { migrated_chat_id: "-1001234" } })
    expect(error.message).toBe("this group became a supergroup with id -1001234 — use that id from now on")
  })

  it("**a flood limit says how long to wait, from parameters**", async () => {
    const api = telegram(
      refusal({ error_code: 429, description: `Too Many Requests in ${TITLE}`, parameters: { retry_after: 7 } }, 429),
    )
    const error = await failureOf(new TelegramBotTransport({ token: TOKEN, fetch: api.fetch }).call("sendMessage"))

    expect(error).toMatchObject({ code: "rate_limited", details: { retry_after_ms: 7000 } })
    expect(error.message).toBe("Telegram asks to wait 7 s before sendMessage")
  })
})
