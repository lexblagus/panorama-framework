import { BaseService } from "../base/index.js";
import type {
  RunRecipeArgs,
  WorkflowResult,
  WorkflowServiceOptions,
} from "./types.js";

export class WorkflowService extends BaseService {
  #options: WorkflowServiceOptions;

  constructor(options: WorkflowServiceOptions) {
    super(options);
    this.#options = options;
  }

  async runRecipe(args: RunRecipeArgs): Promise<WorkflowResult> {
    switch (args.mode) {
      case "build":
        return this.#options.buildCommand({
          recipeId: args.recipeId,
          repoRootFolder: this.#options.repoRootFolder,
          robotPackageFolder: this.#options.robotPackageFolder,
          recipesRoot: this.#options.recipesRoot,
        });
      case "exec": {
        const built = await this.#options.buildCommand({
          recipeId: args.recipeId,
          repoRootFolder: this.#options.repoRootFolder,
          robotPackageFolder: this.#options.robotPackageFolder,
          recipesRoot: this.#options.recipesRoot,
        });

        return this.#options.runPlanFromStart({
          planId: built.planId,
          repoRootFolder: this.#options.repoRootFolder,
          robotPackageFolder: this.#options.robotPackageFolder,
          recipesRoot: this.#options.recipesRoot,
        });
      }
      case "run":
        return this.#options.runPlanFromStart({
          planId: args.planId,
          repoRootFolder: this.#options.repoRootFolder,
          robotPackageFolder: this.#options.robotPackageFolder,
          recipesRoot: this.#options.recipesRoot,
        });
      case "resume":
        return this.#options.resumePlan({
          planId: args.planId,
          repoRootFolder: this.#options.repoRootFolder,
          robotPackageFolder: this.#options.robotPackageFolder,
          recipesRoot: this.#options.recipesRoot,
        });
      default: {
        const neverMode: never = args;
        throw new Error(`Unsupported workflow mode: ${JSON.stringify(neverMode)}`);
      }
    }
  }
}
