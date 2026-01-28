# Tile 5 prompts

## ChatGPT Locked prompt

> Photorealistic portrait-oriented image of the **iconic urban core** of a vast megacity at **golden hour**, captured from a fixed elevated aerial viewpoint with **rectilinear optics and strong telephoto-like depth compression**. Use a **narrow field of view** (no wide-angle drift); the city appears monumentally dense, vertically stacked, and compressed toward the horizon.
>
> A **single, perfectly vertical primary urban axis** dominates the composition, running from the bottom of the frame toward the distant skyline. This axis acts as the gravitational spine of the city. All other circulation elements remain subordinate and partially obscured.
>
> **Layered infrastructure aligns with this axis**: a grand avenue at street level, rail or subway corridors below, and occasional elevated infrastructure above. Rail lines run vertically or near-vertically and may enter or exit tunnels, with trains appearing only in partial segments. The rail corridor defines scale through repetition and layering, not bulk.
>
> The skyline reaches its **maximum vertical intensity** here, with dense clusters of tall towers. Architectural variety is intentionally heterogeneous: modern glass slabs, stepped art-deco silhouettes, neo-gothic verticals, brutalist concrete masses, and dense mid-rise blocks coexist. Architectural relatives, not twins.
>
> **Framing stability authority (Tile 5 as ruler, no bands):** Tile 5 sets the shared vanishing-height feel and vertical pressure. Do not vertically recenter to fit the sun or towers—crop/clip if they press the frame. Keep sky disciplined by adding skyline mass or haze inside the same framing; prevent push-in reads by avoiding a single near-field avenue/interchange and using midground stacking for depth.
>
> Lighting is **centered / frontal diffusion**, producing maximum atmospheric diffusion without harsh contrast. The solar disk may be **partially visible only here**, fully diffused through haze with no hard edge; it may read unnaturally large and may be partially cropped. Shadows are minimal / symmetric and must not imply a strong left/right key.
>
> **Contrast follows depth.** Foreground retains higher local contrast and clearer material definition; midground softens under warm haze; background dissolves into amber atmospheric diffusion near the horizon.
>
> Surfaces show subtle wear and imperfection: aging concrete, weathered stone, uneven glass reflections, rooftop clutter. No hyper-clean finishes, no artificial polish, no crystalline artifacts.
>
> The image must read as the **equilibrium point of the entire panorama** — the peak of density, warmth, and atmospheric pressure — defining the visual and physical ceiling for all other tiles. Reject any framing that widens FOV or lowers apparent tower height versus Tiles 3 and 7.
>
> Output: 1024 × 1536, portrait orientation.

## Tile 9 deviation prompt (hard haze)

> REFERENCE IMAGES PROVIDED:
> - Base image (LOCKED GEOMETRY): Tile 5 canonical output (the result of the Tile 5 locked prompt)
> 
> USE POLICY (GEOMETRY LOCK):
> - The Base image is authoritative for ALL geometry: framing, camera altitude feel, camera pitch, corridor directions, skyline placement, and telephoto compression read.
> - Do NOT move objects. Do NOT change composition. Do NOT add/remove structures. No new landmarks.
> - Do NOT “open sky.” Keep the same sky-budget and crop.
> 
> EDIT GOAL
> Create a Tile 9 deviation reference by changing ONLY: atmosphere + light/color behavior.
> 1) Add EXTREME white–bluish gray industrial haze/smog canopy (much heavier than typical).
> 2) Push distance collapse hard: far skyline nearly erased into a milky veil.
> 3) Prevent flatness by adding sparse, realistic color accents from light sources (subtle; diffused by haze).
> 
> ATMOSPHERE (HARD HAZE — PUSH IT)
> - Increase haze massively: thick milky diffusion across the whole frame, strongest in upper half and deep distance.
> - Far skyline should be almost completely erased (ghost silhouettes only, if any).
> - Mid-to-far background buildings dissolve into a pale blue-gray veil.
> - Reduce saturation and contrast globally to reinforce smog density (but do NOT fully wash out the near foreground).
> - Constraint: do NOT become a pure white/blank fog card — near foreground must remain readable with soft edges.
> - If unsure: ADD MORE HAZE.
> 
> LIGHTING (ALLOW SLIGHT DUSK IF IT HAPPENS)
> - Keep existing light direction consistent with the base image (do not flip shadows).
> - Overall feel: cool / polluted daylight. Slightly dusky is acceptable if it helps the accents read, but do not go into night.
> - No visible sun disk.
> 
> LIGHT ACCENTS (REQUIRED, SUBTLE — TO AVOID FLATNESS)
> Add sparse, realistic light emissions consistent with the existing scene (do not create new fixtures dominating the frame):
> - Windows: a few warm interior glows (dim amber/yellow), scattered (not every window).
> - Street/utility lights: a few warm sodium-vapor style points (soft amber), very diffused by haze.
> - Vehicle lights (if roads are visible): faint red brake lights; headlights vary from warm (older) to cool/blue-white (modern), but all subdued and haze-bloomed.
> Rules:
> - Lights must remain low-intensity, fog-bloomed, and sparse.
> - No glitter fields. No nightlife look. No neon.
> - The image should remain primarily cold blue-gray; accents are small “punctuation.”
> 
> OUTPUT
> Return the edited image only (same orientation and framing as the base).

## NanoBanana compiled prompt

> You are generating a photorealistic image as part of a large, multi-tile panoramic cityscape.
> This image must behave as one tile in a continuous photographic system.
> 
> Do not reinterpret the scene creatively.
> Do not add landmarks, symbols, or narrative elements that are not explicitly implied.
> Preserve scale realism, camera consistency, and atmospheric logic.
> 
> If multiple interpretations are possible, choose the one that best supports continuity,
> not novelty.
> 
> Generate Tile 5 (Iconic Core / Anchor). Portrait orientation (2:3 aspect), photorealistic.
> Fixed elevated aerial viewpoint with rectilinear optics and strong telephoto-like depth compression (no wide-angle drift). Narrow field of view. The city must feel monumentally dense, vertically stacked, and compressed toward the distance.
> 
> Composition: a single, perfectly vertical primary urban axis dominates the image, running from the bottom of frame into the distant skyline. This vertical axis is the gravitational spine. Layered infrastructure aligns with it: grand avenue and/or rail/subway corridors, occasional elevated segments, with repetition and stacking defining scale (not one giant foreground object).
> 
> Skyline: maximum vertical intensity of the entire panorama. Tallest towers and a recognizable skyline silhouette. Heterogeneous but plausible architecture (glass slabs, stepped art-deco massing, neo-gothic verticals, brutalist concrete masses, dense mid-rise blocks), “relatives not twins.”
> 
> Lighting: golden hour with centered / frontal diffusion. Warm amber atmospheric pressure. The solar disk may be partially visible only here: fully diffused through haze, no hard edge, may be unnaturally large and may be partially cropped by the top edge. Emphasis through scale/brightness, not by lifting or recentering the camera.
> 
> Depth: contrast and detail decrease with distance (foreground clearer, midground softened, background dissolving into amber haze). Surfaces show subtle wear and imperfection; no hyper-clean polish. No heavy industry, no nature dominance, no industrial decay.
> 
> This image defines peak density, warmth, and atmospheric diffusion for the entire panorama.
