import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JsonService } from "./services/json/index.js";
import { MarkdownService } from "./services/markdown/index.js";
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

const ID_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

function ensureValidId(kind: "recipeId" | "planId", value: string): string {
  if (!ID_PATTERN.test(value)) {
    throw new Error(`Invalid ${kind}: "${value}"`);
  }
  return value;
}

function resolveBuilderPaths(input: BuildCommandInput): BuilderPaths {
  const robotRootFromSource = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const normalizedRobotRoot = input.robotRoot ?? robotRootFromSource;
  const robotRoot = path.resolve(normalizedRobotRoot);
  const repoRoot = path.resolve(input.repoRoot ?? path.join(robotRoot, ".."));
  const recipesRoot = path.resolve(input.recipesRoot ?? path.join(robotRoot, "src", "recipes"));

  return {
    repoRoot,
    robotRoot,
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
  const explicitCandidates = [
    {
      recipeFilePath: path.join(paths.recipesRoot, `${recipeId}.ts`),
      recipeId: path.basename(recipeId, ".ts"),
    },
    {
      recipeFilePath: path.join(paths.recipesRoot, `${recipeId}.js`),
      recipeId: path.basename(recipeId, ".js"),
    },
    {
      recipeFilePath: path.join(paths.recipesRoot, `${recipeId}.mjs`),
      recipeId: path.basename(recipeId, ".mjs"),
    },
    {
      recipeFilePath: path.join(paths.recipesRoot, recipeId, "index.ts"),
      recipeId: path.basename(recipeId),
      folderPath: path.join(paths.recipesRoot, recipeId),
    },
    {
      recipeFilePath: path.join(paths.recipesRoot, recipeId, "index.js"),
      recipeId: path.basename(recipeId),
      folderPath: path.join(paths.recipesRoot, recipeId),
    },
    {
      recipeFilePath: path.join(paths.recipesRoot, recipeId, "index.mjs"),
      recipeId: path.basename(recipeId),
      folderPath: path.join(paths.recipesRoot, recipeId),
    },
  ];

  for (const candidate of explicitCandidates) {
    if (await fileExists(candidate.recipeFilePath)) {
      return candidate;
    }
  }

  const distRecipesRoot = path.join(paths.robotRoot, "dist", "recipes");
  const distCandidates: RecipeResolution[] = [
    {
      recipeFilePath: path.join(distRecipesRoot, `${recipeId}.js`),
      recipeId: path.basename(recipeId, ".js"),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, `${recipeId}.mjs`),
      recipeId: path.basename(recipeId, ".mjs"),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, recipeId, "index.js"),
      recipeId: path.basename(recipeId),
      folderPath: path.join(distRecipesRoot, recipeId),
    },
    {
      recipeFilePath: path.join(distRecipesRoot, recipeId, "index.mjs"),
      recipeId: path.basename(recipeId),
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
    paths.robotRoot,
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
    repoRoot: paths.repoRoot,
    robotRoot: paths.robotRoot,
  });
  const markdown = new MarkdownService({
    repoRoot: paths.repoRoot,
    robotRoot: paths.robotRoot,
  });

  const recipeConfig = await loadOptionalRecipeConfig(resolution, paths);
  const recipe = await loadRecipeFromModule(resolution, {
    recipeId: resolution.recipeId,
    repoRoot: paths.repoRoot,
    robotRoot: paths.robotRoot,
    recipeConfig,
    services: {
      json,
      markdown,
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
