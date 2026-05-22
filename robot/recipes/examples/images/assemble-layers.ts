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
  log("info", "Assemble layered image recipe example");

  // WARNING: is not a good practice to write images in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const folderPath = `${context.context.repoRootFolder}/<package-name>/…`
  const folderPath = path.dirname(thisFilePath);
  const redImageFile = `${folderPath}/red.example.png`;
  const blueImageFile = `${folderPath}/blue.example.png`;
  const outputImageFile = `${folderPath}/assembled-layers.example.png`;
  log("debug", `folderPath=${JSON.stringify(folderPath)} output=${JSON.stringify(outputImageFile)}`);

  return {
    title: "Assemble layered image recipe example",
    steps: [
      {
        title: "Assemble layers",
        taskId: "image.assemble-layers",
        arguments: {
          inputs: [
            redImageFile,
            {
              imageFile: blueImageFile,
              position: "bottom-right",
              blend: "multiply",
              opacity: 0.5,
            },
          ],
          output: {
            imageFile: outputImageFile,
            format: "png",
            width: 200,
          },
        },
      },
    ],
  };
}
