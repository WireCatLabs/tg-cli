import { randomBytes } from "node:crypto"
import { CliError, singleLine } from "@leemour/cli-core"
import type { ApiCredentials } from "./credentials.js"

/**
 * Registers the owner's app on my.telegram.org and reads its `api_id` and `api_hash` — the same
 * page a person would fill in, driven without a browser.
 *
 * ⚠ The site has no API; this follows its web form. The login half is read from the page's own
 * script (2026-09-27): `send_password {phone}` answers `{random_hash}`, `login {phone, random_hash,
 * password}` answers `true` and sets the session cookie. The app half — the `/apps` page and
 * `/apps/create` — is behind that login and was read from two clients that drive it the same way,
 * MadelineProto (`src/MyTelegramOrgWrapper.php`) and gogram (`telegram/auth.go`). Not measured by
 * us until the first real run.
 */
export const MY_TELEGRAM = "https://my.telegram.org"

export interface RegistrationPrompts {
  phone: () => Promise<string>
  /** The code my.telegram.org sends as a message from Telegram — not an SMS, not the login code. */
  code: () => Promise<string>
  note: (message: string) => void
}

type Fetch = (url: string, init: RequestInit) => Promise<Response>

export const registerApp = async (
  prompts: RegistrationPrompts,
  {
    fetch: request = fetch,
    shortName = randomShortName(),
    signal,
  }: { fetch?: Fetch; shortName?: string; signal?: AbortSignal } = {},
): Promise<ApiCredentials & { created: boolean }> => {
  const cookies = new Map<string, string>()
  const call = async (path: string, form?: Record<string, string>) => {
    const response = await request(`${MY_TELEGRAM}${path}`, {
      method: form ? "POST" : "GET",
      headers: {
        ...(form ? { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } : {}),
        "X-Requested-With": "XMLHttpRequest",
        Origin: MY_TELEGRAM,
        Referer: `${MY_TELEGRAM}${path.startsWith("/apps") ? "/apps" : "/auth"}`,
        ...(cookies.size > 0 ? { Cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join("; ") } : {}),
      },
      ...(form ? { body: new URLSearchParams(form).toString() } : {}),
      redirect: "manual",
      ...(signal === undefined ? {} : { signal }),
    })
    for (const line of response.headers.getSetCookie()) {
      const [pair] = line.split(";")
      const at = pair?.indexOf("=") ?? -1
      if (pair && at > 0) cookies.set(pair.slice(0, at).trim(), pair.slice(at + 1).trim())
    }
    return { status: response.status, text: await response.text() }
  }

  const phone = (await prompts.phone()).trim()
  const sent = await call("/auth/send_password", { phone })
  const randomHash = parseRandomHash(sent.text)
  prompts.note("my.telegram.org sent a code as a message from Telegram — open the Telegram app to read it")

  const login = await call("/auth/login", { phone, random_hash: randomHash, password: (await prompts.code()).trim() })
  if (login.text.trim() !== "true") {
    throw new CliError("authentication_error", `my.telegram.org refused the code: ${siteSays(login.text)}`)
  }

  const page = await call("/apps")
  const existing = readApp(page.text)
  if (existing) return { ...existing, created: false }

  const hash = creationHash(page.text)
  const created = await call("/apps/create", {
    hash,
    app_title: "tg-cli",
    app_shortname: shortName,
    app_url: "https://github.com/WireCatLabs/tg-cli",
    app_platform: "desktop",
    app_desc: "A command line interface for my own account",
  })
  if (created.text.trim() !== "") {
    throw new CliError("provider_error", `my.telegram.org did not create the app: ${siteSays(created.text)}`)
  }

  const app = readApp((await call("/apps")).text)
  if (!app) throw new CliError("invalid_response", "my.telegram.org says the app was created, but its page shows none")
  return { ...app, created: true }
}

const parseRandomHash = (text: string): string => {
  try {
    const hash = (JSON.parse(text) as { random_hash?: unknown }).random_hash
    if (typeof hash === "string" && hash !== "") return hash
  } catch {}
  const said = siteSays(text)
  throw new CliError(/too many/i.test(said) ? "rate_limited" : "provider_error", `my.telegram.org: ${said}`)
}

/** The app's page, or `undefined` when the account has no app yet. */
export const readApp = (html: string): ApiCredentials | undefined => {
  const id =
    /<label for="app_id"[^>]*>[\s\S]*?<\/label>\s*<div[^>]*>\s*<span[^>]*><strong>(\d+)<\/strong><\/span>/.exec(html)
  const hash = /<label for="app_hash"[^>]*>[\s\S]*?<\/label>\s*<div[^>]*>\s*<span[^>]*>([a-fA-F0-9]+)<\/span>/.exec(
    html,
  )
  return id?.[1] && hash?.[1] ? { id: Number(id[1]), hash: hash[1] } : undefined
}

const creationHash = (html: string): string => {
  const hash = /<input type="hidden" name="hash" value="([a-fA-F0-9]+)"\s*\/?>/.exec(html)?.[1]
  if (hash) return hash
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]
  throw new CliError(
    "invalid_response",
    `my.telegram.org showed a page this does not know (${singleLine(title ?? "no title")}) — create the app by hand with --app browser`,
  )
}

/** App short names are letters and digits; a random tail keeps two profiles from colliding. */
const randomShortName = (): string =>
  `tgcli${[...randomBytes(6)].map((byte) => "abcdefghijklmnopqrstuvwxyz0123456789"[byte % 36]).join("")}`

/** The site answers errors as a short plain sentence; keep it one line and short. */
const siteSays = (text: string): string =>
  singleLine(text.replace(/<[^>]+>/g, " ").trim()).slice(0, 200) || "(empty answer)"
