# Tile 9 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam anchor): Tile 8 RIGHT EDGE crop (when available) — `tile8-right-edge.png`
> - Reference C (Optional mood reference, if you use one): industrial terminus mood board — `tile9-mood.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 landmark identity (no warm iconic core motifs, no hero skyline).
> - Transfer ONLY from Reference B (if provided): left-edge seam continuity (silhouette height profile, haze rolloff language, edge texture density).
> - Transfer ONLY from Reference C (if provided): atmosphere palette and industrial “feel” (smog density, color temperature), NOT geometry.
> - Transfer FORBIDDEN from References B/C: copying full composition/layout or inventing a new camera rig.

## Generator prompt
> Photorealistic aerial panorama tile (Tile 9 of a 9-tile megacity panorama). Portrait 1024×1536.
>
> CAMERA LOCK (do not drift): fixed elevated diagonal-oblique aerial view; rectilinear optics; strong telephoto-like depth compression; unified camera system consistent across all tiles; no wide-angle distortion; no tilt-shift; no stylized filters or illustration aesthetics.
>
> NON-MIRRORED OUTPUT: do not horizontally flip/mirror the image.
>
> REFERENCE CONDITIONING (ruler): use the Tile 5 ruler image as Reference A to control framing/scale physics only (telephoto compression feel, vertical “pressure”, sky-budget discipline, midground scale). DO NOT borrow Tile 5 content identity (no skyline motifs, no landmark silhouettes, no central-axis logic, no sun disk).
>
> LIGHTING / ATMOSPHERE (endpoint): maximum haze mandate — strongest atmospheric density in the panorama. Sun is PROHIBITED. Key light originates from the LEFT (off-frame); primary cast shadows fall to the RIGHT. Wind pushes chimney smoke to the RIGHT. Far background collapses into milky smog: ghost silhouettes only (no crisp edges); avoid full whiteout; keep the midground faintly readable with soft edges. Haze may glow softly but must not increase contrast or re-warm the scene globally.
>
> COLOR / GRADE (anti-drift): after Tile 5, warmth must not “return” as a global grade, but Tile 9 must also avoid cyan/blue cast drift. Target palette: desaturated polluted steel + dirty beige / soot-gray particulate (cool-neutral overall, NOT “blue-hour”). Any warmth allowed only as tiny utilitarian sodium/work-light blooms under haze — never a global regrade. No city-sparkle/nightlife.
>
> COMPOSITION LOCK (DO NOT DRIFT):
> - Dominant read is a strong diagonal running bottom-left → top-right.
> - Primary water body is a navigable industrial river/channel occupying the bottom-right quadrant, hugging the RIGHT edge, and receding into the horizon (distance-collapse into haze). Avoid a hard “L” turn that re-orients the scene.
> - Left bank (land side) is a continuous industrial frontage: docks, quays, straight seawalls, containment edges, hard angular shoreline geometry.
>
> ENGINEERED SHORELINE REQUIRED: land–water boundary must read as engineered, industrial, predominantly straight/angular/artificial (docks/harbors/containment structures). Organic/eroded/natural coastline is NOT allowed.
>
> PORT + SHIPPING (scale anchors):
> - Realistic port infrastructure: piers, cranes, mooring zones, container stacks, service roads, cargo trucks, empty container handlers (ECH).
> - Include at least ONE utilitarian cargo ship or tanker at correct scale; prefer presence near the lower-right without making it a hero centerpiece.
>
> HEAVY INDUSTRIAL MASS (ultra-dense, layered): refineries/petrochemical plants, stacks, pipe forests, conveyors, warehouses, power/utility infrastructure, railyards and track fans. Skyline edges must dissolve into haze (no crisp skyline band).
>
> FRAMING STABILITY (Tile 5 as ruler): treat vertical drift as camera pitch drift; do not vertically recenter to fit smokestacks/smoke. If the true horizon is erased by smog, use rail/road/roof-field vanishing height as the shared horizon proxy; keep pitch consistent with Tile 5. Crop/clip when elements pressure the top. If sky feels too open, add industrial mass, stacked midground infrastructure, or haze inside the distance volume—do NOT open more sky. Prevent push-in reads by avoiding a single foreground yard/track fan; reduce near-field dominance and emphasize layered repetition into depth.
>
> FORBIDDEN MOTIFS (must not appear): nature; landmark buildings; residential streets; visible sun/solar source; crisp skyline edges; nightlife sparkle.


# Experimental prompt

> Generate: photorealistic aerial panorama tile (Tile 9 of 9), portrait 1024×1536, ultra-detailed realism.
> NON-MIRRORED OUTPUT: do NOT horizontally flip/mirror the image.
> 
> REFERENCE / LAYOUT (STRICT):
> Use the provided “R1 — Tile 9 composition map” sketch as the PRIMARY layout authority.
> Match its: sky budget line, skyline envelope slope, horizon line height, reading orientation arrow (bottom-left → top-right), edge-safe zones, seam blending zones, and primary anchor zone placement.
> 
> REFERENCE CONDITIONING (RULER POLICY):
> - Reference A (Ruler): Tile 5 ruler image — use ONLY for camera/framing physics + scale feel:
>   telephoto-like compression, rectilinear perspective, horizon/vanishing-height read, vertical “pressure”, sky-budget discipline, midground scale.
> - Forbidden transfer from Reference A: any Tile 5 identity (no iconic core, no hero skyline motifs, no central-axis logic, no sun disk).
> - Optional seam anchor: Tile 8 RIGHT EDGE crop — use ONLY for right-edge seam continuity language (silhouette height profile + haze rolloff + texture density), not full composition.
> - Optional mood board: Tile 9 mood — use ONLY for palette/atmosphere “industrial feel”, not geometry/camera.
> 
> CAMERA LOCK (do not drift):
> Fixed elevated diagonal-oblique aerial view; rectilinear optics; strong telephoto-like depth compression;
> unified camera system consistent across all tiles. No wide-angle distortion, no fisheye/barrel, no tilt-shift.
> 
> LIGHTING / ATMOSPHERE (ENDPOINT — maximum haze):
> SUN IS PROHIBITED (no visible sun disk, no solar source).
> Key light originates from the LEFT (off-frame). Primary cast shadows fall to the RIGHT (slightly down-right on ground plane).
> Wind pushes chimney smoke to the RIGHT.
> This tile must be the strongest atmospheric density in the panorama:
> - Far background collapses into milky smog (ghost silhouettes only; no crisp skyline edges).
> - Avoid full whiteout: keep the midground faintly readable with soft edges.
> - If sky feels too open, add haze volume + industrial mass; do NOT open more sky.
> 
> COLOR / GRADE (anti-drift):
> After Tile 5, warmth must not “return” globally. Also avoid cyan/blue cast drift.
> Target palette: desaturated polluted steel + dirty beige / soot-gray particulate (cool-neutral overall, NOT blue-hour).
> Warmth allowed only as tiny utilitarian sodium/work-light blooms under haze (sparse dock/work lights), never a global regrade.
> No nightlife sparkle.
> 
> COMPOSITION LOCK (match the sketch exactly):
> - Dominant read is a strong diagonal running bottom-left → top-right (follow the sketch’s reading orientation).
> - SKY BUDGET: keep the sky band constrained to the sketch’s line; do not increase sky.
> - SKYLINE ENVELOPE: a sloped envelope that is higher on the LEFT and gradually descends toward the RIGHT (per sketch), dissolving into haze (no crisp silhouette band).
> - HORIZON LINE: fixed at the sketch height; do not raise/lower or recenter to fit smokestacks/smoke—prefer cropping/occlusion.
> - SEAM BLENDING STRIPS (left & right): low-uniqueness, repeatable texture only (haze, rooffields, industrial repetition). No hero objects touching seams.
> 
> ENGINEERED SHORELINE + WATER BODY (required, stitch-friendly):
> Primary water body is a navigable industrial river/channel occupying the bottom-right quadrant,
> hugging the RIGHT edge, and receding into the horizon (distance collapses into haze).
> Land–water boundary must read as engineered/industrial: straight seawalls, quays, containment edges, docks/harbors.
> Organic/natural coastline is forbidden. Avoid a hard “L” turn that re-orients the scene.
> 
> HEAVY INDUSTRIAL MASS (ultra-dense, layered; no residential):
> Continuous industrial frontage dominates the LEFT bank and midground:
> refineries/petrochemical plants, smokestacks, pipe forests, conveyors, warehouses, power/utility infrastructure,
> cranes, piers, container stacks, service roads, cargo trucks, ECH handlers, railyards/track fans (but not one giant foreground fan).
> 
> PORT + SHIPPING (scale anchors):
> Include at least ONE utilitarian cargo ship/tanker at correct scale, preferably near lower-right,
> but do not make it a hero centerpiece.
> 
> FRAMING STABILITY / ANTI “PUSH-IN”:
> Treat vertical drift as camera pitch drift; keep the shared horizon physics consistent with the ruler.
> If the true horizon is erased by smog, use rail/road/roof-field vanishing height as the horizon proxy.
> Prevent push-in reads: avoid a single dominant near-foreground yard; emphasize layered repetition and occlusion into depth.
> 
> FORBIDDEN MOTIFS (must not appear):
> Nature/green parks • residential streets • landmark buildings • crisp skyline edges • visible sun/solar source • nightlife sparkle • neon billboards
> • wide-angle/fisheye • tilt-shift • painterly/illustration • readable text/logos.
