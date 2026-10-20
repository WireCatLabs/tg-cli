import { defineReasons, type ErrorReason } from "@wirecat/cli-base/standards"

/** Every reason tg raises beyond cli-core's, so an agent branches on it (WC-OUT-15). */
export const REASONS: ErrorReason[] = defineReasons(
  (
    [
      ["login.revoked", "authentication_error", "Telegram ended this login"],
      ["login.duplicated", "authentication_error", "Telegram ended this login: two connections used it at once"],
      ["account.deactivated", "authentication_error", "this Telegram account was deleted"],
      ["account.banned", "authentication_error", "Telegram banned this account"],
      ["account.frozen", "permission_error", "Telegram froze this account: it can read but not write"],
      ["account.limited", "permission_error", "Telegram limited this account's messages as spam"],
      [
        "updates.stopped",
        "provider_unavailable",
        "Telegram's updates stopped arriving although the connection is open",
      ],
      ["write.unanswered", "outcome_unknown", "Telegram did not answer a write, so it may have happened"],
    ] satisfies [string, ErrorReason["code"], string][]
  ).map(([reason, code, message]) => ({ reason, code, message, details: [] })),
)
