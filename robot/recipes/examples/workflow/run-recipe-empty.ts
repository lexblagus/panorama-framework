import Log from "../../../src/utils/log.ts";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Workflow run example recipe");

  return {
    title: "Workflow run example recipe",
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
    ],
  };
}
