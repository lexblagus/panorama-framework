import type { BuildRecipeContext } from "../../src/types/builder.ts";
import type { Recipe } from "../../src/types/recipe.ts";
import type { Step } from "../../src/types/step.ts";
import Log from "../../src/utils/log.ts";
import { parseGeneratePanoramaConfig } from "./config.schema.ts";

// -----------------------------------------------------------------------------
// Local types
// -----------------------------------------------------------------------------

type LocalState = { index: number };

type TileKey =
  | "tile1Image" | "tile2Image" | "tile3Image"
  | "tile4Image" | "tile5Image" | "tile6Image"
  | "tile7Image" | "tile8Image" | "tile9Image";

type BridgeKey =
  | "bridgeImageTile2" | "bridgeImageTile4"
  | "bridgeImageTile6" | "bridgeImageTile8";

type PromptKey =
  | "tile1" | "tile2" | "tile3" | "tile4" | "tile5"
  | "tile6" | "tile7" | "tile8" | "tile9";

type CompMapKey = PromptKey;

interface TileStepSpec {
  tileKey: TileKey;
  promptKey: PromptKey;
  compMapKey: CompMapKey;
  rulerFrom: "tile5" | null;
  bridgeKey: BridgeKey | null;
}

// Tile configuration — execution order is set in the steps array at the bottom
const PRIMARY_SECONDARY_TILE_SPECS: TileStepSpec[] = [
  { tileKey: "tile5Image", promptKey: "tile5", compMapKey: "tile5", rulerFrom: null,    bridgeKey: null },
  { tileKey: "tile1Image", promptKey: "tile1", compMapKey: "tile1", rulerFrom: "tile5", bridgeKey: null },
  { tileKey: "tile9Image", promptKey: "tile9", compMapKey: "tile9", rulerFrom: "tile5", bridgeKey: null },
  { tileKey: "tile3Image", promptKey: "tile3", compMapKey: "tile3", rulerFrom: "tile5", bridgeKey: null },
  { tileKey: "tile7Image", promptKey: "tile7", compMapKey: "tile7", rulerFrom: "tile5", bridgeKey: null },
];

const TERTIARY_TILE_SPECS: TileStepSpec[] = [
  { tileKey: "tile2Image", promptKey: "tile2", compMapKey: "tile2", rulerFrom: "tile5", bridgeKey: "bridgeImageTile2" },
  { tileKey: "tile4Image", promptKey: "tile4", compMapKey: "tile4", rulerFrom: "tile5", bridgeKey: "bridgeImageTile4" },
  { tileKey: "tile6Image", promptKey: "tile6", compMapKey: "tile6", rulerFrom: "tile5", bridgeKey: "bridgeImageTile6" },
  { tileKey: "tile8Image", promptKey: "tile8", compMapKey: "tile8", rulerFrom: "tile5", bridgeKey: "bridgeImageTile8" },
];

