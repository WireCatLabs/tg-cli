import { CliError, type CliErrorDetails, type ErrorCode, isCliError } from "@wirecat/cli-core"
import type { EventSink } from "@wirecat/cli-messaging/cli"
import { apiJson, apiPlainJson, parseApiJson } from "@wirecat/cli-messaging/cli"

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

  /**
   * `reads: false` for a write, so a write that got no answer is `outcome_unknown`, never retried by
   * anyone. `file` goes up in the same request, as multipart: Telegram has no upload step of its own.
   * `timeoutMs` replaces the transport's for one call — a long poll waits longer than any other request.
   */
  async call(
    method: string,
    params: Record<string, unknown> = {},
    {
      reads = true,
      file,
      files = [],
      body,
      secrets = [],
      timeoutMs = this.#timeoutMs,
    }: {
      reads?: boolean
      file?: OutgoingFile
      files?: readonly OutgoingFile[]
      body?: string
      secrets?: readonly string[]
      timeoutMs?: number
    } = {},
  ): Promise<unknown> {
    this.#events?.({ event: "request", operation: method })
    const started = performance.now()
    const signals = [AbortSignal.timeout(timeoutMs), ...(this.#signal ? [this.#signal] : [])]
    let response: Response
    try {
      response = await this.#fetch(`${this.#baseUrl}/bot${this.#token}/${method}`, {
        method: "POST",
        ...(file || files.length
          ? {
              headers: { Accept: "application/json" },
              body: multipart(
                body === undefined ? params : (parseApiJson(body) as Record<string, unknown>),
                file ? [file, ...files] : files,
              ),
            }
          : {
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: body ?? apiJson(params),
            }),
        signal: AbortSignal.any(signals),
      })
    } catch (error) {
      const failure = this.#unanswered(method, error, reads, timeoutMs)
      this.#events?.({ event: "response", operation: method, outcome: "error", errorCode: failure.code })
      throw failure
    }

    let text: string
    try {
      text = await response.text()
    } catch (error) {
      const failure = this.#unanswered(method, error, reads, timeoutMs)
      this.#events?.({ event: "response", operation: method, outcome: "error", errorCode: failure.code })
      throw failure
    }
    const answered = {
      event: "response" as const,
      operation: method,
      status: response.status,
      bytes: Buffer.byteLength(text),
      durationMs: Math.round(performance.now() - started),
    }
    let answer: Answer
    try {
      answer = apiPlainJson(parseApiJson(text)) as Answer
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
    const secretValues = [this.#token, ...secrets]
    if (answer.description) {
      for (const secret of secretValues)
        if (secret) answer.description = answer.description.split(secret).join("[redacted]")
      answer.description = answer.description.replace(/\b\d+:[A-Za-z0-9_-]{20,}\b/g, "[redacted]")
    }
    const refusal = refusalOf(method, answer, response.status)
    this.#events?.({ ...answered, outcome: "error", errorCode: refusal.code })
    throw refusal
  }

  #unanswered(method: string, error: unknown, reads: boolean, timeoutMs: number): CliError {
    // A proxy that refused, or was not there, never passed the request on — not an unknown outcome.
    if (isCliError(error) && error.details.proxy !== undefined) return error
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
      timedOut ? `${method} got no answer within ${timeoutMs} ms` : `${method} could not reach Telegram`,
      { operation: method, retryable: true },
    )
  }
}

/** A file sent with a method — `photo` for sendPhoto, `document`, `voice`. */
export interface OutgoingFile {
  field: string
  name: string
  bytes: Uint8Array
}

/** A field that is not a string goes as JSON, as Telegram reads `reply_parameters` and `caption_entities` from a form. */
const multipart = (params: Record<string, unknown>, files: readonly OutgoingFile[]): FormData => {
  const form = new FormData()
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined) form.append(name, typeof value === "string" ? value : apiJson(value))
  }
  for (const file of files) form.append(file.field, new Blob([file.bytes]), file.name)
  return form
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
