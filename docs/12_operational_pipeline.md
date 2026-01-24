# Operational Pipeline

This file defines how humans and models interact over time.

## Workflow

This section defines the procedural steps used to generate, assemble, and refine the panorama.  
Workflow rules govern *process and responsibility* only and must not be interpreted as visual constraints.

The maturity of the prompts are: _provisional → anchored → locked_

- *Exploratory:* Concept search, emotional probing
- *Provisional:* _"This works, but I'm still actively questioning its role."_
- *Anchored:* Concept is fixed, prompt stable but may still be tuned
- *Locked:* Prompt is production-ready and reproducible

**Major constraint:** ChatGPT image generation is about 8–9 images/day.

### Generate the ***Central Master Reference Image***

Responsability: **ChatGPT**

- Generate one **landscape** image based on:
  - **Global Constraints** section
  - **Global Base Prompt** section
- This image must implicitly contain the architectural DNA for *all* other tiles.
- This image becomes the **visual reference** for all subsequent slices.
- Output resolution of `1536×1024 pixels` (ChatGPT standard)


### Generate Pivot Tile Images

Responsability: **ChatGPT**

Pivot tiles are generated first to establish compositional anchors and directional bias.


Each tile generation must be based on:

- **Global Constraints** section: immutable settings
- **Tile System** section: with tile-specific settings
- **Reference image:** the ***Central Master Reference Image***
- **Portrait** format `1024×1536 pixels` (ChatGPT standard)

Tiles generated in this step:
- Tile 5 (central anchor)
- Tile 9 (rightmost extreme)
- Tile 1 (leftmost extreme)

Tile 1 functions as a **conceptual anchor**, not a gentle boundary. Its role is to define the natural extreme of the panorama with equal authority to Tile 5 and Tile 9. Subsequent tiles must negotiate continuity with Tile 1’s terrain-dominant logic rather than assume a suburban gradient.

Prompts may be refined iteratively at this stage.



### Generate Secondary Tile Images

Responsability: **ChatGPT**

Secondary tiles establish intermediate transitions between the pivot tiles.

Each tile generation must be based on:

- **Global Constraints** section
- **Tile System** section
- **Reference image:** the ***Central Master Reference Image***
- Visual logic established by pivot tiles

Tiles generated in this step:
- Tile 3
- Tile 7

Prompts may be refined iteratively at this stage.


### Manual Assembly in Affinity

Responsability: **User**

- Create a **large horizontal canvas**
- Place tiles **1, 3, 5, 7, and 9** side-by-side
- No blending yet; this is structural alignment only
- Canvas size: `(1024×1536) × 9 = 9216×1536 pixels`
- To allow bleeding, use `10000×1800` as composition workspace
- Final image size target: `9216×1536 pixels`


### Generate Inter-Tile Reference Images

Responsability: **User**

Inter-tile reference images are used to guide continuity for intermediate tiles.

Each reference image `(1024×1536)` is composed as:
- Left tile right crop: `(1024×1536 / 3) = (341×1536)`
- Central transparent band `(1024×1536 / 3) = (342×1536)`
- Right tile left crop `(1024×1536 / 3) = (341×1536)`

Generated references:
- Tile 2 reference: Tile 1 + transparency + Tile 3
- Tile 4 reference: Tile 3 + transparency + Tile 5
- Tile 6 reference: Tile 5 + transparency + Tile 7
- Tile 8 reference: Tile 7 + transparency + Tile 9


### Generate Tertiary Tile Images

Responsability: **ChatGPT**

Each tertiary tile is generated using its corresponding inter-tile reference image.

Tiles generated in this step:
- Tile 2 (using 1–3 reference)
- Tile 4 (using 3–5 reference)
- Tile 6 (using 5–7 reference)
- Tile 8 (using 7–9 reference)

This step increases continuity and reduces seam artifacts.


### Final Composition & Output

Responsability: **User**

- Manual labor of:
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

- TODO: Add the magic trick, stating that a chat gets wasted after too many iteractions; after a prompt lock try in a new chat.


### Global Composition Calibration & Tile Realignment Plan

- Purpose:
  - Define system-level calibration steps to ensure scale coherence, compositional continuity, and perceptual balance.
  - Focus on relational corrections between tiles, not isolated tile perfection.
  - Execute before any fine stitching or color grading.
