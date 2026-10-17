import { tmpdir } from "node:os"
import { basename, sep } from "node:path"
import { resolvePaths } from "@wirecat/cli-base"
import { storePath } from "@wirecat/cli-core/store"
import { describe, expect, it } from "vitest"

describe("the test sandbox", () => {
  it("keeps every directory a test can write inside the file's own sandbox", () => {
    const written = [
      ...Object.values(resolvePaths({ appName: "tg-cli", prefix: "TG" })),
      resolvePaths({ appName: "WireCat", prefix: "WIRECAT" }).state,
      storePath(),
    ]

    expect(basename(tmpdir())).toMatch(/^wirecat-test-/)
    for (const path of written) expect(path.startsWith(`${tmpdir()}${sep}`), path).toBe(true)
  })
})
