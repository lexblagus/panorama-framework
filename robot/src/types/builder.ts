import type { JsonService } from "../services/json/index.js";
import type { MarkdownService } from "../services/markdown/index.js";
import type { ImageService } from "../services/image/index.js";
import type { OpenAIService } from "../services/openai/index.js";
import type { WorkflowService } from "../services/workflow/index.js";
import type { Recipe } from "./recipe.js";

/** Resolved absolute paths used throughout the build pipeline. */
export interface BuilderPaths {
  repoRootFolder: string;
  robotPackageFolder: string;
  recipesRoot: string;
}

/**
 * Context object passed to `buildRecipe` when a recipe uses the dynamic factory form.
 * Provides resolved paths, the optional recipe config, and all service instances.
 */
export interface BuildRecipeContext {
  recipeId: string;
  repoRootFolder: string;
  robotPackageFolder: string;
  recipeConfig: Record<string, unknown> | null;
  services: {
    json: JsonService;
    markdown: MarkdownService;
    image: ImageService;
    openai: OpenAIService;
    workflow: WorkflowService;
  };
}

/**
 * Shape of a dynamically imported recipe module; the builder checks each export form in
 * priority order: `buildRecipe` > `default` (function) > `default` (object) > `recipe`.
 */
export interface RecipeModule {
  default?: Recipe | ((context: BuildRecipeContext) => Recipe | Promise<Recipe>);
  recipe?: Recipe;
  buildRecipe?: (context: BuildRecipeContext) => Recipe | Promise<Recipe>;
}

/** Resolved location of a recipe file on disk. */
export interface RecipeResolution {
  recipeId: string;
  recipeFilePath: string;
  folderPath?: string;
}

/** Input to the `build` command; paths default to conventional locations relative to the package root. */
export interface BuildCommandInput {
  recipeId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

/** Summary returned after a successful `build` command. */
export interface BuildCommandResult {
  command: "build";
  recipeId: string;
  planId: string;
  recipeFile: string;
  taskCount: number;
}