- Assumption:
  - Individual tile prompts are already anchored.
  - Tile 5 is the global calibration authority.
- ***Step 1*** — Establish Dominant Spatial Force Rotation
  - Enforce a progressive rotation of dominant spatial energy across the panorama.
  - This is a compositional principle, not a camera change.
  - Target dominant reads:
    - Tile 1: Vertical (terrain, cliffs, elevation drops)
    - Tile 3: Diagonal (negotiated urban rise)
    - Tile 5: Vertical (urban axis, core compression)
    - Tile 7: Diagonal (post-core release)
    - Tile 9: Horizontal (logistics, industry, sprawl)
  - Rules:
    - Camera height, pitch, and optics remain unchanged.
    - Rotation is expressed through mass orientation, circulation flow, and element dominance.
    - Intermediate tiles (2–4 and 6–8) must interpolate this rotation progressively.
- ***Step 2*** — Lock Telephoto Compression as a Global Constant
  - Treat perceived scale issues as compression errors, not size errors.
  - Invariant:
    - Telephoto-like depth compression is constant across all tiles.
  - Allowed to vary:
    - Building height
    - Vertical density
    - Semantic density (residential vs logistical)
    - Atmospheric masking
  - Forbidden corrections:
    - Camera pullback or push-in
    - Vertical recentering
    - Manual skyline leveling
    - Tile rescaling
- ***Step 3*** — Tile-Specific Structural Adjustment Goals
  - Tile 3 — Transition Zone:
    - Increase midground stacking and occlusion.
    - Add residential repetition (houses, apartments, balconies, windows).
    - Reduce perceived openness.
    - Do not increase overall building height.
    - Goal: same camera, stronger compression, still pre-core.
  - Tile 5 — Iconic Core:
    - No structural changes.
    - Acts as calibration authority for:
      - Maximum vertical pressure
      - Maximum atmospheric diffusion
      - Horizon physics
  - Tile 7 — Urban Sprawl:
    - Maintain reduced building height.
    - Increase layering, overlap, and visual clutter.
    - Shift semantic density toward logistical elements:
      - warehouses
      - depots
      - service yards
      - large commercial slabs
    - Roads and infrastructure may dominate but must remain compressed.
    - Goal: release height, not compression.
  - Tile 9 — Industrial Terminus:
    - Increase luminance and atmospheric radiance.
    - Do not increase contrast.
    - Atmosphere should feel brighter, more suffocated, and volumetrically saturated.
    - Target mood: industrial afterlife, not darkness.
    - Fog, haze, and particulate density may glow softly.
- ***Step 4*** — Normalize Horizon and Skyline Physics (Three-Band Lock)
  - Goal:
    - Stabilize perceived “zoom”, sky share, and skyline height drift across the strip **without changing camera parameters**.
    - Treat Tile 5 as the vertical framing authority.
  - Procedure (Tile 5 as ruler):
    1. Lock Tile 5 first (it is the calibration authority).
    2. From Tile 5, record three guide heights (mentally or with quick overlay lines in your viewer):
       - **Band A:** Horizon/vanishing height (where far detail collapses).
       - **Band B:** Dominant skyline crest height (top silhouette of the main mass).
       - **Band C:** Foreground cap (bottom zone beyond which near-field must not dominate).
    3. Evaluate Tiles 1/3/7/9 against those guides:
       - If a tile shows **too much sky** (crest and/or horizon sits too low): do NOT “pull back”; instead **increase city/terrain mass within the same framing** and allow top clipping if needed.
       - If a tile reads **too zoomed in** (foreground fills bottom): do NOT “push out”; instead reduce near-field dominance and add **midground stacking/occlusion**.
       - If haze causes the horizon to disappear (Tiles 7–9): use **vanishing height** of corridors/roof-fields as the proxy for Band A.
  - Practical checks:
    - **Band A drift check:** horizon/vanishing height should feel consistent tile-to-tile (no tile independently “reframes” upward or downward).
    - **Band B drift check:** Tile 5 must not read “lower” than Tile 3/7 due to extra sky.
    - **Band C push-in check:** no single interchange/roof/foreground object fills the bottom; density must be achieved via repetition + overlap.
  - Enforcement rule:
    - If the sun (Tile 5) or peaks (Tile 1) pressure the top of frame, allow **partial cropping** rather than lifting the framing to accommodate them.
