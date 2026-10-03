import { CliError, isCliError } from "@leemour/cli-core"
import type { BotAction, BotAdapter, BotChatRef, BotSendOptions } from "@leemour/cli-messaging/cli"
import { formatMarkdown } from "../telegram/format-markdown.js"
import {
  ADMIN_RIGHT_FIELDS,
  entitiesOf,
  PROMOTE_FIELDS,
  type TgAdmin,
  type TgChat,
  type TgMessage,
  type TgUpdate,
  toAdmin,
  toChat,
  toEvent,
  toMessage,
  UPDATE_TYPES,
  type User,
} from "./map.js"
import type { OutgoingFile, TelegramBotTransport } from "./transport.js"

/** `user:<id>` is the dialog with that person: Telegram's chat id for a dialog is the person's id. */
const chatIdOf = (chat: BotChatRef): string => (chat.startsWith("user:") ? chat.slice("user:".length) : chat)

/** The second of two calls failed: say what the first already did, keeping the second's code. */
const halfDone = (done: string, error: unknown): never => {
  if (!isCliError(error)) throw error
  throw new CliError(error.code, `${done}, but ${error.message}`, error.details)
}

/** [sendChatAction](https://core.telegram.org/bots/api#sendchataction)'s words. */
const ACTIONS: Record<BotAction, string> = {
  typing: "typing",
  photo: "upload_photo",
  video: "upload_video",
  voice: "upload_voice",
  file: "upload_document",
}

const formatting = (
  markup: BotSendOptions["markup"] | BotSendOptions["formatting"],
  html: boolean | undefined,
  field: "entities" | "caption_entities",
) => (html ? { parse_mode: "HTML" } : markup && markup.length > 0 ? { [field]: entitiesOf(markup) } : {})

/**
 * A Telegram bot behind the shared bot port. Telegram's Bot API reads no history and no single
 * message, so this adapter has neither `history` nor `message`: the shared commands answer those
 * from the bot's own copy. Ids are at most 52 bits, so a number is exact; the port takes strings.
 */
