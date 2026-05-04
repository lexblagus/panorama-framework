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

export async function runPlanFromStart(
  input: RunFromStartInput,
): Promise<RunnerResult> {
  return {
    scaffold: true,
    command: "run",
    planId: input.planId,
  };
}

export async function resumePlan(input: ResumeInput): Promise<RunnerResult> {
  return {
    scaffold: true,
    command: "resume",
    planId: input.planId,
  };
}

