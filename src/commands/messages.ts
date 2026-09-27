import { CliError } from "@leemour/cli-core"
import { newSendId } from "@leemour/cli-messaging/sends"
import { Command } from "commander"
import { forCommand, TELEGRAM } from "./context.js"

/** `messages send`, added to the shared `messages` command. It moves to cli-messaging in PR 1.5. */
export const sendCommand = () =>
  new Command("send")
    .description("send a text message; without [text], the text is read from stdin")
    .argument("<chat>", TELEGRAM.chatArgument)
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

const codeOf = (error: unknown): string =>
  typeof (error as { code?: unknown })?.code === "string" ? (error as { code: string }).code : "unknown"

const readAll = async (input: NodeJS.ReadableStream & { isTTY?: boolean }): Promise<string> => {
  if (input.isTTY) return ""
  const chunks: Buffer[] = []
  for await (const chunk of input) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks).toString("utf8")
}
