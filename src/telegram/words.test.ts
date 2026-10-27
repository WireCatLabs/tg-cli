import { tl } from "@mtcute/node"
import { memoryKeyring } from "@wirecat/cli-base/testing"
import { checkWords as wordsOf } from "@wirecat/cli-core"
import type { Command } from "commander"
import { describe, expect, it } from "vitest"
import { createProgram } from "../whole-program.js"
import { pollClosed, toCliError } from "./errors.js"
import { CHECKS, type Check, type Unanswered, unansweredText } from "./feature.js"
import { answerJoinRequestOf } from "./join-requests.js"
import { resolveProxy } from "./proxy.js"
import { sendAsPeer } from "./send-as.js"

const checkWords = wordsOf<Check>("tg", "personal")

const BEFORE: [Unanswered, string][] = [
  [
    { what: "the poll may have been closed", check: "polls.show", after: "before repeating" },
    "the poll may have been closed; check `tg personal polls show` before repeating",
  ],
  [
    { what: "the topic may have been deleted", check: "topics.list", after: "before repeating" },
    "the topic may have been deleted; check `tg personal topics list` before repeating",
  ],
  [
    { what: "the group may or may not have been made", check: "chats.list" },
    "the group may or may not have been made; check `tg personal chats list`",
  ],
  [
    { what: "you may or may not have joined", check: "chats.list" },
    "you may or may not have joined; check `tg personal chats list`",
  ],
  [
    { what: "you may or may not have left", check: "chats.list" },
    "you may or may not have left; check `tg personal chats list`",
  ],
  [
    { what: "the group may have changed in part", check: "chats.show" },
    "the group may have changed in part; check `tg personal chats show`",
  ],
  [
    { what: "the link may or may not have been replaced", check: "chats.links.show" },
    "the link may or may not have been replaced; check `tg personal chats links show`",
  ],
  [
    { what: "the requests may or may not have been answered", check: "chats.requests.list" },
    "the requests may or may not have been answered; check `tg personal chats requests list`",
  ],
  [
    { what: "the link may or may not have been revoked", check: "chats.links.list" },
    "the link may or may not have been revoked; check `tg personal chats links list`",
  ],
  [
    { what: "the link may or may not have been changed", check: "chats.links.list" },
    "the link may or may not have been changed; check `tg personal chats links list`",
  ],
  [
    { what: "the request of 42 may or may not have been answered", check: "chats.requests.list" },
    "the request of 42 may or may not have been answered; check `tg personal chats requests list`",
  ],
  [
    { what: "the people may or may not have been added", check: "chats.members.list" },
    "the people may or may not have been added; check `tg personal chats members list`",
  ],
  [
    { what: "42 may or may not have been removed", check: "chats.members.list" },
    "42 may or may not have been removed; check `tg personal chats members list`",
  ],
  [
    { what: "the rights may or may not have changed", check: "chats.members.list" },
    "the rights may or may not have changed; check `tg personal chats members list`",
  ],
  [
    {
      what: "the folder may have been made",
      check: "chats.folders.list",
      after: "before repeating — a repeat makes a second one",
    },
    "the folder may have been made; check `tg personal chats folders list` before repeating — a repeat makes a second one",
  ],
  [
    {
      what: "the folder may have been joined",
      check: "chats.folders.list",
      after: "before repeating — a repeat joins nothing new",
    },
    "the folder may have been joined; check `tg personal chats folders list` before repeating — a repeat joins nothing new",
  ],
  [
    { what: "the other devices may or may not have been logged out", check: "account.sessions.list" },
    "the other devices may or may not have been logged out; check `tg personal account sessions list`",
  ],
]

const refusal = (status: number, text: string, login?: string) =>
  (toCliError(new tl.RpcError(status, text), checkWords, login) as Error).message

const thrown = async (work: () => unknown) => {
  try {
    await work()
  } catch (error) {
    return (error as Error).message
  }
  throw new Error("nothing was thrown")
}

