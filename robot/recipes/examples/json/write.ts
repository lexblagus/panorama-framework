import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  
  // WARNING: is not a good practice to write JSON files in the recipes folder.
  // This is intended to be used outside `robot` package, e.g.:
  // const jsonFile = `${context.context.repoRootFolder}/<package-name>/…/….json`
  const jsonFile =
    `${context.robotPackageFolder}/recipes/${context.recipeId}.json`;

  return {
    title: "Write JSON recipe example",
    steps: [
      {
        title: "Write JSON",
        taskId: "json.write",
        arguments: {
          path: jsonFile,
          value: { success: true },
        },
      }
    ],
  };
}
