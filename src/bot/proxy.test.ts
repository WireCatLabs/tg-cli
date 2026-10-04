import { createServer } from "node:http"
import { ProxyAgent, Socks5ProxyAgent } from "undici"
import { afterEach, describe, expect, it } from "vitest"
import { parseProxy } from "../proxy.js"
import { botDispatcher, proxiedFetch } from "./proxy.js"
import { TelegramBotTransport } from "./transport.js"

const TOKEN = "123456:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
const servers: { close: () => void }[] = []
afterEach(() => {
  for (const server of servers.splice(0)) server.close()
})

/** A loopback HTTP proxy that notes each CONNECT and answers it with `status`; nothing goes further. */
const fakeProxy = async (status: number) => {
  const seen: { target?: string; auth?: string }[] = []
  const server = createServer()
  server.on("connect", (request, socket) => {
    seen.push({
      ...(request.url ? { target: request.url } : {}),
      ...(request.headers["proxy-authorization"] ? { auth: request.headers["proxy-authorization"] } : {}),
    })
    socket.end(`HTTP/1.1 ${status} No\r\n\r\n`)
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  servers.push(server)
  return { port: (server.address() as { port: number }).port, seen }
}

describe("botDispatcher", () => {
  it("is undici's agent for SOCKS5 and HTTP, and none for an MTProxy", async () => {
    expect(await botDispatcher(parseProxy("socks5://h:1080", "x"))).toBeInstanceOf(Socks5ProxyAgent)
    expect(await botDispatcher(parseProxy("http://h:3128", "x"))).toBeInstanceOf(ProxyAgent)
    expect(
      await botDispatcher(parseProxy(`tg://proxy?server=h&port=443&secret=${"00".repeat(16)}`, "x")),
    ).toBeUndefined()
  })
})

describe("the Bot API through an HTTP proxy", () => {
  it("asks the proxy for a tunnel to api.telegram.org, with the proxy's credentials", async () => {
    const { port, seen } = await fakeProxy(407)
    const fetch = proxiedFetch(parseProxy(`http://u:hunter2@127.0.0.1:${port}`, "x"))
    const transport = new TelegramBotTransport({ token: TOKEN, ...(fetch ? { fetch } : {}) })

    const error = (await transport.call("getMe").catch((thrown: unknown) => thrown)) as Error & { code: string }

    expect(seen).toEqual([
      { target: "api.telegram.org:443", auth: `Basic ${Buffer.from("u:hunter2").toString("base64")}` },
    ])
    expect(error).toMatchObject({ code: "configuration_error" })
    expect(error.message).toContain(`the proxy http://u@127.0.0.1:${port} refused the tunnel (HTTP 407)`)
    expect(error.message).not.toContain("hunter2")
  })

  it("keeps a write the proxy refused from reading as an unknown outcome — it never left", async () => {
    const { port } = await fakeProxy(502)
    const fetch = proxiedFetch(parseProxy(`http://127.0.0.1:${port}`, "x"))
    const transport = new TelegramBotTransport({ token: TOKEN, ...(fetch ? { fetch } : {}) })

    await expect(transport.call("sendMessage", { chat_id: 1, text: "x" }, { reads: false })).rejects.toMatchObject({
      code: "configuration_error",
    })
  })
})
