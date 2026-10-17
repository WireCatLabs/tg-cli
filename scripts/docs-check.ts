/**
 * Links, anchors and the user-page rules in every document, the docs folder against its sidebar
 * (`docs/meta.json`, the docs portal's page structure), and the changelog's shape. Full validation runs it on each
 * merge to `main`, and `pnpm release:check` before a release; run it before you push a change to a document.
 *
 *   pnpm docs:check
 *
 * "Unreleased" is allowed here; `pnpm release:check` refuses it.
 */
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { docsProblems, structureProblems } from "@wirecat/cli-base/release"
import { changelogProblemsOf, docsRules } from "./release/checks.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const problems = [
  ...changelogProblemsOf(readFileSync(join(root, "CHANGELOG.md"), "utf8"), { release: false }),
  ...docsProblems(root, docsRules(root)),
  ...structureProblems(root),
]
for (const problem of problems) console.error(problem)
if (problems.length > 0) process.exit(1)
console.log("docs: ok")
