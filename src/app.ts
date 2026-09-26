import type { AppIdentity } from "@leemour/cli-messaging/cli"
import { settingsFor } from "@leemour/cli-messaging/cli"
import { VERSION } from "./version.js"

export const TG: AppIdentity = {
  command: "tg",
  appName: "tg-cli",
  envPrefix: "TG",
  description: "A personal Telegram account from the command line, for agents and scripts",
  version: VERSION,
}

export const { resolveSettings, configuredProfiles, changeSetting } = settingsFor(TG)
