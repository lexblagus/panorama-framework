# Core Canonical

This file defines physics of the universe.

## Overview

Create a large-scale, ultra-wide cityscape wallpaper composed of **9 portrait-oriented tiles**, manually stitched in Affinity Photo. The result must feel like a **single continuous megacity**, photographed in one coherent late-afternoon moment, with strong realism, atmospheric depth, and architectural diversity.

The panorama is governed by a **lateral ambiance gradient**: lighting color temperature, atmospheric density, and air clarity evolve progressively from left to right across the tiles. The scene transitions from clean, neutral daylight on the far left, through a warm amber core at the center, and into dense, bluish-gray industrial haze on the far right. This lateral progression is intentional, monotonic, and must never reverse.

This project does not present a moral progression from nature to city. Instead, nature, human systems, and industry are treated as distinct but equally complex forms of chaos, each governed by different rules, scales, and pressures.

The project explores *virtual photography*: a collaboration where AI handles image generation and continuity, while the human performs editorial judgment, compositional control, stitching, and final finishing.

This document is the **single source of truth** for restarting the project in a blank-context environment.

---




## Subject

The panoramic narrative logic:

- Goes from left to right, where **density rises toward the center** which acts as the visual and narrative anchor (Tile 5).
- **Functional shift:** dominant natural systems (chaotic, terrain-led) ↔ selective human systems (proto-infrastructure, access-driven) ↔ dense urban order ↔ industrial systems (mechanical chaos).
- **Emotional arc**: calm → anticipation → awe → intensity → mechanical dominance.
- **Atmospheric arc (lateral)**: clarity → warmth → saturation → suffocation / toxicity.

Despite cinematic references used as emotional calibration, the cityscape must retain its own architectural and atmospheric identity. The goal is not stylistic imitation, but believable urban evolution captured in a single photographic moment.

---




## Concepts

This section defines project-specific terminology for clarity.
It introduces no new constraints and does not override any section above.

| Term | Meaning in This Project |
|-----|-------------------------|
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
| Industrial Terminus | Tile 9’s role as the farthest functional extreme, where the city dissolves into haze and logistics. |

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
  - Tile 5: centered / frontal diffusion
  - Tiles 6–9: light coming from the left

#### Lateral ambiance gradient

- **Tiles 1–2:** Neutral daylight, minimal warmth, clean air, high clarity.
- **Tiles 3–4:** Gradual warm-up toward amber tones, early haze appears.
- **Tile 5:** Peak amber saturation, maximum atmospheric diffusion.
  The solar disk may appear **only here** (and in the Central Master Reference Image), partially visible and fully diffused through haze, with no hard edge. The solar disk may appear unnaturally large relative to real-world scale, reading as an atmospheric phenomenon rather than a literal sun. Its edge must remain fully diffused, dissolved into haze, with no hard boundary.
- **Tiles 6–7:** Warmth decreases progressively, haze thickens, contrast softens.
- **Tiles 8–9:** Cool-biased, bluish-gray light filtered through heavy fog and smog.

#### Industrial lighting

**As an exception for Tiles 8–9 only**, in the industrial zones (Tiles 8 and 9), extremely subtle artificial lighting may be faintly perceptible under daylight conditions. These lights must be strictly functional and industrial in nature (plant/chimney safety lights, infrastructure beacons, interior factory glow), heavily diffused by smog and haze, subordinate to natural light, and must not create new focal points, alter the perceived time of day, or read as “the city turning on.” They must read as “industry never sleeps.”


### Color & Texture

- Color palette must interpolate laterally across tiles, aligned with the lighting gradient.
- Warmth and saturation **increase toward Tile 5** and **decrease after it**.
- After Tile 5, warmth must not return.

Color characteristics:
- Tiles 1–2: vivid but neutral daylight colors.
- Tiles 3–5: warm ambers, soft oranges, solarized contrast.
- Tiles 6–9: progressive desaturation under haze, shifting toward bluish-gray tones.

Texture rules:
- Realistic but subtle dirt, wear, stains, and imperfect material variation.
- Uneven coloration and aging materials.
- Slight sensor noise (not painterly grain).
- No “AI polish”, no crystalline artifacts.
- Avoid hyper-polished or overly clean surfaces.
- Sharp midground, softened far distance.

