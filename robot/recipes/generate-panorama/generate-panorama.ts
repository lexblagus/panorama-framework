import type { BuildRecipeContext } from "../../src/types/builder.ts";
import type { Recipe } from "../../src/types/recipe.ts";
import type { Step } from "../../src/types/step.ts";

type LocalState = { index: number };

type GeneratePanoramaConfig = {
  promptFolder: string;
  generatedImagePath: string;
  filePrefix: string;
  fileIndex: number;
  image: {
    model: string;
    quality: string;
    outputFormat: string;
    outputCompression: number;
    masterSize: string;
    tileSize: string;
    leftCropWidth: number;
    rightCropWidth: number;
  };
};

function formatAsThreeDigits(value: number): string {
  return String(Math.trunc(value)).padStart(3, "0");
}

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const recipeId = context.recipeId;

  // Get config
  const rawConfig = context.recipeConfig;
  if (!rawConfig) {
    throw new Error("generate-panorama requires recipe config");
  }
  const recipeConfig = rawConfig as GeneratePanoramaConfig;
  // console.log("Recipe configuration:", JSON.stringify(recipeConfig, null, 2), '\n');

  const steps: Step[] = [];

  // Initialize local state and get next index
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    index: recipeConfig.fileIndex,
  } satisfies LocalState);
  const state =
    (await context.services.json.readRecipeState(recipeId)) ?? initial;
  const index = typeof state.index === "number" ? state.index : 0;
  const nextIndex = index + 1;
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    index: nextIndex,
  });

  // Set Master filename
  const generateImageFolder = `${context.repoRootFolder}/${recipeConfig.generatedImagePath}`;
  console.log(`generateImageFolder: "${generateImageFolder}"`);
  const masterImagePrefix = `${recipeConfig.filePrefix}-${formatAsThreeDigits(nextIndex)}-master`;
  console.log(`masterImagePrefix: "${masterImagePrefix}"`);

  // Get Master prompt
  const masterBaseFile = `${context.repoRootFolder}/${recipeConfig.promptFolder}/master-base.md`;
  const masterBaseContents =
    await context.services.markdown.read(masterBaseFile);
  // console.log(`Markdown contents: \`\`\`\n${masterBaseContents}\`\`\`\n`);
  const masterOnlyFile = `${context.repoRootFolder}/${recipeConfig.promptFolder}/master-only.md`;
  const masterOnlyContents =
    await context.services.markdown.read(masterOnlyFile);
  // console.log(`Markdown contents: \`\`\`\n${masterOnlyContents}\`\`\`\n`);
  const masterPrompt = `${masterBaseContents}\n${masterOnlyContents}`;
  // console.log(`prompt: \`\`\`\n${masterPrompt}\`\`\`\n`);

  steps.push({
    title: "Generate master image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: masterPrompt,
      outputDir: generateImageFolder,
      outputFilePrefix: masterImagePrefix,
      // optional:
      model: recipeConfig.image.model,
      size: recipeConfig.image.masterSize,
      n: 1,
      quality: recipeConfig.image.quality,
      outputFormat: recipeConfig.image.outputFormat,
      outputCompression: recipeConfig.image.outputCompression,
      saveSidecarMetadataFile: false,
    },
  });

  return {
    title: "Generate Panorama",
    steps,
  };
}
