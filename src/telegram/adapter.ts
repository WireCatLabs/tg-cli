import { chmodSync, existsSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { format } from "node:util"
import { TelegramClient } from "@mtcute/node"
import type {
  AccountSession,
  AdminRight,
  Chat,
  ChatCard,
  ChatEvents,
  CheckWords,
  CounterField,
  Discussion,
  Folder,
  FolderChange,
  FolderRules,
  GroupCard,
  GroupChange,
  GroupMember,
  InviteLinkChange,
  LinkTarget,
  Markup,
  Member,
  Message,
  MessageEvent,
  MessageHit,
  OfficialChatStats,
  Page,
  PersonCard,
  PhoneBookEntry,
  Poll,
  ProfileFacts,
  SenderIdentity,
  TextSpan,
  Topic,
  TopicChange,
} from "@wirecat/cli-core"
import { bareCheck } from "@wirecat/cli-core"
import type {
  After,
  Download,
  ForumState,
  MessengerAdapter,
  NewPoll,
  SendOptions,
  ServerQuery,
  Transcript,
} from "@wirecat/cli-core/cli"
import type { ProxyServer } from "../proxy.js"
import * as account from "./account.js"
import * as bots from "./bots.js"
import * as chatList from "./chat-list.js"
import * as chats from "./chats.js"
import { commentsOf, discussionOf } from "./comments.js"
import * as contacts from "./contacts.js"
import type { ApiCredentials } from "./credentials.js"
import { backgroundError, toCliError } from "./errors.js"
import {
  type Check,
  type Feature,
  messageNumber,
  type Sent,
  type Unanswered,
  unansweredText,
  unknownIfUnanswered,
} from "./feature.js"
import * as folders from "./folders.js"
import { formatHtml } from "./format-html.js"
import { formatMarkdown } from "./format-markdown.js"
import * as groups from "./groups.js"
import * as login from "./login.js"
import { type Account, toMessage } from "./map.js"
import * as messages from "./messages.js"
import * as polls from "./polls.js"
import { proxiedTransport } from "./proxy-transport.js"
import { savedSenderOf, sendAsIdentities } from "./send-as.js"
import { middlewaresOf, sending } from "./sending.js"
import * as stats from "./stats.js"
import { openSessionStorage } from "./storage.js"
import * as topics from "./topics.js"
import * as watching from "./watch.js"

export type { Check, Sent } from "./feature.js"
export { ADMIN_RIGHTS, GROUP_SETTINGS } from "./groups.js"
export type { LoginPrompts } from "./login.js"
export { TRANSCRIBE_POLL_MS } from "./messages.js"
export { HEARTBEAT_TICKS, LOOP_CHECK_MS, STATE_WAIT_MS } from "./watch.js"

export interface AdapterOptions {
  credentials: ApiCredentials
  sessionPath: string
  /** Where the library's own log lines go, when asked for. Never stdout. */
  diagnostic?: (line: string) => void
  verbose?: boolean
  /** Receive updates — only `watch` and `serve` ask. */
  listen?: boolean
  /** Fetch what arrived while nothing listened — `serve` only; a watch starts from now. */
  catchUp?: boolean
  /** How to log in on this profile, for the error a dropped session gives. */
  login?: string
  /** How a command is named where an unknown outcome sends a person to check. */
  checks?: CheckWords<Check>
  proxy?: ProxyServer
  /** Where a wait mtcute sits out is said — a warning, so `--quiet` drops it. The diagnostic stream if not given. */
  note?: (message: string) => void
}

/**
 * One Telegram account over one connection, speaking only the domain model above this line. Every
 * command closes it in a `finally`: an open socket keeps Node alive, and a piped command that prints
 * and never returns is a defect.
 */
export class TelegramAdapter {
  async formatMarkdown(text: string) {
    return formatMarkdown(text)
  }

  async formatHtml(text: string) {
    return formatHtml(text)
  }

  readonly #client: TelegramClient
  readonly #sessionPath: string
  readonly #feature: Feature
  readonly #proxyFailed: Promise<never> | undefined
  readonly #walking: chats.Walking = {}

  /** Async because the runtime's SQLite module is imported on demand (cli-core `openCache`). */
  static async open(options: AdapterOptions): Promise<TelegramAdapter> {
    mkdirSync(dirname(options.sessionPath), { recursive: true, mode: 0o700 })
    const adapter = new TelegramAdapter(options, await openSessionStorage(options.sessionPath))
    // Loads the logged-in user from the session before anything else. mtcute does it on the first
    // request, but sendText reads that user before making one — measured 2026-09-27: "User info is
    // not cached yet" on the first send to Saved Messages.
    try {
      await adapter.#client.prepare()
    } catch (error) {
      await adapter.close().catch(() => {})
      throw error
    }
    return adapter
  }

  private constructor(
    {
      credentials,
      sessionPath,
      diagnostic,
      verbose = false,
      listen = false,
      catchUp = false,
      login,
      proxy,
      note,
      checks = bareCheck,
    }: AdapterOptions,
    storage: Awaited<ReturnType<typeof openSessionStorage>>,
  ) {
    this.#sessionPath = sessionPath
    const proxied = proxy ? proxiedTransport(proxy) : undefined
    // watch and serve outlive a proxy that is down for a moment; mtcute's own retries suit them.
    this.#proxyFailed = listen ? undefined : proxied?.failed
    // mtcute's default handler writes with console.log, which is stdout — where only data may go.
    const write = diagnostic ?? ((line: string) => process.stderr.write(`${line}\n`))
    const say = note ?? write
    this.#client = new TelegramClient({
      ...(proxied ? { transport: proxied.transport } : {}),
      apiId: credentials.id,
      apiHash: credentials.hash,
      storage,
      // The storage manager has an exit hook of its own; the close is the command's (storage.ts `setup`).
      storageOptions: { cleanup: false },
      disableUpdates: !listen,
      ...(listen ? { updates: { catchUp } } : {}),
      logLevel: verbose ? 3 : 1,
      network: { middlewares: middlewaresOf(listen ? FLOOD_SLEEP.listening : FLOOD_SLEEP.oneShot, say) },
    })
    this.#client.log.mgr.handler = (_color, _level, tag, fmt, args) => write(`[${tag}] ${format(fmt, ...args)}`)
    this.#client.onError.add(backgroundError(write, verbose, checks))
    const unanswered = (error: unknown, what: string | Unanswered, details?: Record<string, unknown>) =>
      unknownIfUnanswered(error, typeof what === "string" ? what : unansweredText(what, checks), details)
    this.#feature = {
      client: this.#client,
      login,
      checks,
      self: () => this.self(),
      inputOf: (reference) => chats.inputOf(this.#client, reference),
      call: (work) => this.#call(work),
      send: (work) => this.#call(() => sending(work)),
      write: (what, work) =>
        this.#call(async () => {
          try {
            return await work()
          } catch (error) {
            throw unanswered(error, what)
          }
        }),
      unanswered,
    }
  }

  login(prompts: login.LoginPrompts): Promise<Account> {
    return login.login(this.#feature, prompts)
  }

  /** The logged-in user's id from the session, without a request; `null` before a login. */
  self(): string | null {
    const cached = this.#client.storage.self.getCached(true)
    return cached ? String(cached.userId) : null
  }

  me(): Promise<Account> {
    return account.me(this.#feature)
  }

  health() {
    return account.health(this.#feature)
  }

  updateProfile(change: Parameters<NonNullable<MessengerAdapter["updateProfile"]>>[0]): Promise<Account> {
    return account.updateProfile(this.#feature, change)
  }

  chats(window: { limit?: number; offset: number }): Promise<Page<Chat>> {
    return chats.chats(this.#feature, this.#walking, window)
  }

  chat(reference: string): Promise<ChatCard> {
    return chats.chat(this.#feature, reference)
  }

  resolve(reference: string): Promise<Chat> {
    return chats.resolve(this.#feature, reference)
  }

  discussionOf(channelId: string, postId: string): Promise<Discussion> {
    const post = messageNumber(postId, "a post id is a number")
    return this.#call(() => discussionOf(this.#client, Number(channelId), post))
  }

  comments(channelId: string, postId: string, { limit, before }: { limit: number; before?: string }) {
    const post = messageNumber(postId, "a post id is a number")
    const offset = before === undefined ? undefined : messageNumber(before, "`id<` takes a comment id")
    return this.#call(async (): Promise<Page<Message>> => {
      const page = await commentsOf(this.#client, Number(channelId), post, {
        limit,
        ...(offset === undefined ? {} : { before: offset }),
      })
      return { items: page.items.map(toMessage), hasMore: page.hasMore }
    })
  }

  history(reference: string, window: { limit: number; before?: string }): Promise<Page<Message>> {
    return messages.history(this.#feature, reference, window)
  }

  historyAfter(reference: string, window: { limit: number; after: After }): Promise<Page<Message>> {
    return messages.historyAfter(this.#feature, reference, window)
  }

  historyFrom(reference: string, person: string, window: { limit: number }): Promise<Page<Message>> {
    return messages.historyFrom(this.#feature, reference, person, window)
  }

  historyBefore(reference: string, window: { limit: number; time: number }): Promise<Page<Message>> {
    return messages.historyBefore(this.#feature, reference, window)
  }

  searchMessages(
    query: ServerQuery,
    options: { limit: number; signal?: AbortSignal },
  ): Promise<Page<MessageHit> & { chats: Chat[] }> {
    return messages.searchMessages(this.#feature, query, options)
  }

  around(reference: string, messageId: string, window: { before: number; after: number }) {
    return messages.around(this.#feature, reference, messageId, window)
  }

  fetchCounters(reference: string, messageId: string, fields: readonly CounterField[], signal?: AbortSignal) {
    return messages.fetchCounters(this.#feature, reference, messageId, fields, signal)
  }

  permalink(chatId: string, messageId: string) {
    return messages.permalink(this.#feature, chatId, messageId)
  }

  scheduled(reference: string): Promise<Message[]> {
    return messages.scheduled(this.#feature, reference)
  }

  send(chatId: string, text: string, options: SendOptions): Promise<Sent> {
    return messages.send(this.#feature, chatId, text, options)
  }

  saveDraft(
    chatId: string,
    text: string,
    options: Pick<SendOptions, "replyTo" | "threadId" | "formatting" | "noPreview">,
  ) {
    return messages.saveDraft(this.#feature, chatId, text, options)
  }

  edit(chatId: string, messageId: string, text: string, spans?: { markup?: Markup[]; formatting?: TextSpan[] }) {
    return messages.edit(this.#feature, chatId, messageId, text, spans)
  }

  forward(
    fromChatId: string,
    messageId: string,
    toChatId: string,
    options: { sendId: string; silent?: boolean; sendAs?: string; threadId?: string },
  ): Promise<Message> {
    return messages.forward(this.#feature, fromChatId, messageId, toChatId, options)
  }

  pin(chatId: string, messageId: string, options: { notify: boolean }): Promise<void> {
    return messages.pin(this.#feature, chatId, messageId, options)
  }

  unpin(chatId: string, messageId: string): Promise<void> {
    return messages.unpin(this.#feature, chatId, messageId)
  }

  react(chatId: string, messageId: string, emoji: string | null): Promise<void> {
    return messages.react(this.#feature, chatId, messageId, emoji)
  }

  markRead(chatId: string, until?: string): Promise<void> {
    return messages.markRead(this.#feature, chatId, until)
  }

  reactors(chatId: string, messageId: string, window: { limit: number; emoji?: string; cursor?: string }) {
    return messages.reactors(this.#feature, chatId, messageId, window)
  }

  delete(chatId: string, messageIds: string[], options: { forEveryone: boolean }): Promise<void> {
    return messages.deleteMessages(this.#feature, chatId, messageIds, options)
  }

  download(reference: string, messageId: string): Promise<Download> {
    return messages.download(this.#feature, reference, messageId)
  }

  transcribe(reference: string, messageId: string): Promise<Transcript> {
    return messages.transcribe(this.#feature, reference, messageId)
  }

  poll(chatId: string, messageId: string): Promise<Poll> {
    return polls.poll(this.#feature, chatId, messageId)
  }

  pollVoters(chatId: string, messageId: string, window: { limit: number; answerId?: string }) {
    return polls.pollVoters(this.#feature, chatId, messageId, window)
  }

  vote(chatId: string, messageId: string, answerIds: string[]): Promise<Poll> {
    return polls.vote(this.#feature, chatId, messageId, answerIds)
  }

  closePoll(chatId: string, messageId: string): Promise<Poll> {
    return polls.closePoll(this.#feature, chatId, messageId)
  }

  createPoll(
    chatId: string,
    poll: NewPoll,
    options: { sendId: string; silent?: boolean; threadId?: string; sendAs?: string },
  ): Promise<Sent> {
    return polls.createPoll(this.#feature, chatId, poll, options)
  }

  buttons = (chatId: string, messageId: string) => bots.buttons(this.#feature, chatId, messageId)
  pressButton = (chatId: string, messageId: string, row: number, column: number) =>
    bots.pressButton(this.#feature, chatId, messageId, row, column)
  botByLink = (reference: string) => bots.botByLink(this.#feature, reference)
  startBot = (chatId: string, options: { sendId: string; payload?: string }) =>
    bots.startBot(this.#feature, chatId, options)
  botApp = (chatId: string, options: { startParam?: string }) => bots.botApp(this.#feature, chatId, options)

  officialChatStats(reference: string): Promise<OfficialChatStats> {
    return stats.officialChatStats(this.#feature, reference)
  }

  topicHistory(
    reference: string,
    threadId: string,
    window: { limit: number; before?: string },
  ): Promise<Page<Message>> {
    return topics.topicHistory(this.#feature, reference, threadId, window)
  }

  photos(person: string): Promise<{ count: number; oldestAt: string | null }> {
    return contacts.photos(this.#feature, person)
  }

  contact(reference: string): Promise<PersonCard> {
    return contacts.contact(this.#feature, reference)
  }

  profile(reference: string): Promise<ProfileFacts> {
    return contacts.profile(this.#feature, reference)
  }

  sendAsIdentities(chatId: string): Promise<SenderIdentity[]> {
    return this.#call(() => sendAsIdentities(this.#client, chatId))
  }

  savedSender(chatId: string): Promise<string | null> {
    return this.#call(() => savedSenderOf(this.#client, chatId, this.self()))
  }

  watch(onEvent: (event: MessageEvent) => void, signal: AbortSignal, onReady?: () => void): Promise<void> {
    return watching.watch(this.#feature, onEvent, signal, onReady)
  }

  logout(): Promise<void> {
    return login.logout(this.#feature)
  }

  async close(): Promise<void> {
    await this.#client.destroy()
    for (const suffix of ["", "-wal", "-shm"]) {
      const path = `${this.#sessionPath}${suffix}`
      if (existsSync(path)) chmodSync(path, 0o600)
    }
  }

  markTopicRead(chatId: string, topicId: string, until?: string): Promise<void> {
    return topics.markTopicRead(this.#feature, chatId, topicId, until)
  }

  inspect(link: string): Promise<LinkTarget> {
    return groups.inspect(this.#feature, link)
  }

  forumState(chatId: string): Promise<ForumState> {
    return topics.forumState(this.#feature, chatId)
  }

  upgradeForum(chatId: string): Promise<ForumState> {
    return topics.upgradeForum(this.#feature, chatId)
  }

  enableForum(chatId: string): Promise<ForumState> {
    return topics.enableForum(this.#feature, chatId)
  }

  createTopic(chatId: string, title: string, options: { sendId: string; icon?: string }): Promise<Topic> {
    return topics.createTopic(this.#feature, chatId, title, options)
  }

  topicIcons(): Promise<string[]> {
    return topics.topicIcons(this.#feature)
  }

  // The icon is in cli-core's TopicChange from the release after 0.527.0; the intersection lets this build before it.
  editTopic(chatId: string, topicId: string, change: TopicChange & { icon?: string | null }): Promise<Topic> {
    return topics.editTopic(this.#feature, chatId, topicId, change)
  }

  orderPinnedTopics(chatId: string, topicIds: string[]): Promise<void> {
    return topics.orderPinnedTopics(this.#feature, chatId, topicIds)
  }

  deleteTopic(chatId: string, topicId: string): Promise<void> {
    return topics.deleteTopic(this.#feature, chatId, topicId)
  }

  validateThread(chatId: string, threadId: string, options: { replyTo?: string }): Promise<void> {
    return topics.validateThread(this.#feature, chatId, threadId, options)
  }

  topic(reference: string, topicId: string): Promise<Topic> {
    return topics.topic(this.#feature, reference, topicId)
  }

  topics(reference: string, window: { search?: string; limit?: number; offset: number }): Promise<Page<Topic>> {
    return topics.topics(this.#feature, reference, window)
  }

  lookup(phone: string): Promise<Member> {
    return contacts.lookup(this.#feature, phone)
  }

  addressBook(): Promise<Member[]> {
    return contacts.addressBook(this.#feature)
  }

  sessions(): Promise<AccountSession[]> {
    return login.sessions(this.#feature)
  }

  members(
    reference: string,
    window: { limit?: number; offset: number },
  ): Promise<Page<GroupMember> & { chatId: string; participantsCount: number | null }> {
    return groups.members(this.#feature, reference, window)
  }

  chatEvents(reference: string, window: { since: number }): Promise<ChatEvents> {
    return groups.chatEvents(this.#feature, reference, window)
  }

  admins(reference: string): Promise<string[] | null> {
    return groups.admins(this.#feature, reference)
  }

  people(references: string[]): Promise<string[]> {
    return groups.people(this.#feature, references)
  }

  createGroup(title: string, people: string[], options: { channel: boolean }): Promise<GroupCard> {
    return groups.createGroup(this.#feature, title, people, options)
  }

  join(link: string): Promise<GroupCard | { requested: true }> {
    return groups.join(this.#feature, link)
  }

  leave(reference: string): Promise<{ chatId: string }> {
    return groups.leave(this.#feature, reference)
  }

  group(reference: string): Promise<GroupCard> {
    return groups.group(this.#feature, reference)
  }

  updateGroup(chatId: string, change: GroupChange): Promise<GroupCard> {
    return groups.updateGroup(this.#feature, chatId, change)
  }

  resetInviteLink(chatId: string): Promise<GroupCard> {
    return groups.resetInviteLink(this.#feature, chatId)
  }

  createInviteLink(chatId: string, options: { approval: boolean; expiresAt?: string; maxUses?: number }) {
    return groups.createInviteLink(this.#feature, chatId, options)
  }

  joinRequests(chatId: string, options: { limit: number; link?: string; search?: string }) {
    return groups.joinRequests(this.#feature, chatId, options)
  }

  answerAllJoinRequests(chatId: string, accept: boolean, link?: string) {
    return groups.answerAllJoinRequests(this.#feature, chatId, accept, link)
  }

  inviteLinks(chatId: string, options: { limit: number; revoked: boolean }) {
    return groups.inviteLinks(this.#feature, chatId, options)
  }

  revokeInviteLink(chatId: string, link: string) {
    return groups.revokeInviteLink(this.#feature, chatId, link)
  }

  updateInviteLink(chatId: string, link: string, change: InviteLinkChange) {
    return groups.updateInviteLink(this.#feature, chatId, link, change)
  }

  answerJoinRequest(chatId: string, personId: string, accept: boolean) {
    return groups.answerJoinRequest(this.#feature, chatId, personId, accept)
  }

  addMembers(chatId: string, people: string[], options: { history?: boolean }): Promise<{ notAdded: string[] }> {
    return groups.addMembers(this.#feature, chatId, people, options)
  }

  removeMembers(chatId: string, people: string[]): Promise<void> {
    return groups.removeMembers(this.#feature, chatId, people)
  }

  addAdmin(chatId: string, person: string, rights: AdminRight[]): Promise<void> {
    return groups.addAdmin(this.#feature, chatId, person, rights)
  }

  removeAdmin(chatId: string, person: string): Promise<void> {
    return groups.removeAdmin(this.#feature, chatId, person)
  }

  folders(): Promise<Folder[]> {
    return folders.folders(this.#feature)
  }

  createFolder(title: string, chatIds: string[], rules?: FolderRules): Promise<Folder> {
    return folders.createFolder(this.#feature, title, chatIds, rules)
  }

  updateFolder(folderId: string, change: FolderChange): Promise<Folder> {
    return folders.updateFolder(this.#feature, folderId, change)
  }

  deleteFolder(folderId: string): Promise<void> {
    return folders.deleteFolder(this.#feature, folderId)
  }

  orderFolders(folderIds: string[]): Promise<void> {
    return folders.orderFolders(this.#feature, folderIds)
  }

  joinFolder(link: string): Promise<Folder> {
    return folders.joinFolder(this.#feature, link)
  }

  addContact(personId: string): Promise<Member> {
    return contacts.addContact(this.#feature, personId)
  }

  removeContact(personId: string): Promise<void> {
    return contacts.removeContact(this.#feature, personId)
  }

  block(personId: string): Promise<void> {
    return contacts.block(this.#feature, personId)
  }

  unblock(personId: string): Promise<void> {
    return contacts.unblock(this.#feature, personId)
  }

  renameContact(personId: string, firstName: string, lastName?: string): Promise<Member> {
    return contacts.renameContact(this.#feature, personId, firstName, lastName)
  }

  importContacts(entries: PhoneBookEntry[]): Promise<Member[]> {
    return contacts.importContacts(this.#feature, entries)
  }

  mute = (chatId: string, until: string | null): Promise<void> => chatList.mute(this.#feature, chatId, until)
  archiveChat = (chatId: string, archived: boolean): Promise<void> =>
    chatList.archiveChat(this.#feature, chatId, archived)
  pinChat = (chatId: string, pinned: boolean): Promise<void> => chatList.pinChat(this.#feature, chatId, pinned)
  markChatUnread = (chatId: string): Promise<void> => chatList.markChatUnread(this.#feature, chatId)

  endOtherSessions(): Promise<AccountSession[]> {
    return login.endOtherSessions(this.#feature)
  }

  async #call<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await (this.#proxyFailed ? Promise.race([work(), this.#proxyFailed]) : work())
    } catch (error) {
      throw toCliError(error, this.#feature.checks, this.#feature.login)
    }
  }
}

/**
 * How long mtcute sits out a FLOOD_WAIT before the wait becomes `rate_limited` with `retryAfterMs`, and
 * how many times. One-shot: 10 s, mtcute's own default, which covers the routine short waits; past it a
 * person or a script is better told the wait than held, and twice at most keeps a command under ~20 s
 * of announced waiting. Listening (`watch`, `serve`): nobody is waiting on a request, and giving up
 * costs a restart and a new connection — 120 s, tlgr's threshold. `messages sync` keeps the one-shot
 * value: cli-core's `patiently` sits out up to 5 min above it, and says so.
 */
export const FLOOD_SLEEP = {
  oneShot: { maxWait: 10_000, maxRetries: 2 },
  listening: { maxWait: 120_000, maxRetries: 3 },
}
