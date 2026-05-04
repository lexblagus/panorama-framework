export interface RunFromStartInput {
  planId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

export interface ResumeInput {
  planId: string;
  repoRootFolder?: string;
  robotPackageFolder?: string;
  recipesRoot?: string;
}

export interface RunnerResult {
  command: "run" | "resume";
  planId: string;
  taskCount: number;
  completedTaskCount: number;
}
