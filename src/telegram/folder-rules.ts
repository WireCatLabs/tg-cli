import type { FolderKind, FolderSkip } from "@leemour/cli-messaging"
import type { tl } from "@mtcute/node"

type KindFlag = "contacts" | "nonContacts" | "groups" | "broadcasts" | "bots"
type SkipFlag = "excludeMuted" | "excludeRead" | "excludeArchived"

const KINDS: Record<FolderKind, KindFlag> = {
  contacts: "contacts",
  "non-contacts": "nonContacts",
  groups: "groups",
  channels: "broadcasts",
  bots: "bots",
}
const SKIPS: Record<FolderSkip, SkipFlag> = { muted: "excludeMuted", read: "excludeRead", archived: "excludeArchived" }

/** Every flag of a set given, so a kind left out is turned off, not kept. */
export const ruleFlags = ({ include, skip }: { include?: FolderKind[]; skip?: FolderSkip[] }) => ({
  ...(include === undefined
    ? {}
    : Object.fromEntries(Object.entries(KINDS).map(([kind, flag]) => [flag, include.includes(kind as FolderKind)]))),
  ...(skip === undefined
    ? {}
    : Object.fromEntries(Object.entries(SKIPS).map(([which, flag]) => [flag, skip.includes(which as FolderSkip)]))),
})

export const rulesOf = (filter: tl.RawDialogFilter): { include?: FolderKind[]; skip?: FolderSkip[] } => {
  const include = (Object.keys(KINDS) as FolderKind[]).filter((kind) => filter[KINDS[kind]])
  const skip = (Object.keys(SKIPS) as FolderSkip[]).filter((which) => filter[SKIPS[which]])
  return { ...(include.length > 0 ? { include } : {}), ...(skip.length > 0 ? { skip } : {}) }
}
