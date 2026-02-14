# Tile 3 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam bridge composite): Tile 2 right crop + transparency + Tile 4 left crop — `tile2-4-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no landmark silhouettes, no core axis, no sun disk).
> - Transfer ONLY from Reference B (if provided): left/right seam conditioning (silhouette continuity, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout; it is seam conditioning, not a scene blueprint.

## Generator prompt
> Photorealistic aerial panorama tile (Tile 3 of a 9-tile megacity panorama). Portrait 1024×1536.
>
> CAMERA LOCK (do not drift): fixed elevated camera; diagonal-oblique aerial view (not top-down); rectilinear optics; strong telephoto-like depth compression; unified camera system consistent across all tiles; no wide-angle distortion; no tilt-shift; no stylized filters or illustration aesthetics.
>
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.
>
> LIGHTING / ATMOSPHERE (tile-position accurate): golden-hour warm-up with early haze. Sun disk / visible solar source is NOT allowed. Key light comes from the RIGHT (off-frame); primary cast shadows fall to the LEFT.
>
> SCENE INTENT: a transitional urban system bridging Tile 1’s nature dominance and Tile 5’s vertical cosmopolitan core. Dense, irregular, lived-in city fabric that integrates nature and human-scale life — urban complexity without monumentality. Nature survives INSIDE the city rather than outside it.
>
> COMPOSITION TENDENCY (subtle): maintain a weak diagonal bias bottom-right → top-left without forming a dominant axis.
>
> REQUIRED ELEMENTS (compose as one coherent, layered city):
> - Dense continuous urban fabric, predominantly low- to mid-rise; density through accumulation, heterogeneity, overlap (not height).
> - Canalized stream / river remnant: concrete channel with softened vegetated edges (non-heroic).
> - Interwoven green urbanism inside the fabric: trees within blocks, planted medians, weedy vegetation along infrastructure.
> - Mixed residential fabric: mid-rise apartment blocks + smaller houses; heterogeneous ages and styles.
> - Human-scale circulation: pedestrian stairways, footbridges, small overpasses.
> - Neighborhood commerce: market strips, corner shops, small ground-floor retail.
> - Rooftop life: water tanks, laundry lines, small rooftop structures (roof clutter as scale anchors).
> - Pocket parks / courtyards (subtle, secondary).
> - Embedded transit: small subway entrances, short elevated rail segments, non-monumental stations.
>
> FRAMING STABILITY (Tile 5 as ruler): treat vertical drift as camera pitch drift; NEVER vertically recenter to fit a crest/subject. Crop/clip if needed; maintain telephoto “vertical pressure”. If sky feels too open, add roof-field mass, stacked midground slabs, and haze inside the distance volume—do NOT open more sky. Prevent push-in reads by reducing single near-foreground dominance and adding depth via midground stacking, overlap, and occlusion; keep any roof-field crest subordinate (no skyline silhouette).
>
> FORBIDDEN MOTIFS (must not appear):
> - Iconic skyline silhouettes; landmark towers; heroic vertical forms; distant high-rise skyline band.
> - Large scenic parks or landscaped masterplans; stadiums or civic megastructures.
> - Purely residential suburbia.
> - Purely infrastructural dominance (belongs to Tile 7).
> - Pristine/untouched nature (belongs to Tile 1).
> - Sun disk or visible solar source.
