import {
  HttpProxyConnectionError,
  HttpProxyTcpTransport,
  MtProxyTcpTransport,
  type proxyTransportFromUrl,
  SocksProxyConnectionError,
  SocksProxyTcpTransport,
} from "@mtcute/node"
import { CliError, Credentials, type KeyringStore } from "@wirecat/cli-core"
import { fromFile, type Settings } from "@wirecat/cli-messaging/cli"
import { APP, isolated, pathsFor } from "../paths.js"
import { type ProxyServer, parseProxy, proxyError, proxyLabel } from "../proxy.js"

type TelegramTransport = ReturnType<typeof proxyTransportFromUrl>

export const PROXY_ENV = "TG_PROXY"

/**
 * A proxy's password or MTProxy secret in the OS keyring, one per profile and one for `--defaults`:
 * a profile locked with `TG_PROFILE_LOCK` must not be able to change another profile's password.
 * `undefined` is the defaults; the two namespaces keep a profile named "defaults" apart from them.
 */
export const proxySecrets = ({ env = process.env, keyring }: { env?: NodeJS.ProcessEnv; keyring?: KeyringStore }) => {
  const store = new Credentials({
    configDir: pathsFor(env).config,
    service: APP,
    isolated: isolated(env),
    env,
    ...(keyring ? { keyring } : {}),
  })
  const account = (profile: string | undefined) =>
    profile === undefined ? "proxy:defaults" : `proxy:profile:${profile}`
  return {
    read: (profile: string | undefined) => store.read(account(profile))?.secret,
    write: (profile: string | undefined, secret: string) => store.write(account(profile), secret),
    remove: (profile: string | undefined) => store.remove(account(profile)),
  }
}

export interface ProxyInUse {
  proxy: ProxyServer
  /** `TG_PROXY`, `config file` or `config defaults`. */
  from: string
}

/**
 * `TG_PROXY` over the profile's `proxy` setting. `ALL_PROXY` and `HTTPS_PROXY` are not read: they
 * are set for other tools, and a personal account sent through a work proxy nobody chose for it
 * would be a surprise found late.
 */
export const resolveProxy = (
  settings: Pick<Settings, "profile" | "configured" | "shared">,
  { env = process.env, keyring }: { env?: NodeJS.ProcessEnv; keyring?: KeyringStore } = {},
): ProxyInUse | undefined => {
  const given = env[PROXY_ENV]?.trim()
  if (given) return { proxy: parseProxy(given, PROXY_ENV), from: PROXY_ENV }
  const { value, from } = fromFile<string | undefined>(settings, "proxy", undefined)
  if (value === undefined) return undefined
  const proxy = parseProxy(value, "the proxy setting")
  const secrets = proxySecrets({ env, ...(keyring ? { keyring } : {}) })
  const secret = secrets.read(settings.profile) ?? (from === "config defaults" ? secrets.read(undefined) : undefined)
  if (proxy.kind === "mtproxy" && !secret)
    throw new CliError(
      "configuration_error",
      `no secret is stored for the MTProxy ${proxyLabel(proxy)} — run \`tg config set proxy -\` again`,
    )
  return { proxy: secret ? { ...proxy, secret } : proxy, from }
}

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