- ***Step 5*** — Re-evaluate Only in Composite Context
  - No tile may be judged or corrected in isolation after anchoring.
  - Validation workflow:
    - Assemble rough composite of tiles 1–3–5–7–9 (no blending).
    - Evaluate:
      - compression continuity
      - skyline alignment
      - spatial force rotation
      - semantic differentiation
    - Decide on regeneration or prompt tuning only after composite review.
- ***Step 6*** — Principle of Minimal Intervention
  - Apply corrections in this order:
    - Structural relationships
    - Element distribution
    - Semantic density
    - Atmospheric behavior
    - Color and texture (last)
  - Avoid:
    - wholesale prompt rewrites
    - averaging tiles toward sameness
    - fixing symptoms instead of causes

***Summary Rule:***
  - If a tile feels wrong, assume the relationship is wrong, not the tile.
  - Correct the system first.

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

---




## Patch Protocol: How to Propose Spec and Prompt Changes

This framework treats image generation as a systems-design problem. As such, modifications must be expressed in a **repeatable, auditable patch format** that can be applied without interpretation.

### Principles

- **Specs are authoritative.** Prompts are execution artifacts generated from specs.
- Prefer **replacing entire sections or paragraphs** over micro-edits.
- Every patch must be **anchored** to a concrete target (file + section header).
- Patch text must be **copy/paste ready** and safe to apply verbatim.
- When conflicts exist between documents, resolve by **authority order**:
  1. `docs/01_core_canonical.md` (global invariants)
  2. `docs/02_00_tile_system.md` (tile system rules)
  3. `docs/02_XX_tile_YY.md` (tile specs)
  4. `docs/12_operational_pipeline.md` (process)
  5. `docs/13_runtime_notes_and_variants.md` (runtime notes, non-canonical)
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

### Example Patch Entry (Template)

- **File:** `docs/02_09_tile_09.md`  
- **Target Section:** `## Key Elements`  
- **Action:** INSERT AFTER `- Distant smog`  
- **With this:**
  ```md
  - **Maximum haze mandate:** Tile 9 must exhibit the strongest atmospheric density in the panorama
  - Visibility collapse: far background should be **nearly erased** into milky smog; skyline edges must not be crisp
  
  


## Review

After editing this document, perform the following validation checks before any image generation or regeneration step.

|  # | Check Category                | What Is Being Verified                                                                 |
| -: | ----------------------------- | -------------------------------------------------------------------------------------- |
|  1 | Section numbering integrity   | No missing numbers, no duplicated numbers, no logical jumps                             |
|  2 | Hierarchy consistency         | Sections, subsections, and sub-subsections follow a stable and predictable depth        |
|  3 | Terminology consistency       | Identical concepts use identical names across all sections                              |
|  4 | Constraint precedence         | Global Constraints always override Tile-level rules without exception                   |
|  5 | Lighting rules coherence      | Sun visibility, direction, diffusion, and exceptions are non-contradictory              |
|  6 | Image dimension math          | All pixel dimensions, orientations, and aspect ratios are internally consistent        |
|  7 | Workflow linearity            | No circular dependencies between workflow steps                                         |
|  8 | Role separation clarity       | ChatGPT and User responsibilities are clearly separated and never overlap               |
|  9 | Tile narrative gradient       | Density, mood, function, and activity evolve strictly from Tile 1 → Tile 9              |
| 10 | Forbidden motif enforcement   | Tile-level forbidden motifs do not contradict global allowances                          |
| 11 | Duplication and redundancy    | No rule is repeated with only minor wording variations                                   |
| 12 | Ambiguity hotspots            | No phrasing allows multiple plausible interpretations by an image model                 |
| 13 | Future extensibility          | Lighting, ambiance, or tile expansion can be added without breaking structure            |
| 14 | Lateral ambiance monotonicity | Warmth, clarity, and contrast never re-emerge after Tile 5                               |
| 15 | Atmospheric identity stability| Cinematic references support the project identity without overriding it                 |
| 16 | Index regeneration validity   | Section index is regenerated if any section title or numbering changes                  |
| 17 | Scale coherence               | Vehicles, buildings, terrain, and infrastructure maintain consistent human-scale relationships across tiles |

> **Rule:** If any check fails, the document must be corrected **before** prompt generation or image regeneration.

---




▣