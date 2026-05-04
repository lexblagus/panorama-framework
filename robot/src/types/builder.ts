import type { JsonService } from "../services/json/index.js";
import type { MarkdownService } from "../services/markdown/index.js";
import type { ImageService } from "../services/image/index.js";
import type { OpenAIService } from "../services/openai/index.js";
import type { WorkflowService } from "../services/workflow/index.js";
import type { Recipe } from "./recipe.js";

export interface BuilderPaths {
  repoRootFolder: string;
  robotPackageFolder: string;
  recipesRoot: string;
}

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

export interface RecipeModule {
  default?: Recipe | ((context: BuildRecipeContext) => Recipe | Promise<Recipe>);
  recipe?: Recipe;
  buildRecipe?: (context: BuildRecipeContext) => Recipe | Promise<Recipe>;
}

export interface RecipeResolution {
  recipeId: string;
  recipeFilePath: string;
  folderPath?: string;
}

export interface BuildCommandInput {
  recipeId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

export interface BuildCommandResult {
  command: "build";
  recipeId: string;
  planId: string;
  recipeFile: string;
  taskCount: number;
}
