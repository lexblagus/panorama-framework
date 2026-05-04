import type {
  ResumeInput,
  RunnerResult,
  RunFromStartInput,
} from "./types/runner.js";

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
