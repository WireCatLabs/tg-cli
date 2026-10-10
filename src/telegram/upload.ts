import type { TelegramClient, UploadedFile } from "@mtcute/node"
import { CliError } from "@wirecat/cli-core"
import type { Upload } from "@wirecat/cli-messaging/sends"
import { toCliError } from "./errors.js"
import { toUploadParams } from "./map.js"

export const UPLOAD_ATTEMPTS = 3

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Before the message exists, so a failure here means nothing was sent and a network drop can be tried
 * again at once. The send that follows goes once, with the send's own random id.
 */
export const uploadAttachment = async (
  client: Pick<TelegramClient, "uploadFile">,
  upload: Upload,
  wait: (ms: number) => Promise<unknown> = sleep,
): Promise<UploadedFile> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await client.uploadFile(toUploadParams(upload))
    } catch (error) {
      const known = toCliError(error)
      const dropped = known instanceof CliError && ["timeout", "network_error"].includes(known.code)
      if (!dropped) throw error
      if (attempt >= UPLOAD_ATTEMPTS) {
        throw new CliError(known.code, `the file did not upload after ${attempt} tries; nothing was sent`, {
          attempts: attempt,
        })
      }
      await wait(attempt * 1000)
    }
  }
}
