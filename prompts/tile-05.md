# Tile 5 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference B (Optional seam bridge composite, used ONLY in a seam-lock pass after neighbors exist): Tile 4 right crop + transparency + Tile 6 left crop — `tile4-6-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Tile 5 is the ruler authority and is normally generated with **no references** (ruler-first).
> - If Reference B is provided: transfer ONLY seam conditioning (left/right edge continuity: silhouette height profile, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout, landmark duplication, or importing neighbor content into the center. Reference B is seam conditioning, not a scene blueprint.

## Generator prompt
> Photorealistic aerial panorama tile (Tile 5 of a 9-tile megacity panorama — ICONIC CORE / ANCHOR). Portrait 1024×1536.
>
> CAMERA + FOV CLAMP (do not drift): fixed elevated diagonal-oblique aerial view; rectilinear optics; strong telephoto-like depth compression; NARROW field of view; unified camera system across all tiles; no wide-angle distortion; no tilt-shift; no stylized filters/illustration aesthetics.
>
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.
>
> LIGHTING / ATMOSPHERE (anchor): AMBER PEAK with diffused sun-pressure and warm haze compression. Lighting is CENTERED / FRONTAL DIFFUSION (no strong left/right key read). A solar disk MAY be present but must be diffused and partially obscured by haze with NO hard edge; it may be unnaturally large and may be PARTIALLY CROPPED by the frame—do NOT lift framing to fit it.
>
> SCENE INTENT: the heart of the city. Tallest towers, recognizable skyline silhouette, maximum vertical pressure for the entire panorama. Tile 5 defines peak contrast, warmth, and atmospheric glow.
>
> REQUIRED ELEMENTS (compose as one coherent core system):
> - Recognizable skyline silhouette with the TALLEST towers reaching near the upper frame boundary.
> - One PRIMARY vertical urban axis must visually dominate the composition. Any secondary diagonals/crossings must remain clearly subordinate and partially obscured.
> - Major avenue or urban valley supporting the dominant axis; traffic reads as strong axial flow.
> - Emphasis is achieved through scale + brightness + density, NOT by vertical recentering.
>
> FRAMING STABILITY AUTHORITY (Tile 5 is the ruler): establish the shared vanishing-height feel and vertical “pressure” for all tiles; maintain telephoto compression and disciplined sky budget. Do NOT vertically recenter to fit the sun or towers; cropping/clipping is preferred. If framing reads too open, add skyline mass, stacked midground slabs, or haze INSIDE the same framing—do NOT open more sky. Prevent push-in reads by avoiding a single near-field avenue/interchange filling the bottom; rely on midground layering.
>
> ENFORCEMENT (Tile 5 specific): Tile 5 must not read “lower” than Tiles 3 or 7. Correct by adding mass/density, not by opening sky. Reject any framing that widens FOV or reduces apparent tower height relative to Tiles 3 and 7.
>
> FORBIDDEN MOTIFS (must not appear):
> - Industrial decay.
> - Nature dominance / rural elements.
> - Heavy industry.

# Experimental prompt

With composition map reference R1 (`../refs/R1/109-tile5-02.png`)

> Generate: photorealistic aerial panorama tile (Tile 5 of 9), portrait 1024×1536, ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
> 
> REFERENCE / LAYOUT (STRICT):
> Use the provided “R1 — Tile 5 composition map” sketch as the PRIMARY layout authority.
> Match its: sky budget line, skyline envelope hump, horizon line height, reading orientation (centered vertical up), edge-safe zones, seam blending zones, and primary anchor zone placement.
> 
> CAMERA + FOV CLAMP (do not drift):
> Fixed elevated oblique rooftop/drone viewpoint (not top-down), rectilinear optics, strong telephoto-like depth compression, NARROW field of view.
> No wide-angle distortion, no barrel/fisheye, no tilt-shift, no “miniature” look.
> Stable horizon / pitch / vertical framing.
> 
> PERSPECTIVE SETUP (coherent rig):
> Two-point perspective with VP1 (left) and VP2 (right) implied along the horizon; keep vanishing behavior consistent.
> Verticals remain straight (no keystone exaggeration).
> 
> COMPOSITION (must match the sketch):
> - SKY BUDGET: keep “pure sky” as a disciplined top band (≈ the sketch; ~20% feel). Do NOT open extra sky.
> - SKYLINE ENVELOPE: a centered hump/crest of the skyline that peaks near the middle and gently falls toward both sides (per the sketch).
> - HORIZON LINE: fixed at the sketch height; do not raise/lower it.
> - READING ORIENTATION: dominant visual read is bottom → top (centered vertical). The main “pull” goes toward the skyline crest.
> 
> PRIMARY ANCHOR ZONE (use the sketch box):
> Place the highest-density “core” features inside the primary anchor zone:
> - tallest tower cluster and densest vertical mass live here
> - avoid placing unique hero shapes inside seam blending strips
> - do not clip major towers at left/right edges
> 
> CIRCULATION (maze-lattice, but aligned to the vertical read):
> The city circulation reads as a distributed maze lattice (dense streets, intersections, service alleys) with intermittent elevated segments.
> NO single giant freeway ribbon and NO single dominant interchange.
> However, align the overall fabric so it supports the centered vertical reading:
> - an implied axial “urban valley” / stacked street canyons / layered corridors can guide the eye upward
> - avoid one clean uninterrupted highway running straight up the center; keep corridors frequently occluded/broken by blocks
> 
> DEPTH / LAYERING (keep push-in out):
> Foreground: textured rooftops, street hints, small vehicles (no huge near-field roadway filling the bottom).
> Midground: dense stacked blocks, mixed corridors, partial viaduct pieces, bridges, overpasses (short segments, not poster-ramps).
> Background: compressed skyline mass dissolving slightly with distance (light haze only in far distance).
> 
> ELEMENT DIVERSITY (distributed, not focal):
> Include many midground features at once (spread out):
> - at least one rail element (surface/trench) AND one short elevated metro/tram segment (not edge-to-edge clean)
> - one embedded station/stop presence (platform canopies / vents / stair cores), integrated into blocks, not a landmark
> - infrastructure texture: rooftop mechanicals, antennas, water tanks, vents, pedestrian overpasses, utility bridges
> - small pocket plazas/terraces/roof gardens are allowed (subtle, not nature-dominant)
> 
> ARCHITECTURE DIVERSITY (force variety, avoid repetition):
> Show at least four mixed families simultaneously:
> 1) modern glass/steel towers with varied crowns/setbacks
> 2) dense mid-rise residential with balconies
> 3) brutalist/infrastructure volumes (concrete slabs/service structures)
> 4) older brick/stone commercial blocks (subtle art-deco / neo-gothic hints)
> Avoid a single iconic spire or landmark silhouette; vary rooflines/facade rhythms.
> 
> STITCH DISCIPLINE (hard rule):
> - Left/right seam blending strips: keep low-uniqueness, repeatable texture only (haze, rooffields, mid-rise repetition).
> - No big clipped towers, no edge-cut megastructures, no edge-to-edge bridge/highway spans.
> - Any major corridor must fade/fragment/occlude before reaching seam zones.
> 
> LIGHTING / COLOR (centered like the sketch’s light source):
> Centered / frontal warm golden-hour illumination (no strong left/right key).
> No visible hard-edged sun disk (light source can be implied above frame).
> Natural photographic contrast; restrained saturation; preserve neutral whites; no heavy orange grade; no HDR bloom.
> 
> NEGATIVE / AVOID:
> sun disk with hard edge • iconic landmark skyline • one giant freeway interchange • clean uninterrupted highway ribbon • perfect symmetry • edge-to-edge bridge span • edge-clipped megastructure • heavy industry • industrial decay • rural/nature dominance • neon/billboards • fisheye/wide-angle • tilt-shift • painterly/illustration look • readable text/logos
