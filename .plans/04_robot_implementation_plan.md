# Robot CLI Implementation Plan

This document is the execution plan for implementing the architecture defined in [03_robot_authoritative_architecture.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/03_robot_authoritative_architecture.md).

Companion contract reference:

- [05_robot_task_contracts.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/05_robot_task_contracts.md)

## Index

- [1. Purpose](#1-purpose)
- [2. Current Baseline](#2-current-baseline)
- [3. Target Deliverables](#3-target-deliverables)
- [4. Delivery Principles](#4-delivery-principles)
- [5. Target Repository Additions](#5-target-repository-additions)
- [6. Workstreams](#6-workstreams)
- [7. Phase Plan](#7-phase-plan)
- [8. Testing Plan](#8-testing-plan)
- [9. Migration Notes from the Previous Automation Flow](#9-migration-notes-from-the-previous-automation-flow)
- [10. Risks and Mitigations](#10-risks-and-mitigations)
- [11. Acceptance Criteria](#11-acceptance-criteria)
- [12. Recommended Delivery Order](#12-recommended-delivery-order)

## 1. Purpose

The goal is to move `robot/` from its current single-command scaffold to a mixed recipe-driven and plan-driven CLI with a builder, runner, and exchangeable services.

This plan is intentionally implementation-oriented:

- what to build
- in which order
- which files to create or change
- what each phase must prove before the next one starts

## 2. Current Baseline

Current state in the repository:

- `robot/src/index.ts` only supports `generate`
- `edit` and `upload` are reserved but not implemented
- there is no builder
- there is no runner
- there are no recipe entries or packages
- there are no service modules
- earlier automation behavior survives only as migration guidance in these planning documents

This means the first delivery should prioritize architecture scaffolding and testable seams, not feature completeness.

## 3. Target Deliverables

The first complete milestone should produce:

- subcommands: `build`, `exec`, `run`, `resume`
- recipe-driven `build` and `exec`, plus plan-driven `run` and `resume`
- default plan generation into `robot/plans/<recipe-id>.json`
- runtime state persistence into `robot/transient/<recipe-id>.state.json`
- a Vitest-based test harness under `robot/tests/`
- services: `json`, `markdown`, `image`, `openai`, `workflow`
- recipe entries for `minimal`, `smoke-test`, and `generate-panorama`
- initial automated tests around the critical contracts

Reserved follow-on milestone:

- add `assembly-tiles` if tile assembly is extracted into its own recipe after `generate-panorama` is stable

## 4. Delivery Principles

- Build the type system and file layout before implementing external side effects.
- Prefer working end-to-end slices over isolated stubs that never integrate.
- Keep OpenAI and filesystem effects behind narrow service boundaries.
- Ensure every phase ends with executable validation, not only file creation.
- Use the smoke test as the first full-system proof, not `generate-panorama`.

## 5. Target Repository Additions

The authoritative full repository tree lives in [03_robot_authoritative_architecture.md](./03_robot_authoritative_architecture.md#6-repository-shape). This section intentionally keeps only an implementation touch map so the full tree has one source of truth.

Planned additions and changes touched by this implementation plan:

```text
robot/
├─ config.json
├─ vitest.config.ts
├─ plans/
├─ transient/
├─ tests/
│  ├─ fixtures/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ src/
│  ├─ builder.ts
│  ├─ runner.ts
│  ├─ index.ts
│  ├─ types/
│  ├─ services/
│  │  ├─ json/
│  │  ├─ markdown/
│  │  ├─ image/
│  │  ├─ openai/
│  │  └─ workflow/
│  └─ recipes/
│     ├─ minimal/
│     ├─ smoke-test/
│     └─ generate-panorama/
├─ README.md
└─ .gitignore
```

Supporting repo changes:

- `robot/.gitignore` entries for `plans/*.json` and `transient/*.json`
- `robot/.gitignore` entries for `tests/.tmp/`
- `robot/package.json` scripts and dev dependencies for testing
- `robot/README.md` update for the new CLI model

## 6. Workstreams

Implementation should be organized into these workstreams:

1. CLI and type foundations
2. JSON and filesystem state persistence
3. Markdown read and write capabilities
4. Image and OpenAI services
5. Builder and runner orchestration
6. Recipe migration and composition
7. Testing, docs, and hardening

These workstreams should land as phased slices, not as disconnected branches of unfinished code.

## 7. Phase Plan

### Phase 1. Replace the CLI Scaffold and Test Harness

Goal:

- convert `robot/src/index.ts` from a one-off `generate` parser into a subcommand entrypoint
- establish the automated test harness before service work starts

Files:

- edit `robot/src/index.ts`
- edit `robot/package.json`
- add `robot/vitest.config.ts`
- add `robot/tests/unit/`
- add `robot/tests/integration/`
- add `robot/tests/e2e/`
- add `robot/src/types/recipe.ts`
- add `robot/src/types/step.ts`
- add `robot/src/types/task.ts`
- add `robot/src/types/plan.ts`
- add `robot/src/types/builder.ts`
- add `robot/src/types/runner.ts`

Tasks:

- add Vitest and `npm test` support
- define the shared model types
- parse `build --recipe <recipe-id>`
- parse `exec --recipe <recipe-id>`
- parse `run --plan <plan-id>`
- parse `resume --plan <plan-id>`
- reject `--plan` for `build` and `exec`
- reject `--recipe` for `run` and `resume`
- normalize monorepo-root and `robot/` package-root path handling
- validate derived recipe ids and plan ids against `^[a-z0-9_-][a-z0-9_.-]*$`
- route into builder or runner entrypoints

Suggested bootstrap shape:

```ts
switch (command) {
  case "build":
    await buildCommand(args);
    break;
  case "exec":
    await execCommand(args);
    break;
  case "run":
    await runCommand(args);
    break;
  case "resume":
    await resumeCommand(args);
    break;
  default:
    failUsage();
}
```

Exit criteria:

- `npm test` runs the empty or initial suite successfully
- CLI accepts the target subcommands
- `build` and `exec` require `--recipe` and reject `--plan`
- `run` and `resume` require `--plan` and reject `--recipe`
- invalid arguments fail cleanly
- types compile even before service implementation is complete

### Phase 2. Introduce the JSON Service and Runtime Directories

Goal:

- make plan and state persistence explicit before any high-level recipe logic depends on it

Files:

- add `robot/src/services/json/README.md`
- add `robot/src/services/json/index.ts`
- add `robot/src/services/json/types.ts`
- add `robot/src/services/json/json.ts`
- add `robot/config.json`
- update `robot/.gitignore`

Tasks:

- resolve repository root and `robot/` package root
- ensure `robot/plans/` exists on demand
- ensure `robot/transient/` exists on demand
- read and write JSON with stable formatting
- read `robot/transient/<recipe-id>.state.json`
- initialize missing state from recipe config fallback values

Recommended capabilities:

- `read(path)`
- `write(path, value)`
- `readGlobalConfig()`
- `readRecipeState(recipeId)`
- `writeRecipeState(recipeId, value)`
- `readPlan(planId)`
- `writePlan(planId, plan)`

Exit criteria:

- plan and state files can be created and reloaded
- `fileIndex` fallback behavior is proven in a test

### Phase 3. Implement the Markdown Service

Goal:

- provide deterministic whole-file markdown reads and marker-based inserts before recipe logic depends on prompt loading or preview updates

Files:

- add `robot/src/services/markdown/README.md`
- add `robot/src/services/markdown/index.ts`
- add `robot/src/services/markdown/types.ts`
- add `robot/src/services/markdown/markdown.ts`

Tasks:

- implement full-file reads
- implement marker-based insert operations
- fail clearly with `insert marker not found` when the marker is missing
- preserve source text outside the insertion point exactly

Suggested first API:

```ts
await markdown.read("framework/prompts/tile-01.md");

await markdown.insert({
  file: "images/PREVIEW.md",
  marker: "robot:preview-table-first-row",
  content: nextRow,
  position: "before",
});
```

Exit criteria:

- markdown reads return exact file contents
- markdown writes only affect the intended marker region
- missing markers fail with a clear error message

### Phase 4. Implement OpenAI and Image Services

Goal:

- isolate external effects and image composition behind service boundaries

Files:

- add `robot/src/services/openai/README.md`
- add `robot/src/services/openai/index.ts`
- add `robot/src/services/openai/types.ts`
- add `robot/src/services/openai/openai.ts`
- add `robot/src/services/openai/config.json`
- add `robot/src/services/image/README.md`
- add `robot/src/services/image/index.ts`
- add `robot/src/services/image/types.ts`
- add `robot/src/services/image/image.ts`

Tasks:

- define OpenAI request/response adapter methods
- implement image-generation save flow
- implement Sharp-based bridge composition
- enforce `maskFile` plus single-input validation in OpenAI image generation
- implement row-only `compose-tiles` image composition
- support OpenAI sidecar metadata output when requested
- set a high OpenAI generation timeout default (`>= 180000ms`)
- make both services injectable and mockable

Recommended approach:

- start with method contracts and fake adapters in tests
- add live OpenAI wiring only after runner dispatch is stable

Exit criteria:

- image service produces deterministic bridge output from fixture inputs
- image service composes row-only preview strips from ordered fixture inputs
- OpenAI service can be mocked without touching runner logic
- OpenAI `generate-image` enforces strict size enum and mask-input constraints

### Phase 5. Build the Builder

Goal:

- compile recipe source into a canonical plan without executing runtime-only effects

Files:

- add `robot/src/builder.ts`
- add `robot/src/types/builder.ts`
- add recipe discovery utilities if needed

Tasks:

- load a recipe by id
- derive the canonical recipe id from the flat recipe filename or the folderized recipe package name
- derive the default output plan stem from the recipe id
- load optional `config.json` from the recipe folderized package when present
- resolve builder-time markdown and JSON reads
- emit concrete task list
- write `robot/plans/<recipe-id>.json`
- reserve file-index ranges and persist updated `robot/transient` state

Recommended builder responsibilities:

- recipe loading
- validation
- deterministic argument resolution
- recipe id derivation
- default plan stem derivation
- plan serialization
- rewriting the default plan file for `exec` before execution

Not builder responsibilities:

- calling OpenAI generation
- editing output markdown files
- composing images

Exit criteria:

- the same recipe plus same inputs produce the same task arguments
- the emitted plan is valid and runnable

### Phase 6. Build the Runner and Workflow Service

Goal:

- execute plans through a dispatch table with resumable state updates

Files:

- add `robot/src/runner.ts`
- add `robot/src/types/runner.ts`
- add `robot/src/services/workflow/README.md`
- add `robot/src/services/workflow/index.ts`
- add `robot/src/services/workflow/types.ts`
- add `robot/src/services/workflow/workflow.ts`

Tasks:

- load plan from disk by plan id
- instantiate service registry
- dispatch `taskId` to the correct service
- reset task state for `run`
- update task state and timestamps
- persist the plan after each execution boundary
- accept the freshly built default plan from `exec`
- require explicit `planId` input for `resume`
- fail clearly when `robot/plans/<plan-id>.json` is missing for `resume`
- preserve task state for `resume`, but if no persisted task state exists, behave like `run`
- implement `workflow.run-recipe` as the reusable nested recipe capability

Recommended dispatch shape:

```ts
for (const task of plan.tasks) {
  if (task.state === "success") continue;
  await runTask(task, context);
  await json.writePlan(planId, plan);
}
```

Exit criteria:

- `resume` skips completed tasks
- nested recipe execution works through `workflow.run-recipe`

### Phase 7. Implement Recipes

Goal:

- land recipes in increasing complexity order

#### 7.1 Minimal

Files:

- add `robot/src/recipes/minimal/README.md`
- add `robot/src/recipes/minimal/config.json`
- add `robot/src/recipes/minimal/index.ts`
- add `robot/src/recipes/minimal/minimal.ts`

Purpose:

- smallest end-to-end recipe
- development debugging aid
- prove transient recipe state wiring without touching `images/`

Suggested behavior:

- seed `currentRun` and `maxRuns` from recipe config
- increment `currentRun` through recipe transient state on each build or exec
- emit a single `json.write` task that records the current run into `robot/tests/.tmp/minimal/`
- stop emitting tasks once `currentRun` reaches `maxRuns`

#### 7.2 Smoke Test

Files:

- add `robot/src/recipes/smoke-test/README.md`
- add `robot/src/recipes/smoke-test/config.json`
- add `robot/src/recipes/smoke-test/index.ts`
- add `robot/src/recipes/smoke-test/smoke-test.ts`

Purpose:

- first authoritative end-to-end validation recipe
- exercise every service at least once with sandboxed fixtures
- invoke `minimal` through `workflow.run-recipe`

#### 7.3 Generate Panorama

Files:

- add `robot/src/recipes/generate-panorama/README.md`
- add `robot/src/recipes/generate-panorama/config.json`
- add `robot/src/recipes/generate-panorama/index.ts`
- add `robot/src/recipes/generate-panorama/generate-panorama.ts`

Purpose:

- production recipe based on the existing panorama generation flow
- consume prompt files under `framework/prompts/`
- generate image tasks
- compose bridge-image tasks
- optionally update preview markdown through explicit markers
- stay intentionally partial until earlier phases and the smoke test are stable

Exit criteria:

- minimal recipe runs locally
- smoke test passes automatically
- generate-panorama can build a realistic plan from real repo data

### Phase 8. Documentation and Hardening

Goal:

- align user-facing docs with the implemented contract

Files:

- edit `robot/README.md`
- optionally add recipe README examples

Tasks:

- document environment variables
- document plan and transient paths
- document smoke-test usage
- document generate-panorama setup assumptions
- capture known limitations

Exit criteria:

- README matches the live CLI
- a new developer can run the smoke test from the docs alone

## 8. Testing Plan

### 8.1 Test Stack

Use `vitest` rather than Jest.

Reasons:

- better fit for modern ESM TypeScript
- lighter setup for a small CLI package
- fast unit and integration feedback during phased implementation

### 8.2 Test Layout

Use this layout under `robot/tests/`:

- `fixtures/` for tracked sample JSON, markdown, and image inputs
- `unit/` for small service and helper tests
- `integration/` for builder, runner, and service collaboration tests
- `e2e/` for CLI-level command tests
- `.tmp/` for ignored runtime artifacts created during tests

Test rules:

- tests must not write into `framework/` or `images/`
- image tests use dummy fixtures under `robot/tests/fixtures/images/`
- markdown tests use fixture files or dedicated temporary copies under `robot/tests/.tmp/`
- CLI and smoke-test e2e setup may copy tracked fixture files into `robot/tests/.tmp/` before execution

### 8.3 Minimum Automated Matrix

- CLI parsing and argument exclusivity
- runtime validation of `recipeId` and `planId`
- type-safe task and plan serialization
- `JsonService.read` against tracked JSON fixtures and the eventual `smoke-test` config
- `readRecipeState` and `writeRecipeState` round-trips
- markdown full-file reads
- markdown insert behavior at `robot:preview-table-first-row`
- markdown missing-marker failure with `insert marker not found`
- image bridge composition with fixture images
- builder determinism
- runner resume behavior
- workflow nested recipe execution
- smoke-test end-to-end with a mock OpenAI adapter

`generate-panorama` should initially be validated with plan-generation tests and a limited integration pass before attempting full production runs.

### 8.4 Phase-Oriented Test Checklist

Phase 2 (`json` service):

- test each JSON capability directly: `read`, `write`, `readGlobalConfig`, `readPlan`, `writePlan`, `readRecipeState`, `writeRecipeState`
- verify missing-file behavior and initialization fallback from recipe config
- verify path resolution to `robot/plans/` and `robot/transient/`

Phase 3 (`markdown` service):

- test full-file `read` and marker `insert` as separate capabilities
- verify `insert marker not found` failure behavior
- verify writes do not mutate text outside the insertion target

Phase 4 (`openai` and `image` services):

- use a stubbed or mocked OpenAI adapter for routine unit, integration, and e2e tests
- keep live OpenAI calls out of default CI; run them only in an explicit opt-in lane
- use dummy fixture images under `robot/tests/fixtures/images` for all image service tests
- write generated image artifacts only under `robot/tests/.tmp/`
- verify OpenAI size validation by model (`gpt-image-2` dynamic constrained sizes, legacy fixed sizes)
- verify default OpenAI generation values (`model`, `size`, `quality`, `n`, `outputFormat`)
- verify `maskFile` requires exactly one input image
- verify optional sidecar metadata file naming and content when enabled
- verify row-only `compose-tiles` output order and dimensions

Phase 5 (`builder`):

- verify recipe discovery for both flat and folderized recipe entries
- verify deterministic plan output for identical inputs and state
- verify runtime id validation failures for invalid `recipeId` and `planId`
- verify fallback order for transient state versus recipe config seeds
- verify expected task list shape and argument normalization for `minimal` and `smoke-test`
- verify `build` rewrites `robot/plans/<recipe-id>.json` predictably

Phase 6 (`runner` and `workflow`):

- verify dispatch by `taskId` routes to the correct service handler
- verify per-task state transitions and timestamp updates
- verify persisted plan updates after each task boundary
- verify `run` resets task runtime fields before execution
- verify `resume` skips `success` tasks and restarts on first non-success task
- verify `resume` behaves like `run` when persisted runtime state is absent
- verify `workflow.run-recipe` nested execution with a controlled fixture recipe
- verify clear failure when `run` or `resume` targets a missing plan file

Phase 7 (`recipes`):

- verify `minimal` updates transient `currentRun` and stops emitting tasks at `maxRuns`
- verify `smoke-test` calls each service at least once with fixture-backed inputs
- verify `smoke-test` writes only into `robot/tests/.tmp/` and never touches `framework/` or `images/`
- verify nested `workflow.run-recipe` from `smoke-test` into `minimal`
- verify `generate-panorama` plan-build tests cover prompt file resolution and `fileIndex` reservation logic
- keep `generate-panorama` execution tests limited to small integration scenarios until production behavior is stabilized

### 8.5 E2E Contract

E2E tests execute the real CLI commands in isolated temporary directories under `robot/tests/.tmp/e2e/`.

Core command coverage:

- `robot build --recipe <recipe-id>`
- `robot exec --recipe <recipe-id>`
- `robot run --plan <plan-id>`
- `robot resume --plan <plan-id>`

E2E assertions:

- expected plan file is created at `robot/plans/<plan-id>.json`
- expected transient file is created or updated at `robot/transient/<recipe-id>.state.json`
- task state transitions are persisted correctly (`waiting` -> `running` -> `success` or `error`)
- `resume` skips already successful tasks
- smoke-test e2e touches each service at least once with fixture-backed inputs
- no e2e test writes to `framework/` or `images/`

## 9. Migration Notes from the Previous Automation Flow

Useful previous behavior to preserve conceptually:

- prompt loading rules
- naming conventions
- image numbering flow
- output destination conventions
- preview update behavior

Useful previous behavior to replace:

- browser-driven automation
- implicit state stored only in ad hoc files
- tightly coupled flow without clear service boundaries

## 10. Risks and Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Builder does too much | difficult to test and reason about | keep execution-only effects in services called by the runner |
| Recipe config mutates during runs | noisy diffs and merge conflicts | persist live state in `robot/transient/` |
| Markdown edits drift | prompt and preview files are sensitive | plain-file reads, marker-tested writes, and explicit missing-marker errors |
| Nested recipes create hidden coupling | hard to debug failures | isolate them behind `workflow.run-recipe` |
| OpenAI integration blocks progress | external API work slows architecture | use mock-first service contracts and land smoke test before production integration |

## 11. Acceptance Criteria

This implementation milestone is complete when:

- `robot build --recipe smoke-test` emits a valid plan
- `robot exec --recipe smoke-test` executes through the runner
- `robot run --plan smoke-test` executes the existing plan from the beginning
- `robot resume --plan <plan-id>` skips successful tasks
- `robot exec --recipe smoke-test` rewrites `robot/plans/smoke-test.json` before execution
- `robot/transient/<recipe-id>.state.json` is created and reused
- markdown writes occur only inside explicit markers
- `npm test` passes without touching `framework/` or `images/`
- smoke test is automated
- generate-panorama can build a plan from real repository inputs

## 12. Recommended Delivery Order

If implemented incrementally, the most efficient order is:

1. CLI and test harness
2. JSON service
3. Markdown service
4. Builder
5. Runner
6. Workflow service
7. Minimal recipe
8. Image service
9. OpenAI service
10. Smoke-test recipe
11. Generate-panorama recipe
12. README and hardening

This order keeps the critical path moving while delaying the most external dependencies until the orchestration model is already stable.
