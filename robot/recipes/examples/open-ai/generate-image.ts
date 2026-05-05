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
  const outputImageFile = `${folderPath}/generated-image.example.png`

  return {
    title: "Generate image OpenAI example",
    steps: [
      {
        title: "Generate image",
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
      }
    ],
  };
}
