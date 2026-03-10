# Tile 6: Experimental references

> You are given a reference image that contains:
> - the LEFT edge of the previous tile (Tile 5) and
> - the RIGHT edge of the next tile (Tile 7),
> with a transparent/empty region in the center.
> 
> TASK
> - Fill ONLY the transparent/empty middle region to create a single continuous, natural, photorealistic shot.
> - The existing left and right regions are LOCKED: do not change, repaint, shift, recolor, blur, sharpen, or warp them in any way.
> - Blend both sides so the entire image reads as one coherent capture taken from the same camera at the same moment.
> 
> HARD CONSTRAINTS (do not violate)
> - Preserve all non-transparent pixels exactly.
> - Do not move the horizon / vanishing height. Do not tilt the camera. Do not “add sky” to create mood.
> - Rectilinear optics only (no fisheye, no barrel distortion). Telephoto-like compression / dense stacking.
> - Maintain lighting direction and shadow logic implied by the locked sides. Do not flip key light.
> - Maintain atmospheric ladder implied by the locked sides.
> - Do not create a new iconic center landmark or a second “core.”
> 
> BRIDGE CONTENT GOALS (Tile 6: Post-Core Release → Logistics Threshold)
> - The center region must feel like **post-core continuity**: still dense and urban, but less iconic than Tile 5.
> - Begin the “release” from the core’s vertical spine:
>   - towers become less singular and more distributed,
>   - glass and newer construction become more common,
>   - the dominant central axis weakens and becomes fragmented.
> - Increase midground infrastructure layering:
>   - interchanges, service corridors, rail branches, ring roads,
>   - but avoid a close-up highway foreground that implies a push-in.
> - Warmth and contrast should begin gently declining relative to Tile 5, while haze slowly increases toward Tile 7.
> - Ensure cross-center continuity for rail/roads/avenues by extending them through the center with slight occlusion and overlap (no clean uninterrupted ruler-straight seam crossing).
> 
> STYLE / REALISM
> - Photorealistic, mixed-era urban fabric with subtle wear and grime.
> - Golden-hour daylight, no dusk/night.
> - No sci-fi/fantasy.
> 
> OUTPUT
> - Fill the center seamlessly and naturally.
> - Leave the locked sides unchanged.
> - Dimensions: 1024 × 1536, portrait orientation.

# Temporary prompt (as if it was a primary tile)

## Header

> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 6 composition map (crop from Tiles 6–8 R1) — `tile6-r1.png` (source: `131-tiles6to8.png`)
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (OPTIONAL seam anchor): Tile 5 RIGHT EDGE crop — `tile5-right-edge.png`
> - Reference C (OPTIONAL seam anchor): Tile 7 LEFT EDGE crop — `tile7-left-edge.png`
>
> REFERENCE USE POLICY (STRICT):
> - R1 is PRIMARY layout authority (horizon height, sky budget, envelope, reading orientation, seam/anchor zones).
> - Tile 5 ruler controls framing/scale physics ONLY (telephoto compression, vertical pressure, vanishing-height read). Do NOT import Tile 5 content identity.
> - Seam anchors (B/C) are edge continuity ONLY (edge texture density / silhouette continuity language). Not layout blueprints.

## Generator prompt (COMPILED)

> REFERENCES (ORDERED):
> - R1 Tile 6 composition map (PRIMARY layout authority).
> - Tile 5 ruler image (SECONDARY; framing/scale physics only).
> - Optional: Tile 5 right-edge crop (left seam continuity language only).
> - Optional: Tile 7 left-edge crop (right seam continuity language only).
>
> Generate: photorealistic aerial panorama tile (Tile 6 of 9 — POST-CORE VERTICAL RELEASE). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA LOCK:
> Fixed elevated diagonal-oblique aerial view (not top-down), rectilinear optics, strong telephoto-like depth compression, narrow FOV.
> Two-point perspective implied along horizon; verticals straight (no keystone).
> Do NOT zoom. Do NOT change altitude. Do NOT change pitch. No vertical recentering; cropping/clipping allowed.
>
> LIGHTING (Tiles 6–9 rule):
> Key light from LEFT (off-frame); primary cast shadows fall to the RIGHT. No sun disk.
>
> LAYOUT (match R1 exactly):
> Match R1: horizon line height, sky budget line, roof-field/skyline envelope, reading orientation, seam blending strips, anchor zone placement.
> Keep seam blending strips low-uniqueness (repeatable roof-fields/roads). No hero objects touching side edges.
>
> TILE 6 IDENTITY (Post-Core Vertical):
> Still dense and tall, but LESS iconic than Tile 5. Towers taper down and distribute; more glass and newer construction appears.
> Urban intensity without an “icon.” No unique skyline markers.
>
> INFRASTRUCTURE LAYERING (complex but not push-in):
> Layer roads, ramps, partial interchanges, service corridors, bridges, rail crossings, overpasses; occasional tunnel mouths.
> Optional: one small aerial/elevated transit station hint integrated into blocks (non-landmark).
> Avoid a close-up foreground highway slab dominating the bottom third (no push-in read).
>
> CIRCULATION CHARACTER:
> Busy, braided corridors embedded into blocks (no single clean hero avenue). Fragment long corridors with occlusions/cross-cuts.
> “Strong axial flow” may be suggested, but must NOT become one uninterrupted boulevard.
>
> COLOR / GRADIENT POSITION:
> Begin the post-core cooling: warmth and contrast gently decline relative to Tile 5; do not re-warm the scene.
>
> FORBIDDEN:
> iconic/landmark skyline markers • postcard silhouettes • a second “core” • nature dominance • heavy industry dominance
> wide-angle/fisheye/tilt-shift • CGI/illustration • readable text/logos