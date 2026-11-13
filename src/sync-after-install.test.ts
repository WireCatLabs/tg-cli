import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { captureStreams, memoryKeyring } from "@wirecat/cli-base"
import type { Message } from "@wirecat/cli-core"
import { syncAfterInstallCases } from "@wirecat/cli-core/testing"
import { describe, it } from "vitest"
import { run } from "./program.js"
import { scripted } from "./testing/scripted.js"

const CHAT = "1234567890"
const message: Message = {
  id: "101",
  chatId: CHAT,
  senderId: "777",
  senderName: "Ana",
  timestamp: "2026-09-26T10:00:00.000Z",
  editedAt: null,
  text: "invoice #7 paid",
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
}

describe("sync runs right after install, whatever the shared WireCat config holds", () => {
  for (const one of syncAfterInstallCases({
    sync: ["archive", "messages", "sync", CHAT, "--limit", "100", "--pause", "1ms"],
    run: async (argv, env) => {
      const streams = captureStreams()
      const code = await run(argv, {
        streams,
        tty: false,
        keyring: memoryKeyring(),
        env: {
          ...process.env,
          MESSAGING_STORE: join(mkdtempSync(join(tmpdir(), "tg-install-")), "messages.db"),
          TG_API_ID: "1",
          TG_API_HASH: "h",
          ...env,
        },
        adapter: () => scripted({ history: async () => ({ items: [message], hasMore: false }) }),
      })
      return { code, err: streams.stderr.join("\n") }
    },
  }))
    it(one.name, () => one.run())
})
