import { readFileSync } from "node:fs"
import { applyOverrides, generate, manifestGenerator, type Override, validateModel } from "@leemour/cli-core/codegen"
import { describe, expect, it } from "vitest"
import { adaptBotApi, type BotApiSource } from "./source-adapter.js"

const source = JSON.parse(readFileSync(new URL("../../spec/bot/api.json", import.meta.url), "utf8")) as BotApiSource
const effects = JSON.parse(readFileSync(new URL("../../spec/bot/effects.json", import.meta.url), "utf8")) as Record<
  string,
  Override
>
const model = () => adaptBotApi(source, { sourceUrl: "upstream", sourceRevision: "pinned" })

describe("Telegram's Bot API source adapter", () => {
  it("accounts for every method and type, with complete explicit effects and no guessed schema", () => {
    const raw = model()
    expect(raw.operations).toHaveLength(185)
    expect(raw.schemas).toHaveLength(400)
    const prepared = applyOverrides(raw, effects)
    expect(() => validateModel(prepared)).not.toThrow()
    expect(prepared.operations.find((operation) => operation.id === "getUpdates")?.effect).toBe("destructive")
    const { getMe: _removed, ...incomplete } = effects
    expect(() => validateModel(applyOverrides(raw, incomplete))).toThrow(/not classified/)
    expect(() => applyOverrides(raw, { ...effects, unknown: { effect: "read", reason: "fixture" } })).toThrow(/stale/)
    const first = generate(raw, [manifestGenerator({ path: "manifest.ts" })], { overrides: effects, banner: [] })
    expect(generate(model(), [manifestGenerator({ path: "manifest.ts" })], { overrides: effects, banner: [] })).toEqual(
      first,
    )
  })

  it("represents recursive scalar/object unions, file metadata and secrets without exposing secret flags", () => {
    const raw = model()
    expect(raw.schemas.find((schema) => schema.id === "RichText")?.schema).toMatchObject({
      type: "union",
      of: expect.arrayContaining([{ type: "string" }, { type: "array", items: { type: "ref", ref: "RichText" } }]),
    })
    expect(raw.schemas.find((schema) => schema.id === "InputFile")?.schema).toEqual({
      type: "string",
      format: "binary",
    })
    expect(
      raw.operations
        .find((operation) => operation.id === "sendPhoto")
        ?.parameters.find((parameter) => parameter.name === "photo")?.schema,
    ).toMatchObject({ type: "union" })
    expect(
      raw.operations
        .find((operation) => operation.id === "setWebhook")
        ?.parameters.find((parameter) => parameter.name === "secret_token")?.sensitive,
    ).toBe(true)
    expect(raw.operations.find((operation) => operation.id === "getManagedBotToken")?.response?.schema?.sensitive).toBe(
      true,
    )
    expect(
      raw.operations.find((operation) => operation.id === "replaceManagedBotToken")?.response?.schema?.sensitive,
    ).toBe(true)
    const bad = structuredClone(source)
    bad.methods.getMe = { name: "getMe", description: [], returns: ["MissingType"] }
    expect(() => adaptBotApi(bad, { sourceUrl: "upstream", sourceRevision: "pinned" })).toThrow(/unknown Bot API type/)
  })
})
