# Workflow Service

Orchestration service for reusable runner-level workflows.

Implemented capability:

- `runRecipe`

`runRecipe` supports nested modes:

- `build`
- `exec`
- `run`
- `resume`

It composes existing builder and runner commands and does not execute task logic directly.

Recipe usage example:

```ts
export default {
  title: "Workflow Example",
  steps: [
    {
      title: "Run nested recipe",
      taskId: "workflow.run-recipe",
      arguments: {
        mode: "exec",
        recipeId: "examples/empty",
      },
    },
  ],
};
```
