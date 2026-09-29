import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { changelogProblems, docsProblems, slug } from "./docs-check.ts"

describe("the changelog", () => {
  it("accepts an unreleased section on top of dated versions", () => {
    expect(
      changelogProblems("# Changelog\n\n## Unreleased\n\n### Fixed\n\n## 0.4.0 — 29.09.2026\n\n### What's new\n"),
    ).toEqual([])
  })

  it("refuses a heading off the shape, an unknown subheading and an internal id", () => {
    const problems = changelogProblems("## 0.4.0 (2026-09-29)\n\n### Misc\n\n- fixed NEED-3\n\n## Unreleased\n")
    expect(problems).toHaveLength(4)
  })
})

describe("the documents", () => {
  it("finds a link to a missing file or heading, and ignores links out of the repository", () => {
    const root = mkdtempSync(join(process.env.TG_TEST_SANDBOX ?? "", "docs-"))
    mkdirSync(join(root, "docs"))
    writeFileSync(join(root, "docs", "a.md"), "# A page\n\n## Code `x` here\n")
    writeFileSync(
      join(root, "README.md"),
      "[ok](docs/a.md#a-page) [code](docs/a.md#code-x-here) [gone](docs/b.md) [bad](docs/a.md#nope) [out](../elsewhere/x.md)\n",
    )

    expect(docsProblems(root)).toEqual([
      "README.md:1: link to docs/b.md — no such file",
      "README.md:1: link to docs/a.md#nope — no such heading",
    ])
  })

  it("makes GitHub's anchor from a heading", () => {
    expect(slug("What's new — in 0.4")).toBe("whats-new--in-04")
  })
})
