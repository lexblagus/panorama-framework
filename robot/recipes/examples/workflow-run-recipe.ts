import type { Recipe } from "../../src/types/recipe.js";

const workflowRunRecipe: Recipe = {
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

export default workflowRunRecipe;
