#!/usr/bin/env node
import { enableCompileCache } from "node:module"
import { errorObjectOf, exitCodeOfError, renderError } from "@wirecat/cli-base"

// Compiling about 1,700 module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
const [{ startCli }, { TG }] = await Promise.all([import("@wirecat/cli-core/cli/start"), import("../identity.js")])
await startCli({
  app: TG,
  sqlite: true,
  // A static import would load the whole program, and its SQLite, before ensureSqlite could swap it.
  run: async ({ args }) => (await import("../program.js")).run(args),
  fail: (error, { tty }) => {
    const object = errorObjectOf(error)
    process.stderr.write(`${renderError(object, { cli: TG.command, interactive: tty })}\n`)
    return exitCodeOfError(object)
  },
})

// A one-shot command exits (project rule 3). Once a download printed its answer and stayed alive for
// 30 minutes, --timeout or not, and it never happened again; if something is still open, name it and go.
const lingering = setTimeout(() => {
  if (process.stdout.writableLength > 0) {
    lingering.refresh()
    return
  }
  process.stderr.write(
    `tg: finished, but ${process.getActiveResourcesInfo().join(", ")} stayed open — exiting anyway\n`,
  )
  process.exit()
}, 5_000)
lingering.unref()
