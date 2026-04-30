# Clean-History Monorepo Reset, Rev 2

## Summary

- Build the new repo locally on an orphan branch `feature/monorepo`, but do not push anything yet.
- Keep the repo root content-first, not package-first: `framework/` and `images/` stay as plain directories, and only `robot/` gets npm metadata.
- Keep `robot` as a Bash-invoked Node/TypeScript ESM CLI. That fits the current OpenAI JavaScript examples (`import OpenAI from "openai"`) and the planned command-line workflow; for the first real API integration, structure `robot` around single-shot image `generate` and `edit` commands via the Images API, with Responses API left as a later extension for multi-turn image flows. ([platform.openai.com](https://platform.openai.com/docs/guides/images/image-generation))
- TypeScript initialization is not just copying `tsconfig.json`: also add the TS dev dependencies, create `src/`, wire the CLI `bin` entry, define build/start scripts, and ignore build artifacts.
- No additional backup step is part of the plan; your manual `cp -r` backup is the only backup assumption.

## Implementation Changes

- Clean local state before branching:
  - Restore `outputs/prompts.json` to the tracked version.
  - Delete `outputs/out/`.
- Create the new local history on `feature/monorepo` with `git checkout --orphan feature/monorepo`.
- New root layout:
  - `framework/`: current `README.md`, `docs/`, `prompts/`, and the current root `.gitignore`
  - `images/`: current `outputs/` and `refs/`
  - `robot/`: new CLI package
- Root files:
  - Add a new root `README.md` that describes the three top-level projects and points to `framework/` as the canonical source.
  - Keep `.gitattributes` at repo root, but narrow the existing LFS rules so they only apply to files inside `images/`.
  - Add a root `.gitignore` only for repo-wide noise such as `.DS_Store`, editor metadata, and other root junk.
- `framework/`:
  - Move the current framework material into `framework/`.
  - Rewrite markdown links so they resolve through `images/` after the move.
  - Update `framework/prompts/context.md` raw GitHub paths so they point to `framework/...` instead of the old repo root.
- `images/`:
  - Move `outputs/` to `images/outputs/`.
  - Move `refs/` to `images/refs/`.
  - Do not migrate `outputs/out/`.
  - Add `images/.gitignore` with `outputs/out/` ignored if a scratch directory is ever recreated later.
- `robot/`:
  - Create `robot/` as a private CLI package.
  - Copy `repo-robot/.nvmrc`.
  - Copy `repo-robot/.gitignore` as a base, then keep only rules that still make sense for the new CLI package.
  - Initialize `package.json` for a private ESM CLI package:
    - `private: true`
    - `type: module`
    - `bin: { "robot": "./bin/robot" }`
    - no `dev`, `watch`, or `test` scripts
    - scripts:
      - `build`: `tsc -p tsconfig.json`
      - `start`: `./bin/robot`
  - Initialize TypeScript from the current `repo-robot/tsconfig.json`, but adapt it for a CLI:
    - keep `target`, `module`, `moduleResolution`, `rootDir`, `outDir`, `strict`, and `skipLibCheck`
    - drop declaration output, since this is not a library package
  - Install minimal initial dependencies:
    - runtime: `openai`
    - dev: `typescript`, `@types/node`
    - do not add `sharp` yet; reserve it for the first feature that uses it
  - Create `src/index.ts` as a minimal CLI dispatcher, not an empty file.
  - Move the existing helper artifacts into `robot/legacy/`:
    - `robot/legacy/generate-images.mjs`
    - `robot/legacy/prompts.json`
  - Keep those legacy files unlinked from `package.json` scripts and from the new CLI flow.

## CLI Interface

- Use one command with subcommands, not separate `generate.sh`-style entrypoints.
- Primary wrapper:
  - `./robot/bin/robot`
- Command shape:
  - `./robot/bin/robot generate --prompt-file framework/prompts/tile-01.md --output images/outputs/generated/001-01-tile1.png`
- Future subcommands reserved now:
  - `generate`
  - `edit`
  - `upload`
- Flag style:
  - standardize on long flags with space-separated values: `--flag value`
  - do not document `key=value`
  - if `--flag=value` later works incidentally, treat that as compatibility, not the primary interface
- `src/index.ts` initial behavior:
  - parse the `generate` subcommand
  - parse `--prompt-file` and `--output`
  - print the parsed command/options as a scaffold placeholder
- `bin/robot` behavior:
  - POSIX shell wrapper with `#!/usr/bin/env bash` and `set -euo pipefail`
  - resolve the package root from the script location
  - preserve the caller’s current working directory
  - if `dist/index.js` is missing, run `npm --prefix "$PACKAGE_ROOT" run build`
  - `exec node "$PACKAGE_ROOT/dist/index.js" "$@"`

## Validation

- Verify the new tree contains only the intended root layout and metadata.
- Confirm `outputs/` and `refs/` no longer exist at repo root.
- Confirm `framework/` markdown has no stale root-era paths to `outputs/` or `refs/`.
- Confirm `git lfs ls-files -n` only reports paths under `images/`.
- In `robot/`, verify:
  - `npm install`
  - `npm run build`
  - `npm start -- generate --prompt-file ../framework/prompts/tile-01.md --output ../images/outputs/generated/001-01-tile1.png`
  - `./bin/robot generate --prompt-file framework/prompts/tile-01.md --output images/outputs/generated/001-01-tile1.png` when run from repo root

## Assumptions And Later Push

- No remote push is part of this execution phase.
- No extra backup step is needed beyond your manual filesystem backup.
- `robot` is a CLI-only package in this phase, not a reusable library package.
- `robot/legacy/` is retained as reference material only.
