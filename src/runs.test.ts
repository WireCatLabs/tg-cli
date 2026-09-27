import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { CliError, captureStreams, memoryKeyring } from "@leemour/cli-core"
import type { Chat } from "@leemour/cli-messaging"
import { listRuns, runsDirFor } from "@leemour/cli-messaging/cli"
import { describe, expect, it } from "vitest"
import { TG } from "./app.js"
import type { Adapter } from "./commands/context.js"
import { run } from "./program.js"

const chat: Chat = {
  id: "-1001234567890",
  title: "Valencia expats",
  kind: "group",
  unreadCount: 0,
  lastMessageAt: null,
  participantsCount: 10,
}
const BODY = "the door code is 4321"

const adapter = (overrides: Partial<Adapter> = {}): Adapter => ({
  self: () => "1",
  login: async () => ({ id: "1", name: null, username: null }),
  me: async () => ({ id: "1", name: null, username: null }),
  chats: async () => ({ items: [chat], hasMore: false }),
  history: async () => ({ items: [], hasMore: false }),
  around: async () => [],
  resolve: async () => chat,
  send: async (chatId, text, { sendId }) => ({
    sendId,
    message: {
      id: "99",
      chatId,
      senderId: "1",
      senderName: null,
      timestamp: new Date().toISOString(),
      editedAt: null,
      text,
      outgoing: true,
      attachments: [],
      replyTo: null,
      forwardedFrom: null,
      reactions: null,
    },
  }),
  logout: async () => {},
  close: async () => {},
  ...overrides,
})

const tg = async (argv: string[], overrides: Partial<Adapter> = {}) => {
  const streams = captureStreams()
  const code = await run(argv, {
    streams,
    tty: false,
    keyring: memoryKeyring(),
    env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h" },
    adapter: () => adapter(overrides),
  })
  return { code, stdout: streams.stdout, stderr: streams.stderr }
}

const runsOf = (profile: string) => listRuns(runsDirFor(TG)).filter((one) => one.profile === profile)

const keptFor = (profile: string): string => {
  const dir = runsDirFor(TG)
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => readFileSync(join(entry.parentPath, entry.name), "utf8"))
    .filter((text) => text.includes(`"profile":"${profile}"`) || text.includes(`"profile": "${profile}"`))
    .join("\n")
}

describe("run records", () => {
  it("**keep a send's ids and never the chat's title or the text**", async () => {
    const { code, stdout } = await tg(["recorded", "messages", "send", "Valencia", BODY, "--record", "--json"])

    expect(code).toBe(0)
    expect(stdout).toHaveLength(1)
    expect(runsOf("recorded")[0]).toMatchObject({ command: "messages send", status: "success", requests: 2 })
    const kept = keptFor("recorded")
    expect(kept).toContain('"operation":"messages.send"')
    expect(kept).toContain('"chat":"-1001234567890"')
    expect(kept).not.toContain("Valencia")
    expect(kept).not.toContain(BODY)
  })

  it("keep a failed read with Telegram's name for the refusal", async () => {
    const { code } = await tg(["failing", "chats", "list"], {
      chats: async () => {
        throw new CliError("provider_error", "Telegram refused: CHAT_ADMIN_REQUIRED", {
          providerError: "CHAT_ADMIN_REQUIRED",
        })
      },
    })

    expect(code).toBe(11)
    expect(runsOf("failing")[0]).toMatchObject({
      status: "failed",
      errorCode: "provider_error",
      providerError: "CHAT_ADMIN_REQUIRED",
      keptBecauseFailed: true,
    })
  })

  it("are listed by `tg runs list` without it starting a run of its own", async () => {
    await tg(["listed", "account", "show", "--record"])
    const before = listRuns(runsDirFor(TG)).length

    const { code, stdout } = await tg(["runs", "list", "--json"])

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "").some((one: { profile: string }) => one.profile === "listed")).toBe(true)
    expect(listRuns(runsDirFor(TG))).toHaveLength(before)
  })
})
