# Tile 3 Prompts (R1-first)

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 3 R1 composition map — `tile3-r1.png`
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (OPTIONAL seam bridge composite): Tile 2 right crop + transparency + Tile 4 left crop — `tile2-4-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Reference R1 is PRIMARY layout authority: horizon height, sky budget, envelope/pressure read, reading orientation, anchor zone, seam zones.
> - Reference A (Tile 5 ruler) is SECONDARY and controls framing/scale physics ONLY: rectilinear telephoto compression feel, vertical pressure, vanishing-height read, sky-budget discipline.
>   Transfer FORBIDDEN from Reference A: any Tile 5 identity (no core silhouettes, no core axis, no sun disk).
> - Reference B (bridge composite), if provided, is seam conditioning ONLY: edge texture density, silhouette continuity language, distance rolloff language at the left/right edges.
>   Transfer FORBIDDEN from Reference B: copying its center layout; it is not a scene blueprint.

## Generator prompt
> REFERENCES (ORDERED):
> - R1 Tile 3 composition map (PRIMARY layout authority).
> - Tile 5 ruler image (SECONDARY; framing/scale physics only).
> - Optional: Tile 2–4 bridge composite (edge continuity only).
> 
> Generate: photorealistic aerial panorama tile (Tile 3 of a 9-tile megacity panorama — TRANSITION ZONE). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
> 
> CAMERA LOCK (do not drift):
> Fixed elevated diagonal-oblique aerial view (not top-down); rectilinear optics; strong telephoto-like depth compression; narrow-ish FOV; unified camera system across all tiles.
> No wide-angle distortion; no fisheye; no tilt-shift; no stylized filters; no illustration aesthetics.
> Do NOT zoom / change altitude / change pitch / vertically recenter. Cropping/clipping is allowed and preferred over reframing.
> 
> VISIBILITY (Tile 3 / canonical):
> High visibility: NO fog veil, NO milky smog blur, NO whiteout haze blanket.
> Depth perspective allowed only as subtle desaturation + contrast rolloff with distance; edges remain readable.
> 
> LIGHTING / ATMOSPHERE (tile-position accurate):
> Golden-hour warm-up toward the core, but still clear (not a veil).
> Key light from the RIGHT (off-frame); primary cast shadows fall to the LEFT.
> Sun disk / visible solar source is NOT allowed.
> 
> LAYOUT LOCK (match R1 exactly):
> Match R1 horizon height, sky budget, envelope/pressure read, reading orientation, anchor zone, seam blending zones.
> Keep seam zones stitch-friendly and low-uniqueness (repeatable roof-fields / mid-rise texture / generic street grain).
> 
> SCENE INTENT:
> Transitional urban system bridging Tile 1’s nature dominance and Tile 5’s cosmopolitan vertical intensity.
> Dense, irregular, lived-in city fabric that integrates nature and human-scale life — urban complexity without monumentality.
> Nature survives INSIDE the city rather than outside it.
> 
> COMPOSITION TENDENCY (subtle, canonical for Tiles 1–4):
> Maintain a weak diagonal bias bottom-right → top-left without forming a dominant axis.
> 
> REQUIRED ELEMENTS (compose as one coherent, layered city):
> - Dense continuous urban fabric, predominantly low- to mid-rise; density through accumulation, heterogeneity, overlap (NOT height).
> - Interwoven green urbanism inside the fabric: trees within blocks, planted medians, weedy vegetation along infrastructure.
> - Mixed residential fabric: mid-rise apartment blocks + smaller houses; heterogeneous ages and styles.
> - Human-scale circulation: pedestrian stairways, footbridges, small overpasses.
> - Neighborhood commerce: market strips, corner shops, small ground-floor retail.
> - Rooftop life: water tanks, laundry lines, small rooftop structures; roof clutter as scale anchors.
> - Pocket parks / courtyards (subtle, secondary).
> - Embedded transit: small subway entrances, short elevated rail segments, non-monumental stations.
> - Canalized stream / river remnant (non-heroic):
>   Concrete channel with softened vegetated edges.
>   STITCHING RULE (HARD): it may enter from top/bottom, but must curve, fragment, be occluded, dissolve, or terminate internally.
>   It must NOT run cleanly into the left or right seams; no large linear element touching side edges.
> 
> FRAMING STABILITY (Tile 5 as ruler; treat drift as pitch drift):
> NEVER vertically recenter to “fit” a crest/subject. If something wants to clip, let it clip; keep the same sky budget.
> If sky feels too open: add roof-field mass, stacked midground slabs, and haze INSIDE the distance volume — do NOT open more sky.
> Prevent push-in reads: reduce single near-foreground dominance; add depth via midground stacking, overlap, occlusion; keep any crest subordinate (no skyline silhouette band).
> 
> FORBIDDEN MOTIFS (must not appear):
> - Iconic skyline silhouettes; landmark towers; heroic vertical forms; distant high-rise skyline band.
> - Large scenic parks or landscaped masterplans; stadiums or civic megastructures.
> - Purely residential suburbia.
> - Purely infrastructural dominance (belongs to Tile 7).
> - Pristine/untouched nature (belongs to Tile 1).
> - Sun disk or visible solar source.
> - Readable text/logos.