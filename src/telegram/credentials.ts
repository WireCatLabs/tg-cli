import { CliError, Credentials, type KeyringStore } from "@wirecat/cli-core"
import { APP, isolated, pathsFor } from "../paths.js"

/** The app registration from my.telegram.org. Every user brings their own (`NEED-3`). */
export interface ApiCredentials {
  id: number
  hash: string
}

export interface ApiCredentialOptions {
  profile: string
  env?: NodeJS.ProcessEnv
  keyring?: KeyringStore
  warn?: (message: string) => void
}

export const parseApiId = (typed: string): number => {
  const trimmed = typed.trim()
  if (!/^\d{1,12}$/.test(trimmed))
    throw new CliError("validation_error", "api_id is a number from my.telegram.org/apps")
  return Number(trimmed)
}

export const parseApiHash = (typed: string): string => {
  const trimmed = typed.trim()
  if (trimmed === "") throw new CliError("validation_error", "api_hash is empty")
  return trimmed
}

/** `TG_API_ID` and `TG_API_HASH` outrank the keyring, for CI, as `MAX_TOKEN` does in max-cli. */
export const apiCredentials = ({ profile, env = process.env, keyring, warn }: ApiCredentialOptions) => {
  const store = new Credentials({
    configDir: pathsFor(env).config,
    service: APP,
    isolated: isolated(env),
    env,
    ...(keyring ? { keyring } : {}),
    ...(warn ? { warn } : {}),
  })
  const account = `${profile}:api`

  return {
    read: (): ApiCredentials | undefined => {
      if (env.TG_API_ID && env.TG_API_HASH) {
        return { id: parseApiId(env.TG_API_ID), hash: parseApiHash(env.TG_API_HASH) }
      }
      const stored = store.read(account)
      if (!stored) return undefined
      const { id, hash } = JSON.parse(stored.secret) as ApiCredentials
      return { id, hash }
    },
    /** Where they are read from — never the values. */
    source: (): "environment" | "keyring" | "file" | undefined => {
      if (env.TG_API_ID && env.TG_API_HASH) return "environment"
      const stored = store.read(account)
      return stored ? (stored.source === "keyring" ? "keyring" : "file") : undefined
    },
    write: (credentials: ApiCredentials): void => {
      store.write(account, JSON.stringify(credentials))
    },
  }
}
