/** What `tg commands --json` and the parity manifest say exists, reduced to what a page may name. */
export interface Surface {
  commands: Map<string, Set<string>>
  globals: Set<string>
}

type ManifestState = string | { state: string }
export type Manifest = Record<string, { options?: Record<string, ManifestState> }>

const stateOf = (entry: ManifestState): string => (typeof entry === "string" ? entry : entry.state)

const optionsOf = (flags: string): string[] => flags.match(/--[a-z][a-z-]*/g) ?? []

export const surfaceOf = (tree: { commands: unknown; globalOptions: { flags: string }[] }): Surface => {
  const commands = new Map<string, Set<string>>()
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) node.forEach(walk)
    else if (node && typeof node === "object") {
      const { path, options } = node as { path?: string[]; options?: { flags: string }[] }
      if (path) commands.set(path.join(" "), new Set((options ?? []).flatMap((option) => optionsOf(option.flags))))
      Object.values(node).forEach(walk)
    }
  }
  walk(tree.commands)
  return { commands, globals: new Set(tree.globalOptions.flatMap((option) => optionsOf(option.flags))) }
}

/**
 * Every `tg <command> --option` on a page whose option the command does not have. An option the
 * manifest plans for the command is allowed: docs come first, the code follows.
 */
export const unknownOptions = (page: string, surface: Surface, manifest: Manifest): string[] => {
  const found: string[] = []
  for (const [, words, rest] of page.matchAll(/\btg ((?:[a-z][a-z-]* ?)+)([^\n`#|]*)/g)) {
    const typed = (words ?? "").trim().split(/\s+/)
    const command = [typed, typed.slice(1)]
      .flatMap((candidate) => candidate.map((_, end) => candidate.slice(0, candidate.length - end).join(" ")))
      .find((path) => surface.commands.has(path))
    if (command === undefined) continue
    const has = surface.commands.get(command) ?? new Set()
    const planned = manifest[command]?.options ?? {}
    for (const option of (rest ?? "").match(/(?<![\w-])--[a-z][a-z-]*/g) ?? []) {
      const plan = planned[option]
      if (has.has(option) || surface.globals.has(option)) continue
      if (plan !== undefined && stateOf(plan) !== "max-only") continue
      found.push(`tg ${command} ${option}`)
    }
  }
  return found
}