export const telegramBotAdapter = (transport: TelegramBotTransport): BotAdapter => {
  let self: string | undefined
  const me = async () => {
    const bot = (await transport.call("getMe")) as User
    self = String(bot.id)
    return {
      id: self,
      name: [bot.first_name, bot.last_name].filter(Boolean).join(" ") || null,
      username: bot.username ?? null,
    }
  }
  const sent = (answer: unknown) => toMessage(answer as TgMessage, self)

  return {
    me,
    formatMarkdown: async (text) => formatMarkdown(text),
    close: async () => {},

    send: async (chat, text, { replyTo, silent, markup, formatting: spans, html, attachments = [] }) => {
      if (attachments.length > 1) throw new CliError("validation_error", "a Telegram bot sends one file at a time")
      const [attachment] = attachments
      const common = {
        chat_id: chatIdOf(chat),
        ...(replyTo ? { reply_parameters: { message_id: Number(replyTo) } } : {}),
        ...(silent ? { disable_notification: true } : {}),
      }
      if (!attachment) {
        return sent(
          await transport.call(
            "sendMessage",
            { ...common, text, ...formatting(spans ?? markup, html, "entities") },
            { reads: false },
          ),
        )
      }
      const [method, field] =
        attachment.kind === "photo"
          ? ["sendPhoto", "photo"]
          : attachment.kind === "voice"
            ? ["sendVoice", "voice"]
            : ["sendDocument", "document"]
      const file: OutgoingFile = { field, name: attachment.name, bytes: attachment.bytes }
      const caption = text ? { caption: text, ...formatting(spans ?? markup, html, "caption_entities") } : {}
      return sent(await transport.call(method, { ...common, ...caption }, { reads: false, file }))
    },

    edit: async (chat, messageId, text, { markup, formatting: spans, html }) =>
      sent(
        await transport.call(
          "editMessageText",
          {
            chat_id: chatIdOf(chat),
            message_id: Number(messageId),
            text,
            ...formatting(spans ?? markup, html, "entities"),
          },
          { reads: false },
        ),
      ),

    delete: async (chat, messageIds) => {
      await transport.call(
        "deleteMessages",
        { chat_id: chatIdOf(chat), message_ids: messageIds.map(Number) },
        { reads: false },
      )
    },

    pin: async (chat, messageId, { notify }) => {
      await transport.call(
        "pinChatMessage",
        { chat_id: chatIdOf(chat), message_id: Number(messageId), disable_notification: !notify },
        { reads: false },
      )
    },

    unpin: async (chat, messageId) => {
      await transport.call(
        "unpinChatMessage",
        { chat_id: chatIdOf(chat), message_id: Number(messageId) },
        { reads: false },
      )
    },

    chat: async (chat) => toChat((await transport.call("getChat", { chat_id: chatIdOf(chat) })) as TgChat),

    leave: async (chat) => {
      await transport.call("leaveChat", { chat_id: chatIdOf(chat) }, { reads: false })
    },

    action: async (chat, action) => {
      await transport.call("sendChatAction", { chat_id: chatIdOf(chat), action: ACTIONS[action] }, { reads: false })
    },

    admins: async (chat) =>
      ((await transport.call("getChatAdministrators", { chat_id: chatIdOf(chat) })) as TgAdmin[]).map(toAdmin),

    addAdmin: async (chat, person, rights, { title }) => {
      const granted = new Set<string>(
        rights.map((right) => {
          if (!(right in ADMIN_RIGHT_FIELDS))
            throw new CliError("validation_error", `a Telegram bot cannot grant ${right}`)
          return ADMIN_RIGHT_FIELDS[right as keyof typeof ADMIN_RIGHT_FIELDS]
        }),
      )
      const target = { chat_id: chatIdOf(chat), user_id: Number(person) }
      await transport.call(
        "promoteChatMember",
        { ...target, ...Object.fromEntries(PROMOTE_FIELDS.map((field) => [field, granted.has(field)])) },
        { reads: false },
      )
      if (title === undefined) return
      await transport
        .call("setChatAdministratorCustomTitle", { ...target, custom_title: title }, { reads: false })
        .catch((error: unknown) => halfDone(`${person} is an admin now`, error))
    },

    removeAdmin: async (chat, person) => {
      await transport.call(
        "promoteChatMember",
        {
          chat_id: chatIdOf(chat),
          user_id: Number(person),
          ...Object.fromEntries(PROMOTE_FIELDS.map((field) => [field, false])),
        },
        { reads: false },
      )
    },

    // Telegram removes only by banning; without --block the ban is lifted at once, so the link lets them back.
    menu: async () =>
      ((await transport.call("getMyCommands")) as { command: string; description: string }[]).map(
        ({ command, description }) => ({ name: command, description: description || null }),
      ),

    setMenu: async (entries) => {
      if (entries.length === 0) {
        await transport.call("deleteMyCommands", {}, { reads: false })
        return
      }
      const bare = entries.find((entry) => !entry.description)
      if (bare) throw new CliError("validation_error", `a Telegram command needs a description: ${bare.name}=…`)
      await transport.call(
        "setMyCommands",
        { commands: entries.map(({ name, description }) => ({ command: name, description })) },
        { reads: false },
      )
    },

    // Telegram's answer cannot change the message; --text is a second call, to the press `bot watch` kept.
    answer: async (callbackId, { notification, text, press }) => {
      if (text !== undefined && !press) {
        throw new CliError(
          "validation_error",
          "a Telegram bot can replace the message only for a press `bot watch` saw — run it, then answer",
        )
      }
      await transport.call(
        "answerCallbackQuery",
        { callback_query_id: callbackId, ...(notification === undefined ? {} : { text: notification }) },
        { reads: false },
      )
      if (text === undefined || !press) return
      await transport
        .call("editMessageText", { chat_id: press.chatId, message_id: Number(press.messageId), text }, { reads: false })
        .catch((error: unknown) => halfDone("the button was answered", error))
    },

    webhooks: async () => {
      const info = (await transport.call("getWebhookInfo")) as { url?: string; allowed_updates?: string[] }
      return info.url ? [{ url: info.url, types: info.allowed_updates ?? null }] : []
    },

    setWebhook: async (url, { types, secret }) => {
      await transport.call(
        "setWebhook",
        { url, allowed_updates: types ?? UPDATE_TYPES, ...(secret ? { secret_token: secret } : {}) },
        { reads: false },
      )
    },

    // Telegram's deleteWebhook names no address: refuse one that is not the address set.
    deleteWebhook: async (url) => {
      const info = (await transport.call("getWebhookInfo")) as { url?: string }
      if (info.url !== url) throw new CliError("not_found", `this bot's webhook is not ${url}`)
      await transport.call("deleteWebhook", {}, { reads: false })
    },

    updates: async (cursor, { types, waitSeconds }) => {
      if (self === undefined) await me()
      const updates = (await transport.call(
        "getUpdates",
        {
          ...(cursor ? { offset: Number(cursor) } : {}),
          timeout: waitSeconds,
          allowed_updates: types ?? UPDATE_TYPES,
        },
        { timeoutMs: (waitSeconds + 15) * 1000 },
      )) as TgUpdate[]
      const last = updates.at(-1)
      return {
        events: updates.map((update) => toEvent(update, self)),
        cursor: last ? String(last.update_id + 1) : cursor,
      }
    },

    removeMember: async (chat, person, { block }) => {
      const target = { chat_id: chatIdOf(chat), user_id: Number(person) }
      await transport.call("banChatMember", target, { reads: false })
      if (block) return
      await transport
        .call("unbanChatMember", { ...target, only_if_banned: true }, { reads: false })
        .catch((error: unknown) => halfDone(`${person} is out of the chat and still blocked`, error))
    },
  }
}
