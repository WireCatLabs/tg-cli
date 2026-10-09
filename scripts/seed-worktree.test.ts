import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const script = fileURLToPath(new URL("./seed-worktree.ts", import.meta.url))

describe("seed-worktree --remove", () => {
  it("refuses two paths, so the main checkout's app keys are never the ones removed", () => {
    const run = spawnSync(process.execPath, [script, "/nowhere/main", "/nowhere/worktree", "--remove"], {
      encoding: "utf8",
    })

    expect(run.status).toBe(2)
    expect(run.stderr).toContain("--remove takes the worktree alone")
  })
})
