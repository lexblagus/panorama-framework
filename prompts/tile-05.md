# Tile 5 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference B (Optional seam bridge composite, used ONLY in a seam-lock pass after neighbors exist): Tile 4 right crop + transparency + Tile 6 left crop — `tile4-6-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Tile 5 is the ruler authority and is normally generated with **no references** (ruler-first).
> - If Reference B is provided: transfer ONLY seam conditioning (left/right edge continuity: silhouette height profile, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout, landmark duplication, or importing neighbor content into the center. Reference B is seam conditioning, not a scene blueprint.

## Generator prompt
> Photorealistic portrait-oriented aerial image depicting the **iconic core anchor** of the panorama (Tile 5): maximum urban density, maximum vertical “pressure,” and peak warm amber atmosphere. Captured from a fixed elevated viewpoint with **rectilinear optics and strong telephoto-like depth compression**, consistent with the panorama’s unified camera system. Broad city coverage, compressed distance, no wide-angle distortion.
>
> CAMERA LOCK (CRITICAL — PREVENT ZOOM/TILT DRIFT):
> - Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
> - Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
> - Keep the skyline/horizon/vanishing-height band consistent; do not tilt or pitch-shift the camera.
> - No vertical recentering to “fit” towers, sun, smoke, or mood. Cropping/clipping is allowed; lifting framing is not.
> - Do NOT add extra sky. If sky feels open, add midground mass + haze within the same framing (no reframing).
> - Avoid near-field dominance (no single foreground slab/interchange filling the bottom). Build depth via midground stacking/overlap.
>
> The city reads as a **landmark skyline without a single literal “hero object.”** Tall towers, dense roof-fields, layered corridors, and stacked infrastructure create a continuous metropolitan mass. Streets and avenues exist but do not form a single dominant axial “spine.” The core is cohesive, complex, and legible from above, with multi-layer transportation (arterials, ramps, elevated segments) embedded into the urban fabric.
>
> Atmosphere: **amber peak + diffused sun-pressure** (sun may be implied through glow and diffusion rather than a clean disk). Warm haze compresses distance. Light originates from the **right side, off-frame**; primary cast shadows fall to the **left**. Contrast is controlled by haze; highlights bloom subtly without flattening detail.
>
> Seam behavior: both left and right edges remain stitch-friendly (continuous roof-field language, consistent haze rolloff, no abrupt emptiness or isolated singular object at the border).
>
> Output: 1024 × 1536, portrait orientation.
