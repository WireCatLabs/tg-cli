import { describe, expect, it } from "vitest"
import { formatMarkdown } from "./format-markdown.js"

describe("Telegram Markdown", () => {
  it("uses Telegram styles and preserves nested UTF-16 spans", () => {
    expect(formatMarkdown("🧪 **a _b_** __u__ ||s||")).toEqual({
      text: "🧪 a b u s",
      spans: [
        { type: "bold", from: 3, length: 3 },
        { type: "italic", from: 5, length: 1 },
        { type: "underline", from: 7, length: 1 },
        { type: "spoiler", from: 9, length: 1 },
      ],
    })
    expect(formatMarkdown("*bold* ~gone~").spans.map((span) => span.type)).toEqual(["bold", "strike"])
  })
  it("preserves words, escaped marks and unclosed inline marks", () => {
    for (const value of ["file_name_here", "𝒜_x_", "2*3*4", "**open", "++MAX++"])
      expect(formatMarkdown(value)).toEqual({ text: value, spans: [] })
    expect(formatMarkdown("\\*literal\\*")).toEqual({ text: "*literal*", spans: [] })
  })
  it("formats links and multiline quotes without interpreting code", () => {
    expect(formatMarkdown("> **quote**\n> next\nend")).toEqual({
      text: "quote\nnext\nend",
      spans: [
        { type: "blockquote", from: 0, length: 10 },
        { type: "bold", from: 0, length: 5 },
      ],
    })
    expect(formatMarkdown("[**label**](https://example.test/a(b))")).toEqual({
      text: "label",
      spans: [
        { type: "bold", from: 0, length: 5 },
        { type: "link", from: 0, length: 5, url: "https://example.test/a(b)" },
      ],
    })
    expect(formatMarkdown("```ts\n**raw**\r\n```\n")).toEqual({
      text: "**raw**\r\n",
      spans: [{ type: "pre", from: 0, length: 7, language: "ts" }],
    })
    expect(formatMarkdown("`_raw_`")).toEqual({ text: "_raw_", spans: [{ type: "code", from: 0, length: 5 }] })
  })
  it("refuses unsafe links, missing fences and illegal Telegram nesting", () => {
    for (const text of [
      "[x](javascript:alert(1))",
      "[x](file:///tmp/x)",
      "```js\nx",
      "**`code`**",
      "[a [b](https://example.test)](https://example.test)",
    ])
      expect(() => formatMarkdown(text)).toThrow()
  })
  it("bounds adversarial inputs and span count", () => {
    expect(formatMarkdown("[".repeat(10000)).text).toHaveLength(10000)
    expect(() => formatMarkdown("**x** ".repeat(101))).toThrow("100")
  })
})
