import { existsSync } from "node:fs"
import { CliError, type KeyringStore, type Renderer, type RenderFormat, type Streams } from "@leemour/cli-core"
import { resolveOutput } from "@leemour/cli-messaging"
import type { Command } from "commander"
import { profileFrom, sessionFile } from "../paths.js"
import { TelegramAdapter } from "../telegram/adapter.js"
import { type ApiCredentials, apiCredentials } from "../telegram/credentials.js"

export interface Environment {
  streams?: Streams
  env?: NodeJS.ProcessEnv
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean }
  keyring?: KeyringStore
  tty?: boolean
  /** Tests hand in a scripted Telegram. */
  adapter?: (options: { credentials: ApiCredentials; sessionPath: string }) => Adapter | Promise<Adapter>
}

export type Adapter = Pick<TelegramAdapter, "login" | "me" | "chats" | "history" | "send" | "logout" | "close">

export interface GlobalFlags {
  json?: boolean
  jsonl?: boolean
  quiet?: boolean
  verbose?: boolean
}

export interface CommandContext {
  renderer: Renderer
  streams: Streams
  format: RenderFormat
  color: boolean
  profile: string
  env: NodeJS.ProcessEnv
  stdin: NodeJS.ReadableStream & { isTTY?: boolean }
  sessionPath: string
  credentials: ReturnType<typeof apiCredentials>
  open: (credentials?: ApiCredentials) => Promise<Adapter>
  /** Opens the adapter, runs the work, and closes it on every path. */
  withTelegram: <T>(work: (telegram: Adapter) => Promise<T>) => Promise<T>
}

export const environmentOf = (command: Command): Environment => {
  let root: Command = command
  while (root.parent) root = root.parent
  return (root as Command & { environment?: Environment }).environment ?? {}
}

export const forCommand = (command: Command): CommandContext => {
  const environment = environmentOf(command)
  const flags = command.optsWithGlobals<GlobalFlags>()
  const env = environment.env ?? process.env
  const output = resolveOutput({
    json: flags.json,
    jsonl: flags.jsonl,
    quiet: flags.quiet,
    ...(environment.streams ? { streams: environment.streams } : {}),
    ...(environment.tty === undefined ? {} : { tty: environment.tty }),
  })
  const profile = profileFrom(env)
  const sessionPath = sessionFile(profile, env)
  const credentials = apiCredentials({
    profile,
    env,
    warn: output.renderer.warn,
    ...(environment.keyring ? { keyring: environment.keyring } : {}),
  })
  const diagnostic = (line: string) => output.streams.diagnostic(line)

  const open = async (given?: ApiCredentials): Promise<Adapter> => {
    const resolved = given ?? credentials.read()
    if (!resolved) {
      throw new CliError("authentication_error", "no Telegram app credentials — run `tg session start` first")
    }
    const options = { credentials: resolved, sessionPath }
    return environment.adapter
      ? await environment.adapter(options)
      : await TelegramAdapter.open({ ...options, diagnostic, verbose: flags.verbose === true })
  }

  return {
    ...output,
    profile,
    env,
    stdin: environment.stdin ?? process.stdin,
    sessionPath,
    credentials,
    open,
    withTelegram: async (work) => {
      if (!environment.adapter && !existsSync(sessionPath)) {
        throw new CliError("authentication_error", `no session for profile "${profile}" — run \`tg session start\``)
      }
      const telegram = await open()
      try {
        return await work(telegram)
      } finally {
        await telegram.close()
      }
    },
  }
}

export const positiveInteger =
  (flag: string) =>
  (value: string): number => {
    const number = Number(value)
    if (!Number.isInteger(number) || number < 1)
      throw new CliError("validation_error", `${flag} takes a whole number above 0`)
    return number
  }
