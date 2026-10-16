import {
  ChatInviteLink,
  type InputPeerLike,
  MtPeerNotFoundError,
  type Peer,
  PeersIndex,
  type TelegramClient,
  type Message as TgMessage,
  type tl,
} from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type {
  AdminRight,
  ChatEvents,
  GroupCard,
  GroupChange,
  GroupMember,
  InviteLinkChange,
  LinkTarget,
  Page,
} from "@wirecat/cli-core"
import { toCliError } from "./errors.js"
import { type Feature, publicName } from "./feature.js"
import { answerJoinRequestOf, joinRequestsOf } from "./join-requests.js"
import {
  ADMIN_RIGHT_FIELDS,
  type EventOf,
  eventOf,
  GROUP_SETTINGS,
  groupMembersCount,
  toGroupCard,
  toGroupMember,
  toInviteLink,
  toInvitePreview,
  toLinkChat,
} from "./map.js"

export { GROUP_SETTINGS }

/** The rights `chats admins add --can` offers: max's, less `read`. */
export const ADMIN_RIGHTS = Object.keys(ADMIN_RIGHT_FIELDS) as AdminRight[]

/** Telegram's own cap on a group's member list. */
const MEMBERS_MAX = 10_000
/** Up to 50 pages of a big group back to back is the kind of burst Telegram answers with FLOOD_WAIT. */
const MEMBER_PAGE_PAUSE_MS = 1000
/** Pages of 100 that `chats events` reads at most; the rest is `more`. */
const EVENT_PAGES = 10

const isInvite = (link: string) => /(t\.me|telegram\.me)\/(\+|joinchat\/)|^tg:\/\/join/.test(link)

/**
 * A supergroup's own count is its member list's total: its chat object and its full info both said 1 for a
 * group of 2, seen live. A list hidden from non-admins answers only part of the group, so then the full info's
 * count stands, which the shorter list never reaches. A basic group's list total is only the page it read.
 */
export const groupCount = async ({ client }: Feature, group: Peer, listTotal: number | null) => {
  if (group.type !== "chat" || group.raw?._ !== "channel") return groupMembersCount(group)
  const full = await client.getFullChat(group.id)
  const hidden = full.full._ === "channelFull" && full.full.participantsHidden === true && !full.isAdmin
  return hidden || listTotal === null ? groupMembersCount(full) : listTotal || null
}

/** `null` when the group hides its member list from us: that is an answer about the group, not a failure. */
export const membersOf = async ({ client, login }: Feature, peer: InputPeerLike) => {
  try {
    return await client.getChatMembers(peer, { limit: 200 })
  } catch (error) {
    const known = toCliError(error, login)
    if (known instanceof CliError && known.code === "permission_error") return null
    throw known
  }
}

/** An invite is previewed; one the owner already joined, or a public link, is read as the chat. Nothing joins. */
export const inspect = (feature: Feature, link: string): Promise<LinkTarget> => {
  const typed = link.trim()
  const invite = isInvite(typed)
  return feature.call(async () => {
    if (invite) {
      try {
        return toInvitePreview(await feature.client.getChatPreview(typed))
      } catch (error) {
        if (!(error instanceof MtPeerNotFoundError)) throw error
      }
    }
    return toLinkChat(await feature.client.getFullChat(invite ? typed : publicName(typed)))
  })
}

/**
 * A page of a group's members, 200 a request, a second apart. Telegram gives at most `MEMBERS_MAX` of a big
 * group, and a group that hides its list answers only its admins or refuses.
 */
export const members = (
  feature: Feature,
  reference: string,
  { limit, offset }: { limit?: number; offset: number },
): Promise<Page<GroupMember> & { chatId: string; participantsCount: number | null }> =>
  feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const group = await feature.client.getPeer(peer)
    const wanted = Math.min(limit ?? MEMBERS_MAX, MEMBERS_MAX - offset)
    const found: GroupMember[] = []
    let total: number | null = null
    while (found.length < wanted) {
      if (found.length > 0) await new Promise((resolve) => setTimeout(resolve, MEMBER_PAGE_PAUSE_MS))
      const size = Math.min(200, wanted - found.length)
      const page = await feature.client.getChatMembers(peer, { offset: offset + found.length, limit: size })
      total = page.total
      found.push(...page.map(toGroupMember))
      if (page.length < size) break
    }
    return {
      chatId: String(group.id),
      items: found,
      hasMore: offset + found.length < Math.min(total ?? 0, MEMBERS_MAX),
      participantsCount: offset === 0 ? await groupCount(feature, group, total) : null,
    }
  })

