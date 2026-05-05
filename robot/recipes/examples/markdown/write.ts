import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  
  const mdFile = `${context.robotPackageFolder}/recipes/${context.recipeId}.example.md`;

  return {
    title: "Write markdown recipe example",
    steps: [
      {
        title: "Write markdown",
        taskId: "markdown.write",
        arguments: {
          file: mdFile,
          content: "# Hello World",
        },
      }
    ],
  };
}
