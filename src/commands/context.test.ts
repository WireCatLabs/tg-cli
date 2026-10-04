import { chmodSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Chat, Message } from "@leemour/cli-messaging"
import { type AccountKey, openStore } from "@leemour/cli-messaging/store"
import { describe, expect, it } from "vitest"
import { sessionModes, TELEGRAM } from "./context.js"

const ME: AccountKey = { provider: "telegram", account: "100" }
const fresh = () => join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? tmpdir(), "store-")), "messages.db")
const among = TELEGRAM.deletedWithoutChat

const supergroup: Chat = {
  id: "-1001234567890",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 3,
  lastMessageAt: "2026-09-26T10:00:00.000Z",
  participantsCount: 5000,
  providerMetadata: { chatType: "supergroup" },
}
const dialog: Chat = { ...supergroup, id: "555", kind: "dialog", providerMetadata: {} }
const basicGroup: Chat = { ...supergroup, id: "-4001", kind: "group", providerMetadata: { chatType: "group" } }

const message = (fields: Partial<Message> = {}): Message => ({
  id: "42",
  chatId: supergroup.id,
  senderId: "777",
  senderName: "Ana",
  timestamp: "2026-09-26T10:00:00.000Z",
  editedAt: null,
  text: "synthetic text",
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
  ...fields,
})

describe("a deletion Telegram sends without its chat", () => {
  it("lands only where ids count per account, and only when one message matches", async () => {
    const store = await openStore({ path: fresh() })
    await store.saveChats(ME, [supergroup, dialog, basicGroup])
    await store.saveMessages(ME, supergroup.id, [message(), message({ id: "43" })], { via: "history" })
    const inDialog = [message({ chatId: dialog.id }), message({ id: "44", chatId: dialog.id })]
    await store.saveMessages(ME, dialog.id, inDialog, { via: "history" })
    await store.saveMessages(ME, basicGroup.id, [message({ id: "44", chatId: basicGroup.id })], { via: "history" })

    expect(await store.markDeleted(ME, ["42", "43", "44"], { among })).toBe(1)
    expect(await store.message(ME, "42", { chatId: dialog.id })).toBeUndefined()
    expect(await store.message(ME, "42", { chatId: supergroup.id })).toBeDefined()
    expect(await store.message(ME, "43", { chatId: supergroup.id })).toBeDefined()
    expect(await store.message(ME, "44", { chatId: dialog.id })).toBeDefined()
    expect(await store.message(ME, "44", { chatId: basicGroup.id })).toBeDefined()
    await store.close()
  })

  it("leaves out a chat known only by its `-100…` id", async () => {
    const store = await openStore({ path: fresh() })
    await store.saveChats(ME, [dialog])
    await store.saveMessages(ME, dialog.id, [message({ chatId: dialog.id })], { via: "history" })
    await store.saveMessages(ME, "-1009999", [message({ chatId: "-1009999" })], { via: "update" })

    expect(await store.markDeleted(ME, ["42"], { among })).toBe(1)
    expect(await store.message(ME, "42", { chatId: dialog.id })).toBeUndefined()
    expect(await store.message(ME, "42", { chatId: "-1009999" })).toBeDefined()
    await store.close()
  })

  it.each([
    ["a channel", false, { id: "-1001", kind: "channel" }],
    ["a gigagroup", false, { id: "-1002", kind: "group", providerMetadata: { chatType: "gigagroup" } }],
    ["a monoforum", false, { id: "-1003", kind: "group", providerMetadata: { chatType: "monoforum" } }],
    ["a chat stored by a plain id alone", true, { id: "-4002", kind: "unknown" }],
    ["Saved Messages", true, { id: "100", kind: "saved" }],
  ] as const)("may land in %s: %s", (_name, expected, chat) => {
    expect(among?.(chat)).toBe(expected)
  })
})

it("names a SKILL.md that exists, for `tg skill` and the MCP server's tg://skill", () => {
  expect(TELEGRAM.skill && existsSync(fileURLToPath(TELEGRAM.skill))).toBe(true)
})

describe("the session's file modes", () => {
  const session = () => {
    const dir = join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? tmpdir(), "modes-")), "sessions")
    mkdirSync(dir, { mode: 0o700 })
    const path = join(dir, "default.session")
    writeFileSync(path, "", { mode: 0o600 })
    return { dir, path }
  }

  it("is fine when only the owner can read the session, a read-only one included", () => {
    const { path } = session()
    chmodSync(path, 0o400)
    expect(sessionModes(path, "linux")).toEqual({ checked: true, ok: true, problems: [] })
  })

  it("**names the -wal file and the folder others can open, with the chmod that fixes each**, and changes nothing", () => {
    const { dir, path } = session()
    writeFileSync(`${path}-wal`, "", { mode: 0o644 })
    chmodSync(`${path}-wal`, 0o644)
    chmodSync(dir, 0o755)

    expect(sessionModes(path, "linux")).toEqual({
      checked: true,
      ok: false,
      problems: [
        { path: `${path}-wal`, mode: "0644", want: "0600", fix: `chmod 600 '${path}-wal'` },
        { path: dir, mode: "0755", want: "0700", fix: `chmod 700 '${dir}'` },
      ],
    })
    expect(sessionModes(path, "linux").problems).toHaveLength(2)
  })

  it("says it did not check on Windows", () => {
    expect(sessionModes("C:\\x.session", "win32")).toMatchObject({ checked: false })
  })
})
