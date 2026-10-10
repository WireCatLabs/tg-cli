import { thtml, type tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-core"
import { type FormattedText, type TextSpan, validateFormattedText } from "@wirecat/cli-messaging"

const PLAIN: Partial<Record<tl.TypeMessageEntity["_"], TextSpan["type"]>> = {
  messageEntityBold: "bold",
  messageEntityItalic: "italic",
  messageEntityUnderline: "underline",
  messageEntityStrike: "strike",
  messageEntityCode: "code",
  messageEntitySpoiler: "spoiler",
  messageEntityBlockquote: "blockquote",
}

const spanOf = (entity: tl.TypeMessageEntity): TextSpan => {
  const base = { from: entity.offset, length: entity.length }
  if (entity._ === "messageEntityTextUrl") return { type: "link", ...base, url: entity.url }
  if (entity._ === "messageEntityPre")
    return { type: "pre", ...base, ...(entity.language ? { language: entity.language } : {}) }
  const type = PLAIN[entity._]
  if (type) return { type, ...base }
  throw new CliError(
    "validation_error",
    "this HTML has a mention or a custom emoji; tg sends <b>, <i>, <u>, <s>, <a href>, <code>, <pre>, <blockquote> and <tg-spoiler>",
  )
}

/** Bot API HTML: whitespace and line breaks stay as typed, unlike in a browser. */
export const formatHtml = (input: string): FormattedText => {
  const { text, entities = [] } = thtml(input)
  return validateFormattedText({ text, spans: entities.map(spanOf) })
}
