# Tile 1 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 1 R1 composition map — `tile1-r1.png`
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (OPTIONAL seam anchor): Tile 2 LEFT EDGE crop (when available) — `tile2-left-edge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Reference R1 is PRIMARY layout authority (horizon height, sky budget, envelope slope, reading orientation, seam zones, anchor zone).
> - Reference A (Tile 5 ruler) is SECONDARY and controls framing/scale physics ONLY. Do NOT import Tile 5 content identity.
> - Reference B (Tile 2 left-edge) is seam continuity ONLY for Tile 1 RIGHT edge. Not a layout blueprint.

## Generator prompt
> REFERENCES (ORDERED):
> - R1 Tile 1 composition map (PRIMARY layout authority).
> - Tile 5 ruler image (SECONDARY; framing/scale physics only).
> - Optional: Tile 2 LEFT EDGE crop (right-edge seam continuity only).
>
> Generate: photorealistic aerial panorama tile (Tile 1 of 9 — NATURE AS DOMINANT CHAOS / COASTLINE EXTREME). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA LOCK: fixed elevated diagonal-oblique aerial view (not top-down), rectilinear optics, strong telephoto-like depth compression, narrow FOV; two-point perspective implied along horizon; verticals straight (no keystone). Do NOT zoom / change altitude / change pitch / vertically recenter; cropping/clipping allowed.
>
> LIGHTING: clear, crisp daylight. Target key light from FAR RIGHT; cast shadows fall LEFT (best-effort). No visible sun disk.
>
> LAYOUT (match R1 exactly): horizon height + sky budget + envelope slope + reading orientation + seam zones + anchor zone. Keep seam zones quiet and stitch-friendly; keep the identity cluster inside the anchor zone.
>
> TILE 1 IDENTITY (“/” NOT “V”): RIGHT side is dominant cliff/hillside landmass rising to the RIGHT. LEFT side is open sea/inlet negative space. Avoid symmetric V-shaped valley/canyon; no centered river-valley “V”.
>
> ROAD STACK (intricated; blended into terrain, not highway porn):
> Show 2–3 distinct roadway traces stacked across the coastal hillside:
> - lower coastline road carved into rock (tunnels + retaining walls + short viaducts)
> - mid-slope contour road with switchbacks, partially occluded by trees/rock
> - upper expressway fragment/viaduct span (at least 1 bridge + 2 tunnel portals), not edge-to-edge clean
> Roads must interweave and cross via short viaducts; avoid one single clean highway ribbon. Roads must be partially occluded; no single roadway occupies the bottom third.
>
> TUNNELS (make it real): 2–4 tunnel mouths visible, staggered at different heights; include cut-and-cover segments and rockfall netting/retaining.
>
> PASSENGER RAIL (occasional, subordinate): one subtle passenger rail cue only (short hillside segment or tunnel mouth + brief viaduct), hugging terrain; not a hero rail corridor.
>
> DAM (occasional, integrated): optional small cliff-integrated dam/reservoir step OR spillway structure embedded into rock (reads as water control, not a big valley dam).
>
> FUNICULAR RAILWAY / AERIAL CABLE CAR (one only): optional hillside funicular track OR teleférico cable car line crossing one slope pocket; realistic scale; subordinate detail.
>
> SETTLEMENTS (more, varied, interconnected): increase hillside settlement pockets (layered midground + background): mix terraced village clusters + hillside houses + a few large mansions/villas. Add interconnection cues: stairways, footpaths, small pedestrian bridges, terraces, retaining walls, switchback alleys. Still non-urban: no grid, no skyline band.
>
> WATER + TERRAIN DRAMA (keep/increase): aggressive cascades/waterfall/stepped flow toward the coast; wet streaks on rock; rock pools. Sea caves/grottoes and cliff cavities encouraged.
>
> STITCH SAFETY: LEFT seam quiet open water only. RIGHT seam repeatable rock/vegetation + small non-unique buildings; no edge-clipped hero objects; no large linear element touching side edges.
>
> FORBIDDEN: skyline/megacity silhouettes • high-rises • urban grids/major avenues • centered V-valley • pastoral suburbia • beach resort/marina/yachts • readable text/logos • wide-angle/fisheye • tilt-shift • CGI/illustration
