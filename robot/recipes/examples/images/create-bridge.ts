import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

const thisFilePath = fileURLToPath(import.meta.url);

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {

  // WARNING: is not a good practice to write images in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const folderPath = `${context.context.repoRootFolder}/<package-name>/…`
  const folderPath = path.dirname(thisFilePath);
  const leftImageFile = `${folderPath}/white.example.png`
  const rightImageFile = `${folderPath}/black.example.png`
  const outputImageFile = `${folderPath}/bridge.example.png`

  return {
    title: "Write bridge file recipe example",
    steps: [
      {
        title: "Write markdown",
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
