import { Command } from "commander"
import { forCommand, positiveInteger } from "./context.js"

export const chatsCommand = () =>
  new Command("chats").description("the account's chats").addCommand(
    new Command("list")
      .description("chats, newest first, archived ones included")
      .option("--limit <n>", "how many", positiveInteger("--limit"), 20)
      .action(async function (this: Command) {
        const context = forCommand(this)
        const { limit } = this.opts<{ limit: number }>()
        const page = await context.withTelegram((telegram) => telegram.chats({ limit }))
        if (context.format !== "pretty") {
          context.renderer.result({ items: page.items, page: 1, limit, hasMore: page.hasMore })
          return
        }
        context.renderer.result(
          page.items.map(({ id, title, kind, unreadCount, lastMessageAt }) => ({
            id,
            title,
            kind,
            unreadCount,
            lastMessageAt,
          })),
        )
        if (page.hasMore) context.renderer.note(`more chats — raise --limit`)
      }),
  )
