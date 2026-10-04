import { readFileSync } from "node:fs"
import { Readable } from "node:stream"
import { memoryKeyring } from "@leemour/cli-core/testing"
import { describe, expect, it } from "vitest"
import { proxySecrets } from "../telegram/proxy.js"
import { tg } from "../testing/scripted.js"

const json = (stdout: string[]) => JSON.parse(stdout[0] ?? "")
const piped = (line: string) => Object.assign(Readable.from([`${line}\n`]), { isTTY: false })
const MT_SECRET = `ee${"00".repeat(16)}${Buffer.from("example.com").toString("hex")}`

describe("config set proxy", () => {
  it("keeps the password in the keyring and the URL without it in the file, and prints neither secret", async () => {
    const keyring = memoryKeyring()
    const set = await tg(["proxied", "config", "set", "proxy", "-", "--json"], {
      keyring,
      stdin: piped("socks5://u:hunter2@proxy.example:1080"),
    })

    expect(set.code).toBe(0)
    expect(json(set.stdout)).toMatchObject({ setting: "proxy", value: "socks5://u@proxy.example:1080" })
    expect([...set.stdout, ...set.stderr].join("\n")).not.toContain("hunter2")
    expect(readFileSync(json(set.stdout).configFile, "utf8")).not.toContain("hunter2")
    expect(proxySecrets({ keyring }).read("socks5://u@proxy.example:1080")).toBe("hunter2")

    const doctor = await tg(["proxied", "doctor", "--json"], { keyring })
    expect(json(doctor.stdout).telegram.proxy).toEqual({
      url: "socks5://u@proxy.example:1080",
      from: "config file",
      botApi: "through it",
    })
    expect(doctor.stdout.join("\n")).not.toContain("hunter2")

    expect((await tg(["proxied", "config", "unset", "proxy"], { keyring })).code).toBe(0)
    expect(proxySecrets({ keyring }).read("socks5://u@proxy.example:1080")).toBeUndefined()
  })

  it("keeps an MTProxy secret out of the file too, and says the Bot API cannot follow it", async () => {
    const keyring = memoryKeyring()
    const link = `tg://proxy?server=mt.example&port=443&secret=${MT_SECRET}`
    const set = await tg(["mtproxied", "config", "set", "proxy", "-", "--json"], { keyring, stdin: piped(link) })

    expect(json(set.stdout).value).toBe("tg://proxy?server=mt.example&port=443")
    expect(readFileSync(json(set.stdout).configFile, "utf8")).not.toContain(MT_SECRET)
    const doctor = json((await tg(["mtproxied", "doctor", "--json"], { keyring })).stdout)
    expect(doctor.telegram.proxy.botApi).toMatch(/^direct/)

    await tg(["mtproxied", "config", "unset", "proxy"], { keyring })
  })

  it("refuses an MTProxy secret that cannot work, without quoting it", async () => {
    const { code, stderr } = await tg(["config", "set", "proxy", "-"], {
      stdin: piped("tg://proxy?server=h&port=443&secret=deadbeef"),
    })

    expect(code).toBe(2)
    expect(stderr.join("\n")).not.toContain("deadbeef")
  })

  it("refuses a password on the command line, where ps and shell history would keep it", async () => {
    const { code, stderr } = await tg(["config", "set", "proxy", "socks5://u:hunter2@h:1080"])

    expect(code).toBe(2)
    expect(stderr.join("\n")).toContain("config set proxy -")
    expect(stderr.join("\n")).not.toContain("hunter2")
  })

  it("takes a proxy without a password on the command line", async () => {
    const set = await tg(["plain", "config", "set", "proxy", "http://proxy.example:3128", "--json"])

    expect(json(set.stdout).value).toBe("http://proxy.example:3128")
    await tg(["plain", "config", "unset", "proxy"])
  })

  it("is one setting for the account and its bot, so --bot is refused", async () => {
    expect((await tg(["config", "set", "--bot", "proxy", "socks5://h:1080"])).code).toBe(2)
  })

  it("lets TG_PROXY win over the file, and doctor names it without its password", async () => {
    const doctor = await tg(["doctor", "--json"], {
      env: { ...process.env, TG_API_ID: "1", TG_API_HASH: "h", TG_PROXY: "http://u:hunter2@env.example:3128" },
    })

    expect(json(doctor.stdout).telegram.proxy).toMatchObject({ url: "http://u@env.example:3128", from: "TG_PROXY" })
    expect(doctor.stdout.join("\n")).not.toContain("hunter2")
  })
})
