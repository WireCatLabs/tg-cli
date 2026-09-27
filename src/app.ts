import type { AppIdentity } from "@leemour/cli-messaging/cli"
import { type Configuration, settingsFor } from "@leemour/cli-messaging/cli"
import { VERSION } from "./version.js"

export const TG: AppIdentity = {
  command: "tg",
  appName: "tg-cli",
  envPrefix: "TG",
  description: "A personal Telegram account from the command line, for agents and scripts",
  version: VERSION,
}

export const CONFIG: Configuration = settingsFor(TG)
export const { resolveSettings, configuredProfiles, changeSetting } = CONFIG
