# Operational Pipeline

This file defines how humans and models interact over time.

- [Image dimensions](#image-dimensions)
- [Prompt Compilation Contract](#prompt-compilation-contract)
  - [Compiled Prompt Rule](#compiled-prompt-rule)
  - [Delimiters](#delimiters)
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

All generated prompts must be **copy/paste ready** with **no user thinking**.

### Compiled Prompt Rule

The **compiled prompt** is the exact concatenation of:

1) The tile’s **Uploads / Inputs** lines (imperative, user-facing)
2) The tile’s **Reference Use Policy** lines (imperative, user-facing)
3) The tile’s **Lock / Preserve** lines (if any, imperative)
4) The tile’s **Generator Prompt** block (the scene spec)
5) The tile’s **Output** line(s)

No other sections are assumed. If a behavior must happen, it must appear in (1–5).

### Delimiters

Each compiled prompt must be emitted as a **single continuous Markdown blockquote**.

- Every line of the compiled prompt must begin with `> ` (greater-than + space).
- Blank lines inside the prompt must be represented by a standalone `>` line.
- The compiled prompt begins at the **first** `> ` line and ends at the **last** `> ` line of that block.
- No prompt-relevant instructions may exist outside the blockquote.

### Multi-pass Requirement

If `## Generation Passes` exists, then **each pass must include its own full compiled prompt** (items 1–5 above), and must be labeled:
- `### Pass N prompt: (pass description, if exists)`

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
- Generate NanoBanana specs and prompts?
- Run a general rview: long time that is not done.

---

### Current directions:

After activity 1 (done) on next section were done, the new generate preview gave some new directions:

1. Decide “Crisp Variant” (haze policy) + Color Ladder (explicit grade per tile)
1. Activity #2: Rework Tile 5 to reduce iconicity + bezel behavior (this is your biggest stabilizer)
1. Re-derive Tile 7 under the new ladder (likely cooler/neutral and less iconic)
1. Then build tertiaries with bridges (2/4/6/8) and run optional seam-refine passes where needed
1. Reintroduce Carrara as centered feature in 8 (or 7), not on a seam

---

### Past ideas:

Summary of recommendedations:

1. ~~**Camera rig + zoom discipline** (global prompt pattern + ops rule)~~ (done)
1. **Tile 5 normalization + bezel-safe avenue redesign** (new ruler)
1. **Tile 7 recalibration** (more residential + embedded tech nodes)
1. **Tile 6 definition** (bridge 5→7)
1. **Tile 8 Carrara stitch polish** (using slice reference)
1. **Tile 9 squared shoreline polish**
1. **Tile 1 revisit**

#### ~~1) Lock the camera rig and kill the zoom drift~~ (done)

This is the highest-leverage fix. If zoom/pitch drifts, every seam becomes “manual luck.”

**Changes**

* Add a **Camera Lock block** to every tile prompt (like you did for Tile 8):
  “diagonal-oblique aerial (not top-down), do not zoom in, do not change apparent altitude/scale, keep skyline band consistent, no extra sky, cropping allowed.”
* Operational rule: when generating a tile, attach **only**:

  * Ref A = Tile 5 ruler
  * Ref B (optional) = seam crop from neighbor tile
    (No extra candidate images in the same run.)

**Why first:** it makes every subsequent iteration cheaper and more predictable.

#### 2) Rework Tile 5 (because it’s the ruler + it’s too iconic + bezel issue)

If Tile 5 stays iconic, the entire panorama will look like “Tile 5 and then another project.” Also: since it’s the ruler, any mismatch propagates.

**Changes**

* **Remove/avoid visible sun disk** (keep golden-hour light feel but no sun).
* Reduce landmark recognizability:

  * More generic skyline, less “one tall hero spire.”
  * Slightly more haze/atmospheric diffusion (still the clearest tile, but not “poster shot”).
* **Break the centered vertical avenue**:

  * Replace with **braided corridors**: 2–3 main avenues offset from center, merging/splitting, slight S-curves.
  * Add cross-cuts and overpasses to make it “maze-like” (your bezel constraint).
* Add a hard rule: **no strongest line exactly at x=50%** of the frame.

**Why second:** it stabilizes the “source of truth” for the entire rig.

#### 3) Recalibrate Tile 7 so it’s not “too close to Tile 9”

You already have Tile 8–9 perfect. The weak link is the *bridge* tile.

**Target for Tile 7**

* Increase **residential massing** (big repetitive blocks) so it reads like “population support zone” rather than “pure logistics”.
* Keep logistics, but shift it to **embedded service-tech nodes** (charging yards, rail maintenance depots, substations, conveyor galleries) instead of container-yard/port-adjacent vibes.
* Atmosphere: **less collapsed than Tile 8/9**, but clearly trending that way.

**Why third:** it creates “space” for Tile 8 to feel like escalation instead of repetition.

#### 4) Define Tile 6 as the *real* bridge between Tile 5 and Tile 7

Your question “how to describe Tile 6 to fit Tile 7” is spot-on. Tile 6 should be the **dampener**: it pulls Tile 5 out of “icon shot” and prepares the logistics/utility language of Tile 7.

**Tile 6 direction (practical)**

* Mixed urban density + heavy circulation + early service infrastructure
* Fewer “hero” compositions; more “systems city”
* Add mid-scale utility complexity (substations, maintenance yards, stacked flyovers), but **no heavy industry**
* Atmosphere: slightly more haze than Tile 5, less than Tile 7

**Why now:** once Tile 5 is normalized, Tile 6 becomes much easier to tune and will improve the whole mid-strip continuity.

#### 5) Carrara in Tile 8: solve stitchability with seam discipline + slice reference

Carrara is a win. Stitch issues are solvable.

**Changes**

* Keep Carrara ridge **center-left**, not near the right seam.
* Always use **Tile 9 left-edge crop** (industry-only, no water) as Ref B.
* Add composition lock: **rightmost 20–25% stays generic refinery texture** (no hero ridge face, no dominant diagonal conveyor).
* If needed: use “edit pass” technique on a stitchable base image to push Carrara detail without changing camera.

**Why later:** because once camera + Tile 7 are stable, Carrara becomes a controlled variant instead of destabilizing the bridge.

#### 6) Refine Tile 9 channel into a more squared engineered shoreline

This is a polish task, but easy and worthwhile.

**Changes**

* Explicitly demand: **rectilinear embankments**, dock walls, squared-off basins, straight quay edges, gridded piers.
* Forbid organic river meanders.
* Keep ships if you like them (Tile 9 identity), but avoid “storybook harbor” composition.

**Why later:** it doesn’t unblock anything; it’s refinement.

#### 7) Optional: revisit Tile 1 composition

Only do this after the camera rig is fully unified and Tiles 5–9 are stable.

Ideas: Fiords and sea. Cliff houses. Only riches can reach the edges.

**Why last:** it’s upstream but doesn’t currently break your strongest seam chain.

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
