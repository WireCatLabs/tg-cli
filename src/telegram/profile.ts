import type { ProfileFacts, Registered, Seen } from "@leemour/cli-messaging"
import type { FullUser, User } from "@mtcute/node"

/**
 * Id → month. A monotone best fit to 212 real sign-up dates (jobians/telegram-id-age, MIT, commit 86605dc,
 * up to 2025-11), with tg-id-mcp's points (MIT, `REG_DATE_RANGES`) filling 2017–2021 where those are sparse
 * and the 2021-12 start of 52-bit ids from the Bot API 5.5 changelog. Checked against points left out of the
 * fit, 2022–2025 estimates are off by a median of 1–2 months and at most 4–6 for nine in ten. Ids are not
 * promised to grow with time, so this is an estimate and is always labelled one.
 */
const ID_MONTHS: readonly [number, string][] = [
  [1, "2013-08"],
  [2_000_000, "2013-11"],
  [5_000_000, "2013-12"],
  [10_000_000, "2014-02"],
  [30_000_000, "2014-03"],
  [40_000_000, "2014-05"],
  [50_000_000, "2014-09"],
  [60_000_000, "2014-10"],
  [100_000_000, "2015-03"],
  [102_000_000, "2015-05"],
  [112_000_000, "2015-07"],
  [124_000_000, "2015-08"],
  [125_000_000, "2015-09"],
  [132_000_000, "2015-10"],
  [140_000_000, "2015-12"],
  [145_000_000, "2016-01"],
  [160_000_000, "2016-03"],
  [180_000_000, "2016-04"],
  [200_000_000, "2016-06"],
  [250_000_000, "2016-09"],
  [280_000_000, "2016-10"],
  [290_000_000, "2016-11"],
  [295_000_000, "2016-12"],
  [300_000_000, "2017-01"],
  [330_000_000, "2017-02"],
  [360_000_000, "2017-03"],
  [400_000_000, "2017-07"],
  [500_000_000, "2018-01"],
  [550_000_000, "2018-04"],
  [600_000_000, "2018-06"],
  [650_000_000, "2018-08"],
  [700_000_000, "2018-09"],
  [750_000_000, "2018-11"],
  [800_000_000, "2019-01"],
  [805_000_000, "2019-03"],
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
  [5_000_000_000, "2021-12"],
  [5_040_000_000, "2022-01"],
  [5_100_000_000, "2022-02"],
  [5_150_000_000, "2022-03"],
  [5_300_000_000, "2022-04"],
  [5_350_000_000, "2022-05"],
  [5_434_000_000, "2022-06"],
  [5_440_000_000, "2022-07"],
  [5_550_000_000, "2022-10"],
  [5_780_000_000, "2022-11"],
  [5_800_000_000, "2022-12"],
  [5_865_000_000, "2023-01"],
  [5_990_000_000, "2023-05"],
  [6_300_000_000, "2023-07"],
  [6_400_000_000, "2023-11"],
  [6_530_000_000, "2023-12"],
  [6_550_000_000, "2024-01"],
  [7_000_000_000, "2024-04"],
  [7_050_000_000, "2024-05"],
  [7_243_000_000, "2024-06"],
  [7_260_000_000, "2024-07"],
  [7_450_000_000, "2024-08"],
  [7_500_000_000, "2024-12"],
  [7_800_000_000, "2025-01"],
  [7_834_000_000, "2025-06"],
  [7_900_000_000, "2025-07"],
  [8_200_000_000, "2025-08"],
  [8_380_000_000, "2025-10"],
  [8_480_000_000, "2025-11"],
  [8_560_000_000, "2025-12"],
]

/**
 * The last point only marks where the table ends: the table cannot tell an id just above it made in
 * 2025 from one made in 2026, so anything at or past it gets no estimate rather than a possibly wrong one.
 */
const TABLE_END = ID_MONTHS.at(-1)?.[0] ?? 0

export const estimatedRegistration = (id: number): Registered | null => {
  if (id < 1 || id >= TABLE_END) return null
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
