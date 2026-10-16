import type { DeleteMessageUpdate, RawUpdateInfo, Message as TgMessage } from "@mtcute/node"
import { CliError, isCliError } from "@wirecat/cli-base"
import type { MessageEvent } from "@wirecat/cli-core"
import { type Feature, remoteHit } from "./feature.js"
import { toDeletions, toReactionChange } from "./map.js"

/** A look at a local flag, not a request. */
export const LOOP_CHECK_MS = 30_000
/** Every 15 minutes, mtcute's own keep-alive rate: ~96 light requests a day. */
export const HEARTBEAT_TICKS = 30
export const STATE_WAIT_MS = 30_000
const LOOP_STOPPED =
  "Telegram's updates stopped arriving although the connection is open — ending, so a service unit starts it again"

const pause = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer)
      signal.removeEventListener("abort", done)
      resolve()
    }
    const timer = setTimeout(done, ms)
    if (signal.aborted) done()
    else signal.addEventListener("abort", done, { once: true })
  })

/** `updates.getState` under a timer of its own: a request that never answers must not hold the watch. */
const askState = async ({ call, client }: Feature): Promise<CliError | undefined> => {
  let timer: NodeJS.Timeout | undefined
  const late = new Promise<CliError>((resolve) => {
    timer = setTimeout(() => resolve(new CliError("timeout", "Telegram did not answer in time")), STATE_WAIT_MS)
  })
  const asked = call(() => client.call({ _: "updates.getState" })).then(
    () => undefined,
    (error: unknown) => (isCliError(error) ? error : new CliError("provider_error", "Telegram failed")),
  )
  try {
    return await Promise.race([asked, late])
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Until `signal` aborts, or the login or mtcute's updates loop is found gone. mtcute stops the loop
 * without a word on AUTH_KEY_UNREGISTERED (`highlevel/updates/manager.js`, `_fetchUpdatesState` and
 * `_fetchDifferenceLater`), usually met by its own 15-minute keep-alive; the heartbeat asks itself
 * at the same rate, in case that path never runs. A refused login ends the watch with exit 4; a
 * stopped loop otherwise with exit 12, which a service unit restarts — never a process that looks
 * connected and receives nothing. A heartbeat that fails for any other reason is let pass.
 */
const untilStopped = async (feature: Feature, signal: AbortSignal): Promise<void> => {
  const updates = (feature.client._client as unknown as { updates?: { updatesLoopActive: boolean } } | undefined)
    ?.updates
  for (let tick = 1; ; tick += 1) {
    await pause(LOOP_CHECK_MS, signal)
    if (signal.aborted) return
    const down = updates?.updatesLoopActive === false
    if (!down && tick % HEARTBEAT_TICKS !== 0) continue
    const refusal = await askState(feature)
    if (signal.aborted) return
    if (refusal?.code === "authentication_error") throw refusal
    if (down) throw new CliError("provider_unavailable", LOOP_STOPPED, refusal ? { cause: refusal.code } : {})
  }
}

/**
 * New messages, edits, deletions and reaction changes as they arrive, until `signal` aborts. Only
 * on an adapter opened with `listen`. `onReady` once the updates loop runs, not before.
 */
export const watch = async (
  feature: Feature,
  onEvent: (event: MessageEvent) => void,
  signal: AbortSignal,
  onReady?: () => void,
): Promise<void> => {
  const { client } = feature
  const message = (found: TgMessage) => onEvent({ event: "message", message: remoteHit(found, "remote_update") })
  const edit = (found: TgMessage) => onEvent({ event: "edit", message: remoteHit(found, "remote_update") })
  const deletion = (update: DeleteMessageUpdate) => {
    for (const change of toDeletions(update)) onEvent(change)
  }
  const raw = (info: RawUpdateInfo) => {
    const change = toReactionChange(info)
    if (change?.event === "reaction")
      onEvent({
        ...change,
        counterObservation: {
          value: change.reactions.total,
          observedAt: new Date().toISOString(),
          source: "remote_update",
          reactions: change.reactions,
        },
      })
    else if (change) onEvent(change)
  }
  client.onNewMessage.add(message)
  client.onEditMessage.add(edit)
  client.onDeleteMessage.add(deletion)
  client.onRawUpdate.add(raw)
  try {
    await feature.call(async () => {
      await client.connect()
      // With catchUp, mtcute fetches the updates state in the background and, on a revoked login,
      // quietly stops its loop — serve would sit "connected" forever. Asking first makes it fail here.
      await client.call({ _: "updates.getState" })
      await client.startUpdatesLoop()
    })
    onReady?.()
    await untilStopped(feature, signal)
  } finally {
    client.onNewMessage.remove(message)
    client.onEditMessage.remove(edit)
    client.onDeleteMessage.remove(deletion)
    client.onRawUpdate.remove(raw)
  }
}
