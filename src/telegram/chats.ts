import type { InputPeerLike, TelegramClient } from "@mtcute/node"
import { type Chat, type ChatCard, type Page, pickChat } from "@wirecat/cli-core"
import type { Feature } from "./feature.js"
import { groupCount, membersOf } from "./groups.js"
import { peerToChat, toChat, toMember } from "./map.js"

const SAVED = new Set(["me", "self", "saved"])

interface DialogWalk {
  dialogs: ReturnType<TelegramClient["iterDialogs"]>
  seen: Set<string>
  /** Read past the last page, to tell whether there is more; the next page starts with them. */
  held: Chat[]
  at: number
  until: number
}

/** Where the last page of `chats` stopped; any other offset, a failure or a minute's gap starts a new walk. */
export interface Walking {
  walk?: DialogWalk | undefined
}

/** Pages of one listing come about a second apart; a page asked for later than this reads fresh dialogs. */
const DIALOG_WALK_KEPT_MS = 60_000

/**
 * Each chat once, up to `wanted`. With archived chats kept, Telegram's dialog pages bring the
 * pinned chats again further down: 8 of 1361 were listed twice on 2026-10-01, and a pinned chat's
 * title then matched itself as two chats.
 */
const pull = async (walk: DialogWalk, wanted: number): Promise<Chat[]> => {
  const chats = walk.held
  while (chats.length < wanted) {
    const next = await walk.dialogs.next()
    if (next.done) break
    const chat = toChat(next.value)
    if (walk.seen.has(chat.id)) continue
    walk.seen.add(chat.id)
    chats.push(chat)
  }
  return chats
}

const dialogs = async (client: TelegramClient, wanted: number): Promise<Chat[]> => {
  const seen = new Set<string>()
  const chats: Chat[] = []
  for await (const dialog of client.iterDialogs({ archived: "keep" })) {
    const chat = toChat(dialog)
    if (seen.has(chat.id)) continue
    seen.add(chat.id)
    chats.push(chat)
    if (chats.length >= wanted) break
  }
  return chats
}

/** A name is matched against the dialogs and answered as the chat it found; anything else goes to Telegram as it is. */
const peerOf = async (client: TelegramClient, reference: string): Promise<InputPeerLike | Chat> => {
  const trimmed = reference.trim()
  if (SAVED.has(trimmed.toLowerCase())) return "me"
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed)
  if (trimmed.startsWith("@")) return trimmed.slice(1)

  return pickChat(trimmed, await dialogs(client, Number.POSITIVE_INFINITY))
}

export const inputOf = async (client: TelegramClient, reference: string): Promise<InputPeerLike> => {
  const peer = await peerOf(client, reference)
  return typeof peer === "object" && "kind" in peer ? Number(peer.id) : peer
}

/**
 * Telegram lists dialogs by position; `limit` unset is every one. The next page goes on with the walk the
 * last one left off, so paging through N chats asks Telegram for each dialog once, not once per page.
 */
export const chats = (
  { call, client }: Feature,
  walking: Walking,
  { limit, offset }: { limit?: number; offset: number },
): Promise<Page<Chat>> =>
  call(async () => {
    if (limit === undefined) {
      const items = await dialogs(client, Number.POSITIVE_INFINITY)
      return { items: items.slice(offset), hasMore: false }
    }
    const resumed = walking.walk
    walking.walk = undefined
    const walk: DialogWalk =
      resumed && offset > 0 && resumed.at === offset && Date.now() < resumed.until
        ? resumed
        : {
            dialogs: client.iterDialogs({ archived: "keep" }),
            seen: new Set<string>(),
            held: [],
            at: 0,
            until: 0,
          }
    const pulled = await pull(walk, offset - walk.at + limit + 1)
    const items = pulled.slice(offset - walk.at, offset - walk.at + limit)
    walk.held = pulled.slice(offset - walk.at + limit)
    walk.at = offset + items.length
    walk.until = Date.now() + DIALOG_WALK_KEPT_MS
    walking.walk = walk
    return { items, hasMore: walk.held.length > 0 }
  })

/** The chat as its dialog describes it, and for a group, who is in it — at most 200, Telegram's cap. */
export const chat = (feature: Feature, reference: string): Promise<ChatCard> =>
  feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const [dialog] = await feature.client.getPeerDialogs(peer)
    const found = dialog ? dialog.peer : await feature.client.getPeer(peer)
    const chat = dialog ? toChat(dialog) : peerToChat(found)
    if (chat.kind !== "group") return { ...chat, members: null }
    const members = await membersOf(feature, peer)
    return {
      ...chat,
      participantsCount: await groupCount(feature, found, members?.total ?? null),
      members: members?.map((member) => toMember(member.user)) ?? null,
    }
  })

/** The chat a reference names — by title, id, `@username` or `me` — so a write can be checked before it goes. */
export const resolve = ({ call, client }: Feature, reference: string): Promise<Chat> =>
  call(async () => {
    const peer = await peerOf(client, reference)
    return typeof peer === "object" && "kind" in peer ? peer : peerToChat(await client.getPeer(peer))
  })
