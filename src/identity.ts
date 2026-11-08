import type { ManifestIdentity } from "@wirecat/cli-base/wcat/manifest"
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

// What `wcat` and WireCat Desktop show before the tool is installed; src/wcat.ts adds the permission keys. `hosts` is
// what hostFetch holds tg's HTTP to (the Bot API, app registration). MTProto runs over GramJS's own sockets, not HTTP.
export const DESKTOP: ManifestIdentity & { hosts: readonly string[] } = {
  ...TG,
  docs: "https://github.com/WireCatLabs/tg-cli#readme",
  tagline: "Your Telegram account, searchable on your computer",
  syncs: "chats and their messages",
  signIn: {
    gives: "Lets your agent read your Telegram chats, and send messages when you allow it.",
    asks: "Your phone number and the code Telegram sends, and an app ID from my.telegram.org.",
  },
  hosts: ["api.telegram.org", "my.telegram.org"],
  userHosts: "the proxy you set for Telegram, if any",
}
