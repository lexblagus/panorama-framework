import type { BuildRecipeContext } from "../../src/types/builder.ts";
import type { Recipe } from "../../src/types/recipe.ts";
import type { Step } from "../../src/types/step.ts";
import Log from "../../src/utils/log.ts";
import { parseGeneratePanoramaConfig } from "./config.schema.ts";

// -----------------------------------------------------------------------------
// Local types
// -----------------------------------------------------------------------------

type LocalState = { index: number };

type TileNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Layout01Key = `layout01Tile${TileNum}`;
type Layout02Key = `layout02Tile${TileNum}`;
type Overlay01Key = `overlay01Tile${TileNum}`;

type BridgeKey =
  | "bridgeImageTile2" | "bridgeImageTile4"
  | "bridgeImageTile6" | "bridgeImageTile8";

type PromptKey =
  | "tile1" | "tile2" | "tile3" | "tile4" | "tile5"
  | "tile6" | "tile7" | "tile8" | "tile9";

type CompMapKey = PromptKey;

interface TileStepSpec {
  layout01Key: Layout01Key;
  layout02Key: Layout02Key;
  promptKey: PromptKey;
  compMapKey: CompMapKey;
  rulerFrom: Layout01Key | Layout02Key | null;
  bridgeKey: BridgeKey | null;
}

interface AllocEntry {
  basePrefix: string;
  canonicalPrefix: string;
  outputSuffixes: string[];
}

// Tile configuration — execution order is set in the steps array at the bottom
const PRIMARY_SECONDARY_TILE_SPECS: TileStepSpec[] = [
  { layout01Key: "layout01Tile5", layout02Key: "layout02Tile5", promptKey: "tile5", compMapKey: "tile5", rulerFrom: null, bridgeKey: null },
  { layout01Key: "layout01Tile1", layout02Key: "layout02Tile1", promptKey: "tile1", compMapKey: "tile1", rulerFrom: "layout01Tile5", bridgeKey: null },
  { layout01Key: "layout01Tile9", layout02Key: "layout02Tile9", promptKey: "tile9", compMapKey: "tile9", rulerFrom: "layout01Tile5", bridgeKey: null },
  { layout01Key: "layout01Tile3", layout02Key: "layout02Tile3", promptKey: "tile3", compMapKey: "tile3", rulerFrom: "layout01Tile5", bridgeKey: null },
  { layout01Key: "layout01Tile7", layout02Key: "layout02Tile7", promptKey: "tile7", compMapKey: "tile7", rulerFrom: "layout01Tile5", bridgeKey: null },
];

const TERTIARY_TILE_SPECS: TileStepSpec[] = [
  { layout01Key: "layout01Tile2", layout02Key: "layout02Tile2", promptKey: "tile2", compMapKey: "tile2", rulerFrom: "layout01Tile5", bridgeKey: "bridgeImageTile2" },
  { layout01Key: "layout01Tile4", layout02Key: "layout02Tile4", promptKey: "tile4", compMapKey: "tile4", rulerFrom: "layout01Tile5", bridgeKey: "bridgeImageTile4" },
  { layout01Key: "layout01Tile6", layout02Key: "layout02Tile6", promptKey: "tile6", compMapKey: "tile6", rulerFrom: "layout01Tile5", bridgeKey: "bridgeImageTile6" },
  { layout01Key: "layout01Tile8", layout02Key: "layout02Tile8", promptKey: "tile8", compMapKey: "tile8", rulerFrom: "layout01Tile5", bridgeKey: "bridgeImageTile8" },
];

const LAYOUT02_TERTIARY_RULER: Layout02Key = "layout02Tile5";

const BRIDGE_COMPOSITIONS: Array<{ key: BridgeKey; leftTile: Layout01Key; rightTile: Layout01Key }> = [
  { key: "bridgeImageTile2", leftTile: "layout01Tile1", rightTile: "layout01Tile3" },
  { key: "bridgeImageTile4", leftTile: "layout01Tile3", rightTile: "layout01Tile5" },
  { key: "bridgeImageTile6", leftTile: "layout01Tile5", rightTile: "layout01Tile7" },
  { key: "bridgeImageTile8", leftTile: "layout01Tile7", rightTile: "layout01Tile9" },
];

