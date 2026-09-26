import { Command } from "commander"
import { forCommand } from "./context.js"

export const accountCommand = () =>
  new Command("account").description("the logged-in account").addCommand(
    new Command("show").description("who this profile is logged in as").action(async function (this: Command) {
      const context = forCommand(this)
      context.renderer.result(await context.withTelegram((telegram) => telegram.me()))
    }),
  )
