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
- `arguments: Record<string, unknown>`
- `description?: string`

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
