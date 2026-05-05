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
  const whiteImageFile = `${folderPath}/white.example.png`
  const blackImageFile = `${folderPath}/black.example.png`
  const outputImageFile = `${folderPath}/composed-tiles.example.png`

  return {
    title: "Compose tiles images recipe example",
    steps: [
      {
        title: "Compose tiles",
        taskId: "image.compose-tiles",
        arguments: {
          inputImages: [
            whiteImageFile,
            blackImageFile,
            whiteImageFile,
            blackImageFile,
          ],
          outputImageFile,
        },
      }
    ],
  };
}