/**
 * Service messages back to `since`, newest page first, at most `EVENT_PAGES` of them — a busy
 * group's week can be thousands. The people a message names only by id are looked up in one call.
 */
export const chatEvents = (feature: Feature, reference: string, { since }: { since: number }): Promise<ChatEvents> =>
  feature.call(async () => {
    const { client } = feature
    const peer = await feature.inputOf(reference)
    const found: { message: TgMessage; change: EventOf }[] = []
    let offset: { id: number; date: number } | undefined
    let more = false
    for (let read = 1; ; read++) {
      const page = await client.getHistory(peer, { limit: 100, ...(offset ? { offset } : {}) })
      for (const message of page) {
        const change = message.date.getTime() > since ? eventOf(message) : null
        if (change) found.push({ message, change })
      }
      const oldest = page.at(-1)
      if (!page.next || !oldest || oldest.date.getTime() <= since) break
      if (read >= EVENT_PAGES) {
        more = true
        break
      }
      offset = page.next
    }

    const names = new Map(found.map(({ message }) => [message.sender.id, message.sender.displayName || null]))
    const unknown = [...new Set(found.flatMap(({ change }) => [change.by, ...change.people]))].filter(
      (id) => !names.has(id),
    )
    if (unknown.length > 0) {
      for (const user of await client.getUsers(unknown)) if (user) names.set(user.id, user.displayName || null)
    }
    const person = (id: number) => ({ id: String(id), name: names.get(id) ?? null })

    return {
      chatId: String((await client.getPeer(peer)).id),
      since: new Date(since).toISOString(),
      more,
      events: found.reverse().map(({ message, change }) => ({
        messageId: String(message.id),
        timestamp: message.date.toISOString(),
        event: change.event,
        by: person(change.by),
        people: change.people.map(person),
        ...(change.title === undefined ? {} : { title: change.title }),
      })),
    }
  })

/**
 * A group's admins and its creator, for `review --unanswered`; `null` when the group hides them.
 * A basic group ignores the `admins` filter and answers everyone, hence the status check.
 */
export const admins = (feature: Feature, reference: string): Promise<string[] | null> =>
  feature.call(async () => {
    const peer = await feature.inputOf(reference)
    try {
      const found = await feature.client.getChatMembers(peer, { type: "admins", limit: 200 })
      return found
        .filter((member) => member.status === "creator" || member.status === "admin")
        .map((member) => String(member.user.id))
    } catch (error) {
      const known = toCliError(error, feature.login)
      if (known instanceof CliError && known.code === "permission_error") return null
      throw known
    }
  })

/** Each reference as a user id, in order; a group or a channel is not a person and is refused. */
export const people = (feature: Feature, references: string[]): Promise<string[]> =>
  feature.call(async () => {
    const ids: string[] = []
    for (const reference of references) {
      const peer = await feature.client.getPeer(await feature.inputOf(reference))
      if (peer.type !== "user") throw new CliError("validation_error", `${reference} is a chat, not a person`)
      ids.push(String(peer.id))
    }
    return ids
  })

/**
 * Always a supergroup, never a legacy group: a legacy group turns into a supergroup on some changes
 * and its id changes with it. The people are added after, so a group exists even if some cannot be.
 */
export const createGroup = (
  feature: Feature,
  title: string,
  invited: string[],
  { channel }: { channel: boolean },
): Promise<GroupCard> =>
  feature.call(async () => {
    const { client } = feature
    try {
      const made = channel ? await client.createChannel({ title }) : await client.createSupergroup({ title })
      const missing = invited.length > 0 ? await client.addChatMembers(made.id, invited.map(Number), {}) : []
      const card = toGroupCard(await client.getFullChat(made.id))
      if (missing.length === 0) return card
      const notAdded = missing.map((one) => String(one.userId))
      return { ...card, providerMetadata: { ...card.providerMetadata, notAdded } }
    } catch (error) {
      throw feature.unanswered(error, { what: "the group may or may not have been made", check: "chats.list" })
    }
  })

