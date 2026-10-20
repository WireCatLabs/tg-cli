import {
  MtArgumentError,
  MtcuteError,
  MtInvalidPeerTypeError,
  MtMessageNotFoundError,
  MtPeerNotFoundError,
  MtTimeoutError,
  MtTypeAssertionError,
  MtUnsupportedError,
  tl,
} from "@mtcute/node"
import { bareCheck } from "@wirecat/cli-core"
import { describe, expect, it } from "vitest"
import { backgroundError, toCliError } from "./errors.js"

const rpc = (code: number, text: string, fields: Record<string, unknown> = {}) =>
  Object.assign(new tl.RpcError(code, text), fields)

describe("Telegram's refusals", () => {
  it("makes FLOOD_WAIT a rate limit that says how long to wait", () => {
    expect(toCliError(rpc(420, "FLOOD_WAIT_%d", { seconds: 30 }), bareCheck)).toMatchObject({
      code: "rate_limited",
      details: { retry_after_ms: 30_000 },
    })
  })

  it("makes a revoked session an authentication error", () => {
    expect(toCliError(rpc(401, "AUTH_KEY_UNREGISTERED"), bareCheck)).toMatchObject({
      code: "authentication_error",
      message: expect.stringContaining("`session start`"),
    })
  })

  it("makes a session ended from another device an authentication error too", () => {
    expect(toCliError(rpc(401, "SESSION_REVOKED"), bareCheck)).toMatchObject({ code: "authentication_error" })
  })

  it("makes a login revoked for overlapping connections an authentication error that names the cause", () => {
    expect(toCliError(rpc(406, "AUTH_KEY_DUPLICATED"), bareCheck)).toMatchObject({
      code: "authentication_error",
      message: expect.stringContaining("two connections used it at once"),
      details: { provider_error: "AUTH_KEY_DUPLICATED" },
    })
  })

  it("**never calls a frozen account a rate limit**, though Telegram sends it as a 420", () => {
    for (const text of ["FROZEN_METHOD_INVALID", "FROZEN_PARTICIPANT_MISSING"]) {
      expect(toCliError(rpc(text === "FROZEN_METHOD_INVALID" ? 420 : 400, text), bareCheck)).toMatchObject({
        code: "permission_error",
        details: { provider_error: text, standing: { state: "frozen" } },
        message: expect.stringContaining("doctor --online"),
      })
    }
  })

  it("**makes PEER_FLOOD a limit on writing, not a wait**, so sends are held rather than retried", () => {
    expect(toCliError(rpc(400, "PEER_FLOOD"), bareCheck)).toMatchObject({
      code: "permission_error",
      details: {
        provider_error: "PEER_FLOOD",
        standing: { state: "limited", hint: expect.stringContaining("@SpamBot") },
      },
    })
  })

  it("names a banned or deleted account, and does not send it to log in again", () => {
    const banned = toCliError(rpc(401, "USER_DEACTIVATED_BAN"), bareCheck)
    expect(banned).toMatchObject({ code: "authentication_error", details: { standing: { state: "banned" } } })
    expect((banned as Error).message).not.toContain("session start")
    expect(toCliError(rpc(401, "USER_DEACTIVATED"), bareCheck)).toMatchObject({
      details: { standing: { state: "deactivated" } },
    })
    expect(toCliError(rpc(401, "SESSION_REVOKED"), bareCheck)).toMatchObject({
      details: { standing: { state: "revoked" } },
    })
  })

  it("names the profile to log in again on", () => {
    expect(toCliError(rpc(401, "AUTH_KEY_UNREGISTERED"), bareCheck, "`tg work session start`")).toMatchObject({
      message: expect.stringContaining("`tg work session start`"),
    })
  })

  it("makes an unknown peer not found", () => {
    expect(toCliError(rpc(400, "PEER_ID_INVALID"), bareCheck)).toMatchObject({ code: "not_found" })
  })

  it("says in plain words why a voice message was not transcribed", () => {
    expect(toCliError(rpc(400, "MSG_VOICE_MISSING"), bareCheck)).toMatchObject({
      code: "validation_error",
      message: "that message is not a voice or video note",
    })
    expect(toCliError(rpc(403, "PREMIUM_ACCOUNT_REQUIRED"), bareCheck)).toMatchObject({ code: "permission_error" })
  })

  it("makes an unreachable network a network error", () => {
    expect(toCliError(Object.assign(new Error("x"), { code: "ECONNREFUSED" }), bareCheck)).toMatchObject({
      code: "network_error",
    })
  })
})

