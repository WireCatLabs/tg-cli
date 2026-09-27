import { CliError } from "@leemour/cli-core"
import { RecipientList, recipientsPathFor } from "@leemour/cli-messaging/sends"
import { Command } from "commander"
import { TG } from "../app.js"
import { forCommand } from "./context.js"

const listFor = (profile: string, env: NodeJS.ProcessEnv) =>
  new RecipientList(recipientsPathFor(TG, profile, env), TG.command)

/**
 * The chats this profile may send to. Off until the first `add`; `off` turns it off again. It stops
 * a model that a message talked into writing somewhere, not an agent set on getting around it.
 */
export const recipientsCommand = (): Command => {
  const command = new Command("recipients").description("the chats this profile may send to, when the list is on")

  command
    .command("list")
    .description("the chats on the list; empty and off until the first add")
    .action(async function (this: Command) {
      const { settings, renderer, env } = forCommand(this)
      const chats = listFor(settings.profile, env).read()
      renderer.stream(chats ?? [])
      if (!chats) renderer.note("the recipient list is off — this profile may send to any chat")
      else if (chats.length === 0) renderer.note("the recipient list is on and empty — this profile may send nowhere")
    })

  command
    .command("add")
    .argument("<chat>", "a chat: its title or part of it, its id, @username, or `me`")
    .description("allow sending to this chat; the first add turns the list on")
    .action(async function (this: Command, chat: string) {
      const context = forCommand(this)
      const found = await context.withTelegram((telegram) => telegram.resolve(chat))
      const added = listFor(context.settings.profile, context.env).add({
        id: found.id,
        title: found.title,
        // In Telegram a one-to-one chat's id is the other person's id.
        ...(found.kind === "dialog" ? { partnerId: found.id } : {}),
        addedAt: new Date().toISOString(),
      })
      context.renderer.result({ id: found.id, title: found.title, added })
    })

  command
    .command("remove")
    .argument("<chat>", "chat id, or the title as the list shows it")
    .description("stop allowing this chat; the list stays on")
    .action(async function (this: Command, chat: string) {
      const { settings, renderer, env } = forCommand(this)
      const gone = listFor(settings.profile, env).remove(chat)
      if (!gone) throw new CliError("not_found", `${chat.trim()} is not on the recipient list of ${settings.profile}`)
      renderer.result({ id: gone.id, title: gone.title, removed: true })
    })

  command
    .command("off")
    .description("turn the list off: this profile may send to any chat again")
    .action(async function (this: Command) {
      const { settings, renderer, env } = forCommand(this)
      renderer.result({ off: true, wasOn: listFor(settings.profile, env).off() })
    })

  return command
}
