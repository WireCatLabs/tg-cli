import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { SendJournal, sendsPathFor } from "@wirecat/cli-core/sends"
import { expect, it, vi } from "vitest"
import { TG } from "./app.js"
import { pathsFor } from "./paths.js"
import { run } from "./program.js"
import { scripted } from "./testing/scripted.js"

const invoke = async (args: string[], level: "allow" | "deny" = "allow") => {
  const dir = pathsFor().config
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, "config.json"),
    JSON.stringify({ profiles: { drafttest: { permissions: { drafts: level } } } }),
  )
  const saveDraft = vi.fn(async () => {})
  const send = vi.fn()
  const close = vi.fn(async () => {})
  const streams = captureStreams()
  const code = await run(["drafttest", "messages", "send", "me", ...args, "--json", "--no-input"], {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
    adapter: () => scripted({ saveDraft, send, close }),
  })
  return { code, saveDraft, send, close, out: streams.stdout.join(""), err: streams.stderr.join("") }
}

it("saves a formatted draft with a typed receipt, closes, and journals no draft text", async () => {
  const result = await invoke(["Review **example**", "--draft", "--md", "--reply-to", "42", "--no-preview"])
  expect(result.code, result.err).toBe(0)
  expect(JSON.parse(result.out)).toMatchObject({
    item: { saved: true, chat_id: "1", operation_id: expect.any(String) },
  })
  expect(result.saveDraft).toHaveBeenCalledWith(
    "1",
    "Review example",
    expect.objectContaining({
      replyTo: "42",
      noPreview: true,
      formatting: [{ type: "bold", from: 7, length: 7 }],
    }),
  )
  expect(result.send).not.toHaveBeenCalled()
  expect(result.close).toHaveBeenCalledOnce()
  const entries = new SendJournal(sendsPathFor(TG, "drafttest")).entries()
  expect(JSON.stringify(entries)).not.toContain("Review")
  expect(entries).toEqual(expect.arrayContaining([expect.objectContaining({ key: "drafts" })]))
})

it("refuses the drafts permission and never sends or saves", async () => {
  const result = await invoke(["Review example", "--draft"], "deny")
  expect(result.code).toBe(5)
  expect(JSON.parse(result.err).error.code).toBe("permission_error")
  expect(result.saveDraft).not.toHaveBeenCalled()
  expect(result.send).not.toHaveBeenCalled()
  expect(result.close).toHaveBeenCalledOnce()
})

it.each([
  ["", "--draft"],
  ["Example", "--draft", "--silent"],
  ["Example", "--draft", "--at-time", "1h"],
])("refuses invalid draft options before opening Telegram: %j", async (...args) => {
  const result = await invoke(args)
  expect(result.code).toBe(2)
  expect(result.saveDraft).not.toHaveBeenCalled()
  expect(result.send).not.toHaveBeenCalled()
  expect(result.close).not.toHaveBeenCalled()
})
