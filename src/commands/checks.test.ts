import { describe, expect, it } from "vitest"
import { CHECKS, type Unanswered, unansweredText } from "../telegram/feature.js"
import { checkWords } from "./checks.js"

const BEFORE: [Unanswered, string][] = [
  [
    { what: "the poll may have been closed", check: "polls.show", after: "before repeating" },
    "the poll may have been closed; check `tg polls show` before repeating",
  ],
  [
    { what: "the topic may have been deleted", check: "topics.list", after: "before repeating" },
    "the topic may have been deleted; check `tg topics list` before repeating",
  ],
  [
    { what: "the group may or may not have been made", check: "chats.list" },
    "the group may or may not have been made; check `tg chats list`",
  ],
  [
    { what: "you may or may not have joined", check: "chats.list" },
    "you may or may not have joined; check `tg chats list`",
  ],
  [
    { what: "you may or may not have left", check: "chats.list" },
    "you may or may not have left; check `tg chats list`",
  ],
  [
    { what: "the group may have changed in part", check: "chats.show" },
    "the group may have changed in part; check `tg chats show`",
  ],
  [
    { what: "the link may or may not have been replaced", check: "chats.link.show" },
    "the link may or may not have been replaced; check `tg chats link show`",
  ],
  [
    { what: "the requests may or may not have been answered", check: "chats.requests.list" },
    "the requests may or may not have been answered; check `tg chats requests list`",
  ],
  [
    { what: "the link may or may not have been revoked", check: "chats.link.list" },
    "the link may or may not have been revoked; check `tg chats link list`",
  ],
  [
    { what: "the link may or may not have been changed", check: "chats.link.list" },
    "the link may or may not have been changed; check `tg chats link list`",
  ],
  [
    { what: "the request of 42 may or may not have been answered", check: "chats.requests.list" },
    "the request of 42 may or may not have been answered; check `tg chats requests list`",
  ],
  [
    { what: "the people may or may not have been added", check: "chats.members.list" },
    "the people may or may not have been added; check `tg chats members list`",
  ],
  [
    { what: "42 may or may not have been removed", check: "chats.members.list" },
    "42 may or may not have been removed; check `tg chats members list`",
  ],
  [
    { what: "the rights may or may not have changed", check: "chats.members.list" },
    "the rights may or may not have changed; check `tg chats members list`",
  ],
  [
    {
      what: "the folder may have been made",
      check: "chats.folders.list",
      after: "before repeating — a repeat makes a second one",
    },
    "the folder may have been made; check `tg chats folders list` before repeating — a repeat makes a second one",
  ],
  [
    {
      what: "the folder may have been joined",
      check: "chats.folders.list",
      after: "before repeating — a repeat joins nothing new",
    },
    "the folder may have been joined; check `tg chats folders list` before repeating — a repeat joins nothing new",
  ],
  [
    { what: "the other devices may or may not have been logged out", check: "account.sessions.list" },
    "the other devices may or may not have been logged out; check `tg account sessions list`",
  ],
]

describe("check words", () => {
  it.each(BEFORE)("renders %o as the adapter printed it before", (reason, before) => {
    expect(unansweredText(reason, checkWords)).toBe(before)
  })

  it("covers every reason the adapter gives", () => {
    expect(new Set(BEFORE.map(([reason]) => reason.check))).toEqual(new Set(CHECKS))
  })
})
