import {
  MtArgumentError,
  MtcuteError,
  MtInvalidPeerTypeError,
  MtMessageNotFoundError,
  MtPeerNotFoundError,
  MtTypeAssertionError,
  MtUnsupportedError,
  tl,
} from "@mtcute/node"
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
    expect(toCliError(rpc(401, "AUTH_KEY_UNREGISTERED"))).toMatchObject({
      code: "authentication_error",
      message: expect.stringContaining("`tg session start`"),
    })
  })

  it("names the profile to log in again on", () => {
    expect(toCliError(rpc(401, "AUTH_KEY_UNREGISTERED"), "`tg work session start`")).toMatchObject({
      message: expect.stringContaining("`tg work session start`"),
    })
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

describe("refusals a person has to act on", () => {
  it("says to send the invite link when someone who left cannot be added back", () => {
    const known = toCliError(new tl.RpcError(400, "USER_NOT_MUTUAL_CONTACT"))
    expect(known).toMatchObject({ code: "permission_error" })
    expect((known as Error).message).toContain("chats link show")
  })
})

describe("mtcute's own errors", () => {
  it("makes a chat it cannot find not found, without what was typed", () => {
    const known = toCliError(new MtPeerNotFoundError('Chat "Mum\'s birthday" was not found'))
    expect(known).toMatchObject({ code: "not_found" })
    expect((known as Error).message).not.toContain("birthday")
    expect((known as Error).message).toContain("@username")
  })

  it("makes a missing message not found, by its id", () => {
    expect(toCliError(new MtMessageNotFoundError(777, 42))).toMatchObject({
      code: "not_found",
      message: expect.stringContaining("42"),
    })
  })

  it("makes a chat of the wrong kind a validation error, without what was typed", () => {
    const known = toCliError(new MtInvalidPeerTypeError("Mum's birthday", "channel"))
    expect(known).toMatchObject({ code: "validation_error" })
    expect((known as Error).message).not.toContain("birthday")
  })

  it("makes what tg or mtcute cannot read a provider failure", () => {
    expect(toCliError(new MtUnsupportedError("File ref expired!"))).toMatchObject({ code: "provider_error" })
    expect(toCliError(new MtTypeAssertionError("message", "messageEmpty"))).toMatchObject({ code: "invalid_response" })
    expect(toCliError(new MtcuteError("anything"))).toMatchObject({ code: "provider_error" })
  })

  it("names the kind of argument mtcute refused, without what was typed", () => {
    const known = toCliError(new MtArgumentError(`You haven't joined "Mum's birthday"`))
    expect(known).toMatchObject({ code: "validation_error", message: "you are not a member of that chat" })
    expect((known as Error).message).not.toContain("birthday")
  })

  it("makes an argument error it does not recognise a generic one, without what was typed", () => {
    const unknown = toCliError(new MtArgumentError("Could not find folder Mum's birthday"))
    expect(unknown).toMatchObject({
      code: "validation_error",
      message: "Telegram refused an argument this command passed",
    })
    expect((unknown as Error).message).not.toContain("birthday")
  })
})
