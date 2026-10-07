import { describe, expect, it } from "vitest"
import { formatHtml } from "./format-html.js"

describe("Telegram HTML", () => {
  it("keeps line breaks and spaces as typed, and maps every tag tg sends", () => {
    const { text, spans } = formatHtml(
      'one\n  <b>b</b> <a href="https://x.io">l</a>\n<pre language="js">p</pre><tg-spoiler>s</tg-spoiler><u>u</u><s>t</s>',
    )

    expect(text).toBe("one\n  b l\npsut")
    expect(spans).toEqual([
      { type: "bold", from: 6, length: 1 },
      { type: "link", from: 8, length: 1, url: "https://x.io" },
      { type: "pre", from: 10, length: 1, language: "js" },
      { type: "spoiler", from: 11, length: 1 },
      { type: "underline", from: 12, length: 1 },
      { type: "strike", from: 13, length: 1 },
    ])
  })

  it("refuses a mention or a custom emoji, which the shared spans cannot carry", () => {
    expect(() => formatHtml('<a href="tg://user?id=1">x</a>')).toThrow("mention or a custom emoji")
    expect(() => formatHtml('<tg-emoji emoji-id="5">😀</tg-emoji>')).toThrow("mention or a custom emoji")
  })
})
