### Fixed

- **The skill leads a question in the owner's own words to meaning search first** (#884): `search conversations`,
  then `search messages --discover`, then key words; the question as written, no filtering of the results by hand,
  `from:me` for "I advised", and `--timeout` after `query.time-limit`. In Experiment B an agent with the old skill ran
  71 searches by words and one by meaning.
- **`search conversations` takes the longer limit of an explicit `--timeout`**, and **`search messages --discover`
  finds a name written as one word when the question spells it with a hyphen** (`Альфа-банк` finds `АльфаБанк`)
  (cli-core 0.664.0 and 0.665.0, already in this build).
