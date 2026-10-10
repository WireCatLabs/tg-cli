import { spawnSync } from "node:child_process"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { installSkill } from "@wirecat/cli-core/skill"
import { VERSION } from "../version.js"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

export const completeGlobalInstall = ({
  env = process.env,
  platform = process.platform,
  packageRoot = root,
  repair = (prefix: string) => {
    const child = spawnSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-EncodedCommand",
        Buffer.from(
          "& $env:TG_INSTALL_SCRIPT -RepairOnly -Prefix $env:TG_INSTALL_PREFIX -NodeDirectory $env:TG_INSTALL_NODE -Json",
          "utf16le",
        ).toString("base64"),
      ],
      {
        encoding: "utf8",
        env: {
          ...env,
          TG_INSTALL_SCRIPT: resolve(packageRoot, "install/windows.ps1"),
          TG_INSTALL_PREFIX: prefix,
          TG_INSTALL_NODE: dirname(process.execPath),
        },
      },
    )
    if (child.error || child.status !== 0)
      throw new Error("Windows PATH setup failed; run the Windows installer from the installation guide")
  },
  note = (message: string) => process.stderr.write(`${message}\n`),
} = {}): void => {
  if (env.npm_config_global !== "true") return
  if (platform === "win32") {
    const prefix = env.npm_config_prefix
    if (!prefix) throw new Error("npm did not provide its global prefix; use the Windows installer")
    repair(prefix)
    note("tg: Windows user PATH updated; new terminals can run tg directly.")
  }
  if (env.TG_INSTALL_AGENT === "none") {
    note("tg: agent skill skipped by TG_INSTALL_AGENT=none; install with tg skill install --for all.")
  } else {
    const agent = env.TG_INSTALL_AGENT ?? "all"
    if (!["all", "codex", "cursor", "claude", "gemini"].includes(agent))
      throw new Error("TG_INSTALL_AGENT must be all, codex, cursor, claude, gemini or none")
    const targets =
      agent === "all"
        ? (["claude", "agents"] as const)
        : agent === "claude"
          ? (["claude"] as const)
          : (["agents"] as const)
    installSkill(
      { command: "tg", appName: "tg-cli", version: VERSION },
      pathToFileURL(join(packageRoot, "skills/tg-cli/SKILL.md")),
      { env, targets },
    )
    note("tg: agent skill installed. Agent: read tg skill show before login; verify the installed skill is loaded.")
  }
  note("tg: guided account login: tg setup. Allow about five minutes; history downloads are separate.")
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    completeGlobalInstall()
  } catch (error) {
    process.stderr.write(`tg installation incomplete: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
