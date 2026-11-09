### Fixed

- **`tg serve` exits when the build it runs is out of date, so its service starts the new one.** Every minute it
  checks whether the shared store moved to a format this build can no longer write, or whether a newer tg is
  installed. If so it logs `serve.outdated` and exits with code 3, and the systemd unit (`Restart=on-failure`)
  starts the installed version. Before, a serve could run for a day on the old build and store nothing.
- **After `tg store recover run`, the next ordinary sync fetches again what the damage may have taken.** The recovery
  marks what each chat held from a day before the last deep check that passed as not fetched, so a sync no longer
  jumps over a hole inside a chat. From cli-core 0.618.0 (was 0.616.0).
