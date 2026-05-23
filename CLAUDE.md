# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A monorepo for the **Global Megacity Panorama** — a specification-driven visual system for generating a large-scale, multi-tile urban panorama using AI image generation models. It treats image generation as a systems-design problem, not prompt guessing.

Top-level areas:

- `framework/` — the authoritative canonical specification, docs, and paste-ready prompts
- `images/` — generated outputs (JSON job metadata), composites (Affinity Photo `.af`), and R1 reference imagery
- `robot/` — Node.js/TypeScript CLI that builds and executes recipe-based workflows
- `.plans/` — internal architecture and design planning documents (not framework authority; do not treat as spec)

## Framework Authority Rules

Before editing any spec or prompt file, read:

- `framework/docs/01_core_canonical.md` — global invariants (highest authority)
- `framework/docs/02_tile_system.md` — tile system rules and framing stability protocol
- `framework/docs/03_tile_01.md` through `03_tile_09.md` — per-tile specs
- `framework/docs/04_operational_pipeline.md` — workflow, patch protocol, 18-point validation checklist
- `framework/docs/05_runtime_notes_and_variants.md` — NanoBanana (Google Gemini) adaptation rules

Authority order when conflicts arise:
1. `docs/01_core_canonical.md`
2. `docs/02_tile_system.md`
3. `docs/03_tile_YY.md`
4. `docs/04_operational_pipeline.md`
5. `docs/05_runtime_notes_and_variants.md`
6. `prompts/*` (execution artifacts compiled from specs)

**Do not infer or "improve" intent.** Do not simplify constraints, merge tiles, or introduce new concepts without explicit instruction. Do not patch prompts in isolation — patch the spec first, then regenerate the prompt.

All files under `framework/prompts/` must be **paste-ready**: exactly what goes into the image tool's prompt field, no framework metadata. Central Master uses `master-base.md` + `master-only.md` concatenated (in that order). Canonical attachment names in prompts: `r1-composition-map.png`, `master.png`, `ruler.png`, `bridge.png`.

### Reference Stack

When prompts reference uploaded images, these are the four reference levels:

| Level | Name | Purpose |
|-------|------|---------|
| R0 | Panorama master layout | Global sketch: tile divisions, skyline envelope, horizon, haze gradient, seam-safe zones |
| R1 | Per-tile composition map | Portrait control: sky budget, skyline envelope, edge-safe zones, centerline-avoid |
| R2 | Style/palette board | 4–12 crops: materials, window language, rooftop clutter, sky tone (no hero silhouettes) |
| R3 | Motif hint | One image max, detail suggestion only — never a composition anchor |

### Image Dimensions

| Tool | Tile size | Master size |
|------|-----------|-------------|
| ChatGPT (default) | 1024×1536 (portrait) | 1536×1024 (landscape) |
| NanoBanana (Google Gemini) | 1408×768 | — |

Bridge composites (Tiles 2, 4, 6, 8): exact-thirds — 341px crop left + 342px transparent band + 341px crop right. No gradient, no feather.

### Workflow Execution Order

Tiles must be generated in this order to maintain framing and seam continuity:

1. Central Master Reference (landscape, shared DNA)
2. Pivot tiles: 1, 5, 9
3. Secondary tiles: 3, 7
4. Manual assembly of 1, 3, 5, 7, 9 in Affinity (9216×1536 canvas)
5. Bridge composites: 2, 4, 6, 8 (exact-thirds)
6. Tertiary tiles: 2, 4, 6, 8 (using bridges + R1 maps + Tile 5 ruler)
7. Final stitch and crop to 9216×1536

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
npm run build        # compile TypeScript to dist/
npm test             # run full test suite (unit + e2e) — REQUIRED before completing any feature
npm run test:unit    # unit tests only
npm run test:e2e     # e2e tests only (CLI, image, JSON, markdown, workflow, openai)
```

Run a single test file:

```bash
cd robot
npx vitest run tests/unit/builder.test.ts
```

**Testing mandate:** When implementing any feature, bug fix, or refactor in the `robot/` package, you MUST run `npm test` from `robot/` and confirm all tests pass before considering the task complete. The full suite (unit + e2e) is the acceptance gate. Do not skip e2e tests — they exercise the full recipe → builder → runner → service pipeline and catch wiring errors that unit tests miss.

## Robot Architecture

The CLI has two core runtime modules:

- **`src/builder.ts`** — resolves a recipe ID to a file, calls `buildRecipe(context)` (or reads the default/named export), and writes the resulting plan as JSON to `robot/plans/<plan-id>.json`.
- **`src/runner.ts`** — reads a plan, iterates tasks, dispatches each to the matching service method, and persists task state.

### Recipe System

Recipes are TypeScript files in `robot/recipes/` (preferred) or `robot/src/recipes/`. They export a `{ title, steps }` object, or a `buildRecipe(context)` async function for dynamic plans. The `buildRecipe` context exposes `recipeId`, `repoRootFolder`, `robotPackageFolder`, `recipeConfig` (from `config.json` in the recipe folder), and all services.

Recipe ID segments must match `^[a-z0-9_-][a-z0-9_.-]*$`. Plans and transient state are stored in `robot/plans/` and `robot/transient/`.

Each recipe directory may include a `config.schema.ts` (Zod schema) alongside `config.json` for validated config loading.

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
- `image.model` (default `gpt-image-1-mini`), `image.quality` (default `low`), `image.masterSize` (1536×1024), `image.tileSize` (1024×1536)
- `leftCropWidth` / `rightCropWidth` — bridge composite crop widths (default 341)
- Paths for prompt files (masterBase, masterOnly, tile1–9), output folder, preview markdown, and per-tile R1 composition map filenames

Execution order in the recipe: Tile 5 → Tiles 1, 9 → Tiles 3, 7 → bridges → Tiles 2, 4, 6, 8.
