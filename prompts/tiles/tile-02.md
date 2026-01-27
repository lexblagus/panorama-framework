# Tile 2: Experimental references

You are given a reference image that contains:
- the LEFT edge of the previous tile (Tile 1) and
- the RIGHT edge of the next tile (Tile 3),
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
- Maintain atmospheric ladder implied by the locked sides: clarity and haze must transition smoothly without discontinuities.
- Do not introduce a new landmark focal point in the center.

BRIDGE CONTENT GOALS (Tile 2: Nature → Early Urban Accumulation)
- The center region must evolve from terrain-led wilderness into early urban accumulation.
- Introduce proto-infrastructure that “binds” the two sides:
  - mountain roads transitioning into arterial roads,
  - bridges/viaducts/tunnels becoming more frequent,
  - clustered slope settlements gradually becoming denser blocks.
- Keep the scene pre-skyline: no iconic tower cluster and no formal downtown.
- Maintain a believable “first thickening” of built fabric: irregular mid-rise clusters, mixed roofs, occasional industrial/service structures beginning to appear, but still subordinate to terrain memory.
- Ensure any linear features crossing the center (roads/rails/river edges) do so with slight occlusion, overlap, or atmospheric softening—avoid a single perfectly clean uninterrupted line.

STYLE / REALISM
- Photorealistic, believable materials, subtle wear, no hyper-clean or glossy “AI” surfaces.
- Natural depth: sharper midground, softened far distance, mild haze depth behavior consistent with both locked sides.
- No sci-fi/fantasy elements. No night lighting. Golden-hour daylight continuity only.

OUTPUT
- Fill the center seamlessly and naturally.
- Leave the locked sides unchanged.
- Dimensions: 1024 × 1536, portrait orientation.
