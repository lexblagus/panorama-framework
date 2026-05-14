import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Write markdown recipe example");

  const mdFile = `${context.robotPackageFolder}/recipes/${context.recipeId}.example.md`;
  log("debug", `mdFile=${JSON.stringify(mdFile)}`);

  return {
    title: "Write markdown recipe example",
    steps: [
      {
        title: "Write markdown",
        taskId: "markdown.write",
        arguments: {
          file: mdFile,
          content: "# Hello World",
        },
      }
    ],
  };
}
