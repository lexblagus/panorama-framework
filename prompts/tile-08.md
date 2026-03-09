# Tile 8 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 8 composition map — `tile8-r1.png`
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (REQUIRED seam bridge composite): Tile 7 right crop + transparency + Tile 9 left crop — `tile7-9-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - R1 is PRIMARY layout authority: match horizon height, sky budget, skyline/industrial envelope, reading orientation, anchor zone, seam blending strips.
> - Reference A (Tile 5 ruler) controls framing/scale physics ONLY (telephoto compression feel, vertical pressure, sky discipline, midground scale). DO NOT import Tile 5 identity.
> - Reference B (bridge) is seam language ONLY:
>   - LEFT seam continuity with Tile 7: generic logistics/yard/warehouse repetition (ABSOLUTELY NO airport/runway/terminal identity).
>   - RIGHT seam continuity with Tile 9: industrial silhouette height profile, distance rolloff language, industrial texture density (NO channel/water/ships).
> - Transfer FORBIDDEN from any reference: copying full composition/layout, landmark duplication, importing airport identity, importing navigable channel/ships.
>
> LOCK / PRESERVE (HARD):
> - NON-MIRRORED OUTPUT: do NOT flip horizontally.
> - CAMERA LOCK: fixed diagonal-oblique aerial view (not top-down), rectilinear optics, telephoto-like compression, narrow FOV.
> - Do NOT change pitch/FOV/altitude. No vertical recentering; cropping/clipping is allowed.

## Generator prompt (LOCKED)
> REFERENCES (ORDERED):
> - R1 Tile 8 composition map (PRIMARY layout authority): match horizon height, sky budget, envelope, anchor zone, seam strips, reading orientation.
> - Tile 5 ruler image (SECONDARY; framing/scale physics only): match telephoto compression + apparent scale; do NOT import Tile 5 identity.
> - Tile 7–9 bridge composite (REQUIRED; seam language only): left seam continuity with Tile 7 substrate; right seam continuity with Tile 9 industrial silhouette/rolloff; never a layout blueprint.
>
> Generate: photorealistic aerial panorama tile (Tile 8 of 9 — INDUSTRIAL / INFRASTRUCTURE, “CARRARA INDUSTRIAL RIDGE”). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA LOCK:
> Fixed elevated diagonal-oblique aerial view (not top-down), rectilinear optics, strong telephoto-like depth compression, NARROW field of view.
> Coherent two-point perspective implied along the horizon; verticals remain straight (no keystone).
> Do NOT zoom. Do NOT change altitude. Do NOT change pitch. No vertical recentering; cropping/clipping is allowed.
>
> COMPOSITION / STITCH CONTROL (PIXEL-LOCK):
> - Leftmost 120px and rightmost 120px are SEAM BLENDING STRIPS: low-uniqueness repeatable industrial texture only (pipe racks, low warehouses, rail spurs, haze).
> - FORBIDDEN inside seam strips: dominant quarry face, big cooling towers, tall stacks, hero cranes, conveyor endpoints, strong diagonals, or any long straight high-contrast line.
> - No major corridor begins/ends cleanly on edges; lines must curve/occlude internally before reaching seam strips.
>
> HARD CONSTRAINTS (NON-NEGOTIABLE):
> - NO navigable water channel. NO ships/tankers. Avoid prominent open water.
> - Any liquid only as small industrial retention basins/puddles/slurry ponds (non-compositional).
> - NO visible sun disk.
> - Lighting: key light from LEFT; shadows fall to RIGHT.
> - Wind: pushes smoke/steam/dust to the RIGHT (short, subtle, non-hero plumes; no epic columns).
>
> AIR / DEPTH (LATE-RIGHT):
> - Strong distance rolloff and distance collapse: far background becomes ghosted silhouettes, but horizon remains legible.
> - Midground remains readable; avoid uniform veil/blanket and avoid full whiteout.
> - Palette: polluted steel + tan/amber industrial dust tint; desaturated; NOT clean golden sunlight.
>
> TILE 8 IDENTITY:
> - Ultra-dense petrochemical + intermodal megacomplex; no residential identity; no parks; no “city sparkle.”
> - Horizontal substrate with 2–3 clustered refinery nodes (chimneys/stacks limited to those nodes only).
> - Tank farms (cylinders + some spherical LPG tanks), containment berms/spill channels.
> - Power block: turbine hall + cooling towers + dense substation/switchyard + pylons fading via distance rolloff.
> - Intermodal logistics: container hardstands/stacks, cranes/gantries, rail spurs, long cargo trains, switching ladders, heavy truck staging.
>
> REQUIRED ANCHOR — CARRARA INDUSTRIAL RIDGE (HARD):
> - Place a tall engineered Carrara-like ridge at CENTER-LEFT / LEFT-MID (but NOT inside the left 120px seam strip).
> - Must read as human-sculpted quarry/cut ridge: bright chalky cut faces, clean geometric terraces/benches, sharp bench lines, retaining walls.
> - NO greenery. NOT natural mountains. NOT scenic.
>
> RIDGE MUST BE INDUSTRIALIZED (NO EMPTY BUFFER) — HARD:
> - Ridge is colonized by industry on multiple terraces; NO wide empty apron/road band separating ridge from refinery.
> - Terraces/benches are built-out industrial platforms packed with pipe racks, catwalks, tank clusters, pump sheds, conveyor galleries,
>   crushers/screening towers, substations/transformers, maintenance gantries.
> - Industry climbs terraces: multiple pipe corridors and conveyors run UP and ACROSS the ridge, with bridge-like trusses and retaining-wall penetrations.
> - Any ridge roads are narrow service switchbacks only (secondary), never a broad empty corridor.
> - Terrace population requirement: at least 60–80% of visible benches contain industrial objects.
>
> REQUIRED ANCHOR — COVERED CONVEYOR (STITCH-SAFE):
> - Include ONE major covered conveyor in the midground, running mostly LEFT–RIGHT (near horizontal) or a shallow arc.
> - Endpoints must disappear behind structures; it must NOT run border-to-border and must NOT hit edges as a strong diagonal.
>
> GRADIENT / AMBIENCE (SUBTLE, RIDGE-ANCHORED):
> - Ridge may anchor a gentle ambience gradient: slightly clearer/warmer on far-left (Tile 7-adjacent), heavier dust/rolloff to the right (Tile 8/9-adjacent).
> - Must be a GRADIENT, not a binary split. No hard seam bands.
>
> FORBIDDEN:
> airport/runway/terminal identity • navigable channel • ships/tankers • ports-as-main-subject
> residential neighborhoods • parks/nature dominance • landmark buildings • decorative signage
> wide-angle/fisheye/tilt-shift/miniature look • CGI/illustration • readable text/logos
>
> OUTPUT:
> 1024×1536 portrait.