# Tile 9 prompts

## ChatGPT provisional/anchored prompt

### Pass 1

> UPLOADS / INPUTS:
> - Upload Reference A (Ruler): the Tile 5 ruler image.
> 
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do NOT open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no skyline motifs, no landmark silhouettes, no central-axis logic, no sun disk).
> 
> GENERATOR PROMPT:
> Generate Tile 9: Heavy Industrial Expanse / Industrial Terminus. Photorealistic aerial city slice.
> 
> CAMERA / OPTICS (MUST MATCH THE RULER):
> - Fixed elevated aerial viewpoint; rectilinear optics; strong telephoto-like depth compression; narrow field of view.
> - Match the ruler’s horizon/vanishing-height read and “vertical pressure”.
> - No vertical recentering to fit smokestacks or shoreline. Cropping/clipping is allowed; lifting the frame is not.
> - Do NOT add extra sky. If sky feels too open, add industrial mass + stacked midground infrastructure + haze within the same framing.
> - Prevent push-in reads: avoid a single dominant near-foreground yard/track fan or slab. Density must read through layered repetition into depth.
> 
> SUBJECT (TILE 9 CONTENT):
> - Ultra-dense heavy industry dissolving into smog: petrochemical complexes, refineries, storage tanks, pipelines, conveyors, gantries, cranes, container yards, large warehouses, power/utility infrastructure, and complex rail yards repeating into depth.
> - Heaviest infrastructure density is biased toward the center and right half of the frame.
> - Include large cargo ships/tankers at realistic scale (not heroic), integrated into port operations.
> 
> ENGINEERED SHORELINE (REQUIRED):
> - Land–water boundary must be industrial and artificial: straight/angular/faceted docks, harbors, seawalls, containment geometry.
> - No organic/eroded/natural coastline.
> - Shoreline should form a strong diagonal or faceted cut (avoid a clean horizontal band).
> 
> LIGHTING / WIND / TIME:
> - Bright golden-hour daylight continuity, but Tile 9 must be cool-biased under heavy smog (no warmth resurgence).
> - No sun disk.
> - Key light from the LEFT; primary cast shadows fall to the RIGHT.
> - Wind pushes smoke/steam to the RIGHT (if visible).
> 
> ATMOSPHERE (MAXIMUM HAZE ENDPOINT):
> - This tile is the maximum haze endpoint of the panorama: far background nearly erased into milky smog; no crisp skyline edges.
> - Haze may glow softly as volumetric radiance but must NOT increase contrast or warmth.
> - Palette: polluted steel + bluish-gray bias; desaturated.
> 
> LIGHT ACCENTS (ALLOWED, SUBTLE — DAYLIGHT):
> - Add sparse utilitarian industrial lights barely visible through haze (dock/work lights, a few obstruction beacons, occasional faint warm window glows in industrial admin blocks).
> - Must be heavily diffused by smog, low intensity, and never read as nightlife or “city turning on.”
> 
> STITCH SAFETY:
> - No major linear elements should start/end cleanly on the left or right edge; let corridors fade/curve/dissolve internally.
> 
> FORBIDDEN:
> - Nature/parks/green belts, residential streets, landmark buildings, clear skyline edges, visible sun, decorative sparkle lighting, sci-fi/fantasy motifs.
> 
> OUTPUT:
> - 1024 × 1536, portrait orientation.

### Pass 2 — READY PROMPT

