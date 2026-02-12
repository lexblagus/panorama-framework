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
> Photorealistic portrait-oriented aerial image depicting **urban sprawl / post-core expansion** (Tile 7): a broad, infrastructure-led city field transitioning toward industrial adjacency. Captured from a fixed elevated viewpoint with **rectilinear optics and strong telephoto-like depth compression**, consistent with the panorama’s unified camera system. Broad city coverage, compressed distance, no wide-angle distortion.
>
> CAMERA LOCK (CRITICAL — PREVENT ZOOM/TILT DRIFT):
> - Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
> - Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
> - Keep the skyline/horizon/vanishing-height band consistent; do not tilt or pitch-shift the camera.
> - No vertical recentering to “fit” subjects or mood. Cropping/clipping is allowed; lifting framing is not.
> - Do NOT add extra sky. If sky feels open, add midground mass + haze within the same framing (no reframing).
> - Avoid near-field dominance; build depth via midground stacking/overlap.
>
> Composition: predominantly **mid-rise and low-rise** massing with occasional taller elements that do not form a skyline. Infrastructure becomes more explicit: widened arterials, layered interchanges, rail corridors, service roads, and logistics-adjacent strips. The scene should read as an urban fabric that is **less iconic** than Tile 5, more distributed, and more system-oriented.
>
> Atmosphere: warmth is fading; haze is increasing. Light originates from the **right side, off-frame**; primary cast shadows fall to the **left**. Colors trend toward muted ambers and grays, with reduced contrast and softened far distance.
>
> Forbidden: a pristine “new city” grid, a single dominating monument, or a clean cinematic skyline silhouette. This is sprawl, not a second core.
>
> Seam behavior: keep both edges stitchable (continuous roof-field texture, consistent haze rolloff, no abrupt voids at the borders).
>
> Output: 1024 × 1536, portrait orientation.
