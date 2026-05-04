# Robot CLI Authoritative Architecture

This document is the authoritative architecture for the `robot/` CLI package in this monorepo.

Companion documents:

- [04_robot_implementation_plan.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/04_robot_implementation_plan.md)
- [05_robot_task_contracts.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/05_robot_task_contracts.md)

## Index

- [1. Scope](#1-scope)
- [2. Goals](#2-goals)
- [3. Non-Goals](#3-non-goals)
- [4. Architectural Principles](#4-architectural-principles)
- [5. Core Terms](#5-core-terms)
- [6. Repository Shape](#6-repository-shape)
- [7. CLI Contract](#7-cli-contract)
- [8. Lifecycle](#8-lifecycle)
- [9. Ownership and Mutability](#9-ownership-and-mutability)
- [10. Recipe Model](#10-recipe-model)
- [11. Step, Task, and Plan Model](#11-step-task-and-plan-model)
- [12. Service Architecture](#12-service-architecture)
- [13. JSON Service](#13-json-service)
- [14. Markdown Service](#14-markdown-service)
- [15. File Naming and File Index](#15-file-naming-and-file-index)
- [16. Plans and Transient State](#16-plans-and-transient-state)
- [17. Failure and Resume Semantics](#17-failure-and-resume-semantics)
- [18. Testing Principles](#18-testing-principles)
- [19. Open Questions](#19-open-questions)
- [20. Summary](#20-summary)

## 1. Scope

`robot/` is a batch CLI that executes structured image-generation workflows for the panorama framework.

Its responsibilities are to:

- load a recipe
- build a deterministic execution plan
- execute that plan step by step
- persist plan progress for resume
- call specialized services for AI, image, markdown, JSON, and workflow operations

A previous browser-automation prototype informed parts of the intended behavior, but the target system replaces that approach with explicit API, filesystem, and document-processing services.

## 2. Goals

- Provide a clear build/run/resume lifecycle.
- Keep recipe source files declarative and stable.
- Isolate mutable runtime state from authored source.
- Make services exchangeable and composable.
- Support nested recipes without hard-coding special cases into every caller.
- Keep markdown writes deterministic and safe.

## 3. Non-Goals

This architecture does not attempt to:

- define every future recipe
- freeze every OpenAI payload field today
- introduce parallel execution
- redesign `framework/` or `images/` content
- require TypeScript config files where JSON is sufficient

## 4. Architectural Principles

- Build and run are separate concerns.
- Authored source and mutable runtime state must not share the same file.
- Config values may be expressed as data, but operational formatting logic belongs in code.
- Services expose stable capability contracts and can be called by the builder, runner, or other services through a shared context.
- Markdown writes use explicit markers; markdown reads are plain file reads.
- JSON is the default config format until a concrete need requires code-backed config.

## 5. Core Terms

| Term | Meaning | Example |
|---|---|---|
| `subcommand` | Top-level CLI action | `build` |
| `build` | Build a recipe into the default plan file without execution | `robot build --recipe smoke-test` |
| `exec` | Build a recipe into the default plan file and then execute it from the beginning | `robot exec --recipe smoke-test` |
| `run` | Execute an existing plan from the beginning, resetting task state | `robot run --plan smoke-test` |
| `resume` | Execute an existing plan using persisted state, or behave like `run` if no state exists | `robot resume --plan smoke-test` |
| `argument` | Named CLI option or executable input | `--recipe smoke-test` |
| `recipe` | User-authored workflow definition | `smoke-test` |
| `recipe id` | Canonical identifier derived from a flat recipe filename or a folderized recipe package name | `smoke-test` |
| `plan id` | Filename stem used to resolve a plan under `robot/plans/` | `smoke-test` |
| `recipe config` | Static JSON owned by one recipe | `src/recipes/smoke-test/config.json` |
| `step` | Ordered authored item inside a recipe | `read preview marker` |
| `task id` | Callable service operation referenced by a step and executed by a task | `markdown.insert` |
| `task` | Executable plan entry with runtime state | `plan.tasks[0]` |
| `service` | Capability module that performs work | `openai`, `image`, `markdown`, `json`, `workflow` |
| `builder` | Compiles recipe source into a concrete plan | `src/builder.ts` |
| `plan` | Generated execution artifact consumed by the runner | `robot/plans/smoke-test.json` |
| `runner` | Executes tasks from a plan | `src/runner.ts` |
| `transient state` | Mutable runtime state outside authored source | `robot/transient/smoke-test.state.json` |

## 6. Repository Shape

Authoritative target shape inside `robot/`:

This is the only authoritative full repository tree in the planning set. Other documents may show shortened implementation touch maps, but they should point back here instead of duplicating this full shape.

```
robot/
├─ README.md
├─ .env
├─ .env.sample
├─ config.json
├─ vitest.config.ts
├─ bin/
│  └─ robot
├─ plans/
│  └─ <plan-id>.json
├─ transient/
│  └─ <recipe-id>.state.json
├─ tests/
│  ├─ fixtures/
│  │  ├─ images/
│  │  └─ markdown/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
└─ src/
   ├─ index.ts
   ├─ builder.ts
   ├─ runner.ts
   ├─ types/
   │  ├─ builder.ts
   │  ├─ plan.ts
   │  ├─ recipe.ts
   │  ├─ runner.ts
   │  ├─ step.ts
   │  └─ task.ts
   ├─ services/
   │  ├─ image/
   │  │  ├─ README.md
   │  │  ├─ index.ts
   │  │  ├─ types.ts
   │  │  ├─ image.ts
   │  │  └─ config.json
   │  ├─ json/
   │  │  ├─ README.md
   │  │  ├─ index.ts
   │  │  ├─ types.ts
   │  │  └─ json.ts
   │  ├─ markdown/
   │  │  ├─ README.md
   │  │  ├─ index.ts
   │  │  ├─ types.ts
   │  │  └─ markdown.ts
   │  ├─ openai/
   │  │  ├─ README.md
   │  │  ├─ index.ts
   │  │  ├─ types.ts
   │  │  ├─ openai.ts
   │  │  └─ config.json
   │  └─ workflow/
   │     ├─ README.md
   │     ├─ index.ts
   │     ├─ types.ts
   │     └─ workflow.ts
   └─ recipes/
      ├─ minimal/
      │  ├─ README.md
      │  ├─ config.json
      │  ├─ index.ts
      │  └─ minimal.ts
      ├─ smoke-test/
      │  ├─ README.md
      │  ├─ index.ts
      │  ├─ smoke-test.ts
      │  └─ config.json
      └─ generate-panorama/
         ├─ README.md
         ├─ index.ts
         ├─ generate-panorama.ts
         └─ config.json
```

Decisions captured in this structure:

- `builder.ts` and `runner.ts` stay directly under `src/`
- builder and runner type contracts live in `src/types/builder.ts` and `src/types/runner.ts`
- services stay grouped under one `services/` folder
- `json`, `markdown`, `image`, `openai`, and `workflow` are folderized so each service can carry its own README and local structure
- folderized services keep exported and shared service types in `types.ts`
- recipe-specific assets live inside recipe folders when a recipe is folderized
- tests live under `robot/tests/`, with tracked fixtures separate from runtime artifacts
- recipes and services may later adopt deeper folder layouts only when one-file modules stop being sufficient

## 7. CLI Contract

Current target CLI:

```bash
robot build --recipe <recipe-id>
robot exec --recipe <recipe-id>
robot run --plan <plan-id>
robot resume --plan <plan-id>
```

Rules:

- `build` and `exec` accept only `--recipe`
- `run` and `resume` accept only `--plan`
- `recipeId` is derived from the flat recipe filename without extension or from the folder name of a folderized recipe package
- `build` resolves recipe source and writes the default plan file `robot/plans/<recipe-id>.json` without execution
- `exec` resolves recipe source, rewrites the default plan file `robot/plans/<recipe-id>.json`, and then executes it from the beginning
- `run` loads `robot/plans/<plan-id>.json`, resets task state, and executes it from the beginning without rebuilding
- `resume` loads `robot/plans/<plan-id>.json`, preserves persisted task state when present, and otherwise behaves like `run`
- CLI `--plan` accepts a `planId` filename stem, not a path
- `recipeId` and `planId` follow the same `^[a-z0-9_-][a-z0-9_.-]*$` pattern
- the runtime validates derived and provided ids before resolving recipe or plan paths
- `resume` may target any existing `robot/plans/<plan-id>.json`, including a manually renamed file
- `run` clears prior per-task runtime fields before execution, while `resume` skips successful tasks when persisted state exists
- the `.json` extension and `robot/plans/` path are internal implementation details

## 8. Lifecycle

1. `bin/robot` invokes `src/index.ts`.
2. `src/index.ts` parses subcommands and paths.
3. For `build` and `exec`, `src/builder.ts` loads the recipe source and optional recipe config.
4. The builder derives the recipe id from the flat recipe filename or the folderized recipe package name and uses it as the default output plan stem.
5. The builder may call deterministic service capabilities, such as markdown or JSON reads, when they are part of plan construction.
6. `build` writes `robot/plans/<recipe-id>.json`.
7. `exec` writes or rewrites `robot/plans/<recipe-id>.json` and then passes that plan into execution from the beginning.
8. For `run`, the command loads the explicit `planId` from CLI input, resolves it to `robot/plans/<plan-id>.json`, resets task state, and executes from the beginning.
9. For `resume`, the command loads the explicit `planId` from CLI input, resolves it to `robot/plans/<plan-id>.json`, and resumes from persisted state when present.
10. `src/runner.ts` creates the service registry and executes plan tasks in order.
11. After each task boundary, the runner persists updated task runtime data back to the plan.
12. Recipe-level mutable counters are persisted in `robot/transient/<recipe-id>.state.json`.

## 9. Ownership and Mutability

| Artifact | Owner | Mutable | Git policy | Purpose |
|---|---|---|---|---|
| `robot/.env` | local developer | yes | ignored | credentials and machine-local secrets |
| `robot/.env.sample` | repository | no | tracked | environment template |
| `robot/config.json` | repository | rarely | tracked | package-wide static defaults not owned by recipes |
| `src/recipes/<id>/config.json` | repository | rarely | tracked | static recipe-owned settings |
| `robot/plans/<plan-id>.json` | builder and runner | yes | ignored by default | generated execution plan and task progress |
| `robot/transient/<recipe-id>.state.json` | JSON service | yes | ignored | persistent recipe runtime state such as file index |

Normal execution rules:

- authored recipe files are not rewritten during ordinary runs
- plan progress is written to the plan file
- long-lived mutable counters are written to `robot/transient/`
- recipe config may provide fallback seed values, but it is not the primary runtime state store
- recipe modules may access recipe-level transient state only through injected service contracts; direct file writes to `robot/transient/` are out of contract

## 10. Recipe Model

A recipe is a user-authored workflow definition composed of ordered steps.

Candidate shape:

```ts
interface Recipe {
  title: string;
  description?: string;
  steps: Step[];
}
```

Recipes may be authored either as a flat single file or as a folderized package. The recommended pattern is folderized:

Flat single-file recipe:

```text
src/recipes/<recipe-id>.ts
```

Folderized recipe package:

```text
src/recipes/<recipe-id>/
|-- README.md
|-- config.json
|-- index.ts
`-- <recipe-id>.ts
```

Notes:

- `README.md` is recommended for recipe-specific behavior, assumptions, and examples
- `config.json` is optional when a recipe has no static sidecar data
- `index.ts` is the public entry point for recipe discovery
- helper modules may be added inside the recipe folder when a recipe is folderized
- for a flat recipe, the canonical `recipe id` is the filename without extension
- for a folderized recipe package, the canonical `recipe id` is the folder name
- if a folderized package has a main recipe file, that main file should match the folder-derived id
- allowed recipe id pattern is `^[a-z0-9_-][a-z0-9_.-]*$`
- the same pattern is used for `plan id`, which means `.` is allowed after the first character but not as the first character
- recipe-driven build and `exec` use `recipe id` as the default output plan stem
- the authored `Recipe` object intentionally omits both `recipeId` and `planId` to avoid duplicate sources of truth
- recipe config is loaded separately from `config.json`
- the shared contracts define only the base JSON config shape; recipe authors may define stricter local config types inside their own recipe modules
- recipe and task file arguments are monorepo-root-relative by default unless a service contract says otherwise

Recipes expected in the first architecture:

- `minimal`: smallest runnable example for development
- `smoke-test`: end-to-end contract exercise for the CLI
- `generate-panorama`: main production recipe

Reserved near-term recipe:

- `assembly-tiles`: optional follow-on recipe if tile assembly is split out from `generate-panorama`

## 11. Step, Task, and Plan Model

Authoring layer:

```ts
interface Step {
  title: string;
  description?: string;
  taskId: string;
  arguments: Record<string, unknown>;
}
```

Execution layer:

```ts
export type TaskState = "waiting" | "running" | "success" | "error";

interface Task {
  taskId: string;
  title: string;
  description?: string;
  arguments: Record<string, unknown>;
  state: TaskState;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
}

interface Plan {
  recipeId: string;
  createdAt: string;
  tasks: Task[];
}
```

Rules:

- step order in the authored `steps` array is the execution order
- `taskId` identifies the callable service task, for example `json.read`
- `taskId` is the dispatch key, not the unique runtime identity
- `planId` is the filename stem used when selecting a plan file under `robot/plans/`
- recipe-driven `build` and `exec` use `recipeId` as the default `planId`
- `run` and `resume` may target any existing `planId` under `robot/plans/`
- each step declares exactly one `taskId` and emits exactly one task
- many steps may reference the same `taskId`
- plan task array order is sufficient runtime identity
- if stable external step references or one-step-to-many-task expansion become necessary, introduce a distinct `stepId` and `taskInstanceId`
- task state is the resumable runtime contract

## 12. Service Architecture

Services are exchangeable capability modules with typed contracts.

They must be callable from:

- the builder, for deterministic read or transformation work needed during plan construction
- the runner, for task execution
- other services, through an injected service context rather than hard-coded import chains

### 12.1 Service Registry

The system should expose a shared service registry or context object so that services can collaborate without directly depending on concrete module paths.

The registry is a runtime dependency container and dispatch table, not a global mutable singleton. It is created once per build or run context and then passed into the builder, runner, or service calls that need it.

Example uses:

- builder calls markdown read logic to load prompt files while constructing a plan
- workflow service calls builder plus runner logic to support nested recipe execution

Illustrative flow:

```ts
const services = createServiceRegistry({ repoRoot, robotRoot });
await services.markdown.read(...);
await dispatchByTaskId(task.taskId, task, services);
```

### 12.2 Service Packaging

Service packaging follows this rule:

- service folders are preferred when a service needs a dedicated README, multiple source files, or service-local config
- the current folderized services are `json`, `markdown`, `image`, `openai`, and `workflow`

Folderized shape:

```text
src/services/<service-name>/
├─ README.md
├─ index.ts
├─ types.ts
├─ <service-name>.ts
└─ config.json
```

### 12.3 Service Set

The first service set is:

- `openai`
- `image`
- `markdown`
- `json`
- `workflow`

`workflow` is preferred over vague names such as `etc` or `auxiliary` because it names the orchestration concern directly.

### 12.4 Nested Recipe Execution

Nested recipe execution is modeled as a workflow capability:

- task id: `workflow.run-recipe`
- primary use: allow one recipe to compose another without forcing special-case logic into every caller

The runner remains the main orchestrator, but `workflow.run-recipe` is the reusable contract that nested flows can target.

## 13. JSON Service

The JSON service owns structured JSON file IO and update logic.

Primary responsibilities:

- read JSON config files
- read `robot/config.json`
- write generated plan files
- read and write `robot/transient/<recipe-id>.state.json`
- update JSON-backed artifacts when explicitly requested by a task

Naming decision:

- service folder: `src/services/json/`
- config stays JSON-backed by default

## 14. Markdown Service

The markdown service supports two capabilities:

1. Whole-file reads
2. Marker-based inserts

Architecture rules:

- reads return file contents as stored
- writes target explicit marker comments such as `<!-- robot:preview-table-first-row -->`
- missing insert markers fail explicitly instead of silently rewriting the wrong region

Working rule:

- read whole file
- insert at named marker

## 15. File Naming and File Index

Filename formatting is configured as both data and code.

That means:

- config stores naming inputs and knobs
- code owns the formatting algorithm

For `generate-panorama`:

- `src/recipes/generate-panorama/config.json` stores the shared fallback `fileIndex`
- `robot/transient/generate-panorama.state.json` stores the live runtime `fileIndex`
- the builder reads `robot/transient/` first and falls back to recipe config if the state file does not exist
- the builder reserves the needed index range and persists the updated value to `robot/transient/`

This keeps a team-shared seed value in tracked source without making tracked source the primary mutable runtime store.

## 16. Plans and Transient State

`robot/plans/` and `robot/transient/` both live under `robot/` and are git-ignored by default.

**Ownership Split**

- runtime artifacts stay local to the `robot/` package instead of polluting the monorepo root
- `robot/plans/<plan-id>.json` stores generated plan data plus per-plan task runtime state
- `robot/transient/<recipe-id>.state.json` stores long-lived mutable recipe state across runs
- recipe config, when present, stores static recipe inputs and optional fallback seed values
- recipe outputs such as generated images may still target paths outside `robot/`, for example `images/outputs/generated/`

**Resolution Rules**

- recipe-driven `build` writes the default plan file `robot/plans/<recipe-id>.json`
- recipe-driven `exec` rewrites that same default plan file before execution
- plan-driven `run` and `resume` target plan files by `planId`
- `resume` may target any existing `robot/plans/<plan-id>.json` by filename stem
- `readPlan(planId)` and `writePlan(planId, plan)` resolve `robot/plans/<plan-id>.json`
- `readRecipeState(recipeId)` and `writeRecipeState(recipeId, value)` resolve `robot/transient/<recipe-id>.state.json`
- callers pass `recipeId` and `planId` explicitly; the JSON service does not infer them from the caller
- builder and runner use JSON service methods directly for internal persistence concerns; `json.read` and `json.write` tasks are for explicit recipe-declared work

**State Rules**

- transient state is recipe-owned; there is no global registry of stateful keys
- a recipe may keep a value only in transient state, or in both transient state and recipe config when a tracked fallback seed is useful
- recipe modules may access recipe-level transient state only through injected service contracts; direct file writes to `robot/transient/` are out of contract

**Example: `generate-panorama`**

Tracked config seed:

```json
{
  "fileIndex": 160
}
```

Builder lookup:

```ts
const recipeId = "generate-panorama";
const state = await services.json.readRecipeState(recipeId);
const config = await readGeneratePanoramaConfig();

const fileIndex =
  typeof state?.fileIndex === "number"
    ? state.fileIndex
    : config.fileIndex;
```

Builder persistence:

```ts
await services.json.writeRecipeState(recipeId, {
  ...state,
  fileIndex: nextFileIndex,
});
```

This keeps a team-shared fallback seed in tracked source without making tracked source the primary mutable runtime store.

## 17. Failure and Resume Semantics

Baseline behavior:

- every task starts in `waiting`
- the runner sets `startedAt` and transitions to `running`
- on success, the runner records `success` and `finishedAt`
- on failure, the runner records `error`, `errorMessage`, and `finishedAt`
- `resume` skips `success` tasks and restarts from the first non-success task

Execution should be sequential and deterministic.

## 18. Testing Principles

Testing must cover:

- CLI argument parsing and runtime id validation
- filename formatting
- plan construction
- JSON state persistence
- markdown whole-file reads and marker writes
- missing-marker failures for markdown inserts
- bridge image composition math with fixtures under `robot/tests/fixtures/images`
- service dispatch through the runner
- nested recipe execution through `workflow.run-recipe`
- smoke-test end-to-end execution

Testing rules:

- automated tests live under `robot/tests/`
- tracked fixtures live under `robot/tests/fixtures/`
- tests must not write into `framework/` or `images/`

## 19. Open Questions

These questions remain intentionally open:

- how much nested recipe execution should share parent context versus isolate sub-context
- when the full `generate-panorama` step graph should be frozen into a more detailed contract

## 20. Summary

The system is a mixed recipe-driven and plan-driven batch CLI with:

- authored recipes as flat files or folderized packages
- a deterministic builder
- a resumable runner
- exchangeable services
- plan artifacts in `robot/plans/`
- mutable runtime state in `robot/transient/`

That is the baseline architecture for the next implementation phase.
