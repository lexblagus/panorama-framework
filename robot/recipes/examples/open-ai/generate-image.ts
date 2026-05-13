import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/log.ts";

const thisFilePath = fileURLToPath(import.meta.url);

export async function buildRecipe(
  _context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Generate image OpenAI example");

  // WARNING: is not a good practice to write images in the recipes folder.
  // This is just an example intended to be used outside `robot` package, e.g.:
  // const folderPath = `${context.context.repoRootFolder}/<package-name>/…`
  const folderPath = path.dirname(thisFilePath);
  const uploadImageFile1 = `${folderPath}/upload-image-1.example.png`;
  const uploadImageFile2 = `${folderPath}/upload-image-2.example.png`;
  log("debug", `folderPath=${JSON.stringify(folderPath)}`);

  return {
    title: "Generate image OpenAI example",
    steps: [
      {
        title: "Generate blank image",
        taskId: "openai.generate-image",
        arguments: {
          prompt: "Just an empty, blank image",
          outputDir: folderPath,
          outputFilePrefix: "generated-image.example",
          // optional:
          model: "gpt-image-1-mini",
          size: "1024x1024",
          n: 1,
          quality: "low",
          outputFormat: "png",
          outputCompression: 100,
          background: "transparent",
          saveSidecarMetadataFile: false,
        },
      },
      {
        title: "Combine images",
        taskId: "openai.generate-image",
        arguments: {
          prompt: "Using the two uploaded images, create a clean side-by-side comparison layout.",
          outputDir: folderPath,
          outputFilePrefix: "combined-images.example",
          inputImages: [uploadImageFile1, uploadImageFile2],
          // optional:
          model: "gpt-image-1-mini",
          size: "1024x1024",
          n: 1,
          quality: "low",
          outputFormat: "png",
          outputCompression: 100,
          saveSidecarMetadataFile: false,
        },
      }
    ],
  };
}
