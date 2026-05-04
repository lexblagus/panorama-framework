import type { BuildCommandResult } from "../../types/builder.js";
import type { RunnerResult } from "../../types/runner.js";

export type RunRecipeArgs =
  | {
      recipeId: string;
      mode: "build" | "exec";
    }
  | {
      mode: "run" | "resume";
      planId: string;
    };

export interface WorkflowServiceOptions {
  repoRoot: string;
  robotRoot: string;
  recipesRoot: string;
  buildCommand: (input: {
    recipeId: string;
    repoRoot?: string;
    robotRoot?: string;
    recipesRoot?: string;
  }) => Promise<BuildCommandResult>;
  runPlanFromStart: (input: {
    planId: string;
    repoRoot?: string;
    robotRoot?: string;
    recipesRoot?: string;
  }) => Promise<RunnerResult>;
  resumePlan: (input: {
    planId: string;
    repoRoot?: string;
    robotRoot?: string;
    recipesRoot?: string;
  }) => Promise<RunnerResult>;
}

export type WorkflowResult = BuildCommandResult | RunnerResult;
