import { tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type {
  OfficialChannelStats,
  OfficialChatStats,
  OfficialGraph,
  OfficialGraphError,
  OfficialGroupStats,
  OfficialPerson,
  OfficialValue,
} from "@wirecat/cli-core"
import type { Feature } from "./feature.js"

export type GraphOf = (graph: tl.TypeStatsGraph) => Promise<OfficialGraph | OfficialGraphError>

const DAY_MS = 86_400_000
/** Unix milliseconds start in 1973; anything smaller is an hour, a weekday or a count. */
const MS_FROM = 1e11

/** What Telegram's chart JSON carries that this reads; colours and formatters are dropped. */
interface ChartJson {
  columns: [string, ...number[]][]
  types: Record<string, string>
  names?: Record<string, string>
  stacked?: boolean
  percentage?: boolean
}

const axisOf = (values: number[]): OfficialGraph["x"] => {
  if (values.length === 0 || values.some((value) => value < MS_FROM)) return { type: "number", values }
  const days = values.every((value) => value % DAY_MS === 0)
  return days
    ? { type: "date", values: values.map((value) => new Date(value).toISOString().slice(0, 10)) }
    : { type: "time", values: values.map((value) => new Date(value).toISOString()) }
}

/** `statsGraph.json.data` as series; the label at the head of each column is not a value. */
export const toOfficialGraph = (data: string): OfficialGraph | OfficialGraphError => {
  let chart: ChartJson
  try {
    chart = JSON.parse(data) as ChartJson
  } catch {
    return { error: "Telegram sent a graph tg cannot read" }
  }
  if (!Array.isArray(chart?.columns) || typeof chart.types !== "object")
    return { error: "Telegram sent a graph tg cannot read" }
  const x = chart.columns.find(([key]) => chart.types[key] === "x")
  const series = chart.columns
    .filter(([key]) => chart.types[key] !== "x")
    .map(([key, ...values]) => ({
      key,
      name: chart.names?.[key] ?? key,
      kind: chart.types[key] ?? "line",
      values,
    }))
  return {
    kind: series[0]?.kind ?? "line",
    x: axisOf(x ? x.slice(1).map(Number) : []),
    series,
    ...(chart.stacked ? { stacked: true } : {}),
    ...(chart.percentage ? { percentage: true } : {}),
  }
}

const value = ({ current, previous }: tl.TypeStatsAbsValueAndPrev): OfficialValue => ({ current, previous })

const period = ({ minDate, maxDate }: tl.TypeStatsDateRangeDays) => ({
  since: new Date(minDate * 1000).toISOString(),
  until: new Date(maxDate * 1000).toISOString(),
})

const graphs = async <K extends string>(
  keys: Record<K, tl.TypeStatsGraph>,
  graphOf: GraphOf,
): Promise<Record<K, OfficialGraph | OfficialGraphError>> => {
  const answered = {} as Record<K, OfficialGraph | OfficialGraphError>
  // One after another: each asynchronous graph is a request of its own to the statistics server.
  for (const [key, graph] of Object.entries(keys) as [K, tl.TypeStatsGraph][]) answered[key] = await graphOf(graph)
  return answered
}

const nameOf = (user: tl.TypeUser | undefined): string | null => {
  if (user?._ !== "user") return null
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ")
  return full || user.username || null
}

type Chat = { id: string; title: string }

export const toOfficialGroupStats = async (
  chat: Chat,
  stats: tl.stats.RawMegagroupStats,
  graphOf: GraphOf,
): Promise<OfficialGroupStats> => {
  const users = new Map(stats.users.map((user) => [user.id, user]))
  const person = (userId: number): OfficialPerson => ({ person: String(userId), name: nameOf(users.get(userId)) })
  return {
    version: 1,
    kind: "group",
    chat,
    period: period(stats.period),
    totals: {
      members: value(stats.members),
      messages: value(stats.messages),
      viewers: value(stats.viewers),
      posters: value(stats.posters),
    },
    top: {
      posters: stats.topPosters.map((one) => ({
        ...person(one.userId),
        messages: one.messages,
        averageChars: one.avgChars,
      })),
      admins: stats.topAdmins.map((one) => ({
        ...person(one.userId),
        deleted: one.deleted,
        removed: one.kicked,
        banned: one.banned,
      })),
      inviters: stats.topInviters.map((one) => ({ ...person(one.userId), invited: one.invitations })),
    },
    graphs: await graphs(
      {
        growth: stats.growthGraph,
        members: stats.membersGraph,
        newMembersBySource: stats.newMembersBySourceGraph,
        languages: stats.languagesGraph,
        messages: stats.messagesGraph,
        actions: stats.actionsGraph,
        hours: stats.topHoursGraph,
        weekdays: stats.weekdaysGraph,
      },
      graphOf,
    ),
  }
}

export const toOfficialChannelStats = async (
  chat: Chat,
  stats: tl.stats.RawBroadcastStats,
  graphOf: GraphOf,
): Promise<OfficialChannelStats> => ({
  version: 1,
  kind: "channel",
  chat,
  period: period(stats.period),
  totals: {
    followers: value(stats.followers),
    viewsPerPost: value(stats.viewsPerPost),
    sharesPerPost: value(stats.sharesPerPost),
    reactionsPerPost: value(stats.reactionsPerPost),
    viewsPerStory: value(stats.viewsPerStory),
    sharesPerStory: value(stats.sharesPerStory),
    reactionsPerStory: value(stats.reactionsPerStory),
  },
  notifications: { enabled: stats.enabledNotifications.part, total: stats.enabledNotifications.total },
  recentPosts: stats.recentPostsInteractions.map((post) => ({
    kind: post._ === "postInteractionCountersMessage" ? ("message" as const) : ("story" as const),
    id: String(post._ === "postInteractionCountersMessage" ? post.msgId : post.storyId),
    views: post.views,
    forwards: post.forwards,
    reactions: post.reactions,
  })),
  graphs: await graphs(
    {
      growth: stats.growthGraph,
      followers: stats.followersGraph,
      muted: stats.muteGraph,
      hours: stats.topHoursGraph,
      interactions: stats.interactionsGraph,
      instantView: stats.ivInteractionsGraph,
      viewsBySource: stats.viewsBySourceGraph,
      newFollowersBySource: stats.newFollowersBySourceGraph,
      languages: stats.languagesGraph,
      reactionsByEmotion: stats.reactionsByEmotionGraph,
      storyInteractions: stats.storyInteractionsGraph,
      storyReactionsByEmotion: stats.storyReactionsByEmotionGraph,
    },
    graphOf,
  ),
})

/**
 * Telegram computes these only on the chat's statistics server (`stats_dc`); mtcute opens that
 * connection and carries the login over itself, and `close` ends it with the others.
 */
export const officialChatStats = (feature: Feature, reference: string): Promise<OfficialChatStats> => {
  return feature.call(async () => {
    let full = await feature.client.getFullChat(await feature.inputOf(reference))
    if (full.migratedToId != null) full = await feature.client.getFullChat(full.migratedToId)
    const broadcast = full.chatType === "channel"
    if (!broadcast && full.chatType !== "supergroup" && full.chatType !== "gigagroup") {
      throw new CliError(
        "validation_error",
        full.chatType === "group"
          ? "Telegram keeps statistics only for supergroups and channels, not for a basic group"
          : "Telegram keeps statistics only for supergroups and channels",
      )
    }
    if (!full.canViewStats) {
      throw new CliError(
        "permission_error",
        "Telegram shows statistics only to admins of large enough groups and channels, and not for this one",
      )
    }
    const statsDc = full.full._ === "channelFull" ? full.full.statsDc : undefined
    const options = statsDc === undefined ? undefined : { dcId: statsDc }
    const channel = await feature.client.resolveChannel(full.id)
    const chat = { id: String(full.id), title: full.displayName }
    const graphOf: GraphOf = async (graph) => {
      if (graph._ === "statsGraph") return toOfficialGraph(graph.json.data)
      if (graph._ === "statsGraphError") return { error: graph.error }
      try {
        const loaded = await feature.client.call({ _: "stats.loadAsyncGraph", token: graph.token }, options)
        if (loaded._ === "statsGraph") return toOfficialGraph(loaded.json.data)
        return { error: loaded._ === "statsGraphError" ? loaded.error : "Telegram did not finish this graph" }
      } catch (error) {
        if (tl.RpcError.is(error)) return { error: error.text }
        throw error
      }
    }
    try {
      return broadcast
        ? await toOfficialChannelStats(
            chat,
            await feature.client.call({ _: "stats.getBroadcastStats", channel }, options),
            graphOf,
          )
        : await toOfficialGroupStats(
            chat,
            await feature.client.call({ _: "stats.getMegagroupStats", channel }, options),
            graphOf,
          )
    } catch (error) {
      // Reached the main server a moment ago, so the login stands; only the statistics server refused it.
      if (tl.RpcError.is(error, "AUTH_KEY_UNREGISTERED"))
        throw new CliError(
          "provider_error",
          "Telegram's statistics server did not accept this login (AUTH_KEY_UNREGISTERED); the login itself works — try again later",
          { provider_error: error.text, status: error.code },
        )
      throw error
    }
  })
}
