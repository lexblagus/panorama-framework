# Robot CLI Task Contracts

This document defines the first task and service contracts for the `robot/` CLI.

It complements:

- [03_robot_authoritative_architecture.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/03_robot_authoritative_architecture.md)
- [04_robot_implementation_plan.md](/Users/blagus/Gallery/Photos/Panorama/05%20Global%20Megacity%20Panorama/repo-framework/.plans/04_robot_implementation_plan.md)

## Index

- [1. Contract Scope](#1-contract-scope)
- [2. Shared Types](#2-shared-types)
- [3. Task Identifier Convention](#3-task-identifier-convention)
- [4. Service Registry Contract](#4-service-registry-contract)
- [5. JSON Service Contract](#5-json-service-contract)
- [6. Markdown Service Contract](#6-markdown-service-contract)
- [7. OpenAI Service Contract](#7-openai-service-contract)
- [8. Image Service Contract](#8-image-service-contract)
- [9. Workflow Service Contract](#9-workflow-service-contract)
- [10. Minimal Recipe Contract](#10-minimal-recipe-contract)
- [11. Smoke-Test Recipe Contract](#11-smoke-test-recipe-contract)
- [12. Generate-Panorama Recipe Contract](#12-generate-panorama-recipe-contract)
- [13. Assembly-Tiles Recipe Contract](#13-assembly-tiles-recipe-contract)
- [14. Error and Resume Contract](#14-error-and-resume-contract)
- [15. Possible Extensions](#15-possible-extensions)

## 1. Contract Scope

These contracts are for:

- shared model types
- service registry conventions
- task identifiers
- service capabilities
- recipe-level contract examples for `minimal`, `smoke-test`, and `generate-panorama`

## 2. Shared Types

### 2.1 Recipe Id

```ts
export type RecipeId = string; // constrained by /^[a-z0-9_-][a-z0-9_.-]*$/
```

Rules:

- for a flat recipe, the canonical `RecipeId` is derived from the filename without extension
- for a folderized recipe package, the canonical `RecipeId` is derived from the folder name
- if a folderized package has a main recipe file, that main file should match the folder-derived id
- the runtime validates `RecipeId` before resolving recipe or transient-state paths
- `RecipeId` is persisted into plans and runtime state, but it is not authored as a field inside the exported `Recipe` object

### 2.2 Plan Id

```ts
export type PlanId = string; // constrained by /^[a-z0-9_-][a-z0-9_.-]*$/
```

Rules:

- `PlanId` is the filename stem of a plan under `robot/plans/`
- recipe-driven `build` and `exec` use `RecipeId` as the default `PlanId`
- `run --plan <plan-id>` and `resume --plan <plan-id>` may target any existing plan filename stem
- the runtime validates `PlanId` before resolving plan paths
- `.` is allowed after the first character but not as the first character

### 2.3 Recipe Config

```ts
export type RecipeConfigScalar = string | number | boolean | null;

export type RecipeConfigValue =
  | RecipeConfigScalar
  | RecipeConfigValue[]
  | { [key: string]: RecipeConfigValue };

export type RecipeConfig = Record<string, RecipeConfigValue>;
```

`RecipeConfig` is the shared base shape only.

Recipe authors may define narrower local types for their own recipes, for example:

```ts
interface SmokeTestConfig extends RecipeConfig {
  previewFile: string;
  previewMarker: string;
}
```

When a recipe needs stronger typing, that interface lives in the recipe's TypeScript module or helper files. The `config.json` file itself remains data-only.

### 2.4 Global Config

```ts
export type RobotGlobalConfig = Record<string, unknown>;
```

No plan-resolution fields are defined here. This file is reserved for package-wide static defaults that are not recipe-owned.

### 2.5 Step

```ts
export interface Step {
  title: string;
  description?: string;
  taskId: TaskId;
  arguments: Record<string, unknown>;
}
```

### 2.6 Task State

```ts
export type TaskState = "waiting" | "running" | "success" | "error";
```

### 2.7 Task

```ts
export interface Task {
  taskId: TaskId;
  title: string;
  description?: string;
  arguments: Record<string, unknown>;
  state: TaskState;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
}
```

### 2.8 Plan

```ts
export interface Plan {
  recipeId: RecipeId;
  createdAt: string;
  tasks: Task[];
}
```

### 2.9 Recipe

```ts
export interface Recipe {
  title: string;
  description?: string;
  steps: Step[];
}
```

Rules:

- `build` and `exec` accept only `--recipe`
- `run` and `resume` accept only `--plan`
- the authored `Recipe` object does not declare `recipeId` or `planId`
- recipe-driven `build` and `exec` use `RecipeId` as the default `PlanId`
- `build` writes the default plan to `robot/plans/<recipe-id>.json`
- `exec` rebuilds that default plan file before execution
- `run --plan <plan-id>` resolves to `robot/plans/<plan-id>.json` and executes from the beginning
- `resume --plan <plan-id>` resolves to `robot/plans/<plan-id>.json` internally
- manual plan-file renaming is supported as long as the new filename stem is used at resume time
- `resume` executes an existing plan using persisted task state and behaves like `run` when no state exists

Path rules:

- CLI `--plan` accepts a `planId` only, not a path
- recipe and task file arguments are `repoRoot`-relative by default unless a service contract says otherwise

## 3. Task Identifier Convention

Task ids are namespaced by service:

```ts
export type TaskId =
  | "openai.generate-image"
  | "openai.edit-image"
  | "openai.respond"
  | "image.create-bridge"
  | "markdown.read"
  | "markdown.insert"
  | "json.read"
  | "json.write"
  | "workflow.run-recipe";
```

Rules:

- service prefix comes first
- verb is imperative and concrete
- reserved task ids may exist before their first implementation
- `taskId` is the dispatch key, not the unique runtime identity
- each step declares exactly one `taskId` and emits exactly one task
- many steps may reference the same `taskId`
- step order in the authored `steps` array is the execution order
- plan task array order is sufficient runtime identity
- if stable external step references or one-step-to-many-task expansion become necessary, add a distinct `stepId` and `taskInstanceId`

This replaces older unscoped names such as `generate-ai-image` with clearer ownership while keeping the same intent.

## 4. Service Registry Contract

Services should be accessible through a shared context rather than through hard-coded direct imports.

Suggested shape:

```ts
export interface ServiceContext {
  repoRoot: string;
  robotRoot: string;
  planId?: PlanId;
  services: ServiceRegistry;
}

export interface ServiceRegistry {
  json: JsonService;
  markdown: MarkdownService;
  image: ImageService;
  openai: OpenAIService;
  workflow: WorkflowService;
}
```

Implications:

- builder may call `json` and `markdown` directly
- runner dispatches plan tasks through the same registry
- services may call other services through `context.services`

The service registry is a dependency container and dispatch table created for one build or run context.

Illustrative flow:

```ts
const services = createServiceRegistry({ repoRoot, robotRoot });
await services.markdown.read(...);
await dispatchByTaskId(task.taskId, task, services);
```

### 4.1 Service Packaging Convention

Folderized services use this pattern:

```text
src/services/<service-name>/
├─ README.md
├─ index.ts
├─ <service-name>.ts
└─ config.json
```

Current packaging choices:

- `src/services/json/`
- `src/services/markdown/`
- `src/services/image/`
- `src/services/openai/`
- `src/services/workflow.ts`

Folderization is used when a service needs a dedicated README, multiple source files, or service-local config.

## 5. JSON Service Contract

File:

- `src/services/json/`

Role:

- structured JSON reads and writes
- plan persistence
- transient recipe state persistence

Suggested methods:

```ts
interface JsonService {
  read<T>(path: string): Promise<T>;
  write(path: string, value: unknown): Promise<void>;
  readGlobalConfig(): Promise<RobotGlobalConfig>;
  readRecipeState(recipeId: RecipeId): Promise<Record<string, unknown> | null>;
  writeRecipeState(recipeId: RecipeId, value: Record<string, unknown>): Promise<void>;
  readPlan(planId: PlanId): Promise<Plan>;
  writePlan(planId: PlanId, plan: Plan): Promise<void>;
}
```

Path-resolution rules:

- `readPlan(planId)` and `writePlan(planId, plan)` resolve `robot/plans/<plan-id>.json`
- `readRecipeState(recipeId)` and `writeRecipeState(recipeId, value)` resolve `robot/transient/<recipe-id>.state.json`
- callers pass `recipeId` and `planId` explicitly; the JSON service does not infer them from the caller
- builder and runner use these methods directly for internal persistence concerns; `json.read` and `json.write` tasks are for explicit recipe-declared work

Supported task intents:

- `json.read`
- `json.write`

Operational rule:

- ordinary runs may update `robot/transient/<recipe-id>.state.json`
- ordinary runs do not rewrite tracked recipe config files unless an explicit maintenance task requests it
- recipe modules may access recipe-level transient state only through injected service contracts; direct file writes to `robot/transient/` are out of contract

## 6. Markdown Service Contract

File:

- `src/services/markdown/`

Role:

- deterministic markdown reads and writes

### 6.1 Write Contract

Writes target explicit markers.

Example marker comment:

```md
<!-- robot:preview-table-first-row -->
```

Suggested method:

```ts
interface MarkdownInsertRequest {
  file: string;
  marker: string;
  content: string;
}
```

Primary task id:

- `markdown.insert`

Failure rule:

- if the marker is not found, fail with `insert marker not found`

### 6.2 Read Contract

Reads return the full file contents as stored.

Suggested method:

```ts
interface MarkdownReadRequest {
  file: string;
}
```

Primary task id:

- `markdown.read`

Concrete initial example:

```ts
{
  file: "framework/prompts/tile-01.md"
}
```

## 7. OpenAI Service Contract

Files:

- `src/services/openai/README.md`
- `src/services/openai/index.ts`
- `src/services/openai/openai.ts`
- `src/services/openai/config.json`

Role:

- call external OpenAI endpoints
- save returned assets when required

Packaging notes:

- `index.ts` is the public export surface for the service
- `openai.ts` holds the implementation
- `config.json` stores service-local static config
- `README.md` explains service-specific behavior, caveats, and integration notes

Initial capabilities:

- image generation
- reserved hooks for image edits
- reserved hooks for response-based text operations

Suggested method family:

```ts
interface OpenAIService {
  generateImage(args: GenerateImageArgs, context: ServiceContext): Promise<GenerateImageResult>;
  editImage?(args: EditImageArgs, context: ServiceContext): Promise<EditImageResult>;
  respond?(args: RespondArgs, context: ServiceContext): Promise<RespondResult>;
}
```

Primary task ids:

- `openai.generate-image`
- `openai.edit-image`
- `openai.respond`

Suggested service config shape:

```json
{
  "imageGenerationServicePath": "/v1/images/generations",
  "imageEditServicePath": "/v1/images/edits",
  "responsesServicePath": "/v1/responses"
}
```

Example generation arguments:

```ts
interface GenerateImageArgs {
  prompt: string;
  saveAs: string;
  uploads?: string[];
  model?: string;
}
```

## 8. Image Service Contract

File:

- `src/services/image/`

Role:

- local image processing
- bridge-image composition

Primary task id:

- `image.create-bridge`

Suggested arguments:

```ts
interface CreateBridgeArgs {
  leftImage: string;
  rightImage: string;
  saveAs: string;
  tileWidth: number;
  tileHeight: number;
  leftCropWidth: number;
  rightCropWidth: number;
  centerWidth: number;
}
```

## 9. Workflow Service Contract

File:

- `src/services/workflow.ts`

Role:

- orchestration capabilities that are still reusable as service tasks

Primary task id:

- `workflow.run-recipe`

Suggested arguments:

```ts
type RunRecipeArgs =
  | {
      recipeId: RecipeId;
      mode: "build" | "exec";
    }
  | {
      mode: "run" | "resume";
      planId: PlanId;
    };
```

Use cases:

- nested recipe composition
- shared orchestration logic without adding vague `etc` behavior buckets

## 10. Minimal Recipe Contract

Folder:

- `src/recipes/minimal/`

Purpose:

- smallest working recipe for local development
- transient-state proof without touching `images/`

Suggested config shape:

```json
{
  "currentRun": 0,
  "maxRuns": 3,
  "sandboxOutputDir": "robot/tests/.tmp/minimal"
}
```

Suggested build behavior:

- read `currentRun` from recipe transient state and fall back to config if missing
- if `currentRun` is greater than or equal to `maxRuns`, emit no tasks
- otherwise persist `currentRun + 1` into transient state
- emit one `json.write` task that records the current run into the sandbox output directory

Example:

```ts
steps.push({
  title: "Record current run",
  taskId: "json.write",
  arguments: {
    path: "robot/tests/.tmp/minimal/current-run.json",
    value: { currentRun: 1 },
  },
});
```

Nested recipe execution is intentionally kept out of `minimal`; the smoke test covers `workflow.run-recipe` without forcing `minimal` to rewrite its own active default plan file.

## 11. Smoke-Test Recipe Contract

Folder:

- `src/recipes/smoke-test/`

Purpose:

- the first authoritative end-to-end validation recipe

Suggested steps:

1. `json.write` to create a small manifest inside `robot/tests/.tmp/smoke-test/`
2. `markdown.read` to load a fixture markdown file
3. `markdown.insert` into a sandbox markdown copy using `robot:preview-table-first-row`
4. `image.create-bridge` using fixture images
5. `openai.generate-image` through an injectable mock seam by default
6. `workflow.run-recipe` targeting `minimal`

Suggested config shape:

```json
{
  "sandboxOutputDir": "robot/tests/.tmp/smoke-test",
  "sourceMarkdownFile": "robot/tests/fixtures/markdown/source.md",
  "previewTemplateFile": "robot/tests/fixtures/markdown/preview.md",
  "previewFile": "robot/tests/.tmp/smoke-test/preview.md",
  "previewMarker": "robot:preview-table-first-row",
  "leftImage": "robot/tests/fixtures/images/left.png",
  "rightImage": "robot/tests/fixtures/images/right.png",
  "bridgeOutputFile": "robot/tests/.tmp/smoke-test/bridge.png",
  "openaiOutputFile": "robot/tests/.tmp/smoke-test/openai-output.png",
  "workflowRecipeId": "minimal"
}
```

## 12. Generate-Panorama Recipe Contract

Folder:

- `src/recipes/generate-panorama/`

Purpose:

- main production recipe for panorama generation
- intentionally partial until the earlier phases and smoke test are stable

Suggested config shape:

```json
{
  "promptFolder": "framework/prompts",
  "promptFiles": {
    "master": "master.md",
    "tile1": "tile-01.md",
    "tile2": "tile-02.md",
    "tile3": "tile-03.md",
    "tile4": "tile-04.md",
    "tile5": "tile-05.md",
    "tile6": "tile-06.md",
    "tile7": "tile-07.md",
    "tile8": "tile-08.md",
    "tile9": "tile-09.md"
  },
  "previewFile": "images/PREVIEW.md",
  "previewMarker": "robot:preview-table-first-row",
  "compositionMapsR1Folder": "images/refs/R1",
  "compositionMapsR1": {
    "tile1": "151-tile1",
    "tile2": "151-tile2",
    "tile3": "151-tile3",
    "tile4": "151-tile4",
    "tile5": "151-tile5",
    "tile6": "151-tile6",
    "tile7": "151-tile7",
    "tile8": "151-tile8",
    "tile9": "151-tile9"
  },
  "generatedImagePath": "images/outputs/generated",
  "filePrefix": "012",
  "fileIndex": 1,
  "samples": 3,
  "variations": 3,
  "bridgeImage": {
    "tileWidth": 1024,
    "tileHeight": 1536,
    "leftCropWidth": 341,
    "rightCropWidth": 341,
    "centerWidth": 342
  }
}
```

`fileIndex` semantics:

- tracked config stores the shared fallback seed
- `robot/transient/generate-panorama.state.json` stores the live runtime value
- builder consumes the runtime value first and persists the next reserved index there

Suggested step groups:

1. prompt file reads
2. tile image generation
3. bridge image generation
4. optional preview markdown updates
5. optional downstream nested recipe orchestration

## 13. Assembly-Tiles Recipe Contract

Folder:

- `src/recipes/assembly-tiles/`

Purpose:

- optional follow-on recipe that focuses on tile assembly or downstream composition after image generation

Status:

- reserved
- do not implement before `smoke-test` and `generate-panorama` are stable

## 14. Error and Resume Contract

Runner behavior should update these fields consistently:

```ts
task.state = "running";
task.startedAt = now();
```

On success:

```ts
task.state = "success";
task.finishedAt = now();
```

On failure:

```ts
task.state = "error";
task.errorMessage = message;
task.finishedAt = now();
```

Before `run`, the runner should reset each task to a clean start state:

```ts
task.state = "waiting";
delete task.errorMessage;
delete task.startedAt;
delete task.finishedAt;
```

For `resume`:

- keep persisted task state when it exists
- skip tasks already marked `success`
- if no persisted task state exists, behave like `run`

## 15. Possible Extensions

These extensions are not part of the current architecture, but may become useful:

- additional OpenAI task ids
- plan metadata beyond sequential execution
- a dedicated `taskInstanceId` if one step needs to expand into many tasks
- recipe-specific helper libraries inside folderized recipe packages
