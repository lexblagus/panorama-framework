# Tile 1 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam anchor): Tile 2 LEFT EDGE crop (when available) — `tile2-left-edge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no core skyline motifs, no central-axis logic, no sun disk).
> - Transfer ONLY from Reference B (if provided): right-edge seam continuity (silhouette height profile, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout; it is a seam conditioner, not a scene blueprint.

# Generator prompt
> Photorealistic portrait-oriented aerial image depicting the **natural extreme** of the panorama: steep mountains, cliffs, rugged terrain, and a deep valley carved by a river or reservoir. Captured from a fixed elevated viewpoint with **rectilinear optics and strong telephoto-like depth compression**, consistent with the panorama’s unified camera system. Broad coverage, compressed distance, no wide-angle distortion.
> 
> CAMERA LOCK (CRITICAL — PREVENT ZOOM/TILT DRIFT):
> - Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
> - Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
> - Keep the skyline/horizon/vanishing-height band consistent; do not tilt or pitch-shift the camera.
> - No vertical recentering to fit peaks or mood. Cropping/clipping is allowed; lifting framing is not.
> - Do NOT add extra sky. If sky feels open, add terrain mass + haze within the same framing (no reframing).
> - Avoid near-field dominance; build depth via midground stacking/overlap.
>
> Nature is **dominant, energetic, and resistant**, not pastoral. Exposed rock faces, sharp elevation drops, dense irregular vegetation, and turbulent water behavior (cascades, stepped flow, waterfalls, spillways, or a dam integrated into terrain) define the scene.
>
> Human presence exists only as **negotiated proto-infrastructure**: carved mountain roads, switchbacks, tunnels, viaducts, cliffside cuts, retaining walls, and small access structures. Settlements are sparse but legible in **layered pockets**: hillside dwellings, terraces, and scattered slope villages embedded into the terrain (vernacular houses, stone dwellings, occasional brutalist or modern hillside villas).
> Optional subtle passenger rail may appear as a constrained corridor or tunnel segment, strictly subordinate.
>
> Light originates from the **far right**, off-frame. The sun is not visible. Primary cast shadows fall to the **left**. Air is clear and crisp relative to later tiles, with strong material definition and minimal haze.
>
> No skyline, no metropolitan order, no urban grids or major avenues. The scene must read as **nature overwhelming human systems**, forming the leftmost anchor of the panorama.
>
> Output: 1024 × 1536, portrait orientation.
