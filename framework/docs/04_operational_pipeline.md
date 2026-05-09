# Operational Pipeline

This file defines how humans and models interact over time.

- [Image dimensions](#image-dimensions)
- [Prompt Compilation Contract](#prompt-compilation-contract)
  - [Prompt file contents](#prompt-file-contents)
  - [Multi-pass Requirement](#multi-pass-requirement)
- [Workflow](#workflow)
  - [Generate the Central Master Reference Image](#generate-the-central-master-reference-image)
  - [Generate Pivot Tile Images](#generate-pivot-tile-images)
  - [Generate Secondary Tile Images](#generate-secondary-tile-images)
  - [Manual Assembly in Affinity](#manual-assembly-in-affinity)
  - [Generate Inter-Tile Reference Images](#generate-inter-tile-reference-images)
  - [Generate Tertiary Tile Images](#generate-tertiary-tile-images)
  - [Final Composition & Output](#final-composition--output)
- [Activities](#activities)
- [Editing & Formatting](#editing--formatting)
- [Patch Protocol: How to Propose Spec and Prompt Changes](#patch-protocol-how-to-propose-spec-and-prompt-changes)
  - [Principles](#principles)
  - [Required Output Format](#required-output-format)
  - [Replacement Rules](#replacement-rules)
  - [Prompt Handling Rules](#prompt-handling-rules)
  - [Drift Audit Checklist (Spec ↔ Prompt)](#drift-audit-checklist-spec--prompt)
  - [Example Patch Entry (Template)](#example-patch-entry-template)
- [Review](#review)

## Image dimensions

- ChatGPT: `1024✕1536` (either portrait or landscape)
- Google Gemini NanoBanana: `1408✕768` (either portrait or landscape)

## Prompt Compilation Contract

All files under `framework/prompts/` (except `context.md`) must be **copy/paste ready**: the file contents are exactly what goes into the destination tool’s prompt field, with **no** extra framework metadata (no “Header / Generator / observations” sections, no title lines that are not part of the instruction itself).

### Prompt file contents

- **No blockquote wrapper:** do not prefix prompt lines with `> `.
- **Markdown is allowed** inside the prompt when it carries semantics for the model (lists, emphasis, etc.).
- **Central Master** uses two files concatenated in this order:
  1. `prompts/master-base.md` — shared global base
  2. `prompts/master-only.md` — additional instructions used only for the Central Master image
- **Canonical upload filenames** in backticks (so they match user attachments in the tool; automation may map to different paths on disk):
  - `r1-composition-map.png` — per-tile R1 composition map
  - `master.png` — Central Master reference
  - `ruler.png` — Tile 5 ruler (framing / scale physics only)
  - `bridge.png` — seam-bridge composite between neighbors, when applicable

Typical structure inside a tile prompt (all part of the same paste): reference list + use policy + lock/preserve + scene spec. If a behavior must happen, it must appear in that pasted text.

### Multi-pass Requirement

If generation uses multiple passes, **each pass must include its own full prompt text** (same rules as above), labeled clearly, e.g. `### Pass N: (description)`.

#### Reference stack (R0–R3)
Treat references as **roles** (one reference = one job). This mirrors the hierarchy: **geometry > seam safety > style > motifs**.
- **R0 — Panorama master layout (global):** wide sketch with tile divisions, skyline envelope, horizon, diagonal read, haze/color gradient direction, seam-safe zones.
- **R1 — Per-tile composition map (local):** portrait control map for that tile (sky budget, skyline envelope, edge-safe zones, centerline-avoid where relevant).
- **R2 — Style/palette board (style, not layout):** 4–12 crops focused on materials, window language, rooftop clutter, and sky tone; exclude hero silhouettes and corridor geometry.
- **R3 — Motif hint (optional):** one image max used only as a detail suggestion (bridge/viaduct canopy/etc), never as a composition anchor.

#### Recommended staged approach (when refs “fight” or the model overfits)
- **Stage 1 (layout lock):** use **R1 strong** + optional neighbor edge crops (medium) to lock framing, seam safety, and corridor logic.
- **Stage 2 (style lock):** add **R2 low–medium** to push material realism and color coherence without importing layout.

## Workflow
This section defines the procedural steps used to generate, assemble, and refine the panorama. Workflow rules govern *process and responsibility* only and must not be interpreted as visual constraints.

The maturity of the prompts are: _provisional → anchored → locked_

- *Exploratory:* Concept search, emotional probing
- *Provisional:* _"This works, but I'm still actively questioning its role."_
- *Anchored:* Concept is fixed, prompt stable but may still be tuned
- *Locked:* Prompt is production-ready and reproducible

**Major constraint:** ChatGPT image generation is about 8–9 images/day.

### Generate the ***Central Master Reference Image***

Responsibility: **ChatGPT**

- Generate one **landscape** image based on:
  - **Global Constraints** section
  - **`prompts/master-base.md`** + **`prompts/master-only.md`** (concatenated, in that order)
- This image must implicitly contain the architectural DNA for *all* other tiles.
- This image becomes the **visual reference** for all subsequent slices.
- Output resolution of `1536×1024 pixels` (ChatGPT standard)


### Generate Pivot Tile Images

Responsibility: **ChatGPT**

Pivot tiles are generated first to establish compositional anchors and directional bias.

Each tile generation must be based on:
- **Global Constraints** section (immutable)
- **Tile System** section (tile-specific settings)
- **Reference image:** the ***Central Master Reference Image***
- **R1 composition map for that tile** (when available / required by your current workflow)
- **Portrait** format `1024×1536 pixels` (ChatGPT standard)

Tiles generated in this step:
- Tile 5 (central anchor / ruler)
- Tile 9 (rightmost extreme)
- Tile 1 (leftmost extreme)

Tile 1 functions as a **conceptual anchor**, not a gentle boundary. Its role is to define the natural extreme of the panorama with equal authority to Tile 5 and Tile 9. Subsequent tiles must negotiate continuity with Tile 1’s terrain-dominant logic rather than assume a suburban gradient.

Prompts may be refined iteratively at this stage.



### Generate Secondary Tile Images

Responsibility: **ChatGPT**

Secondary tiles establish intermediate transitions between the pivot tiles.

Each tile generation must be based on:

- **Global Constraints** section
- **Tile System** section
- **Reference image:** the ***Central Master Reference Image***
- **R1 composition map for that tile** (when available / required by your current workflow)
- Visual logic established by pivot tiles

Tiles generated in this step:
- Tile 3
- Tile 7

Prompts may be refined iteratively at this stage.


### Manual Assembly in Affinity

Responsibility: **User**

- Create a **large horizontal canvas**
- Place tiles **1, 3, 5, 7, and 9** side-by-side
- No blending yet; this is structural alignment only
- Canvas size: `(1024×1536) × 9 = 9216×1536 pixels`
- To allow bleeding, use `10000×1800` as composition workspace
- Final image size target: `9216×1536 pixels`


### Generate Inter-Tile Reference Images

Responsibility: **User**

Inter-tile reference images are used to guide continuity for intermediate tiles.

Each reference image `(1024×1536)` is composed as:
- Left tile right crop: `(1024×1536 / 3) = (341×1536)`
- Central transparent band `(1024×1536 / 3) = (342×1536)`
- Right tile left crop `(1024×1536 / 3) = (341×1536)`

Generated references (typical filenames on disk when you export composites):
- Tile 2 reference: Tile 1 + transparency + Tile 3  → `bridge-2.png`
- Tile 4 reference: Tile 3 + transparency + Tile 5  → `bridge-4.png`
- Tile 6 reference: Tile 5 + transparency + Tile 7  → `bridge-6.png`
- Tile 8 reference: Tile 7 + transparency + Tile 9  → `bridge-8.png`

In **prompt text** under `framework/prompts/`, every bridge attachment is referred to as **`bridge.png`** (paste-ready contract). Map your real file to that name when uploading, or rename the export for the tool.

### Generate Tertiary Tile Images

Responsibility: **ChatGPT**

Each tertiary tile is generated using its corresponding inter-tile reference image (bridge composite), plus its own R1 map (REQUIRED in the current workflow when provided).

Tiles generated in this step (prompts use canonical names `r1-composition-map.png`, `bridge.png`, `ruler.png` as applicable):
- Tile 2 (R1 map + bridge composite + Tile 5 ruler)
- Tile 4 (R1 map + bridge composite + Tile 5 ruler)
- Tile 6 (R1 map + bridge composite + Tile 5 ruler)
- Tile 8 (R1 map + bridge composite + Tile 5 ruler)

This step increases continuity and reduces seam artifacts.

**Optional (secondary seam-lock bridges, after tertiary tiles exist):**
- Tile 3 seam-lock reference: Tile 2 right crop + transparency + Tile 4 left crop  → export e.g. `tile2-4-bridge.png` (attach as **`bridge.png`** in the prompt)
- Tile 7 seam-lock reference: Tile 6 right crop + transparency + Tile 8 left crop  → export e.g. `tile6-8-bridge.png` (attach as **`bridge.png`** in the prompt)

These **seam-lock references** are **OPTIONAL** and used only for a seam-lock refinement pass on secondary tiles (Tiles 3 and 7).
Only apply the **seam-lock reference** after the initial tiles (3 and 7) have been generated and need refinement.
The seam-lock bridge MUST use the same **exact-thirds** construction defined above:
- 341px crop + 342px **fully transparent (alpha=0)** band + 341px crop (for 1024×1536)
The seam-lock reference applies solely to **seam continuity** and should **not** be used as the main layout anchor.


### Final Composition & Output

Responsibility: **User**

- Manual work:
  - Masking
  - Blending
  - Stitching
- Any individual color correction needed
- Final crop to `9216×1536 pixels`
- Final color correction (if needed)

Downstream variants:
- 3-monitor displays:  
  `6480×1080 pixels`, cropping to `5760×1080 pixels`
- 4-monitor displays:  
  `7680×1280 pixels`, cropping to `7680×1080 pixels`


## Activities

- Add to concepts: ***Active calibration layer***
- After a prompt is provisionally locked, test it in a fresh chat/session to reduce long-thread drift.
- If results degrade after many iterations, restart from the locked prompt and current references instead of stacking more conversational context.
- Optional future work: generate NanoBanana-specific specs and prompts.

---

## Editing & Formatting

This subsection defines mandatory rules governing how this document may be edited, extended, or reformatted. These rules exist to preserve structural integrity, prevent silent drift, and ensure reproducible collaboration between human and AI contributors.

- **Section structure**
  - New major sections (N) and primary subsections (N.N) must not be added.
  - Subsections below that level (e.g. `4.8.x`) may be added or adjusted when scoped correctly and when they do not contradict higher-level constraints.
  - Structural exceptions are allowed only when clearly justified (e.g. workflow refactors).

- **Change disclosure**
  - All edits must be communicated explicitly using one of the following forms:
    - `Change section N.N to:` followed by full Markdown code
    - `Add paragraph to section N.N:` followed by Markdown code
    - `Replace quoted block under "<exact heading>" with:` followed by Markdown code
  - Silent edits, implicit rewrites, or partial diffs are not permitted.

- **Formatting rules**
  - A horizontal rule (`---`) is allowed only at the end of major sections (N).
  - No horizontal rules may appear elsewhere in the document.
  - Exactly four blank lines must separate major sections.
  - Exactly two blank lines must follow each subsection (N.N).

These rules govern document evolution only and do not affect visual, narrative, or generation constraints.


## Patch Protocol: How to Propose Spec and Prompt Changes

This framework treats image generation as a systems-design problem. As such, modifications must be expressed in a **repeatable, auditable patch format** that can be applied without interpretation.

### Principles

- **Specs are authoritative.** Prompts are execution artifacts generated from specs.
- Prefer **replacing entire sections or paragraphs** over micro-edits.
- Every patch must be **anchored** to a concrete target (file + section header).
- Patch text must be **copy/paste ready** and safe to apply verbatim.
- When conflicts exist between documents, resolve by **authority order**:
  1. `docs/01_core_canonical.md` (global invariants)
  2. `docs/02_tile_system.md` (tile system rules)
  3. `docs/03_tile_YY.md` (tile specs)
  4. `docs/04_operational_pipeline.md` (process)
  5. `docs/05_runtime_notes_and_variants.md` (runtime notes, non-canonical)
  6. `prompts/*` (execution artifacts)

### Required Output Format

A patch set must be written in this structure:

1. **Patch Set Header**
   - Goal (one sentence)
   - Scope (which tiles, which files)

2. **Change Entries** (repeat for each change)
   - **File:** `<path>`
   - **Target Section:** `<exact markdown heading path>`
   - **Action:** `REPLACE SECTION` or `REPLACE PARAGRAPH` (preferred) or `INSERT AFTER <anchor line>`
   - **Replace this:** (verbatim excerpt of the current block being replaced)
   - **With this:** (the full replacement block)
   - **Rationale:** 1–3 lines describing why this is required (optional but recommended)
   - **Downstream impact:** which prompts must be regenerated (optional)

### Replacement Rules

- When possible, the **“Replace this”** block must be the *entire* section under a heading.
- If replacing a paragraph within a section, include enough surrounding text to uniquely identify it.
- Avoid ambiguous anchors such as “the paragraph about haze.” Use explicit headings or exact quoted lines.

### Prompt Handling Rules

- Do not “fix prompts” in isolation.
- If a prompt needs modification, first patch the **spec source**.
- After spec edits are applied, regenerate the prompt outputs.
- When sharing prompt changes for review, provide the **full prompt file contents** to avoid drift and partial merges.

### Drift Audit Checklist (Spec ↔ Prompt)

When reviewing a tile:

- If a prompt includes a constraint that is not present in its spec sources, that content is **drift** and must be:
  - added to specs (if intended), or
  - removed from the prompt (if accidental).
- If a spec includes a constraint that is missing from the prompt, the prompt is **incomplete** and must be regenerated.
- Validate especially:
  - light direction and shadow-fall
  - camera invariants (no vertical recentering)
  - haze ladder position
  - skyline / sky-band framing discipline
  - “forbidden motifs” clauses

## Review

After editing this document, perform the following validation checks before any image generation or regeneration step.

|  # | Check Category                 | What Is Being Verified                                                                 |
| -: | ------------------------------ | -------------------------------------------------------------------------------------- |
|  1 | Section numbering integrity    | No missing numbers, no duplicated numbers, no logical jumps                             |
|  2 | Hierarchy consistency          | Sections, subsections, and sub-subsections follow a stable and predictable depth        |
|  3 | Terminology consistency        | Identical concepts use identical names across all sections                              |
|  4 | Constraint precedence          | Global Constraints always override Tile-level rules without exception                   |
|  5 | Lighting rules coherence       | Sun visibility, direction, diffusion, and exceptions are non-contradictory              |
|  6 | Image dimension math           | All pixel dimensions, orientations, and aspect ratios are internally consistent        |
|  7 | Workflow linearity             | No circular dependencies between workflow steps                                         |
|  8 | Role separation clarity        | ChatGPT and User responsibilities are clearly separated and never overlap               |
|  9 | Tile narrative gradient        | Density, mood, function, and activity evolve strictly from Tile 1 → Tile 9              |
| 10 | Forbidden motif enforcement    | Tile-level forbidden motifs do not contradict global allowances                         |
| 11 | Duplication and redundancy     | No rule is repeated with only minor wording variations                                  |
| 12 | Ambiguity hotspots             | No phrasing allows multiple plausible interpretations by an image model                 |
| 13 | Future extensibility           | Lighting, ambiance, or tile expansion can be added without breaking structure           |
| 14 | Lateral ambiance monotonicity  | Warmth, clarity, and contrast never re-emerge after Tile 5                               |
| 15 | Atmospheric identity stability | Cinematic references support the project identity without overriding it                 |
| 16 | Index regeneration validity    | Section index is regenerated if any section title or numbering changes                  |
| 17 | Index link integrity           | All index/TOC entries correctly link to the current section headers/anchors (no stale internal links) |
| 18 | Scale coherence                | Vehicles, buildings, terrain, and infrastructure maintain consistent human-scale relationships across tiles |

> **Rule:** If any check fails, the document must be corrected **before** prompt generation or image regeneration.
