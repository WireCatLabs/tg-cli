import type { User } from "@mtcute/node"
import { describe, expect, it } from "vitest"
import { estimatedRegistration, registrationOf, seenOf } from "./profile.js"

const seen = (status: string, lastOnline: Date | null = null) => seenOf({ status, lastOnline } as unknown as User)

describe("a person's profile from Telegram", () => {
  it("keeps the last-seen buckets apart from hidden", () => {
    expect(seen("online")).toBe("online")
    expect(seen("offline", new Date("2026-10-01T10:00:00.000Z"))).toBe("2026-10-01T10:00:00.000Z")
    expect(seen("recently")).toBe("recently")
    expect(seen("within_week")).toBe("week")
    expect(seen("within_month")).toBe("month")
    expect(seen("long_time_ago")).toBe("hidden")
    expect(seen("bot")).toBeUndefined()
  })

  it("prefers Telegram's own registration month and labels the id estimate", () => {
    expect(registrationOf(7_600_000_000, "3.2025")).toEqual({
      at: "2025-03-01T00:00:00.000Z",
      source: "telegram",
      precision: "month",
    })
    expect(registrationOf(160_000_000, undefined)).toEqual({
      at: "2016-03-01T00:00:00.000Z",
      source: "estimate",
      precision: "month",
    })
  })

  it.each([
    [152_079_341, "2016-01-22", 3],
    [5_170_390_109, "2022-02-28", 3],
    [5_721_138_769, "2022-09-23", 3],
    [6_074_830_852, "2023-05-01", 4],
    [6_765_129_195, "2023-11-02", 4],
    [7_104_310_277, "2024-04-19", 4],
    [7_293_965_553, "2024-06-16", 4],
    [8_135_088_730, "2025-03-05", 6],
    [8_461_579_295, "2025-09-11", 6],
  ])("estimates id %d, signed up %s, within %d months", (id, signedUp, months) => {
    const at = estimatedRegistration(id)?.at ?? ""
    const monthIndex = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7))
    expect(Math.abs(monthIndex(at) - monthIndex(signedUp))).toBeLessThanOrEqual(months)
  })

  it("does not make an account that had a photo in 2025-03 look younger", () => {
    expect((estimatedRegistration(7_520_000_000)?.at ?? "9999").slice(0, 7) <= "2025-03").toBe(true)
  })

  it("estimates ids made in 2026", () => {
    expect(estimatedRegistration(8_700_000_000)?.at).toBe("2026-03-01T00:00:00.000Z")
  })

  it("gives no estimate past the table's last point", () => {
    expect(estimatedRegistration(8_960_000_000)).toBeNull()
    expect(estimatedRegistration(9_000_000_000)).toBeNull()
  })
})
