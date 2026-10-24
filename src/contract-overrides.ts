import type { SharedContractOverride } from "@wirecat/cli-base/commands"

// Reviewed differences from Core. A changed default requires reviewing this declaration.
export const SHELL_OVERRIDES: Readonly<{
  setup: readonly SharedContractOverride[]
  session: readonly SharedContractOverride[]
}> = {
  setup: [
    {
      command: ["setup"],
      field: "description",
      before: "set up the account and connect an agent",
      after: "set up Telegram and connect your agent",
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared setup lifecycle.",
    },
    {
      command: ["setup"],
      field: "mcp",
      before: false,
      after: null,
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared setup lifecycle.",
    },
    {
      command: ["setup"],
      field: "options",
      before: [
        {
          flags: "--agent <agent>",
          description: "install instructions for this agent",
          takes_value: true,
          mandatory: false,
        },
        {
          flags: "--method <method>",
          description: "login method",
          takes_value: true,
          mandatory: false,
        },
      ],
      after: [
        {
          flags: "--agent <agent>",
          description: "install the skill for this agent; asks at a terminal, otherwise none",
          takes_value: true,
          mandatory: false,
          choices: ["none", "codex", "cursor", "claude", "gemini", "all"],
        },
        {
          flags: "--app <how>",
          description: "how to get your Telegram app credentials the first time",
          takes_value: true,
          mandatory: false,
          choices: ["auto", "browser"],
          default: "auto",
        },
        {
          flags: "--method <method>",
          description: "how to log in when there is no session",
          takes_value: true,
          mandatory: false,
          choices: ["qr", "phone"],
          default: "qr",
        },
      ],
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared setup lifecycle.",
    },
  ],
  session: [
    {
      command: ["session"],
      field: "description",
      before: "link this account, or end its login",
      after: "log this profile in to Telegram, or out",
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
    {
      command: ["session"],
      field: "effects",
      before: {
        remote: "none",
        local: "none",
      },
      after: null,
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
    {
      command: ["session", "start"],
      field: "description",
      before: "link this account",
      after: "log in by QR code (default) or by phone number, code and 2FA password",
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
    {
      command: ["session", "start"],
      field: "arguments",
      before: [
        {
          name: "method",
          required: false,
          variadic: false,
          description: "login method",
        },
      ],
      after: [
        {
          name: "method",
          required: false,
          variadic: false,
          description: "how to log in",
          choices: ["qr", "phone"],
          default: "qr",
        },
      ],
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
    {
      command: ["session", "start"],
      field: "options",
      before: [],
      after: [
        {
          flags: "--app <how>",
          description: "the first time only: how to get this profile's app from my.telegram.org",
          takes_value: true,
          mandatory: false,
          choices: ["browser", "auto"],
          default: "browser",
        },
        {
          flags: "--sms",
          description: "phone login: ask Telegram to send the code by SMS, not to the app; Telegram may still refuse",
          takes_value: false,
          mandatory: false,
        },
      ],
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
    {
      command: ["session", "end"],
      field: "description",
      before: "end this account's login",
      after: "log this profile out on Telegram's side and forget the session here",
      reason:
        "This provider binds its own account linking protocol, credential flow and typed receipt to the shared session lifecycle.",
    },
  ],
}
