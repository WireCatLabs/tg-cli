import { CliError, type CliErrorDetails, type ErrorCode } from "@leemour/cli-core"
import type { EventSink } from "@leemour/cli-messaging/cli"

const API = "https://api.telegram.org"
const DEFAULT_TIMEOUT_MS = 30_000

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>

export interface BotTransportOptions {
  token: string
  baseUrl?: string
  fetch?: FetchLike
  timeoutMs?: number
  /** Ends the command's request in flight: the deadline, or Ctrl-C on a command that runs until told to. */
  signal?: AbortSignal
  events?: EventSink
}

/** Telegram's envelope: `ok` and `result`, or `ok: false` with why ([Making requests](https://core.telegram.org/bots/api#making-requests)). */
interface Answer {
  ok?: boolean
  result?: unknown
  error_code?: number
  description?: string
  parameters?: { retry_after?: number; migrate_to_chat_id?: number }
}

/**
 * Telegram's Bot API, method by method.
 *
 * ⚠ **The token is part of every address** — `/bot<token>/<method>` — so the address never leaves
 * this class: not in an error, not in a trace line, and never by passing on a failed request's own
 * error, whose text may hold it. A failure keeps the method, Telegram's code and Telegram's words.
 */
export class TelegramBotTransport {
  readonly #token: string
  readonly #baseUrl: string
  readonly #fetch: FetchLike
  readonly #timeoutMs: number
  readonly #signal: AbortSignal | undefined
  readonly #events: EventSink | undefined

  constructor(options: BotTransportOptions) {
    this.#token = options.token
    this.#baseUrl = options.baseUrl ?? API
    this.#fetch = options.fetch ?? fetch
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    this.#signal = options.signal
    this.#events = options.events
  }

  /** `reads: false` for a write, so a write that got no answer is `outcome_unknown`, never retried by anyone. */
  async call(method: string, params: Record<string, unknown> = {}, { reads = true } = {}): Promise<unknown> {
    this.#events?.({ event: "request", operation: method })
    const started = performance.now()
    const signals = [AbortSignal.timeout(this.#timeoutMs), ...(this.#signal ? [this.#signal] : [])]
    let response: Response
    try {
      response = await this.#fetch(`${this.#baseUrl}/bot${this.#token}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(params),
        signal: AbortSignal.any(signals),
      })
    } catch (error) {
      const failure = this.#unanswered(method, error, reads)
      this.#events?.({ event: "response", operation: method, outcome: "error", errorCode: failure.code })
      throw failure
    }

    const text = await response.text()
    const answered = {
      event: "response" as const,
      operation: method,
      status: response.status,
      bytes: Buffer.byteLength(text),
      durationMs: Math.round(performance.now() - started),
    }
    let answer: Answer
    try {
      answer = JSON.parse(text) as Answer
    } catch {
      this.#events?.({ ...answered, outcome: "error", errorCode: "invalid_response" })
      throw new CliError("invalid_response", `Telegram answered ${method} with something that is not JSON`, {
        operation: method,
        status: response.status,
      })
    }
    if (answer.ok === true) {
      this.#events?.({ ...answered, outcome: "ok" })
      return answer.result
    }
    const refusal = refusalOf(method, answer, response.status)
    this.#events?.({ ...answered, outcome: "error", errorCode: refusal.code })
    throw refusal
  }

  #unanswered(method: string, error: unknown, reads: boolean): CliError {
    const timedOut = (error as { name?: string })?.name === "TimeoutError"
    if (this.#signal?.aborted && (this.#signal.reason as { name?: string })?.name !== "TimeoutError") {
      return new CliError("cancelled", `${method} was cancelled`, { operation: method })
    }
    if (!reads) {
      return new CliError(
        "outcome_unknown",
        `${method} got no answer; Telegram may or may not have carried it out — check before repeating it`,
        { operation: method, retryable: false },
      )
    }
    return new CliError(
      timedOut ? "timeout" : "network_error",
      timedOut ? `${method} got no answer within ${this.#timeoutMs} ms` : `${method} could not reach Telegram`,
      { operation: method, retryable: true },
    )
  }
}

/**
 * Telegram's own words go into the message: they name the problem ("chat not found") and never the
 * token. Its `error_code` is "subject to change", so the code here follows the HTTP status.
 */
const refusalOf = (method: string, answer: Answer, status: number): CliError => {
  const said = answer.description ?? `HTTP ${status}`
  const details: CliErrorDetails = { operation: method, status }
  const retryAfter = answer.parameters?.retry_after
  if (retryAfter !== undefined) {
    return new CliError("rate_limited", `Telegram asks to wait ${retryAfter} s before ${method}: ${said}`, {
      ...details,
      retryAfterMs: retryAfter * 1000,
      retryable: true,
    })
  }
  const migrated = answer.parameters?.migrate_to_chat_id
  if (migrated !== undefined) {
    return new CliError(
      "not_found",
      `this group became a supergroup with id ${migrated} — use that id from now on (${said})`,
      { ...details, migratedTo: String(migrated) },
    )
  }
  // A token Telegram cannot parse answers 404, a revoked one 401; the methods called are this code's own.
  const code: ErrorCode =
    status === 401 || status === 404
      ? "authentication_error"
      : status === 403
        ? "permission_error"
        : status >= 500
          ? "provider_unavailable"
          : /not found/i.test(said)
            ? "not_found"
            : status === 400
              ? "validation_error"
              : "provider_error"
  const message =
    code === "authentication_error" ? `Telegram did not accept this bot token (${said})` : `${method}: ${said}`
  return new CliError(code, message, details)
}
