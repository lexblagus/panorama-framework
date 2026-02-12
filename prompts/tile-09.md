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
> Photorealistic portrait-oriented aerial image depicting the **industrial terminus** of the panorama (Tile 9): heavy logistics, factories, container fields, refineries, shipyards, power infrastructure, and dense transport corridors dissolving into thick fog. Captured from a fixed elevated viewpoint with **rectilinear optics and strong telephoto-like depth compression**, consistent with the panorama’s unified camera system. Broad coverage, compressed distance, no wide-angle distortion.
>
> CAMERA LOCK (CRITICAL — PREVENT ZOOM/TILT DRIFT):
> - Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
> - Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
> - Keep the skyline/horizon/vanishing-height band consistent; do not tilt or pitch-shift the camera.
> - No vertical recentering to “fit” smoke stacks or mood. Cropping/clipping is allowed; lifting framing is not.
> - Do NOT add extra sky. If sky feels open, add midground mass + smog within the same framing (no reframing).
> - Avoid near-field dominance; build depth via midground stacking/overlap.
>
> Atmosphere: **bluish-gray fog / heavy smog**, low visibility, desaturated palette. Warmth does not re-emerge. Light still originates from the **right side, off-frame**, but is heavily diffused; primary shadows are weak and soft. Distance collapses into haze; far structures are partially erased.
>
> Industrial content is dense and systemic: repeated infrastructure patterns, container grids, rail yards, loading zones, pipelines, cooling towers, chimneys, cranes, and port-adjacent geometry. The scene reads as the functional endpoint of the gradient, not a new iconic center.
>
> Seam behavior: the **left edge** must remain stitchable to Tile 8 (continuous industrial texture, consistent haze rolloff, no abrupt void or single isolated hero structure at the border).
>
> Output: 1024 × 1536, portrait orientation.
