# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A monorepo for the **Global Megacity Panorama** — a specification-driven visual system for generating a large-scale, multi-tile urban panorama using AI image generation models. It treats image generation as a systems-design problem, not prompt guessing.

Three top-level areas:

- `framework/` — the authoritative canonical specification, docs, and paste-ready prompts
- `images/` — generated outputs, composites, and reference imagery
- `robot/` — Node.js/TypeScript CLI that builds and executes recipe-based workflows

## Framework Authority Rules

Before editing any spec or prompt file, read:

- `framework/docs/01_core_canonical.md` — global invariants (highest authority)
- `framework/docs/02_tile_system.md` — tile system rules
- `framework/docs/03_tile_01.md` through `03_tile_09.md` — per-tile specs

Authority order when conflicts arise:
1. `docs/01_core_canonical.md`
2. `docs/02_tile_system.md`
3. `docs/03_tile_YY.md`
4. `docs/04_operational_pipeline.md`
5. `docs/05_runtime_notes_and_variants.md`
6. `prompts/*` (execution artifacts compiled from specs)

**Do not infer or "improve" intent.** Do not simplify constraints, merge tiles, or introduce new concepts without explicit instruction. Do not patch prompts in isolation — patch the spec first, then regenerate the prompt.

All files under `framework/prompts/` must be **paste-ready**: exactly what goes into the image tool's prompt field, no framework metadata. Central Master uses `master-base.md` + `master-only.md` concatenated (in that order). Canonical attachment names in prompts: `r1-composition-map.png`, `master.png`, `ruler.png`, `bridge.png`.

## Robot CLI

### Setup

```bash
cd robot
nvm use          # node v24.10.0
npm install
cp .env.sample .env   # set OPENAI_API_KEY
```

### Running

From repo root:

```bash
./robot/bin/robot build --recipe generate-panorama     # build plan only
./robot/bin/robot exec  --recipe generate-panorama     # build + execute from start
./robot/bin/robot run   --plan   generate-panorama     # execute existing plan from start
./robot/bin/robot resume --plan  generate-panorama     # resume from persisted state
```

From the robot package directory:

```bash
npm start -- exec --recipe examples/empty
```

### Build & Test

```bash
cd robot
npm run build      # compile TypeScript to dist/
npm test           # run Vitest unit/integration/e2e tests
```

Run a single test file:

```bash
cd robot
npx vitest run tests/unit/builder.test.ts
```

## Robot Architecture

The CLI has two core runtime modules:

- **`src/builder.ts`** — resolves a recipe ID to a file, calls `buildRecipe(context)` (or reads the default/named export), and writes the resulting plan as JSON to `robot/plans/<plan-id>.json`.
- **`src/runner.ts`** — reads a plan, iterates tasks, dispatches each to the matching service method, and persists task state.

### Recipe System

Recipes are TypeScript files in `robot/recipes/` (preferred) or `robot/src/recipes/`. They export a `{ title, steps }` object, or a `buildRecipe(context)` async function for dynamic plans. The `buildRecipe` context exposes `recipeId`, `repoRootFolder`, `robotPackageFolder`, `recipeConfig` (from `config.json` in the recipe folder), and all services.

Recipe ID segments must match `^[a-z0-9_-][a-z0-9_.-]*$`. Plans and transient state are stored in `robot/plans/` and `robot/transient/`.

### Services (Task Capabilities)

Each service maps to a set of `taskId` values used in recipe steps:

| Service | Task IDs |
|---------|----------|
| `openai` | `openai.generate-image`, `openai.edit-image`, `openai.respond` |
| `image` | `image.create-bridge`, `image.compose-tiles` |
| `markdown` | `markdown.read`, `markdown.write`, `markdown.insert` |
| `json` | `json.read`, `json.write` |
| `workflow` | `workflow.run-recipe` |

**OpenAI service**: uses `POST /v1/images/generations` (no `inputImages`) or `POST /v1/images/edits` (with `inputImages`/`maskFile`). Supported models: `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`. Legacy models are limited to `1024x1024`, `1024x1536`, `1536x1024` sizes.

**Image service**: `image.create-bridge` crops left and right tiles and composites them with a transparent center band (exact-thirds: 341px + 342px transparent + 341px for 1024×1536). `image.compose-tiles` creates a horizontal preview strip.

**Markdown service**: `markdown.insert` supports `before`, `after`, `over`, and `between` (two-marker) positions. HTML comments like `<!-- robot:marker-name -->` serve as insert markers throughout `images/PREVIEW.md` and `framework/README.md`.

### Generate-Panorama Recipe

The primary recipe is `robot/recipes/generate-panorama/`. Its `config.json` controls:
- `filePrefix` and `fileIndex` — output filename numbering
- `samples` / `variations` — how many images to generate per tile
- `image.model`, `image.quality`, `image.masterSize`, `image.tileSize`
- `leftCropWidth` / `rightCropWidth` — bridge composite crop widths (default 341)
- Paths for prompt files, output folder, preview markdown, and composition map references
