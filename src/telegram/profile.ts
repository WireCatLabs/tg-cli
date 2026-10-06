import type { ProfileFacts, Registered, Seen } from "@leemour/cli-messaging"
import type { FullUser, User } from "@mtcute/node"

/**
 * Id → month, from tg-id-mcp (MIT, https://github.com/barkoszloy/tg-id-mcp, `REG_DATE_RANGES`):
 * community reference points, 2013-08 to 2024-12, accuracy never measured. Ids are not promised to
 * grow with time, so this is an estimate and is always labelled one.
 */
const ID_MONTHS: readonly [number, string][] = [
  [1, "2013-08"],
  [1_000_000, "2013-10"],
  [10_000_000, "2014-01"],
  [30_000_000, "2014-06"],
  [50_000_000, "2014-07"],
  [80_000_000, "2014-10"],
  [100_000_000, "2015-02"],
  [150_000_000, "2015-07"],
  [200_000_000, "2016-01"],
  [250_000_000, "2016-05"],
  [300_000_000, "2016-08"],
  [350_000_000, "2016-12"],
  [400_000_000, "2017-03"],
  [450_000_000, "2017-07"],
  [500_000_000, "2018-01"],
  [550_000_000, "2018-04"],
  [600_000_000, "2018-06"],
  [650_000_000, "2018-08"],
  [700_000_000, "2018-09"],
  [750_000_000, "2018-11"],
  [800_000_000, "2019-01"],
  [850_000_000, "2019-03"],
  [900_000_000, "2019-05"],
  [950_000_000, "2019-07"],
  [1_000_000_000, "2019-09"],
  [1_100_000_000, "2020-02"],
  [1_200_000_000, "2020-06"],
  [1_300_000_000, "2020-10"],
  [1_400_000_000, "2021-01"],
  [1_500_000_000, "2021-04"],
  [1_600_000_000, "2021-06"],
  [1_700_000_000, "2021-08"],
  [1_800_000_000, "2021-10"],
  [1_900_000_000, "2022-01"],
  [2_000_000_000, "2022-03"],
  [2_100_000_000, "2022-04"],
  [5_000_000_000, "2023-02"],
  [5_500_000_000, "2023-06"],
  [6_000_000_000, "2023-09"],
  [6_500_000_000, "2024-01"],
  [7_000_000_000, "2024-06"],
  [7_500_000_000, "2024-12"],
]

/** Past the last point the table knows nothing: no estimate rather than one years off. */
const NEXT_POINT = 8_000_000_000

export const estimatedRegistration = (id: number): Registered | null => {
  if (id < 1 || id >= NEXT_POINT) return null
  const month = ID_MONTHS.findLast(([from]) => id >= from)?.[1]
  return month ? { at: `${month}-01T00:00:00.000Z`, source: "estimate", precision: "month" } : null
}

/** Telegram's own month, `MM.YYYY`, sent only when they first contact the owner; the estimate otherwise. */
export const registrationOf = (id: number, registrationMonth: string | undefined): Registered | null => {
  const told = registrationMonth?.match(/^(\d{1,2})\.(\d{4})$/)
  if (told) {
    const [, month = "", year = ""] = told
    return { at: `${year}-${month.padStart(2, "0")}-01T00:00:00.000Z`, source: "telegram", precision: "month" }
  }
  return estimatedRegistration(id)
}

/** mtcute folds the empty status into `long_time_ago`; that is the one Telegram shows as hidden. */
export const seenOf = (user: User): Seen | undefined => {
  switch (user.status) {
    case "online":
      return "online"
    case "offline":
      return user.lastOnline?.toISOString() ?? "hidden"
    case "recently":
      return "recently"
    case "within_week":
      return "week"
    case "within_month":
      return "month"
    case "bot":
      return undefined
    default:
      return "hidden"
  }
}

/**
 * Their own photo, or the public one they show when privacy hides it — never the one the owner set
 * for them. Read from Telegram's fields: mtcute's `realPhoto` answers that personal one (0.32.3).
 */
const hasOwnPhoto = ({ full }: FullUser): boolean =>
  full._ === "userFull" && (full.profilePhoto?._ === "photo" || full.fallbackPhoto?._ === "photo")

export const toProfileFacts = (full: FullUser, chats: ProfileFacts["chats"]): ProfileFacts => {
  const settings = full.peerSettings
  const birthday = full.birthday
  const usernames = (full.usernames ?? []).filter(({ active }) => active).map(({ username }) => username)
  const seen = seenOf(full)
  return {
    id: String(full.id),
    name: full.displayName || null,
    usernames: usernames.length > 0 ? usernames : full.username ? [full.username] : [],
    bio: full.bio || null,
    birthday: birthday
      ? [birthday.day, birthday.month, birthday.year]
          .filter((part) => part !== undefined)
          .map((part, index) => (index < 2 ? String(part).padStart(2, "0") : String(part)))
          .join(".")
      : null,
    phone: full.phoneNumber,
    flags: {
      bot: full.isBot,
      verified: full.isVerified,
      premium: full.isPremium,
      scam: full.isScam,
      fake: full.isFake,
      restricted: full.isRestricted,
      deleted: full.isDeleted,
      support: full.isSupport,
    },
    ...(seen === undefined ? {} : { seen }),
    contact: full.isContact,
    mutualContact: full.isMutualContact,
    commonChatsCount: full.commonChatsCount,
    registered: registrationOf(full.id, settings?._ === "peerSettings" ? settings.registrationMonth : undefined),
    hasPhoto: hasOwnPhoto(full),
    chats,
  }
}
