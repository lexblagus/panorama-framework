# JSON Service

`JsonService` centralizes JSON file IO for:

- generic JSON reads and writes
- `robot/config.json`
- plan files in `robot/plans/`
- transient recipe state in `robot/transient/`

Notes:

- `write` defaults to `formatted` output with 2-tab indentation.
- Pass `{ format: "compact" }` for compact one-line JSON output.
- `readRecipeState` returns `null` if the state file does not exist.
- `initializeRecipeState` writes fallback seed values only when no state file exists.

Recipe usage examples for all JSON service tasks:

`json.write` task:

```ts
{
  title: "Write manifest",
  taskId: "json.write",
  arguments: {
    file: "robot/tests/.tmp/examples/manifest.json",
    value: { ok: true },
  },
}
```

`json.read` task:

```ts
{
  title: "Read manifest",
  taskId: "json.read",
  arguments: {
    path: "robot/tests/.tmp/examples/manifest.json",
  },
}
```

Combined in one recipe:

```ts
export default {
  title: "JSON Example",
  steps: [
    {
      title: "Write manifest",
      taskId: "json.write",
      arguments: {
        file: "robot/tests/.tmp/examples/manifest.json",
        value: { ok: true },
      },
    },
    {
      title: "Read manifest",
      taskId: "json.read",
      arguments: {
        path: "robot/tests/.tmp/examples/manifest.json",
      },
    },
  ],
};
```

Builder/runner service-method examples:

```ts
const globalConfig = await services.json.readGlobalConfig();

const plan = await services.json.readPlan("examples/empty");
await services.json.writePlan("examples/empty", plan);

const state = await services.json.readRecipeState("examples/empty");
await services.json.writeRecipeState("examples/empty", {
  ...(state ?? {}),
  currentRun: 2,
});

await services.json.initializeRecipeState("examples/empty", {
  currentRun: 1,
});
```

Using transient state inside a recipe (`buildRecipe`):

```ts
export async function buildRecipe(context) {
  const recipeId = context.recipeId;

  // Seed state only once when missing.
  const seed = await context.services.json.initializeRecipeState(recipeId, {
    currentRun: 0,
  });

  // Read latest persisted state.
  const state = (await context.services.json.readRecipeState(recipeId)) ?? seed;
  const currentRun =
    typeof state.currentRun === "number" ? state.currentRun : 0;
  const nextRun = currentRun + 1;

  // Persist updated transient state for the next build/exec/resume cycle.
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    currentRun: nextRun,
  });

  return {
    title: "Transient State Example",
    steps: [
      {
        title: "Persist run marker",
        taskId: "json.write",
        arguments: {
          file: "robot/tests/.tmp/examples/current-run.json",
          value: { currentRun: nextRun },
        },
      },
    ],
  };
}
```

TypeScript-typed dynamic recipe example:

```ts
import type { BuildRecipeContext } from "../../types/builder.js";
import type { Recipe } from "../../types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const jsonFile = `robot/tests/.tmp/examples/${context.recipeId}.json`;

  return {
    title: "Write/Read JSON Example",
    steps: [
      {
        title: "Write manifest",
        taskId: "json.write",
        arguments: {
          file: jsonFile,
          value: { ok: true },
        },
      },
      {
        title: "Read manifest",
        taskId: "json.read",
        arguments: {
          path: jsonFile,
        },
      },
    ],
  };
}
```
