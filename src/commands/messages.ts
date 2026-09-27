import { CliError } from "@leemour/cli-core"
import { renderMessages } from "@leemour/cli-messaging"
import { newSendId } from "@leemour/cli-messaging/sends"
import { Command } from "commander"
import { forCommand } from "./context.js"

const CHAT = "a chat: its title or part of it, its id, @username, or `me` for Saved Messages"

export const messagesCommand = () => {
  const messages = new Command("messages").description("read and send messages")

  messages
    .command("list")
    .description("a chat's messages, oldest to newest")
    .argument("<chat>", CHAT)
    .option("--limit <n>", "how many", (value) => Number.parseInt(value, 10))
    .option("--before <id>", "only messages older than this message id")
    .action(async function (this: Command, chat: string) {
      const context = forCommand(this)
      const { before } = this.opts<{ before?: string }>()
      const { limit } = context.settings
      const page = await context.withTelegram((telegram) =>
        telegram.history(chat, { limit, ...(before === undefined ? {} : { before }) }),
      )
      if (context.format === "pretty") {
        // Straight to stdout: the pretty renderer keeps every string to one line, and a feed is many.
        context.streams.data(
          renderMessages(page.items, {
            color: context.color,
            verbosity: context.settings.detail,
            senderColors: context.settings.senderColors,
            profile: context.profile,
            provider: "telegram",
          }),
        )
        if (page.hasMore) context.renderer.note(`older messages: --before ${page.items[0]?.id}`)
        return
      }
      context.renderer.result({ items: page.items, limit, hasMore: page.hasMore })
    })

  messages
    .command("send")
    .description("send a text message; without [text], the text is read from stdin")
    .argument("<chat>", CHAT)
    .argument("[text]", "the message")
    .option("--send-id <id>", "repeat a send whose outcome was unknown, without risking a second copy")
    .action(async function (this: Command, chat: string, text: string | undefined) {
      const context = forCommand(this)
      const { sendId } = this.opts<{ sendId?: string }>()
      const body = text ?? (await readAll(context.stdin))
      if (body.trim() === "") throw new CliError("validation_error", "nothing to send — give [text] or pipe it in")
      const sent = await context.withTelegram(async (telegram) => {
        const { guard } = context
        const { id: chatId } = await telegram.resolve(chat)
        const attempt = { chatId, kind: "message" as const, sendId: sendId ?? newSendId(), length: body.length }
        try {
          guard.check(attempt)
        } catch (error) {
          guard.record({ ...attempt, outcome: "refused", errorCode: codeOf(error) })
          throw error
        }
        try {
          const done = await telegram.send(chatId, body, { sendId: attempt.sendId })
          guard.record({ ...attempt, outcome: "sent", messageId: done.message.id })
          return done
        } catch (error) {
          const code = codeOf(error)
          guard.record({
            ...attempt,
            outcome: code === "outcome_unknown" ? "outcome_unknown" : "failed",
            errorCode: code,
          })
          throw error
        }
      })
      context.renderer.result({ sendId: sent.sendId, message: sent.message })
    })

  return messages
}

const codeOf = (error: unknown): string =>
  typeof (error as { code?: unknown })?.code === "string" ? (error as { code: string }).code : "unknown"

const readAll = async (input: NodeJS.ReadableStream & { isTTY?: boolean }): Promise<string> => {
  if (input.isTTY) return ""
  const chunks: Buffer[] = []
  for await (const chunk of input) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks).toString("utf8")
}