const BRIDGE_COMPOSITIONS: Array<{ key: BridgeKey; leftTile: TileKey; rightTile: TileKey }> = [
  { key: "bridgeImageTile2", leftTile: "tile1Image", rightTile: "tile3Image" },
  { key: "bridgeImageTile4", leftTile: "tile3Image", rightTile: "tile5Image" },
  { key: "bridgeImageTile6", leftTile: "tile5Image", rightTile: "tile7Image" },
  { key: "bridgeImageTile8", leftTile: "tile7Image", rightTile: "tile9Image" },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function padZeroes(value: number, padLength: number = 4): string {
  return String(Math.trunc(value)).padStart(padLength, "0");
}

// =============================================================================
export async function buildRecipe(context: BuildRecipeContext): Promise<Recipe> {
  const log = new Log("recipe", "magenta");

  // ---------------------------------------------------------------------------
  log("info", "Context and configuration");
  // ---------------------------------------------------------------------------
  const recipeId = context.recipeId;

  const rawConfig = context.recipeConfig;
  if (!rawConfig) {
    throw new Error("generate-panorama requires recipe config");
  }
  const recipeConfig = parseGeneratePanoramaConfig(rawConfig);
  log("debug", "Recipe configuration:", JSON.stringify(recipeConfig, null, 2), "\n");

  // ---------------------------------------------------------------------------
  log("info", "Local state and file index");
  // ---------------------------------------------------------------------------
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    index: recipeConfig.fileIndex,
  } satisfies LocalState);
  const state = (await context.services.json.readRecipeState(recipeId)) ?? initial;
  let currentFileIndex = (typeof state.index === "number" ? state.index : 0) + 1;

  // ---------------------------------------------------------------------------
  log("info", "Generate image folder and format");
  // ---------------------------------------------------------------------------
  const generateImageFolder = `${context.repoRootFolder}/${recipeConfig.generatedImagePath}`;
  const ext = recipeConfig.image.outputFormat;
  const toFullPath = (prefix: string) => `${generateImageFolder}/${prefix}.${ext}`;

  log("debug", `generateImageFolder: "${generateImageFolder}"`);

  // ---------------------------------------------------------------------------
  log("info", "Composition map reference images");
  // ---------------------------------------------------------------------------
  const r1Folder = `${context.repoRootFolder}/${recipeConfig.compositionMapsR1Folder}`;
  const r1Paths = Object.fromEntries(
    Object.entries(recipeConfig.compositionMapsR1).map(([k, v]) => [k, `${r1Folder}/${v}`])
  ) as Record<CompMapKey, string>;
  log("debug", `r1Paths: ${JSON.stringify(r1Paths, null, 2)}`);

  // ---------------------------------------------------------------------------
  log("info", "Markdown prompt files");
  // ---------------------------------------------------------------------------
  const promptRoot = `${context.repoRootFolder}/${recipeConfig.promptFolder}`;
  const promptPaths = Object.fromEntries(
    Object.entries(recipeConfig.promptFiles).map(([k, v]) => [k, `${promptRoot}/${v}`])
  ) as Record<keyof typeof recipeConfig.promptFiles, string>;

  const previewTableFullPath = `${context.repoRootFolder}/${recipeConfig.previewMarkDownFile}`;
  const frameworkHomeFullPath = `${context.repoRootFolder}/${recipeConfig.frameworkHomeMarkDownFile}`;

  // ---------------------------------------------------------------------------
  log("info", "Step defaults");
  // ---------------------------------------------------------------------------
  const stepDefaults = {
    outputDir: generateImageFolder,
    model: recipeConfig.image.model,
    n: 1,
    quality: recipeConfig.image.quality,
    outputFormat: ext,
    outputCompression: recipeConfig.image.outputCompression,
    saveSidecarMetadataFile: false,
  };

  // ---------------------------------------------------------------------------
  log("info", "Loading prompt files");
  // ---------------------------------------------------------------------------
  const promptTextMasterBase = await context.services.markdown.read(promptPaths.masterBase);
  const promptTextMasterOnly = await context.services.markdown.read(promptPaths.masterOnly);

  const promptTexts = Object.fromEntries(
    await Promise.all(
      (["tile1","tile2","tile3","tile4","tile5","tile6","tile7","tile8","tile9"] as PromptKey[])
        .map(async (key) => [key, await context.services.markdown.read(promptPaths[key])] as const)
    )
  ) as Record<PromptKey, string>;

  // ---------------------------------------------------------------------------
  log("info", "Building steps for all master samples");
  // ---------------------------------------------------------------------------
  const allSteps: Step[] = [];

  for (let sampleIdx = 1; sampleIdx <= recipeConfig.masterSamples; sampleIdx++) {
    const isLastSample = sampleIdx === recipeConfig.masterSamples;
    const paddedSample = padZeroes(sampleIdx, recipeConfig.samplePaddingZeroes);

    log("info", `  Sample ${sampleIdx}/${recipeConfig.masterSamples}`);

    // ── File index allocation ────────────────────────────────────────────────
    const alloc = (tileName: string) => {
      const idx = currentFileIndex++;
      const basePrefix = `${recipeConfig.filePrefix}-${padZeroes(idx, recipeConfig.fileIndexPaddingZeroes)}`;
      const canonicalPrefix = `${basePrefix}-${paddedSample}-${tileName}`;
      return { basePrefix, canonicalPrefix, outputSuffixes: [`-${paddedSample}-${tileName}`] };
    };

    // Allocation order matches the desired file index sequence
    const entries = {
      masterImage:      alloc("master"),
      tile1Image:       alloc("tile1"),
      tile2Image:       alloc("tile2"),
      tile3Image:       alloc("tile3"),
      tile4Image:       alloc("tile4"),
      tile5Image:       alloc("tile5"),
      tile6Image:       alloc("tile6"),
      tile7Image:       alloc("tile7"),
      tile8Image:       alloc("tile8"),
      tile9Image:       alloc("tile9"),
      compPreviewImage: alloc("composition-preview"),
      bridgeImageTile2: alloc("bridge-tile-2"),
      bridgeImageTile4: alloc("bridge-tile-4"),
      bridgeImageTile6: alloc("bridge-tile-6"),
      bridgeImageTile8: alloc("bridge-tile-8"),
    };

    const filePrefixes = Object.fromEntries(
      Object.entries(entries).map(([k, v]) => [k, v.canonicalPrefix])
    ) as Record<keyof typeof entries, string>;

    const fullPaths = Object.fromEntries(
      Object.entries(filePrefixes).map(([k, v]) => [k, toFullPath(v)])
    ) as Record<keyof typeof entries, string>;

    log("debug", `filePrefixes[${sampleIdx}]: ${JSON.stringify(filePrefixes, null, 2)}`);

    // ── Step: Master ─────────────────────────────────────────────────────────
    const stepMaster: Step = {
      title: `Generate master image (sample ${sampleIdx})`,
      taskId: "openai.generate-image",
      arguments: {
        prompt: `${promptTextMasterBase}\n${promptTextMasterOnly}`,
        outputFilePrefix: entries.masterImage.basePrefix,
        outputSuffixes: entries.masterImage.outputSuffixes,
        size: recipeConfig.image.masterSize,
        ...stepDefaults,
      },
    };

    // ── Tile step builder ─────────────────────────────────────────────────────
    const buildTileStep = (spec: TileStepSpec): Step => {
      const compMapFilename = recipeConfig.compositionMapsR1[spec.compMapKey];

      const rulerReplacement = spec.rulerFrom
        ? "`" + filePrefixes.tile5Image + "." + ext + "`"
        : "(not uploaded)";

      const bridgeReplacement = spec.bridgeKey
        ? filePrefixes[spec.bridgeKey] + "." + ext
        : "(not uploaded)";

      const promptReplaced = promptTexts[spec.promptKey]
        .replace("`r1-composition-map.png`", "`" + compMapFilename + "`")
        .replace("`master.png`", "`" + filePrefixes.masterImage + "." + ext + "`")
        .replace("`ruler.png`", rulerReplacement)
        .replace("`bridge.png`", bridgeReplacement);

      const referenceImage = spec.rulerFrom ? fullPaths.tile5Image : fullPaths.masterImage;
      const inputImages: string[] = [r1Paths[spec.compMapKey], referenceImage];
      if (spec.bridgeKey) {
        inputImages.push(fullPaths[spec.bridgeKey]);
      }

      return {
        title: `Generate ${spec.tileKey.replace("Image", "")} image (sample ${sampleIdx})`,
        taskId: "openai.generate-image",
        arguments: {
          prompt: promptReplaced,
          outputFilePrefix: entries[spec.tileKey].basePrefix,
          outputSuffixes: entries[spec.tileKey].outputSuffixes,
          inputImages,
          size: recipeConfig.image.tileSize,
          ...stepDefaults,
        },
      };
    };

    // ── Bridge step builder ───────────────────────────────────────────────────
    const buildBridgeStep = (config: { key: BridgeKey; leftTile: TileKey; rightTile: TileKey }): Step => {
      const tileNum = config.key.replace("bridgeImageTile", "");
      return {
        title: `Bridge image for tile ${tileNum} (sample ${sampleIdx})`,
        taskId: "image.create-bridge",
        arguments: {
          leftImageFile: fullPaths[config.leftTile],
          rightImageFile: fullPaths[config.rightTile],
          outputImageFile: fullPaths[config.key],
          leftCropWidth: recipeConfig.image.leftCropWidth,
          rightCropWidth: recipeConfig.image.rightCropWidth,
        },
      };
    };

    const tileSteps = new Map<TileKey, Step>();
    for (const spec of [...PRIMARY_SECONDARY_TILE_SPECS, ...TERTIARY_TILE_SPECS]) {
      tileSteps.set(spec.tileKey, buildTileStep(spec));
    }

    const bridgeSteps = new Map<BridgeKey, Step>();
    for (const bc of BRIDGE_COMPOSITIONS) {
      bridgeSteps.set(bc.key, buildBridgeStep(bc));
    }

    // ── Composition preview and markdown steps ────────────────────────────────
    const tileOrder: TileKey[] = [
      "tile1Image","tile2Image","tile3Image","tile4Image","tile5Image",
      "tile6Image","tile7Image","tile8Image","tile9Image",
    ];

    const stepCompPreviewGenerate: Step = {
      title: `Composition preview image generation (sample ${sampleIdx})`,
      taskId: "image.compose-tiles",
      arguments: {
        inputImages: tileOrder.map((k) => fullPaths[k]),
        outputImageFile: fullPaths.compPreviewImage,
      },
    };

    const markdownCompositionRow =
      `|![Composition preview](../${recipeConfig.generatedImagePath}/${filePrefixes.compPreviewImage}.${ext})|`;
    const markdownCompositionLabelRow =
      `|${filePrefixes.compPreviewImage}.${ext}|`;

    const stepPreviewCompositionsTable: Step = {
      title: `Insert preview compositions table row (sample ${sampleIdx})`,
      taskId: "markdown.insert",
      arguments: {
        file: previewTableFullPath,
        marker: recipeConfig.previewCompositionMarker,
        content: [markdownCompositionRow, markdownCompositionLabelRow].join("\n"),
        position: "after",
      },
    };

    const markdownTilesRow = tileOrder
      .map((k, i) => `|![Tile ${i + 1} preview](../${recipeConfig.generatedImagePath}/${filePrefixes[k]}.${ext})`)
      .join("") + "|";
    const markdownTileLabelsRow = tileOrder
      .map((k) => `|${filePrefixes[k]}.${ext}`)
      .join("") + "|";

    const stepPreviewTilesTable: Step = {
      title: `Insert preview table row (sample ${sampleIdx})`,
      taskId: "markdown.insert",
      arguments: {
        file: previewTableFullPath,
        marker: recipeConfig.previewTilesTableMarker,
        content: [markdownTilesRow, markdownTileLabelsRow].join("\n"),
        position: "after",
      },
    };

    const stepCompPreviewInsertContent: Step = {
      title: "Insert in between",
      taskId: "markdown.insert",
      arguments: {
        file: frameworkHomeFullPath,
        marker: recipeConfig.frameworkHomeCompositionMarkers as [string, string],
        content: `![Composition preview](../${recipeConfig.generatedImagePath}/${filePrefixes.compPreviewImage}.${ext})`,
        position: "between",
      },
    };

    allSteps.push(
      stepMaster,
      tileSteps.get("tile5Image")!,
      tileSteps.get("tile1Image")!,
      tileSteps.get("tile9Image")!,
      tileSteps.get("tile3Image")!,
      tileSteps.get("tile7Image")!,
      bridgeSteps.get("bridgeImageTile2")!,
      bridgeSteps.get("bridgeImageTile4")!,
      bridgeSteps.get("bridgeImageTile6")!,
      bridgeSteps.get("bridgeImageTile8")!,
      tileSteps.get("tile2Image")!,
      tileSteps.get("tile4Image")!,
      tileSteps.get("tile6Image")!,
      tileSteps.get("tile8Image")!,
      stepCompPreviewGenerate,
      stepPreviewCompositionsTable,
      stepPreviewTilesTable,
    );

    if (isLastSample) {
      allSteps.push(stepCompPreviewInsertContent);
    }
  }

  // ---------------------------------------------------------------------------
  log("info", "Finish");
  // ---------------------------------------------------------------------------
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    index: currentFileIndex,
  });

  return {
    title: "Generate Panorama",
    steps: allSteps,
  };
}
// =============================================================================
