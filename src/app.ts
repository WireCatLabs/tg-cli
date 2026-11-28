import { type Configuration, settingsFor } from "@wirecat/cli-core"
import * as v from "valibot"
import { TG } from "./identity.js"
import { proxySetting } from "./proxy.js"

export { TG } from "./identity.js"

export const CONFIG: Configuration = settingsFor(TG, { profile: { proxy: v.optional(proxySetting) } })
export const { resolveSettings, configuredProfiles, changeSetting } = CONFIG
