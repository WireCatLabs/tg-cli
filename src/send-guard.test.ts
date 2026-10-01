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

const poll = (chatId: string, messageId: string) => ({
  chatId,
  messageId,
  question: "Friday?",
  answers: [{ id: "MA", text: "yes", voters: null, chosen: false }],
  closed: false,
  multiple: false,
  anonymous: false,
  voters: null,
})

const telegram = () => {
  const sent: string[] = []
  const polled: string[] = []
  const deleted: string[] = []
  const marked: string[] = []
  const edited: string[] = []
  const reacted: string[] = []
  const forwarded: string[] = []
  const pinned: string[] = []
  const adapter = scripted({
    markRead: async (_chat, until) => {
      marked.push(until ?? "all")
    },
    delete: async (_chat, ids, { forEveryone }) => {
      deleted.push(`${ids.join(",")}${forEveryone ? " everyone" : ""}`)
    },
    poll: async (chatId, messageId) => poll(chatId, messageId),
    vote: async (chatId, messageId, ids) => {
      polled.push(`vote ${ids.join(",") || "none"}`)
      return poll(chatId, messageId)
    },
    closePoll: async (chatId, messageId) => {
      polled.push("close")
      return { ...poll(chatId, messageId), closed: true }
    },
    createPoll: async (chatId, created, { sendId, silent }) => {
      polled.push(`create ${created.answers.length} ${created.multiple} ${created.anonymous} ${silent === true}`)
      return { sendId, message: message("80", { chatId, outgoing: true }) }
    },
    send: async (chatId, text, { sendId }) => {
      sent.push(text)
      return { sendId, message: message(String(sent.length), { chatId, text, outgoing: true }) }
    },
    pin: async (_chat, messageId, { notify }) => {
      pinned.push(notify ? `${messageId} notify` : messageId)
    },
    unpin: async (_chat, messageId) => {
      pinned.push(`${messageId} off`)
    },
    forward: async (_from, _id, toChatId, options) => {
      forwarded.push(`${options.silent ? `${toChatId} silent` : toChatId} ${options.sendId}`)
      return message("70", { chatId: toChatId, outgoing: true })
    },
    react: async (_chat, messageId, emoji) => {
      reacted.push(`${messageId} ${emoji}`)
    },
    edit: async (chatId, messageId, text, options) => {
      edited.push(options?.markup ? `${text} ${JSON.stringify(options.markup)}` : text)
      return message(messageId, { chatId, text, outgoing: true, editedAt: new Date().toISOString() })
    },
  })
  return { adapter, sent, edited, forwarded, pinned, reacted, marked, deleted, polled }
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

    expect(JSON.parse(stdout[0] ?? "").items).toHaveLength(2)
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

  it("checks a forward against the chat it goes to, not the one it came from", async () => {
    const { adapter, forwarded } = telegram()
    mkdirSync(join(pathsFor().state, "profiles"), { recursive: true })
    writeFileSync(
      join(pathsFor().state, "profiles", "g-fwd.recipients.json"),
      JSON.stringify({ chats: [{ id: chat.id, title: chat.title, addedAt: "2026-09-27T00:00:00Z" }] }),
    )

    const refused = await tg(["g-fwd", "messages", "forward", "Valencia", "5", "--to", "me"], adapter)

    expect(refused.code).toBe(7)
    expect(forwarded).toEqual([])
    expect(journal("g-fwd")).toMatchObject([{ kind: "forward", outcome: "refused", chatId: "1" }])
  })

  it("forwards quietly with --silent and journals it as a forward", async () => {
    const { adapter, forwarded } = telegram()

    const { code } = await tg(["g-quiet", "messages", "forward", "Valencia", "5", "--to", "me", "--silent"], adapter)

    expect(code).toBe(0)
    expect(forwarded).toEqual([expect.stringMatching(/^1 silent \S+$/)])
    expect(journal("g-quiet")).toMatchObject([{ kind: "forward", outcome: "sent", chatId: "1", messageId: "70" }])
  })

  it("repeats a forward with the --send-id it is given, and journals that id", async () => {
    const { adapter, forwarded } = telegram()

    const { code, stdout } = await tg(
      ["g-fwd-id", "messages", "forward", "Valencia", "5", "--to", "me", "--send-id", "9001", "--json"],
      adapter,
    )

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ sendId: "9001", operationId: "9001" })
    expect(forwarded).toEqual(["1 9001"])
    expect(journal("g-fwd-id")).toMatchObject([{ kind: "forward", outcome: "sent", sendId: "9001" }])
  })

  it("edits with --markdown as formatting, the marks taken out", async () => {
    const { adapter, edited } = telegram()

    const { code } = await tg(["g-edit-md", "messages", "edit", "Valencia", "5", "**new** text", "--markdown"], adapter)

    expect(code).toBe(0)
    expect(edited).toEqual(['new text [{"type":"bold","from":0,"length":3}]'])
  })

  it("pins quietly past the hourly limit, but not with --notify", async () => {
    configure({ "g-pin": { sendsPerHour: 1 } })
    const { adapter, pinned } = telegram()
    await tg(["g-pin", "messages", "send", "Valencia", "one"], adapter)

    const quiet = await tg(["g-pin", "messages", "pin", "Valencia", "5", "--json"], adapter)
    const loud = await tg(["g-pin", "messages", "pin", "Valencia", "6", "--notify"], adapter)
    const off = await tg(["g-pin", "messages", "unpin", "Valencia", "5"], adapter)

    expect([quiet.code, loud.code, off.code]).toEqual([0, 8, 0])
    expect(JSON.parse(quiet.stdout[0] ?? "")).toEqual({
      operationId: expect.any(String),
      chatId: chat.id,
      messageId: "5",
      pinned: true,
    })
    expect(pinned).toEqual(["5", "5 off"])
  })

  it("lets a profile that allows only reactions react, and nothing else", async () => {
    configure({ "g-react": { allow: ["reaction"] } })
    const { adapter, reacted, sent } = telegram()

    const added = await tg(["g-react", "reactions", "add", "Valencia", "5", "👍", "--json"], adapter)
    const removed = await tg(["g-react", "reactions", "remove", "Valencia", "5"], adapter)
    const refused = await tg(["g-react", "messages", "send", "Valencia", "hi"], adapter)

    expect([added.code, removed.code, refused.code]).toEqual([0, 0, 5])
    expect(JSON.parse(added.stdout[0] ?? "")).toEqual({
      operationId: expect.any(String),
      chatId: chat.id,
      messageId: "5",
      reaction: "👍",
    })
    expect(reacted).toEqual(["5 👍", "5 null"])
    expect(sent).toEqual([])
  })

  it("marks a chat read through the guard, refused on a read-only profile", async () => {
    configure({ "g-ro-read": { readOnly: true } })
    const { adapter, marked } = telegram()

    const done = await tg(["g-read", "chats", "mark-read", "Valencia", "--until", "9", "--json"], adapter)
    const refused = await tg(["g-ro-read", "chats", "mark-read", "Valencia"], adapter)

    expect(JSON.parse(done.stdout[0] ?? "")).toEqual({ operationId: expect.any(String), chatId: chat.id, until: "9" })
    expect(refused.code).toBe(5)
    expect(marked).toEqual(["9"])
    expect(journal("g-read")).toMatchObject([{ kind: "read", outcome: "sent", messageId: "9" }])
  })

  it("deletes only with --allow-dangerous, and counts each message toward the hourly limit", async () => {
    configure({ "g-del": { sendsPerHour: 2 } })
    const { adapter, deleted } = telegram()

    const unasked = await tg(["g-del", "messages", "delete", "Valencia", "5"], adapter)
    const done = await tg(["g-del", "messages", "delete", "Valencia", "5", "6", "--allow-dangerous", "--json"], adapter)
    const over = await tg(
      ["g-del", "messages", "delete", "Valencia", "7", "--for-everyone", "--allow-dangerous"],
      adapter,
    )

    expect([unasked.code, done.code, over.code]).toEqual([7, 0, 8])
    const answer = JSON.parse(done.stdout[0] ?? "")
    expect(answer).toEqual({
      operationId: expect.any(String),
      chatId: chat.id,
      deleted: ["5", "6"],
      forEveryone: false,
    })
    expect(journal("g-del")).toContainEqual(
      expect.objectContaining({ outcome: "sent", operationId: answer.operationId }),
    )
    expect(deleted).toEqual(["5,6"])
  })

  it("reads a poll, votes by id and takes it back, closes it, and creates one with every option", async () => {
    const { adapter, polled } = telegram()

    const shown = await tg(["g-poll", "polls", "show", "Valencia", "3", "--json"], adapter)
    await tg(["g-poll", "polls", "vote", "Valencia", "3", "MA"], adapter)
    await tg(["g-poll", "polls", "vote", "Valencia", "3", "--retract"], adapter)
    await tg(["g-poll", "polls", "close", "Valencia", "3"], adapter)
    const created = await tg(
      [
        "g-poll",
        "polls",
        "create",
        "Valencia",
        "Where?",
        "a",
        "b",
        "--multiple",
        "--anonymous",
        "--silent",
        "--send-id",
        "5",
        "--json",
      ],
      adapter,
    )

    expect(JSON.parse(shown.stdout[0] ?? "").answers[0].id).toBe("MA")
    expect(JSON.parse(created.stdout[0] ?? "")).toMatchObject({ sendId: "5", message: { id: "80" } })
    expect(polled).toEqual(["vote MA", "vote none", "close", "create 2 true true true"])
    expect(
      journal("g-poll")
        .filter((entry) => entry.outcome === "sent")
        .map((entry) => entry.kind),
    ).toEqual(["reaction", "reaction", "edit", "message"])
  })
})
