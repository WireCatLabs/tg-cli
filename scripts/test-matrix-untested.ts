/**
 * What `tg` cannot test offline, each with the reason and where it is checked instead. An entry
 * that names a command or option the program no longer has fails `pnpm test:matrix`.
 * `command` ending in ` *` covers every subcommand under it.
 */
export interface Untested {
  command: string
  option?: string
  reason: string
}

export const UNTESTED: Untested[] = [
  {
    command: "attachments show",
    option: "--page",
    reason:
      "cli-core 0.207.0 src/cli/messenger/attachments.test.ts renders a retained PDF page and refuses non-PDFs; it needs the optional unpdf and @napi-rs/canvas, which tg does not install",
  },

  ...[
    ["stats chats newcomers", "--saved"],
    ["stats messages discussion", "--saved"],
  ].map(([command, option]) => ({
    command: command as string,
    option,
    reason:
      "cli-core src/services/admin-statistics.test.ts covers shared report saved-run scope and typed overrides; native admin-statistics-adoption.test.ts checks mounted report paths and both evidence targets without connecting",
  })),

  ...[
    ["metadata get"],
    ["metadata get", "--chat"],
    ["metadata refresh", "--chat"],
    ["metadata refresh", "--limit"],
  ].map(([command, option]) => ({
    command: command as string,
    ...(option ? { option } : {}),
    reason:
      "cli-core src/services/private-people.test.ts («refreshes supported metadata through a read capability…», «bounds work…») covers the shared metadata command this consumer mounts (cli-core 0.174.0)",
  })),
  {
    command: "messages sync",
    option: "--all",
    reason:
      "cli-core src/services/archive.test.ts («walks the chats most recently active first…») and src/cli/messenger/backfill.test.ts («--all fetches every chat in a job…») cover the shared command (cli-core 0.174.0)",
  },
  {
    command: "stats messages top",
    option: "--sync-first",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--max-chats",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--sync-time",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--max-messages",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--measure",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--score",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--weights",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--message-kind",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--chat",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--source",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--timezone",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--exact",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages top",
    option: "--saved",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages evidence",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages evidence",
    option: "--selection",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages evidence",
    option: "--component",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages evidence",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats messages evidence",
    option: "--cursor",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--sync-first",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--max-chats",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--sync-time",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--max-messages",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--measure",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--score",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--weights",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--message-kind",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--chat",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--source",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--timezone",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--exact",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--saved",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts top",
    option: "--min-messages",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts evidence",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts evidence",
    option: "--selection",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts evidence",
    option: "--component",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts evidence",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "stats contacts evidence",
    option: "--cursor",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  {
    command: "searches create",
    option: "--selection",
    reason:
      "cli-core src/cli/messenger/rankings-command.test.ts, src/services/rankings.test.ts and src/store/rankings.test.ts cover the rankings over the local store; tg mounts the shared stats and searches commands and reads only its store",
  },
  ...["--backend", "--server-time"].map((option) => ({
    command: "search messages",
    option,
    reason:
      "cli-core src/services/server-search.test.ts and src/cli/messenger/messenger.test.ts cover the server step and the flags; this consumer mounts the shared command, and src/telegram/adapter.test.ts covers its searchMessages",
  })),
  {
    command: "messages download",
    option: "--extract",
    reason:
      "cli-core src/cli/messenger/attachments.test.ts covers reading text layers after a download; this consumer mounts the shared command (cli-core 0.162.0)",
  },
  ...["--catch-up", "--no-catch-up", "--catch-up-chunks", "--catch-up-messages", "--catch-up-time"].map((option) => ({
    command: "messages sync",
    option,
    reason:
      "cli-core src/cli/messenger/backfill.test.ts covers the bounded local catch-up after a fetch; this consumer mounts the shared command (cli-core 0.162.0)",
  })),
  ...[
    "--limit",
    "--max-gaps",
    "--repair-time",
    "--page-size",
    "--pause",
    "--fingerprint",
    "--catch-up",
    "--no-catch-up",
    "--catch-up-chunks",
    "--catch-up-messages",
    "--catch-up-time",
    "--background",
  ].map((option) => ({
    command: "store gaps repair",
    option,
    reason:
      "cli-core src/cli/messenger/gaps.test.ts and src/services/archive-gaps.test.ts cover planning and repairing archive gaps; this consumer mounts the shared command (cli-core 0.162.0)",
  })),
  ...["--from-dir", "--cursor"].map((option) => ({
    command: "attachments extract",
    option,
    reason:
      "cli-core src/cli/messenger/attachments.test.ts covers extraction from a directory and its cursor; this consumer mounts the shared command (cli-core 0.162.0)",
  })),
  ...["mcp setup", "mcp doctor"].map((command) => ({
    command,
    option: "--permission",
    reason:
      "cli-core src/cli/messenger/mcp-command-http.test.ts covers permission override serialization; cli-base checks the external child handshake and registration",
  })),

  {
    command: "chats members audit",
    option: "--deep",
    reason:
      'cli-core src/cli/messenger/messenger.test.ts ("chats members audit 7 --deep 1") and src/services/members-audit.test.ts cover the deep check of the top flagged members; this consumer mounts the shared command',
  },
  {
    command: "chats members fetch",
    option: "--track",
    reason:
      'cli-core src/cli/messenger/messenger.test.ts ("chats members fetch 7 --track") covers adding a chat to the daily member fetch; this consumer mounts the shared command',
  },
  {
    command: "chats members fetch",
    option: "--max-pages",
    reason:
      "cli-core src/services/members-fetch.test.ts covers the page budget and the pause between pages; shared option parsing",
  },
  {
    command: "contacts check",
    option: "--no-registries",
    reason:
      'cli-core src/cli/messenger/messenger.test.ts ("contacts check 40 --no-registries") covers scoring from local signals alone, no registry asked; this consumer mounts the shared command',
  },
  {
    command: "contacts context",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/messenger.test.ts and src/store/contacts.test.ts cover local identity context and archive gaps; this consumer mounts the shared command",
  },
  {
    command: "contacts context",
    option: "--since-time",
    reason:
      "cli-core src/cli/messenger/messenger.test.ts and src/store/contacts.test.ts cover local identity context and stored-message filtering; shared option parsing",
  },
  {
    command: "stats messages show",
    option: "--saved",
    reason:
      "cli-core src/cli/messenger/searches.test.ts covers saved query execution and src/services/searches.test.ts validates shared query parameters",
  },
  {
    command: "store repair",
    option: "--dry-run",
    reason:
      "cli-core src/cli/messenger/store-maintenance.test.ts and src/store/repair.test.ts cover preview rollback and retained data",
  },
  {
    command: "search all",
    option: "--max-meetings",
    reason: "cli-core src/cli/messenger/messenger.test.ts bounds how many meetings search all looks through",
  },
  {
    command: "search all",
    option: "--backend",
    reason:
      "cli-core src/cli/messenger/messenger.test.ts covers archive (never connects), server and both for search all",
  },
  {
    command: "search all",
    option: "--server-time",
    reason: "cli-core src/cli/messenger/messenger.test.ts bounds the server step; search all passes it unchanged",
  },
  {
    command: "store reset",
    option: "--no-backup",
    reason: "cli-core src/cli/messenger/store-maintenance.test.ts resets without a copy and checks backup: null",
  },
  {
    command: "tags add",
    option: "--contact",
    reason:
      "cli-core src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags add",
    option: "--message",
    reason:
      "cli-core src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags remove",
    option: "--contact",
    reason:
      "cli-core src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "tags remove",
    option: "--message",
    reason:
      "cli-core src/cli/messenger/tags.test.ts covers chat, contact and message targets through the shared command; consumer integration tests cover mounting, account isolation and permissions",
  },
  {
    command: "searches create",
    option: "--source",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--limit",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--newest",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--context",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--timezone",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--by",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches create",
    option: "--replace",
    reason:
      "cli-core src/cli/messenger/searches.test.ts and src/services/searches.test.ts cover named queries, parameter validation and replacement; consumer integration tests cover saved execution and no-record",
  },
  {
    command: "searches history",
    option: "--limit",
    reason:
      "cli-core src/services/searches.test.ts covers bounded newest history and pruning; consumer integration tests cover no-record and named-query preservation",
  },
  ...["--max-pages"].map((option) => ({
    command: "chats members audit",
    ...(option ? { option } : {}),
    reason:
      "shared member audit; cli-core src/cli/messenger/messenger.test.ts drives the command and src/services/members-audit.test.ts covers page budgets, thresholds and unavailable signals with synthetic members",
  })),
  {
    command: "chats moderate",
    option: "--since-time",
    reason:
      "P2's shared command; cli-core's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--dry-run",
    reason:
      "P2's shared command; cli-core's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--allow-dangerous",
    reason:
      "P2's shared command; cli-core's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "chats moderate",
    option: "--max-actions",
    reason:
      "P2's shared command; cli-core's moderation tests drive it through the port, and tg's own test " +
      "comes with P2's Telegram moderation work",
  },
  {
    command: "bot mcp",
    reason:
      "serves MCP on stdin until the client closes; cli-core's src/mcp/bot/server.test.ts drives the server, " +
      "and src/bot.test.ts the tools tg offers",
  },
  {
    command: "mcp",
    reason:
      "serves MCP on the process's own stdin until the client closes; cli-core's src/mcp/mcp.test.ts drives " +
      "the server — tools offered by the profile's permissions — and HANDOFF.md §3b names the live check",
  },
  {
    command: "mcp setup",
    option: "--allow-writes",
    reason:
      "registers an external client's local configuration; cli-base's src/mcp/index.test.ts checks registration and the handshake, and tg setup was checked with an isolated Codex home",
  },
  {
    command: "messages sync",
    option: "--background",
    reason:
      "spawns a detached process that outlives the test; cli-core's src/cli/messenger/backfill.test.ts " +
      "drives it with a stand-in spawnJob, and lane L5 owns the live check",
  },
  {
    command: "images embed",
    option: "--chat",
    reason: "downloads each picture through Telegram and needs the downloaded model; cli-core's tests drive it offline",
  },
  {
    command: "images embed",
    option: "--limit",
    reason: "downloads each picture through Telegram and needs the downloaded model; cli-core's tests drive it offline",
  },
  {
    command: "models text download",
    option: "--accept-terms",
    reason: "phase 5's shared command; it downloads a model over the network, and cli-core's tests drive it offline",
  },
  {
    command: "contacts show",
    option: "--with-notes",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "tags auto",
    option: "--chat",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "tags auto",
    option: "--limit",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "tags auto",
    option: "--sync-first",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "tags auto",
    option: "--dry-run",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "tags remove",
    option: "--source",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "contacts notes add",
    option: "--file",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "contacts notes edit",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "contacts notes edit",
    option: "--file",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  {
    command: "contacts notes edit",
    option: "--revision",
    reason:
      "cli-core src/services/private-people.test.ts covers scoped notes search/exposure, offline note CRUD with file/revision, tag provenance filters, bounded metadata auto tagging, dry-run and retained metadata after failed refresh; this consumer mounts the shared handlers",
  },
  ...[
    ["tasks add", "--title"],
    ["tasks add", "--due"],
    ["tasks add", "--remind-time"],
    ["tasks plan", "--due"],
    ["tasks plan", "--remind-time"],
    ["tasks link", "--chat"],
    ["tasks link", "--kind"],
    ["tasks agenda", "--due-within"],
    ["tasks agenda", "--waiting"],
    ["tasks agenda", "--within"],
  ].map(([command, option]) => ({
    command: command as string,
    option,
    reason:
      'cli-core src/cli/messenger/tasks.test.ts ("plans, links and shows a task, and lists it on the agenda") drives this through the shared handler tg mounts (0.247.0)',
  })),
  ...[
    ["tags add", "--task"],
    ["tags remove", "--task"],
    ["tasks plan", "--category"],
    ["tasks agenda", "--holder"],
    ["tasks claim", "--lease"],
    ["tasks claim", "--holder"],
    ["tasks release", "--holder"],
  ].map(([command, option]) => ({
    command: command as string,
    option,
    reason:
      'cli-core src/cli/messenger/tasks.test.ts ("keys, categorizes, tags and claims a task") drives this through the shared handler tg mounts (0.282.0)',
  })),
  ...[
    ["tasks add", "--description"],
    ["tasks plan", "--title"],
    ["tasks plan", "--description"],
    ["tasks agenda", "--unanswered"],
  ].map(([command, option]) => ({
    command: command as string,
    option,
    reason:
      "cli-core src/cli/messenger/tasks.test.ts drives the sibling options of this command through the shared handler tg mounts, not this one; parsed by the same code (0.247.0)",
  })),
  {
    command: "schedule command",
    option: "--every",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule command",
    option: "--at",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule command",
    option: "--at-time",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives --every and --at through the shared handler tg mounts and a one-off run that removes itself; --at-time is parsed by the same code (0.250.1)",
  },
  {
    command: "schedule agent",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule agent",
    option: "--max-cost",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule agent",
    option: "--every",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule agent",
    option: "--at",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives this through the shared handler tg mounts; schedules.os.test.ts runs the timers on macOS and Windows CI (0.250.1)",
  },
  {
    command: "schedule agent",
    option: "--at-time",
    reason:
      "cli-core src/cli/messenger/schedule.test.ts drives --every and --at through the shared handler tg mounts and a one-off run that removes itself; --at-time is parsed by the same code (0.250.1)",
  },
  ...["--brief", "--full"].map((option) => ({
    command: "",
    option,
    reason:
      "cli-core src/output-detail.test.ts and src/cli/messenger/messenger.test.ts drive --brief and --full through the shared program tg mounts (0.251.0)",
  })),
  {
    command: "chats link list",
    option: "--page",
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; this consumer mounts the shared handler",
  },
  {
    command: "chats requests list",
    option: "--page",
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; this consumer mounts the shared handler",
  },
  {
    command: "messages list",
    option: "--cursor",
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; this consumer mounts the shared handler",
  },
  {
    command: "messages comments",
    option: "--cursor",
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; this consumer mounts the shared handler",
  },
  {
    command: "polls voters",
    option: "--page",
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; this consumer mounts the shared handler",
  },

  ...[
    ["tasks add", "--into"],
    ["tasks add", "--new"],
    ["tasks duplicates"],
    ["tasks merge"],
    ["tasks merge", "--into"],
  ].map(([command, option]) => ({
    command: command as string,
    ...(option ? { option } : {}),
    reason:
      'cli-core src/cli/messenger/tasks.test.ts ("tasks that may be one job": refuses, --into, --new, lists, merges, unmerges) drives this through the shared handler tg mounts (0.285.0)',
  })),

  {
    command: "mentions list",
    option: "--new",
    reason:
      'cli-core src/cli/messenger/mentions.test.ts ("lists only undecided mentions found since the last --new run") drives this through the shared handler tg mounts (0.285.0)',
  },

  ...[["mentions confirm"], ["mentions reject"]].map(([command]) => ({
    command: command as string,
    option: "--all-in-chat",
    reason:
      'cli-core src/store/mentions.test.ts ("decides a name in every undecided place of its chat with --all-in-chat") covers the store write the shared command calls; the flag is parsed by the shared handler tg mounts (0.285.0)',
  })),

  ...[
    ["mentions domains", "--limit"],
    ["mentions domains", "--page"],
    ["tasks related", "--limit"],
    ["tasks duplicates", "--limit"],
  ].map(([command, option]) => ({
    command: command as string,
    option,
    reason:
      "paging is cli-core's shared list envelope, covered by its own tests; the command itself is driven in cli-core src/cli/messenger/mentions.test.ts and tasks.test.ts through the shared handler this consumer mounts (0.285.0)",
  })),
  {
    command: "mentions places",
    option: "--limit",
    reason:
      'cli-core src/cli/messenger/mentions.test.ts ("pages confirmed places through the shared CLI and stops at the end") drives --limit/--page, distinct confirmed addresses, exhaustion and has_more; this consumer mounts the unchanged handler from Core 0.311.0',
  },
  {
    command: "mentions places",
    option: "--page",
    reason:
      'cli-core src/cli/messenger/mentions.test.ts ("pages confirmed places through the shared CLI and stops at the end") drives --limit/--page, distinct confirmed addresses, exhaustion and has_more; this consumer mounts the unchanged handler from Core 0.311.0',
  },
  {
    command: "tasks scan",
    option: "--last",
    reason: `cli-core src/cli/messenger/tasks.test.ts ("tasks scan lists what a chat's history would open, and opens it only with --yes") drives this through the shared handler tg mounts (0.320.0)`,
  },
  ...[["tasks add"], ["tasks plan"]].map(([command]) => ({
    command: command as string,
    option: "--assignee",
    reason:
      'cli-core src/cli/messenger/tasks.test.ts ("lists what someone owes the owner with assignee:, after tasks add --assignee sender") drives this through the shared handler tg mounts (0.320.0)',
  })),
]
