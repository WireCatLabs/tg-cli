import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { rememberAccount } from "@wirecat/cli-core/cli"
import { openStore } from "@wirecat/cli-core/store"
import { beforeAll, describe, expect, it } from "vitest"
import { TG as app } from "./app.js"
import { run } from "./program.js"

const account = { provider: "telegram", account: "503" }
const profile = "mentions-local"
const tg = async (words: string[]) => {
  const streams = captureStreams()
  const code = await run([profile, ...words], {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    adapter: () => {
      throw new Error("mentions never connect")
    },
  })
  return { code, out: streams.stdout.join("\n"), err: streams.stderr.join("\n") }
}
const message = (id: string, text: string, timestamp: string) => ({
  id,
  chatId: "7",
  senderId: "11",
  senderName: null,
  text,
  timestamp,
  editedAt: null,
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
})

beforeAll(async () => {
  rememberAccount(app, profile, account.account, process.env)
  const store = await openStore()
  try {
    await store.saveMessages(
      account,
      "7",
      [
        message("201", "звони +7 900 000-00-01", "2026-10-04T10:00:00Z"),
        message("202", "смета на https://example.com/smeta?utm_source=tg", "2026-10-05T10:00:00Z"),
      ],
      { via: "fixture" },
    )
  } finally {
    await store.close()
  }
})

describe("mentions through tg", () => {
  it("lists phones and links found in stored messages, page by page, and shows one in its text", async () => {
    const first = await tg(["mentions", "list", "--limit", "1", "--page", "1", "--json"])
    expect(first.code, first.err).toBe(0)
    expect(JSON.parse(first.out)).toMatchObject({ items: [{ kind: "url", value: "https://example.com/smeta" }] })

    const second = await tg(["mentions", "list", "--limit", "1", "--page", "2", "--json"])
    const [phone] = JSON.parse(second.out).items
    expect(phone).toMatchObject({ kind: "phone", value: "+79000000001", locator: "msg:telegram/503/7/201" })

    const shown = await tg(["mentions", "show", String(phone.id), "--json"])
    expect(shown.code, shown.err).toBe(0)
    expect(JSON.parse(shown.out)).toMatchObject({ written: "+7 900 000-00-01", before: "звони " })
  })
})
