import { AsyncLocalStorage } from "node:async_hooks"
import { networkMiddlewares, type RpcCallMiddleware } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import { toCliError } from "./errors.js"
import { bareCheck } from "./feature.js"

const SENDS = new Set(["messages.sendMessage", "messages.sendMedia", "messages.forwardMessages"])
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

export const middlewaresOf = (
  { maxWait, maxRetries }: { maxWait: number; maxRetries: number },
  say: (line: string) => void,
): RpcCallMiddleware[] => [
  ...networkMiddlewares.basic({
    floodWaiter: {
      maxWait,
      maxRetries,
      onBeforeWait: (context, seconds) =>
        say(`Telegram asks to wait ${seconds} s before ${context.request._} — waiting, then going on`),
    },
  }),
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
