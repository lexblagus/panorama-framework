# Tile 9 prompts

## ChatGPT READY PROMPTS (multi-pass)

### Pass 1 — READY PROMPT (Framing + Geometry Lock)

> Uploads / Inputs:
> - Upload **Reference A (Ruler): Tile 5 ruler image**.
>
> Reference Use Policy (strict):
> - Use Reference A ONLY to match: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Do NOT import any Tile 5 content identity: no skyline motifs, no landmark silhouettes, no central-axis logic, no sun disk.
>
> Lock / Preserve:
> - Lock the dominant Tile 9 read as a **bottom-left → top-right diagonal** (do not drift).
> - Lock water geometry: a **navigable industrial river/channel** occupies the **bottom-right quadrant**, hugs the **right edge**, and **recedes into the horizon** (distance-collapse into haze). Avoid a hard “L” turn that re-orients the scene.
>
> Generator Prompt:
> Generate Tile 9 (Heavy Industrial Expanse / Terminus). Photorealistic. Portrait orientation.
> Fixed elevated aerial viewpoint with rectilinear optics and strong telephoto-like depth compression (no wide-angle). Narrow field of view; do not open the sky.
>
> CAMERA (MUST MATCH REFERENCE A)
> - High elevated aerial viewpoint (same altitude feel as Reference A).
> - Slight downward pitch like Reference A (not near-ground, not drone-close).
> - Rectilinear optics with strong telephoto-like compression (no wide-angle drift).
> - No vertical recentering to “fit” subjects; do not add extra sky. Cropping/clipping is allowed.
> - Avoid near-field dominance: no single bottom-foreground slab/roof taking over the frame.
>
> COMPOSITION + WATER (DO NOT DRIFT)
> - Dominant spatial energy runs **bottom-left → top-right**.
> - The right side is an **industrial navigation channel/river**: starts in the **lower-right**, hugs the **right edge**, and fades into the smog toward the horizon.
> - The left bank is a continuous industrial frontage: straight docks, quays, seawalls, containment edges; hard angular shoreline geometry (no organic coast).
>
> SUBJECT (TILE 9)
> Ultra-dense heavy industry dissolving into smog: petrochemical complexes, refineries, stacks, pipe forests, cranes, container yards, railyards/track fans, conveyors, warehouses, power/utility infrastructure.
> Density via layered repetition into depth (multiple corridors and stacked slabs), not a single hero object.
>
> PORT + SHIPPING (SCALE ANCHORS)
> - Realistic port infrastructure: piers, cranes, mooring zones, container stacks, service roads.
> - Include at least one utilitarian cargo ship or tanker (correct scale). Prefer ship presence near the **lower-right** without making it a heroic centerpiece.
>
> ATMOSPHERE (MAXIMUM HAZE — BUT NO BLUE DRIFT)
> - Tile 9 is the maximum haze tile: extreme industrial smog canopy with severe distance collapse (far background nearly erased; only ghost silhouettes).
> - Keep midground barely readable: soft edges, reduced contrast; no blank white fog card.
> - Palette must be desaturated **polluted steel + dirty beige/soot-gray particulate** (cool-neutral overall). Avoid cyan/blue cast.
> - Volumetric radiance is allowed only as soft smog glow; do not increase global contrast or re-warm the image.
>
> LIGHTING + WIND (DAYTIME)
> - No visible sun disk.
> - Key light from the left; shadows fall to the right. Wind to the right; any smoke/steam is subtle/low-contrast and drifts right immediately (no dramatic plumes).
>
> LIGHT ACCENTS (SUBTLE, FUNCTIONAL)
> - Sparse utilitarian industrial lighting visible THROUGH haze:
>   - dock/yard work lights, gantry/port lights, small perimeter lights
>   - occasional dim obstruction beacons on tall stacks (very subtle)
>   - optional tiny ship work/navigation lights (realistic, not decorative)
> - Lights must be low-intensity and haze-bloomed; not a glitter field; not nightlife.
>
> FORBIDDEN
> - Natural shoreline, pastoral greenery dominance, residential neighborhood identity, landmark towers/buildings, crisp skyline edges, sci-fi/fantasy motifs.
>
> Output:
> - Output: 1024 × 1536, portrait orientation.

---

### Pass 2 — READY PROMPT (OPTIONAL: Haze/Bloom Lock, NO Regrade)

> Uploads / Inputs:
> - Upload the Pass 1 image output (`tile-09_pass-1`) as the **base image**.
> - Upload **Reference B (Mood): a successful prior Tile 9 render** as the **mood reference**.
>
> Reference Use Policy (strict):
> - You must preserve the base image geometry. Reference B is for atmosphere behavior only.
> - Transfer from Reference B ONLY: haze thickness/physics, distance-collapse behavior, edge softness/contrast rolloff, and sparse utilitarian light bloom behavior.
> - Transfer forbidden: any composition/layout copying, repeating ship placement, time-of-day shift, light-direction change, and any global color regrade (especially cyan/blue drift).
>
> Lock / Preserve (from base image):
> - Preserve framing and camera pitch (do not recenter; do not add sky).
> - Preserve the **bottom-left → top-right diagonal** read.
> - Preserve shoreline + channel geometry: channel remains in the **bottom-right**, hugging the right edge, receding into the horizon.
> - Preserve major massing placement and ship scale/placement class.
>
> Generator Prompt:
> Create the final Tile 9 by enforcing maximum haze + correct haze-bloom behavior while keeping the base image geometry unchanged.
> Increase/normalize industrial smog thickness and distance-collapse to match the mood reference, but keep the base image’s overall color temperature: **no blue/cyan shift**.
> Maintain a desaturated polluted steel + dirty beige/soot-gray particulate palette (cool-neutral overall). Keep midground barely readable; far background nearly erased.
> Keep daylight lighting rules: no sun disk; key light from left, shadows right; wind right; smoke/steam subtle.
> Keep utilitarian lights sparse and haze-bloomed; do not introduce decorative sparkle.
>
> Output:
> - Output: 1024 × 1536, portrait orientation.

## NanoBanana compiled prompt (no references)

> You are generating a photorealistic image as part of a large, multi-tile panoramic cityscape.
> This image must behave as one tile in a continuous photographic system.
> Do not reinterpret the scene creatively.
> Do not add landmarks, symbols, or narrative elements that are not explicitly implied.
> Preserve scale realism, camera consistency, and atmospheric logic.
> If multiple interpretations are possible, choose continuity, not novelty.
>
> Generate Tile 9 (Heavy Industrial Expanse / Terminus). Photorealistic. Portrait orientation.
> Fixed elevated aerial viewpoint, slight downward pitch, rectilinear optics with strong telephoto-like depth compression (no wide-angle). Narrow field of view; do not open the sky.
>
> Composition lock: dominant diagonal bottom-left → top-right. A navigable industrial river/channel occupies the bottom-right, hugs the right edge, and recedes into the horizon.
> Engineered shoreline REQUIRED: straight/angular docks, seawalls, containment geometry (no organic coast).
> Include realistic port infrastructure and at least one utilitarian cargo ship/tanker (correct scale).
>
> Atmosphere: maximum industrial smog of the panorama with severe distance collapse (far background nearly erased). Midground barely readable with soft edges.
> Palette: desaturated polluted steel + dirty beige/soot-gray particulate (cool-neutral overall). Avoid cyan/blue cast.
>
> Lighting + wind: cool-neutral daytime illumination. No visible sun disk. Key light from the left; shadows fall to the right. Wind to the right; any smoke/steam is subtle and drifts right immediately.
> Light accents: sparse functional industrial lights under haze (diffused bloom, not a glitter field).
