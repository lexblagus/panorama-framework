# Tile System

Tiles must be treated as **non-mirrored** outputs for all canonical runs.

Horizontal mirroring may be used only for **temporary diagnostic composites**, and must not be used to “fix” lighting direction or shadow logic. Any tile that would require mirroring to align must be regenerated instead.

- [Previews](#previews)
- [Summary](#summary)
- [Detailed definitions](#detailed-definitions)
- [Framing Stability Protocol (Reference-Conditioned, No Bands)](#framing-stability-protocol-reference-conditioned-no-bands)
  - [Authority](#authority)
  - [Rules (must)](#rules-must)
  - [Horizon-loss handling (Tiles 7–9)](#horizon-loss-handling-tiles-79)
  - [Quick composite checks (recommended)](#quick-composite-checks-recommended)

---

# Previews

## R1 Dummies

|1|2-4|5|6-8|9|
|:---:|:---:|:---:|:---:|:---:|
|![Tile 1 dummy](../refs/R1/107-tile1-02.png)|![Tiles 2-4 dummy](../refs/R1/108-tiles2to4-02.png)|![Tile 5 dummy](../refs/R1/109-tile5-02.png)|![Tiles 6-8 dummy](../refs/R1/110-tiles6to8-02.png)|![Tile 9 dummy](../refs/R1/111-tile9-02.png)|
|107-tile1-02.png|108-tiles2to4-02.png|109-tile5-02.png|110-tiles6to8-02.png|111-tile9-02.png|

## R1 Composition map sketch references

|1|3|5|7|9|
|:---:|:---:|:---:|:---:|:---:|
|![Tile 1 reference](../refs/R1/029-Tile-1-08.png)|![Tile 3 reference](../refs/R1/042-Tile-3-15.png)|![Tile 5 reference](../refs/R1/021-Tile-5-04.png)|![Tile 7 reference](../refs/R1/024-Tile-7-02.png)|![Tile 9 reference](../refs/R1/022-Tile-9-06.png)|
|029-Tile-1-08.png|042-Tile-3-15.png|021-Tile-5-04.png|024-Tile-7-02.png|022-Tile-9-06.png|

## Latest

Aeon 007 of generated images. Current work-in-progress

|1|3|5|7|9|
|:---:|:---:|:---:|:---:|:---:|
|**primary**|*secondary*|***primary master***|*secondary*|**primary**|
|![Tile 1 preview](../outputs/generated/007-43-tile1e.png)|![Tile 3 preview](../outputs/generated/007-51-tile3c.png)|![Tile 5 preview](../outputs/generated/008-02-tile5-r1-02.png)|![Tile 7 preview](../outputs/generated/007-46-tile7b.png)|![Tile 9 preview](../outputs/generated/007-17-tile9b-new-prompt.png)|
|007-43-tile1e.png|007-51-tile3c.png|008-02-tile5-r1-02.png|007-46-tile7b.png|007-17-tile9b-new-prompt.png|

_↳ Latest working tiles._

## Tiling composition preview

Just another preview, compiled in a singe image

![Tiling composition preview (6 tiles)](../outputs/generated/006-30-compiled.png)

_↳ Tiling composition preview (6 tiles)_

## All tiles preview

Genreal progress: tiles of different aeons

|1|2|3|4|5|6|7|8|9|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|**primary**|tertiary|*secondary*|tertiary|***primary master***|tertiary|*secondary*|tertiary|**primary**|
|![Tile 1 preview](../outputs/generated/007-43-tile1e.png)|![Tile 2 preview](../outputs/generated/004-05-tile2.png)|![Tile 3 preview](../outputs/generated/007-51-tile3c.png)|![Tile 4 preview](../outputs/generated/004-06-tile4.png)|![Tile 5 preview](../outputs/generated/008-02-tile5-r1-02.png)|![Tile 6 preview](../outputs/generated/004-07-tile6.png)|![Tile 7 preview](../outputs/generated/007-46-tile7b.png)|![Tile 8 preview](../outputs/generated/007-29-tile8c-new-prompt.png)|![Tile 9 preview](../outputs/generated/007-17-tile9b-new-prompt.png)|
|007-43-tile1e.png|004-05-tile2.png|007-51-tile3c.png|004-06-tile4.png|008-02-tile5-r1-02.png|004-07-tile6.png|007-46-tile7b.png|007-29-tile8c-new-prompt.png|007-17-tile9b-new-prompt.png|

_↳ Note tertiary tiles are very outdated compared to primary and secondary tiles_

---

## Summary

| # | Level | References | Title | Theme | Atmosphere | X axys pixels
|---:|---|---|---|---|---|--:|
| 1 | primary | (ruler) + (optional one-sided using Tile 2 left edge crop) | Nature as Dominant Chaos | Terrain-dominant natural systems | Clean daylight | `0`<br />⅔ `683`<br />`1024` |
| 2 | tertiary | bridge (required: Tile 1 right crop + transparency + Tile 3 left crop) | Dense Residential | Housing / Parks / Lakes | Slight warmth | `1025`<br />`1366` |
| 3 | secondary | (ruler) + (optional Tile 2 right crop + transparency + Tile 4 left crop) | Transition Zone | Mixed typologies | Warmth + early haze | `1367`<br />⅓ `1707`<br />⅔ `2049`<br />`2390` |
| 4 | tertiary | bridge (required: Tile 3 right crop + transparency + Tile 5 left crop) | Pre-Core Vertical | Urban Vertical | Amber build-up | `2391`<br />`2732` |
| 5 | primary master | none (ruler authority) + (optional Tile 4 right crop + transparency + Tile 6 left crop) | Iconic Core (Anchor) | Landmark Skyline | Amber peak + diffused sun | `2733`<br />⅓ `3073`<br />½ `3244`<br />⅔ `3415`<br />`3756` |
| 6 | tertiary | bridge (required: Tile 5 right crop + transparency + Tile 7 left crop) | Post-Core Vertical | Urban Vertical | Fading warmth | `3757`<br />`4098` |
| 7 | secondary | (ruler) + (optional Tile 6 right crop + transparency + Tile 8 left crop) | Logistics Transition Zone | Roads / Mid-rise | Desaturated haze | `4099`<br />⅓ `4439`<br />⅔ `4781`<br />`5122` |
| 8 | tertiary | bridge (required: Tile 7 right crop + transparency + Tile 9 left crop) | Industrial | Infrastructure | Heavy smog | `5123`<br />`5464` |
| 9 | primary | (ruler and mood) + (optional one-sided using Tile 8 right edge crop) | Heavy Industrial Expanse | Factories / Cargo | Bluish-gray fog | `5465`<br />⅓ `5805`<br />`6488` |

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
