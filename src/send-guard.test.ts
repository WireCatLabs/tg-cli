import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { SendJournal, sendsPathFor } from "@leemour/cli-messaging/sends"
import { describe, expect, it } from "vitest"
import { TG } from "./app.js"
import type { Adapter } from "./commands/context.js"
import { pathsFor } from "./paths.js"
import { run } from "./program.js"
import { chat, message, scripted } from "./testing/scripted.js"

const configure = (profiles: Record<string, unknown>) => {
  const dir = pathsFor().config
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, "config.json"), JSON.stringify({ profiles }))
}

const telegram = () => {
  const sent: string[] = []
  const edited: string[] = []
  const adapter = scripted({
    send: async (chatId, text, { sendId }) => {
      sent.push(text)
      return { sendId, message: message(String(sent.length), { chatId, text, outgoing: true }) }
    },
    edit: async (chatId, messageId, text) => {
      edited.push(text)
      return message(messageId, { chatId, text, outgoing: true, editedAt: new Date().toISOString() })
    },
  })
  return { adapter, sent, edited }
}

const tg = async (argv: string[], adapter: Adapter) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
    adapter: () => adapter,
  })
  const error = streams.stderr[0] ? JSON.parse(streams.stderr[0]).error : undefined
  return { code, stdout: streams.stdout, error }
}

const journal = (profile: string) => new SendJournal(sendsPathFor(TG, profile)).entries()

describe("the send guard in front of messages send", () => {
  it("lets a send through by default and journals it without its text", async () => {
    const { adapter, sent } = telegram()
    const { code } = await tg(["g-open", "messages", "send", "Valencia", "a secret plan"], adapter)

    expect(code).toBe(0)
    expect(sent).toEqual(["a secret plan"])
    expect(journal("g-open")).toMatchObject([{ chatId: chat.id, outcome: "sent", kind: "message", length: 13 }])
    expect(readFileSync(sendsPathFor(TG, "g-open"), "utf8")).not.toContain("secret")
  })

  it("refuses from a read-only profile with exit 5, sends nothing, and journals the refusal", async () => {
    configure({ "g-ro": { readOnly: true } })
    const { adapter, sent } = telegram()
    const { code, error } = await tg(["g-ro", "messages", "send", "Valencia", "hi"], adapter)

    expect(code).toBe(5)
    expect(error.message).toContain("read-only")
    expect(sent).toEqual([])
    expect(journal("g-ro")).toMatchObject([{ outcome: "refused", errorCode: "permission_error" }])
  })

  it("sends only to chats on the recipient list once it is on", async () => {
    const { adapter, sent } = telegram()
    mkdirSync(join(pathsFor().state, "profiles"), { recursive: true })
    writeFileSync(
      join(pathsFor().state, "profiles", "g-list.recipients.json"),
      JSON.stringify({ chats: [{ id: "-100999", title: "Other", addedAt: "2026-09-27T00:00:00Z" }] }),
      { flag: "w" },
    )
    const refused = await tg(["g-list", "messages", "send", "Valencia", "hi"], adapter)
    expect(refused.code).toBe(7)
    expect(refused.error.message).toContain("tg g-list recipients add")

    expect((await tg(["g-list", "recipients", "add", "Valencia"], adapter)).code).toBe(0)
    expect((await tg(["g-list", "messages", "send", "Valencia", "hi"], adapter)).code).toBe(0)
    expect(sent).toEqual(["hi"])
  })

  it("stops at the hourly limit with exit 8 and says when the next send is possible", async () => {
    configure({ "g-limit": { sendsPerHour: 1 } })
    const { adapter, sent } = telegram()

    expect((await tg(["g-limit", "messages", "send", "Valencia", "one"], adapter)).code).toBe(0)
    const second = await tg(["g-limit", "messages", "send", "Valencia", "two"], adapter)

    expect(second.code).toBe(8)
    expect(second.error.message).toContain("the next send is possible")
    expect(sent).toEqual(["one"])
  })

  it("lists attempts newest first under sends list", async () => {
    const { adapter } = telegram()
    await tg(["g-log", "messages", "send", "Valencia", "one"], adapter)
    await tg(["g-log", "messages", "send", "Valencia", "two"], adapter)
    const { stdout } = await tg(["g-log", "sends", "list"], adapter)

    expect(JSON.parse(stdout[0] ?? "")).toHaveLength(2)
  })
})

describe("the send guard in front of the other writes", () => {
  it("**counts an edit toward the hourly limit**, and journals it as an edit without the text", async () => {
    configure({ "g-edit": { sendsPerHour: 2 } })
    const { adapter, edited } = telegram()

    const done = await tg(["g-edit", "messages", "edit", "Valencia", "5", "the new text", "--json"], adapter)
    await tg(["g-edit", "messages", "send", "Valencia", "one"], adapter)
    const over = await tg(["g-edit", "messages", "edit", "Valencia", "5", "again"], adapter)

    expect(done.code).toBe(0)
    expect(JSON.parse(done.stdout[0] ?? "").message).toMatchObject({ id: "5", text: "the new text" })
    expect(over.code).toBe(8)
    expect(edited).toEqual(["the new text"])
    expect(journal("g-edit").filter((entry) => entry.kind === "edit" && entry.outcome === "sent")).toMatchObject([
      { chatId: chat.id, messageId: "5", length: 12 },
    ])
    expect(readFileSync(sendsPathFor(TG, "g-edit"), "utf8")).not.toContain("new text")
  })

  it("refuses an edit the profile's allow list leaves out", async () => {
    configure({ "g-noedit": { allow: ["send"] } })
    const { adapter, edited } = telegram()

    const { code, error } = await tg(["g-noedit", "messages", "edit", "Valencia", "5", "x"], adapter)

    expect(code).toBe(5)
    expect(error.message).toContain("does not allow edit")
    expect(edited).toEqual([])
  })
})
