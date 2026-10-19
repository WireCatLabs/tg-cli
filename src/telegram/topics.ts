import { getMarkedPeerId, tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Message, Page, Topic, TopicChange } from "@wirecat/cli-core"
import type { ForumState } from "@wirecat/cli-core/cli"
import {
  type Feature,
  forwardedCopy,
  messageNumber,
  parseSendId,
  remoteMessage,
  topicNumber,
  unknownIfUnanswered,
} from "./feature.js"
import { peerToChat, toTopic } from "./map.js"

const stateOf = async ({ client }: Feature, chatId: string): Promise<ForumState> => {
  let full = await client.getFullChat(Number(chatId))
  if (full.migratedToId != null) full = await client.getFullChat(full.migratedToId)
  if (full.chatType !== "group" && full.chatType !== "supergroup") {
    throw new CliError("validation_error", "forum topics require a group, not a channel or dialog")
  }
  return {
    chat: peerToChat(full),
    forum: full.isForum,
    needsUpgrade: full.chatType === "group",
    owner: full.isCreator,
    linkedDiscussion: full.linkedChat !== null,
    canCreate:
      full.isCreator ||
      full.adminRights?.manageTopics === true ||
      full.permissions?.canManageTopics === true ||
      full.defaultPermissions?.canManageTopics === true,
  }
}

export const forumState = (feature: Feature, chatId: string): Promise<ForumState> =>
  feature.call(() => stateOf(feature, chatId))

export const upgradeForum = (feature: Feature, chatId: string): Promise<ForumState> =>
  feature.call(async () => {
    const { client } = feature
    const state = await stateOf(feature, chatId)
    if (!state.owner) throw new CliError("permission_error", "only the owner can prepare this group for topics")
    if (!state.needsUpgrade) return state
    const peer = await client.resolvePeer(Number(state.chat.id))
    if (peer._ !== "inputPeerChat") throw new CliError("validation_error", "only a basic group can be upgraded")
    let accepted = false
    let migratedChatId: string | undefined
    try {
      const updates = await client.call(
        { _: "messages.migrateChat", chatId: peer.chatId },
        { maxRetryCount: 0, floodSleepThreshold: 0 },
      )
      accepted = true
      client.handleClientUpdate(updates, true)
      const made =
        updates._ === "updates" || updates._ === "updatesCombined"
          ? updates.chats.find((chat) => chat._ === "channel" && chat.megagroup)
          : undefined
      if (made?._ !== "channel")
        throw new CliError(
          "outcome_unknown",
          "the group may have been upgraded; check its current chat id before repeating",
        )
      migratedChatId = String(getMarkedPeerId({ _: "peerChannel", channelId: made.id }))
      return await stateOf(feature, migratedChatId)
    } catch (error) {
      if (accepted)
        throw new CliError(
          "outcome_unknown",
          "the upgrade was accepted but its state could not be read; check the current group before continuing",
          {
            previous_chat_id: state.chat.id,
            ...(migratedChatId === undefined ? {} : { chat_id: migratedChatId, upgraded: true }),
            stage: "upgrade",
          },
        )
      throw unknownIfUnanswered(error, "the group may have been upgraded; check its current chat id before repeating")
    }
  })

export const enableForum = (feature: Feature, chatId: string): Promise<ForumState> =>
  feature.call(async () => {
    const state = await stateOf(feature, chatId)
    if (!state.owner) throw new CliError("permission_error", "only the group owner can enable forum topics")
    if (state.needsUpgrade)
      throw new CliError("validation_error", "upgrade the basic group explicitly before enabling topics")
    if (state.linkedDiscussion)
      throw new CliError("validation_error", "a linked discussion group cannot enable forum topics")
    if (state.forum) return state
    try {
      const full = await feature.client.getFullChat(Number(state.chat.id))
      await feature.client.updateForumSettings(Number(state.chat.id), {
        isForum: true,
        threadsMode: full.raw._ === "channel" && full.raw.forumTabs ? "tabs" : "list",
      })
      return await stateOf(feature, state.chat.id)
    } catch (error) {
      if (tl.RpcError.is(error, "CHAT_NOT_MODIFIED")) return stateOf(feature, state.chat.id)
      throw unknownIfUnanswered(error, "topics may have been enabled; check the forum state before repeating")
    }
  })

