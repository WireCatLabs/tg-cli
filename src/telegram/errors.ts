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
  "MESSAGE_ID_INVALID",
])

/** Refusals whose name alone would not tell a person what to do. */
const EXPLAINED: Record<string, [ErrorCode, string]> = {
  CHANNEL_PRIVATE: ["permission_error", "you cannot access this channel or supergroup"],
  CHAT_DISCUSSION_UNALLOWED: ["validation_error", "a linked discussion group cannot enable forum topics"],
  CHANNEL_FORUM_MISSING: ["validation_error", "enable forum topics before creating a topic"],
  TOPIC_CLOSED: ["permission_error", "that forum topic is closed; choose an open topic"],
  TOPIC_DELETED: ["not_found", "that forum topic was deleted; check `topics list`"],
  TOPIC_ID_INVALID: ["not_found", "that forum topic does not exist; check `topics list`"],
  MSG_VOICE_MISSING: ["validation_error", "that message is not a voice or video note"],
  MSG_VOICE_TOO_LONG: ["validation_error", "the voice message is too long for Telegram to transcribe"],
  PREMIUM_ACCOUNT_REQUIRED: [
    "permission_error",
    "Telegram transcribes only for Premium accounts, or a few messages a week on the free trial, used up now",
  ],
  TRANSCRIPTION_FAILED: ["provider_error", "Telegram could not transcribe this voice message"],
  PHONE_NOT_OCCUPIED: ["not_found", "nobody Telegram lets you find has this number"],
  USER_NOT_MUTUAL_CONTACT: [
    "permission_error",
    "Telegram lets you add someone who left or was removed only if you are each other's contacts — " +
      "send them the invite link instead (`tg chats link show <chat>`)",
  ],
  USER_PRIVACY_RESTRICTED: ["permission_error", "their privacy settings do not let you add them to a group"],
  CHAT_ADMIN_REQUIRED: ["permission_error", "only an admin of this chat may do that"],
  MEGAGROUP_REQUIRED: ["validation_error", "that works only in a supergroup"],
  BROADCAST_REQUIRED: ["validation_error", "that works only in a channel"],
}

type Standing = (login: string) => [ErrorCode, string, "frozen" | "limited" | "banned" | "deactivated" | "revoked"]

const revoked: Standing = (login) => ["authentication_error", `Telegram ended this login — run ${login}`, "revoked"]
const frozen: Standing = () => [
  "permission_error",
  "Telegram froze this account: it can read but not write — `tg doctor --online` shows until when, and where to appeal",
  "frozen",
]

/**
 * Refusals that say what state the account is in, so `doctor --online` can name it. Logging in again
 * cannot undo a ban, so those never send the person to `session start`. FROZEN_METHOD_INVALID is a
 * 420, Telegram's flood code, and would otherwise read as "wait and retry" (core.telegram.org/api/auth#frozen-accounts).
 */
const STANDINGS: Record<string, Standing> = {
  AUTH_KEY_UNREGISTERED: revoked,
  SESSION_REVOKED: revoked,
  SESSION_EXPIRED: revoked,
  USER_DEACTIVATED: () => [
    "authentication_error",
    "this Telegram account was deleted — a new login cannot bring it back",
    "deactivated",
  ],
  USER_DEACTIVATED_BAN: () => [
    "authentication_error",
    "Telegram banned this account — a new login cannot lift it; only Telegram can",
    "banned",
  ],
  FROZEN_METHOD_INVALID: frozen,
  FROZEN_PARTICIPANT_MISSING: frozen,
  // Not a wait: retrying is what made it. `limited` makes cli-messaging hold every write for a while.
  PEER_FLOOD: () => [
    "permission_error",
    "Telegram limited this account's messages as spam (PEER_FLOOD) — it can still read; " +
      "message @SpamBot in a Telegram app to see until when",
    "limited",
  ],
}

/** mtcute's argument errors by the start of their text, which may go on to quote what was typed. */
const ARGUMENT_KINDS: [RegExp, string][] = [
  [/^You haven't joined /, "you are not a member of that chat"],
  [/^Invalid message link/, "that is not a message link Telegram understands"],
  [/^Invalid invite link/, "that is not an invite link Telegram understands"],
  [
    /^Invalid phone number|^phone should only contain digits|is an invalid test phone number$/,
    "that phone number is not valid",
  ],
  [/^Provided code was invalid/, "the login code was wrong"],
  [/^Provided password was invalid/, "the two-step verification password was wrong"],
  [/^You can forward no more than 100 messages/, "Telegram forwards at most 100 messages at once"],
]

const argumentKind = (message: string) =>
  ARGUMENT_KINDS.find(([pattern]) => pattern.test(message))?.[1] ?? "Telegram refused an argument this command passed"

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
    // The signal that reopens owner-process routing (docs/plans/2026-10-04-session-sharing.md, §6).
    if (error.text === "AUTH_KEY_DUPLICATED") {
      return new CliError(
        "authentication_error",
        `Telegram ended this login because two connections used it at once (tg serve, tg mcp, ` +
          `tg watch or a command beside them) — run ${login}`,
        details,
      )
    }
    const standing = STANDINGS[error.text]
    if (standing) {
      const [code, message, state] = standing(login)
      return new CliError(code, message, { ...details, standing: { state, hint: message } })
    }
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
  // mtcute builds these messages from what was typed — a chat title can be somebody's text — so none is passed on.
  if (error instanceof MtArgumentError) return new CliError("validation_error", argumentKind(error.message))
  // Measured 2026-10-01: a bare user id fails until this session has seen the person somewhere.
  if (error instanceof MtPeerNotFoundError) {
    return new CliError(
      "not_found",
      "Telegram does not know that chat or user — a person's id works only once this account has seen them; " +
        "name them by @username, or read a chat they are in first",
    )
  }
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
