# Tile 4: Experimental references

You are given a reference image that contains:
- the LEFT edge of the previous tile (Tile 3) and
- the RIGHT edge of the next tile (Tile 5),
with a transparent/empty region in the center.

TASK
- Fill ONLY the transparent/empty middle region to create a single continuous, natural, photorealistic shot.
- The existing left and right regions are LOCKED: do not change, repaint, shift, recolor, blur, sharpen, or warp them in any way.
- Blend both sides so the entire image reads as one coherent capture taken from the same camera at the same moment.

HARD CONSTRAINTS (do not violate)
- Preserve all non-transparent pixels exactly.
- Do not move the horizon / vanishing height. Do not tilt the camera. Do not “add sky” to create mood.
- Rectilinear optics only (no fisheye, no barrel distortion). Telephoto-like compression / dense stacking.
- Maintain lighting direction and shadow logic implied by the locked sides. Do not flip key light.
- Maintain atmospheric ladder implied by the locked sides.
- Do not introduce a new landmark focal point in the center that competes with the core.

BRIDGE CONTENT GOALS (Tile 4: Dense Fabric → Pre-Core Vertical Pressure)
- The center region must transition from dense human-scale fabric into the **pre-core** zone.
- Increase density and vertical pressure gradually, but **do not outshine Tile 5**:
  - taller and more numerous towers begin to appear,
  - mid-rise blocks become more continuous,
  - infrastructure becomes more layered and aligned.
- Introduce early signs of the core’s ordering without forming the final iconic spine:
  - partial axial cues, stacked corridors, elevated rail segments, converging avenues,
  - but keep them weaker than the dominant core axis on the right side.
- Reduce greenery dominance compared to Tile 3, but do not erase it abruptly.
- Ensure cross-center continuity for any major lines (roads/rails/canals) using overlap/occlusion and atmospheric softening—avoid perfect seam-parallel lines.

STYLE / REALISM
- Photorealistic, believable mixed-era architecture, subtle wear, no “AI polish.”
- Golden-hour daylight continuity, warm diffusion increasing toward the right without changing the locked sides.
- No night lighting. No sci-fi.

OUTPUT
- Fill the center seamlessly and naturally.
- Leave the locked sides unchanged.
- Dimensions: 1024 × 1536, portrait orientation.
