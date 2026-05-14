import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Read JSON global configuration example");

  const jsonGlobalConfig = await context.services.json.readGlobalConfig();
  log("debug", `Global configuration: ${JSON.stringify(jsonGlobalConfig)}`);

  return {
    title: "Read JSON global configuration example",
    steps: [],
  };
}
