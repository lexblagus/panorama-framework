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

Responsability: **ChatGPT**

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

Each tertiary tile is generated using its corresponding inter-tile reference image (bridge composite), plus its own R1 map if available.

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

---

### Current directions:

- Remove unnecessary specs (now we have R1)
- Add the R1 pass to the spec (with optional header in prompts)
- Add the R2 passes to the prompts (all except 5)
- Check conversation bellow to define next steps
- Add to concepts:
  - Active calibration layer

Conversation about the multi-pass references (sketches and images):
- **Sun Disk Variant (toggle):** OFF by default; only enable explicitly; if enabled, a visible disk is permitted **only** in **Tile 5 + Central Master** (fully diffused, no hard edge; never reframe to fit).

---
---
---

> The draft sketches you posted are a *very* good idea — they’re basically a “composition control layer” that keeps Tile 5 from snapping back into postcard symmetry while still letting the generator invent details.
> 
> What you’re doing is separating **global invariants** (camera, horizon, skyline envelope, seam safety) from **local intent** (Tile 5 circulation logic + density), and that’s exactly how you get repeatable panorama behavior.
> 
> ## 1) What “dominant” should mean (so rule (d) is enforceable)
> 
> If we want (d) to be something a generator reliably “gets,” “dominant” can be defined as the **single most salient leading structure** by a mix of:
> 
> 1. **Continuity / length**: longest uninterrupted linear feature (street canyon, rail viaduct, river, bridge) running through the image.
> 2. **Contrast**: strongest light–dark edge or luminance contrast line (headlights ribbon, bright pavement strip, specular rail line).
> 3. **Convergence power**: the line that most strongly defines the vanishing-point pull (the “I can’t not look there” perspective corridor).
> 4. **Uniqueness**: if it’s the only line with that behavior, it becomes dominant even if it’s not the brightest.
> 
> So (d) becomes:
> 
> > **No single continuous high-contrast corridor may occupy the central 10% of the frame (x ≈ 45–55%) for more than ~25–30% of the image height.**
> > The center must be “busy texture,” not a privileged flow spine.
> 
> This is better than “no line at x=50%” because it’s robust to small drift and it discourages the generator from creating a centered “super ribbon” even if it’s slightly off-center.
> 
> ### How to express (d) in your sketch language
> 
> In your Tile template (second image), you can literally draw a **vertical “centerline avoid band”** (like you did) and annotate it as:
> 
> * “no longest corridor here”
> * “no brightest traffic ribbon here”
> * “no uninterrupted rail/road canyon here”
> 
> That matches how models interpret line-art control.
> 
> ## 2) Your layered reference idea is solid — here’s the clean way to structure it
> 
> Think in **roles**, not “more references.” Each reference should have exactly one job.
> 
> ### Reference stack (recommended)
> 
> **R0 — Panorama master layout (global)**
> 
> * Like your wide sketch: tile divisions, skyline envelope, horizon, diagonal read, haze/color gradient direction, seam-safe zones.
> * Purpose: keeps the whole project physically coherent.
> 
> **R1 — Tile 5 composition map (local)**
> 
> * The portrait template with sky budget + skyline envelope + edge-safe + centerline-avoid.
> * Add the *Tile 5-specific* circulation logic:
> 
>   * draw **multiple geometric braided corridors** (several avenues + rail lines)
>   * ensure they form the **V read**
>   * add **cross-cuts / overpasses**
>   * ensure major corridors **fade/fragment before seam zones**
> * Purpose: prevents “centered hero avenue” and enforces your maze/V intent.
> 
> **R2 — Tile 5 architectural palette board (style, not layout)**
> 
> * 4–9 small crops/photos showing the *canonical diversity* you want (glass towers + midrise residential + brutalist slabs + older art-deco/neo-gothic blocks), plus realistic material color.
> * Purpose: pushes *non-iconic diversity* without dictating geometry.
> 
> **R3 — Tertiary motif (bridge / station canopy / rail viaduct)**
> 
> * One image max, used as a “detail suggestion,” not a composition anchor.
> * Purpose: ensures the generator includes the *kind* of infrastructure you want, but doesn’t build the whole scene around it.
> 
> That’s it. Four layers is already plenty.
> 
> ## 3) How to actually “compose” multiple references without them fighting
> 
> This depends on your toolchain, but the principle is universal:
> 
> ### Keep geometry refs “clean” and style refs “messy”
> 
> * **R0/R1** should be simple line art / grayscale, high signal, low ambiguity.
> * **R2/R3** can be photographic, but should be treated as *soft influence*.
> 
> ### Prevent the tertiary bridge from becoming a hero
> 
> * Don’t place it centrally in any ref.
> * If you’re using any system with weights: **low weight** for R3.
> * In the Tile 5 sketch (R1), represent bridges as **short segments** crossing corridors, not one huge span.
> 
> ### One reference = one constraint
> 
> If a reference contains *both* layout *and* style, models often overfit and you get “poster composition.” Your drafts are good because they’re almost purely layout rules.
> 
> ## 4) How I’d evolve your Tile 5 sketch (without prompting yet)
> 
> Based on your agreement + desire for crisp:
> 
> * Keep **centerline avoid band** as-is.
> * Draw the “V” using **two offset corridor bundles**, but build each bundle from **several parallel/adjacent lines** so it’s not “two hero avenues.”
> * Add **perpendicular cross-cuts** every few “blocks” so nothing becomes a clean uninterrupted ribbon.
> * In the left/right edge-safe zones, deliberately draw **texture-only** (short street fragments, rooftops, small alleys) and label:
> 
>   * “no uninterrupted major corridor exits here”
>   * “no landmark tower clipped here”
> 
> ## 5) Quick sanity test for “dominance” (later, when we generate)
> 
> When you squint at a result:
> 
> * If your eye locks onto **one bright continuous vertical ribbon** → fail (it’s dominant).
> * If you see **multiple competing paths** and the center feels “busy but not directional” → pass.
> * If the skyline has **one obvious tallest spire** → fail (hero).
> * If there are **3–6 comparable peaks** → pass (distributed hierarchy).
> 
> ---
> 
> If you want the next step *before* writing prompts, we can turn your Tile 5 sketch into a more explicit “control map” by adding only three extra annotations: **(1) V corridor bundles, (2) seam fade zones, (3) center dominance ban** — still minimalist, but unambiguous.
> 
> 
> Sanity check: you’ve got the **right overall structure**, but I’d tweak one piece so Tile 5 doesn’t “infect” the others with the very thing we’re trying to remove (centered hero/axis).
> 
> ## 1) Your stack, validated (with one recommended adjustment)
> 
> ### ✅ R1 (per-tile sketch drafts)
> 
> * **Tile 5**: used to be “freehand”; now it gets an **R1 composition sketch** (centerline-avoid band, V circulation, seam-safe edges, skyline envelope, etc.).
> * **All tiles 1–9**: each gets its own **R1**.
>   This is the big win: geometry intent is explicit per tile.
> 
> ### ⚠️ R2 (Tile 5 as reference for all other tiles)
> 
> Your idea is coherent in spirit (shared “anchor”), but using **the full Tile 5 image** as R2 for every other tile is risky because it can accidentally transfer:
> 
> * the “poster energy” (even after we fix it),
> * a specific skyline rhythm,
> * any residual central corridor bias,
> * lighting/exposure quirks that don’t belong everywhere.
> 
> **Recommended adjustment:** instead of “Tile 5 image = R2”, make **R2 = a style/palette anchor derived from Tile 5**, e.g.:
> 
> * a **mosaic/board** of 6–12 crops from Tile 5 (materials, windows, rooftops, street texture, sky tone), **excluding** the main corridor region and excluding any hero silhouettes; or
> * a small **color/material palette board** + 1–2 neutral city texture refs.
> 
> That keeps coherence (color + material realism + micro-detail) without importing Tile 5’s layout.
> 
> If you still want “Tile 5 as R2,” do it **low-weight** and ideally as **cropped** references (rooftops/facades), not the full frame.
> 
> ### ✅ R3 (bridges for tertiary tiles 2/4/6/8)
> 
> Yes — that’s a clean way to sprinkle recurring motifs without turning bridges into a pan-wide theme.
> Rule of thumb: R3 should be **detail-only**, not a composition anchor.
> 
> ---
> 
> ## 2) “How is that going to work?” Two viable workflows
> 
> This depends on whether your generator supports **multiple references with weights** (and how controllable it is). Conceptually you have two options:
> 
> ### Option A — Feed them all at once (single prompt + multi-ref)
> 
> Best when you can control weights.
> 
> **Per tile input stack (recommended weighting order):**
> 
> 1. **R1 sketch (strongest)** = composition + seam logic + centerline avoid
> 2. *(Optional but powerful)* **Adjacent-tile edge crops** (medium) = seam continuity
> 3. **R2 style/palette** (low–medium) = materials + color realism + micro-detail
> 4. **R3 bridge** (low) = “include a bridge-like element,” not “build around bridge”
> 
> Why this works: it mirrors the constraint hierarchy we care about:
> **geometry > seam safety > style > motifs.**
> 
> Risk: too many refs can “fight.” The fix is weighting + keeping R2/R3 non-compositional.
> 
> ### Option B — Staged / iterative (2–3 generations)
> 
> Best when your tool can’t reliably juggle multiple refs, or when it keeps snapping back to hero compositions.
> 
> A good staged approach for your case:
> 
> **Stage 1 (layout lock):**
> 
> * Use **R1 only** (and optionally adjacent edge crops).
>   Goal: nail V-circulation, centerline-avoid, seam quietness, skyline envelope.
> 
> **Stage 2 (style lock):**
> 
> * Take Stage-1 result as base (img2img / refine) and add **R2 style/palette**.
>   Goal: unify color/material realism across tiles without changing geometry.
> 
> **Stage 3 (tertiary motif, only if needed):**
> 
> * Add **R3 bridge** with very low influence so it appears as a minor element.
> 
> Why I like this: it prevents style references from re-writing your composition.
> 
> Downside: each extra stage can introduce drift/artifacts if “denoise” (or equivalent) is too high. So if you stage, keep it **2 stages by default**, use Stage 3 only when the motif refuses to appear.
> 
> ---
> 
> ## 3) What I’d recommend for *your* plan (given Tile 5 is being de-iconified)
> 
> * **Generate Tile 5 first** with **R1 strongest**, no sun disk, V-braided corridors, crisp realism, seam-safe edges.
> * From the successful Tile 5, build **R2 as a “style/palette board”** (crops/mosaic).
> * Then for Tiles 1–9:
> 
>   * Always use **their own R1** (strong)
>   * Use **R2 palette** (low–medium)
>   * For tiles 2/4/6/8 add **R3 bridge** (low)
>   * If you can: add **adjacent-tile edge strips** (medium) for seam continuity (this is the missing piece that usually makes stitching “click”).
> 
> ---
> 
> If you tell me what generator/workflow you’re using (MJ, SDXL+ControlNet, DALL·E editing, etc.), I can translate this into a concrete “inputs + weights + stages” recipe — but conceptually, yes: your layered reference approach is sound, and the main refinement is to make **R2 a style board derived from Tile 5** rather than the whole Tile 5 frame.