export const createTopic = (feature: Feature, chatId: string, title: string, { sendId }: { sendId: string }) => {
  const randomId = parseSendId(sendId)
  return feature.call(async (): Promise<Topic> => {
    const { client } = feature
    const state = await stateOf(feature, chatId)
    if (!state.forum || state.needsUpgrade)
      throw new CliError("validation_error", "enable topics before creating a topic")
    if (!state.canCreate) throw new CliError("permission_error", "creating a topic requires manage-topics permission")
    let accepted = false
    try {
      const updates = await client.call(
        {
          _: "messages.createForumTopic",
          peer: await client.resolvePeer(Number(state.chat.id)),
          title,
          randomId,
        },
        { maxRetryCount: 0, floodSleepThreshold: 0 },
      )
      accepted = true
      client.handleClientUpdate(updates, true)
      const message = forwardedCopy(updates, randomId, state.chat.id)
      const mapped =
        updates._ === "updates" || updates._ === "updatesCombined"
          ? updates.updates.find(
              (update) => update._ === "updateMessageID" && String(update.randomId) === String(randomId),
            )
          : undefined
      const topicId = mapped && mapped._ === "updateMessageID" ? mapped.id : message?.id
      if (topicId === undefined)
        throw new CliError(
          "outcome_unknown",
          "Telegram did not return the topic id; check topics list and do not repeat this creation",
          { operation_id: sendId, retryable: false },
        )
      const [topic] = await client.getForumTopicsById(Number(state.chat.id), topicId)
      if (!topic)
        throw new CliError(
          "outcome_unknown",
          "the topic may exist but could not be read; check topics list and do not repeat this creation",
          { operation_id: sendId, retryable: false },
        )
      return toTopic(topic)
    } catch (error) {
      if (accepted)
        throw new CliError(
          "outcome_unknown",
          "topic creation was accepted but its result could not be read; check topics list and do not repeat",
          { operation_id: sendId, retryable: false },
        )
      throw unknownIfUnanswered(
        error,
        `the topic may have been created; check topics list and do not repeat this creation`,
        { operation_id: sendId, retryable: false },
      )
    }
  })
}

/**
 * A repeat answers TOPIC_NOT_MODIFIED: the change is already there, so the topic is read back as for a first.
 * Pinning is Telegram's own call, made after the edit.
 */
export const editTopic = (
  feature: Feature,
  chatId: string,
  topicId: string,
  { title, closed, pinned, hidden }: TopicChange,
): Promise<Topic> => {
  const id = topicNumber(topicId)
  if (hidden !== undefined && id !== 1)
    throw new CliError("validation_error", "only the General topic (id 1) can be hidden")
  return feature.call(async () => {
    const { client } = feature
    const unchanged = (error: unknown) => {
      if (!tl.RpcError.is(error, "TOPIC_NOT_MODIFIED") && !tl.RpcError.is(error, "PINNED_TOPIC_NOT_MODIFIED"))
        throw unknownIfUnanswered(error, "the topic may have changed — repeating it is safe")
    }
    if (title !== undefined || closed !== undefined) {
      await client
        .editForumTopic({
          chatId: Number(chatId),
          topicId: id,
          ...(title === undefined ? {} : { title }),
          ...(closed === undefined ? {} : { closed }),
        })
        .catch(unchanged)
    }
    if (pinned !== undefined)
      await client.toggleForumTopicPinned({ chatId: Number(chatId), topicId: id, pinned }).catch(unchanged)
    if (hidden !== undefined) await client.toggleGeneralTopicHidden({ chatId: Number(chatId), hidden }).catch(unchanged)
    const [topic] = await client.getForumTopicsById(Number(chatId), id)
    if (!topic) throw new CliError("not_found", `no topic ${topicId} in that chat`)
    // Measured 2026-10-04: a read right after the edit can still show the title and state of edits ago.
    return {
      ...toTopic(topic),
      ...(title === undefined ? {} : { title }),
      ...(closed === undefined ? {} : { closed }),
      ...(pinned === undefined ? {} : { pinned }),
      ...(hidden === undefined ? {} : { hidden }),
    }
  })
}

/** Without `force` Telegram only reorders: a topic that is not pinned stays as it is. */
export const orderPinnedTopics = (feature: Feature, chatId: string, topicIds: string[]): Promise<void> => {
  const order = topicIds.map(topicNumber)
  return feature.call(async () => {
    try {
      await feature.client.reorderPinnedForumTopics({ chatId: Number(chatId), order })
    } catch (error) {
      throw unknownIfUnanswered(error, "the pinned topics may have been reordered — repeating it is safe")
    }
  })
}

