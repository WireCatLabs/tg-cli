#!/bin/sh
# Refuses an Edit, Write or NotebookEdit outside the folders agents may change: this project (its
# worktrees included), cli-messaging and cli-core beside it, the session's scratch folder and this
# project's memory. Runs in every permission mode, bypass included; the sandbox in settings.json
# holds shell commands to the same folders.
set -eu
here=$(CDPATH='' cd -- "$(dirname -- "$0")/../.." && pwd)
main=$(dirname "$(git -C "$here" rev-parse --path-format=absolute --git-common-dir)")
beside=$(dirname "$main")
path=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
[ -n "$path" ] || exit 0
real=$(realpath -m -- "$path")
# The guards themselves are the owner's to change, in any checkout: an agent that could edit them could lift them.
case "$real" in
  */.claude/settings.json | */.claude/settings.local.json | */.claude/hooks/*)
    echo "refused: $real is one of the guards agents run under — the owner changes it" >&2
    exit 2
    ;;
esac
for root in "$main" "$beside/cli-messaging" "$beside/cli-core" "/tmp/claude-$(id -u)"; do
  case "$real/" in "$root"/*) exit 0 ;; esac
done
case "$real" in "$HOME"/.*/projects/-home-*-tg-cli*/memory/*) exit 0 ;; esac
echo "refused: $real is outside the folders this project may change — $main, $beside/cli-messaging, $beside/cli-core" >&2
exit 2
