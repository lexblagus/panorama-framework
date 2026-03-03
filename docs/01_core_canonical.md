# Core Canonical

This file defines physics of the universe.

- [Overview](#overview)
- [Subject](#subject)
- [Concepts](#concepts)
- [Central Master Reference](#central-master-reference)
- [Global Constraints](#global-constraints)
  - [Lighting](#lighting)
    - [Constraints](#constraints)
    - [Lateral ambiance gradient](#lateral-ambiance-gradient)
    - [Industrial lighting](#industrial-lighting)
  - [Color & Texture](#color--texture)
  - [Air / Depth](#air--depth)
  - [Photographic Realism](#photographic-realism)
  - [Camera & Optics](#camera--optics)
  - [Composition and camera flow](#composition-and-camera-flow)
  - [Stitching](#stitching)
  - [Architectural Language](#architectural-language)
    - [Avoid](#avoid)
    - [Buildings and constructions](#buildings-and-constructions)
  - [Vehicles](#vehicles)
  - [Roadway Circulation Consistency](#roadway-circulation-consistency)
  - [Anti-Repetition Rules](#anti-repetition-rules)

## Overview

Create a large-scale, ultra-wide cityscape wallpaper composed of **9 portrait-oriented tiles**, manually stitched in Affinity Photo. The result must feel like a **single continuous megacity**, photographed in one coherent late-afternoon moment, with strong realism, atmospheric depth, and architectural diversity.

The panorama is governed by a **lateral ambiance gradient**: lighting color temperature, color filtering, and contrast/clarity evolve progressively from left to right across the tiles (no atmospheric veil/blanket). The scene transitions from clean, neutral daylight on the far left, through a warm amber core at the center, and into cool bluish-gray industrial filtering on the far right (high visibility; no milky diffusion blur). This lateral progression is intentional, monotonic, and must never reverse.

This project does not present a moral progression from nature to city. Instead, nature, human systems, and industry are treated as distinct but equally complex forms of chaos, each governed by different rules, scales, and pressures.

The project explores *virtual photography*: a collaboration where AI handles image generation and continuity, while the human performs editorial judgment, compositional control, stitching, and final finishing.

This document is the **single source of truth** for restarting the project in a blank-context environment.

---




## Subject

The panoramic narrative logic:

- Goes from left to right, where **density rises toward the center** which acts as the visual and narrative anchor (Tile 5).
- **Functional shift:** dominant natural systems (chaotic, terrain-led) ↔ selective human systems (proto-infrastructure, access-driven) ↔ dense urban order ↔ industrial systems (mechanical chaos).
- **Emotional arc**: calm → anticipation → awe → intensity → mechanical dominance.
- **Atmospheric arc (lateral)**: clarity → warmth → saturation → mechanical dominance (high visibility retained; no atmospheric veil/blanket).

Despite cinematic references used as emotional calibration, the cityscape must retain its own architectural and atmospheric identity. The goal is not stylistic imitation, but believable urban evolution captured in a single photographic moment.

![Tiling compilation preview](../outputs/generated/008-51h-composition-preview.png)

_↳ preview as single 4:3 image (to be heavilly wided in the final composition)_

---



## Concepts
This section defines project-specific terminology for clarity. It introduces no new constraints and does not override any section above.

| Term | Meaning in This Project |
|---|---|
| Central Master Reference Image | A single landscape-format image defining the architectural DNA, lighting peak, and atmospheric ceiling for the entire panorama. |
| Tile | One portrait-oriented segment of the panorama, generated independently but constrained to behave as part of a continuous photographic system. |
| Pivot Tile | A tile (1, 5, 9) generated early to establish narrative extremes and compositional anchors. |
| Secondary Tile | Transitional tiles (3, 7) mediating between pivot tiles. |
| Tertiary Tile | Stitching-support tiles (2, 4, 6, 8) generated using inter-tile references. |
| Lateral Ambiance Gradient | The strictly monotonic evolution of light, color, and atmosphere from Tile 1 to Tile 9. |
| Proto-infrastructure | Singular, access-driven human interventions embedded in terrain (e.g. dams, tunnels, funiculars), non-repetitive and non-industrial. |
| Industrial Infrastructure | Repetitive, system-based constructions oriented toward production, logistics, or energy, dominant only in Tiles 8–9. |
| Anchored Prompt | A prompt whose concept is fixed and stable, but may still receive minor tuning. |
| Locked Prompt | A production-ready prompt that must be reproducible across sessions and chats. |
| Negotiated Terrain | A condition where human structures adapt to terrain constraints rather than imposing grids or systems. |
| Architectural Relatives | Buildings that share typological lineage without being visually identical. |
| Equilibrium Tile | Tile 5; the point of maximum density, warmth, and atmospheric pressure in the panorama. |
| Safe Stitch Zone | A visually quieter edge region designed to allow continuity with adjacent tiles. |
| Industrial Terminus | Tile 9’s role as the farthest functional extreme, where logistics/industry dominate with cool desaturation (high visibility; no atmospheric veil/blanket). |
| Seam | The boundary region where two adjacent tiles meet (e.g., 1↔2). Seams must remain stitchable via generic edge texture, safe stitch zones, and continuity references when needed. |
| Framing Stability Protocol | The spec doctrine for preventing “zoom / skyline height / sky share drift.” It treats drift as framing physics and enforces stability via Tile 5 as ruler + reference conditioning (not numeric band targets). |
| Ruler | The reference authority used to stabilize perceived framing physics across tiles. In this framework, Tile 5 is the ruler (telephoto feel, vertical pressure, sky budget, vanishing-height read). |
| Pressure (Vertical Pressure) | How much the scene “fills” the portrait frame: apparent altitude/scale + telephoto compression + how close dominant mass sits to the top edge. Higher pressure reads as denser/taller with less open sky. |
| Sky Budget | The disciplined allowance of visible sky. If sky feels “too open,” the fix is adding mass + distance rolloff inside the same framing, not lifting/recentering the camera. |
| Vanishing-height read | The perceived band where distance collapses and parallel structure fields converge (roof-fields/corridors), used as a proxy for horizon physics when the true horizon is low-contrast. |
| Seam Anchor | A one-sided edge crop reference from a neighbor tile used to condition a single seam (continuity of silhouette height profile, distance-contrast rolloff language, edge texture density). |
| Bridge Reference Image (Bridge Composite) | A 3-panel inter-tile reference used to lock both adjacent edges at once: (right crop of left tile) + (transparent center) + (left crop of right tile). |
| Band targets (Numeric band targets) | A rejected method of enforcing framing via numeric vertical bands (e.g., “horizon must sit between X–Y%”). This framework explicitly does not use numeric band targets; it uses reference conditioning instead. |
| Camera Lock | A promptable “must-not drift” block that encodes the Framing Stability Protocol into generator instructions (no zoom, no pitch drift, no extra sky; cropping allowed). |

---

## Central Master Reference

![Central Master Reference](../outputs/generated/008-53c-master.png)

Why have a Central Master Reference at all? World identity consistency (the “DNA”):

- architectural family language (window density, roof clutter, material palette)
- how air clarity + distance rolloff behaves (even if crisp, the distance rolloff style)
- what “photorealistic” means in this world (micro-contrast, noise, tonemapping vibe)
- how dense the “city fabric” looks when it’s not industrial or coastal

This is what the Central Master is for: a single “world bible” image.

---

## Global Constraints

These apply to every image generated.


### Lighting

- Golden hour, late afternoon to early sunset.
- The panorama follows a strictly monotonic lateral ambiance gradient, where lighting behavior evolves progressively from Tile 1 to Tile 9. This progression is encoded through explicit changes in light temperature, diffusion, contrast, and atmospheric filtering, and must never reverse or oscillate.

#### Constraints

- Scene remains bright; no night lighting.
- No dark foregrounds.
- Long shadows consistent with sun position.

- Consistent sun direction across all tiles:
  - Tiles 1–4: light coming from the right
    - **Shadow-fall enforcement:** primary cast shadows fall to the **left**
    - **Highlight-side enforcement:** right-facing planes are consistently brighter
  - Tile 5: centered / frontal diffusion
    - Shadows are minimal / symmetric and must not imply a strong left/right key
  - Tiles 6–9: light coming from the left
    - **Shadow-fall enforcement:** primary cast shadows fall to the **right**
    - **Highlight-side enforcement:** left-facing planes are consistently brighter

- If an image’s shadow-fall contradicts the specified direction, the image is invalid and must be regenerated.
- Do **not** rely on horizontal mirroring to “fix” light direction; mirroring breaks shadow logic.

#### Lateral ambiance gradient

- **Tiles 1–2:** Neutral daylight, minimal warmth, clean air, high clarity.
- **Tiles 3–4:** Gradual warm-up toward amber tones; keep visibility high (no atmospheric veil/blanket).
- **Tile 5:** Peak amber saturation, maximum warm diffusion (not a blur veil).
  The solar disk may appear **only here** (and in the Central Master Reference Image), partially visible and fully diffused with no hard edge. The solar disk may appear unnaturally large relative to real-world scale, reading as an atmospheric phenomenon rather than a literal sun. Its edge must remain fully diffused, dissolved into soft diffusion, with no hard boundary.
  **Default production behavior:** do **not** show a visible sun disk. Treat the disk as a **controlled variant** that must be explicitly enabled for Tile 5 / Central Master only.
- **Tiles 6–7:** Warmth decreases progressively, contrast softens; visibility remains high (no atmospheric veil/blanket).
- **Tiles 8–9:** Cool-biased, bluish-gray industrial filtering with high visibility (no milky diffusion blur; edges remain crisp).

#### Industrial lighting

**As an exception for Tiles 8–9 only**, extremely subtle artificial lighting may be faintly perceptible under daylight conditions. These lights must be strictly functional and industrial in nature (plant/chimney safety lights, infrastructure beacons, interior factory glow), subordinate to natural light, and must not create new focal points, alter time of day, or read as “the city turning on.”


### Color & Texture

- Color palette must interpolate laterally across tiles, aligned with the lighting gradient.
- Warmth and saturation **increase toward Tile 5** and **decrease after it**.
- After Tile 5, warmth must not return.

Color characteristics:
- Tiles 1–2: vivid but neutral daylight colors.
- Tiles 3–5: warm ambers, soft oranges, solarized contrast.
- Tiles 6–9: progressive desaturation / cooler filtering toward bluish-gray tones (no atmospheric veil/blanket; no milky diffusion blur).

Texture rules:
- Realistic but subtle dirt, wear, stains, and imperfect material variation.
- Uneven coloration and aging materials.
- Slight sensor noise (not painterly grain).
- No “AI polish”, no crystalline artifacts.
- Avoid hyper-polished or overly clean surfaces.
- Sharp midground, softened far distance.

Color and texture behavior is laterally encoded and bound to tile position. Warmth, chromatic saturation, and local contrast must increase progressively toward Tile 5 and decrease progressively afterward. After Tile 5, warmth, saturation, and contrast must not reappear, spike, or locally intensify, even in foreground elements. Texture variation may increase toward the right, but must do so through desaturation, grime, and atmospheric filtering rather than contrast recovery or color richness.


### Air / Depth

Air behavior evolves along **two independent axes**:

- **Depth axis (foreground → background):**  
  distance rolloff increases subtly with distance via desaturation + contrast reduction; far distance may soften slightly but remains readable (no atmospheric veil/blanket).
- **Lateral axis (Tile 1 → Tile 9):**  
  color filtering cools/desaturates toward the right; visibility remains high (no milky diffusion blur).

Additional rules:
- Far skyline may soften slightly with distance but must not dissolve into a uniform obscuring layer; the horizon remains legible.
- Wind direction is laterally consistent across all tiles and must not reverse.
- Wind affects smoke, dust/aerosols, steam, and cloud deformation. On industrial/right-side tiles, smoke/steam drifts laterally as specified.

Along the lateral axis (Tile 1 → Tile 9), distance rolloff pressure may increase strictly cumulatively and monotonically, but must never be implemented as a uniform “blanket endpoint.”
Achieve the rightward mood via cooler/desaturated filtering, grime/texture, industrial density, and stronger distance rolloff—never via a scene-wide veil.
Variations may occur only along the depth axis (foreground → background), never as lateral reversals.


### Photographic Realism

* Photorealistic
* Crisp geometry
* Natural photographic sharpness
* High micro-contrast on building edges
* Less “trashed” than heavy urban decay references, but clearly not sterile or artificial.


### Camera & Optics

- Elevated aerial viewpoint, realistic drone or rooftop height
- Broad city coverage without exaggerated wide-angle distortion
- Rectilinear optics only
- Perspective should feel compressed, as if shot from a longer focal length
- Telephoto-like depth compression (objects stack densely, distance feels shortened)
- No fisheye, no barrel distortion, no extreme perspective stretching
- Consistent horizon physics across all tiles
- Slightly off-axis framing (imperfect, human vantage)
- Human-scale streets and believable building proportions

**Shared rig invariants**
- The virtual camera height, pitch, horizon line, and vertical framing are fixed and shared across all tiles.
- No tile may independently reframe or vertically recenter the composition.
- Cropping of dominant elements is permitted; camera rebalancing is not.
- Vertical reframing or recentering to emphasize the sun, skyline, or focal elements is **forbidden**.
- Cropping of dominant elements (sun, towers, clouds) is acceptable and preferred over vertical reframing.

**Framing stability protocol (no numeric bands)**
- Treat vertical drift as camera pitch drift.
- Enforce stability via **reference conditioning** (Tile 5 as ruler), cropping/clipping over lifting framing, and fixing “too much sky” by adding mass inside the same framing.
- See: _docs/02_00_tile_system.md → Framing Stability Protocol (Reference-Conditioned, No Bands)_.

#### Camera Lock (Promptable Block, v1)
This block is the generator-facing encoding of the framing stability protocol and is intended to be compiled into prompts when needed.

- Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
- Maintain a coherent rectilinear rig: **two-point perspective** implied along the horizon; keep vanishing behavior consistent.
- **Verticals remain straight** (no keystone exaggeration).
- Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
- Keep the skyline/horizon/vanishing-height band consistent with the shared rig; do not tilt or pitch-shift the camera.
- No vertical recentering to “fit” towers, peaks, smoke, or mood. Cropping/clipping is allowed; lifting framing is not.
- Do NOT add extra sky. If sky feels open, add midground mass + stronger internal distance rolloff within the same framing (no reframing).
- Avoid near-field dominance (no single foreground slab/interchange filling the bottom). Build depth via midground stacking/overlap.

### Composition and camera flow

Major linear elements (rivers, avenues, rail lines, infrastructure corridors) should follow a panorama-wide directional bias to reinforce camera flow and avoid mirrored or cloned compositions.

- **Tile 1** may exhibit strong vertical massing or cliff dominance on one side of the frame, provided the opposing edge remains visually quieter to allow stitching continuity.
- **Tiles 1–4:** diagonal bias bottom-right → top-left.
- **Tile 5:** vertical / central axis
- **Tiles 6–9:** diagonal bias bottom-left → top-right

Distance rolloff and industrial clutter may partially soften or break up linear elements in Tiles 7–9, reinforcing the visual termination of the panorama.

This is a compositional preference, **not a mandatory feature**.
Tiles may contain **no dominant linear element**.


### Stitching

Edges must feel naturally incomplete, obscured by terrain, streets, buildings, tunnels, overlap, or curvature. No large linear elements touching left or right edges. This applies even if tiles are regenerated.

* Linear elements (rivers, railways, highways, avenues, infrastructure) may:
  * Enter from bottom or top
  * Fade, curve, fragment, dissolve or terminate internally
* They must not:
  * Start or end cleanly at left or right edges
  * Run parallel and uninterrupted into side edges


### Architectural Language

![Architectural language reference](../outputs/generated/008-54b-architectural-language.png)

General constrains:

* Architecture must appear in **quantity and variety**, not as isolated landmarks.
* Older buildings intermixed with modern and hybrid structures (mixed eras)
* Realistic construction logic
* No sci-fi, no fantasy
* Slight wear and imperfection
* Proto-infrastructure is permitted across the panorama where terrain, geography, or access conditions remain visually dominant. Such elements include dams, tunnels, rail cuts, funiculars, cliff elevators, viaducts, or carved mountain roads. These interventions must be singular, embedded, and access-driven, never repetitive, networked, or suggestive of industrial production, logistics, or systemic efficiency.

#### Avoid:

* A single dominant element
* Repeated rooftop silhouettes
* Landmark-centric compositions

#### Buildings and constructions

Infrastructure elements to spread across tiles — following tile theme — such as stadiums, tram lines, elevated subways, and rail hubs should appear sporadically across appropriate tiles as secondary features, partially obscured, never centered, and never emphasized as landmarks.

- Tall modern towers near the core
- Modern glass towers (varied heights, reflective)
- Dense mid-rise residential buildings (5–30 floors)
- Brutalist concrete residential and office blocks
- Gothic, neo-gothic, and art-deco historic and commercial buildings
- Ground-floor commerce scattered everywhere
- Train and subway stations of mixed eras
- Occasional water towers near residential area
- Occasional large or small stadium near residential area:
  - Never dominant, never centered, never monumental
- Occasional civic or historical statues:
  - Human-scale to maximum ~2× scale
  - Weathered, non-iconic
  - Integrated into plazas, medians, parks, or civic spaces
  - Never dominant, never centered, never monumental
- Infrastructure elements appearing in non-industrial tiles must read as negotiated insertions into terrain rather than systems. Repetition, standardization, or visual rhythm implying logistics or production is forbidden outside Tiles 8–9.


### Vehicles

![Vehicles reference](../outputs/generated/008-54b-vehicles.png)

- Realistic scale (no stretched limousines)
- Mixed eras: modern, boxy older cars, rounded vintage cars
- Buses and small trucks allowed
- Traffic density varies by tile
- Modern trams and subways on left and center; old cargo trains and large trucks on right (industrial mood)
- Rail vehicles in non-industrial tiles (Tiles 1–3) must remain proto-infrastructural: low-profile, scale-respectful, and access-oriented. Trains define scale through length, repetition, and partial visibility, never through bulk or height.
- **Heavy logistics vehicle diversity (Tiles 7–9 only):** Tiles **7–9** should show a varied, realistic logistics fleet (diversity > volume), distributed across roads/yards (not a traffic jam). Include a mix of:
  - tarp-covered cargo trucks in muted orange/brown tones (new + weathered; mixed cab-over and conventional where plausible)
  - fuel/gas tanker trucks and tanker trailers
  - **tandem-axle rigid trucks** (3-axle rigid / “trucado” style) + other rigid box trucks
  - semi-trucks / articulated lorries with box trailers, flatbeds, and **container chassis**
  - **road trains / multi-trailer trucks** (“treminhão” style), occasional (not dominant)
  - optional additional variety: dump trucks, concrete mixers, car carriers, lowboy/heavy-haul trailers (sparingly)
  - keep cars/buses present as minor scale cues; avoid repetition of identical vehicles
- **Non-logistics tiles (Tiles 2–6):** avoid heavy logistics fleets; keep vehicles mostly small urban (cars, buses, taxis, delivery vans, occasional light box truck). No container yards, no road-train convoys, no tanker clusters. (Tile 6 may show limited service trucks, but not a logistics-dominant fleet.)

### Roadway Circulation Consistency

![Roadway Circulation reference](../outputs/generated/008-54c-roadway-circulation.png)

Across all tiles, road networks should maintain **visually coherent traffic flow** at the scale of each individual roadway.

- Major roads and arterials feature **clear visual cues** indicating directionality, such as:
  - lane markings,
  - central dividers,
  - medians,
  - guardrails,
  - or physical separation between opposing directions of travel.
- Vehicles are generally **aligned consistently within each roadway**, following the implied direction of that road.
- Minor streets, service roads, and access lanes may appear more organic and irregular, but should not visually contradict the primary flow of adjacent major roads.

This constraint prioritizes **perceptual coherence** over strict traffic-law accuracy and should not reduce urban complexity or circulation layering.

### Anti-Repetition Rules

Road networks, major axes, and circulation patterns must evolve progressively toward the core, shifting orientation and scale between tiles. No two tiles may share the same dominant circulation geometry.

- Only Tile 5 may show the sun
- Central avenue only in Tile 5
- No skyline silhouettes with identical profile geometry in multiple tiles
- No identical façade patterns
- No repeated rooftop geometry
- Similar building types allowed, but:
	- different materials
	- different aging
	- different proportions
	- different rooftop clutter

Architectural relatives, not twins.

---
