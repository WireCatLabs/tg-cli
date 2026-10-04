import { CliError, isCliError } from "@leemour/cli-core"
import { readSecret } from "@leemour/cli-messaging"
import { environmentOf } from "@leemour/cli-messaging/cli"
import type { Command } from "commander"
import { CONFIG } from "../app.js"
import { parseProxy, proxyLabel } from "../proxy.js"
import { checkProxy, proxySecrets } from "../telegram/proxy.js"
import type { Environment } from "./context.js"

/**
 * `config set proxy` and `config unset proxy` around the shared command: the password or MTProxy
 * secret goes to the OS keyring, and only the URL without it reaches the file — and the shared
 * command's own messages, which quote the value. A URL with a secret comes from `-`, typed or
 * piped, never from argv, where `ps` and shell history would keep it.
 */
export const withProxySecrets = (config: Command): Command => {
  let pending: (() => void) | undefined
  config.hook("preAction", async (_self, action) => {
    pending = undefined
    const [setting, value] = action.processedArgs as [string, string | undefined]
    if (setting !== "proxy" || !["set", "unset"].includes(action.name())) return
    const { bot, personal } = action.opts<{ bot?: boolean; personal?: boolean }>()
    if (bot || personal)
      throw new CliError(
        "validation_error",
        "proxy is one setting for the profile's account and its bot alike — drop --bot and --personal",
      )
    const { env = process.env, keyring, stdin = process.stdin } = environmentOf<Environment>(action)
    const secrets = proxySecrets({ env, ...(keyring ? { keyring } : {}) })

    const scope = action.opts<{ defaults?: boolean }>().defaults
      ? undefined
      : CONFIG.resolveSettings(action.optsWithGlobals(), { env }).profile
    if (action.name() === "unset") {
      pending = () => secrets.remove(scope)
      return
    }

    const typed = value === "-"
    const text = typed ? await readSecret("proxy URL, hidden as you type: ", { input: stdin }) : String(value)
    const proxy = asValidation(() => parseProxy(text, "proxy"))
    if (!typed && proxy.secret !== undefined)
      throw new CliError(
        "validation_error",
        "a proxy password or MTProxy secret never goes on the command line — run `tg config set proxy -` and paste the URL",
      )
    if (proxy.kind === "mtproxy" && proxy.secret === undefined)
      throw new CliError(
        "validation_error",
        "an MTProxy link needs its secret — run `tg config set proxy -` and paste the whole link",
      )
    asValidation(() => checkProxy(proxy))
    const label = proxyLabel(proxy)
    action.processedArgs[1] = label
    pending = () => {
      if (proxy.secret === undefined) secrets.remove(scope)
      else secrets.write(scope, proxy.secret)
    }
  })
  config.hook("postAction", () => {
    pending?.()
    pending = undefined
  })
  return config
}

const asValidation = <T>(work: () => T): T => {
  try {
    return work()
  } catch (error) {
    throw isCliError(error) ? new CliError("validation_error", error.message) : error
  }
}
