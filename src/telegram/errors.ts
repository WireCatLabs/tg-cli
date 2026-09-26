import { CliError, isCliError } from "@leemour/cli-core"
import { MtArgumentError, MtTimeoutError, tl } from "@mtcute/node"

const { RpcError } = tl

const NOT_FOUND = new Set([
  "PEER_ID_INVALID",
  "CHANNEL_INVALID",
  "CHAT_ID_INVALID",
  "USERNAME_INVALID",
  "USERNAME_NOT_OCCUPIED",
  "MSG_ID_INVALID",
])

/**
 * Telegram's refusals as the closed list of codes a script branches on. Only the error's name
 * travels into the message — never a parameter the caller passed, which may be somebody's text.
 */
export const toCliError = (error: unknown): unknown => {
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
      return new CliError(
        "authentication_error",
        "not logged in, or the session was ended — run `tg session start`",
        details,
      )
    }
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
  const code = (error as { code?: unknown })?.code
  if (typeof code === "string" && /^(ECONN|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ENETUNREACH|EHOSTUNREACH)/.test(code)) {
    return new CliError("network_error", `cannot reach Telegram (${code})`)
  }
  return error
}
