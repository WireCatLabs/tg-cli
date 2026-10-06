import { mkdtempSync } from "node:fs"
import { join } from "node:path"
import { tl } from "@mtcute/node"
import { describe, expect, it, vi } from "vitest"
import { TelegramAdapter } from "./adapter.js"

type Request = { _: string; token?: string }

const stand = vi.hoisted(() => ({ client: undefined as unknown as StatsClient }))

const chartJson = (label: string) =>
  JSON.stringify({
    columns: [
      ["x", 1_790_380_800_000, 1_790_467_200_000],
      ["y0", 10, 12],
    ],
    types: { x: "x", y0: "line" },
    names: { y0: label },
    colors: { y0: "#3497ED" },
  })

const inline = (label: string) => ({ _: "statsGraph", json: { _: "dataJSON", data: chartJson(label) } })
const later = (token: string) => ({ _: "statsGraphAsync", token })
const value = (current: number, previous: number) => ({ _: "statsAbsValueAndPrev", current, previous })
const period = { _: "statsDateRangeDays", minDate: 1_790_380_800, maxDate: 1_790_467_200 }

const megagroupStats = () => ({
  _: "stats.megagroupStats",
  period,
  members: value(5000, 4900),
  messages: value(800, 700),
  viewers: value(1200, 1100),
  posters: value(90, 80),
  growthGraph: inline("Total members"),
  membersGraph: later("members"),
  newMembersBySourceGraph: later("sources"),
  languagesGraph: { _: "statsGraphError", error: "Not enough data to display" },
  messagesGraph: later("messages"),
  actionsGraph: later("actions"),
  topHoursGraph: later("hours"),
  weekdaysGraph: later("weekdays"),
  topPosters: [{ _: "statsGroupTopPoster", userId: 777, messages: 40, avgChars: 85 }],
  topAdmins: [{ _: "statsGroupTopAdmin", userId: 1, deleted: 3, kicked: 2, banned: 1 }],
  topInviters: [{ _: "statsGroupTopInviter", userId: 888, invitations: 6 }],
  users: [
    { _: "user", id: 777, firstName: "Ana", lastName: "Synthetic" },
    { _: "user", id: 1, firstName: "Owner" },
  ],
})

const broadcastStats = () => ({
  _: "stats.broadcastStats",
  period,
  followers: value(1300, 1250),
  viewsPerPost: value(400, 380),
  sharesPerPost: value(4, 3),
  reactionsPerPost: value(12, 10),
  viewsPerStory: value(0, 0),
  sharesPerStory: value(0, 0),
  reactionsPerStory: value(0, 0),
  enabledNotifications: { _: "statsPercentValue", part: 300, total: 1300 },
  ...Object.fromEntries(
    [
      "growthGraph",
      "followersGraph",
      "muteGraph",
      "topHoursGraph",
      "interactionsGraph",
      "ivInteractionsGraph",
      "viewsBySourceGraph",
      "newFollowersBySourceGraph",
      "languagesGraph",
      "reactionsByEmotionGraph",
      "storyInteractionsGraph",
      "storyReactionsByEmotionGraph",
    ].map((key) => [key, later(key)]),
  ),
  recentPostsInteractions: [
    { _: "postInteractionCountersMessage", msgId: 91, views: 410, forwards: 4, reactions: 11 },
    { _: "postInteractionCountersStory", storyId: 3, views: 20, forwards: 0, reactions: 1 },
  ],
})

class StatsClient {
  readonly calls: { method: string; args: unknown[] }[] = []
  readonly log = { mgr: { handler: undefined as unknown } }
  readonly storage = { self: { getCached: () => ({ userId: 1 }) } }
  full: Record<string, unknown> = full()
  answers: Record<string, unknown> = {}
  failing = new Map<string, Error>()
  prepare = async () => {}
  destroy = async () => this.calls.push({ method: "destroy", args: [] })
  getFullChat = async (reference: unknown) => {
    this.calls.push({ method: "getFullChat", args: [reference] })
    return this.full
  }
  resolveChannel = async (_: unknown) => ({ _: "inputChannel", channelId: 500, accessHash: 42 })
  call = async (request: Request, options?: unknown) => {
    this.calls.push({ method: request._, args: [request, options] })
    const failure = this.failing.get(request.token ?? request._)
    if (failure) throw failure
    if (request._ === "stats.loadAsyncGraph") return inline(`loaded ${request.token}`)
    return this.answers[request._]
  }
}

vi.mock("@mtcute/node", async (importOriginal) => {
  const real = await importOriginal<typeof import("@mtcute/node")>()
  return {
    ...real,
    TelegramClient: function TelegramClient() {
      stand.client = new StatsClient()
      return stand.client
    },
  }
})
vi.mock("./storage.js", () => ({ openSessionStorage: async () => ({}) }))

function full(fields: Record<string, unknown> = {}) {
  return {
    id: -1000000000500,
    displayName: "Synthetic group",
    chatType: "supergroup",
    canViewStats: true,
    migratedToId: null,
    full: { _: "channelFull", statsDc: 4 },
    ...fields,
  }
}

const open = async () => {
  const adapter = await TelegramAdapter.open({
    credentials: { id: 1, hash: "h" },
    sessionPath: join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "stats-")), "default.session"),
  })
  const client = stand.client
  client.answers = { "stats.getMegagroupStats": megagroupStats(), "stats.getBroadcastStats": broadcastStats() }
  return { adapter, client }
}

