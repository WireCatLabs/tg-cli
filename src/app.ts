import type { AppIdentity } from "@leemour/cli-messaging/cli"
import { type Configuration, settingsFor } from "@leemour/cli-messaging/cli"
import * as v from "valibot"
import { proxySetting } from "./proxy.js"
import { VERSION } from "./version.js"

export const TG: AppIdentity = {
  command: "tg",
  appName: "tg-cli",
  envPrefix: "TG",
  description: "A personal Telegram account from the command line, for agents and scripts",
  version: VERSION,
  issues: "https://github.com/WireCatLabs/tg-cli/issues/new",
  locale: "en-GB",
}

export const CONFIG: Configuration = settingsFor(TG, { profile: { proxy: v.optional(proxySetting) } })
export const { resolveSettings, configuredProfiles, changeSetting } = CONFIG
