import type { AppIdentity } from "@wirecat/cli-core/cli"
import { REASONS } from "./reasons.js"
import { VERSION } from "./version.js"

/** Apart from the settings, so the bin can start without loading cli-core's command tree. */
export const TG: AppIdentity = {
  command: "tg",
  appName: "tg-cli",
  envPrefix: "TG",
  description: "A personal Telegram account from the command line, for agents and scripts",
  version: VERSION,
  issues: "https://github.com/WireCatLabs/tg-cli/issues/new",
  locale: "en-GB",
  errors: { reasons: REASONS, details: ["migrated_chat_id", "proxy"] },
}
