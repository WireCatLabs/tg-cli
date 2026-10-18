/**
 * tg-cli's side of the release checks: its changelog headings, its pages and what its package may
 * ship. The checks themselves are `@wirecat/cli-base/release`; `scripts/release-check.ts` and
 * `cli-dev docs-check --rules scripts/release/checks.ts` run them.
 */
import { join, sep } from "node:path"
import {
  type ChangelogRules,
  changelogProblems,
  type DocsRules,
  JOURNAL_IDS,
  markdownFiles,
} from "@wirecat/cli-base/release"

const IDS = [...JOURNAL_IDS, "OPS", "CLI"]

const CHANGELOG: ChangelogRules = {
  headings: ["Added", "Changed — may break callers", "Fixed", "Removed", "Security"],
  unreleased: "Unreleased",
  ids: IDS,
}

// Released sections are frozen, so 0.69.0 and every version below it keep the names they were released with.
const LAST_OLD_HEADINGS = "0.69.0"
const OLD_HEADINGS = new Map([
  ["What's new", "Added"],
  ["Changed — may break scripts", "Changed — may break callers"],
])

const withOldHeadingsRenamed = (text: string) => {
  let old = false
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith(`## ${LAST_OLD_HEADINGS} — `)) old = true
      const renamed = old && line.startsWith("### ") ? OLD_HEADINGS.get(line.slice(4)) : undefined
      return renamed ? `### ${renamed}` : line
    })
    .join("\n")
}

export const changelogProblemsOf = (text: string, check: { release: boolean; version?: string }) =>
  changelogProblems(withOldHeadingsRenamed(text), { ...CHANGELOG, ...check })

// The agent skill and the scenarios ship because `tg skill show` and `tg guide` read them from the package.
export const PACKED = [
  "dist/",
  "install/",
  "package.json",
  "README.md",
  "LICENSE",
  "THIRD_PARTY_NOTICES",
  "skills/tg-cli/SKILL.md",
  "scenarios/",
  "spec/bot/LICENSE",
  "spec/bot/README.md",
]
export const PACKED_SAID =
  "dist/, the Windows installer, package.json, README.md, LICENSE, THIRD_PARTY_NOTICES, the agent skill, the guide's scenarios and Bot API source licence/provenance notes"

const GENERATED = new Set(["docs/commands.md"])

export const docsRules = (root: string): DocsRules => ({
  files: [
    ...["README.md", "CHANGELOG.md", "AGENTS.md", "CLAUDE.md", "skills/tg-cli/SKILL.md"].map((name) =>
      join(root, name),
    ),
    ...markdownFiles(join(root, "docs")),
  ],
  ids: IDS,
  userPage: (name) => {
    const portable = name.replaceAll("\\", "/")
    return portable === "README.md" || (/^docs\/[^/]+\.md$/.test(portable) && !GENERATED.has(portable))
  },
  // cli-core and max-cli are sibling checkouts on the owner's machine, not in CI.
  skipLink: (_, destination) => !destination.startsWith(root + sep) && destination !== root,
})
