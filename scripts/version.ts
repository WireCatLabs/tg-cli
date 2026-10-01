/**
 * Keeps `src/version.ts` in step with `package.json`, and fails when it is not.
 *
 *   pnpm version:check
 *   pnpm version:sync     # writes package.json's version into src/version.ts
 */
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { versionScript } from "@leemour/cli-core/release"

const { code, message } = versionScript(join(dirname(fileURLToPath(import.meta.url)), ".."), process.argv)
if (code === 0) console.log(message)
else console.error(message)
process.exit(code)
