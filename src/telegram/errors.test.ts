import { tl } from "@mtcute/node"
import { describe, expect, it } from "vitest"
import { toCliError } from "./errors.js"

const rpc = (code: number, text: string, fields: Record<string, unknown> = {}) =>
  Object.assign(new tl.RpcError(code, text), fields)

describe("Telegram's refusals", () => {
  it("makes FLOOD_WAIT a rate limit that says how long to wait", () => {
    expect(toCliError(rpc(420, "FLOOD_WAIT_%d", { seconds: 30 }))).toMatchObject({
      code: "rate_limited",
      details: { retryAfterMs: 30_000 },
    })
  })

  it("makes a revoked session an authentication error", () => {
    expect(toCliError(rpc(401, "AUTH_KEY_UNREGISTERED"))).toMatchObject({ code: "authentication_error" })
  })

  it("makes an unknown peer not found", () => {
    expect(toCliError(rpc(400, "PEER_ID_INVALID"))).toMatchObject({ code: "not_found" })
  })

  it("says in plain words why a voice message was not transcribed", () => {
    expect(toCliError(rpc(400, "MSG_VOICE_MISSING"))).toMatchObject({
      code: "validation_error",
      message: "that message is not a voice or video note",
    })
    expect(toCliError(rpc(403, "PREMIUM_ACCOUNT_REQUIRED"))).toMatchObject({ code: "permission_error" })
  })

  it("makes an unreachable network a network error", () => {
    expect(toCliError(Object.assign(new Error("x"), { code: "ECONNREFUSED" }))).toMatchObject({ code: "network_error" })
  })
})
