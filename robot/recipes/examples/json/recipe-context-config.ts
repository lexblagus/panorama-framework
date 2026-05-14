import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Read JSON recipe configuration example");

  const recipeConfig = context.recipeConfig;
  log("debug", `Recipe configuration: ${JSON.stringify(recipeConfig)}`);

  return {
    title: "Read JSON recipe configuration example",
    steps: [],
  };
}
