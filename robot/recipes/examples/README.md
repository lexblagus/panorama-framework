# Example Recipes

Runnable examples for every service and capability.

## empty

A no-op recipe with zero steps — useful for testing the build/run pipeline.

```bash
./robot/bin/robot exec --recipe examples/empty
```

## json

### json/read

Reads a JSON file and logs the result.

```bash
./robot/bin/robot exec --recipe examples/json/read
```

### json/write

Writes a JSON file to the `.tmp` output folder.

```bash
./robot/bin/robot exec --recipe examples/json/write
```

### json/read-global-config

Reads `robot/config.json` via the global config helper.

```bash
./robot/bin/robot exec --recipe examples/json/read-global-config
```

### json/recipe-context-config

Reads `config.json` from the recipe folder via `context.recipeConfig`.

```bash
./robot/bin/robot exec --recipe examples/json/recipe-context-config
```

### json/recipe-state

Demonstrates transient recipe state: reads persisted state, increments a counter, and writes it back.

```bash
./robot/bin/robot exec --recipe examples/json/recipe-state
```

## markdown

### markdown/read

Reads a markdown file and logs the content.

```bash
./robot/bin/robot exec --recipe examples/markdown/read
```

### markdown/write

Writes a markdown file to the `.tmp` output folder.

```bash
./robot/bin/robot exec --recipe examples/markdown/write
```

### markdown/insert

Inserts content around markers in a markdown file.

```bash
./robot/bin/robot exec --recipe examples/markdown/insert
```

## images

### images/create-bridge

Crops two images and composites them with a transparent center band.

```bash
./robot/bin/robot exec --recipe examples/images/create-bridge
```

### images/compose-tiles

Assembles a horizontal preview strip from multiple tile images.

```bash
./robot/bin/robot exec --recipe examples/images/compose-tiles
```

## open-ai

### open-ai/generate-image

Calls the OpenAI image generation API. Requires `OPENAI_API_KEY` in `.env`.

```bash
./robot/bin/robot exec --recipe examples/open-ai/generate-image
```

## workflow

### workflow/run-recipe-empty

Demonstrates nested recipe execution: builds and runs `examples/empty` as a sub-recipe, then runs its existing plan.

```bash
./robot/bin/robot exec --recipe examples/workflow/run-recipe-empty
```

### workflow/run-recipe-all

Runs every example recipe in sequence via `workflow.run-recipe`. Does not include itself (infinite recursion guard).

```bash
./robot/bin/robot exec --recipe examples/workflow/run-recipe-all
```
