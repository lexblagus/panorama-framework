import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const jsonGlobalConfig = await context.services.json.readGlobalConfig()
  
  console.log("Global configuration:", JSON.stringify(jsonGlobalConfig), '\n')
  
  return {
    title: "Read JSON global configuration example",
    steps: [],
  };
}
