import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { docsProblems } from "@wirecat/cli-base/release"
import { describe, expect, it } from "vitest"
import { changelogProblemsOf, docsRules } from "./checks.ts"

describe("docsRules", () => {
  it("passes over links out of the repository and the generated page, and holds user pages", () => {
    const root = mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "docs-"))
    mkdirSync(join(root, "docs"))
    writeFileSync(join(root, "docs", "commands.md"), "# Commands\n\n~~old~~ CLI-1\n")
    writeFileSync(join(root, "docs", "usage.md"), "# Usage\n\n~~was~~ now (NEED-3)\n")
    writeFileSync(join(root, "README.md"), "[out](../cli-messaging/README.md) [gone](docs/b.md)\n")

    expect(docsProblems(root, docsRules(root)).map((problem) => problem.replaceAll("\\", "/"))).toEqual([
      "README.md:1: link to docs/b.md — no such file",
      "docs/usage.md:3: struck-out text on a user page",
      "docs/usage.md:3: internal id NEED-3 on a user page",
    ])
  })
})

describe("changelogProblemsOf", () => {
  const changelog = (unreleased: string, released: string) =>
    `# Changelog\n\n## Unreleased\n\n### ${unreleased}\n\n- a\n\n## 0.69.0 — 17.10.2026\n\n### ${released}\n\n- b\n`

  it("takes the new headings on top and the old ones in 0.69.0 and below", () => {
    expect(changelogProblemsOf(changelog("Added", "What's new"), { release: false })).toEqual([])
    expect(
      changelogProblemsOf(changelog("Changed — may break callers", "Changed — may break scripts"), { release: false }),
    ).toEqual([])
  })

  it("refuses an old heading above 0.69.0", () => {
    expect(changelogProblemsOf(changelog("What's new", "Fixed"), { release: false })).toEqual([
      'CHANGELOG.md:5: "What\'s new" is not one of: Added, Changed — may break callers, Fixed, Removed, Security',
    ])
  })
})
