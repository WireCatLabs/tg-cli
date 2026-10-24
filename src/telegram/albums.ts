import { createHash } from "node:crypto"
import { getMarkedPeerId, Long, PeersIndex, Message as TgMessage, type tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { SendOptions } from "@wirecat/cli-core/cli"
import type { Upload } from "@wirecat/cli-core/sends"
import {
  type Feature,
  messageNumber,
  parseSendId,
  repeatWith,
  retryDetails,
  type Sent,
  topicNumber,
  unknownIfUnanswered,
} from "./feature.js"
import { checkSpoiler, toFormatted, toInputMedia, toMessage, videoMime } from "./map.js"
import { sendAsPeer } from "./send-as.js"
import { uploadAttachment } from "./upload.js"

export const checkAlbum = (attachments: Upload[], spoiler = false): void => {
  if (attachments.length > 10) throw new CliError("validation_error", "an album holds at most 10 photos or files")
  if (attachments.some((item) => item.kind === "voice"))
    throw new CliError("validation_error", "send voice messages separately from an album")
  const visual = (item: Upload) => item.kind === "photo" || Boolean(videoMime(item))
  if (attachments.some(visual) && !attachments.every(visual))
    throw new CliError("validation_error", "an album can mix photos and videos, or contain only documents")
  if (spoiler) for (const item of attachments) checkSpoiler(item)
}

/** Hash the entire operation id and position, keeping retries stable across connections and int64 boundaries. */
export const albumRandomId = (id: Long, index: number): Long => {
  const bytes = createHash("sha256").update(`tg-album:${id.toString()}:${index}`).digest()
  return Long.fromString(bytes.readBigInt64BE().toString())
}

export const sendAlbum = (feature: Feature, chatId: string, text: string, options: SendOptions): Promise<Sent> => {
  const { sendId, attachments = [], replyTo, threadId, sendAs, silent, at, spoiler, captionAbove } = options
  const id = parseSendId(sendId)
  const thread = threadId === undefined ? undefined : topicNumber(threadId)
  const answering = replyTo === undefined ? undefined : messageNumber(replyTo)
  const author = sendAs === undefined ? undefined : sendAsPeer(chatId, sendAs, feature.self(), feature.checks)
  const caption = toFormatted(text, options.formatting ?? options.markup ?? [])
  return feature.send(async () => {
    const peer = await feature.client.resolvePeer(Number(chatId))
    const multiMedia: tl.RawInputSingleMedia[] = []
    for (const [index, attachment] of attachments.entries()) {
      const input = toInputMedia(attachment, "", await uploadAttachment(feature.client, attachment), { spoiler })
      // sendMultiMedia rejects inputMediaUploaded*: uploadMedia converts them into reusable references.
      const uploaded = await feature.client.uploadMedia(input, { peer })
      const media = uploaded.inputMedia
      if (spoiler && (media._ === "inputMediaPhoto" || media._ === "inputMediaDocument")) media.spoiler = true
      multiMedia.push({
        _: "inputSingleMedia",
        media,
        randomId: albumRandomId(id, index),
        message: index === 0 ? caption.text : "",
        ...(index === 0 && caption.entities?.length ? { entities: caption.entities } : {}),
      })
    }
    const sendAsInput = author === undefined ? undefined : await feature.client.resolvePeer(author)
    try {
      const updates = await feature.client.call({
        _: "messages.sendMultiMedia",
        peer,
        multiMedia,
        ...(silent ? { silent } : {}),
        ...(captionAbove ? { invertMedia: true } : {}),
        ...(at === undefined ? {} : { scheduleDate: Math.floor(Date.parse(at) / 1000) }),
        ...(sendAsInput === undefined ? {} : { sendAs: sendAsInput }),
        ...(answering === undefined && (thread === undefined || thread === 1)
          ? {}
          : {
              replyTo: {
                _: "inputReplyToMessage",
                replyToMsgId: answering ?? thread ?? 1,
                ...(thread === undefined || thread === 1 ? {} : { topMsgId: thread }),
              },
            }),
      })
      feature.client.handleClientUpdate(updates, true)
      if (updates._ !== "updates" && updates._ !== "updatesCombined")
        throw new CliError(
          "outcome_unknown",
          "Telegram answered the album without its messages",
          retryDetails(sendId, sendAs),
        )
      const peers = PeersIndex.from(updates)
      const messages = multiMedia.map(({ randomId }) => {
        const mapped = updates.updates.find((one) => one._ === "updateMessageID" && one.randomId.eq(randomId))
        const candidates = updates.updates.flatMap((one) =>
          (one._ === "updateNewMessage" ||
            one._ === "updateNewChannelMessage" ||
            one._ === "updateNewScheduledMessage") &&
          one.message._ !== "messageEmpty"
            ? [one.message]
            : [],
        )
        const copy =
          mapped?._ === "updateMessageID"
            ? candidates.find(
                (message) => message.id === mapped.id && getMarkedPeerId(message.peerId) === Number(chatId),
              )
            : undefined
        if (!copy)
          throw new CliError(
            "outcome_unknown",
            `the album may have been sent. Repeat with ${repeatWith(sendId, sendAs)}`,
            retryDetails(sendId, sendAs),
          )
        return toMessage(new TgMessage(copy, peers))
      })
      const first = messages[0]
      if (!first) throw new CliError("provider_error", "Telegram answered the album without a first message")
      return { message: first, messages, sendId }
    } catch (error) {
      throw unknownIfUnanswered(
        error,
        `the album may have been sent. Repeat with ${repeatWith(sendId, sendAs)}, never without it`,
        retryDetails(sendId, sendAs),
      )
    }
  })
}
