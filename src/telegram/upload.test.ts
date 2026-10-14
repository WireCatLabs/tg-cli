import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { MtTimeoutError, tl } from "@mtcute/node"
import { describe, expect, it, vi } from "vitest"
import { toUploadParams } from "./map.js"
import { UPLOAD_ATTEMPTS, uploadAttachment } from "./upload.js"

const bytes = new Uint8Array([1, 2, 3])
const photo = { kind: "photo" as const, name: "cat.png", source: { kind: "bytes" as const, bytes } }
const uploaded = { inputFile: { _: "inputFile" }, size: 3, mime: "image/png" }

describe("uploading an attachment", () => {
  it("tries a dropped upload again, waiting longer each time", async () => {
    const uploadFile = vi
      .fn()
      .mockRejectedValueOnce(new MtTimeoutError(1000))
      .mockRejectedValueOnce(Object.assign(new Error("closed"), { code: "ECONNRESET" }))
      .mockResolvedValueOnce(uploaded)
    const wait = vi.fn(async () => {})

    expect(await uploadAttachment({ uploadFile } as never, photo, wait)).toBe(uploaded)
    expect(wait.mock.calls).toEqual([[1000], [2000]])
  })

  it("reads a file from disk as it uploads, opening it again for each try", async () => {
    const path = join(mkdtempSync(join(tmpdir(), "tg-upload-")), "plan.pdf")
    writeFileSync(path, "synthetic")
    const uploadFile = vi.fn().mockRejectedValueOnce(new MtTimeoutError(1000)).mockResolvedValueOnce(uploaded)
    const file = { kind: "file" as const, name: "plan.pdf", source: { kind: "file" as const, path, size: 9 } }

    await uploadAttachment({ uploadFile } as never, file, async () => {})

    const [first, second] = uploadFile.mock.calls.map(([params]) => params.file)
    expect(first).toBeInstanceOf(Blob)
    expect(second).not.toBe(first)
    expect(await second.text()).toBe("synthetic")
  })

  it("gives up after the last try, saying nothing was sent rather than that it may have been", async () => {
    const uploadFile = vi.fn().mockRejectedValue(new MtTimeoutError(1000))

    await expect(uploadAttachment({ uploadFile } as never, photo, async () => {})).rejects.toMatchObject({
      code: "timeout",
      message: expect.stringContaining("nothing was sent"),
    })
    expect(uploadFile).toHaveBeenCalledTimes(UPLOAD_ATTEMPTS)
  })

  it("does not repeat a refusal", async () => {
    const uploadFile = vi.fn().mockRejectedValue(new tl.RpcError(400, "FILE_PARTS_INVALID"))
    const wait = vi.fn(async () => {})

    await expect(uploadAttachment({ uploadFile } as never, photo, wait)).rejects.toThrow("FILE_PARTS_INVALID")
    expect(uploadFile).toHaveBeenCalledOnce()
    expect(wait).not.toHaveBeenCalled()
  })

  it("uploads each kind with the type it is sent as", () => {
    expect(toUploadParams(photo)).toEqual({
      fileName: "cat.png",
      requireFileSize: true,
      requireExtension: true,
    })
    expect(
      toUploadParams({ kind: "voice", name: "note.ogg", source: { kind: "bytes" as const, bytes } }),
    ).toMatchObject({ fileMime: "audio/ogg" })
    expect(toUploadParams({ kind: "file", name: "trip.mp4", source: { kind: "bytes" as const, bytes } })).toMatchObject(
      { fileMime: "video/mp4" },
    )
    expect(
      toUploadParams({ kind: "file", name: "trip.mp4", source: { kind: "bytes" as const, bytes }, asFile: true }),
    ).not.toHaveProperty("fileMime")
    expect(
      toUploadParams({ kind: "file", name: "plan.pdf", source: { kind: "bytes" as const, bytes } }),
    ).not.toHaveProperty("fileMime")
  })
})
