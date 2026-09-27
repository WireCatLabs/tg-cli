import { type EventSink, isCliFailure, providerErrorKey } from "@leemour/cli-messaging/cli"
import type { Adapter } from "./context.js"

type Named = { ids?: Record<string, string>; counts?: Record<string, number> }

/**
 * The adapter, with a request and a response event around each call. **Ids come from arguments
 * that already are ids, or from the answer — never from a typed chat**, which is often a title.
 */
export const observed = (telegram: Adapter, events: EventSink): Adapter => {
  const timed = async <T>(operation: string, named: Named, work: () => Promise<T>, after?: (answer: T) => Named) => {
    events({ event: "request", operation, ...named })
    const started = performance.now()
    const durationMs = () => Math.round(performance.now() - started)
    try {
      const answer = await work()
      events({ event: "response", operation, durationMs: durationMs(), outcome: "ok", ...after?.(answer) })
      return answer
    } catch (error) {
      const providerError = isCliFailure(error) ? providerErrorKey(error.details?.providerError) : undefined
      events({
        event: "response",
        operation,
        durationMs: durationMs(),
        outcome: "error",
        errorCode: isCliFailure(error) ? error.code : "generic_failure",
        ...(providerError ? { providerError } : {}),
      })
      throw error
    }
  }

  return {
    login: (prompts) => timed("session.login", {}, () => telegram.login(prompts)),
    me: () => timed("account.me", {}, () => telegram.me()),
    chats: (window) =>
      timed(
        "chats.list",
        {},
        () => telegram.chats(window),
        (page) => ({ counts: { chats: page.items.length } }),
      ),
    history: (reference, options) =>
      timed(
        "messages.list",
        {},
        () => telegram.history(reference, options),
        (page) => ({
          ...(page.items[0] ? { ids: { chat: page.items[0].chatId } } : {}),
          counts: { messages: page.items.length },
        }),
      ),
    resolve: (reference) =>
      timed(
        "chats.resolve",
        {},
        () => telegram.resolve(reference),
        (chat) => ({ ids: { chat: chat.id } }),
      ),
    send: (chatId, text, options) =>
      timed(
        "messages.send",
        { ids: { chat: chatId, send: options.sendId } },
        () => telegram.send(chatId, text, options),
        (sent) => ({ ids: { message: sent.message.id } }),
      ),
    logout: () => timed("session.logout", {}, () => telegram.logout()),
    close: () => telegram.close(),
  }
}
