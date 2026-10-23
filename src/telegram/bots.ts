import { getMarkedPeerId, type Message as TgMessage, tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Button, Id } from "@wirecat/cli-core"
import {
  type Feature,
  messageNumber,
  parseSendId,
  publicName,
  repeatWith,
  retryDetails,
  unknownIfUnanswered,
} from "./feature.js"
import { toButtons } from "./map.js"

const LINK = /^(?:https?:\/\/)?(?:t|telegram)\.me\/([A-Za-z][\w]{3,})\/?(?:\?(.*))?$/

const messageOf = async (feature: Feature, chatId: Id, messageId: Id): Promise<TgMessage> => {
  const id = messageNumber(messageId, "a message id is a number")
  const [message] = await feature.client.getMessages(Number(chatId), [id])
  if (!message) throw new CliError("not_found", `message ${messageId} is not in this chat`)
  return message
}

export const buttons = (feature: Feature, chatId: Id, messageId: Id): Promise<Button[][]> =>
  feature.call(async () => toButtons((await messageOf(feature, chatId, messageId)).markup) ?? [])

/** The callback data never leaves the adapter: the button is read again from the message, by its place. */
export const pressButton = (feature: Feature, chatId: Id, messageId: Id, row: number, column: number): Promise<void> =>
  feature.write("the button may have reached the bot — pressing again tells it twice", async () => {
    const message = await messageOf(feature, chatId, messageId)
    const pressed = message.markup?.type === "inline" ? message.markup.buttons[row]?.[column] : undefined
    if (!pressed) throw new CliError("not_found", "the message's buttons changed — read them again")
    const { type } = pressed
    if (type._ !== "inlineButtonTypeCallback" || type.requiresPassword)
      throw new CliError("validation_error", `not pressed: "${pressed.text}" is not a button this CLI presses`)
    try {
      await feature.client.getCallbackAnswer({
        chatId: Number(chatId),
        message: message.id,
        data: type.data,
      })
    } catch (error) {
      // The bot got the press and did not answer it in time: the press is done, only its reply is missing.
      if (!tl.RpcError.is(error, "BOT_RESPONSE_TIMEOUT")) throw error
    }
  })

/** `t.me/<bot>?start=…` or `tg://resolve?domain=<bot>&start=…`; anything else is not a bot link. */
export const botByLink = (feature: Feature, reference: string) => {
  const typed = reference.trim()
  const web = LINK.exec(typed)
  const app = /^tg:\/\/resolve\?(.*)$/.exec(typed)
  const query = new URLSearchParams(web?.[2] ?? app?.[1] ?? "")
  const name = web ? publicName(typed) : query.get("domain")
  if (!name || !/bot$/i.test(name)) return Promise.resolve(undefined)
  const payload = query.get("start") ?? undefined
  return feature.call(async () => ({
    chatId: String(getMarkedPeerId(await feature.client.resolvePeer(name))),
    ...(payload === undefined ? {} : { payload }),
  }))
}

export const startBot = (
  feature: Feature,
  chatId: Id,
  { sendId, payload }: { sendId: string; payload?: string },
): Promise<void> => {
  const randomId = parseSendId(sendId)
  return feature.send(async () => {
    const bot = await feature.client.getPeer(Number(chatId))
    if (bot.type !== "user" || !bot.isBot) throw new CliError("validation_error", "this chat is not a bot")
    const peer = await feature.client.resolvePeer(Number(chatId))
    const user = await feature.client.resolveUser(Number(chatId))
    try {
      await feature.client.call({
        _: "messages.startBot",
        bot: user,
        peer,
        randomId,
        startParam: payload ?? "",
      })
    } catch (error) {
      throw unknownIfUnanswered(
        error,
        `the bot may have been started. Repeat with ${repeatWith(sendId, undefined)}, never without it`,
        retryDetails(sendId, undefined),
      )
    }
  })
}

/** The address signs the owner in, so it goes back to the caller and nowhere else. */
export const botApp = (
  feature: Feature,
  chatId: Id,
  { startParam }: { startParam?: string },
): Promise<{ url: string }> =>
  feature.call(async () => {
    const bot = await feature.client.getPeer(Number(chatId))
    if (bot.type !== "user" || !bot.isBot) throw new CliError("validation_error", "this chat is not a bot")
    const view = await feature.client.openWebview({
      webview: { type: "main", ...(startParam === undefined ? {} : { startParam }) },
      bot: Number(chatId),
      platform: "tdesktop",
    })
    return { url: view.url }
  })
