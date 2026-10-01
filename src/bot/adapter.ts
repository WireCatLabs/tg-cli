import { CliError } from "@leemour/cli-core"
import type { BotAction, BotAdapter, BotChatRef, BotSendOptions } from "@leemour/cli-messaging/cli"
import { entitiesOf, type TgChat, type TgMessage, toChat, toMessage, type User } from "./map.js"
import type { OutgoingFile, TelegramBotTransport } from "./transport.js"

/** `user:<id>` is the dialog with that person: Telegram's chat id for a dialog is the person's id. */
const chatIdOf = (chat: BotChatRef): string => (chat.startsWith("user:") ? chat.slice("user:".length) : chat)

/** [sendChatAction](https://core.telegram.org/bots/api#sendchataction)'s words. */
const ACTIONS: Record<BotAction, string> = {
  typing: "typing",
  photo: "upload_photo",
  video: "upload_video",
  voice: "upload_voice",
  file: "upload_document",
}

const formatting = (
  markup: BotSendOptions["markup"],
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
    close: async () => {},

    send: async (chat, text, { replyTo, silent, markup, html, attachments = [] }) => {
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
            { ...common, text, ...formatting(markup, html, "entities") },
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
      const caption = text ? { caption: text, ...formatting(markup, html, "caption_entities") } : {}
      return sent(await transport.call(method, { ...common, ...caption }, { reads: false, file }))
    },

    edit: async (chat, messageId, text, { markup, html }) =>
      sent(
        await transport.call(
          "editMessageText",
          { chat_id: chatIdOf(chat), message_id: Number(messageId), text, ...formatting(markup, html, "entities") },
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
  }
}
