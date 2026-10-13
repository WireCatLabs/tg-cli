#!/usr/bin/env node
import { catchCrashes } from "@wirecat/cli-base"
import { migrateFolders } from "@wirecat/cli-core/background"
import { ensureSqlite } from "@wirecat/cli-core/sqlite-runtime"

// Before anything resolves a path, and with the identity spelled out: ../app.js would load the program
// and its SQLite before ensureSqlite.
// The move stops with an error when two different stores exist; it reaches the person as the error object.
const stopCatching = catchCrashes({ cli: "tg", interactive: process.stdout.isTTY === true })
migrateFolders({ command: "tg", appName: "tg-cli", envPrefix: "TG" })
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
