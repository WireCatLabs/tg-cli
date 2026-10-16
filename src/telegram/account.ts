import type { MessengerAdapter } from "@wirecat/cli-core/cli"
import { uploadBlob } from "@wirecat/cli-core/sends"
import type { Feature } from "./feature.js"
import { type Account, toAccount } from "./map.js"

export interface FrozenStanding {
  state: "frozen"
  since?: string
  until?: string
  appealUrl?: string
  hint: string
}

const unixTime = (value: unknown): string | undefined =>
  typeof value === "number" && value > 0 ? new Date(value * 1000).toISOString() : undefined

/** Telegram sets `freeze_since_date` non-zero only on a frozen account; the dates are unix seconds. */
export const frozenOf = (config: Record<string, unknown>): FrozenStanding | undefined => {
  const since = unixTime(config.freeze_since_date)
  if (!since) return undefined
  const until = unixTime(config.freeze_until_date)
  const appealUrl =
    typeof config.freeze_appeal_url === "string" && config.freeze_appeal_url ? config.freeze_appeal_url : undefined
  return {
    state: "frozen",
    since,
    ...(until ? { until } : {}),
    ...(appealUrl ? { appealUrl } : {}),
    hint:
      "Telegram froze this account: it can read but not write" +
      (until ? `, and deletes it on ${until.slice(0, 10)}` : "") +
      (appealUrl ? ` unless an appeal is accepted — appeal at ${appealUrl}` : " unless an appeal is accepted"),
  }
}

/** Only here the phone: `account show` masks it, and a login's answer is printed as it is. */
export const me = (feature: Feature): Promise<Account> => {
  return feature.call(async () => {
    const user = await feature.client.getMe()
    return { ...toAccount(user), phone: user.phoneNumber }
  })
}

/**
 * For `doctor --online`: Telegram's clock, from `help.getConfig`'s `date` in whole seconds, and
 * whether the account is frozen, from `help.getAppConfig`'s `freeze_*` fields
 * (core.telegram.org/api/config, /api/auth#frozen-accounts). A frozen account still reads, so a
 * working `me()` cannot tell. Both read only.
 */
export const health = (
  feature: Feature,
): Promise<{
  serverTime: number
  serverTimeResolutionMs: number
  standingChecked: boolean
  standing?: FrozenStanding
}> => {
  return feature.call(async () => {
    const config = await feature.client.call({ _: "help.getConfig" })
    const serverTime = config.date * 1000
    let appConfig: Record<string, unknown>
    try {
      appConfig = await feature.client.appConfig.get()
    } catch {
      // The clock is still worth reporting; the standing is then unknown, never "active".
      return { serverTime, serverTimeResolutionMs: 1000, standingChecked: false }
    }
    const standing = frozenOf(appConfig)
    return { serverTime, serverTimeResolutionMs: 1000, standingChecked: true, ...(standing ? { standing } : {}) }
  })
}

/** Telegram calls the description the bio. A photo goes up as a new profile photo. */
export const updateProfile = (
  feature: Feature,
  { firstName, lastName, description, photo }: Parameters<NonNullable<MessengerAdapter["updateProfile"]>>[0],
): Promise<Account> => {
  return feature.call(async () => {
    if (firstName !== undefined || lastName !== undefined || description !== undefined) {
      await feature.client.updateProfile({
        ...(firstName === undefined ? {} : { firstName }),
        ...(lastName === undefined ? {} : { lastName }),
        ...(description === undefined ? {} : { bio: description }),
      })
    }
    if (photo) await feature.client.setMyProfilePhoto({ type: "photo", media: await uploadBlob(photo.source) })
    const user = await feature.client.getMe()
    return { ...toAccount(user), phone: user.phoneNumber }
  })
}
