import { mkdtempSync } from "node:fs"
import { createServer } from "node:net"
import { join } from "node:path"
import { memoryKeyring } from "@leemour/cli-core/testing"
import { HttpProxyTcpTransport, MtProxyTcpTransport, SocksProxyTcpTransport } from "@mtcute/node"
import { describe, expect, it } from "vitest"
import { parseProxy } from "../proxy.js"
import { TelegramAdapter } from "./adapter.js"
import { proxiedTransport, proxySecrets, resolveProxy } from "./proxy.js"

const MT_SECRET = `ee${"00".repeat(16)}${Buffer.from("example.com").toString("hex")}`
const settings = (
  configured: Record<string, unknown> = {},
  shared: Record<string, unknown> = {},
  profile = "default",
) => ({
  profile,
  configured,
  shared,
})

/** A loopback port nothing listens on: the connection is refused at once, and nothing leaves the machine. */
const closedPort = async () => {
  const server = createServer()
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const { port } = server.address() as { port: number }
  await new Promise((resolve) => server.close(resolve))
  return port
}

describe("resolveProxy", () => {
  it("prefers TG_PROXY to the profile's setting", () => {
    const resolved = resolveProxy(settings({ proxy: "socks5://profile.example:1080" }), {
      env: { TG_PROXY: "http://env.example:3128" },
      keyring: memoryKeyring(),
    })

    expect(resolved).toMatchObject({ from: "TG_PROXY", proxy: { kind: "http", host: "env.example" } })
  })

  it("takes the profile's setting over the defaults, and adds the secret kept in the keyring", () => {
    const keyring = memoryKeyring()
    const env = {}
    proxySecrets({ env, keyring }).write("default", "hunter2")
    proxySecrets({ env, keyring }).write(undefined, "from-defaults")

    const resolved = resolveProxy(
      settings({ proxy: "socks5://u@profile.example:1080" }, { proxy: "socks5://defaults.example:1080" }),
      { env, keyring },
    )

    expect(resolved).toEqual({
      from: "config file",
      proxy: { kind: "socks5", host: "profile.example", port: 1080, tls: false, user: "u", secret: "hunter2" },
    })
  })

  it("keeps a password per profile, so two profiles on one proxy can log in as different users", () => {
    const keyring = memoryKeyring()
    const env = {}
    proxySecrets({ env, keyring }).write("work", "secret-a")
    proxySecrets({ env, keyring }).write("home", "secret-b")
    const proxy = { proxy: "socks5://u@shared.example:1080" }

    expect(resolveProxy(settings(proxy, {}, "work"), { env, keyring })?.proxy.secret).toBe("secret-a")
    expect(resolveProxy(settings(proxy, {}, "home"), { env, keyring })?.proxy.secret).toBe("secret-b")
  })

  it("falls back to the defaults' password only for the defaults' proxy", () => {
    const keyring = memoryKeyring()
    const env = {}
    proxySecrets({ env, keyring }).write(undefined, "from-defaults")
    const shared = { proxy: "socks5://u@defaults.example:1080" }

    expect(resolveProxy(settings({}, shared, "plain"), { env, keyring })?.proxy.secret).toBe("from-defaults")
    proxySecrets({ env, keyring }).write("own", "s3cret")
    expect(resolveProxy(settings({}, shared, "own"), { env, keyring })?.proxy.secret).toBe("s3cret")
    expect(
      resolveProxy(settings({ proxy: "socks5://u@profile.example:1080" }, shared, "plain"), { env, keyring })?.proxy
        .secret,
    ).toBeUndefined()
  })

  it("does not read ALL_PROXY or HTTPS_PROXY", () => {
    expect(
      resolveProxy(settings(), {
        env: { ALL_PROXY: "socks5://a:1", HTTPS_PROXY: "http://b:2" },
        keyring: memoryKeyring(),
      }),
    ).toBeUndefined()
  })

  it("refuses an MTProxy whose secret is not in the keyring", () => {
    expect(() =>
      resolveProxy(settings({ proxy: "tg://proxy?server=mt.example&port=443" }), { env: {}, keyring: memoryKeyring() }),
    ).toThrow(/no secret is stored/)
  })
})

describe("proxiedTransport", () => {
  it("picks mtcute's transport for each kind of proxy", () => {
    const of = (url: string) => proxiedTransport(parseProxy(url, "x")).transport

    expect(of("socks5://h:1080")).toBeInstanceOf(SocksProxyTcpTransport)
    expect(of("http://h:3128")).toBeInstanceOf(HttpProxyTcpTransport)
    expect(of(`tg://proxy?server=h&port=443&secret=${MT_SECRET}`)).toBeInstanceOf(MtProxyTcpTransport)
  })

  it("refuses an MTProxy secret mtcute cannot read as a configuration error", () => {
    expect(() => proxiedTransport(parseProxy("tg://proxy?server=h&port=443&secret=abcd", "x"))).toThrow(
      expect.objectContaining({ code: "configuration_error" }),
    )
  })

  it("says the proxy cannot be reached, without its password, on the first failed connection", async () => {
    const port = await closedPort()
    const { transport, failed } = proxiedTransport(parseProxy(`socks5://u:hunter2@127.0.0.1:${port}`, "x"))

    await expect(
      transport.connect({ id: 2, ipAddress: "149.154.167.50", port: 443 }, new AbortController().signal),
    ).rejects.toThrow()
    const error = await failed.catch((thrown: Error & { code: string; details: unknown }) => thrown)

    expect(error).toMatchObject({ code: "configuration_error", details: { proxy: `socks5://u@127.0.0.1:${port}` } })
    expect(error.message).toContain("cannot be reached (ECONNREFUSED)")
    expect(error.message).not.toContain("hunter2")
  })
})

describe("TelegramAdapter through a proxy", () => {
  it("fails at once with the proxy's error, rather than waiting on Telegram", async () => {
    const port = await closedPort()
    const adapter = await TelegramAdapter.open({
      credentials: { id: 1, hash: "h" },
      sessionPath: join(mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "proxy-")), "default.session"),
      proxy: parseProxy(`http://127.0.0.1:${port}`, "x"),
      diagnostic: () => {},
    })
    try {
      await expect(adapter.me()).rejects.toMatchObject({ code: "configuration_error" })
    } finally {
      await adapter.close()
    }
  })
})
