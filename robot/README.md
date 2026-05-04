# Robot

`robot` is the private CLI package for the Global Megacity Panorama monorepo.

It is a small Node.js + TypeScript ESM command-line tool intended to drive image-generation workflows against the panorama framework. The current implementation is a scaffold: it parses commands and prints the resolved arguments for `generate`, but it does not call the OpenAI API yet.

## Status

- `generate` is implemented as a CLI scaffold.
- `edit` and `upload` are reserved subcommands and are not implemented yet.

## Requirements

- Node.js matching [`.nvmrc`](.nvmrc)
- npm

## Install

From the package directory:

```bash
nvm use
npm install
```

## Usage

From the repo root:

```bash
./robot/bin/robot generate --prompt-file framework/prompts/tile-01.md --output images/outputs/generated/001-01-tile1.png
```

From the package directory:

```bash
npm start -- generate --prompt-file ../framework/prompts/tile-01.md --output ../images/outputs/generated/001-01-tile1.png
```

If `dist/index.js` is missing, [`bin/robot`](bin/robot) builds the package automatically before running it.

## Commands

### `generate`

Parses:

- `--prompt-file <path>`
- `--output <path>`

Current behavior:

- validates the required flags
- preserves the caller's working directory
- prints the parsed command payload as JSON

Example output shape:

```json
{
  "scaffold": true,
  "command": "generate",
  "promptFile": "framework/prompts/tile-01.md",
  "output": "images/outputs/generated/001-01-tile1.png",
  "cwd": "/path/to/repo"
}
```

### `edit`

Reserved. Not implemented yet.

### `upload`

Reserved. Not implemented yet.

## Scripts

- `npm run build` compiles TypeScript to `dist/`
- `npm start -- <args>` runs the CLI wrapper

## Project Structure

- [`bin/robot`](bin/robot): Bash wrapper that builds on demand and executes the compiled CLI
- [`src/index.ts`](src/index.ts): command parsing and scaffold behavior
- [`tsconfig.json`](tsconfig.json): TypeScript config for the CLI build
- [`package.json`](package.json): private package metadata and scripts
- [`.plans/03_robot_authoritative_architecture.md`](../.plans/03_robot_authoritative_architecture.md): authoritative architecture for the planned CLI shape
- [`.plans/04_robot_implementation_plan.md`](../.plans/04_robot_implementation_plan.md): phased implementation plan
- [`.plans/05_robot_task_contracts.md`](../.plans/05_robot_task_contracts.md): task and service contract reference

## Development Notes

- The package is intentionally private.
- The current runtime dependency is `openai`, but the live API integration is still to be added.
- There are no tests in this phase.
