# Tile 5 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (REQUIRED): R1 Tile 5 composition map — `tile5-r1.png`
> - Reference M (RECOMMENDED): Central Master reference — `master.png`
> - Reference B (OPTIONAL seam bridge composite, used ONLY in a seam-lock pass after Tile 4 + Tile 6 exist):
>   Tile 4 right crop + transparency + Tile 6 left crop — `tile4-6-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Reference A (R1) is the PRIMARY layout authority: horizon/sky budget/skyline envelope/anchor zone/seam zones/reading orientation.
> - Reference M (Central Master) is SECONDARY and controls ONLY palette + diffusion + “rig feel” (DO NOT import its exact layout).
> - Reference B (Bridge) is seam conditioning ONLY: left/right edge continuity (silhouette height profile, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying neighbor composition into the center, landmark duplication, importing Tile 4/6 content into the anchor zone. Bridge is NOT a scene blueprint.

## Generator prompt (LOCKED — current best)

> REFERENCES (ORDERED):
> - R1 Tile 5 composition map (PRIMARY layout authority): match horizon line height, sky budget line, skyline envelope hump, anchor zone box, edge-safe seam zones, seam blending strips, reading orientation.
> - Central Master (SECONDARY): palette + diffusion + global rig feel only; do not import its layout.
> - Optional bridge composite (ONLY seam-lock pass): edge continuity only; never import neighbor content into center.
>
> Generate: photorealistic aerial panorama tile (Tile 5 of a 9-tile megacity panorama — ICONIC CORE / RULER). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA + FOV CLAMP (do not drift):
> Fixed elevated diagonal-oblique rooftop/drone viewpoint (not top-down), rectilinear optics, strong telephoto-like depth compression, NARROW field of view.
> Coherent two-point perspective implied along the horizon; verticals remain straight (no keystone).
> Do NOT zoom. Do NOT change altitude. Do NOT change pitch. No vertical recentering; cropping/clipping is allowed.
>
> COMPOSITION (bind to the R1 map):
> - SKY BUDGET: keep “pure sky” as a disciplined top band (match the map; do NOT open extra sky).
> - SKYLINE ENVELOPE: centered hump/crest peaking near the middle and gently falling toward both sides (match the map).
> - HORIZON LINE: fixed at the map height; do not raise/lower.
> - READING ORIENTATION: dominant read is bottom → top (central pull toward skyline crest).
> - PRIMARY ANCHOR ZONE: highest-density “core” features live inside the anchor zone box; avoid unique hero shapes inside seam blending strips; do not clip major towers at left/right edges.
>
> TILE 5 IDENTITY (PEAK PRESSURE / RULER):
> Maximum vertical pressure for the whole panorama: dense skyline crest near the upper frame boundary, telephoto-compressed stack, amber peak + maximum atmospheric diffusion.
> Avoid postcard symmetry: prefer several comparable peaks (no single hero spire).
>
> CIRCULATION (INTRICATE + EMBEDDED, NON-HERO):
> Multiple intertwined avenues + service spines with frequent merges/splits, partially occluded by blocks.
> Avenues must feel embedded/interlaced into buildings (like a woven fabric), not cleanly carved.
> NO single uninterrupted straight boulevard to the horizon. NO single dominant interchange. NO giant freeway ribbon.
> Break any long corridor with occlusions, cross-cuts, short overpasses, block interruptions, and lateral feeders.
> Center band must read as busy texture, not a privileged high-contrast spine.
>
> DEPTH / LAYERING (keep push-in out):
> Foreground: present but minor — rooftops, street hints, small vehicles; no huge near-field roadway filling the bottom.
> Midground: the texture engine — stacked blocks, mixed corridors, partial viaduct pieces, short bridges/overpasses (not edge-to-edge).
> Background: compressed skyline mass dissolving slightly with distance; haze increases with distance only (preserve the telephoto stack).
>
> ARCHITECTURE DIVERSITY (FORCED HETEROGENEITY — avoid repetition):
> Strong mix of districts/eras in one tile. Do NOT allow large contiguous areas of the same facade grid.
> Ensure at least 6–8 distinct typology/facade languages visible at once, spread across the frame (not all in one spot):
> 1) modern glass/steel towers with varied crowns/setbacks (not uniform curtain walls)
> 2) dense mid-rise residential with balconies (multiple balcony rhythms)
> 3) brutalist/service slabs (vents, buttresses, catwalks)
> 4) older brick/stone commercial blocks (cornices, subtle art-deco / neo-gothic hints)
> 5) postwar concrete offices (horizontal bands)
> 6) mixed-use podiums + stepped terraces (irregular rooflines)
> 7) small embedded utility/service inserts (substations/utility yards), subtle and non-landmark
> 8) scattered vernacular/patchwork infill (stucco/painted concrete/metal roofs)
> Quadrant rule: each quadrant of the frame should show at least 2 different typologies (architectural relatives, not twins).
>
> ELEMENT DIVERSITY (DISTRIBUTED, NOT LANDMARKED):
> Increase rooftop clutter variety: tanks, HVAC farms, solar, antennas, billboards, water towers, vents, catwalks, laundry, skylights.
> Add layered transport cues without making them hero objects:
> - rail presence (surface/trench) AND one short elevated metro/tram segment (not clean edge-to-edge)
> - embedded station/stop hint (canopies/vents/stair cores), integrated into blocks (not centered)
>
> LIGHTING / COLOR:
> Tile 5 amber peak + maximum diffusion. Centered / frontal warm golden-hour illumination (no strong left/right key).
> Default: NO visible sun disk.
>
> STITCH / SEAM SAFETY:
> Left/right seam blending strips: low-uniqueness repeatable texture only (roof-fields, mid-rise repetition, haze).
> No major corridor exiting cleanly at side edges; no clipped landmark towers at edges; no edge-to-edge bridge/highway spans.
>
> NEGATIVE / AVOID:
> wide-angle • fisheye • barrel distortion • tilt-shift • miniature look • CGI • illustration • sterile uniform tower field • single hero boulevard • single dominant interchange • perfect symmetry • edge-clipped megastructure • heavy industry • industrial decay • rural/nature dominance • readable text/logos
>
> CALIBRATION KNOBS (edit these first if needed):
> - If too open: add skyline mass + midground stacking + distance haze (not more sky).
> - If too zoomed/push-in: reduce near-field dominance; increase midground overlap and background compression.
> - If corridors become too clean: increase occlusions and cross-cuts; break ribbons into segments; add lateral feeders.

## Sun Disk Variant (OPTIONAL — only when explicitly enabled)
> SUN DISK VARIANT (Tile 5 + Central Master only):
> Allow a visible solar disk fully diffused through haze, no hard edge.
> Disk may be partially cropped; never reframe to fit it.
