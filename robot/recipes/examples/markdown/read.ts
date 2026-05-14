import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Read markdown recipe example");

  const mdFile = `${context.robotPackageFolder}/recipes/${context.recipeId}.example.md`;
  log("debug", `mdFile=${JSON.stringify(mdFile)}`);

  const mdContents = await context.services.markdown.read(mdFile);
  log("debug", `Markdown contents:\n${mdContents}`);

  return {
    title: "Read MarkDown recipe example",
    steps: [],
  };
}
