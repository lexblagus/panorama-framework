import { get } from "node:http";
import type { BuildRecipeContext } from "../../src/types/builder.ts";
import type { Recipe } from "../../src/types/recipe.ts";
import type { Step } from "../../src/types/step.ts";

// -----------------------------------------------------------------------------
// Local types
// -----------------------------------------------------------------------------

type LocalState = { index: number };

type GeneratePanoramaConfig = {
  promptFolder: string;
  promptFiles: {
    masterBase: string;
    masterOnly: string;
    tile1: string;
    tile2: string;
    tile3: string;
    tile4: string;
    tile5: string;
    tile6: string;
    tile7: string;
    tile8: string;
    tile9: string;
  };
  compositionMapsR1Folder: string;
  compositionMapsR1: {
    tile1: string;
    tile2: string;
    tile3: string;
    tile4: string;
    tile5: string;
    tile6: string;
    tile7: string;
    tile8: string;
    tile9: string;
  };
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

// -----------------------------------------------------------------------------
// Auxiliar functions
// -----------------------------------------------------------------------------

function formatAsThreeDigits(value: number): string {
  return String(Math.trunc(value)).padStart(3, "0");
}

// =============================================================================
export async function buildRecipe(
  context: BuildRecipeContext
): Promise<Recipe> {
  // -----------------------------------------------------------------------------
  // Context and configuration
  // -----------------------------------------------------------------------------
  const recipeId = context.recipeId;

  // Get config
  const rawConfig = context.recipeConfig;
  if (!rawConfig) {
    throw new Error("generate-panorama requires recipe config");
  }
  const recipeConfig = rawConfig as GeneratePanoramaConfig;
  // console.log("Recipe configuration:", JSON.stringify(recipeConfig, null, 2), '\n');

  // -----------------------------------------------------------------------------
  // Local state and file index
  // -----------------------------------------------------------------------------
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    index: recipeConfig.fileIndex,
  } satisfies LocalState);
  const state =
    (await context.services.json.readRecipeState(recipeId)) ?? initial;
  let currentFileIndex =
    (typeof state.index === "number" ? state.index : 0) + 1;

  // -----------------------------------------------------------------------------
  // Generate image file prefixes
  // -----------------------------------------------------------------------------
  // Image folders and files
  const generateImageFolder = `${context.repoRootFolder}/${recipeConfig.generatedImagePath}`;
  // console.log(`generateImageFolder: "${generateImageFolder}"`);

  const getPrefix = (index: number, suffix: string) =>
    `${recipeConfig.filePrefix}-${formatAsThreeDigits(index)}-${suffix}`;

  const generateImageFilePrefixes = {
    masterImage: getPrefix(currentFileIndex++, "master"),
    tile1Image: getPrefix(currentFileIndex++, "tile1"),
    tile2Image: getPrefix(currentFileIndex++, "tile2"),
    tile3Image: getPrefix(currentFileIndex++, "tile3"),
    tile4Image: getPrefix(currentFileIndex++, "tile4"),
    tile5Image: getPrefix(currentFileIndex++, "tile5"),
    tile6Image: getPrefix(currentFileIndex++, "tile6"),
    tile7Image: getPrefix(currentFileIndex++, "tile7"),
    tile8Image: getPrefix(currentFileIndex++, "tile8"),
    tile9Image: getPrefix(currentFileIndex++, "tile9"),
    bridge2Image: getPrefix(currentFileIndex++, "bridge-2"),
    bridge4Image: getPrefix(currentFileIndex++, "bridge-4"),
    bridge6Image: getPrefix(currentFileIndex++, "bridge-6"),
    bridge8Image: getPrefix(currentFileIndex++, "bridge-8"),
  };
  /* console.log(
    `generateImageFilePrefixes: ${JSON.stringify(
      generateImageFilePrefixes,
      null,
      2
    )}`
  ); */

  const generatedImagesFullPaths = Object.fromEntries(
    Object.entries(generateImageFilePrefixes).map(([key, value]) => [
      key,
      `${generateImageFolder}/${value}.${recipeConfig.image.outputFormat}`,
    ])
  );
  /* console.log(
    `generatedImagesFullPaths: ${JSON.stringify(
      generatedImagesFullPaths,
      null,
      2
    )}`
  ); */

  // -----------------------------------------------------------------------------
  // Composition map reference images
  // -----------------------------------------------------------------------------
  const r1CompRefImagesFolder = `${context.repoRootFolder}/${recipeConfig.compositionMapsR1Folder}`;
  // console.log(`r1CompRefImagesFolder: "${r1CompRefImagesFolder}"`);

  const r1CompRefImagesFullPaths = Object.fromEntries(
    Object.entries(recipeConfig.compositionMapsR1).map(([key, value]) => [
      key,
      `${r1CompRefImagesFolder}/${value}`,
    ])
  );
  /* console.log(
    `r1CompRefImagesFullPaths: ${JSON.stringify(
      r1CompRefImagesFullPaths,
      null,
      2
    )}`
  ); */

  // -----------------------------------------------------------------------------
  // Prompt files
  // -----------------------------------------------------------------------------
  const promptFilesFullPath = {
    masterBase: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.masterBase}`,
    masterOnly: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.masterOnly}`,
    tile1: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile1}`,
    tile2: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile2}`,
    tile3: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile3}`,
    tile4: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile4}`,
    tile5: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile5}`,
    tile6: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile6}`,
    tile7: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile7}`,
    tile8: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile8}`,
    tile9: `${context.repoRootFolder}/${recipeConfig.promptFolder}/${recipeConfig.promptFiles.tile9}`,
  };
  /* console.log(
    `promptFilesFullPath: "${JSON.stringify(promptFilesFullPath, null, 2)}"`
  ); */

  // -----------------------------------------------------------------------------
  // Step defaults
  // -----------------------------------------------------------------------------
  const stepDefaults = {
    outputDir: generateImageFolder,
    model: recipeConfig.image.model,
    n: 1,
    quality: recipeConfig.image.quality,
    outputFormat: recipeConfig.image.outputFormat,
    outputCompression: recipeConfig.image.outputCompression,
    saveSidecarMetadataFile: false,
  };

  // -----------------------------------------------------------------------------
  // Master step
  // -----------------------------------------------------------------------------

  const promptTextMasterBase = await context.services.markdown.read(
    promptFilesFullPath.masterBase
  );
  const promptTextMasterOnly = await context.services.markdown.read(
    promptFilesFullPath.masterOnly
  );
  const promptTextMaster = `${promptTextMasterBase}\n${promptTextMasterOnly}`;
  // console.log(`promptTextMaster: "${promptTextMaster}"`);

  const stepMaster: Step = {
    title: "Generate master image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTextMaster,
      outputFilePrefix: generateImageFilePrefixes.masterImage,
      size: recipeConfig.image.masterSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepMaster: "${JSON.stringify(stepMaster, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Tile 5 step
  // -----------------------------------------------------------------------------

  // Get Master Base prompt
  const promptTextTile5 = await context.services.markdown.read(
    promptFilesFullPath.tile5
  );
  // console.log(`promptTextTile5: "${promptTextTile5}"`);

  const promptTextTile5Replaced = promptTextTile5
    .replace("`tile5-r1.png`", "`" + recipeConfig.compositionMapsR1.tile5 + "`")
    .replace(
      "`master.png`",
      "`" +
        generateImageFilePrefixes.masterImage +
        "." +
        recipeConfig.image.outputFormat +
        "`"
    )
    .replace("`tile4-6-bridge.png`", "(not uploaded)");

  const stepTile5: Step = {
    title: "Generate tile 5 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTextTile5Replaced,
      outputFilePrefix: generateImageFilePrefixes.tile5Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile5,
        generatedImagesFullPaths.masterImage,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepTile5: "${JSON.stringify(stepTile5, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Finish
  // -----------------------------------------------------------------------------
  // Save state
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    index: currentFileIndex,
  });

  // Return steps
  return {
    title: "Generate Panorama",
    steps: [stepMaster, stepTile5],
    // steps: [],
  };
}
// =============================================================================
