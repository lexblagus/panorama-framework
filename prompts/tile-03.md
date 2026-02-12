# Tile 3 Prompts

## Header
> REFERENCE IMAGES PROVIDED (ONLY these; no extras):
> - Reference A (Ruler): Tile 5 ruler image — `tile5ruler.png`
> - Reference B (Optional seam bridge composite): Tile 2 right crop + transparency + Tile 4 left crop — `tile2-4-bridge.png`
>
> REFERENCE USE POLICY (STRICT):
> - Transfer ONLY from Reference A: camera/framing physics (horizon/vanishing-height read), rectilinear telephoto compression feel, vertical “pressure”, sky-budget discipline (do not open sky), and midground scale.
> - Transfer FORBIDDEN from Reference A: any Tile 5 content identity (no landmark silhouettes, no core axis, no sun disk).
> - Transfer ONLY from Reference B (if provided): left/right seam conditioning (silhouette continuity, haze rolloff language, edge texture density).
> - Transfer FORBIDDEN from Reference B: copying full composition/layout; it is seam conditioning, not a scene blueprint.

## Generator prompt
> Photorealistic portrait-oriented aerial image depicting a **dense urban transition zone with interwoven green urbanism** during **golden hour**, captured from a fixed elevated viewpoint with **rectilinear optics and strong telephoto-like depth compression**, consistent with the panorama’s unified camera system. Broad city coverage, compressed distance, no wide-angle distortion.
>
> CAMERA LOCK (CRITICAL — PREVENT ZOOM/TILT DRIFT):
> - Match the established rig: elevated diagonal-oblique aerial view (NOT top-down / not near-nadir).
> - Do NOT zoom. Do NOT change apparent altitude/scale. Keep the same narrow-FOV / telephoto-compressed feel.
> - Keep the skyline/horizon/vanishing-height band consistent; do not tilt or pitch-shift the camera.
> - No vertical recentering to fit crests or mood. Cropping/clipping is allowed; lifting framing is not.
> - Do NOT add extra sky. If sky feels open, add roof-field mass + haze within the same framing (no reframing).
> - Avoid near-field dominance; build depth via midground stacking/overlap.
>
> This scene represents a **human-scaled yet dense city fabric** positioned between natural dominance and cosmopolitan intensity. Buildings are predominantly **low- to mid-rise**, tightly packed, heterogeneous, and utilitarian. No skyline or iconic vertical forms are present; density is achieved through **accumulation, overlap, and repetition**, not height.
>
> Green elements are **woven directly into the city**. A **canalized stream or river remnant** passes through the district in a concrete channel with softened, vegetated edges. Trees and weedy vegetation follow infrastructure lines; pocket parks and courtyards appear irregularly and remain secondary.
>
> Circulation is layered and human-scale: pedestrian stairways, footbridges, small overpasses, embedded transit entrances, short elevated rail segments, and neighborhood commerce (market strips, kiosks, corner shops). Rooftops show habitation: water tanks, laundry lines, satellite dishes, and small rooftop structures.
>
> Light is warm and diffuse, coming from the **right side, off-frame**. The sun is off-frame. Primary cast shadows fall to the **left**. The district’s massing and circulation show a **subtle diagonal tendency (bottom-right → top-left)** without forming a single dominant axial spine.
>
> Traffic density is moderate to high. Cars, buses, and trams are numerous and clearly readable as primary scale references.
>
> Output: 1024 × 1536, portrait orientation.
