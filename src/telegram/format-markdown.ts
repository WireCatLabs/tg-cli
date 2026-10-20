import { CliError } from "@wirecat/cli-base"
import { type FormattedText, parseMarkdownSpans, validateFormattedText } from "@wirecat/cli-core"

const fail = (message: string): never => {
  throw new CliError("validation_error", message)
}

export const formatMarkdown = (input: string): FormattedText => {
  const result = parseMarkdownSpans(input)
  // A fenced body always ends at a line start, so a "pre" span that does not end in a newline came from a one-line ```x``` block.
  const unsupported = result.spans.find(
    (span) =>
      span.type === "heading" ||
      (span.type === "pre" && !/\n$/u.test(result.text.slice(span.from, span.from + span.length))),
  )
  if (unsupported?.type === "heading") fail("Telegram has no Markdown headings; write the line in bold")
  if (unsupported) fail("Telegram does not show a one-line ``` block; put the code on its own lines between fences")
  for (const a of result.spans)
    for (const b of result.spans) {
      if (a === b || a.from >= b.from + b.length || b.from >= a.from + a.length) continue
      if (
        [a.type, b.type].some((type) => type === "code" || type === "pre") ||
        (a.type === "link" && b.type === "link") ||
        (a.type === "blockquote" && b.type === "blockquote")
      )
        fail("Telegram does not support this Markdown entity nesting")
    }
  for (const span of result.spans) {
    while (span.length > 0 && /\s/u.test(result.text[span.from + span.length - 1] ?? "")) span.length--
  }
  result.spans = result.spans.filter((span) => span.length > 0)
  result.spans.sort((a, b) => a.from - b.from || b.length - a.length || a.type.localeCompare(b.type))
  return validateFormattedText(result)
}
