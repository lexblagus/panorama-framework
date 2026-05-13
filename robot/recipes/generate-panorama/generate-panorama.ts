import type { BuildRecipeContext } from "../../src/types/builder.ts";
import type { Recipe } from "../../src/types/recipe.ts";
import type { Step } from "../../src/types/step.ts";
import Log from "../../src/log.ts";
import { parseGeneratePanoramaConfig } from "./config.schema.ts";

// -----------------------------------------------------------------------------
// Local types
// -----------------------------------------------------------------------------

type LocalState = { index: number };

// -----------------------------------------------------------------------------
// Auxiliar functions
// -----------------------------------------------------------------------------

function padZeroes(value: number, padLength: number = 4): string {
  return String(Math.trunc(value)).padStart(padLength, "0");
}

// =============================================================================
export async function buildRecipe(
  context: BuildRecipeContext
): Promise<Recipe> {
  const log = new Log('recipe', 'magenta');

  // -----------------------------------------------------------------------------
  log('info', 'Context and configuration');
  // -----------------------------------------------------------------------------
  const recipeId = context.recipeId;

  // Get config
  const rawConfig = context.recipeConfig;
  if (!rawConfig) {
    throw new Error("generate-panorama requires recipe config");
  }
  const recipeConfig = parseGeneratePanoramaConfig(rawConfig);
  log(
    "debug",
    "Recipe configuration:",
    JSON.stringify(recipeConfig, null, 2),
    "\n"
  );

  // -----------------------------------------------------------------------------
  log('info', 'Local state and file index');
  // -----------------------------------------------------------------------------
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    index: recipeConfig.fileIndex,
  } satisfies LocalState);
  const state =
    (await context.services.json.readRecipeState(recipeId)) ?? initial;
  let currentFileIndex =
    (typeof state.index === "number" ? state.index : 0) + 1;

  // -----------------------------------------------------------------------------
  log('info', 'Generate image file prefixes');
  // -----------------------------------------------------------------------------
  // Image folders and files
  const generateImageFolder = `${context.repoRootFolder}/${recipeConfig.generatedImagePath}`;
  log("debug", `generateImageFolder: "${generateImageFolder}"`);

  const getPrefix = (index: number, suffix: string) =>
    `${recipeConfig.filePrefix}-${padZeroes(index)}-${suffix}`;

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
    compPreviewImage: getPrefix(currentFileIndex++, "composition-preview"),
    bridgeImageTile2: getPrefix(currentFileIndex++, "bridge-tile-2"),
    bridgeImageTile4: getPrefix(currentFileIndex++, "bridge-tile-4"),
    bridgeImageTile6: getPrefix(currentFileIndex++, "bridge-tile-6"),
    bridgeImageTile8: getPrefix(currentFileIndex++, "bridge-tile-8"),
  };
  log(
    "debug",
    `generateImageFilePrefixes: ${JSON.stringify(
      generateImageFilePrefixes,
      null,
      2
    )}`
  );

  const generatedImagesFullPaths = Object.fromEntries(
    Object.entries(generateImageFilePrefixes).map(([key, value]) => [
      key,
      `${generateImageFolder}/${value}.${recipeConfig.image.outputFormat}`,
    ])
  );
  log(
    "debug",
    `generatedImagesFullPaths: ${JSON.stringify(
      generatedImagesFullPaths,
      null,
      2
    )}`
  );

  // -----------------------------------------------------------------------------
  log('info', 'Composition map reference images');
  // -----------------------------------------------------------------------------
  const r1CompRefImagesFolder = `${context.repoRootFolder}/${recipeConfig.compositionMapsR1Folder}`;
  log("debug", `r1CompRefImagesFolder: "${r1CompRefImagesFolder}"`);

  const r1CompRefImagesFullPaths = Object.fromEntries(
    Object.entries(recipeConfig.compositionMapsR1).map(([key, value]) => [
      key,
      `${r1CompRefImagesFolder}/${value}`,
    ])
  );
  log(
    "debug",
    `r1CompRefImagesFullPaths: ${JSON.stringify(
      r1CompRefImagesFullPaths,
      null,
      2
    )}`
  );

  // -----------------------------------------------------------------------------
  log('info', 'Markdown files');
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
  log(
    "debug",
    `promptFilesFullPath: "${JSON.stringify(promptFilesFullPath, null, 2)}"`
  );

  const previewTableFullPath = `${context.repoRootFolder}/${recipeConfig.previewMarkDownFile}`;
  const frameworkHomeDocFileFullPath = `${context.repoRootFolder}/${recipeConfig.frameworkHomeMarkDownFile}`;

  // -----------------------------------------------------------------------------
  log('info', 'Step defaults');
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
  log('info', 'Step: Master');
  // -----------------------------------------------------------------------------

  const promptTextMasterBase = await context.services.markdown.read(
    promptFilesFullPath.masterBase
  );
  const promptTextMasterOnly = await context.services.markdown.read(
    promptFilesFullPath.masterOnly
  );
  const promptTextMaster = `${promptTextMasterBase}\n${promptTextMasterOnly}`;
  log("trace", `promptTextMaster: "${promptTextMaster}"`);

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
  log("trace", `stepMaster: "${JSON.stringify(stepMaster, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 5');
  // -----------------------------------------------------------------------------

  const promptTextTile5 = await context.services.markdown.read(
    promptFilesFullPath.tile5
  );
  log("trace", `promptTextTile5: "${promptTextTile5}"`);

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
  log("trace", `stepTile5: "${JSON.stringify(stepTile5, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 1');
  // -----------------------------------------------------------------------------

  const promptTextTile1 = await context.services.markdown.read(
    promptFilesFullPath.tile1
  );
  log("trace", `promptTextTile1: "${promptTextTile1}"`);

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
  log("trace", `stepTile1: "${JSON.stringify(stepTile1, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 9');
  // -----------------------------------------------------------------------------

  const promptTextTile9 = await context.services.markdown.read(
    promptFilesFullPath.tile9
  );
  log("trace", `promptTextTile9: "${promptTextTile9}"`);

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
  log("trace", `stepTile9: "${JSON.stringify(stepTile9, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 3');
  // -----------------------------------------------------------------------------

  const promptTextTile3 = await context.services.markdown.read(
    promptFilesFullPath.tile3
  );
  log("trace", `promptTextTile3: "${promptTextTile3}"`);

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
  log("trace", `stepTile3: "${JSON.stringify(stepTile3, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 7');
  // -----------------------------------------------------------------------------

  const promptTextTile7 = await context.services.markdown.read(
    promptFilesFullPath.tile7
  );
  log("trace", `promptTextTile7: "${promptTextTile7}"`);

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
  log("trace", `stepTile7: "${JSON.stringify(stepTile7, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Bridge 2');
  // -----------------------------------------------------------------------------
  const stepBridgeTile2: Step = {
    title: "Bridge image for tile 2",
    taskId: "image.create-bridge",
    arguments: {
      leftImageFile: generatedImagesFullPaths.tile1Image,
      rightImageFile: generatedImagesFullPaths.tile3Image,
      outputImageFile: generatedImagesFullPaths.bridgeImageTile2,
      leftCropWidth: recipeConfig.image.leftCropWidth,
      rightCropWidth: recipeConfig.image.rightCropWidth,
    },
  };
  log("debug", `stepBridgeTile2: "${JSON.stringify(stepBridgeTile2, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Bridge 4');
  // -----------------------------------------------------------------------------
  const stepBridgeTile4: Step = {
    title: "Bridge image for tile 4",
    taskId: "image.create-bridge",
    arguments: {
      leftImageFile: generatedImagesFullPaths.tile3Image,
      rightImageFile: generatedImagesFullPaths.tile5Image,
      outputImageFile: generatedImagesFullPaths.bridgeImageTile4,
      leftCropWidth: recipeConfig.image.leftCropWidth,
      rightCropWidth: recipeConfig.image.rightCropWidth,
    },
  };
  log("debug", `stepBridgeTile4: "${JSON.stringify(stepBridgeTile4, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Bridge 6');
  // -----------------------------------------------------------------------------
  const stepBridgeTile6: Step = {
    title: "Bridge image for tile 6",
    taskId: "image.create-bridge",
    arguments: {
      leftImageFile: generatedImagesFullPaths.tile5Image,
      rightImageFile: generatedImagesFullPaths.tile7Image,
      outputImageFile: generatedImagesFullPaths.bridgeImageTile6,
      leftCropWidth: recipeConfig.image.leftCropWidth,
      rightCropWidth: recipeConfig.image.rightCropWidth,
    },
  };
  log("debug", `stepBridgeTile6: "${JSON.stringify(stepBridgeTile6, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Bridge 8');
  // -----------------------------------------------------------------------------
  const stepBridgeTile8: Step = {
    title: "Bridge image for tile 8",
    taskId: "image.create-bridge",
    arguments: {
      leftImageFile: generatedImagesFullPaths.tile7Image,
      rightImageFile: generatedImagesFullPaths.tile9Image,
      outputImageFile: generatedImagesFullPaths.bridgeImageTile8,
      leftCropWidth: recipeConfig.image.leftCropWidth,
      rightCropWidth: recipeConfig.image.rightCropWidth,
    },
  };
  log("debug", `stepBridgeTile8: "${JSON.stringify(stepBridgeTile8, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 2');
  // -----------------------------------------------------------------------------

  const promptTextTile2 = await context.services.markdown.read(
    promptFilesFullPath.tile2
  );
  log("trace", `promptTextTile2: "${promptTextTile2}"`);

  // Upload filenames replacements
  const promptTile2CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile2 + "`";
  const promptTile2MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile2RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile2BridgeLabel = generateImageFilePrefixes.bridgeImageTile2 + "." + recipeConfig.image.outputFormat;
  const promptTile2TextReplaced = promptTextTile2
    .replace("`r1-composition-map.png`", promptTile2CompMapR1Label)
    .replace("`master.png`", promptTile2MasterLabel)
    .replace("`ruler.png`", promptTile2RulerLabel)
    .replace("`bridge.png`", promptTile2BridgeLabel);

  // Step definition
  const stepTile2: Step = {
    title: "Generate tile 2 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile2TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile2Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile2,
        generatedImagesFullPaths.tile5Image,
        generatedImagesFullPaths.bridgeImageTile2,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  log("trace", `stepTile2: "${JSON.stringify(stepTile2, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 4');
  // -----------------------------------------------------------------------------
  const promptTextTile4 = await context.services.markdown.read(
    promptFilesFullPath.tile4
  );
  log("trace", `promptTextTile4: "${promptTextTile4}"`);


  // Upload filenames replacements
  const promptTile4CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile4 + "`";
  const promptTile4MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile4RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile4BridgeLabel = generateImageFilePrefixes.bridgeImageTile4 + "." + recipeConfig.image.outputFormat;
  const promptTile4TextReplaced = promptTextTile4
    .replace("`r1-composition-map.png`", promptTile4CompMapR1Label)
    .replace("`master.png`", promptTile4MasterLabel)
    .replace("`ruler.png`", promptTile4RulerLabel)
    .replace("`bridge.png`", promptTile4BridgeLabel);

  // Step definition
  const stepTile4: Step = {
    title: "Generate tile 4 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile4TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile4Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile4,
        generatedImagesFullPaths.tile5Image,
        generatedImagesFullPaths.bridgeImageTile4,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  log("trace", `stepTile4: "${JSON.stringify(stepTile4, null, 2)}"`);
  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 6');
  // -----------------------------------------------------------------------------
  const promptTextTile6 = await context.services.markdown.read(
    promptFilesFullPath.tile6
  );
  log("trace", `promptTextTile6: "${promptTextTile6}"`);

  // Upload filenames replacements
  const promptTile6CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile6 + "`";
  const promptTile6MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile6RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile6BridgeLabel = generateImageFilePrefixes.bridgeImageTile6 + "." + recipeConfig.image.outputFormat;
  const promptTile6TextReplaced = promptTextTile6
    .replace("`r1-composition-map.png`", promptTile6CompMapR1Label)
    .replace("`master.png`", promptTile6MasterLabel)
    .replace("`ruler.png`", promptTile6RulerLabel)
    .replace("`bridge.png`", promptTile6BridgeLabel);

  // Step definition
  const stepTile6: Step = {
    title: "Generate tile 6 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile6TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile6Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile6,
        generatedImagesFullPaths.tile5Image,
        generatedImagesFullPaths.bridgeImageTile6,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  log("trace", `stepTile6: "${JSON.stringify(stepTile6, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Tile 8');
  // -----------------------------------------------------------------------------
  const promptTextTile8 = await context.services.markdown.read(
    promptFilesFullPath.tile8
  );
  log("trace", `promptTextTile8: "${promptTextTile8}"`);


  // Upload filenames replacements
  const promptTile8CompMapR1Label =
    "`" + recipeConfig.compositionMapsR1.tile8 + "`";
  const promptTile8MasterLabel =
    "`" +
    generateImageFilePrefixes.masterImage +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile8RulerLabel =
    "`" +
    generateImageFilePrefixes.tile5Image +
    "." +
    recipeConfig.image.outputFormat +
    "`";
  const promptTile8BridgeLabel = generateImageFilePrefixes.bridgeImageTile8 + "." + recipeConfig.image.outputFormat;
  const promptTile8TextReplaced = promptTextTile8
    .replace("`r1-composition-map.png`", promptTile8CompMapR1Label)
    .replace("`master.png`", promptTile8MasterLabel)
    .replace("`ruler.png`", promptTile8RulerLabel)
    .replace("`bridge.png`", promptTile8BridgeLabel);

  // Step definition
  const stepTile8: Step = {
    title: "Generate tile 8 image",
    taskId: "openai.generate-image",
    arguments: {
      prompt: promptTile8TextReplaced,
      outputFilePrefix: generateImageFilePrefixes.tile8Image,
      inputImages: [
        r1CompRefImagesFullPaths.tile8,
        generatedImagesFullPaths.tile5Image,
        generatedImagesFullPaths.bridgeImageTile8,
      ],
      size: recipeConfig.image.tileSize,
      ...stepDefaults,
    },
  };
  log("trace", `stepTile8: "${JSON.stringify(stepTile8, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Composition preview');
  // -----------------------------------------------------------------------------

  const stepCompPreviewGenerate: Step = {
    title: "Composition preview image generation",
    taskId: "image.compose-tiles",
    arguments: {
      inputImages: [
        generatedImagesFullPaths.tile1Image,
        generatedImagesFullPaths.tile2Image,
        generatedImagesFullPaths.tile3Image,
        generatedImagesFullPaths.tile4Image,
        generatedImagesFullPaths.tile5Image,
        generatedImagesFullPaths.tile6Image,
        generatedImagesFullPaths.tile7Image,
        generatedImagesFullPaths.tile8Image,
        generatedImagesFullPaths.tile9Image,
      ],
      outputImageFile: generatedImagesFullPaths.compPreviewImage,
    },
  };
  log("trace", `stepCompPreviewGenerate: "${JSON.stringify(stepCompPreviewGenerate, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Preview compositions table');
  // -----------------------------------------------------------------------------

  const markdownContentCompositionsRow = [
    `|![Composition preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.compPreviewImage}.${recipeConfig.image.outputFormat})|`
  ].join('');

  const markdownContentCompositionsLabelRow = [
    `|${generateImageFilePrefixes.compPreviewImage}.${recipeConfig.image.outputFormat}|`
  ].join('');

  const stepPreviewCompositionsTable: Step = {
    title: "Insert preview compositions table row",
    taskId: "markdown.insert",
    arguments: {
      file: previewTableFullPath,
      marker: recipeConfig.previewCompositionMarker,
      content: [markdownContentCompositionsRow, markdownContentCompositionsLabelRow].join('\n'),
      position: "after",
    },
  };
  log("trace", `stepPreviewCompositionsTable: "${JSON.stringify(stepPreviewCompositionsTable, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Preview tiles table');
  // -----------------------------------------------------------------------------

  const markdownContentTilesRow = [
    `|![Tile 1 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile1Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 2 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile2Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 3 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile3Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 4 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile4Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 5 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile5Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 6 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile6Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 7 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile7Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 8 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile8Image}.${recipeConfig.image.outputFormat})`,
    `|![Tile 9 preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.tile9Image}.${recipeConfig.image.outputFormat})`,
    `|`
  ].join('');

  const markdownRowImageLabels = [
    `|${generateImageFilePrefixes.tile1Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile2Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile3Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile4Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile5Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile6Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile7Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile8Image}.${recipeConfig.image.outputFormat}`,
    `|${generateImageFilePrefixes.tile9Image}.${recipeConfig.image.outputFormat}`,
    `|`
  ].join('');

  const stepPreviewTilesTable: Step = {
    title: "Insert preview table row",
    taskId: "markdown.insert",
    arguments: {
      file: previewTableFullPath,
      marker: recipeConfig.previewTilesTableMarker,
      content: [markdownContentTilesRow, markdownRowImageLabels].join('\n'),
      position: "after",
    },
  };
  log("trace", `stepPreviewTilesTable: "${JSON.stringify(stepPreviewTilesTable, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Step: Composition in framework home');
  // -----------------------------------------------------------------------------

  const stepCompPreviewInsertContent: Step = {
    title: "Insert in between",
    taskId: "markdown.insert",
    arguments: {
      file: frameworkHomeDocFileFullPath,
      marker: recipeConfig.frameworkHomeCompositionMarkers,
      content: `![Composition preview](../${recipeConfig.generatedImagePath}/${generateImageFilePrefixes.compPreviewImage}.${recipeConfig.image.outputFormat})`,
      position: "between",
    },
  };
  log("trace", `stepCompPreviewInsertContent: "${JSON.stringify(stepCompPreviewInsertContent, null, 2)}"`);

  // -----------------------------------------------------------------------------
  log('info', 'Finish');
  // -----------------------------------------------------------------------------
  // Save state
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    index: currentFileIndex,
  });

  // Return steps
  return {
    title: "Generate Panorama",
    steps: [
      stepMaster,
      stepTile5,
      stepTile1,
      stepTile9,
      stepTile3,
      stepTile7,
      stepBridgeTile2,
      stepBridgeTile4,
      stepBridgeTile6,
      stepBridgeTile8,
      stepTile2,
      stepTile4,
      stepTile6,
      stepTile8,
      stepCompPreviewGenerate,
      stepPreviewCompositionsTable,
      stepPreviewTilesTable,
      stepCompPreviewInsertContent,
    ],
  };
}
// =============================================================================