describe("refusals a person has to act on", () => {
  it("says to send the invite link when someone who left cannot be added back", () => {
    const known = toCliError(new tl.RpcError(400, "USER_NOT_MUTUAL_CONTACT"), bareCheck)
    expect(known).toMatchObject({ code: "permission_error" })
    expect((known as Error).message).toContain("chats link show")
  })

  it.each([
    [400, "MESSAGE_POLL_CLOSED", "validation_error", "polls show"],
    [400, "REVOTE_NOT_ALLOWED", "validation_error", "final"],
    [400, "OPTIONS_TOO_MUCH", "validation_error", "one answer"],
    [403, "CHAT_SEND_POLL_FORBIDDEN", "permission_error", "turned polls off"],
    [400, "BROADCAST_PUBLIC_VOTERS_FORBIDDEN", "validation_error", "--anonymous"],
    [403, "MESSAGE_AUTHOR_REQUIRED", "permission_error", "only whoever sent"],
    [400, "POLL_OPTION_DUPLICATE", "validation_error", "same"],
  ])("explains the poll refusal %i %s", (status, text, code, said) => {
    const known = toCliError(new tl.RpcError(status, text), bareCheck)
    expect(known).toMatchObject({ code, details: { provider_error: text } })
    expect((known as Error).message).toContain(said)
  })
})

describe("mtcute's own errors", () => {
  it("makes a chat it cannot find not found, without what was typed", () => {
    const known = toCliError(new MtPeerNotFoundError('Chat "Mum\'s birthday" was not found'), bareCheck)
    expect(known).toMatchObject({ code: "not_found" })
    expect((known as Error).message).not.toContain("birthday")
    expect((known as Error).message).toContain("@username")
  })

  it("makes a missing message not found, by its id", () => {
    expect(toCliError(new MtMessageNotFoundError(777, 42), bareCheck)).toMatchObject({
      code: "not_found",
      message: expect.stringContaining("42"),
    })
  })

  it("makes a chat of the wrong kind a validation error, without what was typed", () => {
    const known = toCliError(new MtInvalidPeerTypeError("Mum's birthday", "channel"), bareCheck)
    expect(known).toMatchObject({ code: "validation_error" })
    expect((known as Error).message).not.toContain("birthday")
  })

  it("makes what tg or mtcute cannot read a provider failure", () => {
    expect(toCliError(new MtUnsupportedError("File ref expired!"), bareCheck)).toMatchObject({ code: "provider_error" })
    expect(toCliError(new MtTypeAssertionError("message", "messageEmpty"), bareCheck)).toMatchObject({
      code: "invalid_response",
    })
    expect(toCliError(new MtcuteError("anything"), bareCheck)).toMatchObject({ code: "provider_error" })
  })

  it("names the kind of argument mtcute refused, without what was typed", () => {
    const known = toCliError(new MtArgumentError(`You haven't joined "Mum's birthday"`), bareCheck)
    expect(known).toMatchObject({ code: "validation_error", message: "you are not a member of that chat" })
    expect((known as Error).message).not.toContain("birthday")
  })

  it("makes an argument error it does not recognise a generic one, without what was typed", () => {
    const unknown = toCliError(new MtArgumentError("Could not find folder Mum's birthday"), bareCheck)
    expect(unknown).toMatchObject({
      code: "validation_error",
      message: "Telegram refused an argument this command passed",
    })
    expect((unknown as Error).message).not.toContain("birthday")
  })
})

describe("mtcute's background errors", () => {
  const seen = (verbose: boolean, error: Error) => {
    const lines: string[] = []
    backgroundError((line) => lines.push(line), verbose, bareCheck)(error)
    return lines
  }

  it("keeps them out of the terminal: the reset after a login, and every failed connection attempt", () => {
    expect(seen(false, new Error("Connection closed"))).toEqual([])
    expect(seen(false, Object.assign(new Error("connect"), { code: "ENETUNREACH" }))).toEqual([])
  })

  it("shows each with --verbose as one line in tg's words, without its stack", () => {
    expect(seen(true, new Error("Connection closed"))).toEqual(["[client] Connection closed"])
    expect(seen(true, new MtTimeoutError(1000))).toEqual(["[client] Telegram did not answer in time"])
  })
})
