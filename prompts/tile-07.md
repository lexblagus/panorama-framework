# Tile 7 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam bridge composite): Tile 6 right crop + transparency + Tile 8 left crop — `tile6-8-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no landmark silhouettes, no iconic core axis, no sun disk).
> - Transfer ONLY from Reference B (if provided): left/right seam conditioning (silhouette continuity, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout; it is seam conditioning, not a scene blueprint.

## Generator prompt
> Photorealistic aerial panorama tile (Tile 7 of a 9-tile megacity panorama). Portrait 1024×1536.
>
> CAMERA LOCK (do not drift): fixed elevated camera; diagonal-oblique aerial view (not top-down); rectilinear optics; strong telephoto-like depth compression; unified camera system consistent across all tiles; no wide-angle distortion; no tilt-shift; no stylized filters or illustration aesthetics.  :contentReference[oaicite:0]{index=0}
>
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.  :contentReference[oaicite:1]{index=1}
>
> LIGHTING / ATMOSPHERE (tile-position accurate): golden-hour family lighting but with warmth fading into desaturated haze. Sun disk / visible solar source is NOT allowed. Key light originates from the LEFT (off-frame); primary cast shadows fall to the RIGHT; brightest haze/sky pressure sits on the LEFT side.  :contentReference[oaicite:2]{index=2}
>
> SCENE INTENT: a late-stage urban district transitioning toward logistics and service dominance between the dense core and the industrial periphery. The city supports a large resident population, but residential life is compressed and subordinated to circulation, commerce, and utilities. This is NOT suburbia and not a residential neighborhood; it feels older, heavier, negotiated—shaped by throughput rather than comfort.  :contentReference[oaicite:3]{index=3}
>
> DIRECTIONAL CONTINUITY (post-core release): dominant spatial energy reads as a diagonal bottom-left → top-right, expressed through mass orientation and circulation layering (not cinematic tilt).  :contentReference[oaicite:4]{index=4}
>
> REQUIRED ELEMENTS (logistics-driven urban form; dense, layered, telephoto-compressed):
> - Large residential blocks: extensive, repetitive working-class slabs; non-iconic; population support (not neighborhood identity).
> - Residential mass interwoven with infrastructure: roads/ramps cutting through housing clusters; buildings wrapped around circulation and utilities.
> - Broad load-bearing roads with layered intersections.
> - Multi-level circulation: surface streets + elevated roads/flyovers + ramps/partial interchanges; occasional tunnel entrances/underpasses.
> - Early logistics + service traffic (present but not dominant): rigid multi-axle trucks, urban cargo vehicles, articulated/semi-trailers, fuel/gas tankers; cab-over and non-cab-over; muted orange/brown tarp truck bodies (new + weathered). Prefer vehicle diversity over vehicle volume.
> - Low-rise commercial slabs, warehouses, service buildings; embedded utilities (gas pipelines, water backbone, service corridors, utility installations).
> - Increase midground stacking: residential slabs + warehouses + service yards overlapping in layers to stabilize scale (avoid a single near-foreground interchange).  
>
> FRAMING + SCALE DISCIPLINE (Tile 5 as ruler): treat vertical drift as camera pitch drift; do NOT vertically recenter to fit towers/smoke/interchanges; cropping/clipping is preferred. If the true horizon is hazed out, use corridor/roof-field vanishing height as the horizon proxy and keep pitch consistent with Tile 5. If sky feels too open, add roof-field/infrastructure bulk or haze inside the distance volume—do NOT open more sky. Prevent push-in reads by reducing near-field dominance and adding depth via midground stacking/overlap.  
>
> FORBIDDEN MOTIFS (must not appear):
> - Suburban residential patterns; scenic/landscaped housing; pedestrian-centric design; isolated/self-contained neighborhoods.
> - Iconic skylines or landmark architecture.
> - Full industrial systems (ports/refineries/container yards); industrial dominance must remain absent.  
