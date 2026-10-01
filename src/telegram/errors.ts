import { CliError, type ErrorCode, isCliError } from "@leemour/cli-core"
import {
  MtArgumentError,
  MtcuteError,
  MtEmptyError,
  MtInvalidPeerTypeError,
  MtMessageNotFoundError,
  MtPeerNotFoundError,
  MtSecurityError,
  MtTimeoutError,
  MtTypeAssertionError,
  MtUnsupportedError,
  tl,
} from "@mtcute/node"

const { RpcError } = tl

const NOT_FOUND = new Set([
  "PEER_ID_INVALID",
  "CHANNEL_INVALID",
  "CHAT_ID_INVALID",
  "USERNAME_INVALID",
  "USERNAME_NOT_OCCUPIED",
  "MSG_ID_INVALID",
])

/** Refusals whose name alone would not tell a person what to do. */
const EXPLAINED: Record<string, [ErrorCode, string]> = {
  MSG_VOICE_MISSING: ["validation_error", "that message is not a voice or video note"],
  MSG_VOICE_TOO_LONG: ["validation_error", "the voice message is too long for Telegram to transcribe"],
  PREMIUM_ACCOUNT_REQUIRED: [
    "permission_error",
    "Telegram transcribes only for Premium accounts, or a few messages a week on the free trial, used up now",
  ],
  TRANSCRIPTION_FAILED: ["provider_error", "Telegram could not transcribe this voice message"],
  PHONE_NOT_OCCUPIED: ["not_found", "nobody Telegram lets you find has this number"],
}

/**
 * Telegram's refusals as the closed list of codes a script branches on. Only the error's name
 * travels into the message — never a parameter the caller passed, which may be somebody's text.
 */
export const toCliError = (error: unknown, login = "`tg session start`"): unknown => {
  if (isCliError(error)) return error
  if (RpcError.is(error, "FLOOD_WAIT_%d")) {
    return new CliError("rate_limited", `Telegram asks to wait ${error.seconds} s before the next request`, {
      retryAfterMs: error.seconds * 1000,
      providerError: "FLOOD_WAIT",
    })
  }
  if (RpcError.is(error)) {
    const details = { providerError: error.text, status: error.code }
    if (error.code === RpcError.UNAUTHORIZED) {
      return new CliError("authentication_error", `not logged in, or the session was ended — run ${login}`, details)
    }
    const explained = EXPLAINED[error.text]
    if (explained) return new CliError(explained[0], explained[1], details)
    if (NOT_FOUND.has(error.text))
      return new CliError("not_found", `Telegram does not know that (${error.text})`, details)
    if (error.code === RpcError.FORBIDDEN)
      return new CliError("permission_error", `Telegram refused: ${error.text}`, details)
    if (error.code === RpcError.FLOOD) return new CliError("rate_limited", `Telegram refused: ${error.text}`, details)
    if (error.code >= 500) return new CliError("provider_unavailable", `Telegram failed: ${error.text}`, details)
    return new CliError("provider_error", `Telegram refused: ${error.text}`, details)
  }
  if (error instanceof MtTimeoutError) return new CliError("timeout", "Telegram did not answer in time")
  if (error instanceof MtArgumentError) return new CliError("validation_error", error.message)
  // mtcute builds these messages from what was typed — a chat title can be somebody's text — so none is passed on.
  if (error instanceof MtPeerNotFoundError) return new CliError("not_found", "Telegram does not know that chat or user")
  if (error instanceof MtMessageNotFoundError) {
    return new CliError("not_found", `there is no message ${error.messageId} in that chat`)
  }
  if (error instanceof MtInvalidPeerTypeError) {
    return new CliError("validation_error", "that chat is not the kind this command works on")
  }
  // Thrown on what Telegram sent (an expired file reference, a CDN redirect), not on what was typed.
  if (error instanceof MtUnsupportedError) {
    return new CliError("provider_error", "Telegram answered with something tg cannot handle yet")
  }
  if (error instanceof MtTypeAssertionError || error instanceof MtEmptyError || error instanceof MtSecurityError) {
    return new CliError("invalid_response", `Telegram answered with something unexpected (${error.constructor.name})`)
  }
  if (error instanceof MtcuteError) return new CliError("provider_error", `Telegram failed (${error.constructor.name})`)
  const code = (error as { code?: unknown })?.code
  if (typeof code === "string" && /^(ECONN|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ENETUNREACH|EHOSTUNREACH)/.test(code)) {
    return new CliError("network_error", `cannot reach Telegram (${code})`)
  }
  return error
}
