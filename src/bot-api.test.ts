import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-core"
import type { SchemaNode } from "@wirecat/cli-core/codegen"
import { identifier } from "@wirecat/cli-core/codegen"
import { apiFlagOf, apiJson, BotTokenStore, ChatRegistry } from "@wirecat/cli-messaging/cli"
import { beforeEach, describe, expect, it } from "vitest"
import { TG } from "./app.js"
import { definitions } from "./bot/generated/definitions.js"
import { operations } from "./bot/generated/manifest.js"
import type { FetchLike } from "./bot/transport.js"
import { run } from "./program.js"

const token = "123:synthetic_fixture_for_tests_only"
const managed = "456:synthetic_fixture_for_tests_only"
let keyring: ReturnType<typeof memoryKeyring>
let requests: { method: string; body: RequestInit["body"] }[]
let response: (method: string) => Response
const fetchApi: FetchLike = async (url, init) => {
  const method = url.split("/").at(-1) ?? ""
  requests.push({ method, body: init.body })
  return response(method)
}
const ok = (result: unknown) => new Response(JSON.stringify({ ok: true, result }))
const invoke = async (args: string[]) => {
  const streams = captureStreams()
  const code = await run(["api-test", "bot", "api", ...args, "--json"], {
    keyring,
    streams,
    tty: false,
    botFetch: fetchApi,
  })
  return { code, out: streams.stdout.join(""), err: streams.stderr.join("") }
}
beforeEach(() => {
  keyring = memoryKeyring()
  new BotTokenStore({ app: TG, profile: "api-test", keyring }).writeKeyring(token)
  requests = []
  response = () => ok(true)
})

describe("the generated Telegram Bot API", () => {
  it("prints the native result and preserves integer digits in request and response", async () => {
    response = () => new Response('{"ok":true,"result":{"id":9007199254740993}}')
    const result = await invoke(["get-chat", "--chat-id", "9007199254740993"])
    expect(result.code).toBe(0)
    expect(JSON.parse(result.out)).toEqual({ id: "9007199254740993" })
    expect(requests[0]?.body).toBe('{"chat_id":9007199254740993}')
  })

  it("validates fields and refuses offline calls and destructive operations without contacting Telegram", async () => {
    expect((await invoke(["get-chat-member", "--chat-id", "123", "--user-id", "{}"])).code).toBe(2)
    expect((await invoke(["get-me", "--offline"])).code).toBe(2)
    expect((await invoke(["get-updates"])).code).toBe(7)
    expect((await invoke(["send-gift", "--gift-id", "synthetic", "--user-id", "456"])).code).toBe(7)
    expect(requests).toEqual([])
  })

  it("uploads multiple schema-declared files, including nested media, without interpreting caption text", async () => {
    const root = mkdtempSync(join(tmpdir(), "api-files-"))
    const one = join(root, "one.png")
    const two = join(root, "two.png")
    writeFileSync(one, "one")
    writeFileSync(two, "two")
    const result = await invoke([
      "send-media-group",
      "--chat-id",
      "123",
      "--media",
      JSON.stringify([
        { type: "photo", media: `@${one}`, caption: "@literal" },
        { type: "photo", media: `@${two}` },
      ]),
    ])
    expect(result.code).toBe(0)
    const form = requests[0]?.body
    expect(form).toBeInstanceOf(FormData)
    if (!(form instanceof FormData)) throw new Error("expected multipart")
    const parts = [...form.entries()]
    expect(parts.filter(([, value]) => typeof value !== "string")).toHaveLength(2)
    expect(form.get("media")).toContain('"caption":"@literal"')
    expect(form.get("media")).toContain("attach://_api_file_0")
  })

  it("never retries unanswered writes and redacts submitted credentials from provider errors", async () => {
    response = () => {
      throw new Error("private transport text")
    }
    const uncertain = await invoke(["send-message", "--chat-id", "123", "--text", "synthetic"])
    expect(uncertain.code).not.toBe(0)
    expect(uncertain.err).toContain("outcome_unknown")
    expect(requests).toHaveLength(1)
    const root = mkdtempSync(join(tmpdir(), "api-secret-"))
    const body = join(root, "body.json")
    writeFileSync(body, JSON.stringify({ url: "https://example.invalid", secret_token: "synthetic-secret" }), {
      mode: 0o600,
    })
    response = () =>
      new Response(JSON.stringify({ ok: false, description: `invalid synthetic-secret ${token}` }), { status: 400 })
    const refused = await invoke(["set-webhook", "--body-file", body])
    expect(refused.err).not.toContain("synthetic-secret")
    expect(refused.err).not.toContain(token)
  })

  it("stores a returned credential in the explicit keyring destination and prints only its receipt", async () => {
    response = (method) =>
      method === "getManagedBotToken" ? ok(managed) : ok({ id: 456, is_bot: true, first_name: "Synthetic" })
    const result = await invoke(["get-managed-bot-token", "--user-id", "456", "--store-token", "api-managed-new"])
    expect(result.code).toBe(0)
    expect(JSON.parse(result.out)).toEqual({ profile: "api-managed-new", id: "456", stored: "keyring" })
    expect(result.out + result.err).not.toContain(managed)
    expect(new BotTokenStore({ app: TG, profile: "api-managed-new", keyring }).readKeyring()).toBe(managed)
  })

  it("refuses missing destinations and identity mismatches before a credential-returning request", async () => {
    expect((await invoke(["get-managed-bot-token", "--user-id", "456"])).code).toBe(2)
    new ChatRegistry(TG, "api-managed-wrong").rememberBot("789")
    const mismatch = await invoke([
      "replace-managed-bot-token",
      "--user-id",
      "456",
      "--store-token",
      "api-managed-wrong",
    ])
    expect(mismatch.code).toBe(4)
    expect(requests).toEqual([])
  })
})

