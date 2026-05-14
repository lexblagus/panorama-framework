/** Input for running a plan from scratch, resetting all prior task states. */
export interface RunFromStartInput {
  planId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

/** Input for resuming an existing plan, skipping tasks that already succeeded. */
export interface ResumeInput {
  planId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

/** Summary returned after a run or resume command completes. */
export interface RunnerResult {
  command: "run" | "resume";
  planId: string;
  taskCount: number;
  completedTaskCount: number;
}
