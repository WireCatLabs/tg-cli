import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { openStore } from "@wirecat/cli-core/store"
import { expect, it } from "vitest"
import { toChat } from "./map.js"

const account = { provider: "telegram", account: "1" }
const dialog = (username: string | null, isPinned: boolean) =>
  toChat({
    peer: { type: "user", id: 42, displayName: "Ana", username, isBot: false },
    isPinned,
    isArchived: false,
    isMuted: null,
    unreadCount: 0,
    unreadMentionsCount: 0,
    lastMessage: null,
  } as never)

it("clears a stored username and pin once the dialog no longer has them", async () => {
  const store = await openStore({ path: join(mkdtempSync(join(tmpdir(), "tg-chat-meta-")), "messages.db") })
  try {
    await store.chats.saveChats(account, [dialog("ana_old", true)])
    await store.chats.saveChats(account, [dialog(null, false)])
    const [stored] = (await store.chats.chats(account, {})).items
    expect(stored?.providerMetadata?.username ?? undefined).toBeUndefined()
    expect(stored?.providerMetadata?.pinned ?? undefined).toBeUndefined()
  } finally {
    await store.close()
  }
})
