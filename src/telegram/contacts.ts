import type { User } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Member, PersonCard, PhoneBookEntry, ProfileFacts } from "@wirecat/cli-core"
import type { Feature } from "./feature.js"
import { toChat, toMember } from "./map.js"
import { toProfileFacts } from "./profile.js"

const personOf = async ({ client, inputOf }: Feature, reference: string) => {
  const peer = await inputOf(reference)
  const user = await client.getPeer(peer)
  if (user.type !== "user") throw new CliError("validation_error", `"${reference}" is a chat, not a person`)
  const [full, [dialog], common] = await Promise.all([
    client.getFullUser(peer),
    client.getPeerDialogs(peer),
    client.getCommonChats(peer),
  ])
  const dialogs = common.length > 0 ? await client.getPeerDialogs(common.map((chat) => chat.id)) : []
  // Telegram's common chats are groups only; the one-to-one chat is shared with them too.
  const chats = [dialog ?? null, ...dialogs]
    .filter((one) => one !== null)
    .map(toChat)
    .map(({ id, title, kind, lastMessageAt }) => ({ id, title, kind, lastMessageAt }))
    .sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""))
  return { user, full, dialog, chats }
}

/** How many profile photos they show and the oldest one's date: the newest first, so the last page holds it. */
export const photos = (feature: Feature, person: string): Promise<{ count: number; oldestAt: string | null }> =>
  feature.call(async () => {
    const peer = await feature.inputOf(person)
    const newest = await feature.client.getProfilePhotos(peer, { limit: 1 })
    if (newest.total <= 1) return { count: newest.total, oldestAt: newest[0]?.date.toISOString() ?? null }
    const [oldest] = await feature.client.getProfilePhotos(peer, { offset: newest.total - 1, limit: 1 })
    return { count: newest.total, oldestAt: oldest?.date.toISOString() ?? null }
  })

/** A person, their bio, and the groups this account shares with them — newest conversation first. */
export const contact = (feature: Feature, reference: string): Promise<PersonCard> =>
  feature.call(async () => {
    const { user, full, dialog, chats } = await personOf(feature, reference)
    return {
      ...toMember(user),
      description: full.bio || null,
      lastMessagedAt: dialog ? (toChat(dialog).lastMessageAt ?? null) : null,
      chats,
    }
  })

/** The same three requests as `contact`, with everything Telegram said kept. */
export const profile = (feature: Feature, reference: string): Promise<ProfileFacts> =>
  feature.call(async () => {
    const { full, chats } = await personOf(feature, reference)
    return toProfileFacts(full, chats)
  })

/** Telegram answers only where the person's privacy lets the owner find them by number. */
export const lookup = ({ call, client }: Feature, phone: string): Promise<Member> =>
  call(async () => toMember(await client.getPeer(await client.resolvePhoneNumber(phone))))

/** The owner's Telegram contacts — the address book, not the chats. */
export const addressBook = ({ call, client }: Feature): Promise<Member[]> =>
  call(async () => (await client.getContacts()).map(toMember))

/** Under the name they show; `renameContact` gives one of the owner's own. */
export const addContact = ({ write, client }: Feature, personId: string): Promise<Member> =>
  write("the contact may have been added — repeating it is safe", async () => {
    const peer = await client.getPeer(Number(personId))
    if (peer.type !== "user") throw new CliError("validation_error", `${personId} is a chat, not a person`)
    return toMember(
      await client.addContact({
        userId: peer.id,
        firstName: peer.firstName,
        ...(peer.lastName ? { lastName: peer.lastName } : {}),
      }),
    )
  })

export const removeContact = ({ write, client }: Feature, personId: string): Promise<void> =>
  write("the contact may have been removed — repeating it is safe", async () => {
    await client.deleteContacts([Number(personId)])
  })

export const block = ({ write, client }: Feature, personId: string): Promise<void> =>
  write("the person may have been blocked — repeating it is safe", async () => {
    await client.blockUser(Number(personId))
  })

export const unblock = ({ write, client }: Feature, personId: string): Promise<void> =>
  write("the person may have been unblocked — repeating it is safe", async () => {
    await client.unblockUser(Number(personId))
  })

export const renameContact = (
  { write, client }: Feature,
  personId: string,
  firstName: string,
  lastName?: string,
): Promise<Member> =>
  write("the contact may have been renamed — repeating it is safe", async () =>
    toMember(await client.addContact({ userId: Number(personId), firstName, ...(lastName ? { lastName } : {}) })),
  )

/** The name is split at its first space into Telegram's first and last name. */
export const importContacts = ({ write, client }: Feature, entries: PhoneBookEntry[]): Promise<Member[]> =>
  write("the contacts may have been imported — repeating it is safe", async () => {
    const result = await client.importContacts(
      entries.map(({ phone, name }) => {
        const [firstName = name, ...rest] = name.split(" ")
        return { phone: `+${phone}`, firstName, lastName: rest.join(" ") }
      }),
    )
    const found = new Set(result.imported.map((one) => String(one.userId)))
    const users = await client.getUsers([...found].map(Number))
    return users.filter((user): user is User => user !== null).map(toMember)
  })
