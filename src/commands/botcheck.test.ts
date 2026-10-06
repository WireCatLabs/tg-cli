import { afterEach, describe, expect, it, vi } from "vitest"
import { scripted, tg } from "../testing/scripted.js"

const person = () =>
  scripted({
    contact: async () => ({
      id: "40",
      name: "",
      username: null,
      description: null,
      lastMessagedAt: null,
      chats: [],
    }),
    photos: async () => ({ count: 1, oldestAt: new Date().toISOString() }),
    members: async () => ({
      chatId: "-1001234567890",
      hasMore: false,
      items: [{ id: "40", name: "", username: null, isBot: true }],
    }),
  })

const asked: string[] = []
const banLists = async (input: string | URL) => {
  asked.push(new URL(String(input)).hostname)
  return new Response(
    String(input).includes("lols")
      ? JSON.stringify({ ok: true, user_id: 40, banned: true })
      : JSON.stringify({ ok: false, description: "Record not found." }),
    { status: 200 },
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  asked.length = 0
})

describe("contacts check through tg", () => {
  it("asks both ban lists for a Telegram account, and none with --no-registries", async () => {
    vi.stubGlobal("fetch", banLists)

    const checked = await tg(["contacts", "check", "40", "--json"], { adapter: person })
    const quiet = await tg(["contacts", "check", "40", "--no-registries", "--json"], { adapter: person })

    expect(checked.code).toBe(0)
    const answer = JSON.parse(checked.stdout[0] ?? "null")
    expect(answer.person.provider).toBe("telegram")
    expect(answer.registries.map(({ name, answer }: { name: string; answer: string }) => [name, answer])).toEqual([
      ["cas", "clean"],
      ["lols", "listed"],
    ])
    expect(answer.reasons.map(({ reason }: { reason: string }) => reason)).toEqual(
      expect.arrayContaining(["lols_banned", "photo_recent", "no_bio"]),
    )
    expect(quiet.code).toBe(0)
    expect(JSON.parse(quiet.stdout[0] ?? "null").registries).toEqual([])
    expect(asked.sort()).toEqual(["api.cas.chat", "api.lols.bot"])
  })

  it("checks the audit's top member in full with chats members audit --deep", async () => {
    vi.stubGlobal("fetch", banLists)

    const { code, stdout } = await tg(["chats", "members", "audit", "-1001234567890", "--deep", "1", "--json"], {
      adapter: person,
    })

    expect(code).toBe(0)
    const [top] = JSON.parse(stdout[0] ?? "null").items
    expect(top.id).toBe("40")
    expect(top.check.registries.map(({ answer }: { answer: string }) => answer)).toEqual(["clean", "listed"])
  })
})
