import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Readable } from "node:stream"
import { captureStreams, memoryKeyring } from "@leemour/cli-core"
import { beforeEach, describe, expect, it } from "vitest"
import type { FetchLike } from "./bot/transport.js"
import { run } from "./program.js"

const TOKEN = "123456789:AAsecretSECRETsecretSECRETsecret0"
const BOT = { id: 7_000_000_001, is_bot: true, first_name: "Sales", username: "sales_bot" }
const GROUP = { id: -1001234567890, type: "supergroup", title: "Team" }

let keyring: ReturnType<typeof memoryKeyring>
let requests: { method: string; params: Record<string, unknown>; file?: string }[]
let next: number

const ok = (result: unknown) => new Response(JSON.stringify({ ok: true, result }))

/** A stand-in for api.telegram.org that remembers each request, JSON or multipart. */
const telegram: FetchLike = async (url, init) => {
  const method = url.split("/").at(-1) ?? ""
  let params: Record<string, unknown> = {}
  let file: string | undefined
  if (init.body instanceof FormData) {
    for (const [name, value] of init.body.entries()) {
      if (typeof value === "string") params[name] = value
      else file = `${name}:${value.name}`
    }
  } else params = JSON.parse(String(init.body ?? "{}"))
  requests.push({ method, params, ...(file ? { file } : {}) })
  const chat = String(params.chat_id).startsWith("-")
    ? GROUP
    : { id: Number(params.chat_id), type: "private", first_name: "Ann" }
  const reply: { message_id: number } | undefined =
    typeof params.reply_parameters === "string" ? JSON.parse(params.reply_parameters) : params.reply_parameters
  const message = (text: unknown) => ({
    message_id: next++,
    chat,
    from: BOT,
    date: 1_759_312_800,
    text,
    ...(reply
      ? {
          reply_to_message: {
            message_id: reply.message_id,
            chat,
            from: { id: 42, first_name: "Ann", last_name: "Lee" },
            date: 1_759_312_700,
            text: "the numbers?",
          },
        }
      : {}),
  })
  switch (method) {
    case "getMe":
      return ok(BOT)
    case "sendMessage":
      return ok(message(params.text))
    case "sendDocument":
    case "sendPhoto":
      return ok({
        ...message(undefined),
        caption: params.caption,
        document: { file_id: "BQAC", file_name: "report.pdf", file_size: 4 },
      })
    case "editMessageText":
      return ok({ ...message(params.text), message_id: Number(params.message_id), edit_date: 1_759_312_900 })
    case "getChat":
      return ok(GROUP)
    default:
      return ok(true)
  }
}

const tg = async (argv: string[], stdin = "") => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring,
    botFetch: telegram,
    stdin: Object.assign(Readable.from([stdin]), { isTTY: false }),
  })
  const out = streams.stdout.join("\n")
  return { code, answer: out ? JSON.parse(out) : undefined, err: streams.stderr.join("\n") }
}

beforeEach(async () => {
  keyring = memoryKeyring()
  requests = []
  next = 500
  await tg(["sales", "bot", "auth", "set"], TOKEN)
  await tg(["sales", "bot", "chats", "show", String(GROUP.id)])
  requests = []
})

