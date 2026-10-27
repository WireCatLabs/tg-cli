import { AsyncLocalStorage } from "node:async_hooks"
import { networkMiddlewares, type RpcCallMiddleware, type RpcCallMiddlewareContext, tl } from "@mtcute/node"
import { CliError, isCliError } from "@wirecat/cli-base"
import { bareCheck } from "@wirecat/cli-core"
import { currentAttempt, providerRequest, runEvent } from "@wirecat/cli-core/cli"
import { toCliError } from "./errors.js"

const SENDS = new Set([
  "messages.sendMessage",
  "messages.sendMedia",
  "messages.sendMultiMedia",
  "messages.forwardMessages",
  "messages.startBot",
])
const send = new AsyncLocalStorage<{ accepted: boolean }>()

/**
 * Notes when Telegram answers a send request inside `sending`. mtcute's sendText may look peers up after
 * the message went, so a FLOOD_WAIT alone cannot say whether it was sent.
 */
const noteAcceptedSend: RpcCallMiddleware = async (context, next) => {
  const answer = await next(context)
  const current = send.getStore()
  if (current && SENDS.has(context.request._) && (answer as { _?: unknown })?._ !== "mt_rpc_error")
    current.accepted = true
  return answer
}

interface Tries {
  attempt: number
  waitMs?: number
}
// floodWaiter and internalErrorsHandler retry by passing the same context to `next` again.
const tries = new WeakMap<RpcCallMiddlewareContext, Tries>()

const codeOf = (error: unknown): string => {
  const known = toCliError(error, bareCheck)
  return isCliError(known) ? known.code : "network_error"
}

/** `FLOOD_WAIT_12` → `FLOOD_WAIT`: the seconds go into the retry's `waitMs`. */
const errorKey = (message: string): string => message.replace(/_\d+(?=_|$)/g, "")

/**
 * One request line and one response line per RPC that goes on the wire, into the run under way. Only the
 * method name leaves the request: every other field of it is what the person sent or asked for.
 */
const recordRequest: RpcCallMiddleware = async (context, next) => {
  const tried = tries.get(context)
  const attempt = (tried?.attempt ?? 0) + 1
  // mtcute's own retry names its attempt; a first try takes the attempt of a retry made above it (`patiently`).
  const retried =
    attempt > 1 ? { attempt, ...(tried?.waitMs === undefined ? {} : { waitMs: tried.waitMs }) } : undefined
  const end = providerRequest(context.request._, runEvent, {
    transport: "mtproto",
    ...(retried ?? currentAttempt() ?? { attempt: 1 }),
  })
  tries.set(context, { attempt })
  let answer: unknown
  try {
    answer = await next(context)
  } catch (error) {
    end({ errorCode: codeOf(error) })
    throw error
  }
  const failure = answer as { _?: unknown; errorCode?: number; errorMessage?: string }
  if (failure?._ === "mt_rpc_error" && typeof failure.errorMessage === "string") {
    end({
      errorCode: codeOf(tl.RpcError.fromTl(failure)),
      providerError: errorKey(failure.errorMessage),
    })
  } else end()
  return answer
}

export const middlewaresOf = (
  { maxWait, maxRetries }: { maxWait: number; maxRetries: number },
  say: (line: string) => void,
): RpcCallMiddleware[] => [
  ...networkMiddlewares.basic({
    floodWaiter: {
      maxWait,
      maxRetries,
      onBeforeWait: (context, seconds) => {
        const tried = tries.get(context)
        if (tried) tried.waitMs = seconds * 1000
        say(`Telegram asks to wait ${seconds} s before ${context.request._} — waiting, then going on`)
      },
    },
  }),
  // Inside the flood and internal-error waiters, so each retry they make is a line of its own.
  recordRequest,
  noteAcceptedSend,
]

/** One send. A rate limit before Telegram accepted it sent nothing, so `retry.safe` may say so. */
export const sending = async <T>(work: () => Promise<T>): Promise<T> => {
  const current = { accepted: false }
  try {
    return await send.run(current, work)
  } catch (error) {
    const known = toCliError(error, bareCheck)
    if (current.accepted || !(known instanceof CliError) || known.code !== "rate_limited") throw error
    throw new CliError(known.code, known.message, { ...known.details, sent: false })
  }
}
