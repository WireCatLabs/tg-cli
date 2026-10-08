import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
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
      polled.push(
        `create ${created.answers.length} ${created.multiple} ${created.anonymous} ${silent === true}${created.revote ? " revote" : ""}`,
      )
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
      edited.push(options?.formatting ? `${text} ${JSON.stringify(options.formatting)}` : text)
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
  it("sends --comment-to as a reply in the post's discussion group, which the journal records", async () => {
    const replies: (string | undefined)[] = []
    const adapter = scripted({
      discussionOf: async () => ({ chatId: "-1002", messageId: "900" }),
      send: async (chatId, text, { sendId, replyTo }) => {
        replies.push(replyTo)
        return { sendId, message: message("901", { chatId, text, outgoing: true }) }
      },
    })
    const { code } = await tg(["g-comment", "messages", "send", "Valencia", "nice", "--comment-to", "42"], adapter)

    expect(code).toBe(0)
    expect(replies).toEqual(["900"])
    expect(journal("g-comment")).toMatchObject([{ chatId: "-1002", outcome: "sent" }])
  })

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
    expect(error.message).toContain("does not let messages.send write")
    expect(sent).toEqual([])
    expect(journal("g-ro")).toMatchObject([{ outcome: "refused", errorCode: "permission_error" }])
  })

  it("**asks before a send its permission level is ask for**, and goes ahead with --yes", async () => {
    configure({ "g-ask": { permissions: { "messages.send": "ask" } } })
    const { adapter, sent } = telegram()

    const unanswered = await tg(["g-ask", "messages", "send", "Valencia", "hi", "--json"], adapter)
    const agreed = await tg(["g-ask", "messages", "send", "Valencia", "hi", "--yes", "--json"], adapter)

    expect(unanswered.error.code).toBe("confirmation_required")
    expect(agreed.code).toBe(0)
    expect(sent).toEqual(["hi"])
  })

  it("creates a poll that allows a changed vote only with --revote", async () => {
    const { adapter, polled } = telegram()

    await tg(["g-revote", "polls", "create", "Valencia", "Friday?", "yes", "no", "--revote"], adapter)

    expect(polled).toEqual(["create 2 false false false revote"])
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
    expect(error.message).toContain("does not let messages.edit write")
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

  it("edits with --md as formatting, the marks taken out", async () => {
    const { adapter, edited } = telegram()

    const { code } = await tg(["g-edit-md", "messages", "edit", "Valencia", "5", "**new** text", "--md"], adapter)

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

  it("**creates a channel and a group with people through the guard**, journaling how many were added", async () => {
    const made: unknown[] = []
    const card = (id: string, title: string) => ({
      ...chat,
      id,
      title,
      description: null,
      link: null,
      settings: {
        allCanPin: null,
        onlyAdminsAdd: null,
        onlyAdminsCall: null,
        onlyOwnerEditsInfo: null,
        membersSeeLink: null,
      },
    })
    const adapter = scripted({
      people: async (references) => references.map((_, index) => String(91 + index)),
      createGroup: async (title, people, options) => {
        made.push([title, people, options])
        return card(people.length ? "-100701" : "-100702", title)
      },
    })

    const group = await tg(["g-admin", "chats", "create", "Plans", "Ivan", "Olga", "--json"], adapter)
    const channel = await tg(["g-admin", "chats", "create", "News", "--channel", "--json"], adapter)

    expect([group.code, channel.code]).toEqual([0, 0])
    expect(made).toEqual([
      ["Plans", ["91", "92"], { channel: false }],
      ["News", [], { channel: true }],
    ])
    expect(journal("g-admin")).toMatchObject([
      { kind: "chat", action: "create", chatId: "-100701", people: 2, outcome: "sent" },
      { kind: "chat", action: "create", chatId: "-100702", outcome: "sent" },
    ])
  })

  it("**changes a group and its link through the guard**", async () => {
    const card = {
      ...chat,
      description: null,
      link: "https://t.me/+old",
      settings: {
        allCanPin: false,
        onlyAdminsAdd: true,
        onlyAdminsCall: null,
        onlyOwnerEditsInfo: null,
        membersSeeLink: null,
      },
    }
    const changed: unknown[] = []
    const adapter = scripted({
      group: async () => card,
      updateGroup: async (chatId, change) => {
        changed.push([chatId, change])
        return card
      },
      resetInviteLink: async () => ({ ...card, link: "https://t.me/+new" }),
    })

    const updated = await tg(
      [
        "g-group",
        "chats",
        "update",
        "Valencia",
        "--title",
        "Pisos",
        "--description",
        "rooms",
        "--all-can-pin",
        "on",
        "--only-admins-add",
        "off",
        "--json",
      ],
      adapter,
    )
    const shown = await tg(["g-group", "chats", "link", "show", "Valencia", "--json"], adapter)
    const reset = await tg(["g-group", "chats", "link", "reset", "Valencia", "--json"], adapter)

    expect([updated.code, shown.code, reset.code]).toEqual([0, 0, 0])
    expect(changed).toEqual([
      [chat.id, { title: "Pisos", description: "rooms", settings: { allCanPin: true, onlyAdminsAdd: false } }],
    ])
    expect(JSON.parse(shown.stdout[0] ?? "")).toMatchObject({ link: "https://t.me/+old" })
    expect(journal("g-group").map((entry) => entry.action)).toEqual(["update", "link.reset"])
  })

  it("**lists join requests and answers one through the guard**", async () => {
    const answered: string[] = []
    const request = { person: { id: "91", name: "Synthetic", username: null }, requestedAt: "2026-10-07T18:00:00.000Z" }
    const adapter = scripted({
      people: async (references) => references,
      joinRequests: async (_chat, { limit }) => ({ items: [request].slice(0, limit), hasMore: false }),
      answerJoinRequest: async (_chat, person, accept) => {
        answered.push(`${accept ? "accept" : "decline"} ${person}`)
        return { already: false }
      },
    })

    const listed = await tg(["g-requests", "chats", "requests", "list", "Valencia", "--limit", "1", "--json"], adapter)
    const accepted = await tg(["g-requests", "chats", "requests", "accept", "Valencia", "91", "--json"], adapter)
    const declined = await tg(["g-requests", "chats", "requests", "decline", "Valencia", "92", "--json"], adapter)

    expect([listed.code, accepted.code, declined.code]).toEqual([0, 0, 0])
    expect(JSON.parse(listed.stdout[0] ?? "")).toMatchObject({ items: [request], hasMore: false })
    expect(answered).toEqual(["accept 91", "decline 92"])
    expect(journal("g-requests").map((entry) => entry.action)).toEqual(["requests.accept", "requests.decline"])
  })

  it("**turns join approval on and makes a link that needs it** through the guard", async () => {
    const changed: unknown[] = []
    const made: unknown[] = []
    const card = {
      ...chat,
      description: null,
      link: null,
      settings: {
        allCanPin: null,
        onlyAdminsAdd: null,
        onlyAdminsCall: null,
        onlyOwnerEditsInfo: null,
        membersSeeLink: null,
        joinApproval: true,
      },
    }
    const adapter = scripted({
      updateGroup: async (_chat, change) => {
        changed.push(change)
        return card
      },
      createInviteLink: async (_chat, options) => {
        made.push(options)
        return { link: "https://t.me/+extra", approval: options.approval, expiresAt: null, maxUses: null }
      },
    })

    const on = await tg(["g-approval", "chats", "update", "Valencia", "--join-approval", "on", "--json"], adapter)
    const link = await tg(
      [
        "g-approval",
        "chats",
        "link",
        "create",
        "Valencia",
        "--approval",
        "--expire-time",
        "7d",
        "--max-uses",
        "5",
        "--json",
      ],
      adapter,
    )

    expect([on.code, link.code]).toEqual([0, 0])
    expect(changed).toEqual([{ settings: { joinApproval: true } }])
    expect(made).toEqual([{ approval: true, expiresAt: expect.any(String), maxUses: 5 }])
    expect(journal("g-approval").map((entry) => entry.action)).toEqual(["settings", "link.create"])
  })

  it("**answers every request and lists and revokes links** through the guard", async () => {
    const answered: unknown[] = []
    const link = { link: "https://t.me/+extra", approval: true, expiresAt: null, maxUses: null, pending: 1 }
    const adapter = scripted({
      joinRequests: async () => ({ items: [], hasMore: false, total: 1 }),
      answerAllJoinRequests: async (_chat, accept, by) => {
        answered.push([accept, by])
      },
      inviteLinks: async () => ({ items: [link], hasMore: false }),
      revokeInviteLink: async () => ({ ...link, revoked: true }),
    })

    const all = await tg(
      ["g-bulk", "chats", "requests", "accept", "Valencia", "--all", "--link", "https://t.me/+extra", "--json"],
      adapter,
    )
    const declined = await tg(
      ["g-bulk", "chats", "requests", "decline", "Valencia", "--all", "--link", "https://t.me/+other", "--json"],
      adapter,
    )
    const listed = await tg(
      ["g-bulk", "chats", "link", "list", "Valencia", "--revoked", "--limit", "5", "--json"],
      adapter,
    )
    const revoked = await tg(
      ["g-bulk", "chats", "link", "revoke", "Valencia", "https://t.me/+extra", "--json"],
      adapter,
    )

    expect([all.code, declined.code, listed.code, revoked.code]).toEqual([0, 0, 0, 0])
    expect(answered).toEqual([
      [true, "https://t.me/+extra"],
      [false, "https://t.me/+other"],
    ])
    expect(journal("g-bulk").map((entry) => entry.action)).toEqual([
      "requests.accept",
      "requests.decline",
      "link.revoke",
    ])
  })

  it("**narrows join requests by name or by link**", async () => {
    const asked: unknown[] = []
    const adapter = scripted({
      joinRequests: async (_chat, window) => {
        asked.push(window)
        return { items: [], hasMore: false, total: 0 }
      },
    })

    const byName = await tg(["g-narrow", "chats", "requests", "list", "Valencia", "--search", "Ana", "--json"], adapter)
    const byLink = await tg(
      ["g-narrow", "chats", "requests", "list", "Valencia", "--link", "https://t.me/+extra", "--json"],
      adapter,
    )

    expect([byName.code, byLink.code]).toEqual([0, 0])
    expect(asked).toMatchObject([{ search: "Ana" }, { link: "https://t.me/+extra" }])
  })

  it("**deletes a topic only once the owner says so**", async () => {
    const deleted: unknown[] = []
    const adapter = scripted({
      deleteTopic: async (chatId, topicId) => {
        deleted.push([chatId, topicId])
      },
    })

    const unasked = await tg(["g-topic-del", "topics", "delete", "Valencia", "12", "--json"], adapter)
    const done = await tg(["g-topic-del", "topics", "delete", "Valencia", "12", "--allow-dangerous", "--json"], adapter)

    expect(unasked.code).not.toBe(0)
    expect(done.code).toBe(0)
    expect(deleted).toHaveLength(1)
    expect(journal("g-topic-del").map((entry) => entry.outcome)).toEqual(["refused", "sent"])
  })

  it("**creates a quiz** with its right answer and solution", async () => {
    const polls: unknown[] = []
    const adapter = scripted({
      createPoll: async (_chat, poll, { sendId }) => {
        polls.push(poll)
        return { sendId, message: message("81", { outgoing: true }) }
      },
    })

    const made = await tg(
      [
        "g-quiz",
        "polls",
        "create",
        "Valencia",
        "2+2?",
        "3",
        "4",
        "--quiz",
        "--correct",
        "2",
        "--solution",
        "four",
        "--json",
      ],
      adapter,
    )

    expect(made.code).toBe(0)
    expect(polls).toMatchObject([{ quiz: { correct: 1, solution: "four" } }])
  })

  it("**adds and removes members and admins through the guard**", async () => {
    const done: string[] = []
    const adapter = scripted({
      people: async (references) => references.map((_, index) => String(91 + index)),
      addMembers: async (_chat, people) => {
        done.push(`add ${people.join(",")}`)
        return { notAdded: [] }
      },
      removeMembers: async (_chat, people) => {
        done.push(`remove ${people.join(",")}`)
      },
      addAdmin: async (_chat, person, rights) => {
        done.push(`admin ${person} ${rights.join(",")}`)
      },
      removeAdmin: async (_chat, person) => {
        done.push(`unadmin ${person}`)
      },
    })

    const codes = [
      (await tg(["g-members", "chats", "members", "add", "Valencia", "Ivan", "Olga"], adapter)).code,
      (await tg(["g-members", "chats", "members", "remove", "Valencia", "Ivan"], adapter)).code,
      (await tg(["g-members", "chats", "admins", "add", "Valencia", "Ivan", "--can", "pin,delete"], adapter)).code,
      (await tg(["g-members", "chats", "admins", "remove", "Valencia", "Ivan"], adapter)).code,
    ]

    expect(codes).toEqual([0, 0, 0, 0])
    expect(done).toEqual(["add 91,92", "remove 91", "admin 91 pin,delete", "unadmin 91"])
    expect(journal("g-members").map((entry) => entry.action)).toEqual([
      "members.add",
      "members.remove",
      "admins.add",
      "admins.remove",
    ])
  })

  it("**changes chat folders through the guard**", async () => {
    const done: string[] = []
    const adapter = scripted({
      folders: async () => [{ id: "2", title: "Work", chatIds: [] }],
      createFolder: async (title, chatIds) => {
        done.push(`create ${title} ${chatIds.join(",")}`)
        return { id: "3", title, chatIds }
      },
      updateFolder: async (id, change) => {
        done.push(`update ${id} ${JSON.stringify(change)}`)
        return { id, title: "Work", chatIds: [] }
      },
      deleteFolder: async (id) => {
        done.push(`delete ${id}`)
      },
      orderFolders: async (ids) => {
        done.push(`order ${ids.join(",")}`)
      },
      joinFolder: async (link) => {
        done.push(`join ${link}`)
        return { id: "4", title: "Shared", chatIds: [] }
      },
    })

    const codes = [
      (await tg(["g-folders", "chats", "folders", "list"], adapter)).code,
      (await tg(["g-folders", "chats", "folders", "create", "Home", "--chat", "Valencia"], adapter)).code,
      (
        await tg(
          [
            "g-folders",
            "chats",
            "folders",
            "update",
            "Work",
            "--title",
            "Job",
            "--add",
            "Valencia",
            "--remove",
            "Valencia",
          ],
          adapter,
        )
      ).code,
      (await tg(["g-folders", "chats", "folders", "delete", "Work"], adapter)).code,
      (await tg(["g-folders", "chats", "folders", "order", "Work"], adapter)).code,
      (await tg(["g-folders", "chats", "folders", "join", "https://t.me/addlist/abc"], adapter)).code,
    ]

    expect(codes).toEqual([0, 0, 0, 0, 0, 0])
    expect(done).toEqual([
      `create Home ${chat.id}`,
      `update 2 {"title":"Job","add":["${chat.id}"],"remove":["${chat.id}"]}`,
      "delete 2",
      "order 2",
      "join https://t.me/addlist/abc",
    ])
    expect(journal("g-folders").map((entry) => entry.action)).toEqual([
      "folder-create",
      "folder-update",
      "folder-delete",
      "folder-order",
      "folder-join",
    ])
  })

  it("**changes the profile and ends other sessions through the guard**", async () => {
    const photo = join(mkdtempSync(join(tmpdir(), "tg-photo-")), "me.jpg")
    writeFileSync(photo, new Uint8Array([0xff, 0xd8]))
    const done: string[] = []
    const adapter = scripted({
      updateProfile: async (change) => {
        done.push(`profile ${Object.keys(change).join(",")}`)
        return { id: "1", name: "New", username: null }
      },
      endOtherSessions: async () => {
        done.push("end")
        return []
      },
    })

    const codes = [
      (
        await tg(
          [
            "g-profile",
            "account",
            "update",
            "--first-name",
            "New",
            "--last-name",
            "Name",
            "--description",
            "hi",
            "--photo",
            photo,
          ],
          adapter,
        )
      ).code,
      (await tg(["g-profile", "account", "sessions", "end", "--others", "--yes"], adapter)).code,
    ]

    expect(codes).toEqual([0, 0])
    expect(done).toEqual(["profile firstName,lastName,description,photo", "end"])
    expect(journal("g-profile").map((entry) => entry.action)).toEqual(["profile", "sessions-end"])
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
