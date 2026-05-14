# Workflow Service

Orchestration service for reusable runner-level workflows.

Implemented capability:

- `runRecipe`

`runRecipe` supports nested modes:

| `mode` | Required field | Behavior |
|--------|----------------|----------|
| `build` | `recipeId` | Compiles the recipe into a plan file; does not execute. |
| `exec` | `recipeId` | Builds the recipe then executes the plan from start. |
| `run` | `planId` | Executes an existing plan from start (resets state). |
| `resume` | `planId` | Executes an existing plan using persisted task state. |

It composes existing builder and runner commands and does not execute task logic directly.

Recipe usage examples:

```ts
export default {
  title: "Workflow Example",
  steps: [
    {
      title: "Build and execute nested recipe",
      taskId: "workflow.run-recipe",
      arguments: {
        mode: "exec",
        recipeId: "examples/empty",
      },
    },
    {
      title: "Run existing plan from start",
      taskId: "workflow.run-recipe",
      arguments: {
        mode: "run",
        planId: "examples/empty",
      },
    },
    {
      title: "Resume existing plan from persisted state",
      taskId: "workflow.run-recipe",
      arguments: {
        mode: "resume",
        planId: "examples/empty",
      },
    },
  ],
};
```
