/**
 * Everything about a release that a program can decide, one line each, and exit 1 if any failed.
 * `bin/release` runs the full check; release CI uses --artifact-only after full validation, and full validation
 * runs --package-only. The judgement half —
 * changelog wording, docs against the diff, live checks — is the release skill,
 * `docs/dev/skills/release/SKILL.md`.
 *
 *   pnpm release:check
 */
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { command, docsProblems, notOnNpm, packageVersion, packContents, releaseCheck } from "@wirecat/cli-base/release"
import { changelogProblemsOf, docsRules, PACKED, PACKED_SAID } from "./release/checks.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const version = packageVersion(root)

const only = process.argv.includes("--package-only")
  ? ["package contents"]
  : process.argv.includes("--artifact-only")
    ? ["changelog", "web client version", "package contents"]
    : undefined

const failed = releaseCheck(
  [
    { name: "version not on npm", run: notOnNpm(root, "@wirecat/tg-cli", version) },
    { name: "version in step", run: command(root, "pnpm", "version:check") },
    {
      name: "changelog",
      run: () => changelogProblemsOf(readFileSync(join(root, "CHANGELOG.md"), "utf8"), { version, release: true }),
    },
    { name: "docs", run: () => docsProblems(root, docsRules(root)) },
    { name: "lint", run: command(root, "pnpm", "lint") },
    { name: "typecheck", run: command(root, "pnpm", "typecheck") },
    { name: "test", run: command(root, "pnpm", "test") },
    { name: "bun", run: command(root, "pnpm", "smoke:bun") },
    { name: "generated files", run: command(root, "pnpm", "generate") },
    { name: "command lint", run: command(root, "pnpm", "lint:commands") },
    {
      name: "test matrix",
      run: command(
        root,
        "pnpm",
        "exec",
        "cli-dev",
        "test-matrix",
        "--program",
        "dist/whole-program.js",
        "--untested",
        "scripts/test-matrix-untested.ts",
        "--name",
        "tg",
        "--check",
      ),
    },
    { name: "tree unchanged", run: command(root, "git", "diff", "--exit-code", "--stat") },
    { name: "package contents", run: packContents(root, PACKED, PACKED_SAID) },
    ...(process.env.SECURITY_SECRETS_CHECKED === "1" && process.env.CI
      ? []
      : [
          {
            name: "secrets",
            run: command(root, "gitleaks", "git", "--no-banner", "--redact", "--exit-code", "1", "."),
          },
        ]),
  ].filter((check) => !only || only.includes(check.name)),
  { version, log: console.log },
)
process.exit(failed === 0 ? 0 : 1)
