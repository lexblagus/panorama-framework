# Global Megacity Panorama Monorepo

This repository is organized into three top-level projects:

- `framework/` contains the canonical panorama specification, docs, and prompts.
- `images/` contains generated outputs, composites, and reference imagery.
- `robot/` contains the private Node/TypeScript CLI for image generation workflows.

Start with `framework/README.md` for the authoritative project context.

## Layout

- `framework/`
- `images/`
- `robot/`

## CLI Entry Point

From the repo root:

```bash
./robot/bin/robot generate --prompt-file framework/prompts/tile-01.md --output images/outputs/generated/001-01-tile1.png
```
