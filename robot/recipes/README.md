# Recipes

This folder is the recommended place for user-authored recipes.

`robot` currently resolves recipes from:

- `robot/recipes/`
- `robot/src/recipes/`

## Recipe ID to File Mapping

`--recipe <recipe-id>` maps to one of these forms:

- `<root>/<recipe-id>.ts`
- `<root>/<recipe-id>.js`
- `<root>/<recipe-id>.mjs`
- `<root>/<recipe-id>/index.ts`
- `<root>/<recipe-id>/index.js`
- `<root>/<recipe-id>/index.mjs`

Where `<root>` is `robot/recipes/` (recommended) or `robot/src/recipes/`.

Examples:

- `--recipe examples/empty` -> `robot/recipes/examples/empty.ts`
- `--recipe smoke-test` -> `robot/recipes/smoke-test/index.ts`

## Minimal Recipe Shape

```ts
const recipe = {
  title: "My Recipe",
  steps: [],
};

export default recipe;
```

Required fields:

- `title: string`
- `steps: Step[]`

`Step` shape:

- `title: string`
- `taskId: TaskId`
- `arguments` — typed per `taskId` (discriminated union in `src/types/step.ts`)
- `description?: string`

| `taskId` | Required `arguments` fields |
|----------|-----------------------------|
| `openai.generate-image` | `prompt`, `outputDir`, `outputFilePrefix` |
| `image.create-bridge` | `leftImageFile`, `rightImageFile`, `outputImageFile`, `leftCropWidth`, `rightCropWidth` |
| `image.compose-tiles` | `inputImages`, `outputImageFile` |
| `markdown.read` | `file` or `targetPath` |
| `markdown.write` | `file`, `content` |
| `markdown.insert` | `file`, `marker`, `content`, `position?` |
| `json.read` | `path` |
| `json.write` | `file`, `value` |
| `workflow.run-recipe` | `mode`, `recipeId` (build/exec) or `planId` (run/resume) |

## Supported Recipe Export Styles

1. Default object export:

```ts
export default {
  title: "Default Export Recipe",
  steps: [],
};
```

2. Named `recipe` export:

```ts
export const recipe = {
  title: "Named Export Recipe",
  steps: [],
};
```

3. Builder hook export:

```ts
export async function buildRecipe(context) {
  return {
    title: "Context Recipe",
    steps: [
      {
        title: "Write JSON",
        taskId: "json.write",
        arguments: {
          file: "robot/tests/.tmp/examples/output.json",
          value: { ok: true },
        },
      },
    ],
  };
}
```

`buildRecipe(context)` receives:

- `recipeId`
- `repoRootFolder`
- `robotPackageFolder`
- `recipeConfig` (from folder `config.json` when present)
- `services` (`json`, `markdown`, `image`, `openai`, `workflow`) for builder-time logic

## Recipe IDs

IDs may include subfolders:

- `examples/empty`
- `examples/panorama/v1`

Each segment must match:

- `^[a-z0-9_-][a-z0-9_.-]*$`

Invalid IDs include:

- `.bad`
- `../escape`
- `/absolute`
- `examples//empty`

## Running a Recipe

Build only:

```bash
./robot/bin/robot build --recipe examples/empty
```

Build + execute:

```bash
./robot/bin/robot exec --recipe examples/empty
```

Run an existing plan:

```bash
./robot/bin/robot run --plan examples/empty
```

Resume from persisted task state:

```bash
./robot/bin/robot resume --plan examples/empty
```
