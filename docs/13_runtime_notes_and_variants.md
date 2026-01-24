# Runtime notes and variations

This file absorbs instability without contaminating canon.

## Running in Google Gemini (NanoBanana)

This section defines how to execute the **Global Megacity Panorama Framework** using **Google Gemini (NanoBanana image model)**, adapting prompts and expectations to NanoBanana’s generative behavior while preserving all conceptual, compositional, and narrative constraints.

NanoBanana is treated as an **alternative image runtime**, not a separate creative system.

It must follow the same framework logic, tile roles, and narrative gradient defined elsewhere in this document.

---

### Conceptual Differences Between ChatGPT Image Model and NanoBanana

NanoBanana differs from ChatGPT’s image model in the following relevant ways:

* It responds **more strongly to high-level conceptual structure** than to dense stylistic micromanagement.
* It tolerates (and often benefits from) **shorter, cleaner prompts**.
* It is more literal with **spatial and compositional instructions**.
* It may underperform when overloaded with:

  * Excessive negative constraints
  * Long enumerations of forbidden motifs
  * Overly poetic language without grounding

Therefore, **prompt adaptation is mandatory** when running this framework in NanoBanana.

---

### Source of Truth When Using NanoBanana

When running in NanoBanana, the hierarchy of authority is:

1. **Conceptual bullet definitions** (Tile descriptions, roles, density, form)
2. **Global Constraints**
3. **Lateral Ambiance Gradient**
4. **Prompt text (adapted)**

The adapted prompt is **an execution artifact**, not the conceptual source of truth.

---

### Prompt Adaptation Strategy (ChatGPT → NanoBanana)

When adapting a prompt for NanoBanana:

#### Keep (must remain explicit)

* Tile role and narrative position
* Camera model and optics (rectilinear, telephoto compression)
* Light direction and lateral position
* Dominant spatial axis (vertical / diagonal / absent)
* Core compositional logic (what dominates the frame)
* Atmosphere trend (clear → hazy → industrial)

#### Reduce or Remove

* Redundant restatements of realism
* Long lists of architectural styles (keep 3–4 max)
* Overlapping “do not” constraints
* Excessive texture micro-detailing
* Repeated emphasis on “no sci-fi / no fantasy” (state once)

#### Rephrase

* Convert **negative constraints** into **positive structural descriptions**
* Convert poetic metaphors into **physical outcomes**
* Replace long enumerations with **behavioral descriptions**

---

### Canonical Adaptation Prompt (Meta-Instruction to Gemini)

Before generating any image in NanoBanana, prepend the following **instruction block** in Gemini:

```
You are generating a photorealistic image as part of a large, multi-tile panoramic cityscape.
This image must behave as one tile in a continuous photographic system.

Do not reinterpret the scene creatively.
Do not add landmarks, symbols, or narrative elements that are not explicitly implied.
Preserve scale realism, camera consistency, and atmospheric logic.

If multiple interpretations are possible, choose the one that best supports continuity,
not novelty.
```

This instruction anchors NanoBanana into **continuity-first mode**.

---

### Example: Adapting a Tile Prompt for NanoBanana

#### Original (ChatGPT-style)

* Long, highly constrained
* Dense with exceptions
* Emphasizes what must *not* appear

#### Adapted (NanoBanana-style)

* Shorter
* Spatially explicit
* Focused on dominance and relationships

**Rule of thumb:**
If a prompt exceeds **~250–300 words**, it is likely too long for NanoBanana.

---

### Validation Loop When Using NanoBanana

When testing NanoBanana outputs:

1. Generate **2–3 variants only**
2. Compare against:

   * Tile role (is it behaving correctly?)
   * Lateral gradient position
   * Scale coherence
3. If results are close but unstable:

   * Adjust **structure**, not style
4. If results drift:

   * Re-anchor using conceptual bullets
   * Do *not* pile on constraints

NanoBanana improves with **clarity**, not pressure.

---

### When to Prefer NanoBanana Over ChatGPT Image Model

NanoBanana is especially effective for:

* Terrain-dominant tiles (Tile 1)
* Industrial systems with large-scale coherence (Tiles 8–9)
* Early exploratory passes
* Stress-testing whether the **concept** is strong enough to survive simplification

ChatGPT’s image model remains preferable for:

* Dense architectural heterogeneity (Tile 5)
* Fine-grained infrastructure layering
* Late-stage locking passes

Both models may coexist in the same project.

---

### Rule of Non-Divergence

Images generated in NanoBanana **must not introduce concepts** that are not already permitted by the framework.

If NanoBanana produces a compelling but out-of-scope result, the correct response is:

* Either update the framework explicitly
* Or discard the image

Never retrofit the framework silently to justify an image.

---




