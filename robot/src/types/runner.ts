export interface RunFromStartInput {
  planId: string;
}

export interface ResumeInput {
  planId: string;
}

export interface RunnerResult {
  scaffold: true;
  command: "run" | "resume";
  planId: string;
}
