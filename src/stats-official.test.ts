import type { OfficialChatStats } from "@wirecat/cli-messaging"
import { describe, expect, it, vi } from "vitest"
import { scripted, tg } from "./testing/scripted.js"

const stats: OfficialChatStats = {
  version: 1,
  kind: "group",
  chat: { id: "-1001234567890", title: "Valencia expats" },
  period: { since: "2026-09-29T00:00:00.000Z", until: "2026-10-06T00:00:00.000Z" },
  totals: {
    members: { current: 5000, previous: 4900 },
    messages: { current: 800, previous: 700 },
    viewers: { current: 1200, previous: 1100 },
    posters: { current: 90, previous: 80 },
  },
  top: { posters: [{ person: "777", name: "Ana", messages: 40, averageChars: 85 }], admins: [], inviters: [] },
  graphs: {
    growth: {
      kind: "line",
      x: { type: "date", values: ["2026-10-05"] },
      series: [{ key: "y0", name: "Total members", kind: "line", values: [5000] }],
    },
    languages: { error: "Not enough data to display" },
  },
}

describe("tg stats chats official", () => {
  it("prints Telegram's statistics as one JSON object and names a missing graph on stderr", async () => {
    const officialChatStats = vi.fn(async () => stats)
    const result = await tg(["stats", "chats", "official", "@valencia_expats", "--json"], {
      adapter: () => scripted({ officialChatStats }),
    })

    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout.join("\n"))).toEqual(stats)
    expect(result.stderr.join("\n")).toContain("languages")
    expect(officialChatStats).toHaveBeenCalledWith("@valencia_expats")
  })

  it("refuses --jsonl without asking Telegram", async () => {
    const officialChatStats = vi.fn(async () => stats)
    const result = await tg(["stats", "chats", "official", "@valencia_expats", "--jsonl"], {
      adapter: () => scripted({ officialChatStats }),
    })

    expect(result.code).toBe(2)
    expect(officialChatStats).not.toHaveBeenCalled()
  })
})
