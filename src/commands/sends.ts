import { SendJournal, sendsPathFor } from "@leemour/cli-messaging/sends"
import { Command } from "commander"
import { TG } from "../app.js"
import { forCommand } from "./context.js"

/** Every attempt to send from this profile, kept whatever `--record` says. Never the text. */
export const sendsCommand = (): Command =>
  new Command("sends").description("every attempt to send from this profile — never the text").addCommand(
    new Command("list")
      .description("attempts to send, newest first: sent, refused, failed, or not known")
      .option("--limit <n>", "how many to show", (value) => Number.parseInt(value, 10))
      .action(async function (this: Command) {
        const { settings, renderer, env } = forCommand(this)
        const entries = new SendJournal(sendsPathFor(TG, settings.profile, env)).entries().reverse()
        renderer.stream(entries.slice(0, settings.limit))
        if (entries.length === 0) renderer.note(`profile ${settings.profile} has not tried to send anything`)
      }),
  )
