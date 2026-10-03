import { describe, expect, it } from "vitest"
import { readApp, registerApp } from "./registration.js"

/** Rebuilt from the exact strings MadelineProto splits the page on — not a capture of the real site. */
const APP_PAGE = `<title>App configuration</title>
<div class="form-group">
        <label for="app_id" class="col-md-4 text-right control-label">App api_id:</label>
        <div class="col-md-7">
        <span class="form-control input-xlarge uneditable-input" onclick="this.select();"><strong>1234567</strong></span>
        </div>
</div>
<div class="form-group">
        <label for="app_hash" class="col-md-4 text-right control-label">App api_hash:</label>
        <div class="col-md-7">
        <span class="form-control input-xlarge uneditable-input" onclick="this.select();">0123456789abcdef0123456789abcdef</span>
        </div>
</div>`

const CREATE_PAGE = `<title>Create new application</title>
<form id="app_create_form"><input type="hidden" name="hash" value="c0ffee12"/></form>`

interface Seen {
  path: string
  form: Record<string, string>
  cookie: string | null
  signal: AbortSignal | null | undefined
}

const site = (answers: Record<string, string | (() => string)>, setCookie?: string) => {
  const seen: Seen[] = []
  const fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const path = new URL(String(url)).pathname
    const headers = new Headers(init?.headers)
    seen.push({
      path,
      form: Object.fromEntries(new URLSearchParams(String(init?.body ?? ""))),
      cookie: headers.get("Cookie"),
      signal: init?.signal,
    })
    const answer = answers[path]
    const body = typeof answer === "function" ? answer() : (answer ?? "")
    const response = new Response(body, { status: 200 })
    if (path === "/auth/login" && setCookie) response.headers.append("Set-Cookie", setCookie)
    return response
  }) as typeof globalThis.fetch
  return { fetch, seen }
}

const prompts = { phone: async () => "+34600000000", code: async () => "abc12", note: () => {} }

describe("registering the owner's app on my.telegram.org", () => {
  it("passes cancellation to every request in the app registration flow", async () => {
    const controller = new AbortController()
    const { fetch, seen } = site({
      "/auth/send_password": '{"random_hash":"r1"}',
      "/auth/login": "true",
      "/apps": APP_PAGE,
    })
    await registerApp(prompts, { fetch, signal: controller.signal })
    expect(seen).toHaveLength(3)
    expect(seen.every(({ signal }) => signal === controller.signal)).toBe(true)
  })
  it("reads an app that already exists, without creating another", async () => {
    const { fetch, seen } = site({
      "/auth/send_password": '{"random_hash":"r1"}',
      "/auth/login": "true",
      "/apps": APP_PAGE,
    })

    expect(await registerApp(prompts, { fetch })).toEqual({
      id: 1234567,
      hash: "0123456789abcdef0123456789abcdef",
      created: false,
    })
    expect(seen.map(({ path }) => path)).not.toContain("/apps/create")
  })

  it("creates one when there is none, then reads it", async () => {
    let created = false
    const { fetch, seen } = site(
      {
        "/auth/send_password": '{"random_hash":"r1"}',
        "/auth/login": "true",
        "/apps": () => (created ? APP_PAGE : CREATE_PAGE),
        "/apps/create": () => {
          created = true
          return ""
        },
      },
      "stel_token=t0ken; path=/; HttpOnly",
    )

    const app = await registerApp(prompts, { fetch, shortName: "tgclitest01" })

    expect(app.created).toBe(true)
    expect(seen.find(({ path }) => path === "/auth/login")?.form).toEqual({
      phone: "+34600000000",
      random_hash: "r1",
      password: "abc12",
    })
    const create = seen.find(({ path }) => path === "/apps/create")
    expect(create?.form).toMatchObject({ hash: "c0ffee12", app_shortname: "tgclitest01", app_platform: "desktop" })
    expect(create?.cookie).toBe("stel_token=t0ken")
  })

  it("says a wrong code is an authentication error", async () => {
    const { fetch } = site({
      "/auth/send_password": '{"random_hash":"r1"}',
      "/auth/login": "Invalid confirmation code!",
    })
    await expect(registerApp(prompts, { fetch })).rejects.toMatchObject({ code: "authentication_error" })
  })

  it("says too many tries is a rate limit", async () => {
    const { fetch } = site({ "/auth/send_password": "Sorry, too many tries. Please try again later." })
    await expect(registerApp(prompts, { fetch })).rejects.toMatchObject({ code: "rate_limited" })
  })

  it("finds nothing on a page with no app", () => {
    expect(readApp(CREATE_PAGE)).toBeUndefined()
  })
})
