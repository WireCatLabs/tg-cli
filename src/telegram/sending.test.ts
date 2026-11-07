import type { RpcCallMiddleware, RpcCallMiddlewareContext } from "@mtcute/node"
import { type DiagnosticEvent, inRun, withAttempt } from "@wirecat/cli-core/cli"
import { afterEach, describe, expect, it, vi } from "vitest"
import { middlewaresOf } from "./sending.js"

const ALLOWED = new Set([
  "event",
  "operation",
  "level",
  "transport",
  "attempt",
  "waitMs",
  "durationMs",
  "outcome",
  "errorCode",
  "providerError",
])

/** The middlewares tg gives mtcute, ending in a stand-in for Telegram that answers from `answers` in turn. */
const callThrough = async (answers: unknown[], said: string[] = [], method = "messages.getHistory") => {
  const chain = [
    ...middlewaresOf({ maxWait: 10_000, maxRetries: 2 }, (line) => said.push(line)),
    (async () => answers.shift()) as RpcCallMiddleware,
  ]
  const dispatch = (at: number, context: RpcCallMiddlewareContext): Promise<unknown> =>
    (chain[at] as RpcCallMiddleware)(context, (next) => dispatch(at + 1, next))
  const context = {
    request: { _: method, peer: { _: "inputPeerUser", userId: 42 }, limit: 20 },
    manager: { teardownSignal: new AbortController().signal, _log: { warn: () => {} } },
  } as unknown as RpcCallMiddlewareContext
  const events: DiagnosticEvent[] = []
  const answer = await inRun({ runId: "r", command: "messages list", events: (event) => events.push(event) }, () =>
    dispatch(0, context),
  )
  return { answer, events, said }
}

describe("request lines for MTProto", () => {
  it("**an RPC gives a request and a response line with the method name and nothing of the request**", async () => {
    const { events } = await callThrough([{ _: "messages.messages", messages: [] }])

    expect(events).toMatchObject([
      { event: "request", operation: "messages.getHistory", level: "wire", transport: "mtproto", attempt: 1 },
      { event: "response", operation: "messages.getHistory", outcome: "ok", attempt: 1 },
    ])
    expect(events[1]?.event === "response" && typeof events[1].durationMs).toBe("number")
    for (const event of events) for (const key of Object.keys(event)) expect(ALLOWED).toContain(key)
  })

  it("**a FLOOD_WAIT is an error response, then the retry with attempt 2 and the wait**", async () => {
    const said: string[] = []
    const { events } = await callThrough(
      [{ _: "mt_rpc_error", errorCode: 420, errorMessage: "FLOOD_WAIT_1" }, { _: "messages.messages" }],
      said,
    )

    expect(events).toMatchObject([
      { event: "request", attempt: 1 },
      { event: "response", outcome: "error", errorCode: "rate_limited", providerError: "FLOOD_WAIT", attempt: 1 },
      { event: "request", operation: "messages.getHistory", attempt: 2, waitMs: 1000 },
      { event: "response", outcome: "ok", attempt: 2, waitMs: 1000 },
    ])
    expect(events[0]).not.toHaveProperty("waitMs")
    expect(said).toEqual(["Telegram asks to wait 1 s before messages.getHistory — waiting, then going on"])
  })

  it("**a call cli-core retries after a wait is that attempt, with the wait**", async () => {
    const { events } = await withAttempt({ attempt: 2, waitMs: 30_000 }, () =>
      callThrough([{ _: "messages.messages" }]),
    )

    expect(events).toMatchObject([
      { event: "request", operation: "messages.getHistory", attempt: 2, waitMs: 30_000 },
      { event: "response", outcome: "ok", attempt: 2, waitMs: 30_000 },
    ])
  })
})

const INTERNAL = { _: "mt_rpc_error", errorCode: 500, errorMessage: "INTERNAL" }

describe("retries after Telegram's own failure", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    "messages.createChat",
    "channels.joinChannel",
    "messages.editMessage",
    "messages.deleteMessages",
    "messages.getBotCallbackAnswer",
  ])("**%s, a write, goes once and hands back the 500**", async (method) => {
    const { answer, events } = await callThrough([INTERNAL, { _: "updates" }], [], method)

    expect(answer).toEqual(INTERNAL)
    expect(events.filter((event) => event.event === "request")).toHaveLength(1)
  })

  it.each([-500, -503])("**a write answered %i goes once too**", async (errorCode) => {
    const failure = { _: "mt_rpc_error", errorCode, errorMessage: "Timeout" }
    const { answer } = await callThrough([failure, { _: "updates" }], [], "messages.createChat")

    expect(answer).toEqual(failure)
  })

  it("**a read is asked again after a 500**", async () => {
    vi.useFakeTimers()
    const pending = callThrough([INTERNAL, { _: "messages.messages" }])
    await vi.advanceTimersByTimeAsync(1000)
    const { answer, events } = await pending

    expect(answer).toEqual({ _: "messages.messages" })
    expect(events.filter((event) => event.event === "request")).toHaveLength(2)
  })

  it("**a write still waits out a FLOOD_WAIT, which applied nothing**", async () => {
    const { answer, events } = await callThrough(
      [{ _: "mt_rpc_error", errorCode: 420, errorMessage: "FLOOD_WAIT_1" }, { _: "updates" }],
      [],
      "messages.createChat",
    )

    expect(answer).toEqual({ _: "updates" })
    expect(events.filter((event) => event.event === "request")).toHaveLength(2)
  })
})
