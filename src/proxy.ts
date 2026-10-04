import { CliError } from "@leemour/cli-core"
import * as v from "valibot"

export type ProxyKind = "socks5" | "http" | "mtproxy"

export interface ProxyServer {
  kind: ProxyKind
  host: string
  port: number
  /** `https://`: the connection to the proxy itself is TLS. */
  tls: boolean
  user?: string
  /** The proxy password, or the MTProxy secret. Never printed, never in the configuration file. */
  secret?: string
}

const SHAPES = "socks5://host:port, http://host:port, https://host:port or an MTProxy link (tg://proxy?server=…)"
const TELEGRAM_HOSTS = new Set(["t.me", "telegram.me", "telegram.dog"])

/**
 * A proxy URL as tg reads it. ⚠ Every error names only where the value came from: the value can
 * hold a password, and an error is printed, kept in a run record and pasted into issues.
 */
export const parseProxy = (text: string, from: string): ProxyServer => {
  const fail = (why: string): never => {
    throw new CliError("configuration_error", `${from} ${why} — it takes ${SHAPES}`)
  }
  let url: URL
  try {
    url = new URL(text.trim())
  } catch {
    return fail("is not a URL")
  }
  const link = telegramLink(url)
  if (link) return fromLink(link.kind, url.searchParams, fail)
  const port = (fallback: number) => {
    const number = url.port === "" ? fallback : Number(url.port)
    return number >= 1 && number <= 65_535 ? number : fail("has no valid port")
  }
  if (url.hostname === "") fail("names no host")
  const credentials = {
    ...(url.username ? { user: decodeURIComponent(url.username) } : {}),
    ...(url.password ? { secret: decodeURIComponent(url.password) } : {}),
  }
  const host = url.hostname.replace(/^\[(.*)\]$/, "$1")
  switch (url.protocol) {
    case "socks5:":
      return { kind: "socks5", host, port: port(1080), tls: false, ...credentials }
    case "http:":
      return { kind: "http", host, port: port(80), tls: false, ...credentials }
    case "https:":
      return { kind: "http", host, port: port(443), tls: true, ...credentials }
    default:
      return fail(`uses ${url.protocol.replace(/:$/, "")}, which tg does not speak`)
  }
}

/** Telegram's own share links: `tg://proxy?…`, `tg://socks?…` and their `https://t.me/…` forms. */
const telegramLink = (url: URL): { kind: "proxy" | "socks" } | undefined => {
  const path =
    url.protocol === "tg:"
      ? (url.hostname || url.pathname.replace(/^\/+/, "")).toLowerCase()
      : (url.protocol === "https:" || url.protocol === "http:") && TELEGRAM_HOSTS.has(url.hostname.toLowerCase())
        ? url.pathname.replace(/^\/+|\/+$/g, "").toLowerCase()
        : undefined
  return path === "proxy" || path === "socks" ? { kind: path } : undefined
}

const fromLink = (kind: "proxy" | "socks", query: URLSearchParams, fail: (why: string) => never): ProxyServer => {
  const host = query.get("server") ?? fail("has no server")
  const port = Number(query.get("port"))
  if (!Number.isInteger(port) || port < 1 || port > 65_535) fail("has no valid port")
  const secret = query.get(kind === "proxy" ? "secret" : "pass") ?? undefined
  const user = kind === "socks" ? (query.get("user") ?? undefined) : undefined
  return {
    kind: kind === "proxy" ? "mtproxy" : "socks5",
    host,
    port,
    tls: false,
    ...(user ? { user } : {}),
    ...(secret ? { secret } : {}),
  }
}

/** The proxy with its password or secret left out: what the configuration file keeps and what tg prints. */
export const proxyLabel = (proxy: ProxyServer): string => {
  if (proxy.kind === "mtproxy") return `tg://proxy?server=${encodeURIComponent(proxy.host)}&port=${proxy.port}`
  const user = proxy.user === undefined ? "" : `${encodeURIComponent(proxy.user)}@`
  return proxyAddress(proxy).replace("://", `://${user}`)
}

/** Scheme, host and port only — for an HTTP agent, which takes the credentials apart from the address. */
export const proxyAddress = (proxy: ProxyServer): string => {
  const host = proxy.host.includes(":") ? `[${proxy.host}]` : proxy.host
  const scheme = proxy.kind === "socks5" ? "socks5" : proxy.tls ? "https" : "http"
  return `${scheme}://${host}:${proxy.port}`
}

/** A proxy that refused or could not be reached — `configuration_error`, so it never reads as Telegram being down. */
export const proxyError = (proxy: ProxyServer, reason: string): CliError =>
  new CliError(
    "configuration_error",
    `the proxy ${proxyLabel(proxy)} ${reason} — check it, or change it with \`tg config set proxy\` or TG_PROXY`,
    { proxy: proxyLabel(proxy), retryable: true },
  )

/**
 * The `proxy` setting. It holds no secret, as no setting does: `tg config set proxy` moves the
 * password or the MTProxy secret to the OS keyring before the file is written, so this refuses only
 * a file edited by hand.
 */
export const proxySetting = v.pipe(
  v.string("has to be a proxy URL, in quotes"),
  v.check((text) => {
    try {
      return parseProxy(text, "proxy").secret === undefined
    } catch {
      return false
    }
  }, `has to be ${SHAPES}, without its password or secret — \`tg config set proxy <url>\` keeps those in the OS keyring`),
)
