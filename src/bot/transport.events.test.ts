import { type DiagnosticEvent, withAttempt } from "@wirecat/cli-core/cli"
import { describe, expect, it } from "vitest"
import { TelegramBotTransport } from "./transport.js"

const TOKEN = "123456789:AAsecretSECRETsecretSECRETsecret0"

const linesOf = async (answer: () => Promise<Response>, params: Record<string, unknown> = {}) => {
  const events: DiagnosticEvent[] = []
  const transport = new TelegramBotTransport({ token: TOKEN, fetch: answer, events: (event) => events.push(event) })
  await transport.call("sendMessage", params, { reads: false }).catch(() => {})
  return events
}

describe("request lines for the Bot API", () => {
  it("**a call gives wire request and response lines with no token, URL or body**", async () => {
    const events = await linesOf(async () => new Response(JSON.stringify({ ok: true, result: { message_id: 7 } })), {
      chat_id: 42,
      text: "synthetic body",
    })

    expect(events).toMatchObject([
      { event: "request", operation: "sendMessage", level: "wire", transport: "http", attempt: 1 },
      { event: "response", method: "POST", endpointTemplate: "/:token/sendMessage", status: 200, outcome: "ok" },
    ])
    const written = JSON.stringify(events)
    for (const secret of [TOKEN, "AAsecret", "synthetic body", "api.telegram.org"])
      expect(written).not.toContain(secret)
  })

  it("**a 429 is an error response with its status and duration**", async () => {
    const events = await linesOf(
      async () =>
        new Response(JSON.stringify({ ok: false, error_code: 429, parameters: { retry_after: 5 } }), { status: 429 }),
    )

    expect(events[1]).toMatchObject({ event: "response", status: 429, outcome: "error", errorCode: "rate_limited" })
    expect(events[1]).toHaveProperty("durationMs")
  })

  it("**a request that got no answer still has its duration**", async () => {
    const events = await linesOf(async () => {
      throw new TypeError("fetch failed")
    })

    expect(events[1]).toMatchObject({ event: "response", outcome: "error", errorCode: "outcome_unknown" })
    expect(events[1]).toHaveProperty("durationMs")
  })

  it("**a retry made above the transport is attempt 2 with the wait before it**", async () => {
    const events = await withAttempt({ attempt: 2, waitMs: 5000 }, () =>
      linesOf(async () => new Response(JSON.stringify({ ok: true, result: true }))),
    )

    expect(events).toMatchObject([
      { event: "request", operation: "sendMessage", attempt: 2, waitMs: 5000 },
      { event: "response", outcome: "ok", attempt: 2, waitMs: 5000 },
    ])
  })
})