/** An invite link, or a public one; a group that asks its admins first answers `requested`. */
export const join = (feature: Feature, link: string): Promise<GroupCard | { requested: true }> => {
  const typed = link.trim()
  const invite = isInvite(typed)
  return feature.call(async () => {
    let joined: Awaited<ReturnType<TelegramClient["joinChat"]>>
    try {
      joined = await feature.client.joinChat(invite ? typed : publicName(typed))
    } catch (error) {
      throw feature.unanswered(error, { what: "you may or may not have joined", check: "chats.list" })
    }
    if (joined.status === "request_sent") return { requested: true as const }
    if (joined.status !== "ok") {
      throw new CliError(
        "provider_error",
        "this group asks a bot to check who joins, which only the Telegram app can show",
      )
    }
    return toGroupCard(await feature.client.getFullChat(joined.chat.id))
  })
}

export const leave = (feature: Feature, reference: string): Promise<{ chatId: string }> =>
  feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const chatId = String((await feature.client.getPeer(peer)).id)
    try {
      await feature.client.leaveChat(peer)
    } catch (error) {
      throw feature.unanswered(error, { what: "you may or may not have left", check: "chats.list" })
    }
    return { chatId }
  })

export const group = (feature: Feature, reference: string): Promise<GroupCard> =>
  feature.call(async () => toGroupCard(await feature.client.getFullChat(await feature.inputOf(reference))))

/**
 * Telegram keeps what members may do as rights taken away, and sets them all at once: the current
 * ones are read first, and only the switches asked for change.
 */
export const updateGroup = (
  feature: Feature,
  chatId: string,
  { title, description, settings = {} }: GroupChange,
): Promise<GroupCard> => {
  const missing = Object.keys(settings).filter((key) => !(GROUP_SETTINGS as readonly string[]).includes(key))
  if (missing.length > 0) {
    throw new CliError("validation_error", `Telegram has no group setting ${missing.join(", ")}`)
  }
  const peer = Number(chatId)
  return feature.call(async () => {
    const { client } = feature
    try {
      if (title !== undefined) await client.setChatTitle(peer, title)
      if (description !== undefined) await client.setChatDescription(peer, description)
      const { allCanPin, onlyAdminsAdd, joinApproval } = settings
      if (typeof joinApproval === "boolean") await client.toggleJoinRequests(peer, joinApproval)
      if (typeof allCanPin === "boolean" || typeof onlyAdminsAdd === "boolean") {
        const current = (await client.getFullChat(peer)).defaultPermissions?.raw
        const { _: _kind, untilDate: _until, ...taken } = current ?? { _: "chatBannedRights", untilDate: 0 }
        await client.setChatDefaultPermissions(peer, {
          ...taken,
          ...(typeof allCanPin === "boolean" ? { pinMessages: !allCanPin } : {}),
          ...(typeof onlyAdminsAdd === "boolean" ? { inviteUsers: onlyAdminsAdd } : {}),
        })
      }
    } catch (error) {
      throw feature.unanswered(error, { what: "the group may have changed in part", check: "chats.show" })
    }
    return toGroupCard(await client.getFullChat(peer))
  })
}

/** A new primary link for the owner; the old one stops working. */
export const resetInviteLink = (feature: Feature, chatId: string): Promise<GroupCard> => {
  const peer = Number(chatId)
  return feature.call(async () => {
    try {
      await feature.client.exportInviteLink(peer)
    } catch (error) {
      throw feature.unanswered(error, { what: "the link may or may not have been replaced", check: "chats.link.show" })
    }
    return toGroupCard(await feature.client.getFullChat(peer))
  })
}

export const createInviteLink = (
  feature: Feature,
  chatId: string,
  { approval, expiresAt, maxUses }: { approval: boolean; expiresAt?: string; maxUses?: number },
) =>
  feature.call(async () => {
    try {
      return toInviteLink(
        await feature.client.createInviteLink(Number(chatId), {
          withApproval: approval,
          ...(expiresAt === undefined ? {} : { expires: new Date(expiresAt) }),
          ...(maxUses === undefined ? {} : { usageLimit: maxUses }),
        }),
      )
    } catch (error) {
      throw feature.unanswered(error, "a link may or may not have been made; it works only once shared")
    }
  })

export const joinRequests = (
  feature: Feature,
  chatId: string,
  { limit, link, search }: { limit: number; link?: string; search?: string },
) =>
  feature.call(() =>
    joinRequestsOf(feature.client, Number(chatId), limit, {
      ...(link ? { link } : {}),
      ...(search ? { search } : {}),
    }),
  )

export const answerAllJoinRequests = (feature: Feature, chatId: string, accept: boolean, link?: string) =>
  feature.call(async () => {
    try {
      await feature.client.hideAllJoinRequests({
        chatId: Number(chatId),
        action: accept ? "approve" : "decline",
        ...(link ? { link } : {}),
      })
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the requests may or may not have been answered",
        check: "chats.requests.list",
      })
    }
  })