> UPLOADS / INPUTS:
> - Upload the Pass 1 output image as the BASE image (tile-09_pass-1).
> - Upload Reference B (Mood): a past Tile 9 generated mood reference.
> 
> REFERENCE USE POLICY (STRICT):
> - LOCK from the base image (Pass 1): framing, horizon/vanishing-height read, shoreline geometry class, and major industrial massing placement.
> - Transfer ONLY from Reference B: haze thickness/physics + distance-collapse behavior, bluish-gray smog palette, edge softness/contrast rolloff, and how sparse utilitarian lights bloom through haze.
> - Transfer FORBIDDEN from Reference B: composition/layout copying (no shoreline geometry cloning, no repeating ship placement, no duplicated corridor shapes), no time-of-day shift (must remain daytime), no light-direction change.
> 
> LOCK / PRESERVE (DO NOT CHANGE):
> - Preserve framing and pitch exactly (no zoom, no vertical recentering, no horizon shift).
> - Preserve key light direction: light from LEFT, shadows to RIGHT.
> - Preserve engineered shoreline and major massing placement.
> 
> GENERATOR PROMPT:
> Refine the provided Tile 9 base image to match the supplied Tile 9 mood reference, without changing composition.
> 
> ATMOSPHERE (MATCH MOOD; ENFORCE MAXIMUM HAZE):
> - Push atmospheric density to the strongest in the panorama: far background nearly erased into milky bluish-gray smog; skyline edges must not become crisp.
> - Match haze physics: thick particulate diffusion, severe distance-collapse, soft edge readability, gentle contrast rolloff.
> - Maintain readability in the midground (soft edges, reduced contrast) but avoid full whiteout.
> 
> COLOR / RADIANCE:
> - Cool-biased daylight filtered through smog; desaturated polluted steel tones.
> - Add/adjust diffuse industrial glow as subtle volumetric radiance through fog (never warm, never contrast-boosting).
> 
> LIGHT ACCENTS (SPARSE UTILITARIAN BLOOM):
> - Add/adjust a small number of functional industrial lights (dock/work lights, a few dim obstruction beacons, tiny ship work/navigation lights, occasional faint warm window glow).
> - Lights must be low intensity, heavily diffused by haze, and must not read as “city sparkle” or nightlife.
> 
> WIND / SMOKE:
> - Any smoke/steam remains subtle/low-contrast and drifts immediately to the RIGHT; no dramatic plumes.
> 
> FORBIDDEN (STILL ENFORCED):
> - Nature/residential/landmarks, sun disk, dusk/night, crisp skyline edges, key-light flip, composition cloning from the mood reference.
> 
> OUTPUT:
> - 1024 × 1536, portrait orientation.

## NanoBanana compiled prompt

To generate tile 9 in NanoBanana without references:

> You are generating a photorealistic image as part of a large, multi-tile panoramic cityscape.
> This image must behave as one tile in a continuous photographic system.
> 
> Do not reinterpret the scene creatively.
> Do not add landmarks, symbols, or narrative elements that are not explicitly implied.
> Preserve scale realism, camera consistency, and atmospheric logic.
> If multiple interpretations are possible, choose continuity, not novelty.
> 
> OUTPUT REQUIREMENT
> - Output size: exactly 768×1408 pixels (portrait). Do not return any other size.
> - If exact pixels are not possible, keep the aspect ratio strictly portrait and choose the closest size to 768×1408.
> 
> If a reference image is provided: match its camera altitude/pitch, rectilinear telephoto compression, haze thickness/physics, and how small lights bloom through haze. Do NOT copy its content.
> 
> Generate Tile 9 (Heavy Industrial Expanse / Terminus). Photorealistic.
> Fixed elevated aerial viewpoint, slight downward pitch, rectilinear optics with strong telephoto-like depth compression (no wide-angle). Narrow field of view; do not open the sky.
> 
> Scene: ultra-dense heavy industry dissolving into smog—refineries/petrochemical plants, stacks, cranes, container yards, railyards, pipelines, conveyors, warehouses, power infrastructure. Density is expressed by layered repetition into depth (multiple corridors and stacked slabs), not a single hero object.
> 
> Engineered shoreline REQUIRED: straight/angular artificial docks, seawalls, containment geometry forming a strong diagonal/faceted cut.
> Include a navigable industrial basin/channel with realistic port infrastructure and at least one utilitarian cargo ship or tanker (correct scale, not heroic).
> 
> Atmosphere = maximum haze of the panorama: EXTREME milky white–blue-gray industrial smog canopy. Distance collapse is severe; far background is nearly erased (ghost silhouettes only). Midground remains barely readable with soft edges (no full whiteout). Palette: cold blue-gray / polluted steel tones, desaturated.
> 
> Lighting + wind: cool daytime illumination. No visible sun disk. Key light from the left; shadows fall to the right. Wind to the right; any smoke/steam is subtle/low-contrast and drifts right immediately.
> 
> Light accents: sparse utilitarian industrial lights visible through haze (dock/yard work lights, occasional dim obstruction beacons, tiny ship work/navigation lights). Low intensity, fog-bloomed, not a glitter field.
> 
> Avoid: natural/organic coastline, pastoral greenery dominance, residential city identity, crisp skyline edges, sci-fi/fantasy motifs.