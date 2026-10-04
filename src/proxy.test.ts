import * as v from "valibot"
import { describe, expect, it } from "vitest"
import { parseProxy, proxyLabel, proxySetting } from "./proxy.js"

const MT_SECRET = `ee${"00".repeat(16)}${Buffer.from("example.com").toString("hex")}`

describe("parseProxy", () => {
  it("reads a SOCKS5 URL, decoding its user and password", () => {
    expect(parseProxy("socks5://me%40home:p%3Ass@10.0.0.1:1081", "TG_PROXY")).toEqual({
      kind: "socks5",
      host: "10.0.0.1",
      port: 1081,
      tls: false,
      user: "me@home",
      secret: "p:ss",
    })
    expect(parseProxy("socks5://proxy.example", "TG_PROXY")).toMatchObject({ port: 1080 })
  })

  it("reads an HTTP CONNECT proxy, and https:// as one reached over TLS", () => {
    expect(parseProxy("http://u:p@proxy.example:3128", "TG_PROXY")).toEqual({
      kind: "http",
      host: "proxy.example",
      port: 3128,
      tls: false,
      user: "u",
      secret: "p",
    })
    expect(parseProxy("https://proxy.example", "TG_PROXY")).toMatchObject({ kind: "http", tls: true, port: 443 })
  })

  it("reads an MTProxy link in its tg:// and t.me forms", () => {
    const expected = { kind: "mtproxy", host: "mt.example", port: 443, tls: false, secret: MT_SECRET }

    expect(parseProxy(`tg://proxy?server=mt.example&port=443&secret=${MT_SECRET}`, "TG_PROXY")).toEqual(expected)
    expect(parseProxy(`https://t.me/proxy?server=mt.example&port=443&secret=${MT_SECRET}`, "TG_PROXY")).toEqual(
      expected,
    )
  })

  it("reads Telegram's SOCKS share link as a SOCKS5 proxy", () => {
    expect(parseProxy("tg://socks?server=s.example&port=1080&user=u&pass=p", "TG_PROXY")).toEqual({
      kind: "socks5",
      host: "s.example",
      port: 1080,
      tls: false,
      user: "u",
      secret: "p",
    })
  })

  it("refuses what it cannot use without quoting it, since it may hold a password", () => {
    for (const text of ["socks4://u:hunter2@h:1", "not a url hunter2", "tg://proxy?server=h&secret=hunter2"]) {
      const error = (() => {
        try {
          parseProxy(text, "TG_PROXY")
        } catch (thrown) {
          return thrown as Error & { code: string }
        }
      })()
      expect(error?.code).toBe("configuration_error")
      expect(error?.message).toContain("TG_PROXY")
      expect(error?.message).not.toContain("hunter2")
    }
  })
})

describe("proxyLabel", () => {
  it("leaves out the password and the MTProxy secret", () => {
    expect(proxyLabel(parseProxy("socks5://u:hunter2@h:1080", "x"))).toBe("socks5://u@h:1080")
    expect(proxyLabel(parseProxy("https://u:hunter2@h", "x"))).toBe("https://u@h:443")
    expect(proxyLabel(parseProxy(`tg://proxy?server=h&port=443&secret=${MT_SECRET}`, "x"))).toBe(
      "tg://proxy?server=h&port=443",
    )
  })
})

describe("the proxy setting", () => {
  it("takes a URL without its secret, and refuses one with it", () => {
    expect(v.safeParse(proxySetting, "socks5://u@h:1080").success).toBe(true)
    expect(v.safeParse(proxySetting, "tg://proxy?server=h&port=443").success).toBe(true)
    expect(v.safeParse(proxySetting, "socks5://u:p@h:1080").success).toBe(false)
    expect(v.safeParse(proxySetting, `tg://proxy?server=h&port=443&secret=${MT_SECRET}`).success).toBe(false)
  })
})
