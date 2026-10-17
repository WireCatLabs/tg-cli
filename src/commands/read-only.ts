import { CliError } from "@wirecat/cli-base"
import { environmentOf, readOnlyLockOf } from "@wirecat/cli-core/cli"
import type { Command } from "commander"
import { TG } from "../app.js"

/** `TG_READ_ONLY` for a write that never reaches cli-core's send guard (WC-PERM-12). */
export const refuseUnderReadOnly = (command: Command, what: string) => {
  const lock = readOnlyLockOf(TG, environmentOf(command).env ?? process.env)
  if (lock) throw new CliError("permission_error", `this process is read-only (${lock}) — it cannot ${what}`)
}

const STORE_WRITES = [["reset"], ["restore"], ["clear"], ["migrate"], ["decrypt"], ["repair"], ["copies", "delete"]]

export const lockedStore = (store: Command) => {
  for (const path of STORE_WRITES) {
    const leaf = path.reduce<Command | undefined>(
      (at, name) => at?.commands.find((command) => command.name() === name),
      store,
    )
    if (!leaf) throw new Error(`store ${path.join(" ")} is gone; update STORE_WRITES`)
    leaf.hook("preAction", (_self, action) => {
      if (action.optsWithGlobals().dryRun !== true) refuseUnderReadOnly(action, "change the message store")
    })
  }
  return store
}
