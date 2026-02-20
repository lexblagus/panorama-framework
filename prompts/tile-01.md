# Tile 1 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam anchor): Tile 2 LEFT EDGE crop (when available) — `tile2-left-edge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no core skyline motifs, no central-axis logic, no sun disk).
> - Transfer ONLY from Reference B (if provided): right-edge seam continuity (silhouette height profile, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout; it is a seam conditioner, not a scene blueprint.

# Generator prompt
> Photorealistic aerial panorama tile (Tile 1 of a 9-tile megacity panorama). Portrait 1024×1536.
>
> CAMERA LOCK (do not drift): fixed elevated diagonal-oblique aerial view; rectilinear optics; strong telephoto-like depth compression; unified camera system; no wide-angle distortion; no tilt-shift; no illustration/stylized filters.
>
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.
>
> LIGHTING / ATMOSPHERE: clear, crisp daylight with strong material definition. Key light originates from the FAR RIGHT (off-frame); primary cast shadows fall to the LEFT. Sun disk / visible solar source is NOT allowed.
>
> SCENE INTENT: the natural extreme. Terrain, geology, and water remain dominant and only partially negotiable by human presence. Nature is energetic, vertical, and resistant (not pastoral). Urban logic is absent: no skyline, no axial planning, no metropolitan order.
>
> REQUIRED ELEMENTS (compose as one coherent system):
> - Mountains / steep hills / cliffs / rugged elevation changes; exposed rock shaping movement and construction.
> - A river or reservoir as the primary natural spine.
> - Aggressive water–terrain interaction: cascades, stepped flow, waterfalls, spillways, or a dam integrated into terrain.
> - Dense, irregular vegetation with high variety.
> - Infrastructure as cuts/scars/insertions (NOT a grid): roads carved into rock, tunnels, viaducts, switchbacks.
> - Sparse, elevated settlements embedded into slopes (multiple pockets in layered midground for scale continuity).
> - Strong architectural heterogeneity: vernacular houses, stone dwellings, brutalist/modern hillside villas.
> - Optional subtle passenger rail elements (tunnels or constrained corridors), strictly subordinate.
> - Optional vertical access systems where terrain is extreme (funiculars/cable systems/cliff elevators), strictly subordinate.
>
> FRAMING STABILITY (Tile 5 as ruler): treat framing drift as camera pitch drift; do NOT vertically recenter to fit peaks. Crop/clip peaks if they pressure the top; maintain telephoto vertical “pressure”. If sky feels too open, add terrain bulk, stacked midground settlements, infrastructure cuts, or haze inside the distance volume—do NOT open more sky. If the read feels push-in/zoomed, reduce near-field dominance and add depth via midground stacking and overlap (do not enlarge one foreground cliff/road).
>
> FORBIDDEN MOTIFS (must not appear):
> - Skylines or distant megacity silhouettes; high-rises/skyscrapers; urban grids/major avenues.
> - Pastoral/idyllic countryside imagery; flat or gently rolling suburban landscapes.
> - Sun disk or visible solar source.
>
> Output: 1024 × 1536, portrait orientation.

# Experimental prompt

> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `008-11-tile5-R1.png` (uploaded)
> - Reference B (Optional seam anchor): Tile 2 LEFT EDGE crop (when available) — `tile2-left-edge.png`
> - Reference C (Layout): R1 — Tile 1 Composition Map sketch — `107-tile1-02` (uploaded)
> 
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no core skyline motifs, no central-axis logic, no sun disk).
> - Transfer ONLY from Reference B (if provided): LEFT-edge seam continuity language (edge texture density, haze rolloff, silhouette-height feel). Do NOT copy full composition.
> - Reference C is the PRIMARY layout authority for this tile (see “LAYOUT LOCK”).
> 
> GENERATOR PROMPT:
> Photorealistic aerial panorama tile (Tile 1 of a 9-tile panorama). Portrait 1024×1536.
> 
> LAYOUT LOCK (match the R1 Tile 1 composition map exactly):
> - Preserve the SKY BUDGET line and keep sky constrained (do NOT open the sky).
> - Preserve the HORIZON LINE height exactly.
> - Preserve the “SKYLINE ENVELOPE” slope: it rises toward the RIGHT (terrain/settlement mass higher on the right; lower toward the left).
> - Preserve READING ORIENTATION: dominant diagonal read runs from bottom-right → top-left.
> - Respect EDGE SAFE ZONES and SEAM BLENDING ZONES on both sides (keep low-uniqueness, stitch-friendly textures there).
> - Keep the PRIMARY ANCHOR ZONE placement as indicated by the sketch (place the most legible/identity-defining detail inside it; keep seams quiet).
> 
> CAMERA LOCK (do not drift):
> Fixed elevated diagonal-oblique aerial view; rectilinear optics; strong telephoto-like depth compression; unified camera system.
> No wide-angle distortion, no fisheye/barrel, no tilt-shift, no illustration/stylized filters.
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.
> 
> LIGHTING / ATMOSPHERE:
> Clear, crisp daylight with strong material definition.
> Key light originates from the FAR RIGHT (off-frame); primary cast shadows fall to the LEFT.
> Sun disk / visible solar source is NOT allowed.
> 
> SCENE INTENT (updated topology — “/” not “V”):
> The natural extreme, but re-shaped as a rugged Italian/Mediterranean-style coastline:
> - A single dominant “/” landmass wedge: steep coastal hillside/cliffs occupy the RIGHT side and rise upward to the RIGHT.
> - The LEFT side is open water (sea or large coastal inlet), providing calm negative space and stitch-friendly continuity.
> - IMPORTANT: avoid a symmetric V-shaped valley/canyon composition. No centered river-valley “V”. The main structure is a slanted coastline + slope.
> 
> REQUIRED ELEMENTS (keep all, adapted to coastline):
> - Mountains / steep hills / cliffs / rugged elevation changes; exposed rock shaping movement and construction (RIGHT side).
> - A river or reservoir as the primary natural spine, adapted as a coastal river/stream + narrow estuary/inlet/reservoir:
>   it descends the slope and meets the sea (or feeds a small coastal reservoir) WITHOUT creating a centered V-valley.
> - Aggressive water–terrain interaction: cascades / stepped flow / waterfalls / spillways OR a dam integrated into the cliff,
>   visible as a controlled drop or engineered water step before reaching the sea.
> - Dense, irregular vegetation with high variety (Mediterranean shrubs/pines + mixed hillside growth), interleaved with rock.
> - Infrastructure as cuts/scars/insertions (NOT a grid):
>   a dramatic COASTLINE ROAD carved into rock with tunnels, short viaducts, retaining walls, and switchbacks that support the diagonal read.
> - Sparse, elevated settlements embedded into slopes (multiple pockets layered through midground):
>   Italian coastal hillside houses/terraces perched above the road; density increases gently toward the mid-to-far distance.
> - Strong architectural heterogeneity:
>   vernacular coastal houses (stucco/stone), compact hill dwellings, plus occasional brutalist/modern hillside villas.
> - Optional subtle passenger rail elements (tunnel mouth / constrained corridor), strictly subordinate.
> - Optional vertical access systems (funicular/cable lift/cliff elevator), strictly subordinate.
> 
> COMPOSITIONAL GUIDANCE (to match the sketch’s diagonal read):
> - The coastline road is the main leading line: it enters near the lower-right foreground and recedes toward the top-left distance along the shore.
> - Keep the most legible “identity cluster” (best road curve + a pocket of hillside houses + a cliff/sea interface) inside the PRIMARY ANCHOR ZONE.
> - Maintain a clean left-side water field; do not clutter the sea with many boats/structures.
> 
> STITCH DISCIPLINE (hard rule):
> - Left and right seam blending strips must remain low-uniqueness.
>   LEFT seam: mostly open water + subtle ripples/haze gradients.
>   RIGHT seam: repeatable hillside vegetation/rock texture and non-unique small buildings (no standout hero villa).
> - No unique landmark house, tower, bridge, or tunnel portal clipped at the edges.
> 
> FRAMING STABILITY (Tile 5 as ruler):
> Treat framing drift as camera pitch drift; do NOT vertically recenter to fit peaks.
> Crop/clip peaks if they pressure the top; maintain telephoto vertical “pressure”.
> If sky feels too open, add terrain bulk, stacked midground settlements, cliff mass, or atmospheric depth—do NOT open more sky.
> If the read feels push-in/zoomed, reduce near-field dominance and add depth via midground stacking and overlap (do not enlarge one foreground cliff/road).
> 
> FORBIDDEN MOTIFS (must not appear):
> - Skylines or distant megacity silhouettes; high-rises/skyscrapers; urban grids/major avenues.
> - V-shaped centered valley composition; centered river canyon; symmetrical “valley hero”.
> - Pastoral/idyllic countryside; flat suburban landscapes.
> - Sun disk or visible solar source.
> - Neon signage, billboards, readable text/logos.
> 
> Output: 1024 × 1536, portrait orientation.