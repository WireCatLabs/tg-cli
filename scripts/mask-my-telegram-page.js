// Paste into the DevTools console on https://my.telegram.org/apps while logged in. It saves a copy of the
// page with every key, number, token and the app's own names replaced, as my-telegram-apps.masked.html in
// Downloads. Nothing leaves the browser; the unmasked page is never written anywhere.
;(() => {
  const shape = (value) => value.replace(/[0-9a-fA-F]/g, "1").replace(/[a-zA-Z]/g, "x")
  const NAMED = /^(hash|app_title|app_shortname|app_desc|app_url|phone|random_hash)$/
  const mask = (html) =>
    html
      .replace(/<input\b[^>]*>/gi, (tag) =>
        NAMED.test(/\bname="([^"]*)"/i.exec(tag)?.[1] ?? "")
          ? tag.replace(/\bvalue="([^"]*)"/i, (_, v) => `value="${shape(v)}"`)
          : tag,
      )
      .replace(/\b(data-value|data-copy)="([^"]*)"/gi, (_, name, v) => `${name}="${shape(v)}"`)
      .replace(/[0-9a-fA-F]{16,}/g, shape)
      .replace(/[A-Za-z0-9_-]{24,}/g, shape)
      .replace(/\+?\d[\d\s()-]{6,}\d/g, shape)
      .replace(/\d{5,}/g, shape)
  if (typeof document === "undefined") {
    globalThis.maskMyTelegram = mask
    return
  }
  const page = mask(`<!DOCTYPE html>\n${document.documentElement.outerHTML}`)
  const link = document.createElement("a")
  link.href = URL.createObjectURL(new Blob([page], { type: "text/html" }))
  link.download = "my-telegram-apps.masked.html"
  link.click()
  return `saved ${page.length} characters`
})()
