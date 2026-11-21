### Added

- **`tg personal search conversations` shows what each hit says, and takes `--like`.** Every hit carries `lines`:
  up to three of its messages that share most words with the question, the message right after the one that asks,
  and a later reply to it from another part of the chat. `--like "<a reply that would answer it>"` searches by the
  meaning of a made-up one-sentence answer beside the question, in the same call. On a store of about 954,000
  messages, answers visible in the shown lines went from 19 to 24 of the test questions, both for the question as
  asked and with a made-up reply. On cli-core 0.718.0.

### Fixed

- **A conversation search ranks better and starts faster.** Rare words weigh more than common ones, a big group no
  longer hides its answers behind its own size, and a capitalised word that is not a name no longer narrows the search
  to one chat. The median search went from 5.1 to 2.8 seconds for the question as asked, and from 6.8 to 4.4 seconds
  with a made-up reply.
- **The agent skill searches once, with `--like`, and reads every hit's `lines`**, the owner's own conversations too.
  It searched twice before: with the question, then with the made-up reply.
