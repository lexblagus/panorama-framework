# E2E Test Plan — Robot Package

## Context & Decisions

- **Image comparison**: `pixelmatch` at zero tolerance (solid colors, deterministic)
- **Output files**: `tests/e2e/.output/` (gitignored) — kept on failure for manual inspection, cleaned on success
- **Markdown tests**: copy fixture to temp dir, no uncommitted changes to committed files
- **OpenAI tests**: gated on `OPENAI_API_KEY` env var; transparent image prompt → assert all pixels alpha=0
- **Resume testing**: uses new `workflow.stop` task to intentionally stall a plan mid-execution
- **Integration folder**: remove (unreferenced, empty)
- **Examples**: keep as-is (they serve as runnable documentation)
- **Fixtures**: input PNGs, markdowns, JSONs move to `tests/fixtures/` and are referenced by both examples and tests

---

## Phase 1: Infrastructure

### 1a. workflow.stop
- Add `"workflow.stop"` to `TaskId` union in `src/types/task.ts`
- Add `"workflow.stop"` to Zod enum in `src/types/plan.ts`
- Add `WorkflowStopArgs` (empty `{}`) to `src/services/workflow/types.ts`
- Add `workflow.stop` case to `Step` union in `src/types/step.ts`
- Add dispatch in `src/runner.ts`: throw a sentinel error → task state set to `"error"`
- Resume logic: if the first non-success step is `workflow.stop`, mark it `"success"` and continue

### 1b. Fixtures, gitignore, cleanup
- Move input PNGs from `recipes/examples/images/` → `tests/fixtures/images/`
  - `white.example.png`, `black.example.png`, `blue.example.png`, `red.example.png`, `green.example.png`, `yellow.example.png`
- Update all example recipes that reference these files to use new fixture paths
- Copy markdown fixtures to `tests/fixtures/markdown/` (insert.example.md, write.example.md, read.example.md)
- Copy JSON fixtures to `tests/fixtures/json/` (read.example.json, config.json from json examples)
- Add `tests/e2e/.output/` to root `.gitignore`
- Remove `tests/integration/` folder (unreferenced, only has .gitkeep)

---

## Phase 2: Shell CLI E2E (`tests/e2e/cli.test.ts`)

- Dedicated minimal test recipe: `recipes/examples/test-cli.ts` (empty steps, used only by CLI test)
- Shell out via `child_process.execFile` to `./bin/robot` from robot package dir
- Tests:
  - `build`: assert plan JSON written at `plans/examples/test-cli.json`, exit 0
  - `exec`: assert plan built + executed, exit 0
  - `run`: assert existing plan executes from start, exit 0
  - `resume`: recipe with `workflow.stop` step → `exec` stalls → `resume` completes, exit 0

---

## Phase 3: Programmatic E2E — Images (`tests/e2e/images.test.ts`)

- Run via `buildRecipe(context)` + runner API directly (no CLI)
- Outputs to `tests/e2e/.output/`
- Tests:
  - `create-bridge`: pixelmatch vs `tests/fixtures/images/expected/create-bridge.png` at zero tolerance
  - `compose-tiles`: pixelmatch vs `tests/fixtures/images/expected/compose-tiles.png`
  - `assemble-layers`: pixelmatch vs `tests/fixtures/images/expected/assemble-layers.png` (validates opacity + position)
- Generate expected fixtures by running recipes once and committing output

---

## Phase 4: Programmatic E2E — JSON (`tests/e2e/json.test.ts`)

- Tests:
  - `read`: assert parsed value matches fixture JSON
  - `write`: assert file written with correct content
  - `recipe-state`: assert state initialized and persists across steps
  - `recipe-context-config` + `read-global-config`: assert config loaded correctly from context

---

## Phase 5: Programmatic E2E — Markdown (`tests/e2e/markdown.test.ts`)

- All tests copy fixture file to temp dir before running
- Tests:
  - `read`: assert content returned matches fixture
  - `write`: assert file overwritten with correct content
  - `insert` (after, before, over, between): assert content inserted at correct marker position

---

## Phase 6: Programmatic E2E — Workflow (`tests/e2e/workflow.test.ts`)

- Tests:
  - `run-recipe-empty`: assert nested recipe executed, plan JSON created
  - `run-recipe-all`: assert all nested recipes executed in order

---

## Phase 7: Programmatic E2E — OpenAI (`tests/e2e/openai.test.ts`)

- Gated: `if (!process.env.OPENAI_API_KEY) { skip }`
- Tests:
  - `generate-image` no inputs: assert file exists, valid PNG, all pixels alpha=0 (transparent prompt)
  - `generate-image` with input images: assert file exists, valid PNG, file size > 0

---

## Implementation Order

1a → 1b → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

Each phase is independently releasable/committable.
