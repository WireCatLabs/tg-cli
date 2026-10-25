import { CliError, Credentials, type KeyringStore } from "@wirecat/cli-base"
import type { CheckWords } from "@wirecat/cli-core"
import { fromFile, type Settings } from "@wirecat/cli-core/cli"
import { APP, isolated, pathsFor } from "../paths.js"
import { type ProxyServer, parseProxy, proxyLabel } from "../proxy.js"
import type { Check } from "./feature.js"

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
  {
    env = process.env,
    keyring,
    checks,
  }: { env?: NodeJS.ProcessEnv; keyring?: KeyringStore; checks: CheckWords<Check> },
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
      `no secret is stored for the MTProxy ${proxyLabel(proxy)} — run ${checks("config.set", "proxy -")} again`,
    )
  return { proxy: secret ? { ...proxy, secret } : proxy, from }
}
