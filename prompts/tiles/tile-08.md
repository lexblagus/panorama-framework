# Tile 8: Experimental references

You are given a reference image that contains:
- the LEFT edge of the previous tile (Tile 7) and
- the RIGHT edge of the next tile (Tile 9),
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
- Maintain atmospheric ladder implied by the locked sides; haze must intensify in the city volume, not by increasing sky share.
- Do not introduce a new landmark focal point in the center.

BRIDGE CONTENT GOALS (Tile 8: Logistics → Heavy Industrial Dominance)
- The center region must shift from logistics/residential support into **industrial system dominance**:
  - rail yards expand and multiply,
  - warehouses enlarge and repeat,
  - pipelines, conveyors, industrial gantries, and power infrastructure begin to take over.
- Residential mass should fade into the background; any remaining housing is worker/support housing and should be minimal.
- Atmospheric density must increase significantly:
  - smog + steam + particulate layers,
  - distant visibility collapses,
  - background structures dissolve into haze bands.
- Industrial glow may appear only as **diffuse volumetric radiance** (soft bloom through fog), never as bright decorative lighting.
- Ensure cross-center continuity of corridors (rail/road/port geometry) with overlap/occlusion and atmospheric softening—avoid perfectly crisp seam crossings.

STYLE / REALISM
- Photorealistic, heavily worn industrial materials: rust, soot, grime, stained concrete, weathered steel.
- Golden-hour daylight continuity; no dusk/night.
- No sci-fi/fantasy.

OUTPUT
- Fill the center seamlessly and naturally.
- Leave the locked sides unchanged.
- Dimensions: 1024 × 1536, portrait orientation.