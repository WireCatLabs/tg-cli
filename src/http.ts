import { type FetchLike, hostFetch } from "@wirecat/cli-base/http"

type Send = (url: string, init: RequestInit) => Promise<Response>

/** `send` (a proxy's fetch, a test's), or the runtime's when absent, held to `hosts` by hostFetch. */
export const guardedFetch = (hosts: readonly string[], send?: Send, timeoutMs?: number): FetchLike =>
  hostFetch({
    hosts,
    ...(send ? { fetch: (input, init) => send(input instanceof Request ? input.url : String(input), init ?? {}) } : {}),
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
  })
