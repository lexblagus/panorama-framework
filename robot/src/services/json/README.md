# JSON Service

`JsonService` centralizes JSON file IO for:

- generic JSON reads and writes
- `robot/config.json`
- plan files in `robot/plans/`
- transient recipe state in `robot/transient/`

Notes:

- `write`/`writeJson` default to `formatted` output with 2-tab indentation.
- Pass `{ format: "compact" }` for compact one-line JSON output.
- `readRecipeState` returns `null` if the state file does not exist.
- `initializeRecipeState` writes fallback seed values only when no state file exists.