describe("tg bot messages send", () => {
  it("**sends to a chat by its title**, with --md as Telegram's entities, and keeps it", async () => {
    const done = await tg([
      "sales",
      "bot",
      "messages",
      "send",
      "Team",
      "**Done** today",
      "--md",
      "--reply-to",
      "7",
      "--silent",
      "--json",
    ])

    expect(done.code).toBe(0)
    expect(requests).toEqual([
      {
        method: "sendMessage",
        params: {
          chat_id: String(GROUP.id),
          text: "Done today",
          entities: [{ type: "bold", offset: 0, length: 4 }],
          reply_parameters: { message_id: 7 },
          disable_notification: true,
        },
      },
    ])
    expect(done.answer.message).toMatchObject({ id: "500", chatId: String(GROUP.id), text: "Done today" })
    const kept = await tg(["sales", "bot", "messages", "list", "Team", "--json"])
    expect(kept.answer.items.map((item: { id: string }) => item.id)).toEqual(["500"])
    expect(kept.err).toContain("gives a bot no history")
  })

  it("writes to a person as user:<id>, and sends --html as Telegram's HTML", async () => {
    await tg(["sales", "bot", "messages", "send", "user:42", "<b>hi</b>", "--html"])
    expect(requests[0]?.params).toMatchObject({ chat_id: "42", text: "<b>hi</b>", parse_mode: "HTML" })
  })

  it("**sends a file in the same request**, the text as its caption", async () => {
    const dir = mkdtempSync(join(tmpdir(), "tg-bot-file-"))
    const path = join(dir, "report.pdf")
    writeFileSync(path, "%PDF")
    await tg(["sales", "bot", "messages", "send", "Team", "Weekly", "--file", path])

    expect(requests).toEqual([
      { method: "sendDocument", params: { chat_id: String(GROUP.id), caption: "Weekly" }, file: "document:report.pdf" },
    ])
  })

  it("**answers with the file by Telegram's id, never its download address**, and the message it replied to", async () => {
    const dir = mkdtempSync(join(tmpdir(), "tg-bot-reply-"))
    writeFileSync(join(dir, "report.pdf"), "%PDF")
    const done = await tg([
      "sales",
      "bot",
      "messages",
      "send",
      "Team",
      "Weekly",
      "--file",
      join(dir, "report.pdf"),
      "--reply-to",
      "7",
      "--json",
    ])

    expect(done.answer.message).toMatchObject({
      text: "Weekly",
      attachments: [{ kind: "file", providerRef: { fileId: "BQAC" }, name: "report.pdf", size: 4 }],
      replyToId: "7",
      replyTo: { id: "7", senderId: "42", senderName: "Ann Lee", text: "the numbers?" },
    })
    expect(JSON.stringify(done.answer)).not.toContain("api.telegram.org")
  })

  it("**chooses the method by the option**: a photo, a voice message, a video as a file", async () => {
    const dir = mkdtempSync(join(tmpdir(), "tg-bot-kinds-"))
    for (const name of ["shot.png", "note.ogg", "clip.mp4"]) writeFileSync(join(dir, name), "x")
    await tg(["sales", "bot", "messages", "send", "Team", "look", "--photo", join(dir, "shot.png")])
    await tg(["sales", "bot", "messages", "send", "Team", "--voice", join(dir, "note.ogg")])
    await tg(["sales", "bot", "messages", "send", "Team", "--file", join(dir, "clip.mp4"), "--as-file"])

    expect(requests.map(({ method, file }) => [method, file])).toEqual([
      ["sendPhoto", "photo:shot.png"],
      ["sendVoice", "voice:note.ogg"],
      ["sendDocument", "document:clip.mp4"],
    ])
  })

  it("**refuses a file from a hidden folder** unless --allow-any-file says it is meant to go", async () => {
    const dir = join(mkdtempSync(join(tmpdir(), "tg-bot-hidden-")), ".secret")
    mkdirSync(dir)
    writeFileSync(join(dir, "key.txt"), "x")

    expect((await tg(["sales", "bot", "messages", "send", "Team", "--file", join(dir, "key.txt")])).code).toBe(2)
    expect(requests).toEqual([])
    await tg(["sales", "bot", "messages", "send", "Team", "--file", join(dir, "key.txt"), "--allow-any-file"])
    expect(requests.map(({ method }) => method)).toEqual(["sendDocument"])
  })
})

describe("tg bot messages edit, delete, pin", () => {
  it("edits with --md as entities and with --html as Telegram's HTML, and pins with --notify", async () => {
    await tg(["sales", "bot", "messages", "edit", "Team", "500", "_now_", "--md"])
    await tg(["sales", "bot", "messages", "edit", "Team", "500", "<i>now</i>", "--html"])
    await tg(["sales", "bot", "messages", "pin", "Team", "500", "--notify"])

    expect(requests.map(({ params }) => params)).toEqual([
      { chat_id: String(GROUP.id), message_id: 500, text: "now", entities: [{ type: "italic", offset: 0, length: 3 }] },
      { chat_id: String(GROUP.id), message_id: 500, text: "<i>now</i>", parse_mode: "HTML" },
      { chat_id: String(GROUP.id), message_id: 500, disable_notification: false },
    ])
  })

  it("edits, deletes several at once, pins quietly and unpins one message", async () => {
    await tg(["sales", "bot", "messages", "edit", "Team", "500", "new text"])
    await tg(["sales", "bot", "messages", "delete", "Team", "500", "501", "--allow-dangerous"])
    await tg(["sales", "bot", "messages", "pin", "Team", "502"])
    await tg(["sales", "bot", "messages", "unpin", "Team", "502"])

    expect(requests.map(({ method, params }) => [method, params])).toEqual([
      ["editMessageText", { chat_id: String(GROUP.id), message_id: 500, text: "new text" }],
      ["deleteMessages", { chat_id: String(GROUP.id), message_ids: [500, 501] }],
      ["pinChatMessage", { chat_id: String(GROUP.id), message_id: 502, disable_notification: true }],
      ["unpinChatMessage", { chat_id: String(GROUP.id), message_id: 502 }],
    ])
  })
})

describe("tg bot chats", () => {
  it("shows the bot typing in Telegram's word for it, and leaves", async () => {
    await tg(["sales", "bot", "chats", "action", "Team", "file"])
    await tg(["sales", "bot", "chats", "leave", "Team"])

    expect(requests).toEqual([
      { method: "sendChatAction", params: { chat_id: String(GROUP.id), action: "upload_document" } },
      { method: "leaveChat", params: { chat_id: String(GROUP.id) } },
    ])
  })
})
