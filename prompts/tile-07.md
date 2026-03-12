# Tile 7 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference R1 (REQUIRED): Tile 7 composition map — `tile7-r1.png`
> - Reference A (REQUIRED): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (OPTIONAL seam bridge composite): Tile 6 right crop + transparency + Tile 8 left crop — `tile6-8-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - R1 is PRIMARY layout authority (horizon height, sky budget, envelope, reading orientation, seam/anchor zones).
> - Tile 5 ruler controls framing/scale physics ONLY (telephoto compression, vertical pressure, vanishing-height read). Do NOT import Tile 5 content identity.
> - Seam bridge (B), if provided, is edge continuity ONLY (edge texture density / silhouette continuity language / distance rolloff at both seams). Not a layout blueprint; do NOT copy its center.

## Generator prompt (LOCKED)
> REFERENCES (ORDERED):
> - R1 Tile 7 composition map (PRIMARY layout authority).
> - Tile 5 ruler image (SECONDARY; framing/scale physics only).
> - Optional: Tile 6–8 bridge composite (SEAM continuity only; never a scene blueprint).
>
> Generate: photorealistic aerial panorama tile (Tile 7 of 9 — LOGISTICS TRANSITION + EMBEDDED URBAN AIRPORT). Portrait 1024×1536. Ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT flip horizontally.
>
> CAMERA LOCK:
> Fixed elevated diagonal-oblique aerial view (not top-down), rectilinear optics, telephoto-like compression, narrow FOV.
> Two-point perspective; verticals straight (no keystone).
> Do NOT change pitch. Do NOT change FOV. Do NOT vertically recenter; cropping/clipping allowed.
>
> REFRAME WIDER (ANTI-ZOOM, HARD):
> Pull back so the scene reads ~15% wider and more distant than the default tendency.
> Keep the SAME horizon line height and SAME global vanishing point/perspective (match R1 + ruler).
> Show MORE surrounding city context; all elements appear smaller in the frame (more roof-field and district area visible).
> The airport deck must occupy a smaller fraction of the image (far-midground), not dominate the midground.
> Achieve “wider” by increasing visible city area (foreground + lateral field), NOT by adding extra sky.
>
> RULER SCALE MATCH (HARD):
> Match Tile 5 ruler’s apparent pixel scale for buildings/vehicles.
> If buildings/vehicles read larger than Tile 5, you are zoomed in — pull back until scale matches.
>
> VISIBILITY (anti-fog):
> High visibility: NO fog veil, NO milky smog blur, NO volumetric whiteout.
> Distance perspective allowed only as subtle desaturation/contrast rolloff; edges remain crisp.
>
> LIGHTING (Tiles 6–9):
> Key light from LEFT (off-frame); shadows fall to RIGHT. No visible sun disk.
>
> LAYOUT LOCK (match R1 exactly):
> Match R1 horizon height, sky budget, envelope, reading orientation, anchor zone, seam blending strips.
>
> DRY LOGISTICS TRANSITION (HARD):
> - Tile 7 must remain dry.
> - No visible river, coastline, harbor, bay, canal, or distant open-water horizon read.
> - Do not allow far-background blue bands or reflective planes that read as water.
> - Any reflective surfaces must read as roofs, glass, paved surfaces, airport infrastructure, or industrial slabs — not water.
>
> SEAM STRIP LOCK (ABSOLUTE):
> Leftmost 120px and rightmost 120px are SEAM BLENDING STRIPS: low-uniqueness repeatable texture ONLY (midrise roofs, repeating blocks, haze).
> FORBIDDEN inside seam strips: runway edges, deck edges, terminal edges, taxiway paint/lines, aircraft, jet bridges, cranes, overpasses/bridges/viaducts, rail lines, or any long straight high-contrast line.
> Airport deck/runway bounding box must stay inside x = 160..864 (never near side edges).
>
> TILE 7 IDENTITY:
> Late-stage urban fabric transitioning toward logistics/service dominance.
> High density via large footprints + layered infrastructure; low- to mid-rise mass; older/heavier service city.
> Not suburbia. Not full port/refinery dominance.
>
> ANTI–TILE 5 BLEED (HARD):
> The far background must NOT contain an iconic CBD cluster or recognizable “core skyline crest.”
> BAN: tall clustered supertalls, art-deco spires, Manhattan-like hero skyline, any centered skyline hump/crest.
> REPLACE WITH: flattened distant urban haze + logistics sprawl + low industrial silhouettes + distant low ridgelines; background is non-hero, low-verticality, low-contrast.
> If any distant “city center” exists at all, it may appear only as a tiny indistinct low silhouette pushed to the far-left third (never centered), heavily diffused, with no readable landmark shapes.
>
> DIRECTIONAL ENERGY:
> Dominant energy bottom-left → top-right via mass orientation + layered circulation (not cinematic tilt).
>
> INFRASTRUCTURE LAYERING (stacked, not push-in):
> Layer roads/ramps/partial interchanges, surface streets + flyovers, short overpasses; occasional tunnel mouths/underpasses.
> Warehouses + service slabs + embedded utilities (pipelines, water backbone, service corridors).
> Avoid a single near-foreground interchange filling the bottom third.
> Break any long corridor before it reaches the seam strips (occlusions, block interruptions, stepped segments).
>
> VEHICLES (Tile 7 signature; diversity > volume):
> Follow Core Canonical Vehicles (Tiles 7–9 heavy logistics mix). Emphasize variety over volume.
> Include some muted orange/brown tarp-covered cargo trucks as diversity accents, plus tankers, semis, rigid multi-axle trucks, occasional road-train multi-trailer trucks. Cars/buses remain minor scale cues.
>
> AIRPORT (canonical; embedded, non-hero; stitch-safe; DECK required):
> Create a FAR-MIDGROUND urban airport tarmac DECK embedded into dense city fabric (Congonhas/LAX-under-runway vibe).
> HARD REQUIREMENTS:
> 1) LAYERED DECK (must be elevated):
>    - runway/tarmac is a deck/viaduct on columns/structure (NOT ground-level).
>    - underside beams/columns visible; deck shadow falls onto roads/city beneath.
> 2) VANISHING-POINT BLEND:
>    - tarmac is a trapezoid whose long edges converge to the SAME global vanishing point as roads/roof-fields.
>    - no horizon-parallel “flat bar” runway.
> 3) UNDER-TARMAC ROAD NETWORK:
>    - >=2–3 visible underpasses/tunnel mouths where avenues pass UNDER the deck and re-emerge.
> 4) SEAM SAFETY (REPEAT / ENFORCE):
>    - deck/runway stays well inside x = 160..864 and never enters the 120px seam strips.
>    - no runway/deck edges, markings, or taxiway lines trending into side seams.
> 5) BREAK LONG STRAIGHT LINES BEFORE SEAMS:
>    - if a deck/runway edge trends toward a side, it must terminate/occlude/step down into buildings well before the seam strip.
>    - no continuous deck/runway edge line may run toward or parallel the frame edges.
> 6) ANTI-ZOOM / NO HERO LEGIBILITY:
>    - do NOT zoom in to make airport readable.
>    - runway markings/gates/aircraft details should be barely readable at this distance.
>    - if the airport becomes crisp/hero, pull back and reduce its dominance.
>
> AIRPORT LIFE + AIRCRAFT RANDOMIZATION (no repetition):
> Add realistic airport activity at correct scale:
> - 3–7 aircraft total, mixed positions (some parked at gates, one taxiing/holding).
> - jet bridges visible for at least 1–3 parked aircraft.
> - small control/observation tower (non-hero).
> - small ground support vehicles: baggage carts, belt loaders, fuel truck, pushback tug, service vans.
> Aircraft variety rules (HARD):
> - do NOT repeat the same aircraft model; mix different silhouettes/sizes (narrow-body, regional jet, turboprop; optional one wide-body at most).
> - vary liveries using FAKE/ARTISTIC branding (abstract stripes/blocks/gradients/symbols); NO readable airline names/logos/text.
>
> FORBIDDEN:
> close-up framing • runway filling the frame • airport as giant empty field • hero terminal showcase
> triptych/borders/seams • readable airline names/logos/text
> wide-angle/fisheye/tilt-shift • CGI/illustration • suburbia/parks
> full ports/refineries/container megayards as the main subject
> iconic centered CBD crest • spires/supertall clusters • “Tile 5 skyline” look-alikes • river/coastline/harbor/canal/open-water read
