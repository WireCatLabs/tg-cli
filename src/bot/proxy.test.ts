import { createServer, request } from "node:http"
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

describe("an upload through a proxy", () => {
  it("arrives as multipart with the file's bytes, not as the text of a FormData", async () => {
    const received: { type?: string; body: string }[] = []
    const target = createServer((request, response) => {
      let body = ""
      request.on("data", (chunk) => (body += chunk))
      request.on("end", () => {
        received.push({ ...(request.headers["content-type"] ? { type: request.headers["content-type"] } : {}), body })
        response.end("{}")
      })
    })
    await new Promise<void>((resolve) => target.listen(0, "127.0.0.1", resolve))
    servers.push(target)
    const targetPort = (target.address() as { port: number }).port
    const asked: (string | undefined)[] = []
    // undici sends a plain http:// request to the proxy in absolute form instead of opening a tunnel. The proxy
    // forwards to the fixed test server, never to the address it is given, so code scanning has no forgery to flag.
    const proxy = createServer((incoming, outgoing) => {
      asked.push(incoming.url)
      const forwarded = request(
        { host: "127.0.0.1", port: targetPort, path: "/", method: incoming.method, headers: incoming.headers },
        (answer) => answer.pipe(outgoing),
      )
      incoming.pipe(forwarded)
    })
    await new Promise<void>((resolve) => proxy.listen(0, "127.0.0.1", resolve))
    servers.push(proxy)
    const fetch = proxiedFetch(parseProxy(`http://127.0.0.1:${(proxy.address() as { port: number }).port}`, "x"))
    const form = new FormData()
    form.append("chat_id", "42")
    form.append("document", new Blob(["file bytes"]), "a.txt")

    await fetch?.(`http://127.0.0.1:${targetPort}/`, { method: "POST", body: form })

    expect(asked).toEqual([`http://127.0.0.1:${targetPort}/`])
    expect(received[0]?.type).toMatch(/^multipart\/form-data; boundary=/)
    expect(received[0]?.body).toContain("file bytes")
    expect(received[0]?.body).toContain('filename="a.txt"')
  })
})
