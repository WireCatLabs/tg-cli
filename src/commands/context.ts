import { existsSync } from "node:fs"
import { CliError, type KeyringStore } from "@leemour/cli-core"
import {
  asFirstWord,
  type BaseContext,
  type BaseEnvironment,
  baseContext,
  environmentOf,
} from "@leemour/cli-messaging/cli"
import { guardFor, type SendGuard } from "@leemour/cli-messaging/sends"
import { type AccountKey, type MessageStore, openStore } from "@leemour/cli-messaging/store"
import type { Command } from "commander"
import { recalledAccount, rememberAccount } from "../accounts.js"
import { resolveSettings, TG } from "../app.js"
import { sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"
import { observed } from "./observed.js"
import { stored } from "./stored.js"

export interface Environment extends BaseEnvironment {
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean }
  keyring?: KeyringStore
  /** Tests hand in a scripted Telegram. */
  adapter?: (options: { credentials: ApiCredentials; sessionPath: string }) => Adapter | Promise<Adapter>
}

export type Adapter = Pick<
  TelegramAdapter,
  "self" | "login" | "me" | "chats" | "history" | "resolve" | "send" | "logout" | "close"
>

export interface CommandContext extends BaseContext {
  profile: string
  stdin: NodeJS.ReadableStream & { isTTY?: boolean }
  sessionPath: string
  credentials: ReturnType<typeof apiCredentials>
  /** Read-only, the allow-list, the recipient list and the hourly limit — asked before every write, told after. */
  guard: SendGuard
  open: (credentials?: ApiCredentials) => Promise<Adapter>
  /**
   * Opens Telegram inside `--timeout`, tracked so the deadline can close it, and closes it on every
   * path. What the reads answer is saved to the message store.
   */
  withTelegram: <T>(work: (telegram: Adapter) => Promise<T>) => Promise<T>
  /** Answers from the message store alone, for `--offline`. Never connects and needs no credentials. */
  withStore: <T>(work: (store: MessageStore, account: AccountKey) => T) => Promise<T>
}

export const forCommand = (command: Command): CommandContext => {
  const environment = environmentOf<Environment>(command)
  const base = baseContext(command, resolveSettings)
  const { profile } = base.settings
  const sessionPath = sessionFile(profile, base.env)
  const credentials = apiCredentials({
    profile,
    env: base.env,
    warn: base.renderer.warn,
    ...(environment.keyring ? { keyring: environment.keyring } : {}),
  })
  const diagnostic = (line: string) => base.streams.diagnostic(line)
  const login = `\`tg ${asFirstWord(profile)}session start\``

  const open = async (given?: ApiCredentials): Promise<Adapter> => {
    const resolved = given ?? credentials.read()
    if (!resolved) {
      throw new CliError(
        "authentication_error",
        `no Telegram app credentials for profile "${profile}" — run ${login} first`,
      )
    }
    const options = { credentials: resolved, sessionPath }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({ ...options, diagnostic, verbose: base.settings.trace })
  }

  return {
    ...base,
    profile,
    stdin: environment.stdin ?? process.stdin,
    sessionPath,
    credentials,
    guard: guardFor(TG, base.settings, base.renderer.warn),
    open,
    withTelegram: (work) =>
      base.run(async (events) => {
        if (base.settings.offline) {
          throw new CliError("validation_error", "--offline answers only `chats list` and `messages list`")
        }
        if (!environment.adapter && !existsSync(sessionPath)) {
          throw new CliError("authentication_error", `no session for profile "${profile}" — run ${login}`)
        }
        const telegram = await open()
        base.track(telegram)
        let store: Promise<MessageStore | undefined> | undefined
        try {
          const self = telegram.self()
          if (self !== null) rememberAccount(profile, self, base.env)
          const adapter = observed(telegram, events)
          return await work(
            self === null
              ? adapter
              : stored(adapter, {
                  account: { provider: "telegram", account: self },
                  store: () => {
                    store ??= openStore({ env: base.env })
                    return store
                  },
                  warn: base.renderer.warn,
                  events,
                }),
          )
        } finally {
          await telegram.close()
          if (store) (await store.catch(() => undefined))?.close()
        }
      }),
    withStore: (work) =>
      base.run(async () => {
        const account = recalledAccount(profile, base.env)
        if (!account) {
          throw new CliError(
            "not_found",
            `nothing recorded for profile "${profile}" yet — run the command once without --offline`,
          )
        }
        const store = await openStore({ env: base.env })
        try {
          return work(store, account)
        } finally {
          store.close()
        }
      }),
  }
}
