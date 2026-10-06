import { describe, expect, it } from "vitest"
import { toOfficialGraph } from "./stats.js"

const graph = (x: number[], extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    columns: [
      ["x", ...x],
      ["y0", ...x.map(() => 1)],
      ["y1", ...x.map(() => 2)],
    ],
    types: { x: "x", y0: "bar", y1: "bar" },
    names: { y0: "Joined", y1: "Left" },
    ...extra,
  })

describe("Telegram's graph JSON", () => {
  it("reads moments within a day as ISO times, and keeps stacking and percentages", () => {
    expect(toOfficialGraph(graph([1_790_384_400_000], { stacked: true, percentage: true }))).toEqual({
      kind: "bar",
      x: { type: "time", values: ["2026-09-26T01:00:00.000Z"] },
      series: [
        { key: "y0", name: "Joined", kind: "bar", values: [1] },
        { key: "y1", name: "Left", kind: "bar", values: [2] },
      ],
      stacked: true,
      percentage: true,
    })
  })

  it("keeps small x values as numbers, for hours and weekdays", () => {
    expect(toOfficialGraph(graph([0, 1, 23])).x).toEqual({ type: "number", values: [0, 1, 23] })
  })

  it("answers an error for JSON it cannot read, never the text Telegram sent", () => {
    expect(toOfficialGraph("{not json")).toEqual({ error: "Telegram sent a graph tg cannot read" })
    expect(toOfficialGraph(JSON.stringify({ columns: "x" }))).toHaveProperty("error")
  })
})
