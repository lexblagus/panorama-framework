# Tile System

Tiles must be treated as **non-mirrored** outputs for all canonical runs.

Horizontal mirroring may be used only for **temporary diagnostic composites**, and must not be used to “fix” lighting direction or shadow logic. Any tile that would require mirroring to align must be regenerated instead.

## Summary

| # | Level | References | Title | Theme | Atmosphere |
|---:|---|---|---|---|---|
| 1 | primary | ruler | Nature as Dominant Chaos | Terrain-dominant natural systems | Clean daylight |
| 2 | tertiary | bridge | Dense Residential | Housing / Parks / Lakes | Slight warmth |
| 3 | secondary | ruler | Transition Zone | Mixed typologies | Warmth + early haze |
| 4 | tertiary | bridge | Pre-Core Vertical | Urban Vertical | Amber build-up |
| 5 | primary master | none | Iconic Core (Anchor) | Landmark Skyline | Amber peak + diffused sun |
| 6 | tertiary | bridge | Post-Core Vertical | Urban Vertical | Fading warmth |
| 7 | secondary | ruler | Urban Sprawl | Roads / Mid-rise | Desaturated haze |
| 8 | tertiary | bridge | Industrial | Infrastructure | Heavy smog |
| 9 | primary | ruler and mood | Heavy Industrial Expanse | Factories / Cargo | Bluish-gray fog |

***Levels:***
- **Master**: main tile based on Central Master Reference Image
- **Primary**: pivotal tile with the main themes: wild nature ↔ urban density ↔ industrial pressure
- **Secondary**: in-between zones of the main themes
- **Tertiary**: extension of neightbour tiles with stitching anchors

## Detailed definitions

Each tile section is structured as follows:

- Canonical Human Spec: the conceptual authority
  - Description
  - Role
  - Density & form
  - Key elements: usually as list
  - Forbidden motifs: usually as list
- Prompt Core: invariant, locked
- Active Calibration Layer: mutable
- Generator Prompt: compiled execution artifact from specs above

## Vertical Framing Normalization (Three-Band Lock)

This framework treats “zoom / skyline height / sky share drift” as a **framing physics problem**, not a content problem.

All tiles must obey a shared vertical framing structure defined by three bands:

### Band A — Horizon / Vanishing Band
- The **read horizon** is the height where distance collapses (true horizon if visible; otherwise the vanishing height of roads/rails/roof-fields + atmospheric cutoff).
- **Tile 5 is the ruler.** Once Tile 5 is locked, its vanishing height becomes the reference.

### Band B — Skyline Crest Band
- The **crest** is the top silhouette of the dominant mass (terrain ridge / roof-field / tower envelope).
- Goal: prevent Tile 5 from reading “lower” than Tile 3/7 due to excess sky, and prevent Tile 3/7 from reading “zoomed in” due to oversized near-field.

### Band C — Foreground Cap
- Prevent “push-in reads” by forbidding a single near-foreground interchange/roof/road mass from filling the lower frame.
- Fix scale using **midground stacking and occlusion**, not near-field enlargement.

### Enforcement Rule (must)
If an element pressures the top of frame (sun, peak, tower tip), allow it to **clip/crop** instead of lifting framing to fit it. Never add sky for mood.