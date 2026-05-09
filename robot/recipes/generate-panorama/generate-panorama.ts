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

  // Upload filenames replacements
  const promptTile5CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile5 + "`";
  const promptTile5MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile5BridgeLabel = "(not uploaded)";
  const promptTile5TextReplaced = promptTextTile5
    .replace("`r1-composition-map.png`", promptTile5CompMapR1Label)
    .replace("`master.png`", promptTile5MasterLabel)
    .replace("`bridge.png`", promptTile5BridgeLabel);

  // Step definition
  const stepTile5: Step = {
    title: "Generate tile 5 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile5TextReplaced,
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
  // Tile 1 step
  // -----------------------------------------------------------------------------

  // Get Master Base prompt
  const promptTextTile1 = await context.services.markdown.read(
    promptFilesFullPath.tile1
  );
  // console.log(`promptTextTile1: "${promptTextTile1}"`);

  // Upload filenames replacements
  const promptTile1CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile1 + "`";
  const promptTile1MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile1RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile1BridgeLabel = "(not uploaded)";
  const promptTile1TextReplaced = promptTextTile1
    .replace("`r1-composition-map.png`", promptTile1CompMapR1Label)
    .replace("`master.png`", promptTile1MasterLabel)
    .replace("`ruler.png`", promptTile1RulerLabel)
    .replace("`bridge.png`", promptTile1BridgeLabel);

  // Step definition
  const stepTile1: Step = {
    title: "Generate tile 1 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile1TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile1Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile1,
        generatedImagesFullPaths.tile5Image,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepTile1: "${JSON.stringify(stepTile1, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Tile 9 step
  // -----------------------------------------------------------------------------

  // Get Master Base prompt
  const promptTextTile9 = await context.services.markdown.read(
    promptFilesFullPath.tile9
  );
  // console.log(`promptTextTile9: "${promptTextTile9}"`);

  // Upload filenames replacements
  const promptTile9CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile9 + "`";
  const promptTile9MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile9RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile9BridgeLabel = "(not uploaded)";
  const promptTile9TextReplaced = promptTextTile9
    .replace("`r1-composition-map.png`", promptTile9CompMapR1Label)
    .replace("`master.png`", promptTile9MasterLabel)
    .replace("`ruler.png`", promptTile9RulerLabel)
    .replace("`bridge.png`", promptTile9BridgeLabel);

  // Step definition
  const stepTile9: Step = {
    title: "Generate tile 9 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile9TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile9Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile9,
        generatedImagesFullPaths.tile5Image,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepTile9: "${JSON.stringify(stepTile9, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Tile 3 step
  // -----------------------------------------------------------------------------

  // Get Master Base prompt
  const promptTextTile3 = await context.services.markdown.read(
    promptFilesFullPath.tile3
  );
  // console.log(`promptTextTile3: "${promptTextTile3}"`);

  // Upload filenames replacements
  const promptTile3CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile3 + "`";
  const promptTile3MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile3RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile3BridgeLabel = "(not uploaded)";
  const promptTile3TextReplaced = promptTextTile3
    .replace("`r1-composition-map.png`", promptTile3CompMapR1Label)
    .replace("`master.png`", promptTile3MasterLabel)
    .replace("`ruler.png`", promptTile3RulerLabel)
    .replace("`bridge.png`", promptTile3BridgeLabel);

  // Step definition
  const stepTile3: Step = {
    title: "Generate tile 3 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile3TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile3Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile3,
        generatedImagesFullPaths.tile5Image,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepTile3: "${JSON.stringify(stepTile3, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Tile 7 step
  // -----------------------------------------------------------------------------

  // Get Master Base prompt
  const promptTextTile7 = await context.services.markdown.read(
    promptFilesFullPath.tile7
  );
  // console.log(`promptTextTile7: "${promptTextTile7}"`);

  // Upload filenames replacements
  const promptTile7CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile7 + "`";
  const promptTile7MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile7RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile7BridgeLabel = "(not uploaded)";
  const promptTile7TextReplaced = promptTextTile7
    .replace("`r1-composition-map.png`", promptTile7CompMapR1Label)
    .replace("`master.png`", promptTile7MasterLabel)
    .replace("`ruler.png`", promptTile7RulerLabel)
    .replace("`bridge.png`", promptTile7BridgeLabel);

  // Step definition
  const stepTile7: Step = {
    title: "Generate tile 7 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile7TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile7Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile7,
        generatedImagesFullPaths.tile5Image,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  // console.log(`stepTile7: "${JSON.stringify(stepTile7, null, 2)}"`);

  // -----------------------------------------------------------------------------
  // Next steps
  // -----------------------------------------------------------------------------
  // Bridges
  // Tiles 2, 4, 6, 8
  // Preview
  // Latest compiled preview at `framework/README.md`

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
    steps: [stepMaster, stepTile5, stepTile1, stepTile9, stepTile3, stepTile7],
    // steps: [],
  };
}
// =============================================================================
