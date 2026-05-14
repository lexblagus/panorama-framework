import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Log from "./utils/log.js";
import { ensureValidId } from "./utils/shared.js";
import { JsonService } from "./services/json/index.js";
import { MarkdownService } from "./services/markdown/index.js";
import { ImageService } from "./services/image/index.js";
import { OpenAIService } from "./services/openai/index.js";
import { WorkflowService } from "./services/workflow/index.js";
import type {
  BuildCommandInput,
  BuildCommandResult,
  BuildRecipeContext,
  BuilderPaths,
  RecipeModule,
  RecipeResolution,
} from "./types/builder.js";
import type { Plan } from "./types/plan.js";
import type { Recipe } from "./types/recipe.js";
import type { Task } from "./types/task.js";

const RECIPE_LOAD_TIMEOUT_MS = 30_000;

/** Strips a `.ts`, `.mjs`, or `.js` extension from a recipe filename to derive its canonical ID. */
function fileIdFromInput(input: string): string {
  return input.replace(/\.(ts|mjs|js)$/, "");
}

function resolveBuilderPaths(input: BuildCommandInput): BuilderPaths {
  const robotPackageFolderFromSource = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const normalizedRobotPackageFolder =
    input.robotPackageFolder ?? robotPackageFolderFromSource;
  const robotPackageFolder = path.resolve(normalizedRobotPackageFolder);
  const repoRootFolder = path.resolve(
    input.repoRootFolder ?? path.join(robotPackageFolder, ".."),
  );
  const recipesRoot = path.resolve(
    input.recipesRoot ?? path.join(robotPackageFolder, "src", "recipes"),
  );

  return {
    repoRootFolder,
    robotPackageFolder,
    recipesRoot,
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Searches authored recipe roots then the compiled `dist/recipes/` directory for a matching
 * `.ts`, `.js`, or `.mjs` file (or an `index.*` inside a same-named folder).
 * @throws if no candidate file is found for `recipeId`.
 */
async function resolveRecipeFile(
  recipeId: string,
  paths: BuilderPaths,
): Promise<RecipeResolution> {
  const authoredRecipesRoots = Array.from(
    new Set([
      path.resolve(paths.recipesRoot),
      path.resolve(paths.robotPackageFolder, "recipes"),
    ]),
  );

  for (const authoredRoot of authoredRecipesRoots) {
    const explicitCandidates = [
      {
        recipeFilePath: path.join(authoredRoot, `${recipeId}.ts`),
        recipeId: fileIdFromInput(recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, `${recipeId}.js`),
        recipeId: fileIdFromInput(recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, `${recipeId}.mjs`),
        recipeId: fileIdFromInput(recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, recipeId, "index.ts"),
        recipeId,
        folderPath: path.join(authoredRoot, recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, recipeId, "index.js"),
        recipeId,
        folderPath: path.join(authoredRoot, recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, recipeId, "index.mjs"),
        recipeId,
        folderPath: path.join(authoredRoot, recipeId),
      },
    ];

    for (const candidate of explicitCandidates) {
      if (await fileExists(candidate.recipeFilePath)) {
        return candidate;
      }
    }
  }

  const distRecipesRoot = path.join(paths.robotPackageFolder, "dist", "recipes");
  const distCandidates: RecipeResolution[] = [
    {
      recipeFilePath: path.join(distRecipesRoot, `${recipeId}.js`),
      recipeId: fileIdFromInput(recipeId),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, `${recipeId}.mjs`),
      recipeId: fileIdFromInput(recipeId),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, recipeId, "index.js"),
      recipeId,
      folderPath: path.join(distRecipesRoot, recipeId),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, recipeId, "index.mjs"),
      recipeId,
      folderPath: path.join(distRecipesRoot, recipeId),
    },
  ];

  for (const candidate of distCandidates) {
    if (await fileExists(candidate.recipeFilePath)) {
      return candidate;
    }
  }

  throw new Error(`Recipe not found: "${recipeId}"`);
}

/**
 * Loads `config.json` from the recipe's folder (or the compiled `src/recipes/` counterpart),
 * returning `null` if neither file exists or the recipe is a single-file recipe with no folder.
 */
async function loadOptionalRecipeConfig(
  resolution: RecipeResolution,
  paths: BuilderPaths,
): Promise<Record<string, unknown> | null> {
  if (!resolution.folderPath) {
    return null;
  }

  const folderConfigPath = path.join(resolution.folderPath, "config.json");
  const fallbackConfigPath = path.join(
    paths.robotPackageFolder,
    "src",
    "recipes",
    resolution.recipeId,
    "config.json",
  );

  const candidates = folderConfigPath === fallbackConfigPath
    ? [folderConfigPath]
    : [folderConfigPath, fallbackConfigPath];

  for (const configPath of candidates) {
    try {
      const content = await readFile(configPath, "utf8");
      return JSON.parse(content) as Record<string, unknown>;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "ENOENT"
      ) {
        continue;
      }
      throw error;
    }
  }

  return null;
}

