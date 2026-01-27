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

## Framing Stability Protocol (Reference-Conditioned, No Bands)

This framework treats “zoom / skyline height / sky share drift” as a **framing physics problem**, but **does not use numeric band targets**.

Instead, framing stability is enforced by **reference conditioning**:

### Authority
- **Tile 5 is the ruler** for perceived framing physics:
  - telephoto compression feel
  - vertical “pressure” (how much the scene fills the portrait frame)
  - sky budget discipline (avoid wide open sky)
  - vanishing-height read (where distance collapses)

### Rules (must)
- **No tile may vertically recenter** to “fit” the subject (sun, peaks, towers, smoke).
- **Cropping/clipping is allowed and preferred** over lifting framing.
- Fix “too much sky” **by adding mass inside the same framing**:
  - more roof-field / stacked midground slabs / layered infrastructure / terrain bulk
  - haze inside distance volume (not by opening sky)
- Fix “too zoomed-in / push-in read” **by reducing near-field dominance**:
  - avoid a single foreground object filling the bottom
  - add depth via **midground stacking + overlap**, not close foreground enlargement

### Horizon-loss handling (Tiles 7–9)
If the true horizon disappears into haze:
- use **corridor / roof-field vanishing height** as the proxy for the shared horizon physics
- keep the overall “pitch read” consistent with Tile 5 (no independent up/down framing decisions)

### Quick composite checks (recommended)
- Does any tile look like it has a different camera pitch? → regenerate.
- Does any tile “breathe” by adding sky instead of adding density? → correct content, not framing.
- Does Tile 5 ever read “lower/shorter” than Tile 3/7 because others opened sky? → regenerate those tiles.
