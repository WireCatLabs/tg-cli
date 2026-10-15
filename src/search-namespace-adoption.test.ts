import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { rememberAccount } from "@wirecat/cli-core/cli"
import { openStore } from "@wirecat/cli-core/store"
import { seedSearchRecipes } from "@wirecat/cli-core/testing"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { TG } from "./app.js"
import { run } from "./program.js"

const refuse = vi.fn(() => {
  throw new Error("synthetic search must not connect")
})
const keyring = memoryKeyring()
const account = { provider: "telegram", account: "500" }
const mail = { provider: "email", account: "owner@example.test" }
const db = await openStore({ path: process.env.MESSAGING_STORE })
beforeAll(async () => {
  rememberAccount(TG, "default", account.account, process.env)
  await seedSearchRecipes(db, account)
  await db.saveChats(mail, [
    {
      id: "t1",
      title: "Synthetic invoice thread",
      kind: "dialog",
      unreadCount: null,
      lastMessageAt: null,
      participantsCount: null,
    },
  ])
  await db.saveMessages(
    mail,
    "t1",
    [
      {
        id: "m1",
        chatId: "t1",
        senderId: "billing@example.test",
        senderName: "Billing",
        timestamp: "2026-01-21T10:00:00.000Z",
        editedAt: null,
        text: "invoice attached for January",
        outgoing: false,
        attachments: [],
        replyTo: null,
        forwardedFrom: null,
        reactions: null,
      },
    ],
    { via: "himalaya" },
  )
  await db.notes.addNote({ title: "Billing notes", text: "the invoice is paid by the 25th" })
  await db.fillSearchIndex()
})
afterAll(async () => {
  await db.close()
  expect(refuse).not.toHaveBeenCalled()
})
const invoke = async (argv: string[]) => {
  const streams = captureStreams()
  const code = await run([...argv, "--json", "--offline", "--no-record"], {
    streams,
    tty: false,
    env: process.env,
    keyring,
    adapter: refuse,
  })
  return { code, answer: JSON.parse(streams.stdout.join("\n") || "null"), stderr: streams.stderr.join("\n") }
}

describe("search <resource> adoption", () => {
  it("search all answers messages and notes, never mail, and --only narrows it", async () => {
    const all = await invoke(["search", "all", "invoice", "--limit", "20", "--exact", "--timezone", "UTC"])
    expect(all.code).toBe(0)
    expect(new Set(all.answer.items.map(({ kind }: { kind: string }) => kind))).toEqual(new Set(["message", "note"]))
    const paged = await invoke(["search", "all", "invoice", "--source", "all", "--page", "1", "--limit", "20"])
    expect(paged.code).toBe(0)
    const notes = await invoke(["search", "all", "invoice", "--only", "notes"])
    expect(notes.answer.items.map(({ kind }: { kind: string }) => kind)).toEqual(["note"])
    const mail = await invoke(["search", "all", "invoice", "--only", "mail"])
    expect(mail.code).toBe(2)
    expect(mail.stderr).toContain("memo search mail")
  })

  it("search mail points to memo, and search messages never returns mail", async () => {
    const mail = await invoke(["search", "mail", "invoice"])
    expect(mail.code).toBe(2)
    expect(mail.stderr).toContain("mail is memo's: install @wirecat/cli-memo, then `memo search mail …`")
    const messagesPage = await invoke(["search", "messages", "invoice", "--page", "1", "--limit", "5"])
    expect(messagesPage.code).toBe(0)
    const messages = await invoke(["search", "messages", "invoice has:text", "--source", "all"])
    expect(messages.code).toBe(0)
    expect(messages.answer.items.some(({ ref }: { ref: string }) => ref.startsWith("msg:email/"))).toBe(false)
  })

  it("chats documents list pages with --limit and --page", async () => {
    const listed = await invoke(["chats", "documents", "list", "7", "--limit", "5", "--page", "1"])
    expect(listed.stderr).toBe("")
    expect(listed.code).toBe(0)
  })

  it("search notes narrows by type, source, tag and filter, and pages with --offset", async () => {
    const internal = await invoke([
      "search",
      "notes",
      "invoice",
      "--type",
      "internal",
      "--filter",
      "paid",
      "--limit",
      "5",
      "--page",
      "1",
      "--exact",
      "--timezone",
      "UTC",
    ])
    expect(internal.code).toBe(0)
    expect(internal.answer.items).toHaveLength(1)
    const elsewhere = await invoke(["search", "notes", "invoice", "--source", "notes:fld_none"])
    expect(elsewhere.code).toBe(2)
    expect(elsewhere.stderr).toContain("no notes account")
  })
})
