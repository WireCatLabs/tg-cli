# Coordinated MAX and Telegram release

**Historical preparation, 2026-10-04.** The versions and draft instructions below describe that batch.
For the current release snapshot and remaining work, use [HANDOFF.md](../../HANDOFF.md) and the
[roadmap](../roadmap.md).

Claim: `release/coordinated-026`, 2026-10-04. The owner requested Telegram in the same release batch as MAX, with current shared dependencies and aligned documentation.

Telegram currently pins published cli-core 0.17.0 and cli-messaging 0.139.0. The published Telegram 0.25.0 used messaging 0.137.0. Prepare a provisional 0.26.0 version/changelog PR from current main; include permalink/locator reads, voice connection reuse, transcript-aware unanswered reviews and the unpin permission correction. Review README, user docs and the embedded skill against the source and generated command diff.

One coordinator owns this version bump. Keep the release PR draft until other agents provide their PR/full tested head, CI, dependency releases and changelog effects. Do not reuse evidence after changing the combined SHA. Check lint, types, tests, release checks, docs, parity and platform CI. Account operations and publication follow the final batch review; this preparation does not run live operations.

The shared coordination handoff is `docs_ai/plans/2026-10-04-coordinated-release.md` in the owner's MAX checkout (private). Other agents should provide component readiness there and avoid duplicate version bumps.