const HINTS: [string, Check[], () => string | Promise<string>, string][] = [
  [
    "USER_NOT_MUTUAL_CONTACT",
    ["chats.links.show"],
    () => refusal(400, "USER_NOT_MUTUAL_CONTACT"),
    "Telegram lets you add someone who left or was removed only if you are each other's contacts — " +
      "send them the invite link instead (`tg personal chats links show <chat>`)",
  ],
  [
    "MESSAGE_POLL_CLOSED",
    ["polls.show"],
    () => refusal(400, "MESSAGE_POLL_CLOSED"),
    "this poll is closed; `tg personal polls show` has its result",
  ],
  [
    "a closed poll refused before voting",
    ["polls.show"],
    () => pollClosed(checkWords),
    "this poll is closed; `tg personal polls show` has its result",
  ],
  [
    "OPTION_INVALID",
    ["polls.show"],
    () => refusal(400, "OPTION_INVALID"),
    "that is not an answer of this poll — `tg personal polls show` lists them",
  ],
  [
    "CHAT_PUBLIC_REQUIRED",
    ["chats.links.create"],
    () => refusal(400, "CHAT_PUBLIC_REQUIRED"),
    "Telegram would not make this group ask everyone for approval — make an invite link that needs it: " +
      "`tg personal chats links create <chat> --approval`",
  ],
  [
    "FROZEN_METHOD_INVALID",
    ["doctor"],
    () => refusal(420, "FROZEN_METHOD_INVALID"),
    "Telegram froze this account: it can read but not write — `tg personal doctor --online` shows until when, and where to appeal",
  ],
  [
    "AUTH_KEY_DUPLICATED without a profile's login",
    ["session.start"],
    () => refusal(406, "AUTH_KEY_DUPLICATED"),
    "Telegram ended this login because two connections used it at once (tg serve, tg mcp serve, " +
      "tg watch or a command beside them) — run `tg personal session start`",
  ],
  [
    "a bot history session revoked",
    ["bot.auth.set"],
    () => refusal(401, "AUTH_KEY_UNREGISTERED", checkWords("bot.auth.set")),
    "Telegram ended this login — run `tg personal bot auth set`",
  ],
  [
    "--send-as given something other than an id",
    ["chats.send-as"],
    () => thrown(() => sendAsPeer("-1000000001007", "@channel", "1", checkWords)),
    "--send-as takes an id from `tg personal chats send-as`",
  ],
  [
    "HIDE_REQUESTER_MISSING",
    ["chats.requests.list"],
    () =>
      thrown(() =>
        answerJoinRequestOf(
          {
            hideJoinRequest: async () => {
              throw new tl.RpcError(400, "HIDE_REQUESTER_MISSING")
            },
          } as never,
          -1007,
          42,
          true,
          checkWords,
        ),
      ),
    "they have no request to answer — it was answered already, or withdrawn; see `tg personal chats requests list`",
  ],
  [
    "an MTProxy without its secret",
    ["config.set"],
    () =>
      thrown(() =>
        resolveProxy(
          { profile: "default", configured: { proxy: "tg://proxy?server=mt.example&port=443" }, shared: {} },
          { env: {}, keyring: memoryKeyring(), checks: checkWords },
        ),
      ),
    "no secret is stored for the MTProxy tg://proxy?server=mt.example&port=443 — run `tg personal config set proxy -` again",
  ],
]

describe("check words", () => {
  it.each(BEFORE)("renders %o as the adapter printed it before", (reason, before) => {
    expect(unansweredText(reason, checkWords)).toBe(before)
  })

  it.each(HINTS)("renders %s as it printed before", async (_name, _checks, render, before) => {
    expect(await render()).toBe(before)
  })

  it("covers every command a message names", () => {
    const named = [...BEFORE.map(([reason]) => reason.check), ...HINTS.flatMap(([, checks]) => checks)]
    expect(new Set(named)).toEqual(new Set(CHECKS))
  })

  it("names only commands tg mounts", () => {
    const mounted = (check: Check) =>
      check
        .split(".")
        .reduce<Command | undefined>(
          (at, name) => at?.commands.find((command) => command.name() === name),
          createProgram(),
        )
    expect(CHECKS.filter((check) => !mounted(check))).toEqual([])
  })
})