/** Telegram shows an admin only their own links; the creator could ask for others', which we do not. */
export const inviteLinks = (
  feature: Feature,
  chatId: string,
  { limit, revoked }: { limit: number; revoked: boolean },
) =>
  feature.call(async () => {
    const page = await feature.client.getInviteLinks(Number(chatId), { limit, revoked })
    return { items: page.map(toInviteLink), hasMore: page.total > page.length }
  })

export const revokeInviteLink = (feature: Feature, chatId: string, link: string) =>
  feature.call(async () => {
    try {
      return toInviteLink(await feature.client.revokeInviteLink(Number(chatId), link))
    } catch (error) {
      throw feature.unanswered(error, { what: "the link may or may not have been revoked", check: "chats.link.list" })
    }
  })

export const updateInviteLink = (
  feature: Feature,
  chatId: string,
  link: string,
  { approval, expiresAt, maxUses }: InviteLinkChange,
) =>
  feature.call(async () => {
    const peer = await feature.client.resolvePeer(Number(chatId))
    try {
      // Raw, because mtcute's editInviteLink drops an expiry of 0 — Telegram's "never expires".
      const answer = await feature.client.call({
        _: "messages.editExportedChatInvite",
        peer,
        link,
        ...(approval === undefined ? {} : { requestNeeded: approval }),
        ...(expiresAt === undefined ? {} : { expireDate: expiresAt === null ? 0 : Date.parse(expiresAt) / 1000 }),
        ...(maxUses === undefined ? {} : { usageLimit: maxUses }),
      })
      return toInviteLink(new ChatInviteLink(answer.invite, PeersIndex.from(answer)))
    } catch (error) {
      throw feature.unanswered(error, { what: "the link may or may not have been changed", check: "chats.link.list" })
    }
  })

export const answerJoinRequest = (feature: Feature, chatId: string, personId: string, accept: boolean) =>
  feature.call(async () => {
    try {
      return await answerJoinRequestOf(feature.client, Number(chatId), Number(personId), accept)
    } catch (error) {
      throw feature.unanswered(error, {
        what: `the request of ${personId} may or may not have been answered`,
        check: "chats.requests.list",
      })
    }
  })

/** A supergroup shows new members its history by its own setting, never per person: `history` is refused. */
export const addMembers = (
  feature: Feature,
  chatId: string,
  added: string[],
  { history }: { history?: boolean },
): Promise<{ notAdded: string[] }> => {
  if (history)
    throw new CliError(
      "validation_error",
      "Telegram shows new members the history by the group's setting, not per person",
    )
  return feature.call(async () => {
    try {
      const missing = await feature.client.addChatMembers(Number(chatId), added.map(Number), {})
      return { notAdded: missing.map((one) => String(one.userId)) }
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the people may or may not have been added",
        check: "chats.members.list",
      })
    }
  })
}

/** One request per person, in turn: Telegram rate-limits these hard. */
export const removeMembers = (feature: Feature, chatId: string, removed: string[]): Promise<void> =>
  feature.call(async () => {
    for (const person of removed) {
      try {
        await feature.client.kickChatMember({ chatId: Number(chatId), userId: Number(person) })
      } catch (error) {
        throw feature.unanswered(error, {
          what: `${person} may or may not have been removed`,
          check: "chats.members.list",
        })
      }
    }
  })

const editAdmin = (feature: Feature, chatId: string, person: string, rights: Omit<tl.RawChatAdminRights, "_">) =>
  feature.call(async () => {
    try {
      await feature.client.editAdminRights({ chatId: Number(chatId), userId: Number(person), rights })
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the rights may or may not have changed",
        check: "chats.members.list",
      })
    }
  })

export const addAdmin = (feature: Feature, chatId: string, person: string, rights: AdminRight[]): Promise<void> => {
  const missing = rights.filter((right) => !(right in ADMIN_RIGHT_FIELDS))
  if (missing.length > 0) throw new CliError("validation_error", `Telegram has no admin right ${missing.join(", ")}`)
  const fields = Object.fromEntries(
    rights.map((right) => [ADMIN_RIGHT_FIELDS[right as keyof typeof ADMIN_RIGHT_FIELDS], true]),
  )
  return editAdmin(feature, chatId, person, fields)
}

export const removeAdmin = (feature: Feature, chatId: string, person: string): Promise<void> =>
  editAdmin(feature, chatId, person, {})