const requests = (client: StatsClient) => client.calls.filter((call) => call.method.startsWith("stats."))

describe("official statistics", () => {
  it("asks the statistics server for a supergroup's numbers and loads each later graph once, in order", async () => {
    const { adapter, client } = await open()

    const stats = await adapter.officialChatStats("-1000000000500")

    expect(stats).toMatchObject({
      version: 1,
      kind: "group",
      chat: { id: "-1000000000500", title: "Synthetic group" },
      period: { since: "2026-09-26T00:00:00.000Z", until: "2026-09-27T00:00:00.000Z" },
      totals: { members: { current: 5000, previous: 4900 }, posters: { current: 90, previous: 80 } },
      top: {
        posters: [{ person: "777", name: "Ana Synthetic", messages: 40, averageChars: 85 }],
        admins: [{ person: "1", name: "Owner", deleted: 3, removed: 2, banned: 1 }],
        inviters: [{ person: "888", name: null, invited: 6 }],
      },
      graphs: {
        growth: {
          kind: "line",
          x: { type: "date", values: ["2026-09-26", "2026-09-27"] },
          series: [{ key: "y0", name: "Total members", kind: "line", values: [10, 12] }],
        },
        languages: { error: "Not enough data to display" },
        weekdays: { series: [{ name: "loaded weekdays" }] },
      },
    })
    const sent = requests(client)
    expect(sent.map((call) => call.method)).toEqual([
      "stats.getMegagroupStats",
      ...Array(6).fill("stats.loadAsyncGraph"),
    ])
    expect(sent.map((call) => (call.args[0] as Request).token).slice(1)).toEqual([
      "members",
      "sources",
      "messages",
      "actions",
      "hours",
      "weekdays",
    ])
    for (const call of sent) expect(call.args[1]).toEqual({ dcId: 4 })
    expect(sent[0]?.args[0]).not.toHaveProperty("dark")
    expect(JSON.stringify(stats)).not.toContain("#3497ED")
  })

  it("reads a channel with its twelve graphs and recent posts", async () => {
    const { adapter, client } = await open()
    client.full = full({ chatType: "channel", displayName: "Synthetic channel" })

    const stats = await adapter.officialChatStats("@synthetic_channel")

    expect(stats).toMatchObject({
      kind: "channel",
      totals: { followers: { current: 1300, previous: 1250 } },
      notifications: { enabled: 300, total: 1300 },
      recentPosts: [
        { kind: "message", id: "91", views: 410, forwards: 4, reactions: 11 },
        { kind: "story", id: "3", views: 20 },
      ],
    })
    expect(Object.keys(stats.graphs)).toHaveLength(12)
    expect(requests(client).map((call) => call.method)).toEqual([
      "stats.getBroadcastStats",
      ...Array(12).fill("stats.loadAsyncGraph"),
    ])
  })

  it("keeps the other graphs when one has expired", async () => {
    const { adapter, client } = await open()
    client.failing.set("hours", new tl.RpcError(400, "GRAPH_EXPIRED_RELOAD"))

    const stats = await adapter.officialChatStats("-1000000000500")

    expect(stats.graphs.hours).toEqual({ error: "GRAPH_EXPIRED_RELOAD" })
    expect(stats.graphs.weekdays).toHaveProperty("series")
  })

  it("follows a migrated group and sends no dcId when Telegram names no statistics server", async () => {
    const { adapter, client } = await open()
    const migrated = full({ full: { _: "channelFull" } })
    client.getFullChat = async (reference) => {
      client.calls.push({ method: "getFullChat", args: [reference] })
      return reference === -500 ? full({ chatType: "group", migratedToId: -1000000000500 }) : migrated
    }

    await adapter.officialChatStats("-500")

    expect(client.calls.filter((call) => call.method === "getFullChat").map((call) => call.args[0])).toEqual([
      -500, -1000000000500,
    ])
    expect(requests(client)[0]?.args[1]).toBeUndefined()
  })

  it.each([
    [{ chatType: "group", full: { _: "chatFull" } }, "validation_error", /basic group/],
    [{ chatType: "monoforum" }, "validation_error", /supergroups and channels/],
    [{ canViewStats: false }, "permission_error", /only to admins of large enough/],
  ])("refuses %o before asking for statistics", async (fields, code, message) => {
    const { adapter, client } = await open()
    client.full = full(fields)

    await expect(adapter.officialChatStats("-1000000000500")).rejects.toMatchObject({ code, message })
    expect(requests(client)).toEqual([])
  })

  it("names a missing admin right as a permission error", async () => {
    const { adapter, client } = await open()
    client.failing.set("stats.getMegagroupStats", new tl.RpcError(400, "CHAT_ADMIN_REQUIRED"))

    await expect(adapter.officialChatStats("-1000000000500")).rejects.toMatchObject({ code: "permission_error" })
  })

  it("does not send the owner to log in again when only the statistics server refuses the login", async () => {
    const { adapter, client } = await open()
    client.failing.set("stats.getMegagroupStats", new tl.RpcError(401, "AUTH_KEY_UNREGISTERED"))

    await expect(adapter.officialChatStats("-1000000000500")).rejects.toMatchObject({
      code: "provider_error",
      details: { providerError: "AUTH_KEY_UNREGISTERED" },
    })
  })

  it("closes every connection, the statistics server's too, when the command ends", async () => {
    const { adapter, client } = await open()
    await adapter.officialChatStats("-1000000000500")

    await adapter.close()

    expect(client.calls.at(-1)?.method).toBe("destroy")
  })
})
