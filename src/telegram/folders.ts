import { getMarkedPeerId, tl } from "@mtcute/node"
import { CliError } from "@wirecat/cli-base"
import type { Folder, FolderChange, FolderRules } from "@wirecat/cli-core"
import type { Feature } from "./feature.js"
import { ruleFlags } from "./folder-rules.js"
import { toFolder } from "./map.js"

const filtersOf = async ({ client }: Feature): Promise<tl.TypeDialogFilter[]> => (await client.getFolders()).filters

/**
 * mtcute answers with the folder it sent, but Telegram drops what it does not take — an emoji that is not
 * one of its folder icons, measured live 2026-10-08 — so the answer is read back.
 */
const storedFolder = async (feature: Feature, sent: tl.TypeDialogFilter): Promise<Folder> => {
  const stored =
    sent._ === "dialogFilterDefault"
      ? undefined
      : (await filtersOf(feature)).find((one) => one._ !== "dialogFilterDefault" && one.id === sent.id)
  return toFolder(stored ?? sent) as Folder
}

export const folders = (feature: Feature): Promise<Folder[]> =>
  feature.call(async () => (await filtersOf(feature)).map(toFolder).filter((one): one is Folder => one !== null))

export const createFolder = (feature: Feature, title: string, chatIds: string[], rules: FolderRules = {}) =>
  feature.write(
    {
      what: "the folder may have been made",
      check: "chats.folders.list",
      after: "before repeating — a repeat makes a second one",
    },
    async () => {
      const peers = (ids: string[] = []) => Promise.all(ids.map((id) => feature.client.resolvePeer(Number(id))))
      const pinned = new Set(rules.pin)
      const made = await feature.client.createFolder({
        title: { _: "textWithEntities", text: title, entities: [] },
        includePeers: await peers(chatIds.filter((id) => !pinned.has(id))),
        pinnedPeers: await peers(rules.pin),
        excludePeers: await peers(rules.exclude),
        ...(rules.emoji === undefined ? {} : { emoticon: rules.emoji }),
        ...ruleFlags(rules),
      })
      return storedFolder(feature, made)
    },
  )

/** Telegram replaces a folder's chats as a list, so the ones it has are read and only the asked ones change. */
export const updateFolder = (feature: Feature, folderId: string, change: FolderChange): Promise<Folder> => {
  const { title, add = [], remove = [], exclude = [], pin = [], emoji, include, skip } = change
  return feature.write("the folder may have changed — repeating it is safe", async () => {
    const current = (await filtersOf(feature)).find(
      (one) => one._ !== "dialogFilterDefault" && String(one.id) === folderId,
    )
    if (!current || current._ === "dialogFilterDefault") throw new CliError("not_found", `no folder ${folderId}`)
    const rulesAsked = include !== undefined || skip !== undefined || exclude.length > 0
    if (rulesAsked && current._ === "dialogFilterChatlist")
      throw new CliError("validation_error", "a folder shared by a link holds only its chats; it takes no rules")
    // A chat sits on one list at a time: pinning or excluding it takes it off the others.
    const idOf = (peer: tl.TypeInputPeer) => String(getMarkedPeerId(peer))
    const off = (peers: tl.TypeInputPeer[], ...ids: string[][]) => {
      const gone = new Set(ids.flat())
      return peers.filter((peer) => !gone.has(idOf(peer)))
    }
    const resolved = (ids: string[], have: tl.TypeInputPeer[]) => {
      const held = new Set(have.map(idOf))
      return Promise.all(ids.filter((id) => !held.has(id)).map((id) => feature.client.resolvePeer(Number(id))))
    }
    const include0 = off(current.includePeers, remove, pin, exclude)
    const pinned0 = off(current.pinnedPeers, remove, exclude)
    const listsChanged = add.length > 0 || remove.length > 0 || pin.length > 0 || exclude.length > 0
    const excluded0 = current._ === "dialogFilter" ? off(current.excludePeers, remove, add, pin) : []
    const changed = await feature.client.editFolder({
      folder: current._ === "dialogFilter" ? current : current.id,
      modification: {
        ...(title === undefined ? {} : { title: { _: "textWithEntities", text: title, entities: [] } }),
        ...(emoji === undefined ? {} : { emoticon: emoji }),
        ...ruleFlags({ ...(include === undefined ? {} : { include }), ...(skip === undefined ? {} : { skip }) }),
        ...(listsChanged
          ? {
              includePeers: [...include0, ...(await resolved(add, [...include0, ...pinned0]))],
              pinnedPeers: [...pinned0, ...(await resolved(pin, pinned0))],
              ...(current._ === "dialogFilter"
                ? { excludePeers: [...excluded0, ...(await resolved(exclude, excluded0))] }
                : {}),
            }
          : {}),
      },
    })
    return storedFolder(feature, changed)
  })
}

export const deleteFolder = (feature: Feature, folderId: string): Promise<void> =>
  feature.write("the folder may have been deleted — repeating it is safe", async () => {
    await feature.client.deleteFolder(Number(folderId))
  })

/** "All chats" (id 0) keeps its place: only Premium accounts may move it, and tg does not list it. */
export const orderFolders = (feature: Feature, folderIds: string[]): Promise<void> =>
  feature.write("the folders may be in the new order already — repeating it is safe", async () => {
    const current = (await filtersOf(feature)).map((one) => (one._ === "dialogFilterDefault" ? 0 : one.id))
    const order = folderIds.map(Number)
    const all = current.indexOf(0)
    if (all >= 0) order.splice(all, 0, 0)
    await feature.client.setFoldersOrder(order)
  })

export const joinFolder = (feature: Feature, link: string): Promise<Folder> =>
  feature.write(
    {
      what: "the folder may have been joined",
      check: "chats.folders.list",
      after: "before repeating — a repeat joins nothing new",
    },
    async () => {
      try {
        return toFolder(await feature.client.joinChatlist(link)) as Folder
      } catch (error) {
        if (tl.RpcError.is(error, "INVITE_SLUG_EXPIRED") || tl.RpcError.is(error, "INVITE_SLUG_INVALID"))
          throw new CliError("not_found", "this folder link is invalid or has expired")
        throw error
      }
    },
  )