const TILE_NUMS: TileNum[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LAYOUT01_ORDER: Layout01Key[] = [
  "layout01Tile5", "layout01Tile1", "layout01Tile9", "layout01Tile3", "layout01Tile7",
  "layout01Tile2", "layout01Tile4", "layout01Tile6", "layout01Tile8",
];

const LAYOUT02_ORDER: Layout02Key[] = [
  "layout02Tile5", "layout02Tile1", "layout02Tile9", "layout02Tile3", "layout02Tile7",
  "layout02Tile2", "layout02Tile4", "layout02Tile6", "layout02Tile8",
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function padZeroes(value: number, padLength: number = 4): string {
  return String(Math.trunc(value)).padStart(padLength, "0");
}

function layout01Key(n: TileNum): Layout01Key {
  return `layout01Tile${n}`;
}

function layout02Key(n: TileNum): Layout02Key {
  return `layout02Tile${n}`;
}

function overlay01Key(n: TileNum): Overlay01Key {
  return `overlay01Tile${n}`;
}

function tileNumFromLayout01Key(key: Layout01Key): TileNum {
  return Number(key.replace("layout01Tile", "")) as TileNum;
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
  const calibrationEnabled = recipeConfig.layoutCalibrationPass.enabled;
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

  const layoutCalibrationPromptPath =
    `${promptRoot}/${recipeConfig.layoutCalibrationPass.promptFile}`;

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

  const calibrationStepEnabled = calibrationEnabled ? undefined : false;

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

  const promptTextLayoutCalibration = calibrationEnabled
    ? await context.services.markdown.read(layoutCalibrationPromptPath)
    : "";

  // ---------------------------------------------------------------------------
  log("info", "Building steps for all master samples");
  // ---------------------------------------------------------------------------
  const allSteps: Step[] = [];

  for (let sampleIdx = 1; sampleIdx <= recipeConfig.masterSamples; sampleIdx++) {
    const isLastSample = sampleIdx === recipeConfig.masterSamples;
    const paddedSample = `sample-${padZeroes(sampleIdx, recipeConfig.samplePaddingZeroes)}`;

    log("info", `  Sample ${sampleIdx}/${recipeConfig.masterSamples}`);

    // ── File index allocation ────────────────────────────────────────────────
    const alloc = (segment: string): AllocEntry => {
      const idx = currentFileIndex++;
      const basePrefix = `${recipeConfig.filePrefix}-${padZeroes(idx, recipeConfig.fileIndexPaddingZeroes)}`;
      const canonicalPrefix = `${basePrefix}-${paddedSample}-${segment}`;
      return { basePrefix, canonicalPrefix, outputSuffixes: [`-${paddedSample}-${segment}`] };
    };

    const entries: Record<string, AllocEntry> = {
      masterImage: alloc("master"),
    };

    for (const n of TILE_NUMS) {
      entries[layout01Key(n)] = alloc(`layout-01-tile${n}`);
    }
    for (const n of TILE_NUMS) {
      entries[overlay01Key(n)] = alloc(`overlay-01-tile${n}`);
    }

    entries.bridgeImageTile2 = alloc("bridge-tile-2");
    entries.bridgeImageTile4 = alloc("bridge-tile-4");
    entries.bridgeImageTile6 = alloc("bridge-tile-6");
    entries.bridgeImageTile8 = alloc("bridge-tile-8");

    for (const n of TILE_NUMS) {
      entries[layout02Key(n)] = alloc(`layout-02-tile${n}`);
    }

    entries.compPreviewImage = alloc("composition-preview");

    const filePrefixes = Object.fromEntries(
      Object.entries(entries).map(([k, v]) => [k, v.canonicalPrefix])
    ) as Record<string, string>;

    const fullPaths = Object.fromEntries(
      Object.entries(filePrefixes).map(([k, v]) => [k, toFullPath(v)])
    ) as Record<string, string>;

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

    // ── Layout-01 tile step builder ───────────────────────────────────────────
    const buildLayout01TileStep = (spec: TileStepSpec): Step => {
      const compMapFilename = recipeConfig.compositionMapsR1[spec.compMapKey];

      const rulerReplacement = spec.rulerFrom
        ? "`" + filePrefixes[spec.rulerFrom] + "." + ext + "`"
        : "(not uploaded)";

      // Layout-01 tertiary runs before bridges; seam bridge is not available yet.
      const bridgeReplacement = "(not uploaded)";

      const promptReplaced = promptTexts[spec.promptKey]
        .replace("`r1-composition-map.png`", "`" + compMapFilename + "`")
        .replace("`master.png`", "`" + filePrefixes.masterImage + "." + ext + "`")
        .replace("`ruler.png`", rulerReplacement)
        .replace("`bridge.png`", bridgeReplacement);

      const referenceImage = spec.rulerFrom ? fullPaths[spec.rulerFrom] : fullPaths.masterImage;
      const inputImages: string[] = [r1Paths[spec.compMapKey], referenceImage];

      const tileNum = tileNumFromLayout01Key(spec.layout01Key);

      return {
        title: `Generate layout-01 tile ${tileNum} (sample ${sampleIdx})`,
        taskId: "openai.generate-image",
        arguments: {
          prompt: promptReplaced,
          outputFilePrefix: entries[spec.layout01Key].basePrefix,
          outputSuffixes: entries[spec.layout01Key].outputSuffixes,
          inputImages,
          size: recipeConfig.image.tileSize,
          ...stepDefaults,
        },
      };
    };

    // ── Overlay step builder ──────────────────────────────────────────────────
    const buildOverlayStep = (n: TileNum): Step => ({
      title: `Overlay layout-01 + R1 tile ${n} (sample ${sampleIdx})`,
      taskId: "image.assemble-layers",
      enabled: calibrationStepEnabled,
      arguments: {
        inputs: [fullPaths[layout01Key(n)], r1Paths[`tile${n}` as PromptKey]],
        output: {
          imageFile: fullPaths[overlay01Key(n)],
          format: ext as "png" | "jpeg" | "webp",
        },
      },
    });

    // ── Layout-02 calibration step builder ──────────────────────────────────────
    const buildLayout02CalibrationStep = (spec: TileStepSpec): Step => {
      const compMapFilename = recipeConfig.compositionMapsR1[spec.compMapKey];
      const layout01Filename = filePrefixes[spec.layout01Key] + "." + ext;

      let promptReplaced = promptTextLayoutCalibration
        .replace("`tile.png`", "`" + layout01Filename + "`")
        .replace("`r1-composition-map.png`", "`" + compMapFilename + "`");

      if (spec.bridgeKey) {
        const rulerReplacement = "`" + filePrefixes[LAYOUT02_TERTIARY_RULER] + "." + ext + "`";
        const bridgeReplacement = filePrefixes[spec.bridgeKey] + "." + ext;
        promptReplaced = promptReplaced
          .replace("`ruler.png`", rulerReplacement)
          .replace("`bridge.png`", bridgeReplacement);
      }

      const tileNum = tileNumFromLayout01Key(spec.layout01Key);

      return {
        title: `Layout calibration tile ${tileNum} (sample ${sampleIdx})`,
        taskId: "openai.generate-image",
        enabled: calibrationStepEnabled,
        arguments: {
          prompt: promptReplaced,
          outputFilePrefix: entries[spec.layout02Key].basePrefix,
          outputSuffixes: entries[spec.layout02Key].outputSuffixes,
          inputImages: [fullPaths[overlay01Key(tileNum)]],
          size: recipeConfig.image.tileSize,
          ...stepDefaults,
        },
      };
    };

    // ── Bridge step builder ───────────────────────────────────────────────────
    const buildBridgeStep = (config: { key: BridgeKey; leftTile: Layout01Key; rightTile: Layout01Key }): Step => {
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

    const layout01Steps = new Map<Layout01Key, Step>();
    for (const spec of [...PRIMARY_SECONDARY_TILE_SPECS, ...TERTIARY_TILE_SPECS]) {
      layout01Steps.set(spec.layout01Key, buildLayout01TileStep(spec));
    }

    const overlaySteps = TILE_NUMS.map((n) => buildOverlayStep(n));

    const bridgeSteps = new Map<BridgeKey, Step>();
    for (const bc of BRIDGE_COMPOSITIONS) {
      bridgeSteps.set(bc.key, buildBridgeStep(bc));
    }

    const layout02Steps = new Map<Layout02Key, Step>();
    for (const spec of [...PRIMARY_SECONDARY_TILE_SPECS, ...TERTIARY_TILE_SPECS]) {
      layout02Steps.set(spec.layout02Key, buildLayout02CalibrationStep(spec));
    }

    // ── Composition preview and markdown steps ────────────────────────────────
    const previewTileKeys = calibrationEnabled ? LAYOUT02_ORDER : LAYOUT01_ORDER;

    const stepCompPreviewGenerate: Step = {
      title: `Composition preview image generation (sample ${sampleIdx})`,
      taskId: "image.compose-tiles",
      arguments: {
        inputImages: previewTileKeys.map((k) => fullPaths[k]),
        outputImageFile: fullPaths.compPreviewImage,
      },
    };

    const buildTilesTableInsert = (
      tileKeys: string[],
      rowLabel: string,
    ): Step => {
      const markdownTilesRow = tileKeys
        .map((k, i) => `|![Tile ${i + 1} preview](../${recipeConfig.generatedImagePath}/${filePrefixes[k]}.${ext})`)
        .join("") + "|";
      const markdownTileLabelsRow = tileKeys
        .map((k) => `|${filePrefixes[k]}.${ext}`)
        .join("") + "|";

      return {
        title: `Insert preview tiles table row ${rowLabel} (sample ${sampleIdx})`,
        taskId: "markdown.insert",
        arguments: {
          file: previewTableFullPath,
          marker: recipeConfig.previewTilesTableMarker,
          content: [markdownTilesRow, markdownTileLabelsRow].join("\n"),
          position: "after",
        },
      };
    };

    const previewInsertSteps: Step[] = [];

    if (recipeConfig.addToPreviewTableRowPre) {
      previewInsertSteps.push(
        buildTilesTableInsert(LAYOUT01_ORDER, "layout-01"),
      );
    }
    if (calibrationEnabled && recipeConfig.addToPreviewTableRowOverlay) {
      previewInsertSteps.push(
        buildTilesTableInsert(
          TILE_NUMS.map((n) => overlay01Key(n)),
          "overlay-01",
        ),
      );
    }
    if (calibrationEnabled && recipeConfig.addToPreviewTableRowPost) {
      previewInsertSteps.push(
        buildTilesTableInsert(LAYOUT02_ORDER, "layout-02"),
      );
    }

    if (recipeConfig.addToPreviewTableRowPanorama) {
      const markdownCompositionRow =
        `|![Composition preview](../${recipeConfig.generatedImagePath}/${filePrefixes.compPreviewImage}.${ext})|`;
      const markdownCompositionLabelRow =
        `|${filePrefixes.compPreviewImage}.${ext}|`;

      previewInsertSteps.unshift({
        title: `Insert preview compositions table row (sample ${sampleIdx})`,
        taskId: "markdown.insert",
        arguments: {
          file: previewTableFullPath,
          marker: recipeConfig.previewCompositionMarker,
          content: [markdownCompositionRow, markdownCompositionLabelRow].join("\n"),
          position: "after",
        },
      });
    }

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

    const sampleSteps: Step[] = [
      stepMaster,
      ...LAYOUT01_ORDER.map((k) => layout01Steps.get(k)!),
      ...overlaySteps,
      ...BRIDGE_COMPOSITIONS.map((bc) => bridgeSteps.get(bc.key)!),
      ...LAYOUT02_ORDER.map((k) => layout02Steps.get(k)!),
      stepCompPreviewGenerate,
      ...previewInsertSteps,
    ];

    allSteps.push(...sampleSteps);

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
