import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { VERSION } from "./version.js"

describe("the version", () => {
  it("is the one package.json publishes, so tg --version never lies", () => {
    const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      version: string
    }
    expect(VERSION).toBe(version)
  })
})
