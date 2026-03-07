# Tile 9 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 9 R1 composition map — `tile9-r1.png`
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (OPTIONAL seam anchor): Tile 8 RIGHT EDGE crop (when available) — `tile8-right-edge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Reference R1 is PRIMARY layout authority: horizon line, sky budget line, skyline envelope slope, reading orientation, seam zones, anchor zone.
> - Reference A (Tile 5 ruler) is SECONDARY and controls framing/scale physics ONLY (telephoto compression, vertical pressure, vanishing-height read). DO NOT import Tile 5 content identity.
> - Reference B (Tile 8 right-edge) is seam continuity ONLY (edge texture density / silhouette continuity language). Not a layout blueprint.
>
> PRECEDENCE:
> - R1 controls layout.
> - Ruler controls framing/scale physics.
> - Seam anchor controls only edge continuity language.

## Generator prompt (LOCKED — current best)
> REFERENCES (ORDERED):
> - R1 Tile 9 composition map: PRIMARY layout authority (horizon line, sky budget line, skyline envelope slope, reading orientation, seam zones, anchor zone).
> - Tile 5 ruler image: SECONDARY, framing/scale physics ONLY (telephoto compression, vertical pressure, vanishing-height read). DO NOT import Tile 5 content identity.
> - Optional seam anchor: Tile 8 RIGHT EDGE crop (edge continuity only; not a layout blueprint).
>
> Generate: photorealistic aerial panorama tile (Tile 9 of 9), portrait 1024×1536, ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA LOCK:
> Fixed elevated diagonal-oblique aerial view (not top-down), rectilinear optics, strong telephoto-like depth compression, narrow FOV.
> Two-point perspective implied along horizon; verticals straight (no keystone).
> Do NOT zoom. Do NOT change altitude. Do NOT change pitch. No vertical recentering; cropping/clipping allowed.
>
> LAYOUT (match the R1 map exactly):
> - SKY BUDGET + HORIZON LINE: fixed to the map; do not raise/lower.
> - READING ORIENTATION: strong diagonal bottom-left → top-right.
> - SKYLINE ENVELOPE (Tile 9 signature): higher on LEFT, descending toward RIGHT (per map).
> - SEAM BLENDING STRIPS (left/right): low-uniqueness repeatable industrial texture only; no hero objects touching seams; no clipped signature structures at edges.
>
> HARBOR / SHORELINE GEOMETRY (wedge):
> - The engineered shoreline must form a dominant diagonal land wedge that rises bottom-right → mid-right/top-right (↗).
> - Foreground + right side are dominated by PORT LANDMASS: container yard grid, quays, cranes, warehouses, service roads.
> - The navigable channel hugs the RIGHT edge and recedes into distance; avoid a wide centered river composition.
> - Use hard man-made edges: straight seawalls, angular quays, breakwaters, piers; no natural beach/cove shapes.
> - Add at least 2–4 quay fingers / dock basins / pier projections to sell “port geometry” (not just a shoreline line).
>
> INDUSTRIAL-ONLY IDENTITY (stop Tile 5 bleed):
> - This is NOT a CBD. No corporate downtown skyline.
> - Tall vertical elements must be INDUSTRIAL tall only: smokestacks, flare stacks, distillation columns, cranes, silos, gantries, cooling towers (utilitarian).
> - The built fabric is heavy infrastructure + service blocks: pipe forests, conveyors, tank farms, substations, warehouses, railyards, container stacks, truck staging, utility corridors.
> - Any distant “city” presence must read as low- to mid-rise utilitarian mass (service housing/warehouses), not prestige towers.
>
> PORT + SHIPPING (scale anchors):
> - Include at least one utilitarian cargo ship/tanker at correct scale near lower-right (not a hero centerpiece).
> - Include working port machinery: container cranes, mooring zones, ECH handlers, stacked containers, rail spurs into the port.
>
> LIGHTING / AIR / DEPTH (keep it “tasty”, not blurry):
> - No sun disk (sun prohibited).
> - Key light from LEFT; cast shadows fall to RIGHT (per canon). Wind pushes smoke/plumes to the RIGHT.
> - Keep visibility high: NO atmospheric veil/blanket, NO milky diffusion blur. (Depth allowed only as subtle distance desaturation + contrast rolloff; edges remain crisp and the horizon stays legible.)
> - Palette: cool-neutral desaturated polluted steel + dirty beige/soot-gray particulate; avoid cyan/blue cast drift; no warmth return as a global grade.
>
> STITCH SAFETY:
> - Edges (especially left seam toward Tile 8) must stay repeatable: container grids, roof-fields, pipe repetition, service yards.
> - No major corridor exiting cleanly at side edges; no unique landmark crane/tower clipped at edges.
>
> NEGATIVE / AVOID (hard bans):
> downtown skyline, CBD, corporate office towers, prestige skyscrapers, iconic spire, glass supertalls, postcard skyline,
> residential neighborhood, parks, nature dominance,
> wide-angle, fisheye, tilt-shift, CGI look,
> atmospheric veil, heavy distance blur, milky whiteout, volumetric diffusion blanket,
> visible sun disk,
> readable text/logos.
