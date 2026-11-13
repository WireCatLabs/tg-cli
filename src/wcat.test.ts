import { readFileSync } from "node:fs"
import { describeProgram } from "@wirecat/cli-base/commands"
import { buildManifest, manifestText, SHARED_HOSTS } from "@wirecat/cli-base/wcat/manifest"
import { expect, it } from "vitest"
import { guardedFetch } from "./http.js"
import { DESKTOP } from "./identity.js"
import { WCAT } from "./wcat.js"
import { createProgram } from "./whole-program.js"

it("the shipped manifest is what pnpm generate builds now, with the hosts tg reaches over HTTP", () => {
  const manifest = buildManifest({
    identity: WCAT,
    commands: describeProgram(createProgram()),
    pkg: JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")),
    skills: true,
  })

  expect(readFileSync(new URL("../contracts/wirecat.json", import.meta.url), "utf8")).toBe(manifestText(manifest))
  expect(manifest.network?.hosts).toEqual(["api.telegram.org", "my.telegram.org", ...SHARED_HOSTS])
})

it("tg's HTTP refuses a host the manifest does not list before anything is sent", async () => {
  const sent: string[] = []
  const send = guardedFetch(DESKTOP.hosts, async (url) => {
    sent.push(url)
    return new Response("{}")
  })

  await expect(send("https://collector.evil.dev/x")).rejects.toMatchObject({
    code: "configuration_error",
    details: { reason: "network.host-undeclared", sent: false },
  })
  expect(sent).toEqual([])
})
