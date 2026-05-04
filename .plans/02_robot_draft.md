> ***Lets create the robot CLI!***

# Overview

This is CLI that will execute a batch of tasks for the panorama framework. The `robot/legacy/generate-images.mjs` is the **_main reference_** in how to implement some features. The main difference is this was a Pupperteer-based browser automator; now we'll replace that by external API calls.

# Structure

This is a proposed structure. You shall question names, standards etc. to make this project be more more standardized to this kind of project

```
robot/
├─ README.md
├─ .env
├─ .env.sample
├─ config.json
├─ bin/
│  └─ robot
├─ plans/
│  └─ <recipe-id>.json
├─ transient/
│  └─ <recipe-id>.state.json
└─ src/
   ├─ builder.ts
   ├─ runner.ts
   ├─ index.ts
   ├─ types/
   │  ├─ plan.ts
   │  ├─ recipe.ts
   │  ├─ step.ts
   │  └─ task.ts
   ├─ services/
   │  ├─ image.ts
   │  ├─ json.ts
   │  ├─ markdown.ts
   │  ├─ openai.ts
   │  ├─ openai.config.json
   │  └─ workflow.ts
   └─ recipes/
      ├─ minimal/
      │  ├─ README.md
      │  ├─ index.ts
      │  └─ minimal.ts
      ├─ smoke-test/
      │  ├─ README.md
      │  ├─ config.json
      │  ├─ index.ts
      │  └─ smoke-test.ts
      └─ generate-panorama/
         ├─ README.md
         ├─ config.json
         ├─ index.ts
         └─ generate-panorama.ts
```

# Concepts

| Term | Meaning | Example |
|---|---|---|
| `subcommand` | top-level CLI action | `run`, `resume` |
| `recipe` | User-authored workflow definition | `generate-panorama` |
| `step` | Ordered item inside a recipe | *generate tile 5* |
| `service` | Specialized module that performs effectful work | `openai`, `image`, `markdown`, `config` |
| `task` | Atomic operation exposed by a service and requested by a step | `generate-ai-image`, `create-bridge-image`, `insert-markdown-text` |
| `builder` | Compiles a recipe plus config into an executable plan | - |
| `plan` | Built artifact with resolved inputs, outputs, and execution order | `output/plan.json` |
| `runner` | Executes the plan and dispatches each task to the correct service | - |
| `config` | Static project/runtime settings | `.env`, `config.json` |
| `state` | Mutable execution progress for resume and recovery | `initialized`, `success` |

***Rationale:*** `generate-panorama` is a recipe composed of ordered steps.
Each step requests one task. The runner executes that task through the appropriate service.
Example: the step *generate tile 5* requests the task `generate-ai-image`, which is implemented by the `openai` service.

# Execution

- `bin/robot` called from Bash with *input recipe* id
- `src/index.ts` is bootstrapper to…
- `src/builder.ts`
   - if operation is build or run
   - reads the recipe file
   - writes `output/plan.json`
   - then triggers:
- `src/runner.ts`:
  - if operation is run, dry run or resume
  - instantiate services
  - reads the plan
  - loop the plan steps:
    - Call the services depending on the steps:
      - `src/services/openai.ts`
         - Execute a ***task*** to send prompts with image uploads and get results in text but mainly as image generations.
      - `src/services/image.ts`
         - Run a ***task*** to edit images with Sharp;
      - `src/services/markdown.ts`
         - Perform a ***task*** to read prompt files according their format (legacy robot have some logic)
         - Perform a ***task*** to edit the markdown files to, for example, update the preview.md with a new table row in the preview table;
      - `src/services/json.ts`
        - Use a given ***task*** to update a configuration file (`.config.json`) with, for example, the last plan executed or the image file index
        - Calls a given ***task*** to update the plan file data, like step status
    - records the progress to `output/plan.json` (possibly using a proper task of a service), marking current step executed (and maybe some result data)

All of them may use auxiliary functions in `src/aux.ts` (not sure it will be needed, but the slot is there).

# Configuration

Divided between environment vars (private data) and config.json (static configuration)

**Sample env** is commited and `.env` is git-ignored so the final user can add his/her secret API keys.

`.env.sample`:

```sh
OPENAI_API_KEY=sk-proj-**********-**********-*-*-**********
OPENAI_API_USER=your-username@your-domain.com
OPENAI_API_ADDRESS=https://api.openai.com
```

