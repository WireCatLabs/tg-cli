/**
 * Links, anchors and the user-page rules in every document, and the changelog's shape — on every
 * pull request, so a stale link fails the change that made it. Ported from max-cli's
 * `scripts/docs-check.ts` and `scripts/release/checks.ts`.
 *
 *   pnpm docs:check
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

export const HEADINGS = ["What's new", "Changed — may break scripts", "Fixed", "Security", "Removed"] as const
export const UNRELEASED = "Unreleased"

const ID = /\b(?:NEED|FIND|BUG|SEC|PERF|UX|IDEA|RISK|DEBT|ASK|TASK|OPS|CLI)-\d+\b/g
const VERSION_HEADING = /^## (\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?) — (\d{2})\.(\d{2})\.(\d{4})$/

export const changelogProblems = (text: string) => {
  const problems: string[] = []
  let section: string | undefined
  let subheadings = new Set<string>()
  let first = true

  text.split("\n").forEach((line, index) => {
    const where = `CHANGELOG.md:${index + 1}`
    if (line.startsWith("## ")) {
      section = line.slice(3)
      subheadings = new Set()
      if (line === `## ${UNRELEASED}`) {
        if (!first) problems.push(`${where}: "${UNRELEASED}" must be the top section`)
      } else {
        const found = VERSION_HEADING.exec(line)
        if (!found) problems.push(`${where}: "${line}" is not "## <version> — DD.MM.YYYY"`)
        else {
          const [, , day, month] = found
          if (Number(day) < 1 || Number(day) > 31 || Number(month) < 1 || Number(month) > 12)
            problems.push(`${where}: "${line}" has no such date`)
        }
      }
      first = false
      return
    }
    if (line.startsWith("### ")) {
      const heading = line.slice(4)
      if (!(HEADINGS as readonly string[]).includes(heading))
        problems.push(`${where}: "${heading}" is not one of: ${HEADINGS.join(", ")}`)
      if (subheadings.has(heading)) problems.push(`${where}: "${heading}" twice in "${section}"`)
      subheadings.add(heading)
    }
    for (const id of line.match(ID) ?? []) problems.push(`${where}: internal id ${id} — say what changed instead`)
  })
  return problems
}

/** GitHub's heading anchor: lower case, only letters, digits, `-`, `_` and spaces kept, spaces to `-`. */
export const slug = (heading: string) =>
  heading
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\-_ ]/gu, "")
    .replace(/ /g, "-")

const withoutCode = (text: string) =>
  text
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, (block) => block.replace(/[^\n]/g, " "))
    .replace(/`[^`\n]*`/g, (span) => " ".repeat(span.length))

const headingsOf = (text: string) => {
  const raw = text.split("\n")
  const masked = withoutCode(text).split("\n")
  return masked.map((line, index) => (/^#{1,6} /.test(line) ? (raw[index] ?? "") : "")).join("\n")
}

const anchorsOf = (text: string) => {
  const anchors = new Set<string>()
  const counts = new Map<string, number>()
  for (const line of headingsOf(text).split("\n")) {
    const heading = /^#{1,6} (.+?)\s*#*\s*$/.exec(line)?.[1]
    if (heading === undefined) continue
    const base = slug(heading)
    const seen = counts.get(base) ?? 0
    counts.set(base, seen + 1)
    anchors.add(seen === 0 ? base : `${base}-${seen}`)
  }
  for (const [, name = ""] of text.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) anchors.add(name)
  return anchors
}

const markdownFiles = (directory: string): string[] =>
  existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name)
        if (entry.isDirectory()) return markdownFiles(path)
        return entry.name.endsWith(".md") ? [path] : []
      })
    : []

/** The pages a user reads: no correction marks, no struck-out text, no internal ids. */
const isUserPage = (root: string, path: string) => {
  const name = relative(root, path)
  return name === "README.md" || /^docs\/[^/]+\.md$/.test(name)
}

export const docsProblems = (root: string) => {
  const files = [
    ...["README.md", "CHANGELOG.md", "HANDOFF.md", "AGENTS.md", "CLAUDE.md", "skills/tg-cli/SKILL.md"].map((name) =>
      join(root, name),
    ),
    ...markdownFiles(join(root, "docs")),
  ].filter((path) => existsSync(path))
  const anchorCache = new Map<string, Set<string>>()
  const anchors = (path: string) => {
    let found = anchorCache.get(path)
    if (!found) {
      found = anchorsOf(readFileSync(path, "utf8"))
      anchorCache.set(path, found)
    }
    return found
  }

  const problems: string[] = []
  for (const path of files) {
    const name = relative(root, path)
    withoutCode(readFileSync(path, "utf8"))
      .split("\n")
      .forEach((line, index) => {
        const where = `${name}:${index + 1}`
        for (const [, target] of line.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
          if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue
          const [file = "", anchor] = decodeURIComponent(target).split("#")
          const destination = file === "" ? path : resolve(dirname(path), file)
          // cli-messaging and max-cli are sibling checkouts on the owner's machine, not in CI.
          if (!destination.startsWith(root + sep) && destination !== root) continue
          if (!existsSync(destination)) {
            problems.push(`${where}: link to ${file} — no such file`)
            continue
          }
          if (
            anchor &&
            destination.endsWith(".md") &&
            statSync(destination).isFile() &&
            !anchors(destination).has(anchor)
          )
            problems.push(`${where}: link to ${file}#${anchor} — no such heading`)
        }

        if (!isUserPage(root, path)) return
        if (/correction \d{4}/i.test(line)) problems.push(`${where}: a correction mark on a user page`)
        if (line.includes("~~")) problems.push(`${where}: struck-out text on a user page`)
        for (const id of line.match(ID) ?? []) problems.push(`${where}: internal id ${id} on a user page`)
      })
  }
  return problems
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const problems = [...changelogProblems(readFileSync(join(root, "CHANGELOG.md"), "utf8")), ...docsProblems(root)]
  for (const problem of problems) console.error(problem)
  if (problems.length > 0) process.exit(1)
  console.log("docs: ok")
}
