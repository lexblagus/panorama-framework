import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

const thisFilePath = fileURLToPath(import.meta.url);

export async function buildRecipe(
  _context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Create bridge image recipe example");

  // WARNING: is not a good practice to write images in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const folderPath = `${context.context.repoRootFolder}/<package-name>/…`
  const folderPath = path.dirname(thisFilePath);
  const fixturesPath = path.resolve(path.dirname(thisFilePath), "../../../tests/fixtures/images");
  const leftImageFile = `${fixturesPath}/white.example.png`;
  const rightImageFile = `${fixturesPath}/black.example.png`;
  const outputImageFile = `${folderPath}/bridge.example.png`;
  log("debug", `folderPath=${JSON.stringify(folderPath)} output=${JSON.stringify(outputImageFile)}`);

  return {
    title: "Create bridge image recipe example",
    steps: [
      {
        title: "Create bridge image step",
        taskId: "image.create-bridge",
        arguments: {
          leftImageFile,
          rightImageFile,
          outputImageFile,
          leftCropWidth: 33,
          rightCropWidth: 33,
        },
      }
    ],
  };
}
