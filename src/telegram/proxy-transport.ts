import {
  HttpProxyConnectionError,
  HttpProxyTcpTransport,
  MtProxyTcpTransport,
  type proxyTransportFromUrl,
  SocksProxyConnectionError,
  SocksProxyTcpTransport,
} from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import { type ProxyServer, proxyError, proxyLabel } from "../proxy.js"

type TelegramTransport = ReturnType<typeof proxyTransportFromUrl>

const transportOf = (proxy: ProxyServer): TelegramTransport => {
  const auth = {
    ...(proxy.user === undefined ? {} : { user: proxy.user }),
    ...(proxy.secret === undefined ? {} : { password: proxy.secret }),
  }
  switch (proxy.kind) {
    case "socks5":
      return new SocksProxyTcpTransport({ version: 5, host: proxy.host, port: proxy.port, ...auth })
    case "http":
      return new HttpProxyTcpTransport({ host: proxy.host, port: proxy.port, tls: proxy.tls, ...auth })
    case "mtproxy":
      try {
        return new MtProxyTcpTransport({ host: proxy.host, port: proxy.port, secret: proxy.secret ?? "" })
      } catch {
        // mtcute's words would be "Telegram answered with something unexpected"; the secret is what was wrong.
        throw new CliError("configuration_error", `the MTProxy ${proxyLabel(proxy)} has a secret tg cannot read`)
      }
  }
}

/** Builds the transport once, so `config set` refuses an MTProxy secret the connection would refuse. */
export const checkProxy = (proxy: ProxyServer): void => {
  transportOf(proxy)
}

/** Why a connection through the proxy failed, in words that never carry its password or secret. */
export const proxyFailure = (proxy: ProxyServer, error: unknown): CliError => {
  const code = (error as { code?: unknown })?.code
  return proxyError(
    proxy,
    error instanceof SocksProxyConnectionError || error instanceof HttpProxyConnectionError
      ? `refused: ${hidden(error.message.replace(/^Error while connecting to [^:]+:\d+: /, ""), proxy)}`
      : typeof code === "string"
        ? `cannot be reached (${code})`
        : "did not let tg through",
  )
}

const hidden = (text: string, proxy: ProxyServer) => (proxy.secret ? text.split(proxy.secret).join("[redacted]") : text)

/**
 * mtcute reconnects through a dead proxy until the command's deadline, which reads as "Telegram did
 * not answer" (measured 2026-10-04 against a closed port). The first failure before any connection
 * worked ends the wait instead: by then the proxy, not Telegram, is the likely fault.
 */
export const proxiedTransport = (proxy: ProxyServer): { transport: TelegramTransport; failed: Promise<never> } => {
  const transport = transportOf(proxy)
  const connect = transport.connect.bind(transport)
  let worked = false
  let fail: (error: CliError) => void = () => {}
  const failed = new Promise<never>((_, reject) => {
    fail = reject
  })
  failed.catch(() => {})
  transport.connect = async (dc, signal) => {
    try {
      const connection = await connect(dc, signal)
      worked = true
      return connection
    } catch (error) {
      if (!worked && !signal.aborted) fail(proxyFailure(proxy, error))
      throw error
    }
  }
  return { transport, failed }
}
