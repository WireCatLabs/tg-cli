# Every adapter method runs through #call / #write

- Public `TelegramAdapter` methods wrap their work in `this.#call(...)`, which races `#proxyFailed` and maps errors once with `toCliError(error, this.#login)`.
- Validate ids before `#call` (`messageNumber`, `topicNumber`, `parseSendId`), so a bad id fails without a request.
- When an RPC name is an answer, not a failure, catch it locally with `tl.RpcError.is(error, "NAME")` and return a value (`null`, `{ already: true }`); rethrow everything else unchanged.
- To answer `null` on a permission refusal: map first, then check `known.code === "permission_error"`.

**Why:** Mapping happens once, at the boundary where the login and the proxy race are known.

**Open:** Should helper modules (`comments.ts`, `send-as.ts`) always rethrow raw errors and leave mapping to `#call`?

See: `src/telegram/adapter.ts:1964-1980` · `src/telegram/join-requests.ts:462` · `src/telegram/adapter.ts:1409-1412`
