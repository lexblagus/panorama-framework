import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const recipeConfig = context.recipeConfig
  
  console.log("Recipe configuration:", JSON.stringify(recipeConfig), '\n')

  return {
    title: "Read JSON recipe configuration example",
    steps: [],
  };
}