`config.json`:

Much of the configuration comes pre-configured.

Much like the legacy, this is the base for the runner and plan generation:

```JSON
{
  // …has been dryed out! Slot reserved for very global config – or remove later
}
```

# Bootstrap

### `bin/robot`

Bash executable…

Usage:

```Bash
robot build --recipe <recipeId> --plan output/plan.json
robot run --plan output/plan.json
robot resume --plan output/plan.json
robot dry-run --recipe 'recipe-id'
```

`resume` resumes a prior execution based on `output/plan.json` task state.

### `src/index.ts`

Wrapper for the main logic. Mostly unchanged, except by the redefined input arguments above.

# Recipes

A recipe is a user-authored workflow definition composed of ordered steps. It describes what should be done and with which inputs, but not the transient state of a particular execution.

Each recipe have its own optional config file (extension `.config.json`).

`src/types/recipe.d.ts`:

```TS
interface RecipeConfig {
  // …
}

interface Recipe {
  recipeId: string,
  config?: RecipeConfig
  steps: Step[];
}
```

## Minimal

A minimalistic recipe example (without config file):

`src/recipes/minimal.ts`:

```TS
export default (): Recipe{} => {
  const steps: Step[] = [];

  const tile3image = 'tile3.png'
  const tile5image = 'tile5.png'
  const bridgeimage = 'bridge.png'

  // Step 1: create tile 5 image
  steps.push({
    taskId: 'generate-ai-image',
    description: 'create tile 5 from prompt',
    arguments: {
      prompt: '…',
      saveAs: tile5image
    }
  });

  // Step 2: create tile 3 image
  steps.push({
    taskId: 'generate-ai-image',
    description: 'create tile 3 from prompt',
    arguments: {
      prompt: '…',
      saveAs: tile3image
    }
  });

  // Step 3: create bridge image
  steps.push({
    taskId: 'create-bridge-image',
    description: 'generate bridge from left and right images',
    arguments: {
      leftImage: tile3image,
      right: tile5image,
      saveAs: bridgeimage,
    }
  });

  return {
    recipeId: 'minimal',
    description: 'Testing recipe',
    steps
  };
};
```

## Smoke Test

The most complete example, used in the E2E test

`src/recipes/smoke-test.config.json`:

```JSON
{
  // …
}
```

`src/recipes/smoke-test.ts`:

```TS
export default (): Recipe{} => {
  // …
  return {
    recipeId: 'smoke-test',
    description: 'A complete example',
    steps: [
      // …
    ]
  };
};
```

## Generate Panorama

The main production recipe. It generates the panorama tile set by producing AI images, composing bridge images between dependent tiles, and feeding those outputs into later steps until the required tile set is complete. Example: *generate panorama images and assemble as a single image*.

`src/recipes/generate-panorama.config.json`:

```JSON
{
  "promptFolder": "../framework/prompts/",
  "promptFIles": {
    "master": "master.md",
    "tile1": "tile-01.md",
    // …
    "tile9": "tile-09.md",
  },
  "docsFolder": "../framework/docs/",
  "markdown": {
    "notProvidedText": "(not provided)",
    "previewTableRow": "robot:preview-table-row",
    "promptExtrationRules": "(TBD)"
  },
  "compositionMapsR1folder": "../images/refs/R1",
  "compositionMapsR1": {
    "tile1": "151-tile1",
    "tile2": "151-tile2",
    "tile3": "151-tile3",
    "tile4": "151-tile4",
    "tile5": "151-tile5",
    "tile6": "151-tile6",
    "tile7": "151-tile7",
    "tile8": "151-tile8",
    "tile9": "151-tile9"
  },
  "generatedImagePath": "../images/outputs/generated",
  "filePrefix": "012",
  "fileIndex": 1,
  "samples": 3,
  "variations": 3,
  "bridgeImage": {
    "tileWidth": 1024,
    "tileHeight": 1536,
    "leftCropWidth": 341,
    "rightCropWidth": 341,
    "centerWidth": 342
  },
}
```

`src/recipes/generate-panorama.ts`:

```TS
export default (): Recipe => {
  const steps = [];

  steps.push(/* … */);
  // …

  return {
    recipeId: 'generate-panorama',
    description: 'Global Panorama Framework image generator',
    steps,
  };
};
```