/** Type-asserts that `recipe` has the required `title` string and `steps` array. */
function assertRecipe(recipe: unknown, sourcePath: string): asserts recipe is Recipe {
  if (typeof recipe !== "object" || recipe === null) {
    throw new Error(`Invalid recipe export from ${sourcePath}: expected object`);
  }

  const candidate = recipe as Partial<Recipe>;
  if (typeof candidate.title !== "string" || !candidate.title.trim()) {
    throw new Error(`Invalid recipe export from ${sourcePath}: missing title`);
  }
  if (!Array.isArray(candidate.steps)) {
    throw new Error(`Invalid recipe export from ${sourcePath}: missing steps array`);
  }
}

/** Converts a recipe step into a task record with initial state `"waiting"`. */
function stepToTask(step: Recipe["steps"][number]): Task {
  return {
    taskId: step.taskId,
    title: step.title,
    description: step.description,
    arguments: step.arguments as Record<string, unknown>,
    state: "waiting",
  };
}

/**
 * Dynamically imports the recipe module and extracts the recipe value, trying export forms in
 * priority order: `buildRecipe` (async factory) > `default` (function) > `default` (object) > `recipe`.
 */
async function loadRecipeFromModule(
  resolution: RecipeResolution,
  context: BuildRecipeContext,
): Promise<Recipe> {
  const moduleUrl = pathToFileURL(resolution.recipeFilePath).href;
  const imported = await Promise.race([
    import(moduleUrl) as Promise<RecipeModule>,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Recipe module load timed out: ${moduleUrl}`)),
        RECIPE_LOAD_TIMEOUT_MS,
      ).unref(),
    ),
  ]);

  let recipeValue: unknown;
  if (typeof imported.buildRecipe === "function") {
    recipeValue = await imported.buildRecipe(context);
  } else if (typeof imported.default === "function") {
    recipeValue = await imported.default(context);
  } else if (imported.default !== undefined) {
    recipeValue = imported.default;
  } else {
    recipeValue = imported.recipe;
  }

  assertRecipe(recipeValue, resolution.recipeFilePath);
  return recipeValue;
}

/** Constructs a fresh `Plan` from a loaded recipe, stamping all tasks as `"waiting"`. */
function buildPlan(recipeId: string, recipe: Recipe): Plan {
  return {
    recipeId,
    createdAt: new Date().toISOString(),
    tasks: recipe.steps.map(stepToTask),
  };
}

/**
 * Resolves, loads, and validates a recipe, then writes the resulting plan JSON to disk.
 * This is the primary build entry point consumed by the CLI and the `WorkflowService`.
 */
export async function buildCommand(
  input: BuildCommandInput,
): Promise<BuildCommandResult> {
  const log = new Log("builder", "blue");
  const serviceLog = new Log("service", "green");

  log("info", `Building recipe "${input.recipeId}"`);

  ensureValidId("recipeId", input.recipeId);
  const paths = resolveBuilderPaths(input);
  log("debug", `Paths resolved: repo=${paths.repoRootFolder}, robot=${paths.robotPackageFolder}`);

  const resolution = await resolveRecipeFile(input.recipeId, paths);
  ensureValidId("recipeId", resolution.recipeId);
  log("info", `Recipe file found: "${resolution.recipeFilePath}"`);

  const serviceOptions = {
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
    log: serviceLog,
  };

  const json = new JsonService(serviceOptions);
  const markdown = new MarkdownService(serviceOptions);
  const image = new ImageService(serviceOptions);
  const openai = new OpenAIService(serviceOptions);
  const workflow = new WorkflowService({
    ...serviceOptions,
    recipesRoot: paths.recipesRoot,
    buildCommand,
    runPlanFromStart: async (runnerInput) => {
      const { runPlanFromStart } = await import("./runner.js");
      return runPlanFromStart(runnerInput);
    },
    resumePlan: async (runnerInput) => {
      const { resumePlan } = await import("./runner.js");
      return resumePlan(runnerInput);
    },
  });

  const recipeConfig = await loadOptionalRecipeConfig(resolution, paths);
  log("debug", recipeConfig ? "Recipe config loaded" : "No recipe config found");

  log("info", "Loading recipe module...");
  const recipe = await loadRecipeFromModule(resolution, {
    recipeId: resolution.recipeId,
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
    recipeConfig,
    services: {
      json,
      markdown,
      image,
      openai,
      workflow,
    },
  });
  log("info", `Recipe "${recipe.title}" built with ${recipe.steps.length} steps`);

  const planId = resolution.recipeId;
  ensureValidId("planId", planId);
  const plan = buildPlan(resolution.recipeId, recipe);
  await json.writePlan(planId, plan);
  log("info", `Plan "${planId}" written`);

  return {
    command: "build",
    recipeId: resolution.recipeId,
    planId,
    recipeFile: resolution.recipeFilePath,
    taskCount: plan.tasks.length,
  };
}