Color and texture behavior is laterally encoded and bound to tile position. Warmth, chromatic saturation, and local contrast must increase progressively toward Tile 5 and decrease progressively afterward. After Tile 5, warmth, saturation, and contrast must not reappear, spike, or locally intensify, even in foreground elements. Texture variation may increase toward the right, but must do so through desaturation, grime, and atmospheric filtering rather than contrast recovery or color richness.


### Atmosphere

Atmosphere evolves along **two independent axes**:

- **Depth axis (foreground → background):**  
  Atmospheric haze increases with distance, skyline fades into smog.
- **Lateral axis (Tile 1 → Tile 9):**  
  Fog, smog, and particulate density increase cumulatively toward the right.

Additional rules:
- Horizon skyline progressively dissolves into haze toward the rightmost tiles.
- Wind direction is laterally consistent across all tiles and must not reverse.
- Wind affects smoke, haze, steam, and cloud deformation.
- On industrial/right-side tiles, smoke drifts laterally as specified.

Along the lateral axis (Tile 1 → Tile 9), atmospheric density is strictly cumulative and monotonic. Fog, smog, and particulate matter must increase continuously toward the right and must not thin, clear, reset, or locally diminish after Tile 5. Variations may occur only along the depth axis (foreground → background), never as lateral reversals.


### Photographic Realism

* Photorealistic
* Crisp geometry
* Natural photographic sharpness
* High micro-contrast on building edges
* Less “trashed” than heavy urban decay references, but clearly not sterile or artificial.


### Camera & Optics

* Elevated aerial viewpoint, realistic drone or rooftop height
* Broad city coverage without exaggerated wide-angle distortion
* Rectilinear optics only
* Perspective should feel compressed, as if shot from a longer focal length
* Telephoto-like depth compression (objects stack densely, distance feels shortened)
* No fisheye, no barrel distortion, no extreme perspective stretching
* Consistent horizon physics across all tiles
* Slightly off-axis framing (imperfect, human vantage)
* Human-scale streets and believable building proportions
* The virtual camera height, pitch, and horizon line are fixed and shared across all tiles.
* No tile may independently reframe or vertically recenter the composition.
* Cropping of dominant elements is permitted; camera rebalancing is not.
* Vertical reframing or recentering to emphasize the sun, skyline, or focal elements is **forbidden**.
* Cropping of dominant elements (sun, towers, clouds) is acceptable and preferred over vertical reframing.*


### Composition and camera flow

Major linear elements (rivers, avenues, rail lines, infrastructure corridors) should follow a panorama-wide directional bias to reinforce camera flow and avoid mirrored or cloned compositions.

- **Tile 1** may exhibit strong vertical massing or cliff dominance on one side of the frame, provided the opposing edge remains visually quieter to allow stitching continuity.
- **Tiles 1–4:** diagonal bias bottom-right → top-left.
- **Tile 5:** vertical / central axis
- **Tiles 6–9:** diagonal bias bottom-left → top-right

Atmospheric density may partially obscure or dissolve linear elements in Tiles 7–9, reinforcing the visual termination of the panorama.

This is a compositional preference, **not a mandatory feature**.
Tiles may contain **no dominant linear element**.


### Stitching

Edges must feel naturally incomplete, obscured by terrain, haze, streets, buildings, tunnels, or curvature. No large linear elements touching left or right edges. This applies even if tiles are regenerated.

* Linear elements (rivers, railways, highways, avenues, infrastructure) may:
  * Enter from bottom or top
  * Fade, curve, fragment, dissolve or terminate internally
* They must not:
  * Start or end cleanly at left or right edges
  * Run parallel and uninterrupted into side edges


### Architectural Language

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

- Realistic scale (no stretched limousines)
- Mixed eras: modern, boxy older cars, rounded vintage cars
- Buses and small trucks allowed
- Traffic density varies by tile
- Modern trams and subways on left and center; old cargo trains and large trucks on right (industrial mood)
- Rail vehicles in non-industrial tiles (Tiles 1–3) must remain proto-infrastructural: low-profile, scale-respectful, and access-oriented. Trains define scale through length, repetition, and partial visibility, never through bulk or height.

### Roadway Circulation Consistency

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




