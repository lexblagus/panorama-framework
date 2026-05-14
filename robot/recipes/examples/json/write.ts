import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log('info', 'Write JSON recipe example');

  // WARNING: is not a good practice to write files in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const jsonFile = `${context.context.repoRootFolder}/<package-name>/…/….json`
  const jsonFile =
    `${context.robotPackageFolder}/recipes/${context.recipeId}.example.json`;
  log('debug', `jsonFile=${JSON.stringify(jsonFile)}`);

  return {
    title: "Write JSON recipe example",
    steps: [
      {
        title: "Write JSON",
        taskId: "json.write",
        arguments: {
          file: jsonFile,
          value: { success: true },
        },
      }
    ],
  };
}
