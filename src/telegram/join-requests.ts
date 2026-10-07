import { CliError } from "@leemour/cli-core"
import type { JoinRequest, Page } from "@leemour/cli-messaging"
import { type TelegramClient, tl } from "@mtcute/node"
import { toMember } from "./map.js"

type Client = Pick<TelegramClient, "getInviteLinkMembers" | "hideJoinRequest">

/** Newest first, as Telegram lists them; `total` counts every pending request, not just this page. */
export const joinRequestsOf = async (
  client: Client,
  chatId: number,
  limit: number,
  { link, search }: { link?: string; search?: string } = {},
): Promise<Page<JoinRequest> & { total: number }> => {
  const page = await client.getInviteLinkMembers(chatId, {
    requested: true,
    limit,
    ...(link ? { link } : {}),
    ...(search ? { requestedSearch: search } : {}),
  })
  return {
    items: page.map((one) => ({
      person: toMember(one.user),
      requestedAt: one.date.toISOString(),
      ...(one.bio ? { about: one.bio } : {}),
    })),
    hasMore: page.total > page.length,
    total: page.total,
  }
}

export const answerJoinRequestOf = async (
  client: Client,
  chatId: number,
  personId: number,
  accept: boolean,
): Promise<{ already: boolean }> => {
  try {
    await client.hideJoinRequest({ chatId, user: personId, action: accept ? "approve" : "decline" })
    return { already: false }
  } catch (error) {
    if (tl.RpcError.is(error, "USER_ALREADY_PARTICIPANT")) return { already: true }
    if (tl.RpcError.is(error, "HIDE_REQUESTER_MISSING"))
      throw new CliError(
        "not_found",
        "they have no request to answer — it was answered already, or withdrawn; see `tg chats requests list`",
      )
    throw error
  }
}
