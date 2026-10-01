import { describe, expect, it } from "vitest"
import { surfaceOf, unknownOptions } from "./doc-options.ts"

const surface = surfaceOf({
  commands: [
    { path: ["store"], subcommands: [{ path: ["store", "fetch"], options: [{ flags: "--last <n>" }] }] },
    { path: ["server", "status"], options: [] },
    { path: ["messages", "send"], options: [{ flags: "--md, --markdown" }] },
  ],
  globalOptions: [{ flags: "--json" }, { flags: "-v, --verbose" }],
})

const manifest = {
  "messages send": { options: { "--voice": { state: "planned", by: "P1" }, "--sticker": "max-only" } },
}

describe("options a page names", () => {
  it("refuses an option the command no longer has", () => {
    expect(unknownOptions("```sh\ntg store fetch Chat --max 5000\n```", surface, manifest)).toEqual([
      "tg store fetch --max",
    ])
  })

  it("allows the command's own options, both spellings, and the global ones", () => {
    expect(unknownOptions("`tg messages send me hi --markdown --json -v --verbose`", surface, manifest)).toEqual([])
  })

  it("allows an option the manifest plans for tg, not one only max has", () => {
    expect(unknownOptions("tg messages send me --voice a.ogg --sticker x", surface, manifest)).toEqual([
      "tg messages send --sticker",
    ])
  })

  it("reads past a profile word", () => {
    expect(unknownOptions("tg work store fetch Chat --max 1", surface, manifest)).toEqual(["tg store fetch --max"])
  })

  it("stops at the end of the line", () => {
    expect(unknownOptions("tg server status\nsystemctl --user enable it", surface, manifest)).toEqual([])
  })
})
