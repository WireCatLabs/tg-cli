import { renderPage, window, withPaging } from "@leemour/cli-messaging/cli"
import { Command } from "commander"
import { forCommand } from "./context.js"

export const chatsCommand = () =>
  new Command("chats").description("the account's chats").addCommand(
    withPaging(new Command("list").description("chats, newest first, archived ones included")).action(async function (
      this: Command,
    ) {
      const context = forCommand(this)
      const page = await context.withTelegram((telegram) => telegram.chats(window(context.settings)))
      renderPage(context, {
        ...page,
        items:
          context.format === "pretty"
            ? page.items.map(({ id, title, kind, unreadCount, lastMessageAt }) => ({
                id,
                title,
                kind,
                unreadCount,
                lastMessageAt,
              }))
            : page.items,
      })
    }),
  )
