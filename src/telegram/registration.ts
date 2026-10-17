import { randomBytes } from "node:crypto"
import { CliError, singleLine } from "@wirecat/cli-base"
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
    const said = siteSays(login.text)
    throw new CliError(
      /too many/i.test(said) ? "rate_limited" : "authentication_error",
      `my.telegram.org refused the code: ${said}`,
    )
  }

  const page = await call("/apps")
  // Measured 2026-10-17: logged out, /apps answers 401 to an XHR request and redirects to /auth otherwise.
  if (page.status === 401 || (page.status >= 300 && page.status < 400)) {
    throw new CliError("authentication_error", "my.telegram.org did not keep the login — try again in a minute")
  }
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
  // The redesigned site answers a create with any OK status and errors with JSON; the old one with an empty body.
  if (created.status >= 300 || isPage(created.text)) {
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

/**
 * The app's page, or `undefined` when the account has no app yet. The keys are read from the page's text, or —
 * as the 2026 redesign shows the hash masked — from the `data-value` / `data-copy` attribute its show and copy
 * buttons read (`/js/my-telegram.js`, 2026-10-17). Not the markup around them, which changes.
 */
export const readApp = (html: string): ApiCredentials | undefined => {
  const text = pageText(html)
  const attributes = [...html.matchAll(/\bdata-(?:value|copy)="([^"]*)"/gi)].map(([, value]) => value ?? "")
  const near = (label: RegExp, value: RegExp) =>
    new RegExp(`${label.source}[\\s\\S]{0,1500}?\\bdata-(?:value|copy)="(${value.source})"`, "i").exec(html)?.[1]
  const only = (value: RegExp) => {
    const found = new Set(attributes.filter((candidate) => new RegExp(`^${value.source}$`, "i").test(candidate)))
    return found.size === 1 && isAppPage(html) ? [...found][0] : undefined
  }
  const id = /api_id:?\s*(\d+)/i.exec(text)?.[1] ?? near(/api_id/, /\d+/) ?? only(/\d+/)
  const hash =
    /api_hash:?\s*([a-f0-9]{32})\b/i.exec(text)?.[1] ?? near(/api_hash/, /[a-f0-9]{32}/) ?? only(/[a-f0-9]{32}/)
  return id && hash ? { id: Number(id), hash } : undefined
}

const isAppPage = (html: string) => titleOf(html) === "App configuration" || /id="app_edit_form"/.test(html)

/**
 * Creating is safe only from the create form: Telegram gives a number one app, and on any other page
 * a lookup that failed would ask for a second one.
 */
const creationHash = (html: string): string => {
  const title = titleOf(html)
  const hash = [...html.matchAll(/<input\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter((tag) => /\bname="hash"/i.test(tag))
    .map((tag) => /\bvalue="([a-fA-F0-9]+)"/i.exec(tag)?.[1])
    .find(Boolean)
  if (hash && (title === "Create new application" || /id="app_create_form"/.test(html))) return hash
  if (isAppPage(html)) {
    throw new CliError(
      "invalid_response",
      "found your app on my.telegram.org but could not read its keys — get them with --app browser",
    )
  }
  throw new CliError(
    "invalid_response",
    `my.telegram.org showed a page this does not know (${title ?? "no title"}) — create the app by hand with --app browser`,
  )
}

const titleOf = (html: string): string | undefined => {
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]
  return title === undefined ? undefined : singleLine(title.trim())
}

const pageText = (html: string): string =>
  html
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\x0a|&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

/** App short names are letters and digits; a random tail keeps two profiles from colliding. */
const randomShortName = (): string =>
  // biome-ignore lint/security/noSecrets: short-name alphabet, not a key
  `tgcli${[...randomBytes(6)].map((byte) => "abcdefghijklmnopqrstuvwxyz0123456789"[byte % 36]).join("")}`

/** The site answers errors as a short sentence. A whole page is named by its title: it can be the app's page, hash and all. */
const siteSays = (text: string): string => {
  if (isPage(text)) return `it answered with the page "${titleOf(text) ?? "untitled"}"`
  return singleLine(pageText(jsonText(text) ?? text)).slice(0, 200) || "(empty answer)"
}

const isPage = (text: string) => /<html|<title/i.test(text)

/** The redesigned site's errors: `{"text": "…", "field": "app_shortname"}`. */
const jsonText = (text: string): string | undefined => {
  try {
    const said = (JSON.parse(text) as { text?: unknown }).text
    return typeof said === "string" ? said : undefined
  } catch {
    return undefined
  }
}
