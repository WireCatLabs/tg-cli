import type { Dispatcher } from "undici"
import { type ProxyServer, proxyAddress, proxyError } from "../proxy.js"
import type { FetchLike } from "./transport.js"

/**
 * The Bot API is HTTPS, so it can go through a SOCKS5 or an HTTP proxy — never an MTProxy, which
 * carries only Telegram's own protocol. Credentials go as options, never in the URL, so no error
 * undici builds from the URL can carry them.
 */
export const botDispatcher = async (proxy: ProxyServer): Promise<Dispatcher | undefined> => {
  if (proxy.kind === "mtproxy") return undefined
  // Loaded on use: Bun answers `import "undici"` with its own module, which has no SOCKS agent.
  const { ProxyAgent, Socks5ProxyAgent } = await import("undici")
  const uri = proxyAddress(proxy)
  if (typeof ProxyAgent !== "function" || typeof Socks5ProxyAgent !== "function")
    throw proxyError(proxy, "cannot carry the Bot API under this runtime — run tg with Node")
  if (proxy.kind === "socks5")
    return new Socks5ProxyAgent(uri, {
      ...(proxy.user === undefined ? {} : { username: proxy.user }),
      ...(proxy.secret === undefined ? {} : { password: proxy.secret }),
    })
  const basic =
    proxy.user === undefined
      ? undefined
      : `Basic ${Buffer.from(`${proxy.user}:${proxy.secret ?? ""}`).toString("base64")}`
  return new ProxyAgent({ uri, ...(basic ? { token: basic } : {}) })
}

/**
 * undici's own `fetch` with its agent, not the global one: an agent from one copy of undici is not
 * promised to work with another's fetch.
 */
export const proxiedBotFetch = (proxy: ProxyServer): FetchLike | undefined => {
  if (proxy.kind === "mtproxy") return undefined
  let dispatcher: Promise<Dispatcher | undefined> | undefined
  return async (url, init) => {
    dispatcher ??= botDispatcher(proxy)
    const [{ fetch }, agent] = await Promise.all([import("undici"), dispatcher])
    try {
      return (await fetch(url, { ...(init as object), ...(agent ? { dispatcher: agent } : {}) })) as unknown as Response
    } catch (error) {
      throw proxyRefusal(proxy, error) ?? error
    }
  }
}

/**
 * With a proxy, tg opens no connection but the one to the proxy, so a refused or unknown address is
 * the proxy's; a tunnel the proxy would not open is too. Either way the request never left.
 */
const proxyRefusal = (proxy: ProxyServer, error: unknown): Error | undefined => {
  for (let cause = error; cause instanceof Error; cause = cause.cause) {
    const code = (cause as { code?: unknown }).code
    const status = /Proxy response \((\d+)\)/.exec(cause.message)?.[1]
    const reason =
      status !== undefined
        ? `refused the tunnel (HTTP ${status})`
        : typeof code === "string" && code.startsWith("UND_ERR_SOCKS5")
          ? `refused (${code})`
          : typeof code === "string" && /^(ECONN|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ENETUNREACH|EHOSTUNREACH)/.test(code)
            ? `cannot be reached (${code})`
            : undefined
    if (reason) return proxyError(proxy, reason)
  }
  return undefined
}