const fixtureFile = join(mkdtempSync(join(tmpdir(), "api-contract-")), "fixture.bin")
writeFileSync(fixtureFile, "synthetic")
const fixtureValue = (node: SchemaNode, depth = 0): unknown => {
  if (depth > 30) throw new Error("nonproductive request recursion")
  switch (node.type) {
    case "ref": {
      const schema = definitions[identifier(node.ref)]
      if (!schema) throw new Error("missing request schema")
      return fixtureValue(schema, depth + 1)
    }
    case "union": {
      const first = node.of[0]
      if (!first) throw new Error("empty request union")
      return fixtureValue(first, depth + 1)
    }
    case "object":
      return Object.fromEntries(
        node.required.map((name) => {
          const schema = node.properties[name]
          if (!schema) throw new Error("missing required property")
          return [name, fixtureValue(schema, depth + 1)]
        }),
      )
    case "array":
      return [fixtureValue(node.items, depth + 1)]
    case "string":
      return node.format === "binary" ? `@${fixtureFile}` : (node.enum?.[0] ?? "synthetic")
    case "integer":
      return node.enum?.[0] ?? node.minimum ?? 1
    case "number":
      return node.minimum ?? 1
    case "boolean":
      return node.enum?.[0] ?? true
    default:
      throw new Error("unexpected Bot API request schema")
  }
}

describe("every generated native Telegram operation", () => {
  it.each(operations)(
    "executes $id against the synthetic transport with its declared field flags",
    async (operation) => {
      const streams = captureStreams()
      if (operation.effect === "destructive") {
        expect(
          await run(
            ["api-test", "config", "set", "--bot", `permissions.bot.api.${operation.command}`, "allow", "--json"],
            { keyring, streams, tty: false },
          ),
        ).toBe(0)
      }
      const flags: string[] = []
      const protectedFields: Record<string, unknown> = {}
      const fullBody: Record<string, unknown> = {}
      for (const parameter of operation.parameters) {
        const value = fixtureValue(parameter.schema)
        fullBody[parameter.name] = value
        if (parameter.sensitive) protectedFields[parameter.name] = value
        else flags.push(`--${apiFlagOf(parameter.name)}`, typeof value === "string" ? value : apiJson(value))
      }
      if (Object.keys(protectedFields).length) {
        const file = join(mkdtempSync(join(tmpdir(), "api-body-")), "request.json")
        writeFileSync(file, apiJson(protectedFields), { mode: 0o600 })
        flags.push("--body-file", file)
      }
      if (operation.response?.sensitive) {
        flags.push("--store-token", `api-contract-${operation.command}`)
        response = (method) =>
          method === operation.id
            ? ok("1:synthetic_fixture_for_tests_only")
            : ok({ id: 1, is_bot: true, first_name: "Synthetic" })
      }
      const result = await invoke([operation.command, ...flags])
      expect(result.code, result.err).toBe(0)
      expect(requests.filter((request) => request.method === operation.id)).toHaveLength(1)
      if (operation.request) {
        const containsSecret = (value: unknown): boolean =>
          value !== null &&
          typeof value === "object" &&
          Object.entries(value).some(
            ([name, child]) =>
              (["secret_token", "provider_token"].includes(name) && typeof child === "string" && child.length > 0) ||
              containsSecret(child),
          )
        const destination = operation.response?.sensitive ? ["--store-token", `api-contract-${operation.command}`] : []
        const body = await invoke([operation.command, "--body", apiJson(fullBody), ...destination])
        expect(body.code, body.err).toBe(containsSecret(fullBody) ? 2 : 0)
        const path = join(mkdtempSync(join(tmpdir(), "api-full-body-")), "request.json")
        writeFileSync(path, apiJson(fullBody), { mode: 0o600 })
        const file = await invoke([operation.command, "--body-file", path, ...destination])
        expect(file.code, file.err).toBe(0)
      }
    },
  )
})