/** Telegram deletes the topic's history with it; a topic that is gone answers TOPIC_ID_INVALID, `not_found`. */
export const deleteTopic = (feature: Feature, chatId: string, topicId: string): Promise<void> => {
  const id = topicNumber(topicId)
  return feature.call(async () => {
    try {
      await feature.client.deleteForumTopicHistory(Number(chatId), id)
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the topic may have been deleted",
        check: "topics.list",
        after: "before repeating",
      })
    }
  })
}

export const validateThread = async (
  feature: Feature,
  chatId: string,
  threadId: string,
  { replyTo }: { replyTo?: string },
): Promise<void> => {
  const topicId = topicNumber(threadId)
  const replyId = replyTo === undefined ? undefined : messageNumber(replyTo, "--reply-to needs a message id")
  return feature.call(async () => {
    const { client } = feature
    const peer = await client.getPeer(Number(chatId))
    if (peer.type !== "chat" || !peer.isForum) {
      throw new CliError("validation_error", "--topic requires a Telegram forum group")
    }
    const [topic] = await client.getForumTopicsById(Number(chatId), topicId)
    if (!topic) throw new CliError("not_found", "that forum topic does not exist; check `topics list`")
    if (topic.isClosed) throw new CliError("permission_error", "that forum topic is closed; choose an open topic")
    if (replyId !== undefined) {
      const [reply] = await client.getMessages(Number(chatId), [replyId])
      if (!reply) throw new CliError("not_found", "the message to reply to no longer exists in this chat")
      const replyThread = reply.isTopicMessage ? (reply.replyToMessage?.threadId ?? reply.id) : 1
      if (reply.id !== topicId && replyThread !== topicId) {
        throw new CliError("validation_error", "--reply-to belongs to a different topic; choose a message in --topic")
      }
    }
  })
}

export const topic = (feature: Feature, reference: string, topicId: string): Promise<Topic> => {
  const id = topicNumber(topicId)
  return feature.call(async () => {
    const input = await feature.inputOf(reference)
    const peer = await feature.client.getPeer(input)
    if (peer.type !== "chat" || !peer.isForum) throw new CliError("validation_error", "that chat has no topics")
    const [found] = await feature.client.getForumTopicsById(input, id)
    if (!found) throw new CliError("not_found", "that forum topic does not exist; check `topics list`")
    return toTopic(found)
  })
}

/** A forum's topics, newest activity first; Telegram matches `search` against their titles. */
export const topics = (
  feature: Feature,
  reference: string,
  { search, limit, offset }: { search?: string; limit?: number; offset: number },
): Promise<Page<Topic>> =>
  feature.call(async () => {
    const peer = await feature.inputOf(reference)
    const items: Topic[] = []
    const wanted = limit === undefined ? {} : { limit: offset + limit + 1 }
    for await (const one of feature.client.iterForumTopics(peer, {
      ...wanted,
      ...(search ? { query: search } : {}),
    })) {
      items.push(toTopic(one))
    }
    const end = limit === undefined ? items.length : offset + limit
    return { items: items.slice(offset, end), hasMore: items.length > end }
  })

/** Telegram reads a thread with messages.search and its top message id (core.telegram.org/api/threads). */
export const topicHistory = (
  feature: Feature,
  reference: string,
  threadId: string,
  { limit, before }: { limit: number; before?: string },
): Promise<Page<Message>> => {
  const thread = topicNumber(threadId)
  const offset = before === undefined ? undefined : messageNumber(before, "`id<` takes a message id")
  return feature.call(async () => {
    const page = await feature.client.searchMessages({
      chatId: await feature.inputOf(reference),
      threadId: thread,
      limit,
      ...(offset === undefined ? {} : { offset }),
    })
    return { items: page.map(remoteMessage).reverse(), hasMore: page.next !== undefined }
  })
}

/** Telegram reads a topic as a discussion thread, up to a message id: without `until`, the topic's newest. */
export const markTopicRead = (feature: Feature, chatId: string, topicId: string, until?: string): Promise<void> => {
  const id = topicNumber(topicId)
  const maxId = until === undefined ? undefined : messageNumber(until, "--until takes a message id")
  return feature.write("the topic may have been marked read — repeating it is safe", async () => {
    let readMaxId = maxId
    if (readMaxId === undefined) {
      const [found] = await feature.client.getForumTopicsById(Number(chatId), id)
      if (!found) throw new CliError("not_found", `no topic ${topicId} in that chat`)
      readMaxId = found.lastMessage.id
    }
    await feature.client.call({
      _: "messages.readDiscussion",
      peer: await feature.client.resolvePeer(Number(chatId)),
      msgId: id,
      readMaxId,
    })
  })
}