# Steps and Service Tasks

A step is one ordered action inside a recipe. Each step declares the task to perform, the inputs it requires, and the output or side effect it is expected to produce. Example: *add content to a markdown file*.

`src/types/step.d.ts`:

```TS
interface Step {
  taskId: string;
  description: string;
  arguments: {
    // …
  }
  // …
}
```

`src/types/task.d.ts`: used in runner when parsing the output/plan.json

```TS
interface Task {
  taskId: string;
  description: string;
  arguments: {
    // …
  },
  state: 'queued'|'initialized'|'success'
  // …
}
```

## OpenAI

⚑ send prompts and upload file references, get generated responses and save images into fiesystem, …

`src/services/openai.ts`

```TS
// …
```

`src/services/openai.config.ts`

```JSON
{
  "imageGenerationServicePath": "/v1/images/generations",
  "imageEditServicePath": "/v1/images/edits",
  "responsesServicePath": "/v1/responses",
}
```

### Taks

- `generate-ai-image`

  ⚑ describe the the TS type (and/or the input parameters), like:

  ```TS
  interface generateAIimageInterface {
    id: 'create-image';
    prompt: string;
    saveAs: string;
    uploads: string[];
    model: string;
    …
  }
  ```

## Images

⚑ create bridge images (uses config) using Sharp

`src/services/images.ts`

### Taks

- `create-bridge-image`

  …

## MarkDown

⚑ Explanation…

⚑ edit markdown files (usually framework prompts).

⚑ add tiles row to preview table.

`src/services/markdown.ts`

### Taks

- `insert-markdown-text`

  ⚑ Uses placeholder in the MD files like `<!-- robot:preview-table-row:start -->` / `<!-- robot:preview-table-row:end -->` to have editions

- `read-markdown-text`

  ⚑ read a line or several lines base on… (what? SOmething like an XPath or DOM)

## Config

⚑ reads and updates the config file in filesystem, can update any .config.json (like the file index in `generate-panorama.config.js`)…

`src/services/config.ts`

### Taks

- `update-config`

  ⚑ Yeah, I will maintain that file index in config, much like a project itself can update its own package.json

## Et cetera

⚑ Miscelaneous tasks…

`src/services/etc.ts`

### Taks

- `run-recipe`

  Call another recipe (to make neasted recipes)

  ⚑ details…

# Builder

⚑ Improve this explanation:

⚑ its mainly a function with logic

⚑ reads config, builds the output/plan.json based on config, …

⚑ write a sample build file:

`src/builder.ts`:

```TS
class Builder {
  // …
  build() {
    // …
  }
  // …
}

new Builder().build();
```

# Plan

⚑  Explanation…

`src/types/plan.d.ts`:

```TS
interface Plan {
  planId: string;
  recipeId: string;
  tasks: Task[]
  // …
}
```

This interface is used by **Builder** and **Runner**.

Example `output/plan.json`:

```JSON
[
  {"title": "Generate tile 5 image", "…": "…"},
  {"title": "Generate ti;e 3 image", "…": "…"},
  {"title": "Compose bridge image in Sharper", "…": "…"},
  …
]
```

Created by the builder, have the steps and static file references. Also have progress status (saved each step execution) so the recipe can be resumed if stoped. 

Since Plan is loaded into the memory when runner starts, the Runner can save it back to the disk. If the application exists and then comes back (using resume for example), the updated Plan gets loaded and the cycle restarts.

# Runner

⚑ Explanation: its mainly a function with logic

⚑ detail: main loop, call services, … (with or without source code excerpt)

`src/runner.ts`:

```TS
class Runner {
  // …
  run() {
    // …
  }
  // …
}

new Runner().run();
```

# Other files

### `README.md`

Will be updated with the project changes: beyond the setup section, how to create the config and integrate with other folders in the project (like prompts and generated images), also code examples and anything according to the project evolution.

### `src/aux.ts`

⚑ not defined what to insert yet; reserved slot.

### `.gitignore`

Beyond the usual suspects, add: 

- `.env`

- `outputs/*`

# Tests

⚑ TBD: Suggestion is to start with filename generation, plan building, markdown targeting, bridge composition math, and runner dispatch with mocked OpenAI.
