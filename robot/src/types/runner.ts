export interface RunFromStartInput {
  planId: string;
  repoRoot?: string;
  robotRoot?: string;
  recipesRoot?: string;
}

export interface ResumeInput {
  planId: string;
  repoRoot?: string;
  robotRoot?: string;
  recipesRoot?: string;
}

export interface RunnerResult {
  command: "run" | "resume";
  planId: string;
  taskCount: number;
  completedTaskCount: number;
}
