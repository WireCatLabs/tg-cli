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
      at: "2015-07-01T00:00:00.000Z",
      source: "estimate",
      precision: "month",
    })
  })

  it("gives no estimate past the table's last point", () => {
    expect(estimatedRegistration(8_100_000_000)).toBeNull()
  })
})
