import type { JsonService } from "../services/json/index.js";
import type { MarkdownService } from "../services/markdown/index.js";
import type { Recipe } from "./recipe.js";

export interface BuilderPaths {
  repoRoot: string;
  robotRoot: string;
  recipesRoot: string;
}

export interface BuildRecipeContext {
  recipeId: string;
  repoRoot: string;
  robotRoot: string;
  recipeConfig: Record<string, unknown> | null;
  services: {
    json: JsonService;
    markdown: MarkdownService;
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
  repoRoot?: string;
  robotRoot?: string;
  recipesRoot?: string;
}

export interface BuildCommandResult {
  command: "build";
  recipeId: string;
  planId: string;
  recipeFile: string;
  taskCount: number;
}
