import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { Readable } from "node:stream"
import { CliError } from "@leemour/cli-core"
import { pickChat } from "@leemour/cli-messaging"
import { describe, expect, it } from "vitest"
import { chat, message, scripted, tg } from "./testing/scripted.js"

describe("machine output", () => {
  it("writes one JSON value to stdout and nothing to stderr", async () => {
    const { code, stdout, stderr } = await tg(["chats", "list", "--json"])

    expect(code).toBe(0)
    expect(stdout).toHaveLength(1)
    expect(JSON.parse(stdout[0] ?? "")).toEqual({ items: [chat], page: 1, limit: 20, hasMore: false })
    expect(stderr).toEqual([])
  })

  it("pages chats through the shared flags, and refuses --all with --page", async () => {
    let asked: unknown
    const { code, stdout } = await tg(["chats", "list", "--limit", "5", "--page", "3"], {
      adapter: () =>
        scripted({
          chats: async (window) => {
            asked = window
            return { items: [chat], hasMore: true }
          },
        }),
    })

    expect(code).toBe(0)
    expect(asked).toEqual({ limit: 5, offset: 10 })
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ page: 3, limit: 5, hasMore: true })
    expect((await tg(["chats", "list", "--all", "--page", "2"])).code).toBe(2)
  })

  it("reads the first word as the profile", async () => {
    let profile = ""
    await tg(["work", "chats", "list"], {
      adapter: (options) => {
        profile = options.sessionPath
        return scripted()
      },
    })
    expect(profile).toMatch(/work\.session$/)
  })

  it("keeps every id a string", async () => {
    const { stdout } = await tg(["messages", "list", "Valencia"])
    const [item] = JSON.parse(stdout[0] ?? "").items

    expect(typeof item.id).toBe("string")
    expect(typeof item.chatId).toBe("string")
  })

  it("prints one message per line with --jsonl", async () => {
    const two = [message("42"), message("2")]
    const { stdout } = await tg(["messages", "list", "Valencia", "--jsonl"], {
      adapter: () => scripted({ history: async () => ({ items: two, hasMore: false }) }),
    })

    expect(stdout.map((line) => JSON.parse(line).id)).toEqual(["42", "2"])
  })

  it("says a failure on stderr as JSON, with the exit code for its kind", async () => {
    const { code, stdout, stderr } = await tg(["account", "show"], { env: { ...process.env }, adapter: undefined })

    expect(code).toBe(4)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.code).toBe("authentication_error")
  })
})

describe("a chat named ambiguously", () => {
  it("**lists the candidates with exit 2**, although the error comes from cli-messaging's copy of cli-core", async () => {
    const twoMatches = () =>
      scripted({
        history: async (reference) => {
          pickChat(reference, [chat, { ...chat, id: "-1009", title: "Valencia housing" }])
          return { items: [], hasMore: false }
        },
      })
    const { code, stdout, stderr } = await tg(["messages", "list", "Valencia"], { adapter: twoMatches })

    expect(code).toBe(2)
    expect(stdout).toEqual([])
    expect(JSON.parse(stderr[0] ?? "").error.candidates).toHaveLength(2)
  })
})

describe("a person at a terminal", () => {
  it("gets the message feed as lines, not one escaped line", async () => {
    const { code, stdout } = await tg(["messages", "list", "Valencia"], { tty: true })
    const printed = stdout.join("\n")

    expect(code).toBe(0)
    expect(printed.split("\n").length).toBeGreaterThan(1)
    expect(printed).not.toContain("\\x0a")
    expect(printed).toContain(message("42").text)
  })
})

describe("sending", () => {
  it("reads the text from stdin when none is given", async () => {
    const { code, stdout } = await tg(["messages", "send", "me", "--send-id", "-9001"], {
      stdin: Readable.from(["from a pipe"]),
    })

    expect(code).toBe(0)
    expect(JSON.parse(stdout[0] ?? "")).toMatchObject({ sendId: "-9001", message: { text: "from a pipe" } })
  })

  it("hands back the send id when the outcome is unknown, so a repeat cannot make a second copy", async () => {
    const unknown = () =>
      scripted({
        send: async () => {
          throw new CliError("outcome_unknown", "no answer", { sendId: "-9001" })
        },
      })
    const { code, stderr } = await tg(["messages", "send", "me", "hi"], { adapter: unknown })

    expect(code).toBe(14)
    expect(JSON.parse(stderr[0] ?? "").error.sendId).toBe("-9001")
  })

  it("hands --silent, --no-preview and --md to the adapter, the marks taken out of the text", async () => {
    const asked: unknown[] = []
    const { code } = await tg(["messages", "send", "me", "**hola**", "--silent", "--no-preview", "--md"], {
      adapter: () =>
        scripted({
          send: async (_chat, text, options) => {
            asked.push({ text, ...options })
            return { message: message("43", { text, outgoing: true }), sendId: options.sendId }
          },
        }),
    })

    expect(code).toBe(0)
    expect(asked[0]).toMatchObject({
      text: "hola",
      silent: true,
      noPreview: true,
      markup: [{ type: "bold", from: 0, length: 4 }],
    })
  })

  it("refuses an empty message before connecting", async () => {
    let opened = false
    const { code } = await tg(["messages", "send", "me"], {
      stdin: Readable.from([""]),
      adapter: () => {
        opened = true
        return scripted()
      },
    })

    expect(code).toBe(2)
    expect(opened).toBe(false)
  })
})

describe("app credentials out of reach", () => {
  it("says the keyring is probably out of reach when this profile has logged in here, rather than to log in", async () => {
    const env = { ...process.env, TG_API_ID: undefined, TG_API_HASH: undefined }
    const sessions = join(process.env.TG_STATE_DIR as string, "sessions")
    mkdirSync(sessions, { recursive: true })
    writeFileSync(join(sessions, "reach.session"), "")

    const loggedIn = await tg(["reach", "chats", "list", "--json"], { env })
    const never = await tg(["never", "chats", "list", "--json"], { env })

    expect(loggedIn.code).toBe(4)
    expect(loggedIn.stderr.join("\n")).toContain("XDG_RUNTIME_DIR")
    expect(never.stderr.join("\n")).toContain("session start")
    expect(never.stderr.join("\n")).not.toContain("XDG_RUNTIME_DIR")
  })
})
