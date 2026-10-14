import type { Renderer, RenderFormat } from "@wirecat/cli-base"
import { currentRun } from "@wirecat/cli-core/cli"

/** cli-core keeps `itemOf` and `renderAnswer` to itself, so tg's own commands build the same `{item, meta}`. */
export const itemAnswer = <T>(item: T) => {
  const run = currentRun()
  return {
    item,
    meta: { run_id: run.runId, duration_ms: Math.max(0, Math.round(Date.now() - (run.startedAt ?? Date.now()))) },
  }
}

export const printItem = ({ renderer, format }: { renderer: Renderer; format: RenderFormat }, item: unknown): void => {
  if (format === "json") renderer.result(itemAnswer(item))
  else if (format === "jsonl") renderer.stream([item])
  else renderer.result(item)
}
