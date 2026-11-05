import { MtcuteError, type SentCode, tl, User } from "@mtcute/node"
import type { AccountSession } from "@wirecat/cli-core"
import type { Feature } from "./feature.js"
import { type Account, toAccount, toAccountSession } from "./map.js"

export interface LoginPrompts {
  method: "qr" | "phone"
  forceSms?: boolean
  showQr: (url: string, expires: Date) => void
  /** The QR code was scanned; Telegram still has to move the login to the account's data centre and fetch it. */
  scanned: () => void
  phone: () => Promise<string>
  code: () => Promise<string>
  password: () => Promise<string>
  note: (message: string) => void
}

const PHONE_CODE_RETRIES = ["PHONE_CODE_EMPTY", "PHONE_CODE_EXPIRED", "PHONE_CODE_INVALID", "PHONE_CODE_HASH_EMPTY"]

/**
 * mtcute's `start({ forceSms })` without its one failure: when Telegram has no SMS to resend
 * (`SEND_CODE_UNAVAILABLE`) it aborts the login, though the code it first sent to the app still works.
 */
const loginAskingForSms = async ({ client }: Feature, prompts: LoginPrompts): Promise<User> => {
  let needsPassword = false
  try {
    return await client.getMe()
  } catch (error) {
    if (tl.RpcError.is(error, "SESSION_PASSWORD_NEEDED")) needsPassword = true
    else if (!tl.RpcError.is(error, "AUTH_KEY_UNREGISTERED")) throw error
  }
  if (!needsPassword) {
    const phone = await prompts.phone()
    let sent: SentCode | undefined
    try {
      const answer = await client.sendCode({ phone })
      if (answer instanceof User) return answer
      sent = answer
    } catch (error) {
      if (!tl.RpcError.is(error, "SESSION_PASSWORD_NEEDED")) throw error
      needsPassword = true
    }
    if (sent) {
      if (sent.type === "app" || sent.type === "email") {
        try {
          sent = await client.resendCode({ phone, phoneCodeHash: sent.phoneCodeHash })
        } catch (error) {
          if (!tl.RpcError.is(error, "SEND_CODE_UNAVAILABLE")) throw error
          prompts.note("Telegram offers no SMS for this account")
        }
      }
      if (sent.type === "email_required") throw new MtcuteError("Email login setup is required to sign in")
      prompts.note(`Telegram sent a login code (${sent.type})`)
      for (;;) {
        try {
          return await client.signIn({
            phone,
            phoneCodeHash: sent.phoneCodeHash,
            phoneCode: await prompts.code(),
          })
        } catch (error) {
          if (tl.RpcError.is(error, "SESSION_PASSWORD_NEEDED")) {
            needsPassword = true
            break
          }
          if (!PHONE_CODE_RETRIES.some((text) => tl.RpcError.is(error, text))) throw error
          prompts.note("that code was not accepted — try again")
        }
      }
    }
  }
  return askPassword(client, prompts)
}

const askPassword = async (client: Feature["client"], prompts: LoginPrompts): Promise<User> => {
  for (;;) {
    try {
      return await client.checkPassword(await prompts.password())
    } catch (error) {
      if (!tl.RpcError.is(error, "PASSWORD_HASH_INVALID")) throw error
      prompts.note("that password was not accepted — try again")
    }
  }
}

const LOGIN_ENDED = ["SESSION_REVOKED", "USER_DEACTIVATED", "USER_DEACTIVATED_BAN"]

/**
 * mtcute's `start({ qrCodeHandler })`, which does not pass `onQrScanned` on: after the scan, moving the login to the
 * account's data centre and fetching the account take seconds, and the owner should not watch silence meanwhile.
 */
const loginByQr = async ({ client }: Feature, prompts: LoginPrompts): Promise<User> => {
  try {
    return await client.getMe()
  } catch (error) {
    if (tl.RpcError.is(error, "SESSION_PASSWORD_NEEDED")) return askPassword(client, prompts)
    if (LOGIN_ENDED.some((text) => tl.RpcError.is(error, text))) await client.logOut().catch(() => {})
    else if (!tl.RpcError.is(error, "AUTH_KEY_UNREGISTERED")) throw error
  }
  return client.signInQr({
    onUrlUpdated: prompts.showQr,
    onQrScanned: prompts.scanned,
    password: prompts.password,
    invalidPasswordCallback: () => prompts.note("that password was not accepted — try again"),
  })
}

export const login = (feature: Feature, prompts: LoginPrompts): Promise<Account> =>
  feature.call(async () => {
    if (prompts.method === "qr") return toAccount(await loginByQr(feature, prompts))
    if (prompts.forceSms) return toAccount(await loginAskingForSms(feature, prompts))
    const user: User = await feature.client.start({
      phone: prompts.phone,
      code: prompts.code,
      password: prompts.password,
      codeSentCallback: (sent) => prompts.note(`Telegram sent a login code (${sent.type})`),
      invalidCodeCallback: (what) => prompts.note(`that ${what} was not accepted — try again`),
    })
    return toAccount(user)
  })

/** Forgets the session on Telegram's side too, so the device disappears from the account's list. */
export const logout = ({ call, client }: Feature): Promise<void> =>
  call(async () => {
    await client.logOut()
  })

/** Every device and app logged in; the IP address Telegram also sends is left out. */
export const sessions = ({ call, client }: Feature): Promise<AccountSession[]> =>
  call(async () => {
    const { authorizations } = await client.call({ _: "account.getAuthorizations" })
    return authorizations.map(toAccountSession)
  })

/** mtcute has no call of its own for it; this is Telegram's `auth.resetAuthorizations`. */
export const endOtherSessions = (feature: Feature): Promise<AccountSession[]> =>
  feature.call(async () => {
    try {
      await feature.client.call({ _: "auth.resetAuthorizations" })
    } catch (error) {
      throw feature.unanswered(error, {
        what: "the other devices may or may not have been logged out",
        check: "account.sessions.list",
      })
    }
    const { authorizations } = await feature.client.call({ _: "account.getAuthorizations" })
    return authorizations.map(toAccountSession)
  })
