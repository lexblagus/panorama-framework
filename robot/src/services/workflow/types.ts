import type { BuildCommandResult } from "../../types/builder.js";
import type { RunnerResult } from "../../types/runner.js";
import type { ServiceBaseOptions } from "../base/index.js";

export type RunRecipeArgs =
  | {
      recipeId: string;
      mode: "build" | "exec";
    }
  | {
      mode: "run" | "resume";
      planId: string;
    };

export interface WorkflowServiceOptions extends ServiceBaseOptions {
  recipesRoot: string;
  buildCommand: (input: {
    recipeId: string;
    repoRootFolder?: string;
    robotPackageFolder?: string;
    recipesRoot?: string;
  }) => Promise<BuildCommandResult>;
  runPlanFromStart: (input: {
    planId: string;
    repoRootFolder?: string;
    robotPackageFolder?: string;
    recipesRoot?: string;
  }) => Promise<RunnerResult>;
  resumePlan: (input: {
    planId: string;
    repoRootFolder?: string;
    robotPackageFolder?: string;
    recipesRoot?: string;
  }) => Promise<RunnerResult>;
}

export type WorkflowResult = BuildCommandResult | RunnerResult;
