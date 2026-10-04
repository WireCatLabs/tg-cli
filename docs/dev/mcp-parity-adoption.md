# Personal MCP parity adoption

Claim: `chore/mcp-parity-sdk`, 2026-10-04. Adopt the published shared personal MCP prerequisite after cli-messaging PR #511. MAX mounts the same canonical schemas on `feat/mcp-parity`; this branch keeps Telegram on the matching SDK and documents strict arguments, photo selection and speech model selection. Isolated synthetic tests only; no live sessions, model downloads or consumer release.

Implementation adopts published cli-messaging 0.144.0, matching MAX’s canonical schemas. Consumer npm publication is separate.
