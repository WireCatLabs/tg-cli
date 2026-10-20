import { environmentOf, outputFor, restartServers, upgradeCommand as sharedUpgradeCommand } from "@wirecat/cli-core/cli"
import { TG } from "../app.js"
import { installer, latest, PACKAGE, runUpdate, tgScript } from "../update.js"
import type { Environment } from "./context.js"

export const upgradeCommand = () =>
  sharedUpgradeCommand(TG, PACKAGE, (command) => {
    const context = environmentOf<Environment>(command)
    const environment = context.update ?? {}
    const env = context.env ?? process.env
    return {
      ...outputFor(command),
      installer: () => installer(environment),
      latest: () => latest(environment),
      install: (argv) => runUpdate(argv, environment),
      afterUpdate: () => restartServers(TG, tgScript(), env, environment.spawn),
    }
  })
