#!/usr/bin/env node
import { enableCompileCache } from "node:module"
import { catchCrashes } from "@wirecat/cli-base"
import { ensureSqlite } from "@wirecat/cli-core/sqlite-runtime"

// Compiling about 1,700 module files is most of a start; later runs reuse what this one compiled.
enableCompileCache()
const stopCatching = catchCrashes({ cli: "tg", interactive: process.stdout.isTTY === true })
await ensureSqlite()
stopCatching()
// A static import would load the whole program, and its SQLite, before ensureSqlite could swap it.
const { run } = await import("../program.js")
process.exitCode = await run(process.argv.slice(2))

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
