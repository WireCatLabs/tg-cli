import type { AdminRight } from "@wirecat/cli-core"

export const GROUP_SETTINGS = ["allCanPin", "onlyAdminsAdd", "joinApproval"] as const

/**
 * max's admin rights in Telegram's words. Telegram has no right to read: an admin always reads, so
 * `read` is not offered.
 */
export const ADMIN_RIGHT_FIELDS = {
  members: "banUsers",
  admins: "addAdmins",
  info: "changeInfo",
  pin: "pinMessages",
  link: "inviteUsers",
  post: "postMessages",
  edit: "editMessages",
  delete: "deleteMessages",
} as const

/** The rights `chats admins add --can` offers: max's, less `read`. */
export const ADMIN_RIGHTS = Object.keys(ADMIN_RIGHT_FIELDS) as AdminRight[]
