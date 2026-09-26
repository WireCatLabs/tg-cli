import { homedir } from "node:os"
import { describe, expect, it } from "vitest"
import { isolated, pathsFor, profileFrom, sessionFile } from "../paths.js"

describe("the test sandbox", () => {
  const sandbox = process.env.TG_TEST_SANDBOX ?? ""

  it("puts config, state, cache, the session and the message store under a temporary directory", () => {
    const paths = pathsFor()
    for (const path of [
      paths.config,
      paths.state,
      paths.cache,
      sessionFile(profileFrom()),
      process.env.MESSAGING_STORE,
    ]) {
      expect(path?.startsWith(sandbox)).toBe(true)
      expect(path?.startsWith(homedir())).toBe(false)
    }
  })

  it("scopes the keyring entry away from the real one", () => {
    expect(isolated()).toBe(true)
  })
})
