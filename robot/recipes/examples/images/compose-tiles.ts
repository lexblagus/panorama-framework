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
  log("info", "Compose tiles images recipe example");

  // WARNING: is not a good practice to write images in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const folderPath = `${context.context.repoRootFolder}/<package-name>/…`
  const folderPath = path.dirname(thisFilePath);
  const whiteImageFile = `${folderPath}/white.example.png`;
  const yellowImageFile = `${folderPath}/yellow.example.png`;
  const greenImageFile = `${folderPath}/green.example.png`;
  const redImageFile = `${folderPath}/red.example.png`;
  const blueImageFile = `${folderPath}/blue.example.png`;
  const blackImageFile = `${folderPath}/black.example.png`;
  const outputImageFile = `${folderPath}/composed-tiles.example.png`;
  log("debug", `folderPath=${JSON.stringify(folderPath)} output=${JSON.stringify(outputImageFile)}`);

  return {
    title: "Compose tiles images recipe example",
    steps: [
      {
        title: "Compose tiles",
        taskId: "image.compose-tiles",
        arguments: {
          inputImages: [
            whiteImageFile,
            yellowImageFile,
            greenImageFile,
            redImageFile,
            blueImageFile,
            blackImageFile,
          ],
          outputImageFile,
        },
      }
    ],
  };
}
