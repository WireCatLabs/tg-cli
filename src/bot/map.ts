import type { AdminRight, Attachment, Chat, ChatKind, Markup, Message, QuotedMessage } from "@leemour/cli-messaging"
import type { BotChatAdmin } from "@leemour/cli-messaging/cli"

/** Telegram's [User](https://core.telegram.org/bots/api#user), the fields read here. */
export interface User {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
}

/** Telegram's [Chat](https://core.telegram.org/bots/api#chat) and the parts of ChatFullInfo read here. */
export interface TgChat {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  title?: string
  first_name?: string
  last_name?: string
  username?: string
}

interface FileRef {
  file_id: string
  file_size?: number
  file_name?: string
  duration?: number
}

/** Telegram's [Message](https://core.telegram.org/bots/api#message), the fields read here. */
export interface TgMessage {
  message_id: number
  chat: TgChat
  from?: User
  date: number
  edit_date?: number
  text?: string
  caption?: string
  reply_to_message?: TgMessage
  photo?: FileRef[]
  document?: FileRef
  voice?: FileRef
  video?: FileRef
  audio?: FileRef
}

const KINDS: Record<TgChat["type"], ChatKind> = {
  private: "dialog",
  group: "group",
  supergroup: "group",
  channel: "channel",
}

const ENTITY: Record<Markup["type"], string> = { bold: "bold", italic: "italic", strike: "strikethrough", code: "code" }

const nameOf = (person: { first_name?: string; last_name?: string } | undefined): string | null =>
  person ? [person.first_name, person.last_name].filter(Boolean).join(" ") || null : null

const iso = (seconds: number): string => new Date(seconds * 1000).toISOString()

/**
 * A file by Telegram's `file_id` only. ⚠ Never a download address: Telegram's has the bot token in
 * it, and an `Attachment.url` would put the token into the store and into command output.
 */
const attachmentsOf = (message: TgMessage): Attachment[] => {
  const files: [string, FileRef | undefined][] = [
    ["photo", message.photo?.at(-1)],
    ["file", message.document],
    ["voice", message.voice],
    ["video", message.video],
    ["audio", message.audio],
  ]
  return files.flatMap(([kind, file]) => {
    if (!file) return []
    const attachment: Attachment = { kind, providerRef: { fileId: file.file_id } }
    if (file.file_name) attachment.name = file.file_name
    if (file.file_size !== undefined) attachment.size = file.file_size
    if (file.duration !== undefined) attachment.duration = file.duration
    return [attachment]
  })
}

const quoted = (message: TgMessage, selfId: string | undefined): QuotedMessage => ({
  id: String(message.message_id),
  senderId: message.from ? String(message.from.id) : null,
  senderName: nameOf(message.from),
  timestamp: iso(message.date),
  text: message.text ?? message.caption ?? "",
  attachments: attachmentsOf(message),
  outgoing: selfId === undefined || !message.from ? null : String(message.from.id) === selfId,
})

/** `selfId` is the bot's own id, when known, so `outgoing` says whether the bot wrote it. */
export const toMessage = (message: TgMessage, selfId?: string): Message => {
  const mapped: Message = {
    id: String(message.message_id),
    chatId: String(message.chat.id),
    senderId: message.from ? String(message.from.id) : null,
    senderName: nameOf(message.from),
    timestamp: iso(message.date),
    editedAt: message.edit_date === undefined ? null : iso(message.edit_date),
    text: message.text ?? message.caption ?? "",
    outgoing: selfId === undefined || !message.from ? null : String(message.from.id) === selfId,
    attachments: attachmentsOf(message),
    replyTo: message.reply_to_message ? quoted(message.reply_to_message, selfId) : null,
    forwardedFrom: null,
    reactions: null,
  }
  if (message.reply_to_message) mapped.replyToId = String(message.reply_to_message.message_id)
  return mapped
}

export const toChat = (chat: TgChat): Chat => ({
  id: String(chat.id),
  title: chat.title ?? nameOf(chat),
  kind: KINDS[chat.type] ?? "unknown",
  unreadCount: null,
  lastMessageAt: null,
  participantsCount: null,
  providerMetadata: { type: chat.type, ...(chat.username ? { username: chat.username } : {}) },
})

/** Markup is in UTF-16 positions, which is what Telegram's [entities](https://core.telegram.org/bots/api#messageentity) count. */
export const entitiesOf = (markup: readonly Markup[]) =>
  markup.map(({ type, from, length }) => ({ type: ENTITY[type], offset: from, length }))

/**
 * The shared admin rights in [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember)'s
 * words, as tg's personal account maps them. Telegram has no right to read: an admin always reads.
 */
export const ADMIN_RIGHT_FIELDS = {
  members: "can_restrict_members",
  admins: "can_promote_members",
  info: "can_change_info",
  pin: "can_pin_messages",
  link: "can_invite_users",
  post: "can_post_messages",
  edit: "can_edit_messages",
  delete: "can_delete_messages",
} as const satisfies Partial<Record<AdminRight, string>>

export const BOT_ADMIN_RIGHTS = Object.keys(ADMIN_RIGHT_FIELDS) as (keyof typeof ADMIN_RIGHT_FIELDS)[]

/** Every right promoteChatMember takes; all of them false demotes. */
export const PROMOTE_FIELDS = [
  "is_anonymous",
  "can_manage_chat",
  "can_delete_messages",
  "can_manage_video_chats",
  "can_restrict_members",
  "can_promote_members",
  "can_change_info",
  "can_invite_users",
  "can_post_stories",
  "can_edit_stories",
  "can_delete_stories",
  "can_post_messages",
  "can_edit_messages",
  "can_pin_messages",
  "can_manage_topics",
  "can_send_welcome_messages",
] as const

/** Telegram's [ChatMemberOwner](https://core.telegram.org/bots/api#chatmemberowner) or ChatMemberAdministrator. */
export interface TgAdmin {
  status: "creator" | "administrator"
  user: User
  custom_title?: string
  [right: string]: unknown
}

export const toAdmin = ({ status, user, custom_title, ...rights }: TgAdmin): BotChatAdmin => ({
  id: String(user.id),
  name: nameOf(user),
  username: user.username ?? null,
  role: status === "creator" ? "owner" : "admin",
  rights: BOT_ADMIN_RIGHTS.filter((right) => status === "creator" || rights[ADMIN_RIGHT_FIELDS[right]] === true),
  title: custom_title ?? null,
})