---
---
---

### Past ideas (1):

After activity 1 (done) on next section were done, the new generate preview gave some new directions:

1. Decide “Crisp Variant” (haze policy) + Color Ladder (explicit grade per tile)
1. Activity #2: Rework Tile 5 to reduce iconicity + bezel behavior (this is your biggest stabilizer)
1. Re-derive Tile 7 under the new ladder (likely cooler/neutral and less iconic)
1. Then build tertiaries with bridges (2/4/6/8) and run optional seam-refine passes where needed
1. Reintroduce Carrara as centered feature in 8 (or 7), not on a seam

---

### Past ideas (2):

Summary of recommendedations:

> 1. ~~**Camera rig + zoom discipline** (global prompt pattern + ops rule)~~ (done)
> 1. **Tile 5 normalization + bezel-safe avenue redesign** (new ruler)
> 1. **Tile 7 recalibration** (more residential + embedded tech nodes)
> 1. **Tile 6 definition** (bridge 5→7)
> 1. **Tile 8 Carrara stitch polish** (using slice reference)
> 1. **Tile 9 squared shoreline polish**
> 1. **Tile 1 revisit**
> 
> #### ~~1) Lock the camera rig and kill the zoom drift~~ (done)
> 
> This is the highest-leverage fix. If zoom/pitch drifts, every seam becomes “manual luck.”
> 
> **Changes**
> 
> * Add a **Camera Lock block** to every tile prompt (like you did for Tile 8):
>   “diagonal-oblique aerial (not top-down), do not zoom in, do not change apparent altitude/scale, keep skyline band consistent, no extra sky, cropping allowed.”
> * Operational rule: when generating a tile, attach **only**:
> 
>   * Ref A = Tile 5 ruler
>   * Ref B (optional) = seam crop from neighbor tile
>     (No extra candidate images in the same run.)
> 
> **Why first:** it makes every subsequent iteration cheaper and more predictable.
> 
> #### 2) Rework Tile 5 (because it’s the ruler + it’s too iconic + bezel issue)
> 
> If Tile 5 stays iconic, the entire panorama will look like “Tile 5 and then another project.” Also: since it’s the ruler, any mismatch propagates.
> 
> **Changes**
> 
> * **Remove/avoid visible sun disk** (keep golden-hour light feel but no sun).
> * Reduce landmark recognizability:
> 
>   * More generic skyline, less “one tall hero spire.”
>   * Slightly more haze/atmospheric diffusion (still the clearest tile, but not “poster shot”).
> * **Break the centered vertical avenue**:
> 
>   * Replace with **braided corridors**: 2–3 main avenues offset from center, merging/splitting, slight S-curves.
>   * Add cross-cuts and overpasses to make it “maze-like” (your bezel constraint).
> * Add a hard rule: **no strongest line exactly at x=50%** of the frame.
> 
> **Why second:** it stabilizes the “source of truth” for the entire rig.
> 
> #### 3) Recalibrate Tile 7 so it’s not “too close to Tile 9”
> 
> You already have Tile 8–9 perfect. The weak link is the *bridge* tile.
> 
> **Target for Tile 7**
> 
> * Increase **residential massing** (big repetitive blocks) so it reads like “population support zone” rather than “pure logistics”.
> * Keep logistics, but shift it to **embedded service-tech nodes** (charging yards, rail maintenance depots, substations, conveyor galleries) instead of container-yard/port-adjacent vibes.
> * Atmosphere: **less collapsed than Tile 8/9**, but clearly trending that way.
> 
> **Why third:** it creates “space” for Tile 8 to feel like escalation instead of repetition.
> 
> #### 4) Define Tile 6 as the *real* bridge between Tile 5 and Tile 7
> 
> Your question “how to describe Tile 6 to fit Tile 7” is spot-on. Tile 6 should be the **dampener**: it pulls Tile 5 out of “icon shot” and prepares the logistics/utility language of Tile 7.
> 
> **Tile 6 direction (practical)**
> 
> * Mixed urban density + heavy circulation + early service infrastructure
> * Fewer “hero” compositions; more “systems city”
> * Add mid-scale utility complexity (substations, maintenance yards, stacked flyovers), but **no heavy industry**
> * Atmosphere: slightly more haze than Tile 5, less than Tile 7
> 
> **Why now:** once Tile 5 is normalized, Tile 6 becomes much easier to tune and will improve the whole mid-strip continuity.
> 
> #### 5) Carrara in Tile 8: solve stitchability with seam discipline + slice reference
> 
> Carrara is a win. Stitch issues are solvable.
> 
> **Changes**
> 
> * Keep Carrara ridge **center-left**, not near the right seam.
> * Always use **Tile 9 left-edge crop** (industry-only, no water) as Ref B.
> * Add composition lock: **rightmost 20–25% stays generic refinery texture** (no hero ridge face, no dominant diagonal conveyor).
> * If needed: use “edit pass” technique on a stitchable base image to push Carrara detail without changing camera.
> 
> **Why later:** because once camera + Tile 7 are stable, Carrara becomes a controlled variant instead of destabilizing the bridge.
> 
> #### 6) Refine Tile 9 channel into a more squared engineered shoreline
> 
> This is a polish task, but easy and worthwhile.
> 
> **Changes**
> 
> * Explicitly demand: **rectilinear embankments**, dock walls, squared-off basins, straight quay edges, gridded piers.
> * Forbid organic river meanders.
> * Keep ships if you like them (Tile 9 identity), but avoid “storybook harbor” composition.
> 
> **Why later:** it doesn’t unblock anything; it’s refinement.
> 
> #### 7) Optional: revisit Tile 1 composition
> 
> Only do this after the camera rig is fully unified and Tiles 5–9 are stable.
> 
> Ideas: Fiords and sea. Cliff houses. Only riches can reach the edges.
> 
> **Why last:** it’s upstream but doesn’t currently break your strongest seam chain.

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
