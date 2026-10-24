import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import { rememberAccount } from "@wirecat/cli-core/cli"
import { openStore } from "@wirecat/cli-core/store"
import { expect, it } from "vitest"
import { TG as app } from "./app.js"
import { run } from "./program.js"

it("authors local contact metadata and classifies cached channels without a messenger connection", async () => {
  const root = mkdtempSync(join(tmpdir(), "people-consumer-"))
  const env = {
    ...process.env,
    MESSAGING_STORE: join(root, "messages.db"),
    TG_CONFIG_DIR: join(root, "config"),
    TG_STATE_DIR: join(root, "state"),
  }
  rememberAccount(app, "default", "1", env)
  const key = { provider: "telegram", account: "1" }
  const store = await openStore({ path: env.MESSAGING_STORE })
  try {
    await store.people.savePeople(key, [{ id: "101", name: "Synthetic contact" }])
    await store.chats.saveChats(key, [
      { id: "99", title: "AI news", kind: "channel", unreadCount: 0, lastMessageAt: null, participantsCount: null },
    ])
    await store.chats.saveChatMetadata(key, {
      chatId: "99",
      title: "AI news",
      username: null,
      description: "Synthetic metadata",
    })
  } finally {
    await store.close()
  }
  const environment = {
    env,
    keyring: memoryKeyring(),
    adapter: async () => {
      throw new Error("local metadata must not connect")
    },
  }
  const call = async (argv: string[]) => {
    const streams = captureStreams()
    const code = await run(["--offline", ...argv, "--json"], { ...environment, streams, tty: false })
    expect(code, streams.stderr.join("")).toBe(0)
    return JSON.parse(streams.stdout.join(""))
  }
  expect(await call(["contacts", "aliases", "set", "101", "Local label"])).toMatchObject({
    item: { person_id: "101", alias: "Local label" },
  })
  const file = join(root, "own-note.md")
  writeFileSync(file, "Own synthetic note")
  const { item: note } = await call(["contacts", "notes", "add", "Local label", "--text-file", file])
  expect(await call(["contacts", "notes", "list", "101"])).toMatchObject({ items: [{ id: note.id }] })
  expect(await call(["contacts", "notes", "show", "101", note.id])).toMatchObject({
    item: { text: "Own synthetic note" },
  })
  expect(
    await call(["contacts", "notes", "edit", "101", note.id, "--revision", "1", "--text-file", file]),
  ).toMatchObject({
    item: { revision: 2 },
  })
  expect(await call(["contacts", "show", "101", "--with-notes"])).toMatchObject({
    item: { alias: "Local label", notes: [{ text: "Own synthetic note" }] },
  })
  expect(await call(["metadata", "show", "--chat", "99"])).toMatchObject({
    item: { metadata: { title: "AI news" } },
  })
  expect(await call(["tags", "rebuild", "--chat", "99", "--limit", "1", "--dry-run"])).toMatchObject({
    item: { dry_run: true },
  })
  await call(["tags", "rebuild", "--chat", "99", "--limit", "1"])
  expect(await call(["tags", "list"])).toMatchObject({
    items: [
      { tag: "ai", sources: ["auto"] },
      { tag: "news", sources: ["auto"] },
    ],
  })
  await call(["tags", "remove", "news", "--chat", "99", "--claim", "auto"])
  await call(["contacts", "notes", "remove", "101", note.id])
  await call(["contacts", "aliases", "remove", "101"])
})
