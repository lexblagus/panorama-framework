import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

function ensureValidId(kind: "recipeId" | "planId", value: string): string {
  if (value.startsWith("/") || value.endsWith("/") || value.includes("//")) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  if (path.isAbsolute(value)) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  const segments = value.split("/");
  if (segments.length === 0) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  for (const segment of segments) {
    if (
      segment.length === 0 ||
      segment === "." ||
      segment === ".." ||
      !ID_SEGMENT_PATTERN.test(segment)
    ) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
  }
  return value;
}

function stripKnownExtension(identifier: string): string {
  if (identifier.endsWith(".ts")) {
    return identifier.slice(0, -3);
  }
  if (identifier.endsWith(".js")) {
    return identifier.slice(0, -3);
  }
  if (identifier.endsWith(".mjs")) {
    return identifier.slice(0, -4);
  }
  return identifier;
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
        recipeId: stripKnownExtension(recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, `${recipeId}.js`),
        recipeId: stripKnownExtension(recipeId),
      },
      {
        recipeFilePath: path.join(authoredRoot, `${recipeId}.mjs`),
        recipeId: stripKnownExtension(recipeId),
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
      recipeId: stripKnownExtension(recipeId),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, `${recipeId}.mjs`),
      recipeId: stripKnownExtension(recipeId),
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

function stepToTask(step: Recipe["steps"][number]): Task {
  return {
    taskId: step.taskId,
    title: step.title,
    description: step.description,
    arguments: step.arguments,
    state: "waiting",
  };
}

async function loadRecipeFromModule(
  resolution: RecipeResolution,
  context: BuildRecipeContext,
): Promise<Recipe> {
  const moduleUrl = pathToFileURL(resolution.recipeFilePath).href;
  const imported = (await import(moduleUrl)) as RecipeModule;

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

function buildPlan(recipeId: string, recipe: Recipe): Plan {
  return {
    recipeId,
    createdAt: new Date().toISOString(),
    tasks: recipe.steps.map(stepToTask),
  };
}

export async function buildCommand(
  input: BuildCommandInput,
): Promise<BuildCommandResult> {
  ensureValidId("recipeId", input.recipeId);
  const paths = resolveBuilderPaths(input);

  const resolution = await resolveRecipeFile(input.recipeId, paths);
  ensureValidId("recipeId", resolution.recipeId);

  const json = new JsonService({
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
  });
  const markdown = new MarkdownService({
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
  });
  const image = new ImageService({
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
  });
  const openai = new OpenAIService({
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
  });
  const workflow = new WorkflowService({
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
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

  const planId = resolution.recipeId;
  ensureValidId("planId", planId);
  const plan = buildPlan(resolution.recipeId, recipe);
  await json.writePlan(planId, plan);

  return {
    command: "build",
    recipeId: resolution.recipeId,
    planId,
    recipeFile: resolution.recipeFilePath,
    taskCount: plan.tasks.length,
  };
}
