import { statSync } from "node:fs"
import { CliError } from "@wirecat/cli-base"
import type { ManifestOperation } from "@wirecat/cli-base/codegen"
import {
  type ApiCommandInput,
  apiPlainJson,
  BotTokenStore,
  botContext,
  ChatRegistry,
  checkApiBody,
  checkApiParameter,
  generatedApiCommand,
  prepareRpcApiBody,
} from "@wirecat/cli-core/cli"
import {
  DEFAULT_PERMISSIONS,
  guardedWrite,
  levelFor,
  newOperationId,
  readUpload,
  uploadBytes,
} from "@wirecat/cli-core/sends"
import type { Command } from "commander"
import { definitions } from "../bot/generated/definitions.js"
import { operations } from "../bot/generated/manifest.js"
import { schemas } from "../bot/generated/schemas.js"
import { TELEGRAM_BOT } from "./bot.js"

const defaults = {
  ...DEFAULT_PERMISSIONS,
  ...Object.fromEntries(
    operations
      .filter((operation) => operation.effect === "destructive")
      .map((operation) => [`bot.api.${operation.command}`, "ask" as const]),
  ),
}
const keyOf = (operation: ManifestOperation) => `bot.api.${operation.command}`
const contextOf = (command: Command) => botContext(command.parent ?? command, TELEGRAM_BOT)

export const telegramBotApiCommand = (): Command => {
  const group = generatedApiCommand({
    operations,
    checkParameter: (name, schema, raw) => checkApiParameter(name, schema, raw, schemas),
    before: (command, operation) => {
      const context = contextOf(command)
      if (context.settings.offline)
        throw new CliError("validation_error", "bot api needs the messenger; --offline reads only the local copy")
      const { level } = levelFor(context.settings.permissions, keyOf(operation), defaults)
      if (level === "deny" || (operation.effect !== "read" && level === "readonly"))
        throw new CliError("permission_error", "this bot API operation is not allowed by this profile's permissions")
    },
    execute: async (command, operation, input: ApiCommandInput) => {
      const context = contextOf(command)
      const prepared = prepareRpcApiBody(operation, input, definitions)
      checkApiBody(operation, prepared.text, schemas)
      // `bot messages send --file`'s refusal, before anything connects; held in memory, so the buffered-upload cap applies.
      const anyFile = group.opts<{ allowAnyFile?: boolean }>().allowAnyFile === true
      const files = await Promise.all(
        prepared.files.map(async ({ field, path }) => {
          const upload = await readUpload("file", path, { app: TELEGRAM_BOT.app, env: context.env, anyFile })
          return { field, name: upload.name, bytes: await uploadBytes(upload.source) }
        }),
      )
      if (prepared.secrets.length && input.bodySource === "file" && process.platform !== "win32") {
        const path = command.opts<{ bodyFile?: string }>().bodyFile
        if (!path || (statSync(path).mode & 0o077) !== 0)
          throw new CliError(
            "validation_error",
            "a request containing credentials needs a file readable only by its owner, or stdin",
          )
      }
      await context.run(async (events) => {
        const adapter = await context.authenticated({ events })
        try {
          if (!adapter.api) throw new CliError("configuration_error", "the bot adapter has no native API transport")
          let target: { tokens: BotTokenStore; registry: ChatRegistry; id: string } | undefined
          if (operation.response?.sensitive) {
            const profile = input.tokenProfile
            const id = String(prepared.value.user_id ?? "")
            if (!profile || !/^\d+$/.test(id))
              throw new CliError("validation_error", "a credential destination and managed bot id are required")
            const tokens =
              TELEGRAM_BOT.tokenStore?.(command, profile) ??
              new BotTokenStore({ app: TELEGRAM_BOT.app, profile, env: context.env })
            const registry = new ChatRegistry(TELEGRAM_BOT.app, profile, context.env)
            const oldToken = tokens.readStored()?.secret
            const knownId = registry.botId()
            if (knownId && knownId !== id)
              throw new CliError("authentication_error", "the destination profile belongs to a different bot")
            if (oldToken) {
              const existing = await context.connect(oldToken, { events })
              try {
                if ((await existing.me()).id !== id)
                  throw new CliError(
                    "authentication_error",
                    "the destination profile's credential belongs to a different bot",
                  )
              } finally {
                await existing.close()
              }
            }
            target = { tokens, registry, id }
          }
          const call = async () => {
            const wait = prepared.value.timeout
            const seconds = wait === undefined ? undefined : Number(String(wait))
            const result = await adapter.api?.(
              operation.id,
              { ...(prepared.text === undefined ? {} : { body: prepared.text }), files, secrets: prepared.secrets },
              {
                reads: operation.effect === "read",
                ...(seconds === undefined ? {} : { timeoutMs: (seconds + 15) * 1000 }),
              },
            )
            if (!target) return apiPlainJson(result)
            if (typeof result !== "string" || !result || result.split(":", 1)[0] !== target.id)
              throw new CliError("invalid_response", "Telegram returned an invalid managed bot credential")
            const verified = await context.connect(result, { events })
            try {
              if ((await verified.me()).id !== target.id)
                throw new CliError("authentication_error", "the returned credential belongs to a different bot")
            } finally {
              await verified.close()
            }
            target.tokens.writeKeyring(result)
            target.registry.rememberBot(target.id)
            return { profile: input.tokenProfile, stored: "keyring", id: target.id }
          }
          const result =
            operation.effect === "read"
              ? await call()
              : await guardedWrite(
                  context.guard(defaults),
                  {
                    operationId: newOperationId(),
                    key: keyOf(operation),
                    kind: "message",
                    chatId: prepared.value.chat_id === undefined ? null : String(prepared.value.chat_id),
                  },
                  call,
                )
          context.renderer.result(result)
        } finally {
          await adapter.close()
        }
      })
    },
  })
  group.option("--allow-any-file", "read @path files even from credential folders or this CLI's own folders")
  return group
}
