# Global Megacity Panorama Framework

This repository contains the **Global Megacity Panorama Framework**: a structured, versioned system for designing and generating a large-scale, multi-tile urban panorama using image generation models.

This is **not** a collection of prompts.  
It is a **specification-driven visual system**.

Any model or human interacting with this repository must treat the Markdown files as the **single source of truth**.

---

## How to Work With This Repository (Important)

If you are an AI assistant (e.g. Codex in Cursor):

1. **Read before acting**
   - Always read the following files before proposing edits or generating prompts:
     - `docs/01_core_canonical.md`
     - `docs/02_tile_definitions.md`
   - These define global constraints, camera physics, semantic roles, and tile boundaries.

2. **Respect authority layers**
   - Canonical sections override all other instructions.
   - Tile definitions override ad-hoc prompting.
   - Generator prompts are *compiled artifacts*, not conceptual sources.

3. **Do not infer or “improve” intent**
   - Do not guess what the project “should be”.
   - Do not simplify constraints.
   - Do not merge tiles, blur roles, or introduce new concepts unless explicitly requested.

4. **Scale and camera are global**
   - Camera position, optics, compression, and framing are globally fixed.
   - If a perceived scale issue arises, assume **global drift** before local tile defects.

5. **Tile work is modular**
   - Each tile is defined independently but evaluated relationally.
   - Changes to one tile must not silently affect others.

---

## Repository Structure (Conceptual)

- `docs/`  
  Canonical specifications, tile definitions, workflow, and runtime notes.

- `prompts/`  
  Executable generator prompts derived from the specs.
  These should be treated as *outputs*, not authorities.

- `outputs/`  
  Generated images, composites, and Affinity files.
  These are artifacts for evaluation and versioning.

- `sources/`  
  Reference imagery, moodboards, and external inspiration.

---

## Working Rules (Non-Negotiable)

- Do not rewrite large sections without explicit instruction.
- Do not collapse multiple conceptual layers into one.
- Do not remove constraints for convenience.
- When uncertain, **ask a clarification question instead of assuming**.

This framework prioritizes:
- structural integrity
- reproducibility
- perceptual consistency across tiles
- long-term evolvability

---

## Goal of the Project

To produce a **coherent, large-scale megacity panorama** composed of multiple tiles, each with a clear semantic role, unified camera system, and controlled perceptual transitions — suitable for both artistic exploration and rigorous prompt engineering research.

This project treats image generation as a **systems design problem**, not a guessing game.
