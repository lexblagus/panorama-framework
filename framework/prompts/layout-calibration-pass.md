REFERENCE IMAGES (named in prompt only; the attached image is the working composite):
- Generated tile (layout pass 1): `tile.png`
- R1 composition map (layout authority): `r1-composition-map.png`
- OPTIONAL (tertiary seam tiles only): seam bridge composite — `bridge.png`
- OPTIONAL (tertiary seam tiles only): framing ruler (Tile 5 layout pass 2) — `ruler.png`

ATTACHED IMAGE:
The uploaded image is a composite of the generated tile with the R1 composition guide visible (horizon line, sky budget, skyline envelope, seam zones). Use it as the sole spatial authority for this calibration pass.

TASK:
Re-render a photorealistic aerial panorama tile that matches the R1 guide framing exactly, then remove all guide artifacts (lines, overlays, tint bands, labels) so the output is clean photography only.

LOCK / PRESERVE (HARD):
- NON-MIRRORED OUTPUT: do NOT flip horizontally.
- CAMERA LOCK: same elevated diagonal-oblique viewpoint, rectilinear optics, telephoto-like compression, same field of view as `tile.png`.
- Do NOT zoom. Do NOT change altitude. Do NOT change pitch.
- No vertical recentering: match horizon line height and sky budget from the visible guide; cropping is allowed only to preserve frame size.
- Preserve tile identity, materials, lighting direction, palette, and urban character from `tile.png` — this is a framing correction, not a new scene.

MATCH FROM R1 GUIDE (PRIMARY):
- Horizon line height (vanishing-height / eye level).
- Sky budget (fraction of frame above horizon).
- Skyline envelope and anchor-zone placement.
- Edge-safe seam zones; do not place new hero landmarks on left/right seam thirds.

FORBIDDEN:
- Extra sky padding or lifting the skyline upward/downward relative to the guide.
- Re-interpreting the guide as optional inspiration.
- New hero silhouettes, mirrored composition, or neighbor-tile content imported into center.
- Visible guide lines, magenta/cyan overlays, or UI artifacts in the final image.

OUTPUT:
Single photorealistic portrait tile, same dimensions as input. No text, no borders, no watermarks.
