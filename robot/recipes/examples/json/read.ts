import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Read JSON recipe example");

  const jsonFile =
    `${context.robotPackageFolder}/recipes/${context.recipeId}.example.json`;
  log("debug", `jsonFile=${JSON.stringify(jsonFile)}`);

  const jsonContents = await context.services.json.read(jsonFile);
  log("debug", `JSON contents: ${JSON.stringify(jsonContents)}`);

  return {
    title: "Read JSON recipe example",
    steps: [],
  };
}
