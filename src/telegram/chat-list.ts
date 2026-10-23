import type { Feature } from "./feature.js"

/** The largest 32-bit time: what Telegram's own clients send for "mute forever". */
const FOREVER = 2_147_483_647

const REPEAT_SAFE = "repeating it is safe"

/** `forever`, an ISO 8601 time, or null to hear the chat again. */
export const mute = (feature: Feature, chatId: string, until: string | null): Promise<void> =>
  feature.write(`the notification setting may have changed — ${REPEAT_SAFE}`, async () => {
    const { client } = feature
    const muteUntil = until === null ? 0 : until === "forever" ? FOREVER : Math.floor(Date.parse(until) / 1000)
    await client.call({
      _: "account.updateNotifySettings",
      peer: { _: "inputNotifyPeer", peer: await client.resolvePeer(await feature.inputOf(chatId)) },
      settings: { _: "inputPeerNotifySettings", muteUntil },
    })
  })

export const archiveChat = (feature: Feature, chatId: string, archived: boolean): Promise<void> =>
  feature.write(`the chat may have moved — ${REPEAT_SAFE}`, async () => {
    const peer = await feature.inputOf(chatId)
    await (archived ? feature.client.archiveChats(peer) : feature.client.unarchiveChats(peer))
  })

export const pinChat = (feature: Feature, chatId: string, pinned: boolean): Promise<void> =>
  feature.write(`the chat may have been ${pinned ? "pinned" : "unpinned"} — ${REPEAT_SAFE}`, async () => {
    const { client } = feature
    await client.call({
      _: "messages.toggleDialogPin",
      pinned,
      peer: { _: "inputDialogPeer", peer: await client.resolvePeer(await feature.inputOf(chatId)) },
    })
  })

export const markChatUnread = (feature: Feature, chatId: string): Promise<void> =>
  feature.write(`the chat may have been marked — ${REPEAT_SAFE}`, async () => {
    await feature.client.markChatUnread(await feature.inputOf(chatId))
  })
