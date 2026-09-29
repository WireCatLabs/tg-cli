import type {
  Attachment,
  Capabilities,
  Chat,
  ChatKind,
  Member,
  Message,
  MessageChange,
  MessageHit,
  ProviderMetadata,
  QuotedMessage,
  Reactions,
} from "@leemour/cli-messaging"
import {
  type DeleteMessageUpdate,
  type Dialog,
  getMarkedPeerId,
  type MessageMedia,
  MessageReactions,
  type Peer,
  type PeerSender,
  type RawUpdateInfo,
  type Message as TgMessage,
} from "@mtcute/node"

/** The only file that knows mtcute's shapes. Every id leaves it as a string: Telegram ids are 64-bit. */

export const TELEGRAM_CAPABILITIES: Capabilities = {
  history: true,
  chatList: "server",
  realtime: "push",
  send: true,
  edit: true,
  delete: true,
  react: true,
  threads: true,
}

export interface Account {
  id: string
  name: string | null
  username: string | null
}

export const toMember = (user: Peer): Member => ({
  id: String(user.id),
  name: user.displayName || null,
  username: user.username,
})

export const toAccount = (user: Peer): Account => ({
  id: String(user.id),
  name: user.displayName || null,
  username: user.username,
})

const kindOf = (peer: Peer): ChatKind => {
  if (peer.type === "user") return peer.isSelf ? "saved" : "dialog"
  if (peer.chatType === "channel") return "channel"
  return "group"
}

/** A chat as a peer alone describes it — no unread count or last message, which only a dialog carries. */
export const peerToChat = (peer: Peer, extra: Record<string, unknown> = {}): Chat => {
  const metadata = compact({
    isBot: peer.type === "user" && peer.isBot ? true : undefined,
    isForum: peer.type === "chat" && peer.isForum ? true : undefined,
    chatType: peer.type === "chat" ? peer.chatType : undefined,
    username: peer.username ?? undefined,
    ...extra,
  })
  return {
    id: String(peer.id),
    title: peer.type === "user" && peer.isSelf ? "Saved Messages" : peer.displayName || null,
    kind: kindOf(peer),
    unreadCount: null,
    lastMessageAt: null,
    participantsCount: peer.type === "chat" ? peer.membersCount : null,
    ...(metadata ? { providerMetadata: metadata } : {}),
  }
}

export const toChat = (dialog: Dialog): Chat => ({
  ...peerToChat(dialog.peer, { archived: dialog.isArchived || undefined, pinned: dialog.isPinned || undefined }),
  unreadCount: dialog.unreadCount,
  lastMessageAt: dialog.lastMessage?.date.toISOString() ?? null,
})

export const toMessage = (message: TgMessage): Message => {
  const reply = message.replyToMessage
  const metadata = compact({
    views: message.views ?? undefined,
    forwards: message.forwards ?? undefined,
    groupedId: message.groupedIdUnique ?? undefined,
    action: message.action?.type,
    link: linkOf(message),
  })
  return {
    id: String(message.id),
    chatId: String(message.chat.id),
    senderId: String(message.sender.id),
    senderName: message.sender.displayName || null,
    ...(message.sender.type === "chat" ? { senderIsChat: true } : {}),
    timestamp: message.date.toISOString(),
    editedAt: message.editDate?.toISOString() ?? null,
    text: message.text,
    outgoing: message.isOutgoing,
    attachments: attachmentsOf(message.media),
    replyTo: null,
    ...(reply?.id != null ? { replyToId: String(reply.id) } : {}),
    forwardedFrom: message.forward ? forwardOf(message) : null,
    ...(message.isTopicMessage && reply?.threadId != null ? { threadId: String(reply.threadId) } : {}),
    reactions: message.reactions ? reactionsOf(message.reactions) : null,
    ...(metadata ? { providerMetadata: metadata } : {}),
  }
}

/** Only public chats and supergroups have links; mtcute throws for the rest, and that is not an error here. */
const linkOf = (message: TgMessage): string | undefined => {
  try {
    return message.link
  } catch {
    return undefined
  }
}

const forwardOf = (message: TgMessage): QuotedMessage => {
  const forward = message.forward
  const sender: PeerSender | undefined = forward?.sender
  return {
    id: forward?.fromMessageId != null ? String(forward.fromMessageId) : "",
    senderId: sender && sender.type !== "anonymous" ? String(sender.id) : null,
    senderName: sender?.displayName || null,
    timestamp: forward?.date.toISOString() ?? null,
    // The text of a forward is the message's own text in Telegram; a second copy would print twice.
    text: "",
    attachments: [],
    outgoing: null,
  }
}

const reactionsOf = (reactions: MessageReactions): Reactions => {
  const counts = reactions.reactions.map((one) => ({
    reaction: typeof one.emoji === "string" ? one.emoji : `custom:${String(one.emoji)}`,
    count: one.count,
    mine: one.order !== null,
  }))
  return {
    counts: counts.map(({ reaction, count }) => ({ reaction, count })),
    mine: counts.find((one) => one.mine)?.reaction ?? null,
    total: counts.reduce((sum, one) => sum + one.count, 0),
  }
}

export const attachmentsOf = (media: MessageMedia): Attachment[] => {
  if (!media) return []
  const read = <T>(name: string): T | undefined => {
    if (!(name in media)) return undefined
    const value = (media as unknown as Record<string, unknown>)[name]
    return value === null || value === "" ? undefined : (value as T)
  }
  const attachment: Attachment = { kind: media.type }
  const name = read<string>("fileName")
  const mime = read<string>("mimeType")
  const size = read<number>("fileSize")
  const width = read<number>("width")
  const height = read<number>("height")
  const duration = read<number>("duration")
  // In the domain type's order, so an answer from the store prints byte for byte the same.
  if (typeof width === "number") attachment.width = width
  if (typeof height === "number") attachment.height = height
  if (name !== undefined) attachment.name = name
  if (typeof size === "number") attachment.size = size
  if (mime !== undefined) attachment.mime = mime
  if (typeof duration === "number") attachment.duration = duration
  return [attachment]
}

const compact = (fields: Record<string, unknown>): ProviderMetadata | undefined => {
  const kept = Object.entries(fields).filter(([, value]) => value !== undefined)
  return kept.length > 0 ? Object.fromEntries(kept) : undefined
}

export const toMessageHit = (message: TgMessage): MessageHit => ({
  ...toMessage(message),
  chatTitle: peerToChat(message.chat).title,
})

/** Private chats and basic groups name deleted ids without a chat; only a channel's say which. */
export const toDeletions = (update: DeleteMessageUpdate): MessageChange[] => {
  const chatId = update.channelId === null ? null : String(getMarkedPeerId(update.channelId, "channel"))
  return update.messageIds.map((id) => ({ event: "delete", chatId, chatTitle: null, messageId: String(id) }))
}

/** A personal account gets reaction changes only as a raw update; mtcute parses them for bots alone. */
export const toReactionChange = ({ update, peers }: RawUpdateInfo): MessageChange | undefined => {
  if (update._ !== "updateMessageReactions") return undefined
  const chatId = getMarkedPeerId(update.peer)
  return {
    event: "reaction",
    chatId: String(chatId),
    chatTitle: null,
    messageId: String(update.msgId),
    reactions: reactionsOf(new MessageReactions(update.msgId, chatId, update.reactions, peers)),
  }
}
