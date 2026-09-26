import { spawn } from "node:child_process"

/**
 * Hands a link to the system's own opener. Best effort: a server has no browser, so the caller
 * prints the link as well and never depends on this.
 */
export const openInBrowser = (url: string, platform: NodeJS.Platform = process.platform): boolean => {
  const [command, ...args] =
    platform === "darwin" ? ["open", url] : platform === "win32" ? ["cmd", "/c", "start", "", url] : ["xdg-open", url]
  try {
    const child = spawn(command ?? "xdg-open", args, { detached: true, stdio: "ignore" })
    child.on("error", () => {})
    child.unref()
    return true
  } catch {
    return false
  }
}
