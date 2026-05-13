import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/log.ts";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Insert markdown recipe example");

  // WARNING: is not a good practice to write files in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const mdFile = `${context.context.repoRootFolder}/<package-name>/…/….md`
  const mdFile =
    `${context.robotPackageFolder}/recipes/${context.recipeId}.example.md`;
  log("debug", `mdFile=${JSON.stringify(mdFile)}`);

  return {
    title: "Insert markdown recipe example",
    steps: [
      {
        title: "Insert before",
        taskId: "markdown.insert",
        arguments: {
          file: mdFile,
          marker: "robot:content-before",
          content: "***inserted before marker***",
          position: "before",
        },
      },
      {
        title: "Insert after",
        taskId: "markdown.insert",
        arguments: {
          file: mdFile,
          marker: "robot:content-after",
          content: "***inserted after marker***",
          position: "after",
        },
      },
      {
        title: "Insert over",
        taskId: "markdown.insert",
        arguments: {
          file: mdFile,
          marker: "robot:content-over",
          content: "***inserted over marker***",
          position: "over",
        },
      },
      {
        title: "Insert in between",
        taskId: "markdown.insert",
        arguments: {
          file: mdFile,
          marker: ["robot:content-between-before", "robot:content-between-after"],
          content: "***inserted contents in between***",
          position: "between",
        },
      }
    ],
  };
}
