# Current iteraction

- Improve JSON service examples: initializeRecipeState, writeRecipeState, readRecipeState

- Friendly recipe not found message

- Logs with levels (mainly in recipes) using Chalk

---

# Previous iteraction

- Create Base Service README: add something like "now intended for recipe use"

- Update Robot README with links to Services READMEs

- Update Service READMEs with code snnipets examples in how to use in your recipe

---

# Previous iteraction

- Defaults `size` to `1024x1536` – this is **portrait**; are "reversed" values accepted? If so, add to the acceptance list.

- Defaults `quality` to `high`

- Defaults `n` to `1`

- Defaults `model` to `gpt-image-1.5` – this is the most advanced, right?

- Defaults `outputFormat` to `png`

- *"1. Do you want compose-tiles v1 to support both row and grid, or row only?"* Row only

- *"2. For OpenAI size, keep strict enum (safer) or string passthrough (more flexible)?"* strict enum!

- *"3. For OpenAI response handling, save only files, or also persist metadata JSON sidecar per call?"* Add a optional boolean parameter `saveSidecarMetadataFile` (that matches the image name without extension). Default to `false`.

- *"4. For maskFile, allow only single input image in v1?"* Isn't mask single file only? 

- Please support `gpt-image-2` and `2160x3840` (4K). These are in the [docs](https://developers.openai.com/api/docs/guides/image-generation)

- Use a very high timeout (> 2 minutes) for OpenAI image generation service.

---

# Previous iteraction

- Next: improve Phase 4 prior implementation. Decribe the OpenAI and Image services.

- Phase 4: OpenAI service. `generate-image` task

  - Use `POST /v1/images/edits`

  - Allow upload reference images (none, one or several) from a given path (e.g.: `images/refs/R1/151-tile5`)

  - Accepts a prompt text

  - Optional model parameter -- list the possible models

  - Optional mask file

  - size -- list possible sizes

  - quantity of generated images (default to 1)

  - also add other options from API

- Phase 4: image service. `generate-bridge` task.

  - Please refer to the legacy repo-robot project (`/Users/blagus/Gallery/Photos/Panorama/05 Global Megacity Panorama/repo-robot`) to see how to use Sharp to generate the bridge image.

    - `leftImageFile` input argument (must be an actual image from disk)

    - `rightImageFile` input argument (must be an actual image from disk)

    - `outputImageFile`  input argument (to be the actual image in disk)

    - `leftCropWidth` and `rightCropWidth`: the left and right image portion width to be bridged. The transparent `centerWidth` (from legacy) will be auto-calculated here.

    - Different from legacy `generate-bridge.ts`, check if the two input images have the same dimensions and generate the output image with those dimensions. So, no dimensions input.

    - Did I miss something? Feel free to ask.

- Phase 4: image service. `compose-tiles` task.

  - This is a new image servive not in legacy robot. This service will take several image inputs and compile the side-by-side in a single image. Very simple: each image gets glued next to other compposing a panorama, or, a mosaic of images in a given order. Example: `images/outputs/composites/Composition_03-02.png`

  - Argument: `inputImages`: an array of images from the disk. They all must have the very same dimensions. Orders matter. A lot.

  - Argument: `outputImageFile`: the final generated images.

  - Did I miss something? Feel free to ask.

- I believe tests are pretty straightforward: given the sample input images, test if the output image matches the exact output reference image. Not sure how are you going to test the OpenAI service; maybe stub the API and simulate the output with a mocked image (s)? Do you need me to provide the sample images?

- DO NOT implement Phase 4 yet, lets discuss what we have to discuss and improve the specs.

---

# Previous iteraction

- Tests:

   - Phase 2 tests for each capability. Phase 3 very similar (read/write).

   - Phase 4: will we stub the OpenAI API?

   - Phase 4: I imagine using dummy images from `tests/fixtures/images`

   - How are we going to test E2E ? 

- Human review of `05_robot_task_contracts.md`

---

# Previous iteraction
- Tests seems a little bit vague, should we describe them better or will they become more clear when the actual feature implementations surfaces? SHould we expand it in Implementation Plan, like, for example, readJson from JSON service to be tested aginst the smoke-test configuration.

- Will we have to create test artifacts, like for example dummy images for the Image Service test? The idea is not touch the images folder in tests. If needed we can create an `robot/tests` or `robot/e2e` for those things.

- Should Phase 1 include the test suite setup? What are going to use, Jest or something else? What exactly?

- Check for inconsistencies, missing spots, open questions (beyound the ones already calogued on "Open Questions"). This is kind of a "dry run" and tell me if everythings are in place and check in each other.

- The service/plan file name rules (`^[a-z0-9_-][a-z0-9_.-]*$`) are for the code generator only or will it be applied in the logic of the robot?

- Make these services folder:

  - Image: with README and config

  - JSON: with README, no config (for now, add as needed)

  - MarkDown: with README, no config (for now, add as needed)

- Markdown service read: there will be no DSL or selector. Just a simple file read contents – I'll change how the Framework generate the prompt files.

- Markdown service insert: marker will be `"robot:preview-table-first-row"`. A failure criteria could be *"insert marker not found"*

- Idea for minimal recipe: in its single step, it saves state with transient state currentRun = currentRun + 1, then it calls itself using the Run Recipe Workflow Service. It stops (genereting the plan) when it reaches 3 iteractions. If you agree with this minimal test, add it to Implementation.

- Smoke Test: my idea is to make it call each servive a single time, to showcase their functionality. Do I need to describe a full Smoke Test Recipe?

- Panorama: I believe I have to write down the whole idea: I knwo exactly what I want but feels too soon to write it now; for me seems the right way to exceture the early phases then get into the most advanced ones when the time calls?

- After we start the development, lets imagine I misses a critical feature or want to change the original specification. Considering th AI-SDD proccess, what should I do, create new "upgrade" (or "change request") documents or edit the original Authoritative Architecture and then ask to change the actual code to fit the edit? This project, Robot, for me is a way to practice the new AI-driven development proccess, 2026-style. Educate me how we shall work.

- What are the next steps? Are you ready for me to say "start building"? How do you sugest to do that, something like "Open sesame" or "Build first Phase 1" works better ?

---

# Previous iteraction
- We have two folder tree diagrams. Keep them identical in sync is quite hard, where to heva only one source of truth? The second one may be a sortened version, or just points to the original full tree.

- *"I removed taskId from the v1 task model entirely. The docs now use stepId as stable identity and taskKind as the dispatch key, which is cleaner for the current one-step-one-task design."* That means stepId - taskKind ia a 1x1 relation? I see each service have serveral tasks (like JSON have two: read and write), I was considering each task have a taskId which can be called by a step in the recipe. Does that make sense?

- Create top-level indexes for the documents pinting to the internal sections

---

# Previous iteraction
Lets continue our AI-SDD working in `03_robot_authoritative_architecture.md`, `04_robot_implementation_plan.md` and `05_robot_task_contracts.md`:

- Make services/openai a folder with index, openai.ts and config.json

- Plan creation decision: remove `outputPlanFile`. In v1, recipe-driven build writes the default plan file `robot/plans/<recipe-id>.json`.

- CLI decision: `build` stays build-only, `exec` builds then executes, `run` executes an existing plan from the beginning, and `resume` reuses persisted state when present and otherwise behaves like `run`.

- **Reciple id** constrain: its name must follow the pattern: only lowercase letters, numbers, `_`, `-`, and `.`, but `.` may not be the first character. Defaults to recipe filename (without extension) when not provided (making it optional in recipe type definition). You know, when I hear that I think is a good idea to complete drop the recipe id and just use the filename without extension as id. What you think about that?

- Look for for textual, technical and procedural insconsistencies in the documents.

- Overall review improving grammar and clarity

- **Recipe config** (on `src/types/recipe.ts`): user will create his/her own recipes, therefore the config for that recipe (if chose to).
  - How do we define the `RecipeConfig` ? Does the recipe's author have to create the type for his own recipe configuration?
  - I moved `RecipeConfig` to the contracts document, is that all right ? If not, please do any modifications you find necessary.
  - Services config is fine having specific type definition because is developer-authored.

- Add `arguments` to core terms. Meaning: something like "CLI option", example "`--recipe smoke-test`"

- Generate Panorama have its place as additional recipe born with the project but every place a generic example is needed use the Smoke Test. Replace where it fits.

- How does Servive Registry works? Just out of curiosity.

- OpenAI Service have configuration. Single service file, own file. More that one, folder. Then it must become:
  ```
  src/services/openai/
    README.MD
    index.ts
    openai.ts
    config.json
  ```
  Single file services (no folder like json.ts) mean they are so simple they do not need readme (perhaps a little header comment on the top pf the file). But if they are complex and need a readme (even without config), it will be placed in a folder. What you think? If you agree, update where it is needed.

  - What is the difference between `taskKind` and `taskId`? Would be possible to consolidate in just `taskId`?

  - **Open Questions:** *the first-version behavior when resuming after a task ended in `error`*: what is the open question here? For me feels very straightforward *"resume skips success tasks and restarts from the first non-success task according to policy defined by the runner"*

- **Open Questions:** *whether service-specific configs stay flat files or grow into service folders later*: what we have to discuss here?

---

# Previous iteraction

- Remove previous draft references (02_robot_draft.md) from this Authoritative Architecture Doc. Fix titles and texts and make it stand-alone as the draft never existed (but live it untouched as historical archive). Now lets evolve this document, anchoring themes bellow.

- Create `04_robot_implementation_plan.md` with the industry best-practices structure, text and code you suggest based on `.plans/02_robot_draft.md`. Most possibly `05_robot_task_contracts.md` will be needed because I intend to write the smoke test and generate panorama I already have in mind. Try to extract all the content from 02 into these files leaving nothing behind – unless those things we have evolved after. If you see 04 growing too much, go for 05 creation. Rename `03_robot_authoritative_architecture.md` to a better name, maybe using *Authoritative Architecture* in the name? Your call.

- Task state enum: lets write down our suggestion: `type TaskState = "waiting" | "running" | "success" | "error";` with the suggested metadata:
  ```
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
  ```

- **Open questions:** *"whether filename formatting is configured as data, code, or both"*. As you sugest and I tottally agree: **Both:** *Keep the formatting logic in code, but keep the variables in config.*

- For the Markdown service, lets support two selector families: 1. Marker selectors for writes and 2. Structural/source selectors for reads. The read selector DSL to be defined later. Use parse markdown with `remark-parse`. Then again, *markers for writes, selectors for reads.*

- I see the point of updateing the file index in panorama recipe. Lets got with:

  - A root-level folder called `transient` – Do you enjoy this name better as `state`?

  - The file will be: `transient/<recipe-id>.state.json`

  - Git-ignored, do you agree?

  - Even so, keep the `nextFileIndex` (maybe as only `fileIndex`) at src/recipes/generate-panorama.config.json` as fallback (or team-shared value across commits)

  - That may be read/written by json service

- Config service anchors to JSON service (not TS) in the filename and terminology

- Remove aux.tx. If we need, we add it later

- Cross-called libs: write the services to be written in a exchangeable format.

    - Allow services to be called from Builder (e.g.: Markdown read task be called to create the plan)

    - In the same logic, we should be able calle servives from another services. Example: Markdown service uses OpenAI service to edit an MD file.

    - `run-recipe` should exist as a service task (on Etc Service or another name like Auxiliar Service – suggestions welcome) and be the base for the Runner, or, be called from the recipes to build neasted recipes.

    - Let me know what you think about this

- Maybe rename output folder to plans? Then plans/default.json. Maybe continue with (empty) output folder as standard artifact generation for pre-configured recopes like Smoke Test – because Generate Panorama is intended to work outside robot folder.

- For now, lets anchor config files as .json. If needed, we change that logic.

- Move recipes to their own folders:

  - Folder have recipe name, e.g. `somoke-test/`

  - `index.ts` points to main TS file

  - Main logic resids in servive name TS: `smoke-test.ts`

  - Config as: `config.json`

  - Any other libs or artifacts (related to this recipe) can live in this folder. Maybe a README.md explaining that service (I like that!)

  - Is this above a good pattern?

- If above structure is approved, the services folder may have the same pattern in future – when needed
