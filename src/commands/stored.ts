import type { EventSink } from "@leemour/cli-messaging/cli"
import type { AccountKey, MessageStore } from "@leemour/cli-messaging/store"
import type { Adapter } from "./context.js"

export interface Saving {
  account: AccountKey
  /** Opened on the first save, not before: a command that reads nothing has no reason to touch the file. */
  store: () => Promise<MessageStore | undefined>
  warn: (message: string) => void
  events: EventSink
}

/**
 * The adapter, with what each read answers written to the store. **A failed write never fails the
 * read** — the answer is already here, and it is what was asked for.
 *
 * `resolve` is not saved: a chat found by name has no unread count or last message, and writing it
 * would erase what `chats list` stored.
 */
export const stored = (telegram: Adapter, { account, store, warn, events }: Saving): Adapter => {
  let warned = false
  const save = async (operation: string, write: (store: MessageStore) => void): Promise<void> => {
    try {
      const opened = await store()
      if (opened) write(opened)
    } catch (error) {
      events({ event: "warning", code: "store_not_written", operation })
      if (!warned) warn(`not saved to the local store: ${error instanceof Error ? error.message : String(error)}`)
      warned = true
    }
  }

  return {
    self: () => telegram.self(),
    login: (prompts) => telegram.login(prompts),
    resolve: (reference) => telegram.resolve(reference),
    logout: () => telegram.logout(),
    close: () => telegram.close(),
    me: async () => {
      const me = await telegram.me()
      await save("account.me", (opened) => opened.saveAccount(account, { name: me.name }))
      return me
    },
    chats: async (window) => {
      const page = await telegram.chats(window)
      await save("chats.list", (opened) => opened.saveChats(account, page.items))
      return page
    },
    history: async (reference, options) => {
      const page = await telegram.history(reference, options)
      const chatId = page.items[0]?.chatId
      if (chatId !== undefined) {
        await save("messages.list", (opened) => opened.saveMessages(account, chatId, page.items, { via: "history" }))
      }
      return page
    },
    send: async (chatId, text, options) => {
      const sent = await telegram.send(chatId, text, options)
      await save("messages.send", (opened) => opened.saveMessages(account, chatId, [sent.message], { via: "send" }))
      return sent
    },
  }
}
