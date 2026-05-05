import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const jsonFile =
    `${context.robotPackageFolder}/recipes/${context.recipeId}.example.json`;

  const jsonContents = await context.services.json.read(jsonFile)

  console.log("JSON contents:", JSON.stringify(jsonContents), '\n')

  return {
    title: "Read JSON recipe example",
    steps: [],
  };
}
