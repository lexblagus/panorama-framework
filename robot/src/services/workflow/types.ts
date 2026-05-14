import type { BuildCommandResult } from "../../types/builder.js";
import type { RunnerResult } from "../../types/runner.js";
import type { ServiceBaseOptions } from "../base/index.js";

/**
 * Arguments for the `workflow.run-recipe` task; discriminated on `mode`.
 * `"build"` and `"exec"` take a `recipeId`; `"run"` and `"resume"` take a `planId`.
 */
export type RunRecipeArgs =
  | {
      recipeId: string;
      mode: "build" | "exec";
    }
  | {
      mode: "run" | "resume";
      planId: string;
    };

/**
 * Constructor options for `WorkflowService`; injects the `buildCommand` and runner functions
 * to avoid circular imports between `builder.ts` and `runner.ts`.
 */
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

/** Union of the possible results from any workflow mode (build summary or runner summary). */
export type WorkflowResult = BuildCommandResult | RunnerResult;
