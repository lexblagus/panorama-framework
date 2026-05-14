import Log from "../../../src/utils/log.ts";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Workflow run recipe: all examples");

  return {
    title: "Workflow run all recipe examples",
    steps: [
      {
        title: "Example: empty",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/empty",
        },
      },

      {
        title: "Example: json read",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/json/read",
        },
      },
      {
        title: "Example: json write",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/json/write",
        },
      },
      {
        title: "Example: json read-global-config",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/json/read-global-config",
        },
      },
      {
        title: "Example: json recipe-context-config",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/json/recipe-context-config",
        },
      },
      {
        title: "Example: json recipe-state",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/json/recipe-state",
        },
      },

      {
        title: "Example: markdown read",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/markdown/read",
        },
      },
      {
        title: "Example: markdown write",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/markdown/write",
        },
      },
      {
        title: "Example: markdown insert",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/markdown/insert",
        },
      },

      {
        title: "Example: images create-bridge",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/images/create-bridge",
        },
      },
      {
        title: "Example: images compose-tiles",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/images/compose-tiles",
        },
      },

      {
        title: "Example: open-ai generate-image",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/open-ai/generate-image",
        },
      },

      // Nested workflow demo (do not exec `examples/workflow/run-recipe-all` here — infinite recursion).
      {
        title: "Example: workflow run-recipe-empty",
        taskId: "workflow.run-recipe",
        arguments: {
          mode: "exec",
          recipeId: "examples/workflow/run-recipe-empty",
        },
      },
    ],
  };
}
