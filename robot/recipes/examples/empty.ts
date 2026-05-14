import Log from "../../src/utils/log.ts";
import type { Recipe } from "../../src/types/recipe.js";

export async function buildRecipe(): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Empty example recipe: minimal with no steps");

  return {
    title: "Empty example recipe: minimal with no steps",
    steps: [],
  };
}
