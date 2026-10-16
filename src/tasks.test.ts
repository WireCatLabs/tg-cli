import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { captureStreams, memoryKeyring, resolvePaths, writeSecurely } from "@wirecat/cli-base"
import { rememberAccount } from "@wirecat/cli-core/cli"
import { openStore } from "@wirecat/cli-core/store"
import { beforeAll, describe, expect, it } from "vitest"
import { TG as app } from "./app.js"
import { run } from "./program.js"

const account = { provider: "telegram", account: "601" }
const profile = "tasks-local"
const PROMISE = "msg:telegram/601/7/101"
const cli = async (words: string[], picked = profile, env: NodeJS.ProcessEnv = process.env) => {
  const streams = captureStreams()
  const code = await run([picked, ...words], {
    streams,
    env,
    tty: false,
    keyring: memoryKeyring(),
    adapter: () => {
      throw new Error("tasks never connect")
    },
  })
  return { code, out: streams.stdout.join("\n"), err: streams.stderr.join("\n") }
}

beforeAll(async () => {
  rememberAccount(app, profile, account.account, process.env)
  rememberAccount(app, "tasks-readonly", account.account, process.env)
  const store = await openStore()
  try {
    const chat = { id: "7", title: "Synthetic Group", kind: "group" as const }
    await store.chats.saveChats(account, [{ ...chat, unreadCount: 0, lastMessageAt: null, participantsCount: null }])
    await store.messages.saveMessages(
      account,
      "7",
      [
        {
          id: "101",
          chatId: "7",
          senderId: "11",
          senderName: "Ana",
          text: "I'll send the invoice tomorrow",
          timestamp: "2026-10-06T10:00:00Z",
          editedAt: null,
          outgoing: false,
          attachments: [],
          replyTo: null,
          forwardedFrom: null,
          reactions: null,
        },
      ],
      { via: "fixture" },
    )
  } finally {
    await store.close()
  }
  const paths = resolvePaths({ appName: app.appName, prefix: app.envPrefix })
  mkdirSync(paths.config, { recursive: true, mode: 0o700 })
  writeSecurely(
    join(paths.config, "config.json"),
    JSON.stringify({ profiles: { "tasks-readonly": { permissions: { tasks: "readonly" } } } }),
    0o600,
  )
})

describe("tasks through tg", () => {
  it("adds, lists, counts and closes a task in the local store without connecting", async () => {
    const added = await cli(["tasks", "add", PROMISE, "--type", "promise", "--category", "other", "--json"])
    expect(added.code, added.err).toBe(0)
    const { id } = JSON.parse(added.out).item

    const listed = await cli(["tasks", "list", "state:open", "kind:promise", "--limit", "5", "--json"])
    expect(listed.code, listed.err).toBe(0)
    expect(JSON.parse(listed.out).items).toMatchObject([{ id, kind: "promise", state: "open" }])

    const counted = await cli(["stats", "tasks", "show", "--chat", "7", "--type", "promise", "--json"])
    expect(JSON.parse(counted.out).item).toMatchObject({ open: 1, rows: [{ chat: "chat:telegram/601/7", open: 1 }] })

    const closed = await cli(["tasks", "close", id, "--as", "dismissed", "--reason", "no-reply-needed", "--json"])
    expect(closed.code, closed.err).toBe(0)
    expect(JSON.parse(closed.out).item).toMatchObject({ state: "dismissed", reason: "no-reply-needed" })
  })

  it("an agent's close states its certainty; an unsure one waits for the owner to reject or close it", async () => {
    const added = await cli([
      "tasks",
      "add",
      "msg:telegram/601/7/102",
      "--type",
      "promise",
      "--category",
      "other",
      "--json",
    ])
    expect(added.code, added.err).toBe(0)
    const { id } = JSON.parse(added.out).item
    const agent = { ...process.env, AI_AGENT: "claude-code_2-1-296_agent" }

    const bare = await cli(["tasks", "close", id, "--as", "done", "--json"], profile, agent)
    expect([bare.code, bare.err]).toEqual([2, expect.stringContaining("certainty")])
    const unsure = await cli(["tasks", "close", id, "--as", "done", "--certainty", "0.5", "--json"], profile, agent)
    expect(JSON.parse(unsure.out).item).toMatchObject({ state: "open", close_suggestion: { certainty: 0.5 } })

    const rejected = await cli(["tasks", "reject", id, "--as-owner", "--json"], profile, agent)
    expect(JSON.parse(rejected.out).item).toMatchObject({ status: "open", close_suggestion: null })

    const closed = await cli(["tasks", "close", id, "--as", "done", "--as-owner", "--json"], profile, agent)
    expect(JSON.parse(closed.out).item).toMatchObject({ state: "done" })
  })

  it("refuses task writes on a profile where tasks are read-only", async () => {
    expect(
      (await cli(["tasks", "add", PROMISE, "--type", "promise", "--category", "other", "--json"], "tasks-readonly"))
        .code,
    ).toBe(5)
  })
})
